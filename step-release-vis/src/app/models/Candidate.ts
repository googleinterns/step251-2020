import {Polygon} from './Polygon';

export class Candidate {
  candName: string;
  color: number;
  polygons: Polygon[];

  constructor(candName: string, color: number, polygons: Polygon[]) {
    this.candName = candName;
    this.color = color;
    this.polygons = polygons;
  }

  polygonHovered(): void {
    this.polygons.map(polygon => (polygon.highlight = true));
  }

  polygonUnhovered() {}
}
