import {Component, OnInit} from '@angular/core';
import {EnvironmentService} from '../../services/environment';
import {Polygon} from '../../models/Polygon';
import {random} from 'lodash';

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
  // TODO(andreystar): add a parameter for json file
  jsonFile = 'env.json';

  constructor(private environmentService: EnvironmentService) {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  ngOnInit(): void {
    this.environmentService.getPolygons(this.jsonFile)
      .subscribe(polygons => this.processPolygons(polygons));
  }

  // TODO(andreystar): add polygon processing logic
  private processPolygons(polygons: Polygon[]): void {
    this.polygons = polygons.map(
      ({points, candName}) => new Polygon(points, candName, this.getRandomColor()));
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
