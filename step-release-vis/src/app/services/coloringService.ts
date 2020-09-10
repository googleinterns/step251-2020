import {Injectable} from '@angular/core';
import {CandidateService} from './candidateService';

@Injectable({
  providedIn: 'root',
})
export class ColoringService {
  /*
   * Colors candidates by looking at the pairs of candidates appearing the most next to each other
   * and coloring the candidates iteratively.
   * O(edges * log edges + candidates * log candidates)
   */
  noOfCandidates: number;
  candNames: Set<string>;
  candidateGraph: Map<string, string[]> = new Map(); // what candidates share sides?
  colorOf: Map<string, number> = new Map(); // what index has the color which is assigned to the candidate?
  edgeOccurrences: Map<string, number> = new Map(); // how many sides do candidates share?
  colorsComputed = false;
  readonly CAND_COLOR_LIMIT = 75;

  constructor(private candidateService: CandidateService) {}

  getColorFromIndex(index: number): number {
    const chunkSize = 360 / this.noOfCandidates;
    const color = chunkSize * index + chunkSize / 2;
    return color;
  }

  colorCandidates(edges: Map<string, number>, candNames: Set<string>): void {
    this.colorsComputed = false;

    this.initialize(edges, candNames);
    this.assignColorIndices();

    this.saveColors(this.pairCandidatesToColors(this.selectAssignableColors()));
    this.colorsComputed = true;
  }

  initialize(edges: Map<string, number>, candNames: Set<string>): void {
    this.candidateGraph.clear();
    this.colorOf.clear();
    this.edgeOccurrences.clear();
    this.colorsComputed = false;

    this.candNames = candNames;
    this.noOfCandidates = this.candNames.size;

    this.constructGraph(edges);
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

  /* Chooses color index for a candidate by looking at the colors of its neighbours
   * Takes the middle of the largest color interval.
   * The indexes represent the ordering, so they won't be necessarily integers.
   */
  private selectColorIndex(candidate: string): void {
    const edges = this.candidateGraph.get(candidate);
    const neighboursColors: number[] = [];

    for (const neighbour of edges) {
      if (this.colorOf.has(neighbour) === true) {
        neighboursColors.push(this.colorOf.get(neighbour));
      }
    }

    if (neighboursColors.length === 0) {
      this.colorOf.set(candidate, 0);
      return;
    }

    neighboursColors.sort();

    let answer = -1;
    let largestSpace = 0;
    // Get the color in the middle of the largest space
    for (let i = 0; i < neighboursColors.length - 1; i++) {
      const distance = neighboursColors[i + 1] - neighboursColors[i];
      if (distance > largestSpace) {
        largestSpace = distance;
        answer = (neighboursColors[i + 1] + neighboursColors[i]) / 2;
      }
    }

    // Since color range is circular, check the interval between [end, start]
    const smallest = neighboursColors[0];
    const largest = neighboursColors[neighboursColors.length - 1];

    if (smallest + this.noOfCandidates - largest > largestSpace) {
      answer = (largest + smallest + this.noOfCandidates) / 2;
      if (answer >= this.noOfCandidates) {
        answer -= this.noOfCandidates;
      }
      largestSpace = smallest + this.noOfCandidates - largest;
    }

    this.colorOf.set(candidate, answer);
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
  private pairCandidatesToColors(colors: number[]): CandidateColor[] {
    const answer: CandidateColor[] = [];
    console.log(this.noOfCandidates);
    if (this.noOfCandidates > this.CAND_COLOR_LIMIT) {
      for (const cand of this.colorOf) {
        answer.push(
          new CandidateColor(cand[0], this.getColorFromIndex(cand[1]))
        );
      }
    } else {
      const relativeOrder: CandidateColor[] = [];
      for (const cand of this.colorOf) {
        relativeOrder.push(new CandidateColor(cand[0], cand[1]));
      }

      relativeOrder.sort((a, b) => a.compare(b));

      for (let i = 0; i < relativeOrder.length; i++) {
        answer.push(new CandidateColor(relativeOrder[i].candidate, colors[i]));
      }
    }

    return answer;
  }

  /* Stores the colored candidates in the candidateService */
  saveColors(candidateColors: CandidateColor[]): void {
    for (const cand of candidateColors) {
      this.candidateService.addCandidate(cand.color, cand.candidate);
    }
  }

  /* Decide on the order and select indices for candidates.
   * The edge with the most occurrences has the highest priority.
   */
  assignColorIndices(): void {
    for (const cand of this.candNames) {
      if (this.candidateGraph.has(cand) === false) {
        this.colorOf.set(cand, 0);
      }
    }

    const edges: CandidateEdge[] = [];
    for (const edge of this.edgeOccurrences) {
      const candEdge = CandidateEdge.fromKey(edge[0]);
      edges.push(
        new CandidateEdge(candEdge.candidate1, candEdge.candidate2, edge[1])
      );
    }

    edges.sort((a: CandidateEdge, b: CandidateEdge) => {
      if (a.occurrences > b.occurrences) {
        return -1;
      }
      if (a.occurrences < b.occurrences) {
        return 1;
      }
      return 0;
    });

    for (const edge of edges) {
      if (this.colorOf.has(edge.candidate1) === false) {
        this.selectColorIndex(edge.candidate1);
      }
      if (this.colorOf.has(edge.candidate2) === false) {
        this.selectColorIndex(edge.candidate2);
      }
    }
  }
}

export class CandidateColor {
  candidate: string;
  color: number;

  constructor(cand: string, color: number) {
    this.candidate = cand;
    this.color = color;
  }

  compare(that: CandidateColor): number {
    if (this.color < that.color) {
      return -1;
    } else if (this.color > that.color) {
      return 1;
    } else if (this.candidate < that.candidate) {
      return -1;
    } else if (this.candidate > that.candidate) {
      return 1;
    } else {
      return 0;
    }
  }
}

export class CandidateEdge {
  static readonly separator = '\n';
  candidate1: string;
  candidate2: string;
  occurrences: number;

  constructor(x: string, y: string, occ?: number) {
    this.candidate1 = x;
    this.candidate2 = y;
    this.occurrences = occ;
  }

  static fromKey(key: string): CandidateEdge {
    const cands: string[] = key.split(this.separator);
    return new CandidateEdge(cands[0], cands[1]);
  }

  toKey(): string {
    return this.candidate1 + CandidateEdge.separator + this.candidate2;
  }
}
