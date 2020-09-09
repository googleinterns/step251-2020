import {TestBed} from '@angular/core/testing';

import {ColoringService} from './coloringService';

describe('ColoringService', () => {
  let service: ColoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
