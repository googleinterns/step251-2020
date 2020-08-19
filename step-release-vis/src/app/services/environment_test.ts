import {TestBed} from '@angular/core/testing';

import {
  EnvironmentService,
  PolygonLowerBoundYPosition,
  TimestampLowerBoundSet,
} from './environment';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CandidateInfo} from '../models/Data';
import {Point} from '../models/Point';
import {Polygon} from '../models/Polygon';

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(EnvironmentService);
  });

  // TODO(naoai): write getPolygons test
  it('#createPolygon should create a square', () => {
    const lower: Point[] = [
      {x: 0, y: 0},
      {x: 10, y: 0},
      {x: 10, y: 10},
    ];
    const upper: Point[] = [
      {x: 0, y: 0},
      {x: 0, y: 10},
      {x: 10, y: 10},
    ];
    const square: Polygon = new Polygon(
      [
        {x: 0, y: 0},
        {x: 10, y: 0},
        {x: 10, y: 10},
        {x: 0, y: 10},
      ],
      'square'
    );

    // @ts-ignore
    const result: Polygon = service.createPolygon(lower, upper, 'square');

    expect(result).toEqual(square);
  });

  it('#createPolygon should create a line', () => {
    const lower: Point[] = [
      {x: 0, y: 0},
      {x: 10, y: 10},
    ];
    const upper: Point[] = lower;
    const line: Polygon = new Polygon(
      [
        {x: 0, y: 0},
        {x: 10, y: 10},
      ],
      'line'
    );

    // @ts-ignore
    const result: Polygon = service.createPolygon(lower, upper, 'line');

    expect(result).toEqual(line);
  });

  it('#closePolygons just one polygon is closed', () => {
    const polys: Polygon[] = [];
    const inputLower: Map<string, Point[]> = new Map();
    inputLower.set('1', [
      new Point(0, 100),
      new Point(1, 10),
      new Point(2, 100),
    ]);
    inputLower.set('2', [new Point(0, 100), new Point(1, 0), new Point(2, 0)]);
    const inputUpper: Map<string, Point[]> = new Map();
    inputUpper.set('1', [
      new Point(0, 100),
      new Point(1, 100),
      new Point(2, 100),
    ]);
    inputUpper.set('2', [
      new Point(0, 100),
      new Point(1, 10),
      new Point(2, 100),
    ]);
    const inputTimestampLowerBoundSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
    inputTimestampLowerBoundSet.orderMap.set('1', 1);
    inputTimestampLowerBoundSet.orderMap.set('2', 0);
    inputTimestampLowerBoundSet.snapshot[0] = new PolygonLowerBoundYPosition(
      '2',
      0
    );
    inputTimestampLowerBoundSet.snapshot[1] = new PolygonLowerBoundYPosition(
      '1',
      100
    );

    // @ts-ignore
    const result: TimestampLowerBoundSet = service.closePolygons(
      polys,
      inputLower,
      inputUpper,
      inputTimestampLowerBoundSet
    );

    expect(result.snapshot.length).toEqual(1);
    expect(result.snapshot[0].position).toEqual(0);
    // check if the closed polygon for the candidate '1' is added
    expect(polys[0].candName).toBe('1');
  });

  it('#closePolygons no polygon is closed', () => {
    const shouldRemainEmptyPolys: Polygon[] = [];
    const inputLower: Map<string, Point[]> = new Map();
    inputLower.set('1', [new Point(0, 30), new Point(1, 50)]);
    inputLower.set('2', [new Point(0, 0), new Point(1, 0)]);
    const inputUpper: Map<string, Point[]> = new Map();
    inputUpper.set('1', [new Point(0, 100), new Point(1, 100)]);
    inputUpper.set('2', [new Point(0, 30), new Point(1, 50)]);
    const inputTimestampUpperBoundSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
    inputTimestampUpperBoundSet.orderMap.set('1', 1);
    inputTimestampUpperBoundSet.orderMap.set('2', 0);
    inputTimestampUpperBoundSet.snapshot[0] = new PolygonLowerBoundYPosition(
      '2',
      0
    );
    inputTimestampUpperBoundSet.snapshot[1] = new PolygonLowerBoundYPosition(
      '1',
      50
    );

    // @ts-ignore
    const result: TimestampUpperBoundSet = service.closePolygons(
      shouldRemainEmptyPolys,
      inputLower,
      inputUpper,
      inputTimestampUpperBoundSet
    );

    expect(result.orderMap.get('2')).toEqual(0);
    expect(result.orderMap.get('1')).toEqual(1);
    expect(result.snapshot[0].position).toEqual(0);
    expect(result.snapshot[1].position).toEqual(50);
    expect(shouldRemainEmptyPolys).toEqual([]);
  });

  it('#closePolygons all polygons are closed', () => {
    const polys: Polygon[] = [];
    const inputLower: Map<string, Point[]> = new Map();
    inputLower.set('1', [
      new Point(0, 60),
      new Point(1, 60),
      new Point(2, 100),
    ]);
    inputLower.set('2', [
      new Point(0, 20),
      new Point(1, 20),
      new Point(2, 100),
    ]);
    inputLower.set('3', [new Point(0, 0), new Point(1, 0), new Point(2, 100)]);
    const inputUpper: Map<string, Point[]> = new Map();
    inputUpper.set('1', [
      new Point(0, 100),
      new Point(1, 100),
      new Point(2, 100),
    ]);
    inputUpper.set('2', [
      new Point(0, 60),
      new Point(1, 60),
      new Point(2, 100),
    ]);
    inputUpper.set('3', [
      new Point(0, 20),
      new Point(1, 20),
      new Point(2, 100),
    ]);
    const inputTimestampLowerBoundSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
    inputTimestampLowerBoundSet.orderMap.set('1', 2);
    inputTimestampLowerBoundSet.orderMap.set('2', 1);
    inputTimestampLowerBoundSet.orderMap.set('3', 0);
    inputTimestampLowerBoundSet.snapshot[0] = new PolygonLowerBoundYPosition(
      '3',
      100
    );
    inputTimestampLowerBoundSet.snapshot[1] = new PolygonLowerBoundYPosition(
      '2',
      100
    );
    inputTimestampLowerBoundSet.snapshot[2] = new PolygonLowerBoundYPosition(
      '1',
      100
    );

    // @ts-ignore
    const result: TimestampLowerBoundSet = service.closePolygons(
      polys,
      inputLower,
      inputUpper,
      inputTimestampLowerBoundSet
    );

    // all 3 are closed => added to the polygon list
    expect(polys.length).toEqual(3);
    // no one is left in the current timestamp set
    expect(result.snapshot).toEqual([]);
  });

  it('#addSnapshotToPolygons snapshot with the 2 same existing candidates', () => {
    const inputLower: Map<string, Point[]> = new Map();
    inputLower.set('1', [new Point(0, 0), new Point(1, 0)]);
    inputLower.set('2', [new Point(0, 10), new Point(1, 50)]);
    const inputUpper: Map<string, Point[]> = new Map();
    inputUpper.set('1', [new Point(0, 10), new Point(1, 50)]);
    inputUpper.set('2', [new Point(0, 100), new Point(1, 100)]);
    const inputSet: PolygonLowerBoundYPosition[] = [
      new PolygonLowerBoundYPosition('1', 0),
      new PolygonLowerBoundYPosition('2', 10),
    ];
    const inputInsertions = 0;
    const inputTime = 2;
    const inputLastTime = 1;

    // @ts-ignore
    service.addSnapshotToPolygons(
      inputLower,
      inputUpper,
      inputSet,
      inputInsertions,
      inputTime,
      inputLastTime
    );

    expect(inputLower.get('1')[2]).toEqual({x: 2, y: 0});
    expect(inputUpper.get('1')[2]).toEqual({x: 2, y: 10});
    expect(inputLower.get('2')[2]).toEqual({x: 2, y: 10});
    expect(inputUpper.get('2')[2]).toEqual({x: 2, y: 100});
  });

  it('#adddSnapshotToPolygons new candidate appears at snapshot', () => {
    const inputLower: Map<string, Point[]> = new Map();
    inputLower.set('1', [new Point(0, 0), new Point(1, 0)]);
    inputLower.set('2', [new Point(0, 50), new Point(1, 30)]);
    const inputUpper: Map<string, Point[]> = new Map();
    inputUpper.set('1', [new Point(0, 50), new Point(1, 30)]);
    inputUpper.set('2', [new Point(0, 100), new Point(1, 100)]);
    const inputSet: PolygonLowerBoundYPosition[] = [
      new PolygonLowerBoundYPosition('1', 0),
      new PolygonLowerBoundYPosition('2', 30),
      new PolygonLowerBoundYPosition('3', 80),
    ];
    const inputInsertions = 1;
    const inputTime = 2;
    const inputLastTime = 1;

    // @ts-ignore
    service.addSnapshotToPolygons(
      inputLower,
      inputUpper,
      inputSet,
      inputInsertions,
      inputTime,
      inputLastTime
    );

    // check if the new candidate is added
    expect(inputLower.size).toEqual(3);
    expect(inputLower.get('3')[0]).toEqual({x: 1, y: 100});
    expect(inputUpper.get('3')[0]).toEqual({x: 1, y: 100});
    expect(inputLower.get('3')[1]).toEqual({x: 2, y: 80});
    expect(inputUpper.get('3')[1]).toEqual({x: 2, y: 100});
    // check if the other candidates are placed correctly
    expect(inputLower.get('1')[2]).toEqual({x: 2, y: 0});
    expect(inputUpper.get('1')[2]).toEqual({x: 2, y: 30});
    expect(inputLower.get('2')[2]).toEqual({x: 2, y: 30});
    expect(inputUpper.get('2')[2]).toEqual({x: 2, y: 80});
  });

  it('#adddSnapshotToPolygons candidate  disappears at snapshot', () => {
    const inputLower: Map<string, Point[]> = new Map();
    inputLower.set('1', [new Point(0, 0), new Point(1, 0)]);
    inputLower.set('2', [new Point(0, 80), new Point(1, 80)]);
    const inputUpper: Map<string, Point[]> = new Map();
    inputUpper.set('1', [new Point(0, 80), new Point(1, 80)]);
    inputUpper.set('2', [new Point(0, 100), new Point(1, 100)]);
    const inputSet: PolygonLowerBoundYPosition[] = [
      new PolygonLowerBoundYPosition('1', 0),
      new PolygonLowerBoundYPosition('2', 100),
    ];
    const inputInsertions = 0;
    const inputTime = 2;
    const inputLastTime = 1;

    // @ts-ignore
    service.addSnapshotToPolygons(
      inputLower,
      inputUpper,
      inputSet,
      inputInsertions,
      inputTime,
      inputLastTime
    );

    // check if their positions are now updated
    expect(inputLower.get('2')[2]).toEqual({x: 2, y: 100});
    expect(inputUpper.get('2')[2]).toEqual({x: 2, y: 100});
    expect(inputLower.get('1')[2]).toEqual({x: 2, y: 0});
    expect(inputUpper.get('1')[2]).toEqual({x: 2, y: 100});
  });

  it('#addPointToBorderMap add to empty border', () => {
    const bound: Map<string, Point[]> = new Map();
    const point: Point = {x: 10, y: 20};
    const key = 'key';

    // @ts-ignore
    service.addPointToBorderMap(bound, key, point);

    expect(bound.get(key)).toEqual([point]);
  });

  it('#addPointToBorderMap add to non-empty border', () => {
    const bound: Map<string, Point[]> = new Map();
    const point1: Point = {x: 10, y: 20};
    const point2: Point = {x: 20, y: 10};
    const key = 'key';
    bound.set(key, [point1]);

    // @ts-ignore
    service.addPointToBorderMap(bound, key, point2);

    expect(bound.get(key)).toEqual([point1, point2]);
  });

  it('#computeNextSnapshot inserts new candidate', () => {
    const inputCandInfo: CandidateInfo[] = [
      {name: '1', job_count: 100},
      {name: '2', job_count: 100},
    ];
    const inputSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
    inputSet.orderMap.set('1', 0);
    inputSet.snapshot[0] = new PolygonLowerBoundYPosition('1', 0);

    const result: [
      TimestampLowerBoundSet,
      number
      // @ts-ignore
    ] = service.computeNextSnapshot(inputCandInfo, inputSet);

    expect(result[0].snapshot[0].position).toEqual(0);
    expect(result[0].snapshot[1].position).toEqual(50);
    expect(result[1]).toEqual(1);
  });

  it('#computeNextSnapshot candidate info list is empty', () => {
    const emptyCandInfo: CandidateInfo[] = [];
    const inputSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
    inputSet.orderMap.set('1', 0);
    inputSet.snapshot[0] = new PolygonLowerBoundYPosition('1', 0);

    const result: [
      TimestampLowerBoundSet,
      number
      // @ts-ignore
    ] = service.computeNextSnapshot(emptyCandInfo, inputSet);

    expect(result[0]).toBe(inputSet);
  });

  it('#computeNextSnapshot all candidates have 0 jobs', () => {
    const emptyCandInfo: CandidateInfo[] = [
      {name: '1', job_count: 0},
      {name: '2', job_count: 0},
    ];
    const inputSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
    inputSet.orderMap.set('1', 0);
    inputSet.orderMap.set('2', 1);
    inputSet.snapshot[0] = new PolygonLowerBoundYPosition('1', 0);
    inputSet.snapshot[1] = new PolygonLowerBoundYPosition('2', 50);

    const outputSet: TimestampLowerBoundSet = inputSet;
    outputSet.snapshot[0] = new PolygonLowerBoundYPosition('1', 100);
    outputSet.snapshot[1] = new PolygonLowerBoundYPosition('2', 100);

    const result: [
      TimestampLowerBoundSet,
      number
      // @ts-ignore
    ] = service.computeNextSnapshot(emptyCandInfo, inputSet);

    expect(result).toEqual([outputSet, 0]);
  });

  it('#computeNextSnapshot with old TimestampLowerBoundSet empty', () => {
    const inputCandInfo: CandidateInfo[] = [
      {name: '1', job_count: 105},
      {name: '2', job_count: 300},
      {name: '3', job_count: 595},
    ];
    const emptySet: TimestampLowerBoundSet = new TimestampLowerBoundSet();

    const result: [
      TimestampLowerBoundSet,
      number
      // @ts-ignore
    ] = service.computeNextSnapshot(inputCandInfo, emptySet);

    expect(result[0].snapshot[0].position).toEqual(0);
    expect(result[0].snapshot[1].position).toEqual(10.5);
    expect(result[0].snapshot[2].position).toEqual(40.5);
    expect(result[1]).toEqual(3);
  });

  it('#getPercentages should return 3 candidates with fractional percentages', () => {
    const input: CandidateInfo[] = [
      {name: '1', job_count: 105},
      {name: '2', job_count: 300},
      {name: '3', job_count: 595},
    ];
    // @ts-ignore
    const resultMap: Map<string, number> = service.getPercentages(input);

    expect(resultMap.get('1')).toEqual(10.5);
    expect(resultMap.get('2')).toEqual(30);
    expect(resultMap.get('3')).toEqual(59.5);
  });

  it('#getPercentages should have a candidate with 100', () => {
    const input: CandidateInfo[] = [
      {name: '1', job_count: 2000},
      {name: '2', job_count: 0},
    ];
    // @ts-ignore
    const resultMap: Map<string, number> = service.getPercentages(input);

    expect(resultMap.get('1')).toEqual(100);
  });

  it('#getPercenatges with empty CanditateInfo[]', () => {
    // @ts-ignore
    const resultMap: Map<string, number> = service.getPercentages([]);

    expect(resultMap.size).toBe(0);
  });

  it('#getPercenatges where all candidates have 0 jobs', () => {
    // @ts-ignore
    const resultMap: Map<string, number> = service.getPercentages([
      {name: '1', job_count: 0},
      {name: '2', job_count: 0},
    ]);

    expect(resultMap.size).toBe(2);
    expect(resultMap.get('1')).toEqual(0);
    expect(resultMap.get('2')).toEqual(0);
  });
});
