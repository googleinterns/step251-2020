import {Injectable} from '@angular/core';
import {Point} from '../models/Point';
import {Polygon} from '../models/Polygon';
import {CandidateInfo, Environment} from '../models/Data';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FileService} from './file';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentService {
  constructor(private fileService: FileService) {}

  // xs: 0-100, ys: timestamps
  getPolygons(jsonFile: string): Observable<Polygon[]> {
    return this.readJson(jsonFile).pipe(
      map(environments => this.calculatePolygons(environments))
    );
  }

  // TODO(#153): compute the coordinates for the polygons
  private calculatePolygons(environments: Environment[]): Polygon[] {
    return [];
  }

  private addPointToBorderMap(
    mapToChange: Map<string, Point[]>,
    key: string,
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
    lower: Map<string, Point[]>,
    upper: Map<string, Point[]>,
    set: TimestampLowerBoundSet
  ): TimestampLowerBoundSet {
    const newSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();

    for (let i = 0; i < set.snapshot.length - 1; i++) {
      if (set.snapshot[i].position === set.snapshot[i + 1].position) {
        const name: string = set.snapshot[i].candName;
        polys.push(this.createPolygon(lower.get(name), upper.get(name), name));
      } else {
        newSet.orderMap.set(set.snapshot[i].candName, newSet.snapshot.length);
        newSet.snapshot.push(set.snapshot[i]);
      }
    }

    if (set.snapshot.length > 0) {
      const index = set.snapshot.length - 1;
      if (set.snapshot[index].position === 100) {
        const name: string = set.snapshot[index].candName;
        polys.push(this.createPolygon(lower.get(name), upper.get(name), name));
      } else {
        newSet.orderMap.set(
          set.snapshot[index].candName,
          newSet.snapshot.length
        );
        newSet.snapshot.push(set.snapshot[index]);
      }
    }

    return newSet;
  }

  private addSnapshotToPolygons(
    lower: Map<string, Point[]>,
    upper: Map<string, Point[]>,
    set: PolygonLowerBoundYPosition[],
    insertions: number,
    time: number,
    lastTime: number
  ): void {
    for (let i = set.length - insertions; i < set.length; i++) {
      this.addPointToBorderMap(lower, set[i].candName, {x: lastTime, y: 100});
      this.addPointToBorderMap(upper, set[i].candName, {x: lastTime, y: 100});
    }

    for (let i = 0; i < set.length; i++) {
      this.addPointToBorderMap(lower, set[i].candName, {
        x: time,
        y: set[i].position,
      });
      this.addPointToBorderMap(upper, set[i].candName, {
        x: time,
        y: i === set.length - 1 ? 100 : set[i + 1].position,
      });
    }
  }

  private computeNextSnapshot(
    candsInfo: CandidateInfo[],
    set: TimestampLowerBoundSet
  ): [TimestampLowerBoundSet, number] {
    const percentages = this.getPercentages(candsInfo);
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
      if (!set.orderMap.has(entry[0])) {
        // the candidate has to be introduced
        newCandidates++;
        newSet.orderMap.set(entry[0], newSet.snapshot.length);
        newSet.snapshot.push(
          new PolygonLowerBoundYPosition(entry[0], entry[1])
        );
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
      totalJobSum += candInfo.job_count;
    }

    if (totalJobSum === 0) {
      totalJobSum = 1; // avoid division by 0, all candidates will have 0% of the jobs.
    }

    for (const candInfo of candsInfo) {
      const percentage = (candInfo.job_count / totalJobSum) * 100;
      candInfo2percentage.set(candInfo.name, percentage);
    }

    return candInfo2percentage;
  }

  private readJson(jsonFile: string): Observable<Environment[]> {
    return this.fileService.readContents<Environment[]>(jsonFile);
  }
}

export class TimestampLowerBoundSet {
  /* What is the order of the polygons? */
  orderMap: Map<string, number>;
  /* Store the details about each _active_ polygon */
  snapshot: PolygonLowerBoundYPosition[];

  constructor() {
    this.orderMap = new Map();
    this.snapshot = [];
  }
}

export class PolygonLowerBoundYPosition {
  candName: string;
  position: number;

  constructor(name: string, pos: number) {
    this.candName = name;
    this.position = pos;
  }
}
