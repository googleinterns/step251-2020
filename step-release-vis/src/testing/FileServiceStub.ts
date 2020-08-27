import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Environment} from '../app/models/Data';

@Injectable({
  providedIn: 'root',
})
export class FileServiceStub {
  jsonUri = 'env.json';

  files = {
    [this.jsonUri]: [
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
  };

  readContents(filePath: string): Observable<Environment[]> {
    return of(this.files[filePath]);
  }

  getData(): Observable<string> {
    return of(JSON.stringify(this.files[this.jsonUri]));
  }
}
