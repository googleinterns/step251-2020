import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Polygon} from '../app/models/Polygon';
import {EnvironmentService} from '../app/services/environment';

@Injectable()
export class EnvironmentServiceStub {

  candName = 'test';

  polygons = [
    new Polygon(
      [
        {x: 0, y: 0},
        {x: 0, y: 1},
        {x: 1, y: 1},
        {x: 1, y: 0},
      ],
      this.candName
    )
  ];

  getPolygons(jsonFile: string): Observable<Polygon[]> {
    return of(this.polygons);
  }
}
