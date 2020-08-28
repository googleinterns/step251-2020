import {Injectable} from '@angular/core';
import {Polygon} from '../app/models/Polygon';

@Injectable({
  providedIn: 'root',
})
export class CandidateServiceStub {
  candColors = new Map<string, number>();

  getColor(candName: string): number {
    return 0;
  }

  addPolygons(polygons: Polygon[]): void {}

  polygonHovered(polygon: Polygon): void {
    polygon.highlight = true;
  }

  polygonUnhovered(polygon: Polygon): void {
    polygon.highlight = false;
  }

  addCandidate(color: number, name: string): void {
    this.candColors.set(name, color);
  }

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
