import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Polygon} from '../app/models/Polygon';
import {Environment} from '../app/models/Data';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentServiceStub {
  candName = 'test_cand_name';
  minTimestamp = 0;
  maxTimestamp = 400;

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

  env: Environment = {
    name: 'prod',
    snapshotsList: [
      {
        timestamp: {
          seconds: 0,
          nanos: 0,
        },
        candidatesList: [
          {
            candidate: '1',
            jobCount: 100,
          },
          {
            candidate: '2',
            jobCount: 1000,
          },
          {
            candidate: '3',
            jobCount: 900,
          },
        ],
      },
      {
        timestamp: {
          seconds: 100,
          nanos: 0,
        },
        candidatesList: [
          {
            candidate: '2',
            jobCount: 1000,
          },
        ],
      },
      {
        timestamp: {
          seconds: 200,
          nanos: 0,
        },
        candidatesList: [
          {
            candidate: '2',
            jobCount: 500,
          },
        ],
      },
      {
        timestamp: {
          seconds: 300,
          nanos: 0,
        },
        candidatesList: [
          {
            candidate: '2',
            jobCount: 2000,
          },
        ],
      },
      {
        timestamp: {
          seconds: 400,
          nanos: 0,
        },
        candidatesList: [
          {
            candidate: '2',
            jobCount: 2000,
          },
        ],
      },
    ],
  };

  getPolygons(environment: Environment): Observable<Polygon[]> {
    return of(this.polygons);
  }
}
