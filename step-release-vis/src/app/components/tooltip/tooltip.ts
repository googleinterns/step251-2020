import {Component, OnInit} from '@angular/core';
import {Snapshot} from '../../models/Data';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.css'],
})
export class TooltipComponent implements OnInit {
  currentSnapshot: Snapshot;

  constructor() {}

  ngOnInit(): void {}
  // TODO(#210): Implement functions for updating tooltip data
}
