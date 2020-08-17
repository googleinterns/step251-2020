import {Injectable} from '@angular/core';
import {Polygon} from '../models/Polygon';
import {CandidateInfo, Environment} from '../models/Data';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {FileService} from './file';

// TODO(naoai): Iterate and calculate the polygons
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor(private fileService: FileService) {
  }

  // xs: 0-100, ys: timestamps
  // TODO(naoai): write test
  getPolygons(jsonFile: string): Observable<Polygon[]> {
    return this.readJson(jsonFile)
      .pipe(map(environments => this.calculatePolygons(environments)));
  }

  private calculatePolygons(environments: Environment[]): Polygon[] {
    return [];
  }

  private extractPoints(candsInfo: CandidateInfo[]): CandidatesSnapshot {
    return [];
  }

  // TODO(ancar): calculate the percentages for cands at given timestamp
  private getPercentages(candsInfo: CandidateInfo[]): CandidatesSnapshot {
    return [];
  }

  private readJson(jsonFile: string): Observable<Environment[]> {
    return this.fileService.readContents<Environment[]>(jsonFile);
  }
}

type CandidatesSnapshot = CandidateSnapshot[];

interface CandidateSnapshot {
  candName: string;
  percentage: number;
}
