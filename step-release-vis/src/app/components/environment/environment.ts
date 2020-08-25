import {Component, Input, OnInit} from '@angular/core';
import {EnvironmentService} from '../../services/environment';
import {Polygon} from '../../models/Polygon';
import {Point} from '../../models/Point';
import {Environment} from '../../models/Data';
import {CandidateService} from '../../services/candidate';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.html',
  styleUrls: ['./environment.css'],
})
export class EnvironmentComponent implements OnInit {
  @Input() width: number;
  @Input() height: number;
  @Input() environment: Environment;
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
    const startTime = this.reducePolygonPoints(
      polygons,
      Math.min,
      ({x}) => x,
      Number.MAX_VALUE
    );
    const endTime = this.reducePolygonPoints(polygons, Math.max, ({x}) => x, 0);
    this.polygons = polygons.map(polygon => {
      const scaledPolygon = this.scalePolygon(
        polygon,
        startTime,
        endTime,
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
            this.scale(x, xStart, xEnd, 0, this.width),
            this.scale(100 - y, yStart, yEnd, 0, this.height)
          )
      ),
      polygon.candName
    );
  }

  /**
   * Scales a value from one range to another.
   *
   * @param value the value to scale
   * @param inStart start of the input interval
   * @param inEnd end of the input interval
   * @param outStart start of the output interval
   * @param outEnd end of the output interval
   */
  private scale(
    value: number,
    inStart: number,
    inEnd: number,
    outStart: number,
    outEnd: number
  ): number {
    return (
      ((value - inStart) * (outEnd - outStart)) / (inEnd - inStart) + outStart
    );
  }

  /**
   * Reduces an array of polygons to a number, based on the pointMapper and reducer.
   *
   * @param polygons an array of polygons
   * @param reducer a reducing function for a set of numbers
   * @param pointMapper a function, mapping a point to a number
   * @param initialValue the initial value
   */
  private reducePolygonPoints(
    polygons: Polygon[],
    reducer: (...values: number[]) => number,
    pointMapper: (point) => number,
    initialValue: number
  ): number {
    return polygons.reduce(
      (val, {points}) =>
        reducer(val, ...points.map(point => pointMapper(point))),
      initialValue
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
}
