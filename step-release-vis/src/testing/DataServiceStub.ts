import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {SampleData} from './SampleData';

@Injectable({
  providedIn: 'root',
})
export class DataServiceStub {
  sampleData = new SampleData();
  data = {
    jsonData: this.sampleData.project,
    protoData: this.sampleData.projectProto,
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
