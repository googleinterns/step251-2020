import {TestBed} from '@angular/core/testing';

import {ProtoBufferService} from './proto_buffer';

describe('ProtoBufferServiceService', () => {
  let service: ProtoBufferService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProtoBufferService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
