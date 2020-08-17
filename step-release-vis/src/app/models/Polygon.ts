import {Point} from './Point';

export class Polygon {
  points: Point[];
  color: string;
  highlight = false;

  constructor(points: Point[], color = 'black') {
    this.points = points;
    this.color = color;
  }

  toAttributeString(): string {
    return this.points
      .map(({x, y}) => `${x},${y}`)
      .join(' ');
  }
}
