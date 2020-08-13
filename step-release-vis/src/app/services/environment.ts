import { Injectable } from '@angular/core';
import {Polygon} from '../models/Polygon';

// TODO(naoai): Iterate and calculate the polygons
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor() {}

  getPolygons(json: string): Polygon[] {
    // For now ignore the 'json' parameter and paste hard coded data
    return [];
  }

  private extractPoints(candsInfo: CandidateInfo[]): CandidatesSnapshot {
    return [];
  }

  // TODO(ancar): calculate the percentages for cands at given timestamp
  private getPercentages(candsInfo: CandidateInfo[]): CandidatesSnapshot {
    return [];
  }
}

type CandidatesSnapshot = CandidateSnapshot[];

class CandidateSnapshot {
  candName: string;
  percentage: number;
}

class CandidateInfo {
  name: string;
  jobCount: number;
}
