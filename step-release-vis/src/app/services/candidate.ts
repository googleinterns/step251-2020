import {Injectable} from '@angular/core';
import {Candidate} from '../models/Candidate';
import {Polygon} from '../models/Polygon';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  cands: Map<string, Candidate>;

  constructor() {
    this.cands = new Map();
  }

  addCandidate(color: number, name: string): void {
    this.cands.set(name, new Candidate(name, color));
  }

  addPolygons(polygons: Polygon[]): void {
    for (const polygon of polygons) {
      if (this.cands.has(polygon.candName)) {
        this.cands.get(polygon.candName).addPolygon(polygon);
      } else {
        this.addCandidate(polygon.colorHue, polygon.candName);
        this.cands.get(polygon.candName).addPolygon(polygon);
      }
    }
  }

  polygonHovered(polygon: Polygon): void {
    this.cands.get(polygon.candName).polygonHovered();
  }

  polygonUnhovered(polugon: Polygon): void {
    this.cands.get(polugon.candName).polygonUnhovered();
  }
}
