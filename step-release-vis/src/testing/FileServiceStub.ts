import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Polygon} from '../app/models/Polygon';
import {EnvironmentService} from '../app/services/environment';
import {Environment} from '../app/models/Data';

@Injectable({
  providedIn: 'root',
})
export class FileServiceStub {
  jsonUri = 'env.json';

  files = {
    [this.jsonUri]: [
      {
        environment: 'prod',
        snapshots: [
          {
            timestamp: 125,
            candsInfo: [
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
            timestamp: 900,
            candsInfo: [
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
