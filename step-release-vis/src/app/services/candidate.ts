import {Injectable} from '@angular/core';
import {Candidate} from '../models/Candidate';
import {Polygon} from '../models/Polygon';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  cands: Map<string, Candidate>;

  constructor() {}

  polygonHovered(polygon: Polygon): void {
    this.cands.get(polygon.candName).polygonHovered();
  }

  polygonUnhovered(polygon: Polygon): void {
    this.cands.get(polygon.candName).polygonUnhovered();
  }
}
