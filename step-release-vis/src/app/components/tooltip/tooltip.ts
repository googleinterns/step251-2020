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

  @Input() tooltip: Tooltip = new Tooltip();

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

  // computes the left position of the tooltip according to the mouse's X position
  getLeft(): string {
    const divTooltip = document.getElementById(this.tooltip.envName);
    if (divTooltip != null) {
      if (this.tooltip.mouseX + divTooltip.offsetWidth > window.innerWidth) {
        return this.tooltip.mouseX - divTooltip.offsetWidth + 'px';
      }
      return this.tooltip.mouseX + 20 + 'px';
    }
    return '';
  }

  // computes the top position of the tooltip according to the mouse's Y position
  getTop(): string {
    const divTooltip = document.getElementById(this.tooltip.envName);
    if (divTooltip != null) {
      if (this.tooltip.mouseY + divTooltip.offsetHeight > window.innerHeight) {
        return this.tooltip.mouseY - divTooltip.offsetHeight + 'px';
      }
      return this.tooltip.mouseY + 20 + 'px';
    }
    return '';
  }

  // make the tooltip visible or not
  getShow(): string {
    if (this.tooltip.show) {
      return 'block';
    } else {
      return 'none';
    }
  }
}
