import {Component, OnInit} from '@angular/core';
import {Environment} from '../../models/Data';
import {FileService} from '../../services/file';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.html',
  styleUrls: ['./environments.css'],
})
export class EnvironmentsComponent implements OnInit {
  environments: Environment[];

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.fileService
      .readContents<Environment[]>('fuck')
      .subscribe(environments => (this.environments = environments));
  }
}
