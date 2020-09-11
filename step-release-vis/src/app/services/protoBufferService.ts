import {Injectable} from '@angular/core';
import {Project as ProjectProto} from '../proto/generated/data_pb';
import {Project} from '../models/Data';

@Injectable({
  providedIn: 'root',
})
export class ProtoBufferService {
  constructor() {}

  getDataFromBinary(data: Uint8Array): Project {
    return ProjectProto.deserializeBinary(data).toObject();
  }

  getDataFromString(data: string): Project {
    // unsupported with public version of protocol buffers
    console.assert(
      false,
      'getting environments from proto string is unsupported'
    );
    return undefined;
  }
}
