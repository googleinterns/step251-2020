import {Component, OnInit} from '@angular/core';
import {EnvironmentService} from '../../services/environment';
import {Polygon} from '../../models/Polygon';
import {Point} from '../../models/Point';
import {ActivatedRoute} from '@angular/router';
import {ParamService} from '../../services/param';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.html',
  styleUrls: ['./environment.css']
})
export class EnvironmentComponent implements OnInit {


  width: number;
  height: number;
  polygons: Polygon[];
  envName: string;
  // Currently the json file describes only one environment,
  // therefore the file is directly associated with EnvironmentComponent.
  // Later a parent component for multiple EnvironmentComponents will be introduced.
  // TODO(andreystar): Add parent component
  jsonFile: string;

  constructor(private route: ActivatedRoute, private environmentService: EnvironmentService, private paramService: ParamService) {
    this.jsonFile = paramService.param(route, 'jsonFile', '');
    // TODO(andreystar): make width and height configurable (requires parent component)
    this.width = window.innerWidth;
    this.height = window.innerHeight / 5;
  }

  ngOnInit(): void {
    this.environmentService.getPolygons(this.jsonFile)
      .subscribe(polygons => this.processPolygons(polygons));
  }

  /**
   * Processes the polygons by scaling their coordinates to svg size.
   *
   * @param polygons the polygons to process
   */
  private processPolygons(polygons: Polygon[]): void {
    const startTime = this.reducePolygonPoints(polygons, Math.min, ({x}) => x, Number.MAX_VALUE);
    const endTime = this.reducePolygonPoints(polygons, Math.max, ({x}) => x, 0);
    this.polygons = polygons.map(polygon => this.scalePolygon(polygon, startTime, endTime, 0, 100));
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
   * @param yEnd rane end for y
   */
  private scalePolygon(polygon: Polygon, xStart: number, xEnd: number, yStart: number, yEnd: number): Polygon {
    return new Polygon(
      polygon.points.map(({x, y}) => new Point(
        this.scale(x, xStart, xEnd, 0, this.width),
        this.scale(100 - y, yStart, yEnd, 0, this.height))),
      this.getRandomColor());
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
  private scale(value: number, inStart: number, inEnd: number, outStart: number, outEnd: number): number {
    return (value - inStart) * (outEnd - outStart) / (inEnd - inStart) + outStart;
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
    initialValue: number): number {
    return polygons
      .reduce((val, {points}) => reducer(val, ...points.map(point => pointMapper(point))), initialValue);
  }

  // TODO(andreystar): update
  /**
   * Generates a random hex color.
   */
  private getRandomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  polygonMouseOver(polygon: Polygon): void {
    polygon.highlight = true;
  }

  polygonMouseOut(polygon: Polygon): void {
    polygon.highlight = false;
  }
}
