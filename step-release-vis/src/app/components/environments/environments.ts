import {Component, OnInit} from '@angular/core';
import {Environment} from '../../models/Data';
import {FileService} from '../../services/file';
import {ParamService} from '../../services/param';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.html',
  styleUrls: ['./environments.css'],
})
export class EnvironmentsComponent implements OnInit {
  environments: Environment[];
  jsonUri: string;
  envWidth: number;
  envHeight: number;

  constructor(
    private route: ActivatedRoute,
    private fileService: FileService,
    private paramService: ParamService
  ) {}

  ngOnInit(): void {
    this.paramService.param(this.route, 'jsonUri', '').subscribe(jsonUri => {
      this.jsonUri = jsonUri;
      this.fileService
        .readContents<Environment[]>(this.jsonUri)
        .subscribe(environments => this.processEnvironments(environments));
    });
  }

  private processEnvironments(environments: Environment[]): void {
    this.envWidth = window.innerWidth;
    this.envHeight = window.innerHeight / environments.length;
    this.environments = environments;
  }
}
