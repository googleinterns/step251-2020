import {TestBed} from '@angular/core/testing';

import {DataService} from './dataService';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('DataService', () => {
  let service: DataService;
  const testRequest = {
    filePath: './test',
    response: 'test_response',
  };
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(DataService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should read proto from file', () => {
    service
      .getProtoData(testRequest.filePath)
      .subscribe(contents => expect(contents).toEqual(testRequest.response));
    const req = httpMock.expectOne(testRequest.filePath);
    expect(req.request.method).toBe('GET');
    req.flush(testRequest.response);
  });

  it('should read proto from local storage', done => {
    window.localStorage.setItem('data', 'this is a test');
    service.getLocalProtoData().subscribe(result => {
      expect(result).toEqual('this is a test');
      done();
    });
  });

  // TODO(#223): complete test cases
  it('should read binary proto from file');
  it('should read binary data from local storage');
  it('should read json data from local storage');
});
