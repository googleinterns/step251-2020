import {Component, HostListener, OnInit} from '@angular/core';
import {Environment, Timestamp} from '../../models/Data';
import {DataService} from '../../services/dataService';
import {ProtoBufferService} from '../../services/protoBufferService';
import {CandidateService} from '../../services/candidateService';
import {ColoringService} from '../../services/coloringService';
import {TimelinePoint} from '../../models/TimelinePoint';
import {Observable} from 'rxjs';
import {EnvironmentService} from '../../services/environmentService';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.html',
  styleUrls: ['./environments.css'],
})
export class EnvironmentsComponent implements OnInit {
  readonly TIMERANGE_HEIGHT = 35;
  readonly TIMELINE_HEIGHT = 40;
  readonly ENV_MARGIN_BOTTOM = 7;
  readonly ENVS_MARGIN_BOTTOM = 25;
  readonly ENV_EXPANDED_HEIGHT = 170;
  readonly ENV_RIGHT_MARGIN = 20;
  readonly TITLE_WIDTH = 280;
  readonly TIMELINE_POINT_WIDTH = 130;
  readonly TZ_OFFSET = new Date().getTimezoneOffset() * 60;
  readonly START_TIMESTAMP_KEY = 'start_timestamp';
  readonly END_TIMESTAMP_KEY = 'end_timestamp';

  environments: Environment[];

  envSmallHeight: number;
  envWidth: number;
  envBigHeight: number;
  collapsedEnvsHeight: number;

  minTimestamp: number; // min timestamp across every environment
  maxTimestamp: number; // max timestamp across every environment
  startTimestamp: number; // current start timestamp
  endTimestamp: number; // current end timestamp
  curGlobalTimestamp: Timestamp = {seconds: undefined}; // shared current timestamp

  dataFound: boolean;
  timelinePointsAmount: number;
  timelinePoints: TimelinePoint[];

  candidateEdges: Map<string, number> = new Map();
  uninitializedEnvironments: number;
  displayedCandidates: Set<string>;

  mouseDownPos: number;

  constructor(
    private dataService: DataService,
    private candidateService: CandidateService,
    private protoBufferService: ProtoBufferService,
    private coloringService: ColoringService,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit(): void {
    this.readProtoBinaryData();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.updateDimensions(document.body.clientWidth, window.innerHeight);
    this.updateTimeline();
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
    this.environments = this.sortEnvSnapshots(environments);
    this.uninitializedEnvironments = this.environments.length;

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
    this.updateDimensions(document.body.clientWidth, window.innerHeight);
    this.setStartEndTimestamps();
  }

  /**
   * Reads start/end timestamps from localStorage.
   * Assigns minTimestamp/maxTimestamp, if no data is found.
   */
  private setStartEndTimestamps(): void {
    const localStartTimestamp = this.getStartTimestampFromStorage();
    const localEndTimestamp = this.getEndTimestampFromStorage();
    if (localStartTimestamp && localEndTimestamp) {
      this.startTimestamp = parseInt(localStartTimestamp, 10);
      this.endTimestamp = parseInt(localEndTimestamp, 10);
      this.onTimeRangeUpdate();
    } else {
      this.resetTimerange();
    }
  }

  private updateDimensions(width: number, height: number): void {
    this.envWidth = width - this.ENV_RIGHT_MARGIN - this.TITLE_WIDTH;
    this.collapsedEnvsHeight =
      height -
      this.TIMELINE_HEIGHT * 2 -
      this.TIMERANGE_HEIGHT -
      this.ENVS_MARGIN_BOTTOM;
    this.envSmallHeight = Math.min(
      this.collapsedEnvsHeight / this.environments.length -
        this.ENV_MARGIN_BOTTOM,
      50
    );
    this.envBigHeight = this.ENV_EXPANDED_HEIGHT;
  }

  /**
   * Updates the timeline with new start and end values (caught by child in ngOnChanges).
   */
  private onTimeRangeUpdate(): void {
    this.candidateEdges.clear();
    this.uninitializedEnvironments = this.environments.length;
    this.updateTimeline();
    this.updateDisplayedCandidates();
  }

  private updateTimeline(): void {
    this.timelinePointsAmount = Math.floor(
      this.envWidth / this.TIMELINE_POINT_WIDTH
    );
    this.timelinePoints = [];
    const timelineChunkSize =
      (this.endTimestamp - this.startTimestamp) / this.timelinePointsAmount;
    for (let i = 0; i <= this.timelinePointsAmount; i++) {
      const relativeTimestamp = timelineChunkSize * i;
      this.timelinePoints.push(
        new TimelinePoint(
          Math.floor((this.startTimestamp + relativeTimestamp) / 60) * 60, // round seconds
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
  }

  private updateDisplayedCandidates(): void {
    this.displayedCandidates = new Set<string>(); // candidates which fit start...end
    for (const environment of this.environments) {
      for (const snapshot of environment.snapshotsList) {
        for (const candsInfo of snapshot.candidatesList) {
          if (
            snapshot.timestamp.seconds >= this.startTimestamp &&
            snapshot.timestamp.seconds <= this.endTimestamp
          ) {
            this.displayedCandidates.add(candsInfo.candidate);
          }
        }
      }
    }
    [...this.displayedCandidates].forEach((name, index) => {
      const color = this.getHue(index, this.displayedCandidates.size);
      this.candidateService.addCandidate(color, name);
    });
  }

  addEdges(newEdges: Map<string, number>): void {
    for (const edge of newEdges) {
      let prevValue = 0;
      if (this.candidateEdges.has(edge[0]) === true) {
        prevValue = this.candidateEdges.get(edge[0]);
      }
      this.candidateEdges.set(edge[0], prevValue + edge[1]);
    }

    this.uninitializedEnvironments--;
    if (this.uninitializedEnvironments === 0) {
      this.setColors();
    }
  }

  private setColors(): void {
    this.coloringService.colorCandidates(
      this.candidateEdges,
      this.displayedCandidates
    );
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

  private onStartTimestampChange(event: Event): void {
    const newStartTimestamp = this.getTimestampFromEvent(event);
    if (
      this.minTimestamp <= newStartTimestamp &&
      newStartTimestamp <= this.endTimestamp
    ) {
      this.setTimerangeValidity(true);
      this.startTimestamp = newStartTimestamp;
      this.saveStartTimestampToStorage();
      this.onTimeRangeUpdate();
    } else {
      this.setTimerangeValidity(false);
    }
  }

  private onEndTimestampChange(event: Event): void {
    const newEndTimestamp = this.getTimestampFromEvent(event);
    if (
      this.startTimestamp <= newEndTimestamp &&
      newEndTimestamp <= this.maxTimestamp
    ) {
      this.setTimerangeValidity(true);
      this.endTimestamp = newEndTimestamp;
      this.saveEndTimestampToStorage();
      this.onTimeRangeUpdate();
    } else {
      this.setTimerangeValidity(false);
    }
  }

  private setTimerangeValidity(valid: boolean): void {
    const startClasses = document.getElementById('timerange-start-input')
      .classList;
    const endClasses = document.getElementById('timerange-end-input').classList;
    if (valid) {
      startClasses.remove('invalid-timerange');
      endClasses.remove('invalid-timerange');
    } else {
      startClasses.add('invalid-timerange');
      endClasses.add('invalid-timerange');
    }
  }

  private getStartTimestampFromStorage(): string {
    return sessionStorage.getItem(this.START_TIMESTAMP_KEY);
  }

  private saveStartTimestampToStorage(): void {
    sessionStorage.setItem(this.START_TIMESTAMP_KEY, `${this.startTimestamp}`);
  }

  private getEndTimestampFromStorage(): string {
    return sessionStorage.getItem(this.END_TIMESTAMP_KEY);
  }

  private saveEndTimestampToStorage(): void {
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

  resetTimerange(): void {
    this.startTimestamp = this.minTimestamp;
    this.endTimestamp = this.maxTimestamp;
    this.saveStartTimestampToStorage();
    this.saveEndTimestampToStorage();
    this.onTimeRangeUpdate();
  }

  getTimerangeHeight(): number {
    return this.TIMERANGE_HEIGHT;
  }

  getTimelineHeight(): number {
    return this.TIMELINE_HEIGHT;
  }

  getLineX(): number {
    return this.getPositionFromTimestamp(this.curGlobalTimestamp.seconds);
  }

  getPositionFromTimestamp(time: number): number {
    return this.candidateService.scale(
      time,
      this.startTimestamp,
      this.endTimestamp,
      0,
      this.envWidth
    );
  }

  envsMouseUp(event: MouseEvent): void {
    if (Math.abs(this.mouseDownPos - event.pageX) >= 20) {
      const dragMin = Math.min(this.mouseDownPos, event.pageX);
      const dragMax = Math.max(this.mouseDownPos, event.pageX);
      // TODO(#277): add time range update
      console.log(`${dragMin} -> ${dragMax}`);
    }
  }

  envsMouseDown(event: MouseEvent): void {
    this.mouseDownPos = event.pageX;
  }

  shouldDisplayTimelineCircle(): boolean {
    return this.curGlobalTimestamp.seconds !== undefined;
  }
}
