import { Component, OnInit } from '@angular/core';
import {EnvironmentService} from '../../services/environment';
import {Polygon} from '../../models/Polygon';

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
  }
}
