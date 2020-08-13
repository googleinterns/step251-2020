import { Component, OnInit } from '@angular/core';
import {EnvironmentService} from '../../services/environment';
import {Polygon} from '../../models/Polygon';

@Component({
  selector: 'app-environment',
  templateUrl: './environment.html',
  styleUrls: ['./environment.css']
})
export class EnvironmentComponent implements OnInit {

  polygons: Polygon[];
  envName: string;
  jsonFileName = 'json.json';

  constructor(environmentService: EnvironmentService) {
    this.polygons = environmentService.getPolygons(this.jsonFileName);
  }

  ngOnInit(): void {
    // TODO(andreystar): add polygons to svg and display them
  }

}
