import {Injectable} from '@angular/core';
import {Polygon} from '../models/Polygon';
import {CandidateInfo, Environment} from '../models/Data';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FileService} from './file';

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

  // TODO(naoai): compute the coordinates for the polygons
  private calculatePolygons(environments: Environment[]): Polygon[] {
    return [];
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

    for (const candInfo of candsInfo) {
      const percentage = candInfo.job_count / totalJobSum * 100;
      candInfo2percentage.set(candInfo.name, percentage);
    }

    return candInfo2percentage;
  }

  private readJson(jsonFile: string): Observable<Environment[]> {
    return this.fileService.readContents<Environment[]>(jsonFile);
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
