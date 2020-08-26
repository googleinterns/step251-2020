import {Component, OnInit} from '@angular/core';
import {Environment} from '../../models/Data';
import {FileService} from '../../services/file';
import {CandidateService} from '../../services/candidate';
import {shuffle} from 'lodash';
import {TimelinePoint} from '../../models/TimelinePoint';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.html',
  styleUrls: ['./environments.css'],
})
export class EnvironmentsComponent implements OnInit {
  environments: Environment[];
  envWidth: number;
  envHeight: number;
  minTimestamp: number;
  maxTimestamp: number;
  envJson: string;
  timelinePointWidth = 200;
  timelinePointsAmount: number;
  timelinePoints: TimelinePoint[];

  constructor(
    private fileService: FileService,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.fileService.getData().subscribe(envJson => {
      this.envJson = envJson;
      if (this.envJson) {
        this.processEnvironments(JSON.parse(this.envJson));
      }
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
    this.timelinePointsAmount = Math.floor(
      this.envWidth / this.timelinePointWidth
    );
    this.environments = environments;
    const candNames = new Set<string>();
    let minTimestamp = Number.MAX_VALUE;
    let maxTimestamp = 0;
    for (const environment of this.environments) {
      for (const snapshot of environment.snapshots) {
        minTimestamp = Math.min(minTimestamp, snapshot.timestamp);
        maxTimestamp = Math.max(maxTimestamp, snapshot.timestamp);
        for (const candsInfo of snapshot.candsInfo) {
          candNames.add(candsInfo.candidate);
        }
      }
    }
    this.minTimestamp = minTimestamp;
    this.maxTimestamp = maxTimestamp;
    this.timelinePoints = [];
    const chunkSize = (maxTimestamp - minTimestamp) / this.timelinePointsAmount;
    for (let i = 0; i < this.timelinePointsAmount; i++) {
      const relativeTimestamp = chunkSize * i + chunkSize / 2;
      this.timelinePoints.push(
        new TimelinePoint(
          minTimestamp + relativeTimestamp,
          this.candidateService.scale(
            relativeTimestamp,
            0,
            maxTimestamp - minTimestamp,
            0,
            this.envWidth
          )
        )
      );
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
