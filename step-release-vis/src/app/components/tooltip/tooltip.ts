import {Component, Input, OnInit} from '@angular/core';
import {SnapshotInterval} from '../../models/SnapshotInterval';
import {Tooltip} from '../../models/Tooltip';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.css'],
})
export class TooltipComponent implements OnInit {
  currentSnapshotIndex: number;
  snapshotIntervals: SnapshotInterval[];

  @Input() tooltip: Tooltip;

  candidateName: string;

  constructor() {}

  ngOnInit(): void {}
  // TODO(#210): Implement functions for updating tooltip data

  changeEnvironment(snapInterval: SnapshotInterval[]): void {
    this.snapshotIntervals = snapInterval;
    this.binarySearchIndex();
  }

  moveMouse(): void {}

  changeCandidate(newName: string): void {
    this.candidateName = newName;
  }

  binarySearchIndex(): void {}

  getLeft(): string {
    const divTooltip = document.getElementById(this.tooltip.envName);
    if (this.tooltip.x + divTooltip.offsetWidth > window.innerWidth) {
      return this.tooltip.x - divTooltip.offsetWidth + 'px';
    }
    return this.tooltip.x + 20 + 'px';
  }

  getTop(): string {
    const divTooltip = document.getElementById(this.tooltip.envName);
    if (this.tooltip.y + divTooltip.offsetHeight > window.innerHeight) {
      return this.tooltip.y - divTooltip.offsetHeight + 'px';
    }
    return this.tooltip.y + 20 + 'px';
  }

  getShow(): string {
    if (this.tooltip.show) {
      return 'block';
    } else {
      return 'none';
    }
  }
}
