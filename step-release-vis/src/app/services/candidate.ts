import {Injectable} from '@angular/core';
import {Candidate} from '../models/Candidate';
import {Polygon} from '../models/Polygon';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  cands: Map<string, Candidate>;

  constructor() {}

  addCandidate(color: number, name: string): void {
    this.cands.set(name, new Candidate(name, color));
  }

  polygonHovered(polygon: Polygon): void {
    this.cands.get(polygon.candName).polygonHovered();
  }

  polygonUnhovered(polugon: Polygon): void {
    this.cands.get(polugon.candName).polygonUnhovered();
  }
}
