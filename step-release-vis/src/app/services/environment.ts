import {Injectable} from '@angular/core';
import {Point} from '../models/Point';
import {Polygon} from '../models/Polygon';
import {CandidateInfo, Environment} from '../models/Data';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  constructor() {}

  // xs: 0-100, ys: timestamps
  getPolygons(environment: Environment): Observable<Polygon[]> {
    return of(this.calculatePolygons(environment));
  }

  private calculatePolygons(environment: Environment): Polygon[] {
    const polys: Polygon[] = [];
    let numberOfPolygons = 0;

    // TODO(#166): change the beginning of the display.

    let newTimestampLowerBoundSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
    let lastTimestampLowerBoundSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
    const lowerBounds: Map<number, Point[]> = new Map(); // both upper and lower bounds will contain the leftmost / rightmost point
    const upperBounds: Map<number, Point[]> = new Map();
    const nameToActiveId: Map<string, number> = new Map();
    let lastTimeStamp = 0;

    for (const snapshot of environment.snapshots) {
      const update: [TimestampLowerBoundSet, number] = this.computeNextSnapshot(
        snapshot.candsInfo,
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
        snapshot.timestamp,
        lastTimeStamp
      );

      lastTimestampLowerBoundSet = this.closePolygons(
        polys,
        lowerBounds,
        upperBounds,
        newTimestampLowerBoundSet,
        nameToActiveId
      ); // delete inexisting ones
      lastTimeStamp = snapshot.timestamp;
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
    const points: Point[] = [];
    for (const point of lowerBound) {
      points.push(point);
    }
    points.pop();

    const revUpperBound = upperBound.reverse();
    for (const point of upperBound) {
      points.push(point);
    }
    points.pop();

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
