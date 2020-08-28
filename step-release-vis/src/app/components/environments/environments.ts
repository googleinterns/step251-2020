import {Component, OnInit} from '@angular/core';
import {Environment} from '../../models/Data';
import {FileService} from '../../services/file';
import {ProtoBufferService} from '../../services/proto_buffer';
import {CandidateService} from '../../services/candidate';
import {shuffle} from 'lodash';
import {TimelinePoint} from '../../models/TimelinePoint';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.html',
  styleUrls: ['./environments.css'],
})
export class EnvironmentsComponent implements OnInit {
  readonly ENVS_PER_PAGE = 7;
  readonly ENV_RIGHT_MARGIN = 100;
  readonly TIMELINE_POINT_WIDTH = 200;
  readonly WEEK_SECONDS = 7 * 24 * 60 * 60;

  environments: Environment[];
  envWidth: number;
  envHeight: number;

  minTimestamp: number; // min timestamp across every environment
  maxTimestamp: number; // max timestamp across every environment
  startTimestamp: number; // current start timestamp
  endTimestamp: number; // current end timestamp

  envJson: string;
  timelinePointsAmount: number;
  timelinePoints: TimelinePoint[];

  constructor(
    private fileService: FileService,
    private candidateService: CandidateService,
    private protoBufferService: ProtoBufferService
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
    this.fileService.getBinaryData().subscribe(data => {
      const envs = this.protoBufferService.getEnvs(data as Uint8Array);
      this.processEnvironments(
        envs.map(env => {
          // The received timestamps are not sorted
          env.snapshotsList = env.snapshotsList.sort(
            (s1, s2) => s1.timestamp.seconds - s2.timestamp.seconds
          );
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
    this.envWidth = window.innerWidth - this.ENV_RIGHT_MARGIN;
    this.envHeight = window.innerHeight / this.ENVS_PER_PAGE;
    this.timelinePointsAmount = Math.floor(
      this.envWidth / this.TIMELINE_POINT_WIDTH
    );
    this.environments = environments;

    let minTimestamp = Number.MAX_VALUE;
    let maxTimestamp = 0;
    for (const environment of this.environments) {
      for (const snapshot of environment.snapshotsList) {
        minTimestamp = Math.min(minTimestamp, snapshot.timestamp.seconds);
        maxTimestamp = Math.max(maxTimestamp, snapshot.timestamp.seconds);
      }
    }
    this.minTimestamp = minTimestamp;
    this.maxTimestamp = maxTimestamp;

    this.onTimeRangeUpdate(
      this.maxTimestamp - this.WEEK_SECONDS,
      this.maxTimestamp
    );
  }

  /**
   * Updates the timeline with new start and end values (caught by child in ngOnChanges).
   */
  onTimeRangeUpdate(startTimestamp, endTimestamp): void {
    this.startTimestamp = startTimestamp;
    this.endTimestamp = endTimestamp;

    const candNames = new Set<string>();
    for (const environment of this.environments) {
      for (const snapshot of environment.snapshotsList) {
        for (const candsInfo of snapshot.candidatesList) {
          if (
            snapshot.timestamp.seconds >= this.startTimestamp &&
            snapshot.timestamp.seconds <= this.endTimestamp
          ) {
            candNames.add(candsInfo.candidate);
          }
        }
      }
    }

    this.timelinePoints = [];
    const timelineChunkSize =
      (this.endTimestamp - this.startTimestamp) / this.timelinePointsAmount;
    for (let i = 0; i <= this.timelinePointsAmount; i++) {
      const relativeTimestamp = timelineChunkSize * i;
      this.timelinePoints.push(
        new TimelinePoint(
          this.startTimestamp + relativeTimestamp,
          this.candidateService.scale(
            relativeTimestamp,
            0,
            this.endTimestamp - this.startTimestamp,
            0,
            this.envWidth
          )
        )
      );
    }
    const shuffledIndices = shuffle(this.increasingSequence(0, candNames.size)); // mapping to shuffle the colors
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
