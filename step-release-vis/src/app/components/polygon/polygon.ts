import {Component, Input, OnInit} from '@angular/core';
import {Polygon} from '../../models/Polygon';

@Component({
  selector: 'app-polygon',
  template: 'polygon',
  styleUrls: ['./polygon.css']
})
export class PolygonComponent implements OnInit {

  @Input() polygon: Polygon;

  constructor() {
  }

  ngOnInit(): void {
  }

  getPoints(): string {
    // TODO(andreystar): extract polygon 'points' attribute
    let res = '';
    for (const point of this.polygon.points) {
      res += point.x + ',' + point.y + ' ';
    }
    console.log(res);
    return res;
  }
}
