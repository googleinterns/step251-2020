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
  // TODO(naoai): Implement functions for updating tooltip data

  changeEnvironment(snapInterval: SnapshotInterval[]): void {
    this.snapshotIntervals = snapInterval;
    this.binarySearchIndex();
  }

  moveMouse(): void {}

  changeCandidate(newName: string): void {
    this.candidateName = newName;
  }

  binarySearchIndex(): void {}
}
