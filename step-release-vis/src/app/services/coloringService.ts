import {Injectable} from '@angular/core';
import {Candidate} from '../models/Candidate';
import {CandidateService} from './candidateService';

@Injectable({
  providedIn: 'root',
})
export class ColoringService {
  colorsComputed = false;

  constructor(private candidateService: CandidateService) {}

  /* Decides on the colors for all candidates */
  private pairCandidatesToColors(): CandidateColor[] {
    // TODO(#271): implement this
    return [];
  }

  assignColors(): void {
    // TODO(#271): implement this
    this.pairCandidatesToColors();
    this.colorsComputed = true;
  }
}

export class CandidateColor {
  candidate: string;
  color: number;

  constructor(cand: string, color: number) {
    this.candidate = cand;
    this.color = color;
  }
}
