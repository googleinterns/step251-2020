import {TestBed} from '@angular/core/testing';

import {FileService} from './file';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('FileService', () => {
  let service: FileService;
  const testRequest = {
    filePath: './test',
    response: 'test_response',
  };
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(FileService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should read existing file', () => {
    service
      .readContents(testRequest.filePath)
      .subscribe(contents => expect(contents).toEqual(testRequest.response));
    const req = httpMock.expectOne(testRequest.filePath);
    expect(req.request.method).toBe('GET');
    req.flush(testRequest.response);
  });

  it('should return existing data', done => {
    window.localStorage.setItem('data', 'this is a test');
    service.getData().subscribe(result => {
      expect(result).toEqual('this is a test');
      done();
    });
  });
});
