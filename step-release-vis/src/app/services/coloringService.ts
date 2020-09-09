import {Injectable} from '@angular/core';
import {Candidate} from '../models/Candidate';
import {CandidateService} from './candidateService';

@Injectable({
  providedIn: 'root',
})
export class ColoringService {
  colorsComputed = false;
  private edgeOccurrences: Map<string, number> = new Map();

  constructor(private candidateService: CandidateService) {}

  colorCandidates(edges: Map<string, number>): void {
    // TODO(#271): implement this
    this.colorsComputed = false;
    this.initialize(edges);
    this.assignColors();
  }

  private initialize(edges: Map<string, number>): void {
    // TODO(#271)
  }

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

export class CandidateEdge {
  candidate1: string;
  candidate2: string;

  constructor(x: string, y: string) {
    this.candidate1 = x;
    this.candidate2 = y;
  }

  toKey(): string {
    return this.candidate1 + '-this is a key-' + this.candidate2;
  }
}
