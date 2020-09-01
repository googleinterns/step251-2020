import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Environment} from '../app/models/Data';
import {Project} from '../app/proto/generated/data_pb';
import {SampleData} from './SampleData';

@Injectable({
  providedIn: 'root',
})
export class ProtoBufferServiceStub {
  envs = new SampleData().envs;

  getEnvsFromBinary(data: Uint8Array): Environment[] {
    return this.envs;
  }

  getEnvsFromString(data: Uint8Array): Environment[] {
    return this.envs;
  }
}
