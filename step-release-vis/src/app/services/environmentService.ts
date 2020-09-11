import {Injectable} from '@angular/core';
import {Point} from '../models/Point';
import {Polygon} from '../models/Polygon';
import {CandidateInfo, Snapshot} from '../models/Data';
import {Observable, of} from 'rxjs';
import {CandidateEdge} from './coloringService';
import {TimelinePoint} from '../models/TimelinePoint';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  BEGINNING: number;
  /* Edges stores the number of points shared by candidates, DTI: edges[(x,y).toKey] = edges[(x,y).toKey] */
  edges: Map<string, number> = new Map();

  constructor() {
    this.BEGINNING = -1;
  }

  // xs: 0-100, ys: timestamps
  getPolygons(snapshots: Snapshot[]): Observable<Polygon[]> {
    return of(this.removeCollinearPoints(this.calculatePolygons(snapshots)));
  }

  private calculatePolygons(snapshots: Snapshot[]): Polygon[] {
    this.edges.clear();
    const polys: Polygon[] = [];
    let numberOfPolygons = 0;

    let newTimestampLowerBoundSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
    let lastTimestampLowerBoundSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
    const lowerBounds: Map<number, Point[]> = new Map(); // both upper and lower bounds will contain the leftmost / rightmost point
    const upperBounds: Map<number, Point[]> = new Map();
    const nameToActiveId: Map<string, number> = new Map();
    let lastTimeStamp = this.BEGINNING;

    for (const snapshot of snapshots) {
      const update: [TimestampLowerBoundSet, number] = this.computeNextSnapshot(
        snapshot.candidatesList,
        lastTimestampLowerBoundSet,
        nameToActiveId,
        numberOfPolygons
      );
      newTimestampLowerBoundSet = update[0];
      numberOfPolygons += update[1];

      this.addSnapshotToPolygons(
        lowerBounds,
        upperBounds,
        newTimestampLowerBoundSet.snapshot,
        update[1],
        snapshot.timestamp.seconds,
        lastTimeStamp
      );

      this.addEdgesForSnapshot(newTimestampLowerBoundSet);

      lastTimestampLowerBoundSet = this.closePolygons(
        polys,
        lowerBounds,
        upperBounds,
        newTimestampLowerBoundSet,
        nameToActiveId
      ); // delete inexisting ones
      lastTimeStamp = snapshot.timestamp.seconds;
    }

    // draw the vertical line and add remaining polys
    for (const candidate of lastTimestampLowerBoundSet.snapshot) {
      const id: number = candidate.polygonId;
      this.addPointToBorderMap(upperBounds, id, {
        x: lastTimeStamp,
        y: candidate.position,
      });
      polys.push(
        this.createPolygon(
          lowerBounds.get(id),
          upperBounds.get(id),
          candidate.candName
        )
      );
    }

    return polys;
  }

  private triangleArea(a: Point, b: Point, c: Point): number {
    return Math.abs(
      (a.x * b.y - b.x * a.y + b.x * c.y - c.x * b.y + c.x * a.y - a.x * c.y) /
        2
    );
  }

  /* Remove mid-edge points for efficency concerns. */
  private compressPoly(poly: Polygon): Polygon {
    const pointStack: Point[] = [];

    for (const point of poly.points) {
      while (
        pointStack.length >= 2 &&
        this.triangleArea(
          point,
          pointStack[pointStack.length - 1],
          pointStack[pointStack.length - 2]
        ) === 0
      ) {
        pointStack.pop();
      }

      pointStack.push(point);
    }

    return new Polygon(pointStack, poly.candName);
  }

  private removeCollinearPoints(polys: Polygon[]): Polygon[] {
    return polys.map(poly => this.compressPoly(poly));
  }

  private incrementNoOfEdges(cand1: string, cand2: string): void {
    let prevValue = 0;
    const key = new CandidateEdge(cand1, cand2).toKey();
    if (this.edges.has(key) === true) {
      prevValue = this.edges.get(key);
    }

    this.edges.set(key, prevValue + 1);
  }

  private addEdgesForSnapshot(
    timestampLowerBoundSet: TimestampLowerBoundSet
  ): void {
    let prevPoly: PolygonLowerBoundYPosition;
    for (const poly of timestampLowerBoundSet.snapshot) {
      if (prevPoly !== undefined) {
        this.incrementNoOfEdges(prevPoly.candName, poly.candName);
        this.incrementNoOfEdges(poly.candName, prevPoly.candName);
      }
      prevPoly = poly;
    }
  }

  private addPointToBorderMap(
    mapToChange: Map<number, Point[]>,
    key: number,
    point: Point
  ): void {
    let prev: Point[] = [];
    if (mapToChange.has(key)) {
      prev = mapToChange.get(key);
    }

    const curr: Point[] = prev;
    curr.push(point);
    mapToChange.set(key, curr);
  }

  private createPolygon(
    lowerBound: Point[],
    upperBound: Point[],
    candidate: string
  ): Polygon {
    const revUpperBound = upperBound.slice().reverse();
    const points: Point[] = [];

    if (lowerBound[0].x === this.BEGINNING) {
      // this polygon starts from the beginning
      for (let i = 1; i < lowerBound.length; i++) {
        points.push(lowerBound[i]);
      }
      for (let i = 1; i < revUpperBound.length - 1; i++) {
        points.push(revUpperBound[i]);
      }
    } else {
      for (const point of lowerBound) {
        points.push(point);
      }
      points.pop();

      for (const point of revUpperBound) {
        points.push(point);
      }
      points.pop();
    }

    return new Polygon(points, candidate);
  }

  private closePolygons(
    polys: Polygon[],
    lower: Map<number, Point[]>,
    upper: Map<number, Point[]>,
    set: TimestampLowerBoundSet,
    nameToId: Map<string, number>
  ): TimestampLowerBoundSet {
    const newSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();

    for (let i = 0; i < set.snapshot.length - 1; i++) {
      if (set.snapshot[i].position === set.snapshot[i + 1].position) {
        const id: number = set.snapshot[i].polygonId;
        polys.push(
          this.createPolygon(
            lower.get(id),
            upper.get(id),
            set.snapshot[i].candName
          )
        );
        nameToId.delete(set.snapshot[i].candName);
      } else {
        newSet.orderMap.set(set.snapshot[i].polygonId, newSet.snapshot.length);
        newSet.snapshot.push(set.snapshot[i]);
      }
    }

    if (set.snapshot.length > 0) {
      const index = set.snapshot.length - 1;
      if (set.snapshot[index].position === 100) {
        const id: number = set.snapshot[index].polygonId;
        polys.push(
          this.createPolygon(
            lower.get(id),
            upper.get(id),
            set.snapshot[index].candName
          )
        );
        nameToId.delete(set.snapshot[index].candName);
      } else {
        newSet.orderMap.set(
          set.snapshot[index].polygonId,
          newSet.snapshot.length
        );
        newSet.snapshot.push(set.snapshot[index]);
      }
    }

    return newSet;
  }

  private addSnapshotToPolygons(
    lower: Map<number, Point[]>,
    upper: Map<number, Point[]>,
    set: PolygonLowerBoundYPosition[],
    insertions: number,
    time: number,
    lastTime: number
  ): void {
    for (let i = set.length - insertions; i < set.length; i++) {
      this.addPointToBorderMap(lower, set[i].polygonId, {x: lastTime, y: 100});
      this.addPointToBorderMap(upper, set[i].polygonId, {x: lastTime, y: 100});
    }

    for (let i = 0; i < set.length; i++) {
      this.addPointToBorderMap(lower, set[i].polygonId, {
        x: time,
        y: set[i].position,
      });
      this.addPointToBorderMap(upper, set[i].polygonId, {
        x: time,
        y: i === set.length - 1 ? 100 : set[i + 1].position,
      });
    }
  }

  private computeNextSnapshot(
    candsInfo: CandidateInfo[],
    set: TimestampLowerBoundSet,
    nameToId: Map<string, number>,
    numberOfPolygons: number
  ): [TimestampLowerBoundSet, number] {
    const percentages: Map<string, number> = this.getPercentages(candsInfo);
    const newSet: TimestampLowerBoundSet = set;

    for (let i = 0; i < set.snapshot.length; i++) {
      if (percentages.has(set.snapshot[i].candName)) {
        // still exists
        newSet.snapshot[i].position = percentages.get(set.snapshot[i].candName);
      } else {
        // will be erased
        newSet.snapshot[i].position = 0;
      }
    }

    let newCandidates = 0;
    for (const entry of percentages.entries()) {
      if (!nameToId.has(entry[0])) {
        // the candidate has to be introduced
        nameToId.set(entry[0], numberOfPolygons);
        newSet.orderMap.set(numberOfPolygons, newSet.snapshot.length);
        newSet.snapshot.push(
          new PolygonLowerBoundYPosition(entry[0], numberOfPolygons, entry[1])
        );
        numberOfPolygons++;
        newCandidates++;
      }
    }

    // if all candidates have 0 jobs they should all point at 100
    let currentPosition = 100;
    for (let i = newSet.snapshot.length - 1; i >= 0; i--) {
      currentPosition -= newSet.snapshot[i].position;
      newSet.snapshot[i].position = currentPosition;
    }
    return [newSet, newCandidates];
  }

  private getPercentages(candsInfo: CandidateInfo[]): Map<string, number> {
    const candInfo2percentage: Map<string, number> = new Map();
    let totalJobSum = 0;

    for (const candInfo of candsInfo) {
      totalJobSum += candInfo.jobCount;
    }

    if (totalJobSum === 0) {
      totalJobSum = 1; // avoid division by 0, all candidates will have 0% of the jobs.
    }

    for (const candInfo of candsInfo) {
      const percentage = (candInfo.jobCount / totalJobSum) * 100;
      candInfo2percentage.set(candInfo.candidate, percentage);
    }

    return candInfo2percentage;
  }

  getTimelinePointTextAlignment(
    index: number,
    timelinePoints: TimelinePoint[]
  ): string {
    if (index === 0) {
      return 'start';
    } else if (index === timelinePoints.length - 1) {
      return 'end';
    }
    return 'middle';
  }
}

export class TimestampLowerBoundSet {
  /* What is the order of the polygons? polygonId -> index */
  orderMap: Map<number, number>;
  /* Store the details about each _active_ polygon */
  snapshot: PolygonLowerBoundYPosition[];

  constructor() {
    this.orderMap = new Map();
    this.snapshot = [];
  }
}

export class PolygonLowerBoundYPosition {
  candName: string;
  polygonId: number;
  position: number;

  constructor(name: string, id: number, pos: number) {
    this.candName = name;
    this.polygonId = id;
    this.position = pos;
  }
}
