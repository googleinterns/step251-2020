import {
  Component,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {EnvironmentService} from '../../services/environmentService';
import {Polygon} from '../../models/Polygon';
import {Point} from '../../models/Point';
import {Environment, Snapshot, Timestamp} from '../../models/Data';
import {CandidateService} from '../../services/candidateService';
import {TimelinePoint} from '../../models/TimelinePoint';
import {Tooltip} from '../../models/Tooltip';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.html',
  styleUrls: ['./environment.css'],
})
export class EnvironmentComponent implements OnInit, OnChanges {
  readonly TIMELINE_HEIGHT = 40;
  readonly SNAPSHOTS_PER_ENV = 500;
  readonly TITLE_MARGIN = 10;
  readonly TITLE_ICON_SIZE = 20;

  @Input() svgSmallWidth: number;
  @Input() svgSmallHeight: number;
  @Input() svgBigWidth: number;
  @Input() svgBigHeight: number;
  @Input() titleWidth;

  svgWidth: number;
  svgHeight: number;

  @Input() startTimestamp: number;
  @Input() endTimestamp: number;
  @Input() curGlobalTimestamp: Timestamp;

  @Input() environment: Environment;
  @Input() timelinePoints: TimelinePoint[];
  polygons: Polygon[];
  tooltip: Tooltip = new Tooltip();
  displayedSnapshots: Snapshot[];

  currentSnapshot: Snapshot;
  currentCandidate: string;
  expanded = false;

  constructor(
    private environmentService: EnvironmentService,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.updateDimensions();
    this.processEnvironment();
  }

  /**
   * Initialises component fields, calculates the polygons.
   */
  private processEnvironment(): void {
    this.displayedSnapshots = this.filterSnapshots(this.environment);
    this.environmentService
      .getPolygons(this.displayedSnapshots)
      .subscribe(polygons => this.processPolygons(polygons));
  }

  /**
   * Filters the snapshots according to start/end timestamps
   * and returns a sparse version of the resulting snapshots.
   *
   * @param environment the polygons to process
   */
  private filterSnapshots(environment: Environment): Snapshot[] {
    const snapshots = environment.snapshotsList;
    let startIndex = snapshots.findIndex(
      snapshot => snapshot.timestamp.seconds >= this.startTimestamp
    ); // inclusive
    if (startIndex < 0) {
      startIndex = snapshots.length; // all snapshots < start - nothing to display
    }
    let endIndex = snapshots.findIndex(
      snapshot => snapshot.timestamp.seconds > this.endTimestamp
    ); // exclusive
    if (endIndex < 0) {
      endIndex = snapshots.length; // all snapshots <= end - all applicable
    }
    return this.candidateService.sparseArray(
      this.SNAPSHOTS_PER_ENV,
      snapshots.slice(startIndex, endIndex),
      true
    );
  }

  /**
   * Processes the polygons by scaling their coordinates to svg size.
   *
   * @param polygons the polygons to process
   */
  private processPolygons(polygons: Polygon[]): void {
    this.polygons = polygons.map(polygon => {
      const scaledPolygon = this.scalePolygon(
        polygon,
        this.startTimestamp,
        this.endTimestamp,
        0,
        100
      );
      scaledPolygon.colorHue = this.candidateService.getColor(polygon.candName);
      return scaledPolygon;
    });
    this.candidateService.addPolygons(this.polygons);
  }

  ngOnChanges(changes: SimpleChanges): void {
    let changed = false;
    const startChanges = changes.startTimestamp;
    if (startChanges && !startChanges.isFirstChange()) {
      this.startTimestamp = startChanges.currentValue;
      changed = true;
    }
    const endChanges = changes.endTimestamp;
    if (endChanges && !endChanges.isFirstChange()) {
      this.endTimestamp = endChanges.currentValue;
      changed = true;
    }
    if (changed) {
      this.processEnvironment();
    }
  }

  /**
   * Scales the polygon's points.
   * x: xStart..xEnd -> 0..svg.width
   * y: yStart..yEnd -> 0..svg.height
   *
   * @param polygon the polygon to scale
   * @param xStart range start for x
   * @param xEnd range end for x
   * @param yStart range start for y
   * @param yEnd range end for y
   */
  private scalePolygon(
    polygon: Polygon,
    xStart: number,
    xEnd: number,
    yStart: number,
    yEnd: number
  ): Polygon {
    return new Polygon(
      polygon.points.map(
        ({x, y}) =>
          new Point(
            this.candidateService.scale(x, xStart, xEnd, 0, this.svgWidth),
            this.candidateService.scale(
              100 - y,
              yStart,
              yEnd,
              0,
              this.expanded
                ? this.svgHeight - this.TIMELINE_HEIGHT
                : this.svgHeight
            )
          )
      ),
      polygon.candName
    );
  }

  /**
   * Generates an HSL color based on the provided polygon.
   * Hue is set to polygon's hue.
   * Saturation is set to 100%, if the polygon is highlighted, 60% - otherwise
   * Lightness is set to 50% to provide vibrant colors.
   *
   * @param polygon the polygon to generate the color for.
   */
  getColor(polygon: Polygon): string {
    const saturation = polygon.highlight ? '100%' : '60%';
    return `hsl(${polygon.colorHue}, ${saturation}, 50%)`;
  }

  /**
   * Returns an opacity value based on polygons highlight property.
   *
   * @param polygon the polygon
   */
  getOpacity(polygon: Polygon): string {
    return polygon.highlight ? '1.0' : '0.7';
  }

  enteredPolygon(polygon: Polygon): void {
    this.candidateService.polygonHovered(polygon);
    this.currentCandidate = polygon.candName;
  }

  leftPolygon(polygon: Polygon): void {
    this.candidateService.polygonUnhovered(polygon);
    this.currentCandidate = undefined;
  }

  enteredEnvironment(event: MouseEvent): void {
    this.tooltip.envName = this.environment.name;
    this.moveTooltip(event);
  }

  moveTooltip(event: MouseEvent): void {
    this.tooltip.mouseX = event.pageX - window.scrollX;
    this.tooltip.mouseY = event.pageY - window.scrollY;
    this.tooltip.show = true;

    const svgElement = document.getElementById(this.environment.name + '-svg');
    const svgMouseX = event.pageX - svgElement.getBoundingClientRect().left;

    this.updateCurrentSnapshot(svgMouseX);
  }

  leftEnvironment(event: MouseEvent): void {
    this.hideTooltip();
    this.currentSnapshot = undefined;
    this.curGlobalTimestamp.seconds = undefined;
  }

  hideTooltip(): void {
    this.tooltip.show = false;
  }

  getTimelinePointTextAlignment(index: number): string {
    if (index === 0) {
      return 'start';
    } else if (index === this.timelinePoints.length - 1) {
      return 'end';
    }
    return 'middle';
  }

  /* Returns the distance in pixels from the svg border. */
  getPositionFromTimestamp(time: number): number {
    return this.candidateService.scale(
      time,
      this.startTimestamp,
      this.endTimestamp,
      0,
      this.svgWidth
    );
  }

  /*
   * Computes the closest snapshot to the current position of the mouse.
   * If mouse is outside data zone, set currentSnapshot to undefined.
   * @param svgMouseX the position of the mouse relative to the svg
   */
  updateCurrentSnapshot(svgMouseX: number): void {
    const firstDisplayedTimestampScaled = this.getPositionFromTimestamp(
      this.displayedSnapshots[0].timestamp.seconds
    );
    const lastDisplayedTimestampScaled = this.getPositionFromTimestamp(
      this.displayedSnapshots[this.displayedSnapshots.length - 1].timestamp
        .seconds
    );

    if (
      svgMouseX < firstDisplayedTimestampScaled ||
      svgMouseX > lastDisplayedTimestampScaled
    ) {
      this.currentSnapshot = undefined;
      this.curGlobalTimestamp.seconds = undefined;
      return;
    }

    let index = Math.floor(
      ((svgMouseX - firstDisplayedTimestampScaled) *
        (this.displayedSnapshots.length - 1)) /
        (lastDisplayedTimestampScaled - firstDisplayedTimestampScaled)
    );
    // which one is closer? index or index + 1
    if (index + 1 < this.displayedSnapshots.length) {
      const prevTimestampScaled: number = this.getPositionFromTimestamp(
        this.displayedSnapshots[index].timestamp.seconds
      );
      const nextTimestampScaled: number = this.getPositionFromTimestamp(
        this.displayedSnapshots[index + 1].timestamp.seconds
      );

      if (svgMouseX > (prevTimestampScaled + nextTimestampScaled) / 2) {
        index++;
      }
    }

    this.currentSnapshot = this.displayedSnapshots[index];
    this.curGlobalTimestamp.seconds = this.currentSnapshot.timestamp.seconds;
  }

  getLineX(): number {
    return this.getPositionFromTimestamp(
      this.currentSnapshot
        ? this.currentSnapshot.timestamp.seconds
        : this.curGlobalTimestamp.seconds
    );
  }

  handleExpand(): void {
    this.expanded = !this.expanded;
    this.updateDimensions();
    this.processEnvironment();
  }

  private updateDimensions(): void {
    this.svgWidth = this.expanded ? this.svgBigWidth : this.svgSmallWidth;
    this.svgHeight = this.expanded ? this.svgBigHeight : this.svgSmallHeight;
  }

  getTitleDisplay(): string {
    return this.expanded ? 'block' : 'inline';
  }

  getTitleNameWidth(): string {
    return this.expanded
      ? 'auto'
      : `${this.titleWidth - this.TITLE_MARGIN - this.TITLE_ICON_SIZE}px`;
  }

  getEnvPaddingBottom(): string {
    return this.expanded ? '15px' : '0px';
  }

  shouldDisplayLine(): boolean {
    if (!this.curGlobalTimestamp) {
      return false;
    }
    return (
      this.displayedSnapshots[0].timestamp.seconds <
        this.curGlobalTimestamp.seconds &&
      this.curGlobalTimestamp.seconds <
        this.displayedSnapshots[this.displayedSnapshots.length - 1].timestamp
          .seconds
    );
  }
}
