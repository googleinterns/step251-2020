import {Point} from './Point';

export class Polygon {

  points: Point[];
  color: string;
  highlight = false;
  candName: string;

  constructor(points: Point[], candName: string, color = 'black') {
    this.points = points;
    this.candName = candName;
    this.color = color;
  }

  toAttributeString(): string {
    return this.points
      .map(({x, y}) => `${x},${y}`)
      .join(' ');
  }
}
