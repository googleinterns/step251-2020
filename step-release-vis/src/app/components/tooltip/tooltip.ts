import {Component, Input, OnInit} from '@angular/core';
import {Snapshot} from '../../models/Data';
import {Tooltip} from '../../models/Tooltip';
import {CandidateService} from '../../services/candidateService';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.css'],
})
export class TooltipComponent implements OnInit {
  @Input() tooltip: Tooltip = new Tooltip();
  currentSnapshot: Snapshot;
  width: number;
  height: number;

  // TODO(#234): Compute width/height of the tooltip according to the data.

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {}

  getSnapshot(): void {
    const tooltip = this.tooltip;
    let index = Math.floor(
      (tooltip.svgMouseX * (tooltip.displayedSnapshots.length - 1)) /
        tooltip.envWidth
    );

    const firstTimestamp = tooltip.displayedSnapshots[0].timestamp.seconds;
    const lastTimestamp =
      tooltip.displayedSnapshots[tooltip.displayedSnapshots.length - 1]
        .timestamp.seconds;

    // which one is closer? index or index + 1
    if (index + 1 < tooltip.displayedSnapshots.length) {
      const lastTimestampScaled: number = this.candidateService.scale(
        tooltip.displayedSnapshots[index].timestamp.seconds,
        firstTimestamp,
        lastTimestamp,
        0,
        tooltip.envWidth
      );
      const nextTimestampScaled: number = this.candidateService.scale(
        tooltip.displayedSnapshots[index + 1].timestamp.seconds,
        firstTimestamp,
        lastTimestamp,
        0,
        tooltip.envWidth
      );

      if (tooltip.svgMouseX > (lastTimestampScaled + nextTimestampScaled) / 2) {
        index++;
      }
    }

    this.currentSnapshot = tooltip.displayedSnapshots[index];
  }

  getData(): string {
    if (this.tooltip.displayedSnapshots === undefined) {
      return 'tooltip field not yet initialized';
    }

    this.getSnapshot();

    const dateTime: Date = new Date(
      this.currentSnapshot.timestamp.seconds * 1000
    );
    const localTimeZone: string = Intl.DateTimeFormat().resolvedOptions()
      .timeZone;
    // TODO(#210): add other details
    return dateTime.toLocaleString('en-GB') + ' ' + localTimeZone;
  }

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
