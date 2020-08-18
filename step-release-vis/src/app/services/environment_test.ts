import { TestBed } from '@angular/core/testing';

import { EnvironmentService, PolygonUpperBoundYPosition, TimestampUpperBoundSet } from './environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CandidateInfo } from '../models/Data';

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EnvironmentService);
  });

  // TODO(naoai): write getPolygons test

  it('#insertAndAdjustPoints insert new candidate', () => {
    const inputCandInfo: CandidateInfo[] = [{name: '1', job_count: 100}, {name: '2', job_count: 100}];
    const inputSet: TimestampUpperBoundSet = new TimestampUpperBoundSet();
    inputSet.orderMap.set('1', 0);
    inputSet.snapshot[0] = new PolygonUpperBoundYPosition('1', 100);

    // @ts-ignore
    const result: [TimestampUpperBoundSet, number] = service.insertAndAdjustPoints(inputCandInfo, inputSet);

    expect(result[0].snapshot[0].position).toEqual(50);
    expect(result[0].snapshot[1].position).toEqual(100);
    expect(result[1]).toEqual(1);
  });

  it('#insertAndAdjustPoints candidateInfo[] empty', () => {
    const emptyCandInfo: CandidateInfo[] = [];
    const inputSet: TimestampUpperBoundSet = new TimestampUpperBoundSet();
    inputSet.orderMap.set('1', 0);
    inputSet.snapshot[0] = new PolygonUpperBoundYPosition('1', 100);

    // @ts-ignore
    const result: [TimestampUpperBoundSet, number] = service.insertAndAdjustPoints(emptyCandInfo, inputSet);

    expect(result[0]).toBe(inputSet);
  });

  it('#insertAndAdjustPoints with empty set', () => {
    const inputCandInfo: CandidateInfo[] = [{name:  '1', job_count: 105}, {name: '2', job_count: 300},
      {name: '3', job_count: 595}];
    const emptySet: TimestampUpperBoundSet = new TimestampUpperBoundSet();

    // @ts-ignore
    const result: [TimestampUpperBoundSet, number] = service.insertAndAdjustPoints(inputCandInfo, emptySet);

    expect(result[0].snapshot[0].position).toEqual(10.5);
    expect(result[0].snapshot[1].position).toEqual(40.5);
    expect(result[0].snapshot[2].position).toEqual(100);
    expect(result[1]).toEqual(3);
  });

  it('#getPercentages should return 3 candidates with ~ equal percentages', () => {
    const input: CandidateInfo[] = [{name:  '1', job_count: 105}, {name: '2', job_count: 300},
      {name: '3', job_count: 595}];
    // @ts-ignore
    const resultMap: Map<string, number> = service.getPercentages(input);

    expect(resultMap.get('1')).toEqual(10.5);
    expect(resultMap.get('2')).toEqual(30);
    expect(resultMap.get('3')).toEqual(59.5);
  });

  it('#getPercentages should have a candidate with 100', () => {
    const input: CandidateInfo[] = [{name: '1', job_count: 2000}, {name: '2', job_count: 0}];
    // @ts-ignore
    const resultMap: Map<string, number> = service.getPercentages(input);

    expect(resultMap.get('1')).toEqual(100);
  });

  it('#getPercenatges with empty CanditateInfo[]', () => {
    // @ts-ignore
    const resultMap: Map<string, number> = service.getPercentages([]);

    expect(resultMap.size).toBe(0);
  });
});
