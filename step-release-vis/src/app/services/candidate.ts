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

  polygonUnhovered(polygon: Polygon): void {
    this.cands.get(polygon.candName).polygonUnhovered();
  }

  /**
   * Scales a value from one range to another.
   *
   * @param value the value to scale
   * @param inStart start of the input interval
   * @param inEnd end of the input interval
   * @param outStart start of the output interval
   * @param outEnd end of the output interval
   */
  scale(
    value: number,
    inStart: number,
    inEnd: number,
    outStart: number,
    outEnd: number
  ): number {
    return (
      ((value - inStart) * (outEnd - outStart)) / (inEnd - inStart) + outStart
    );
  }

  sparseArray<T>(max: number, array: T[]): T[] {
    if (array.length <= max) {
      return array;
    }
    const res: T[] = [];
    for (let i = 0; i < max; i++) {
      const index = Math.floor(this.scale(i, 0, max, 0, array.length));
      res.push(array[index]);
    }
    return res;
  }
}
