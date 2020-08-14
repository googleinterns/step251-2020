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
  jsonFileName = 'json.json';

  constructor(environmentService: EnvironmentService) {
    this.polygons = environmentService.getPolygons(this.jsonFileName);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
  }

  ngOnInit(): void {
    // TODO(andreystar): add polygons to svg and display them
  }
}
