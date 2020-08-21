import {Polygon} from './Polygon';

export class Candidate {
  candName: string;
  color: number;
  polygons: Polygon[];

  constructor(candName: string, color: number) {
    this.candName = candName;
    this.color = color;
  }

  polygonHovered(): void {}

  polygonUnhovered(): void {}
}
