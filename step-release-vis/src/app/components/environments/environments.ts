import {Component, OnInit} from '@angular/core';
import {Environment} from '../../models/Data';
import {FileService} from '../../services/file';
import {CandidateService} from '../../services/candidate';
import {shuffle} from 'lodash';
import {TimelinePoint} from '../../models/TimelinePoint';
import {Project} from '../../proto/generated/data_pb';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.html',
  styleUrls: ['./environments.css'],
})
export class EnvironmentsComponent implements OnInit {
  environments: Environment[];
  envWidth: number;
  envHeight: number;
  envRightMargin = 100;
  envsPerPage = 7;
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
    // this.readJson();
    this.readBinary();
  }

  // For debugging purposes
  private readJson(): void {
    this.fileService.getData().subscribe(envJson => {
      this.envJson = envJson;
      if (this.envJson) {
        this.processEnvironments(JSON.parse(this.envJson));
      }
    });
  }

  private readBinary(): void {
    // TODO(#202): read from localStorage
    this.envJson = '1'; // to suppress empty localStorage
    this.fileService.readBinaryContents('assets/cal90d.pb').subscribe(data => {
      const project: Project.AsObject = Project.deserializeBinary(
        data
      ).toObject();
      this.processEnvironments(
        project.envsList.map(env => {
          env.snapshotsList = env.snapshotsList
            .slice(0, 10) // TODO(#204): add custom time range and sparse timestamps
            .sort((s1, s2) => s1.timestamp.seconds - s2.timestamp.seconds); // The received timestamps are not sorted
          return env;
        })
      );
    });
  }

  /**
   * Assigns each candidate a unique color and adds the candidate to the service.
   *
   * @param environments an array of environments
   */
  private processEnvironments(environments: Environment[]): void {
    this.envWidth = window.innerWidth - this.envRightMargin;
    this.envHeight = window.innerHeight / this.envsPerPage;
    this.timelinePointsAmount = Math.floor(
      this.envWidth / this.timelinePointWidth
    );
    this.environments = environments;
    const candNames = new Set<string>();
    let minTimestamp = Number.MAX_VALUE;
    let maxTimestamp = 0;
    for (const environment of this.environments) {
      for (const snapshot of environment.snapshotsList) {
        minTimestamp = Math.min(minTimestamp, snapshot.timestamp.seconds);
        maxTimestamp = Math.max(maxTimestamp, snapshot.timestamp.seconds);
        for (const candsInfo of snapshot.candidatesList) {
          candNames.add(candsInfo.candidate);
        }
      }
    }
    this.minTimestamp = minTimestamp;
    this.maxTimestamp = maxTimestamp;
    this.timelinePoints = [];
    const timelineChunkSize =
      (maxTimestamp - minTimestamp) / this.timelinePointsAmount;
    for (let i = 0; i <= this.timelinePointsAmount; i++) {
      const relativeTimestamp = timelineChunkSize * i;
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
