import {Point} from './Point';

export class Polygon {
  points: Point[];
  candName: string;
  colorHue?: number;
  highlight = false;

  constructor(points: Point[], candName: string, colorHue?: number) {
    this.points = points;
    this.candName = candName;
    this.colorHue = colorHue;
  }

  toAttributeString(): string {
    return this.points.map(({x, y}) => `${x},${y}`).join(' ');
  }
}
