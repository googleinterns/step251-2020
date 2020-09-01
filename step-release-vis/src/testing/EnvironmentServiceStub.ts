import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Polygon} from '../app/models/Polygon';
import {Environment} from '../app/models/Data';
import {SampleData} from './SampleData';

@Injectable({
  providedIn: 'root',
})
export class EnvironmentServiceStub {
  sampleData = new SampleData();
  env = this.sampleData.envs[0];

  candName = this.sampleData.testCandName;
  polygons = this.sampleData.getPolygons();

  polyMinTimestamp = this.sampleData.polyMinTimestamp;
  polyMaxTimestamp = this.sampleData.polyMaxTimestamp;

  getPolygons(environment: Environment): Observable<Polygon[]> {
    return of(new SampleData().getPolygons());
  }
}
