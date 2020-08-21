import {TestBed} from '@angular/core/testing';

import {CandidateService} from './candidate';

describe('CandidateService', () => {
  let service: CandidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // TODO(#171): Add tests for polygonHovered/Unhovered.
});
