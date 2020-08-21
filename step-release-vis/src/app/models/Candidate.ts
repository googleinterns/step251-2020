import {Polygon} from './Polygon';

export class Candidate {
  candName: string;
  color: number;
  polygons: Polygon[];

  polygonHovered(): void {}

  polygonUnhovered(): void {}
}
