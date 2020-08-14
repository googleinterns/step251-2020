import {Injectable} from '@angular/core';
import {Polygon} from '../models/Polygon';
import {CandidateInfo, Environment} from '../models/Data';

// TODO(naoai): Iterate and calculate the polygons
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor() {
  }

  // xs: 0-100, ys: timestamps
  getPolygons(jsonFile: string): Polygon[] {
    const environments = this.readJson(jsonFile);
    return [];
  }

  private extractPoints(candsInfo: CandidateInfo[]): CandidatesSnapshot {
    return [];
  }

  // TODO(ancar): calculate the percentages for cands at given timestamp
  private getPercentages(candsInfo: CandidateInfo[]): CandidatesSnapshot {
    return [];
  }

  // TODO(andreystar): add json from file
  private readJson(jsonFile: string): Environment[] {
    const json = `[
  {
    "environment": "prod",
    "snapshots": [
      {
        "timestamp": 125,
        "cands_info": [
          {
            "name": "1",
            "job_count": 100
          },
          {
            "name": "2",
            "job_count": 1000
          },
          {
            "name": "3",
            "job_count": 900
          }
        ]
      },
      {
        "timestamp": 900,
        "cands_info": [
          {
            "name": "2",
            "job_count": 2000
          }
        ]
      }
    ]
  }
]
`;
    const envs: Environment[] = JSON.parse(json);
    return [];
  }
}

type CandidatesSnapshot = CandidateSnapshot[];

interface CandidateSnapshot {
  candName: string;
  percentage: number;
}
