import { TestBed } from '@angular/core/testing';

import { EnvironmentService } from './environment';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EnvironmentService', () => {
  let service: EnvironmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(EnvironmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
