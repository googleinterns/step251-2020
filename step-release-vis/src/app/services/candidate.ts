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

  getColor(candName: string): number {
    return this.cands.get(candName).color;
  }

  addCandidate(color: number, name: string): void {
    // if the candidate already exists, just update the color
    if (this.cands.has(name)) {
      const existingCandidate: Candidate = this.cands.get(name);
      existingCandidate.color = color;
    } else {
      this.cands.set(name, new Candidate(name, color));
    }
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
