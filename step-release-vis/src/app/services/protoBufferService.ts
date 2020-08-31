import {Injectable} from '@angular/core';
import {Project} from '../proto/generated/data_pb';
import {Environment} from '../models/Data';

@Injectable({
  providedIn: 'root',
})
export class ProtoBufferService {
  constructor() {}

  getEnvsFromBinary(data: Uint8Array): Environment[] {
    return Project.deserializeBinary(data).toObject().envsList;
  }

  getEnvsFromString(data: string): Environment[] {
    // unsupported with public version of protocol buffers
    console.assert(
      false,
      'getting environments from proto string is unsupported'
    );
    return [];
  }
}
