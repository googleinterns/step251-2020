import {Component, OnInit} from '@angular/core';
import {EnvironmentService} from '../../services/environment';
import {Polygon} from '../../models/Polygon';
import {random} from 'lodash';
import {ActivatedRoute} from '@angular/router';
import {ParamService} from '../../services/param';

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
      .param(this.route, 'envName', 'prod')
      .subscribe(envName => (this.envName = envName));
  }

  // TODO(andreystar): add polygon processing logic
  private processPolygons(polygons: Polygon[]): void {
    this.polygons = polygons.map(
      ({points, candName}) =>
        new Polygon(points, candName, this.getRandomColor())
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
