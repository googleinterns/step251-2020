import {Injectable} from '@angular/core';
import {Candidate} from '../models/Candidate';
import {CandidateService} from './candidateService';

@Injectable({
  providedIn: 'root',
})
export class ColoringService {
  /*
   * Colors candidates by looking at the pairs of candidates appearing the most next to each other
   * and coloring the candidates iteratively.
   * O(edges * log edges + candidates)
   */
  private noOfCandidates: number;
  private candNames: Set<string>;
  candidateGraph: Map<string, string[]> = new Map(); // what candidates share sides?
  private colorOf: Map<string, number> = new Map(); // what index has the color which is assigned to the candidate?
  edgeOccurrences: Map<string, number> = new Map(); // how many sides do candidates share?
  colorsComputed = false;

  constructor(private candidateService: CandidateService) {}

  colorCandidates(edges: Map<string, number>, candNames: Set<string>): void {
    this.candidateGraph.clear();
    this.colorOf.clear();
    this.edgeOccurrences.clear();
    this.colorsComputed = false;

    this.initialize(edges, candNames);
    this.assignColors();
  }

  initialize(edges: Map<string, number>, candNames: Set<string>): void {
    this.candNames = candNames;
    this.noOfCandidates = this.candNames.size;
    this.constructGraph(edges);
    this.colorsComputed = false;
  }

  /* Add y to the list of neighbours of x */
  private addEdgeToGraph(x: string, y: string): void {
    let neighbours: string[] = [];
    if (this.candidateGraph.has(x)) {
      neighbours = this.candidateGraph.get(x);
    }
    if (neighbours.includes(y) === false) {
      neighbours.push(y);
    }
    this.candidateGraph.set(x, neighbours);
  }

  /* Sets edges and constructs graph */
  private constructGraph(edges: Map<string, number>): void {
    for (const edgeKeyValue of edges) {
      this.edgeOccurrences.set(edgeKeyValue[0], edgeKeyValue[1]);

      const edge: CandidateEdge = CandidateEdge.fromKey(edgeKeyValue[0]);

      this.addEdgeToGraph(edge.candidate1, edge.candidate2);
      this.addEdgeToGraph(edge.candidate2, edge.candidate1);
    }
  }

  /* Splits the color palette like so
   * |--0--|--1--|--2--|--3--|
   * 0                      360
   */
  private selectAssignableColors(): number[] {
    const chunkSize = 360 / this.noOfCandidates;
    const colors: number[] = [];
    for (let index = 0; index < this.noOfCandidates; index++) {
      const color = chunkSize * index + chunkSize / 2;
      colors.push(color);
    }
    return colors;
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

  static fromKey(key: string): CandidateEdge {
    return new CandidateEdge('a', 'b');
  }

  toKey(): string {
    return this.candidate1 + '-this is a key-' + this.candidate2;
  }
}
