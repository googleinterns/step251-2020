import {TestBed} from '@angular/core/testing';

import {
  EnvironmentService,
  PolygonLowerBoundYPosition,
  TimestampLowerBoundSet,
} from './environment';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {CandidateInfo, Environment} from '../models/Data';
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

  it('#getPolygons should return polygons, representing the env', done => {
    const env: Environment = {
      environment: 'test',
      snapshots: [
        {
          timestamp: 1,
          candsInfo: [
            {candidate: '1', jobCount: 30},
            {candidate: '2', jobCount: 70},
          ],
        },
        {
          timestamp: 2,
          candsInfo: [{candidate: '2', jobCount: 100}],
        },
      ],
    };
    service.getPolygons(env).subscribe(polygons => {
      expect(polygons).toBeTruthy();
      const envCandNames = new Set<string>();
      for (const snapshot of env.snapshots) {
        for (const candInfo of snapshot.candsInfo) {
          envCandNames.add(candInfo.candidate);
        }
      }
      const polygonCandNames = new Set<string>();
      polygons.forEach(({candName}) => polygonCandNames.add(candName));
      expect(areSetsEqual(envCandNames, polygonCandNames)).toBeTrue();
      done();
    });
  });

  function areSetsEqual(set1: Set<string>, set2: Set<string>): boolean {
    return (
      set1.size === set2.size &&
      [...set1].reduce((areEqual, value) => areEqual && set2.has(value), true)
    );
  }

  describe('#calculatePolygons', () => {
    it('one candidate has 2 polygons', () => {
      const inputEnvironment: Environment = {
        environment: 'env',
        snapshots: [
          {timestamp: 1, candsInfo: [{candidate: '1', jobCount: 100}]},
          {timestamp: 2, candsInfo: [{candidate: '2', jobCount: 100}]},
          {timestamp: 3, candsInfo: [{candidate: '1', jobCount: 100}]},
        ],
      };

      const poly0: Polygon = new Polygon(
        [
          {x: 0, y: 100},
          {x: 1, y: 0},
          {x: 2, y: 0},
          {x: 1, y: 100},
        ],
        '1'
      );
      const poly1: Polygon = new Polygon(
        [
          {x: 1, y: 100},
          {x: 2, y: 0},
          {x: 3, y: 0},
          {x: 2, y: 100},
        ],
        '2'
      );

      const poly2: Polygon = new Polygon(
        [
          {x: 2, y: 100},
          {x: 3, y: 0},
          {x: 3, y: 100},
        ],
        '1'
      );

      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironment);

      expect(result.length).toEqual(3);
      expect(result[0]).toEqual(poly0);
      expect(result[1]).toEqual(poly1);
      expect(result[2]).toEqual(poly2);
    });

    it('one candidate gets to 0 jobs', () => {
      const inputEnvironment: Environment = {
        environment: 'env',
        snapshots: [
          {
            timestamp: 1,
            candsInfo: [
              {candidate: '1', jobCount: 30},
              {candidate: '2', jobCount: 70},
            ],
          },
          {
            timestamp: 2,
            candsInfo: [{candidate: '2', jobCount: 100}],
          },
        ],
      };
      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironment);

      // first element in the output should be the first closed polygon
      expect(result[0].candName).toEqual('1');
      expect(result[0].points).toEqual([
        {x: 0, y: 100},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 1, y: 30},
      ]);
      expect(result[1].candName).toEqual('2');
      expect(result[1].points).toEqual([
        {x: 0, y: 100},
        {x: 1, y: 30},
        {x: 2, y: 0},
        {x: 2, y: 100},
        {x: 1, y: 100},
      ]);
    });

    it('just one candidate with 100% of the jobs', () => {
      const inputEnvironment: Environment = {
        environment: 'env',
        snapshots: [
          {
            timestamp: 1,
            candsInfo: [{candidate: '1', jobCount: 100}],
          },
        ],
      };

      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironment);

      expect(result[0].candName).toEqual('1');
      expect(result[0].points).toEqual([
        {x: 0, y: 100},
        {x: 1, y: 0},
        {x: 1, y: 100},
      ]);
    });

    it('all have 0 jobs', () => {
      const inputEnvironment: Environment = {
        environment: 'env',
        snapshots: [
          {
            timestamp: 1,
            candsInfo: [
              {candidate: '1', jobCount: 0},
              {candidate: '2', jobCount: 0},
            ],
          },
        ],
      };
      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironment);

      expect(result[0].candName).toEqual('1');
      expect(result[0].points).toEqual([
        {x: 0, y: 100},
        {x: 1, y: 100},
      ]);
      expect(result[1].candName).toEqual('2');
      expect(result[1].points).toEqual([
        {x: 0, y: 100},
        {x: 1, y: 100},
      ]);
    });

    it('new candidate appears', () => {
      const inputEnvironment: Environment = {
        environment: 'env',
        snapshots: [
          {
            timestamp: 1,
            candsInfo: [{candidate: '1', jobCount: 100}],
          },
          {
            timestamp: 2,
            candsInfo: [
              {candidate: '1', jobCount: 80},
              {candidate: '2', jobCount: 20},
            ],
          },
        ],
      };
      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironment);

      expect(result[0].candName).toEqual('1');
      expect(result[0].points).toEqual([
        {x: 0, y: 100},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 2, y: 80},
        {x: 1, y: 100},
      ]);
      expect(result[1].candName).toEqual('2');
      expect(result[1].points).toEqual([
        {x: 1, y: 100},
        {x: 2, y: 80},
        {x: 2, y: 100},
      ]);
    });

    it('both candidates get to 0 jobs at the same timestamp', () => {
      const inputEnvironment: Environment = {
        environment: 'env',
        snapshots: [
          {
            timestamp: 1,
            candsInfo: [
              {candidate: '1', jobCount: 30},
              {candidate: '2', jobCount: 70},
            ],
          },
          {
            timestamp: 2,
            candsInfo: [],
          },
        ],
      };
      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironment);

      expect(result[0].candName).toEqual('1');
      expect(result[0].points).toEqual([
        {x: 0, y: 100},
        {x: 1, y: 0},
        {x: 2, y: 100},
        {x: 1, y: 30},
      ]);
      expect(result[1].candName).toEqual('2');
      expect(result[1].points).toEqual([
        {x: 0, y: 100},
        {x: 1, y: 30},
        {x: 2, y: 100},
        {x: 1, y: 100},
      ]);
    });

    it('one candidate appears and disapears', () => {
      const inputEnvironment: Environment = {
        environment: 'env',
        snapshots: [
          {
            timestamp: 1,
            candsInfo: [{candidate: '1', jobCount: 100}],
          },
          {
            timestamp: 2,
            candsInfo: [
              {candidate: '1', jobCount: 65},
              {candidate: '2', jobCount: 35},
            ],
          },
          {
            timestamp: 3,
            candsInfo: [
              {candidate: '1', jobCount: 75},
              {candidate: '2', jobCount: 25},
            ],
          },
          {timestamp: 4, candsInfo: [{candidate: '1', jobCount: 100}]},
        ],
      };
      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironment);

      // first element in the output should be the first closed polygon
      expect(result[0].candName).toEqual('2');
      expect(result[0].points).toEqual([
        {x: 1, y: 100},
        {x: 2, y: 65},
        {x: 3, y: 75},
        {x: 4, y: 100},
        {x: 3, y: 100},
        {x: 2, y: 100},
      ]);
      expect(result[1].candName).toEqual('1');
      expect(result[1].points).toEqual([
        {x: 0, y: 100},
        {x: 1, y: 0},
        {x: 2, y: 0},
        {x: 3, y: 0},
        {x: 4, y: 0},
        {x: 4, y: 100},
        {x: 3, y: 75},
        {x: 2, y: 65},
        {x: 1, y: 100},
      ]);
    });
  });

  describe('#createPolygon', () => {
    it('creates a square', () => {
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

    it('creates a line', () => {
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
  });

  describe('#closePolygons', () => {
    it('just one polygon is closed', () => {
      const polys: Polygon[] = [];
      const inputLower: Map<number, Point[]> = new Map();
      inputLower.set(1, [
        new Point(0, 100),
        new Point(1, 10),
        new Point(2, 100),
      ]);
      inputLower.set(2, [new Point(0, 100), new Point(1, 0), new Point(2, 0)]);
      const inputUpper: Map<number, Point[]> = new Map();
      inputUpper.set(1, [
        new Point(0, 100),
        new Point(1, 100),
        new Point(2, 100),
      ]);
      inputUpper.set(2, [
        new Point(0, 100),
        new Point(1, 10),
        new Point(2, 100),
      ]);
      const inputTimestampLowerBoundSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
      inputTimestampLowerBoundSet.orderMap.set(1, 1);
      inputTimestampLowerBoundSet.orderMap.set(2, 0);
      inputTimestampLowerBoundSet.snapshot[0] = new PolygonLowerBoundYPosition(
        '2',
        2,
        0
      );
      inputTimestampLowerBoundSet.snapshot[1] = new PolygonLowerBoundYPosition(
        '1',
        1,
        100
      );

      const idMap: Map<string, number> = new Map();
      idMap.set('1', 1);
      idMap.set('2', 2);

      // @ts-ignore
      const result: TimestampLowerBoundSet = service.closePolygons(
        polys,
        inputLower,
        inputUpper,
        inputTimestampLowerBoundSet,
        idMap
      );

      expect(result.snapshot.length).toEqual(1);
      expect(result.snapshot[0].position).toEqual(0);
      expect(idMap.size).toEqual(1);
      // check if the closed polygon for the candidate '1' is added
      expect(polys[0].candName).toBe('1');
    });

    it('no polygon is closed', () => {
      const shouldRemainEmptyPolys: Polygon[] = [];
      const inputLower: Map<number, Point[]> = new Map();
      inputLower.set(1, [new Point(0, 30), new Point(1, 50)]);
      inputLower.set(2, [new Point(0, 0), new Point(1, 0)]);
      const inputUpper: Map<number, Point[]> = new Map();
      inputUpper.set(1, [new Point(0, 100), new Point(1, 100)]);
      inputUpper.set(2, [new Point(0, 30), new Point(1, 50)]);
      const inputTimestampUpperBoundSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
      inputTimestampUpperBoundSet.orderMap.set(1, 1);
      inputTimestampUpperBoundSet.orderMap.set(2, 0);
      inputTimestampUpperBoundSet.snapshot[0] = new PolygonLowerBoundYPosition(
        '2',
        2,
        0
      );
      inputTimestampUpperBoundSet.snapshot[1] = new PolygonLowerBoundYPosition(
        '1',
        1,
        50
      );
      const idMap: Map<string, number> = new Map();
      idMap.set('1', 1);
      idMap.set('2', 2);

      // @ts-ignore
      const result: TimestampUpperBoundSet = service.closePolygons(
        shouldRemainEmptyPolys,
        inputLower,
        inputUpper,
        inputTimestampUpperBoundSet,
        idMap
      );

      expect(idMap.size).toEqual(2);
      expect(result.orderMap.get(2)).toEqual(0);
      expect(result.orderMap.get(1)).toEqual(1);
      expect(result.snapshot[0].position).toEqual(0);
      expect(result.snapshot[1].position).toEqual(50);
      expect(shouldRemainEmptyPolys).toEqual([]);
    });

    it('all polygons are closed', () => {
      const polys: Polygon[] = [];
      const inputLower: Map<number, Point[]> = new Map();
      inputLower.set(1, [
        new Point(0, 60),
        new Point(1, 60),
        new Point(2, 100),
      ]);
      inputLower.set(2, [
        new Point(0, 20),
        new Point(1, 20),
        new Point(2, 100),
      ]);
      inputLower.set(3, [new Point(0, 0), new Point(1, 0), new Point(2, 100)]);
      const inputUpper: Map<number, Point[]> = new Map();
      inputUpper.set(1, [
        new Point(0, 100),
        new Point(1, 100),
        new Point(2, 100),
      ]);
      inputUpper.set(2, [
        new Point(0, 60),
        new Point(1, 60),
        new Point(2, 100),
      ]);
      inputUpper.set(3, [
        new Point(0, 20),
        new Point(1, 20),
        new Point(2, 100),
      ]);
      const inputTimestampLowerBoundSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
      inputTimestampLowerBoundSet.orderMap.set(1, 2);
      inputTimestampLowerBoundSet.orderMap.set(2, 1);
      inputTimestampLowerBoundSet.orderMap.set(3, 0);
      inputTimestampLowerBoundSet.snapshot[0] = new PolygonLowerBoundYPosition(
        '3',
        3,
        100
      );
      inputTimestampLowerBoundSet.snapshot[1] = new PolygonLowerBoundYPosition(
        '2',
        2,
        100
      );
      inputTimestampLowerBoundSet.snapshot[2] = new PolygonLowerBoundYPosition(
        '1',
        1,
        100
      );
      const idMap: Map<string, number> = new Map();
      idMap.set('1', 1);
      idMap.set('2', 2);
      idMap.set('3', 3);

      // @ts-ignore
      const result: TimestampLowerBoundSet = service.closePolygons(
        polys,
        inputLower,
        inputUpper,
        inputTimestampLowerBoundSet,
        idMap
      );

      expect(idMap.size).toEqual(0);
      // all 3 are closed => added to the polygon list
      expect(polys.length).toEqual(3);
      // no one is left in the current timestamp set
      expect(result.snapshot).toEqual([]);
    });
  });

  describe('#addSnapshotToPolygons', () => {
    it('input snapshot with the 2 same existing candidates', () => {
      const inputLower: Map<number, Point[]> = new Map();
      inputLower.set(1, [new Point(0, 0), new Point(1, 0)]);
      inputLower.set(2, [new Point(0, 10), new Point(1, 50)]);
      const inputUpper: Map<number, Point[]> = new Map();
      inputUpper.set(1, [new Point(0, 10), new Point(1, 50)]);
      inputUpper.set(2, [new Point(0, 100), new Point(1, 100)]);
      const inputSet: PolygonLowerBoundYPosition[] = [
        new PolygonLowerBoundYPosition('1', 1, 0),
        new PolygonLowerBoundYPosition('2', 2, 10),
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

      expect(inputLower.get(1)[2]).toEqual({x: 2, y: 0});
      expect(inputUpper.get(1)[2]).toEqual({x: 2, y: 10});
      expect(inputLower.get(2)[2]).toEqual({x: 2, y: 10});
      expect(inputUpper.get(2)[2]).toEqual({x: 2, y: 100});
    });

    it('new candidate appears at snapshot', () => {
      const inputLower: Map<number, Point[]> = new Map();
      inputLower.set(1, [new Point(0, 0), new Point(1, 0)]);
      inputLower.set(2, [new Point(0, 50), new Point(1, 30)]);
      const inputUpper: Map<number, Point[]> = new Map();
      inputUpper.set(1, [new Point(0, 50), new Point(1, 30)]);
      inputUpper.set(2, [new Point(0, 100), new Point(1, 100)]);
      const inputSet: PolygonLowerBoundYPosition[] = [
        new PolygonLowerBoundYPosition('1', 1, 0),
        new PolygonLowerBoundYPosition('2', 2, 30),
        new PolygonLowerBoundYPosition('3', 3, 80),
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
      expect(inputLower.get(3)[0]).toEqual({x: 1, y: 100});
      expect(inputUpper.get(3)[0]).toEqual({x: 1, y: 100});
      expect(inputLower.get(3)[1]).toEqual({x: 2, y: 80});
      expect(inputUpper.get(3)[1]).toEqual({x: 2, y: 100});
      // check if the other candidates are placed correctly
      expect(inputLower.get(1)[2]).toEqual({x: 2, y: 0});
      expect(inputUpper.get(1)[2]).toEqual({x: 2, y: 30});
      expect(inputLower.get(2)[2]).toEqual({x: 2, y: 30});
      expect(inputUpper.get(2)[2]).toEqual({x: 2, y: 80});
    });

    it('candidate  disappears at snapshot', () => {
      const inputLower: Map<number, Point[]> = new Map();
      inputLower.set(1, [new Point(0, 0), new Point(1, 0)]);
      inputLower.set(2, [new Point(0, 80), new Point(1, 80)]);
      const inputUpper: Map<number, Point[]> = new Map();
      inputUpper.set(1, [new Point(0, 80), new Point(1, 80)]);
      inputUpper.set(2, [new Point(0, 100), new Point(1, 100)]);
      const inputSet: PolygonLowerBoundYPosition[] = [
        new PolygonLowerBoundYPosition('1', 1, 0),
        new PolygonLowerBoundYPosition('2', 2, 100),
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
      expect(inputLower.get(2)[2]).toEqual({x: 2, y: 100});
      expect(inputUpper.get(2)[2]).toEqual({x: 2, y: 100});
      expect(inputLower.get(1)[2]).toEqual({x: 2, y: 0});
      expect(inputUpper.get(1)[2]).toEqual({x: 2, y: 100});
    });
  });

  describe('#addPointToBorderMap', () => {
    it('adds point to empty border', () => {
      const bound: Map<number, Point[]> = new Map();
      const point: Point = {x: 10, y: 20};
      const key = 1;

      // @ts-ignore
      service.addPointToBorderMap(bound, key, point);

      expect(bound.get(key)).toEqual([point]);
    });

    it('adds point to non-empty border', () => {
      const bound: Map<number, Point[]> = new Map();
      const point1: Point = {x: 10, y: 20};
      const point2: Point = {x: 20, y: 10};
      const key = 1;
      bound.set(key, [point1]);

      // @ts-ignore
      service.addPointToBorderMap(bound, key, point2);

      expect(bound.get(key)).toEqual([point1, point2]);
    });
  });

  describe('#computeNextSnapshot', () => {
    it('inserts new candidate', () => {
      const inputCandInfo: CandidateInfo[] = [
        {candidate: '1', jobCount: 100},
        {candidate: '2', jobCount: 100},
      ];
      const inputSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
      inputSet.orderMap.set(1, 0);
      inputSet.snapshot[0] = new PolygonLowerBoundYPosition('1', 1, 0);

      const idMap: Map<string, number> = new Map();
      idMap.set('1', 1);

      const result: [
        TimestampLowerBoundSet,
        number
        // @ts-ignore
      ] = service.computeNextSnapshot(inputCandInfo, inputSet, idMap, 3);

      expect(result[0].snapshot[0].position).toEqual(0);
      expect(result[0].snapshot[1].position).toEqual(50);
      expect(result[1]).toEqual(1);
    });

    it('input candidate info list is empty', () => {
      const emptyCandInfo: CandidateInfo[] = [];
      const inputSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
      inputSet.orderMap.set(1, 0);
      inputSet.snapshot[0] = new PolygonLowerBoundYPosition('1', 1, 0);

      const outputSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
      outputSet.orderMap.set(1, 0);
      outputSet.snapshot[0] = new PolygonLowerBoundYPosition('1', 1, 100);

      const idMap: Map<string, number> = new Map();
      idMap.set('1', 1);

      const result: [
        TimestampLowerBoundSet,
        number
        // @ts-ignore
      ] = service.computeNextSnapshot(emptyCandInfo, inputSet, idMap, 3);

      expect(result[0]).toEqual(outputSet);
      expect(idMap.size).toBe(1);
    });

    it('all input candidates have 0 jobs', () => {
      const emptyCandInfo: CandidateInfo[] = [
        {candidate: '1', jobCount: 0},
        {candidate: '2', jobCount: 0},
      ];
      const inputSet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
      inputSet.orderMap.set(1, 0);
      inputSet.orderMap.set(2, 1);
      inputSet.snapshot[0] = new PolygonLowerBoundYPosition('1', 1, 0);
      inputSet.snapshot[1] = new PolygonLowerBoundYPosition('2', 2, 50);

      const outputSet: TimestampLowerBoundSet = inputSet;
      outputSet.snapshot[0] = new PolygonLowerBoundYPosition('1', 1, 100);
      outputSet.snapshot[1] = new PolygonLowerBoundYPosition('2', 2, 100);

      const idMap: Map<string, number> = new Map();
      idMap.set('1', 1);
      idMap.set('2', 2);

      const result: [
        TimestampLowerBoundSet,
        number
        // @ts-ignore
      ] = service.computeNextSnapshot(emptyCandInfo, inputSet, idMap, 3);

      expect(result).toEqual([outputSet, 0]);
      expect(idMap.size).toEqual(2);
    });

    it('old TimestampLowerBoundSet is empty', () => {
      const inputCandInfo: CandidateInfo[] = [
        {candidate: '1', jobCount: 105},
        {candidate: '2', jobCount: 300},
        {candidate: '3', jobCount: 595},
      ];
      const emptySet: TimestampLowerBoundSet = new TimestampLowerBoundSet();
      const idMap: Map<string, number> = new Map();

      const result: [
        TimestampLowerBoundSet,
        number
        // @ts-ignore
      ] = service.computeNextSnapshot(inputCandInfo, emptySet, idMap, 0);

      expect(idMap.size).toEqual(3);
      expect(result[0].snapshot[0].position).toEqual(0);
      expect(result[0].snapshot[1].position).toEqual(10.5);
      expect(result[0].snapshot[2].position).toEqual(40.5);
      expect(result[1]).toEqual(3);
    });
  });

  describe('#getPercentages', () => {
    it('returns 3 candidates with fractional percentages', () => {
      const input: CandidateInfo[] = [
        {candidate: '1', jobCount: 105},
        {candidate: '2', jobCount: 300},
        {candidate: '3', jobCount: 595},
      ];
      // @ts-ignore
      const resultMap: Map<string, number> = service.getPercentages(input);

      expect(resultMap.get('1')).toEqual(10.5);
      expect(resultMap.get('2')).toEqual(30);
      expect(resultMap.get('3')).toEqual(59.5);
    });

    it('remains with only a candidate with 100%', () => {
      const input: CandidateInfo[] = [
        {candidate: '1', jobCount: 2000},
        {candidate: '2', jobCount: 0},
      ];
      // @ts-ignore
      const resultMap: Map<string, number> = service.getPercentages(input);

      expect(resultMap.get('1')).toEqual(100);
    });

    it('input empty CanditateInfo[]', () => {
      // @ts-ignore
      const resultMap: Map<string, number> = service.getPercentages([]);

      expect(resultMap.size).toBe(0);
    });

    it('all candidates have 0 jobs', () => {
      // @ts-ignore
      const resultMap: Map<string, number> = service.getPercentages([
        {candidate: '1', jobCount: 0},
        {candidate: '2', jobCount: 0},
      ]);

      expect(resultMap.size).toBe(2);
      expect(resultMap.get('1')).toEqual(0);
      expect(resultMap.get('2')).toEqual(0);
    });
  });
});
