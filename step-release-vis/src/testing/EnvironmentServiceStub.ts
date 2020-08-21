import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Polygon} from '../app/models/Polygon';
import {EnvironmentService} from '../app/services/environment';
import {Environment} from '../app/models/Data';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentServiceStub {
  candName = 'test_cand_name';

  polygons: Polygon[] = [
    new Polygon(
      [
        {x: 0, y: 0},
        {x: 0, y: 100},
        {x: 100, y: 0},
      ],
      this.candName
    ),
    new Polygon(
      [
        {x: 0, y: 100},
        {x: 100, y: 100},
        {x: 100, y: 0},
      ],
      this.candName
    ),
    new Polygon(
      [
        {x: 100, y: 0},
        {x: 100, y: 100},
        {x: 200, y: 0},
      ],
      this.candName
    ),
    new Polygon(
      [
        {x: 100, y: 100},
        {x: 200, y: 100},
        {x: 200, y: 0},
      ],
      this.candName
    ),
    new Polygon(
      [
        {x: 200, y: 0},
        {x: 200, y: 100},
        {x: 300, y: 0},
      ],
      this.candName
    ),
    new Polygon(
      [
        {x: 200, y: 100},
        {x: 300, y: 100},
        {x: 300, y: 0},
      ],
      this.candName
    ),
    new Polygon(
      [
        {x: 300, y: 0},
        {x: 300, y: 100},
        {x: 400, y: 0},
      ],
      this.candName
    ),
    new Polygon(
      [
        {x: 300, y: 100},
        {x: 400, y: 100},
        {x: 400, y: 0},
      ],
      this.candName
    ),
  ];

  getPolygons(environment: Environment): Observable<Polygon[]> {
    return of(this.polygons);
  }
}
