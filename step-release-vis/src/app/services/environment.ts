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
    return this.fileService.readContents<Environment[]>(jsonFile);
  }
}