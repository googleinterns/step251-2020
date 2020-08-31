import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataServiceStub {
  data = {
    jsonData: [
      {
        name: 'prod',
        snapshotsList: [
          {
            timestamp: {
              seconds: 125,
              nanos: 0,
            },
            candidatesList: [
              {
                candidate: '1',
                jobCount: 100,
              },
              {
                candidate: '2',
                jobCount: 1000,
              },
              {
                candidate: '3',
                jobCount: 900,
              },
            ],
          },
          {
            timestamp: {
              seconds: 1000,
              nanos: 0,
            },
            candidatesList: [
              {
                candidate: '2',
                jobCount: 1000,
              },
            ],
          },
          {
            timestamp: {
              seconds: 900,
              nanos: 0,
            },
            candidatesList: [
              {
                candidate: '2',
                jobCount: 2000,
              },
            ],
          },
        ],
      },
    ],

    // TODO(#223): add proto data
    protoData: '',
  };

  getProtoData = this.getLocalProtoData;

  getBinaryProtoData = this.getLocalProtoBinaryData;

  getLocalProtoData(): Observable<string> {
    return of(this.data.protoData);
  }

  getLocalProtoBinaryData(): Observable<ArrayBuffer> {
    return of(new Uint8Array());
  }

  getLocalJsonData(): Observable<string> {
    return of(JSON.stringify(this.data.jsonData));
  }
}
