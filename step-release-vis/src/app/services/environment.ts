import {Injectable} from '@angular/core';
import {Polygon} from '../models/Polygon';
import {CandidateInfo, Environment} from '../models/Data';
import {FileService} from './file';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

// TODO(naoai): Iterate and calculate the polygons
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

  // TODO(andreystar): remove sample data
  private calculatePolygons(environments: Environment[]): Polygon[] {
    const poly1 = new Polygon(
      [
        {x: 1594768146, y: 0},
        {x: 1594768246, y: 20},
        {x: 1594768346, y: 20},
        {x: 1594768446, y: 40},
        {x: 1594768646, y: 80},
        {x: 1594768646, y: 0},
      ]
    );
    const poly2 = new Polygon(
      [
        {x: 1594768146, y: 0},
        {x: 1594768246, y: 20},
        {x: 1594768346, y: 20},
        {x: 1594768446, y: 40},
        {x: 1594768646, y: 80},
        {x: 1594768546, y: 60},
        {x: 1594768646, y: 80},
        {x: 1594768646, y: 100},
        {x: 1594768446, y: 60},
        {x: 1594768346, y: 60},
        {x: 1594768246, y: 50},
        {x: 1594768146, y: 40},
      ]
    );
    const poly3 = new Polygon(
      [
        {x: 1594768646, y: 100},
        {x: 1594768446, y: 60},
        {x: 1594768346, y: 60},
        {x: 1594768246, y: 50},
        {x: 1594768146, y: 40},
        {x: 1594768146, y: 80},
        {x: 1594768446, y: 100},
      ]
    );
    const poly4 = new Polygon(
      [
        {x: 1594768146, y: 100},
        {x: 1594768146, y: 80},
        {x: 1594768446, y: 100},
      ]
    );
    return [poly1, poly2, poly3, poly4];
  }

  private extractPoints(candsInfo: CandidateInfo[]): CandidatesSnapshot {
    return [];
  }

  // TODO(ancar): calculate the percentages for cands at given timestamp
  private getPercentages(candsInfo: CandidateInfo[]): CandidatesSnapshot {
    return [];
  }

  private readJson(jsonFile: string): Observable<Environment[]> {
    return this.fileService.fileToString<Environment[]>(jsonFile);
  }
}

type CandidatesSnapshot = CandidateSnapshot[];

interface CandidateSnapshot {
  candName: string;
  percentage: number;
}
