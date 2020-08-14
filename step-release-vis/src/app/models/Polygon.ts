import {Point} from './Point';

export class Polygon {
  // TODO(andrey): add candidate field and update existing code
  points: Point[];
  color: string;

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
