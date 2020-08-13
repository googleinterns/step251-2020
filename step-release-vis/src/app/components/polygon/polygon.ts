import {Component, Input, OnInit} from '@angular/core';
import {Polygon} from '../../models/Polygon';

@Component({
  selector: 'app-polygon',
  template: '<svg:polygon [attr.points]="getPoints()"/>',
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
    return '';
  }
}
