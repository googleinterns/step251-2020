/*
 * Copyright 2020 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

import {TestBed} from '@angular/core/testing';

import {DataService} from './dataService';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

describe('DataService', () => {
  let service: DataService;
  let httpMock: HttpTestingController;

  const testProtoRequest = {
    filePath: './test_proto',
    response: 'test_response',
  };
  const testBuf = new Uint8Array([1, 2, 3, 4, 5]);
  const testBinaryRequest = {
    filePath: './test_proto_binary',
    response: arrayBufferToString(testBuf),
  };

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

  it('should read proto from file', done => {
    testRequest(testProtoRequest, done);
  });

  it('should read binary proto from file', done => {
    testRequest(testBinaryRequest, done);
  });

  function testRequest(request, done): void {
    service.getProtoData(request.filePath).subscribe(contents => {
      expect(contents).toEqual(request.response);
      done();
    });
    const req = httpMock.expectOne(request.filePath);
    expect(req.request.method).toBe('GET');
    req.flush(request.response);
  }

  it('should read proto from local storage', done => {
    const data = 'this is a proto test data';
    window.localStorage.setItem('data', data);
    service.getLocalProtoData().subscribe(result => {
      expect(result).toEqual(data);
      window.localStorage.removeItem('data');
      done();
    });
  });

  it('should read binary data from local storage', done => {
    window.localStorage.setItem('binary_data', arrayBufferToString(testBuf));
    service.getLocalProtoBinaryData().subscribe(result => {
      expect(new Uint8Array(result)).toEqual(testBuf);
      window.localStorage.removeItem('binary_data');
      done();
    });
  });

  it('should read json data from local storage', done => {
    const data = 'this is a json test data';
    window.localStorage.setItem('json_data', data);
    service.getLocalJsonData().subscribe(result => {
      expect(result).toEqual(data);
      window.localStorage.removeItem('json_data');
      done();
    });
  });

  function arrayBufferToString(buf: ArrayBuffer): string {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }
});
