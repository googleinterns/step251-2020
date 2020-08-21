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
            cands_info: [
              {
                name: '1',
                job_count: 100,
              },
              {
                name: '2',
                job_count: 1000,
              },
              {
                name: '3',
                job_count: 900,
              },
            ],
          },
          {
            timestamp: 900,
            cands_info: [
              {
                name: '2',
                job_count: 2000,
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
}
