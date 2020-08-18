import {Component, OnInit} from '@angular/core';
import {EnvironmentService} from '../../services/environment';
import {Polygon} from '../../models/Polygon';
import {random} from 'lodash';
import {ActivatedRoute} from '@angular/router';
import {ParamService} from '../../services/param';
import {Point} from '../../models/Point';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.html',
  styleUrls: ['./environment.css'],
})
export class EnvironmentComponent implements OnInit {
  width: number;
  height: number;
  polygons: Polygon[];
  envName: string;
  // Currently the json file describes only one environment,
  // therefore the file is directly associated with EnvironmentComponent.
  // Later a parent component for multiple EnvironmentComponents will be introduced.
  // Until then the constant parameters are specified in the url as query parameters.
  // TODO(andreystar): Add parent component
  jsonFile: string;

  constructor(
    private route: ActivatedRoute,
    private environmentService: EnvironmentService,
    private paramService: ParamService
  ) {}

  ngOnInit(): void {
    // TODO(andreystar): make width and height configurable (requires parent component)
    this.width = window.innerWidth;
    this.height = window.innerHeight / 5;

    this.paramService.param(this.route, 'jsonFile', '').subscribe(jsonFile => {
      this.jsonFile = jsonFile;
      this.environmentService
        .getPolygons(this.jsonFile)
        .subscribe(polygons => this.processPolygons(polygons));
    });
    this.paramService
      .param(this.route, 'envName', 'default_env')
      .subscribe(envName => (this.envName = envName));
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
      scaledPolygon.color = this.getRandomColor();
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
   * Generates a random hex color.
   */
  private getRandomColor(): string {
    const r = random(0, 255);
    const g = random(0, 255);
    const b = random(0, 255);
    const toHexPadded = (value: number) => value.toString(16).padStart(2, '0');
    return `#${toHexPadded(r)}${toHexPadded(g)}${toHexPadded(b)}`;
  }
}
