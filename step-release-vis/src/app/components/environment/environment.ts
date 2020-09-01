import {Component, Input, OnInit} from '@angular/core';
import {EnvironmentService} from '../../services/environment';
import {Polygon} from '../../models/Polygon';
import {Point} from '../../models/Point';
import {Environment, Snapshot} from '../../models/Data';
import {SnapshotInterval} from '../../models/SnapshotInterval';
import {CandidateService} from '../../services/candidate';
import {TimelinePoint} from '../../models/TimelinePoint';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.html',
  styleUrls: ['./environment.css'],
})
export class EnvironmentComponent implements OnInit {
  readonly TIMELINE_HEIGHT = 40;
  readonly SNAPSHOTS_PER_ENV = 100;

  @Input() svgWidth: number;
  @Input() svgHeight: number;

  // TODO(#204): Apply updates in ngOnChanges.
  @Input() startTimestamp: number;
  @Input() endTimestamp: number;

  @Input() environment: Environment;
  @Input() timelinePoints: TimelinePoint[];
  polygons: Polygon[];
  displayedSnapshots: Snapshot[];

  snapshotIntervals: SnapshotInterval[];

  constructor(
    private environmentService: EnvironmentService,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.displayedSnapshots = this.filterSnapshots(this.environment);
    this.environmentService
      .getPolygons(this.displayedSnapshots)
      .subscribe(polygons => this.processPolygons(polygons));

    this.computeSnapshotIntervals();
  }

  computeSnapshotIntervals(): void {
    if (this.displayedSnapshots.length === 0) {
      return;
    }

    let lastEnd: number = this.startTimestamp;
    for (let i = 0; i < this.displayedSnapshots.length - 1; i++) {
      const nextEnd =
        (this.displayedSnapshots[i].timestamp +
          this.displayedSnapshots[i + 1].timestamp) /
        2;
      this.snapshotIntervals.push(
        new SnapshotInterval(lastEnd, nextEnd, this.displayedSnapshots[i])
      );
      lastEnd = nextEnd;
    }

    const lastSnapshot: Snapshot = this.displayedSnapshots[
      this.displayedSnapshots.length - 1
    ];
    this.snapshotIntervals.push(
      new SnapshotInterval(lastEnd, lastSnapshot.timestamp, lastSnapshot)
    );
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
              this.svgHeight - this.TIMELINE_HEIGHT
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

  polygonMouseEnter(polygon: Polygon): void {
    this.candidateService.polygonHovered(polygon);
  }

  polygonMouseLeave(polygon: Polygon): void {
    this.candidateService.polygonUnhovered(polygon);
  }

  getTimelinePointTextAlignment(index: number): string {
    if (index === 0) {
      return 'start';
    } else if (index === this.timelinePoints.length - 1) {
      return 'end';
    }
    return 'middle';
  }
}
