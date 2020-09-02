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
  @Input() currentSnapshot: Snapshot;

  constructor(private candidateService: CandidateService) {}

  ngOnInit(): void {}

  isReady(): boolean {
    return this.tooltip.envName !== undefined;
  }

  getData(): string {
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
