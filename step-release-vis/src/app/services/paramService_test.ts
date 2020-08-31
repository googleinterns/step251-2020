import {TestBed} from '@angular/core/testing';

import {ParamService} from './paramService';
import {ActivatedRouteStub} from '../../testing/ActivatedRouteStub';

describe('ParamService', () => {
  let service: ParamService;
  let activatedRouteStub: ActivatedRouteStub;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParamService);
    activatedRouteStub = new ActivatedRouteStub({
      testParam: 'testValue',
    });
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('params should be present', done => {
    service
      .param(activatedRouteStub as any, 'testParam', '')
      .subscribe(testValue => {
        expect(testValue).toEqual('testValue');
        done();
      });
  });

  it('non provided param should be absent', done => {
    service
      .param(activatedRouteStub as any, 'no_param_provided', '')
      .subscribe(testValue => {
        expect(testValue).toEqual('');
        done();
      });
  });
});
