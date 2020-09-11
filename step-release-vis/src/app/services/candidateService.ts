import {Injectable} from '@angular/core';
import {Candidate} from '../models/Candidate';
import {Polygon} from '../models/Polygon';
import {CandidateMetadata} from '../models/Data';

@Injectable({
  providedIn: 'root',
})
export class CandidateService {
  highlightReleases = true;
  cands: Map<string, Candidate>;
  inRelease: Map<string, string>; // in which release is the candidate?
  releaseCandidates: Map<string, string[]>; // what are the candidates of the release?

  constructor() {
    this.cands = new Map();
    this.inRelease = new Map();
    this.releaseCandidates = new Map();
  }

  getColor(candName: string): number {
    return this.cands.get(candName).color;
  }

  addCandidate(color: number, name: string): void {
    // if the candidate already exists, just update the color
    if (this.cands.has(name)) {
      const existingCandidate: Candidate = this.cands.get(name);
      existingCandidate.color = color;
    } else {
      this.cands.set(name, new Candidate(name, color));
    }
  }

  addPolygons(polygons: Polygon[]): void {
    for (const polygon of polygons) {
      if (this.cands.has(polygon.candName)) {
        this.cands.get(polygon.candName).addPolygon(polygon);
      } else {
        this.addCandidate(polygon.colorHue, polygon.candName);
        this.cands.get(polygon.candName).addPolygon(polygon);
      }
    }
  }

  polygonHovered(polygon: Polygon): void {
    if (this.highlightReleases === true) {
      const release = this.inRelease.get(polygon.candName);
      const candsToHighlight: Candidate[] = this.releaseCandidates
        .get(release)
        .map(name => this.cands.get(name));
      candsToHighlight.forEach(cand => cand.highlight());
    } else {
      this.cands.get(polygon.candName).highlight();
    }
  }

  polygonUnhovered(polygon: Polygon): void {
    if (this.highlightReleases === true) {
      const release = this.inRelease.get(polygon.candName);
      const candsToHighlight: Candidate[] = this.releaseCandidates
        .get(release)
        .map(name => this.cands.get(name));
      candsToHighlight.forEach(cand => cand.dehighlight());
    } else {
      this.cands.get(polygon.candName).dehighlight();
    }
  }

  processMetadata(candsMetadata: CandidateMetadata[]): void {
    console.log(candsMetadata.length);
    for (const candMetadata of candsMetadata) {
      const candName = candMetadata.candidate;
      const release = candMetadata.release;
      // set the release for the candidate
      this.inRelease.set(candName, release);

      // add candidate to release list
      let candsOfRelease: string[] = [];
      if (this.releaseCandidates.has(release)) {
        candsOfRelease = this.releaseCandidates.get(release);
      }
      candsOfRelease.push(candName);
      this.releaseCandidates.set(release, candsOfRelease);
      console.log(release, candsOfRelease.length);
    }
  }

  /**
   * Scales a value from one range to another.
   *
   * @param value the value to scale
   * @param inStart start of the input interval
   * @param inEnd end of the input interval
   * @param outStart start of the output interval
   * @param outEnd end of the output interval
   */
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

  /**
   * Returns a sparse version of the provided array. Contains min(max, array.length) elements.
   *
   * @param max maximum amount of elements in resulting array
   * @param array the array
   * @param includeLast whether the last element of the array must be included
   */
  sparseArray<T>(max: number, array: T[], includeLast = false): T[] {
    if (array.length <= max) {
      return array;
    }
    const res: T[] = [];
    for (let i = 0; i < max; i++) {
      let index = Math.floor(this.scale(i, 0, max, 0, array.length));
      if (includeLast && i === max - 1) {
        index = array.length - 1;
      }
      res.push(array[index]);
    }
    return res;
  }
}
