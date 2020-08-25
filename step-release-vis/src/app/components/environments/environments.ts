import {Component, OnInit} from '@angular/core';
import {Environment} from '../../models/Data';
import {FileService} from '../../services/file';
import {ParamService} from '../../services/param';
import {ActivatedRoute} from '@angular/router';
import {CandidateService} from '../../services/candidate';
import {shuffle} from 'lodash';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.html',
  styleUrls: ['./environments.css'],
})
export class EnvironmentsComponent implements OnInit {
  environments: Environment[];
  jsonUri: string;
  envWidth: number;
  envHeight: number;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private paramService: ParamService,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.paramService.param(this.route, 'jsonUri', '').subscribe(jsonUri => {
      this.jsonUri = jsonUri;
      this.fileService
        .readContents<Environment[]>(this.jsonUri)
        .subscribe(environments => this.processEnvironments(environments));
    });
  }

  /**
   * Assigns each candidate a unique color and adds the candidate to the service.
   *
   * @param environments an array of environments
   */
  private processEnvironments(environments: Environment[]): void {
    this.envWidth = window.innerWidth;
    this.envHeight = window.innerHeight / environments.length;
    this.environments = environments;
    const candNames = new Set<string>();
    for (const environment of this.environments) {
      for (const snapshot of environment.snapshots) {
        for (const candsInfo of snapshot.candsInfo) {
          candNames.add(candsInfo.candidate);
        }
      }
    }
    const shuffledIndices = shuffle(this.increasingSequence(0, candNames.size));
    [...candNames].forEach((name, index) => {
      const color = this.getHue(shuffledIndices[index], candNames.size);
      this.candidateService.addCandidate(color, name);
    });
  }

  /**
   * Generates a hue for an HSL color by splitting the range 0..360 into
   * `amount` number of chunks.
   *
   * e.g. amount = 4
   * |--0--|--1--|--2--|--3--|
   * 0                      360
   *
   * @param index the index of the color
   * @param amount amount of colors
   */
  private getHue(index: number, amount: number): number {
    const chunkSize = 360 / amount;
    return Math.floor(chunkSize * index + chunkSize / 2);
  }

  /**
   * Returns an array of `length` numbers, starting from `start` and increasing by one.
   *
   * @param start the first element of the sequence
   * @param length amount of elements
   */
  private increasingSequence(start: number, length: number): number[] {
    const res: number[] = [];
    for (let i = start; i < start + length; i++) {
      res.push(i);
    }
    return res;
  }
}
