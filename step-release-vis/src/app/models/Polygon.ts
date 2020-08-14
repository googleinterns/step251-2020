import {Point} from './Point';

export class Polygon {
  points: Point[];
  color: string;

  constructor(points: Point[], color: string) {
    this.points = points;
    this.color = color;
  }

  // TODO(andreystar): utilize array.join
  toAttributeString(): string {
    let res = '';
    for (const point of this.points) {
      res += point.x + ',' + point.y + ' ';
    }
    return res;
  }
}
