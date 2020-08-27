import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Environment} from '../app/models/Data';
import {Project} from '../app/proto/generated/data_pb';

@Injectable({
  providedIn: 'root',
})
export class ProtoBufferServiceStub {
  envs = [
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
  ];

  getEnvs(data: Uint8Array): Environment[] {
    return this.envs;
  }
}
