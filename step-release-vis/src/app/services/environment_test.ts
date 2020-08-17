import { TestBed } from '@angular/core/testing';

import { EnvironmentService } from './environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CandidateInfo } from '../models/Data';

function fractionalEqual(x: number, y: number): boolean {
  const relError: number = (x - y) / x;
  return ((relError > -Math.pow(10, -7)) && (relError < Math.pow(10, -7)));
}


describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EnvironmentService);
  });

  // TODO(naoai): write getPolygons test
  it('#getPercentages should return 3 candidates with ~ equal percentages', () => {
    const input: CandidateInfo[] = [{name:  '1', job_count: 666}, {name: '2', job_count: 667},
      {name: '3', job_count: 667}];
    // @ts-ignore
    const resultMap: Map<string, number> = service.getPercentages(input);

    console.log(resultMap.get('1'));

    expect(fractionalEqual(resultMap.get('1'), 33.3)).toBe(true);
    expect(fractionalEqual(resultMap.get('2'), 33.35)).toBe(true);
    expect(fractionalEqual(resultMap.get('3'), 33.35)).toBe(true);
  });

  it('#getPercentages should have a candidate with 100', () => {
    const input: CandidateInfo[] = [{name: '1', job_count: 2000}, {name: '2', job_count: 0}];
    // @ts-ignore
    const resultMap: Map<string, number> = service.getPercentages(input);

    expect(resultMap.get('1')).toEqual(100);
  });
});
