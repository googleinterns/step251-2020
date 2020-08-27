import {Component, Input, OnInit} from '@angular/core';
import {EnvironmentService} from '../../services/environment';
import {Polygon} from '../../models/Polygon';
import {Point} from '../../models/Point';
import {Environment} from '../../models/Data';
import {CandidateService} from '../../services/candidate';
import {TimelinePoint} from '../../models/TimelinePoint';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.html',
  styleUrls: ['./environment.css'],
})
export class EnvironmentComponent implements OnInit {
  @Input() svgWidth: number;
  @Input() svgHeight: number;
  timelineHeight = 30;
  @Input() minTimestamp: number;
  @Input() maxTimestamp: number;
  @Input() environment: Environment;
  @Input() timelinePoints: TimelinePoint[];
  polygons: Polygon[];

  constructor(
    private environmentService: EnvironmentService,
    private candidateService: CandidateService
  ) {}

  ngOnInit(): void {
    this.environmentService
      .getPolygons(this.environment)
      .subscribe(polygons => this.processPolygons(polygons));
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
        this.minTimestamp,
        this.maxTimestamp,
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
              this.svgHeight - this.timelineHeight
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
