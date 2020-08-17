import {Point} from './Point';

export class Polygon {

  points: Point[];
  color: string;
  highlight = false;
  candName: string;

  constructor(points: Point[], color = 'black', candName: string) {
    this.points = points;
    this.color = color;
    this.candName = candName;
  }

  toAttributeString(): string {
    return this.points
      .map(({x, y}) => `${x},${y}`)
      .join(' ');
  }
}
