import {Component, OnInit} from '@angular/core';
import {Environment} from '../../models/Data';
import {DataService} from '../../services/dataService';
import {ProtoBufferService} from '../../services/protoBufferService';
import {CandidateService} from '../../services/candidateService';
import {shuffle} from 'lodash';
import {TimelinePoint} from '../../models/TimelinePoint';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.html',
  styleUrls: ['./environments.css'],
})
export class EnvironmentsComponent implements OnInit {
  readonly ENVS_PER_PAGE = 30;
  readonly ENVS_PER_PAGE_EXPANDED = 5;
  readonly ENV_RIGHT_MARGIN = 100;
  readonly TIMELINE_POINT_WIDTH = 130;
  readonly WEEK_SECONDS = 7 * 24 * 60 * 60;
  readonly TZ_OFFSET = new Date().getTimezoneOffset() * 60;
  readonly START_TIMESTAMP_KEY = 'start_timestamp';
  readonly END_TIMESTAMP_KEY = 'end_timestamp';

  environments: Environment[];

  envSmallWidth: number;
  envSmallHeight: number;
  envBigWidth: number;
  envBigHeight: number;

  minTimestamp: number; // min timestamp across every environment
  maxTimestamp: number; // max timestamp across every environment
  startTimestamp: number; // current start timestamp
  endTimestamp: number; // current end timestamp

  dataFound: boolean;
  timelinePointsAmount: number;
  timelinePoints: TimelinePoint[];

  constructor(
    private dataService: DataService,
    private candidateService: CandidateService,
    private protoBufferService: ProtoBufferService
  ) {}

  ngOnInit(): void {
    this.readProtoBinaryData();
  }

  private readProtoData(): void {
    this.readData(this.dataService.getLocalProtoData, data =>
      this.protoBufferService.getEnvsFromString(data)
    );
  }

  private readProtoBinaryData(): void {
    this.readData(this.dataService.getLocalProtoBinaryData, data =>
      this.protoBufferService.getEnvsFromBinary(data as Uint8Array)
    );
  }

  // For debugging purposes
  private readJsonData(): void {
    this.readData(this.dataService.getLocalJsonData, data => JSON.parse(data));
  }

  private readData<T>(
    dataProvider: () => Observable<T>,
    data2env: (a: T) => Environment[]
  ): void {
    dataProvider().subscribe(data => {
      if (data) {
        this.dataFound = true;
        this.processEnvironments(data2env(data));
      }
    });
  }

  /**
   * Assigns each candidate a unique color and adds the candidate to the service.
   *
   * @param environments an array of environments
   */
  private processEnvironments(environments: Environment[]): void {
    this.envSmallWidth = window.innerWidth - this.ENV_RIGHT_MARGIN;
    this.envSmallHeight = window.innerHeight / this.ENVS_PER_PAGE;
    this.envBigWidth = window.innerWidth - this.ENV_RIGHT_MARGIN;
    this.envBigHeight = window.innerHeight / this.ENVS_PER_PAGE_EXPANDED;
    this.environments = this.sortEnvSnapshots(environments);

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

    this.setStartEndTimestamps();
    this.onTimeRangeUpdate();
  }

  private setStartEndTimestamps(): void {
    const localStartTimestamp = this.getStartTimestampFromStorage();
    const localEndTimestamp = this.getEndTimestampFromStorage();
    if (localStartTimestamp && localEndTimestamp) {
      this.startTimestamp = parseInt(localStartTimestamp, 10);
      this.endTimestamp = parseInt(localEndTimestamp, 10);
    } else {
      this.startTimestamp = this.maxTimestamp - this.WEEK_SECONDS;
      this.endTimestamp = this.maxTimestamp;
      this.saveStartTimestampToStorage();
      this.saveEndTimestampToStorage();
    }
  }

  /**
   * Updates the timeline with new start and end values (caught by child in ngOnChanges).
   */
  onTimeRangeUpdate(): void {
    const candNames = new Set<string>(); // candidates which fit start...end
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
    this.timelinePointsAmount = Math.floor(
      this.envBigWidth / this.TIMELINE_POINT_WIDTH
    );
    this.timelinePoints = [];
    const timelineChunkSize =
      (this.endTimestamp - this.startTimestamp) / this.timelinePointsAmount;
    for (let i = 0; i <= this.timelinePointsAmount; i++) {
      let relativeTimestamp = timelineChunkSize * i;
      relativeTimestamp = Math.floor(relativeTimestamp / 60) * 60; // Round seconds
      this.timelinePoints.push(
        new TimelinePoint(
          this.startTimestamp + relativeTimestamp,
          this.candidateService.scale(
            relativeTimestamp,
            0,
            this.endTimestamp - this.startTimestamp,
            0,
            this.envBigWidth
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

  /**
   * Sorts the snapshots by timestamp.
   *
   * @param envs an array of environments
   */
  private sortEnvSnapshots(envs: Environment[]): Environment[] {
    return envs.map(env => {
      env.snapshotsList = env.snapshotsList.sort(
        (s1, s2) => s1.timestamp.seconds - s2.timestamp.seconds
      );
      return env;
    });
  }

  onEndTimestampChange(event: Event): void {
    this.endTimestamp = this.getTimestampFromEvent(event);
    this.saveEndTimestampToStorage();
    this.onTimeRangeUpdate();
  }

  onStartTimestampChange(event: Event): void {
    this.startTimestamp = this.getTimestampFromEvent(event);
    this.saveStartTimestampToStorage();
    this.onTimeRangeUpdate();
  }

  getStartTimestampFromStorage(): string {
    return sessionStorage.getItem(this.START_TIMESTAMP_KEY);
  }

  saveStartTimestampToStorage(): void {
    sessionStorage.setItem(this.START_TIMESTAMP_KEY, `${this.startTimestamp}`);
  }

  getEndTimestampFromStorage(): string {
    return sessionStorage.getItem(this.END_TIMESTAMP_KEY);
  }

  saveEndTimestampToStorage(): void {
    sessionStorage.setItem(this.END_TIMESTAMP_KEY, `${this.endTimestamp}`);
  }

  /**
   * Returns an ISO formatted string **yyyy-MM-ddThh:mm:ss** with time in local timezone.
   *
   * @param timestamp the timestamp in seconds
   */
  private getLocalISOString(timestamp: number): string {
    // toISOString() converts to UTC
    return new Date((timestamp - this.TZ_OFFSET) * 1000)
      .toISOString()
      .slice(0, -5);
  }

  /**
   * Returns a UTC timestamp in seconds from the date value in the event.
   * Opposite of {@link getLocalISOString}
   *
   * @param event the event containing ISO date
   */
  private getTimestampFromEvent(event: Event): number {
    // Date.parse() takes timezone into account
    return Date.parse((event.target as HTMLInputElement).value) / 1000;
  }
}
