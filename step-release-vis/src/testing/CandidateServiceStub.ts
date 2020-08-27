import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Polygon} from '../app/models/Polygon';
import {EnvironmentService} from '../app/services/environment';
import {Environment} from '../app/models/Data';
import {Candidate} from '../app/models/Candidate';

@Injectable({
  providedIn: 'root',
})
export class CandidateServiceStub {
  candColors = new Map<string, number>();

  getColor(candName: string): number {
    return 0;
  }

  addPolygons(polygons: Polygon[]): void {}

  polygonHovered(polygon: Polygon): void {
    polygon.highlight = true;
  }

  polygonUnhovered(polygon: Polygon): void {
    polygon.highlight = false;
  }

  addCandidate(color: number, name: string): void {
    this.candColors.set(name, color);
  }

  scale(
    value: number,
    inStart: number,
    inEnd: number,
    outStart: number,
    outEnd: number
  ): number {
    return (
      ((value - inStart) * (outEnd - outStart)) / (inEnd - inStart) + outStart
    );
  }
}
