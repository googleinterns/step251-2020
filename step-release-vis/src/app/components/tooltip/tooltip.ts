import {Component, OnInit} from '@angular/core';
import {SnapshotInterval} from '../../models/SnapshotInterval';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.css'],
})
export class TooltipComponent implements OnInit {
  currentSnapshotIndex: number;
  snapshotIntervals: SnapshotInterval[];

  candidateName: string;

  constructor() {}

  ngOnInit(): void {}

  changeEnvironment(snapInterval: SnapshotInterval[]) {
    this.snapshotIntervals = snapInterval;
    this.binarySearchIndex();
  }

  moveMouse(): void {
    // TODO(naoai): Implement this function to change interval if the mouse moves inside the environment
  }

  changeCandidate(newName: string): void {
    this.candidateName = newName;
  }

  binarySearchIndex(): void {}
}
