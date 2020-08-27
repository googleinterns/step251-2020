import {Injectable} from '@angular/core';
import {Project} from '../proto/generated/data_pb';
import {Environment} from '../models/Data';

@Injectable({
  providedIn: 'root',
})
export class ProtoBufferService {
  constructor() {}

  getEnvs(data: Uint8Array): Environment[] {
    return Project.deserializeBinary(data).toObject().envsList;
  }
}
