import {Injectable} from '@angular/core';
import {Project as ProjectProto} from '../proto/generated/data_pb';
import {Environment, Project} from '../models/Data';

@Injectable({
  providedIn: 'root',
})
export class ProtoBufferService {
  constructor() {}

  getDataFromBinary(): Project {
    //return ProjectProto.deserializeBinary(data).toObject();
    return undefined;
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
