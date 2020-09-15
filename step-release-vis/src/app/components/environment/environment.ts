import {
  Component,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  EventEmitter,
} from '@angular/core';
import {EnvironmentService} from '../../services/environmentService';
import {Polygon} from '../../models/Polygon';
import {Point} from '../../models/Point';
import {Environment, Snapshot, Timestamp} from '../../models/Data';
import {CandidateService} from '../../services/candidateService';
import {TimelinePoint} from '../../models/TimelinePoint';
import {Tooltip} from '../../models/Tooltip';
import {ColoringService} from '../../services/coloringService';
import {ThemeService} from '../../services/themeService';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.html',
  styleUrls: ['./environment.css'],
})
export class EnvironmentComponent implements OnInit, OnChanges {
  readonly TIMELINE_HEIGHT = 40;
  readonly SNAPSHOTS_PER_ENV = 500;
  readonly TITLE_MARGIN = 10;
  @Input() svgSmallHeight: number;

  @Input() svgWidth: number;
  @Input() svgBigHeight: number;
  @Input() titleWidth: number;
  @Input() envMarginBottom: number;
  svgHeight: number;

  @Input() startTimestamp: number;
  @Output() startTimestampChange = new EventEmitter<number>();
  @Input() endTimestamp: number;
  @Output() endTimestampChange = new EventEmitter<number>();
  @Input() curGlobalTimestamp: Timestamp;
  @Input() environment: Environment;

  @Input() timelinePoints: TimelinePoint[];
  @Output() newEdgesEvent = new EventEmitter<Map<string, number>>();
  polygons: Polygon[];

  tooltip: Tooltip = new Tooltip();
  displayedSnapshots: Snapshot[];
  currentSnapshot: Snapshot;

  currentCandidate: string;
  expanded = false;
  mouseDownPos: number;
  dragStartTimestamp: number;
  dragEndTimestamp: number;
  dragMinX: number;
  dragMaxX: number;

  constructor(
    private environmentService: EnvironmentService,
    private candidateService: CandidateService,
    private coloringService: ColoringService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.updateDimensions();
    this.processEnvironment();
  }

  ngOnChanges(changes: SimpleChanges): void {
    const vars = [
      'startTimestamp',
      'endTimestamp',
      'svgWidth',
      'svgSmallHeight',
    ];
    if (this.checkChanges(vars, changes)) {
      this.processEnvironment();
    }
  }

  private checkChanges(vars: string[], changes: SimpleChanges): boolean {
    return vars.reduce(
      (changed, varName) => this.checkChange(varName, changes) || changed,
      false
    );
  }

  private checkChange(name: string, changes: SimpleChanges): boolean {
    let changed = false;
    const change = changes[name];
    if (change && !change.isFirstChange()) {
      this[name] = change.currentValue;
      changed = true;
    }
    return changed;
  }

  /**
   * Initialises component fields, calculates the polygons.
   */
  private processEnvironment(): void {
    this.updateDimensions();
    this.displayedSnapshots = this.filterSnapshots(this.environment);
    this.environmentService
      .getPolygons(this.displayedSnapshots)
      .subscribe(polygons => {
        this.newEdgesEvent.emit(this.environmentService.edges);
        this.processPolygons(polygons);
      });

    new Promise((resolve, reject) => {
      setTimeout(() => resolve(), 5);
      if (this.coloringService.colorsComputed === true) {
        resolve();
      }
    }).then(() => {
      this.polygons.map(polygon => {
        polygon.colorHue = this.candidateService.getColor(polygon.candName);
        return polygon;
      });
    });
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
    if (!this.tooltip.clickOn) {
      this.currentCandidate = polygon.candName;
    }
  }

  leftPolygon(polygon: Polygon): void {
    this.candidateService.polygonUnhovered(polygon);
    if (!this.tooltip.clickOn) {
      this.currentCandidate = undefined;
    }
  }

  enteredEnvironment(event: MouseEvent): void {
    if (!this.tooltip.clickOn) {
      this.tooltip.envName = this.environment.name;
      this.envMouseMove(event);
    }
  }

  envMouseMove(event: MouseEvent): void {
    if (!this.currentSnapshot) {
      this.curGlobalTimestamp.seconds = this.getTimestampFromPosition(
        this.getSvgMouseX(event.pageX)
      );
    }
    if (this.mouseDownPos) {
      const dragStart = this.mouseDownPos;
      const dragEnd = event.pageX;
      if (Math.abs(dragEnd - dragStart) > 10) {
        this.dragMinX = this.getSvgMouseX(Math.min(dragStart, dragEnd));
        this.dragMaxX = this.getSvgMouseX(Math.max(dragStart, dragEnd));
        this.dragStartTimestamp = this.getTimestampFromPosition(this.dragMinX);
        this.dragEndTimestamp = this.getTimestampFromPosition(this.dragMaxX);
      } else {
        this.resetDrag();
      }
    }
    if (!this.tooltip.clickOn) {
      this.updateCurrentSnapshot(this.getSvgMouseX(event.pageX));
      this.tooltip.mouseX = event.pageX - window.scrollX;
      this.tooltip.mouseY = event.pageY - window.scrollY;
      this.tooltip.show = true;
    }
  }

  leftEnvironment(): void {
    this.mouseDownPos = undefined;
    this.resetDrag();
    if (!this.tooltip.clickOn) {
      this.leaveEnvAndTooltip();
    }
  }

  private resetDrag(): void {
    this.dragMinX = undefined;
    this.dragMaxX = undefined;
    this.dragStartTimestamp = undefined;
    this.dragEndTimestamp = undefined;
  }

  hideTooltip(): void {
    this.tooltip.show = false;
    this.tooltip.clickOn = false;
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

  /* Returns the timestamp associated with this position in env. */
  private getTimestampFromPosition(x: number): number {
    return Math.round(
      this.candidateService.scale(
        x,
        0,
        this.svgWidth,
        this.startTimestamp,
        this.endTimestamp
      )
    );
  }

  /*
   * Computes the closest snapshot to the current position of the mouse.
   * If mouse is outside data zone, set currentSnapshot to undefined.
   * @param svgMouseX the position of the mouse relative to the svg
   */
  updateCurrentSnapshot(svgMouseX: number): void {
    if (this.displayedSnapshots.length === 0) {
      return;
    }
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
    this.svgHeight = this.expanded ? this.svgBigHeight : this.svgSmallHeight;
  }

  getTitleNameWidth(): string {
    return `${this.titleWidth - this.TITLE_MARGIN - this.getTitleSize()}px`;
  }

  getEnvPaddingBottom(): string {
    return (
      (this.expanded ? this.envMarginBottom * 2 : this.envMarginBottom) + 'px'
    );
  }

  shouldDisplayLine(): boolean {
    return this.curGlobalTimestamp.seconds !== undefined;
  }

  /* if the clickOn property of the tooltip is true, the tooltip doesn't move anymore until either
  clickOn becomes false or the mouse leaves the <div> of the environment */
  envMouseUp(event: MouseEvent): void {
    if (this.mouseDownPos) {
      const dragStart = this.mouseDownPos;
      const dragEnd = event.pageX;
      this.mouseDownPos = undefined;
      if (Math.abs(dragEnd - dragStart) < 10) {
        // 'click'
        this.tooltip.clickOn = !this.tooltip.clickOn;
        this.envMouseMove(event);
      } else {
        // 'drag'
        this.startTimestampChange.emit(this.dragStartTimestamp);
        this.endTimestampChange.emit(this.dragEndTimestamp);
        this.resetDrag();
      }
    }
  }

  envMouseDown(event: MouseEvent): void {
    this.mouseDownPos = event.pageX;
  }

  leaveEnvAndTooltip(): void {
    this.hideTooltip();
    this.currentSnapshot = undefined;
    this.curGlobalTimestamp.seconds = undefined;
  }

  getTitleHeight(): string {
    return this.getTitleSize() + 'px';
  }

  getExpandIcon(): string {
    const expanded: Point[] = [
      {x: 0, y: 0},
      {x: 1, y: 0},
      {x: 0.5, y: 0.866},
    ];
    const nonExpanded: Point[] = [
      {x: 0, y: 0},
      {x: 0.866, y: 0.5},
      {x: 0, y: 1},
    ];
    const size = this.getTitleSize();
    const shrinkFactor = 1.5;
    const cur = this.expanded ? expanded : nonExpanded;
    const shift = (size - size / shrinkFactor) / 2;
    return cur
      .map(
        point =>
          new Point(
            (point.x * size) / shrinkFactor,
            (point.y * size) / shrinkFactor + shift
          )
      )
      .map(({x, y}) => `${x},${y}`)
      .join(' ');
  }

  getThemeTextColor(): string {
    if (this.themeService.theme) {
      return 'white';
    }
    return 'black';
  }

  private getTitleSize(): number {
    return Math.min(this.svgSmallHeight, 16);
  }

  private getSvgMouseX(pageX: number): number {
    const svgElement = document.getElementById(this.environment.name + '-svg');
    return pageX - svgElement.getBoundingClientRect().left;
  }
}
