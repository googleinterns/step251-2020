import {Injectable} from '@angular/core';
import {Polygon} from '../models/Polygon';
import {Point} from '../models/Point';
import {CandidateInfo, Environment} from '../models/Data';
import {FileService} from './file';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor(private fileService: FileService) {
  }

  // xs: 0-100, ys: timestamps
  getPolygons(jsonFile: string): Observable<Polygon[]> {
    return this.readJson(jsonFile)
      .pipe(map(environments => this.calculatePolygons(environments)));
  }

  private calculatePolygons(environments: Environment[]): Polygon[] {
    const polys: Polygon[] = [];

    // Assume there is only one environment
    // Assume for now a candidate appears only once per environment (solution: give the polygons ids)

    for (const environment of environments) {
      let newTimestampUpperBoundSet: TimestampUpperBoundSet = new TimestampUpperBoundSet();
      let lastTimestampUpperBoundSet: TimestampUpperBoundSet = new TimestampUpperBoundSet();
      const lowerBounds: Map<string, Point[]> = new Map(); // both upper and lower bounds will contain the leftmost / rightmost point
      const upperBounds: Map<string, Point[]> = new Map();
      let lastTimeStamp = 0;

      for (const snapshot of environment.snapshots) {
        const update: [TimestampUpperBoundSet, number] = this.insertAndAdjustPoints(snapshot.cands_info, lastTimestampUpperBoundSet);
        newTimestampUpperBoundSet = update[0];
        this.addSnapshotToPolygons(lowerBounds, upperBounds, newTimestampUpperBoundSet.snapshot,
          update[1], snapshot.timestamp, lastTimeStamp);

        lastTimestampUpperBoundSet = this.closePolygons(polys, lowerBounds, upperBounds,
          newTimestampUpperBoundSet); // delete inexisting ones
        lastTimeStamp = snapshot.timestamp;
      }

      // draw the vertical line and add remaining polys
      for (const candidate of lastTimestampUpperBoundSet.snapshot) {
        const name: string = candidate.candName;
        this.addToMap(lowerBounds, name, {x: lastTimeStamp, y: candidate.position});
        polys.push(this.createPolygon(lowerBounds.get(name), upperBounds.get(name)));
      }
    }

    this.printPolys(polys);
    return polys;
  }

  private printPolys(v: Polygon[]): void {
    console.log('These are the final polygons:');
    for (const x of v) {
      console.log('-----');
      for (const point of x.points) {
        console.log(point.x, point.y);
      }
    }
  }

  private addToMap(mapToChange: Map<string, Point[]>, key: string, point: Point): void {
    let prev: Point[] = [];
    if (mapToChange.has(key)) {
      prev = mapToChange.get(key);
    }

    const curr: Point[] = prev;
    curr.push(point);
    mapToChange.set(key, curr);
  }

  private addSnapshotToPolygons(lower: Map<string, Point[]>, upper: Map<string, Point[]>,
                                set: PolygonUpperBoundYPosition[], insertions: number,
                                time: number, lastTime: number): void {
    for (let i = set.length - insertions; i < set.length; i++) {
      this.addToMap(lower, set[i].candName, {x: lastTime, y: 0});
      this.addToMap(upper, set[i].candName, {x: lastTime, y: 0});
    }

    for (let i = 0; i < set.length; i++) {
      this.addToMap(upper, set[i].candName, {x: time, y: set[i].position});
      this.addToMap(lower, set[i].candName, {x: time, y: ((i === 0) ? 0 : set[i - 1].position)});
    }
  }

  private createPolygon(lower: Point[], upper: Point[]): Polygon {
    const points: Point[] = [];
    for (const point of lower) {
      points.push(point);
    }
    points.pop();

    const revUpper = upper.reverse();
    for (const point of revUpper) {
      points.push(point);
    }
    points.pop();

    return new Polygon(points);
  }

  private closePolygons(polys: Polygon[], lower: Map<string, Point[]>,
                        upper: Map<string, Point[]>, set: TimestampUpperBoundSet): TimestampUpperBoundSet {
    const newSet: TimestampUpperBoundSet = new TimestampUpperBoundSet();

    for (let i = 0; i < set.snapshot.length; i++) {
      if (set.snapshot[i].position === ((i === 0) ? 0 : set.snapshot[i - 1].position)) {
        const name: string = set.snapshot[i].candName;
        polys.push(this.createPolygon(lower.get(name), upper.get(name)));
      } else {
        newSet.orderMap.set(set.snapshot[i].candName, newSet.snapshot.length);
        newSet.snapshot.push(set.snapshot[i]);
      }
    }

    return newSet;
  }

  private insertAndAdjustPoints(candsInfo: CandidateInfo[], set: TimestampUpperBoundSet): [TimestampUpperBoundSet, number] {
    const percentages = this.getPercentages(candsInfo);
    const newSet: TimestampUpperBoundSet = set;

    for (let i = 0; i < set.snapshot.length; i++) {
      if (percentages.has(set.snapshot[i].candName)) { // still exists
        newSet.snapshot[i].position = percentages.get(set.snapshot[i].candName);
      } else { // will be erased
        newSet.snapshot[i].position = 0;
      }
    }

    let newCandidates = 0;
    for (const entry of percentages.entries()) {
      if (!set.orderMap.has(entry[0])) { // the candidate has to be introduced
        newCandidates++;
        newSet.orderMap.set(entry[0], newSet.snapshot.length);
        newSet.snapshot.push(new PolygonUpperBoundYPosition(entry[0], entry[1]));
      }
    }

    let sum = 0;
    for (const candidate of newSet.snapshot) {
      sum += candidate.position;
      candidate.position = sum;
    }
    return [newSet, newCandidates];
  }

  private getPercentages(candsInfo: CandidateInfo[]): Map<string, number> {
    const candInfo2percentage: Map<string, number> = new Map();
    let totalJobSum = 0;

    for (const candInfo of candsInfo) {
      totalJobSum += candInfo.job_count;
    }

    let percentageSum = 0;
    for (const candInfo of candsInfo) {
      const percentage = Math.floor(candInfo.job_count / totalJobSum * 100);
      candInfo2percentage.set(candInfo.name, percentage);
      percentageSum += percentage;
    }

    // treat rounding error here
    const prevValue = candInfo2percentage.get(candsInfo[0].name);
    candInfo2percentage.set(candsInfo[0].name, prevValue + 100 - percentageSum);
    return candInfo2percentage;
  }

  private readJson(jsonFile: string): Observable<Environment[]> {
    return this.fileService.fileToString<Environment[]>(jsonFile);
  }
}

class TimestampUpperBoundSet {
  /* What is the order of the polygons? */
  orderMap: Map<string, number>;
  /* Store the details about each _active_ polygon */
  snapshot: PolygonUpperBoundYPosition[];

  constructor() {
    this.orderMap = new Map();
    this.snapshot = [];
  }
}

class PolygonUpperBoundYPosition {
  candName: string;
  position: number;

  constructor(name: string, pos: number) {
    this.candName = name;
    this.position = pos;
  }
}
