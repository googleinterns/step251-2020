import {Component, Input, OnInit} from '@angular/core';
import {EnvironmentService} from '../../services/environment';
import {Polygon} from '../../models/Polygon';
import {shuffle} from 'lodash';
import {ActivatedRoute} from '@angular/router';
import {Point} from '../../models/Point';
import {Environment} from '../../models/Data';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.html',
  styleUrls: ['./environment.css'],
})
export class EnvironmentComponent implements OnInit {
  width: number;
  height: number;
  polygons: Polygon[];
  @Input() environment: Environment;

  constructor(
    private route: ActivatedRoute,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit(): void {
    // TODO(#147): make width and height configurable (requires parent component)
    this.width = window.innerWidth;
    this.height = window.innerHeight / 5;
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
    // Shuffle polygon indices to assign colors randomly
    const shuffledIndices = shuffle(polygons.map((_, index) => index));
    this.polygons = polygons.map((polygon, index) => {
      const scaledPolygon = this.scalePolygon(
        polygon,
        startTime,
        endTime,
        0,
        100
      );
      scaledPolygon.colorHue = this.getHue(
        shuffledIndices[index],
        polygons.length
      );
      return scaledPolygon;
    });
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
    polygon.highlight = true;
  }

  polygonMouseLeave(polygon: Polygon): void {
    polygon.highlight = false;
  }
}
