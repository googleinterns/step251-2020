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
import {FileServiceStub} from '../../testing/FileServiceStub';
import {FileService} from './file';

describe('EnvironmentService', () => {
  let service: EnvironmentService;
  let fileServiceStub: FileServiceStub;

  beforeEach(() => {
    fileServiceStub = new FileServiceStub();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [{provide: FileService, useValue: fileServiceStub}],
    });
    service = TestBed.inject(EnvironmentService);
  });

  it('#getPolygons should return polygons, representing the env', done => {
    service.getPolygons(fileServiceStub.jsonFileName).subscribe(polygons => {
      expect(polygons).toBeTruthy();
      const envCandNames = new Set<string>();
      // Currently files represent a single env - first element of the array
      // and getPolygons() is expected to be called from a single env
      // TODO(#147): update, when parent component is introduced
      const env = fileServiceStub.files[fileServiceStub.jsonFileName][0];
      for (const snapshot of env.snapshots) {
        for (const candInfo of snapshot.cands_info) {
          envCandNames.add(candInfo.name);
        }
      }
      const polygonCandNames = new Set<string>();
      polygons.forEach(({candName}) => polygonCandNames.add(candName));
      // expect(areSetsEqual(envCandNames, polygonCandNames)).toBeTrue(); // TODO(#153): uncomment, when calculatePolygons() is finished
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
    it('one candidate gets to 0 jobs', () => {
      const inputEnvironments: Environment[] = [
        {
          environment: 'env',
          snapshots: [
            {
              timestamp: 1,
              cands_info: [
                {name: '1', job_count: 30},
                {name: '2', job_count: 70},
              ],
            },
            {
              timestamp: 2,
              cands_info: [{name: '2', job_count: 100}],
            },
          ],
        },
      ];

      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironments);

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
      const inputEnvironments: Environment[] = [
        {
          environment: 'env',
          snapshots: [
            {
              timestamp: 1,
              cands_info: [{name: '1', job_count: 100}],
            },
          ],
        },
      ];

      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironments);

      expect(result[0].candName).toEqual('1');
      expect(result[0].points).toEqual([
        {x: 0, y: 100},
        {x: 1, y: 0},
        {x: 1, y: 100},
      ]);
    });

    it('all have 0 jobs', () => {
      const inputEnvironments: Environment[] = [
        {
          environment: 'env',
          snapshots: [
            {
              timestamp: 1,
              cands_info: [
                {name: '1', job_count: 0},
                {name: '2', job_count: 0},
              ],
            },
          ],
        },
      ];

      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironments);

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
      const inputEnvironments: Environment[] = [
        {
          environment: 'env',
          snapshots: [
            {
              timestamp: 1,
              cands_info: [{name: '1', job_count: 100}],
            },
            {
              timestamp: 2,
              cands_info: [
                {name: '1', job_count: 80},
                {name: '2', job_count: 20},
              ],
            },
          ],
        },
      ];

      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironments);

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
      const inputEnvironments: Environment[] = [
        {
          environment: 'env',
          snapshots: [
            {
              timestamp: 1,
              cands_info: [
                {name: '1', job_count: 30},
                {name: '2', job_count: 70},
              ],
            },
            {
              timestamp: 2,
              cands_info: [],
            },
          ],
        },
      ];

      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironments);

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
      const inputEnvironments: Environment[] = [
        {
          environment: 'env',
          snapshots: [
            {
              timestamp: 1,
              cands_info: [{name: '1', job_count: 100}],
            },
            {
              timestamp: 2,
              cands_info: [
                {name: '1', job_count: 65},
                {name: '2', job_count: 35},
              ],
            },
            {
              timestamp: 3,
              cands_info: [
                {name: '1', job_count: 75},
                {name: '2', job_count: 25},
              ],
            },
            {timestamp: 4, cands_info: [{name: '1', job_count: 100}]},
          ],
        },
      ];

      // @ts-ignore
      const result: Polygon[] = service.calculatePolygons(inputEnvironments);

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
      const inputLower: Map<string, Point[]> = new Map();
      inputLower.set('1', [
        new Point(0, 100),
        new Point(1, 10),
        new Point(2, 100),
      ]);
      inputLower.set('2', [
        new Point(0, 100),
        new Point(1, 0),
        new Point(2, 0),
      ]);
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

    it('no polygon is closed', () => {
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

    it('all polygons are closed', () => {
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
      inputLower.set('3', [
        new Point(0, 0),
        new Point(1, 0),
        new Point(2, 100),
      ]);
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
  });

  describe('#addSnapshotToPolygons', () => {
    it('input snapshot with the 2 same existing candidates', () => {
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

    it('new candidate appears at snapshot', () => {
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

    it('candidate  disappears at snapshot', () => {
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
  });

  describe('#addPointToBorderMap', () => {
    it('adds point to empty border', () => {
      const bound: Map<string, Point[]> = new Map();
      const point: Point = {x: 10, y: 20};
      const key = 'key';

      // @ts-ignore
      service.addPointToBorderMap(bound, key, point);

      expect(bound.get(key)).toEqual([point]);
    });

    it('adds point to non-empty border', () => {
      const bound: Map<string, Point[]> = new Map();
      const point1: Point = {x: 10, y: 20};
      const point2: Point = {x: 20, y: 10};
      const key = 'key';
      bound.set(key, [point1]);

      // @ts-ignore
      service.addPointToBorderMap(bound, key, point2);

      expect(bound.get(key)).toEqual([point1, point2]);
    });
  });

  describe('#computeNextSnapshot', () => {
    it('inserts new candidate', () => {
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

    it('input candidate info list is empty', () => {
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

    it('all input candidates have 0 jobs', () => {
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

    it('old TimestampLowerBoundSet is empty', () => {
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
  });

  describe('#getPercentages', () => {
    it('returns 3 candidates with fractional percentages', () => {
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

    it('remains with only a candidate with 100%', () => {
      const input: CandidateInfo[] = [
        {name: '1', job_count: 2000},
        {name: '2', job_count: 0},
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
        {name: '1', job_count: 0},
        {name: '2', job_count: 0},
      ]);

      expect(resultMap.size).toBe(2);
      expect(resultMap.get('1')).toEqual(0);
      expect(resultMap.get('2')).toEqual(0);
    });
  });
});
