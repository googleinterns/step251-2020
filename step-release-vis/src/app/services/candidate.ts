import {Injectable} from '@angular/core';
import {Candidate} from '../models/Candidate';
import {Polygon} from '../models/Polygon';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  cands: Map<string, Candidate>;

  constructor() {}

  // TODO(#169): addCandidate(color, name) + addPolygons(polygons)

  polygonHovered(polygon: Polygon): void {
    this.cands.get(polygon.candName).polygonHovered();
  }

  polygonUnhovered(polugon: Polygon): void {
    this.cands.get(polugon.candName).polygonUnhovered();
  }
}
