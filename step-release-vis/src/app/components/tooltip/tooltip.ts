import {Component, Input, OnInit} from '@angular/core';
import {Snapshot} from '../../models/Data';
import {Tooltip} from '../../models/Tooltip';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.css'],
})
export class TooltipComponent implements OnInit {
  @Input() tooltip: Tooltip = new Tooltip();
  @Input() currentSnapshot: Snapshot;

  constructor() {}

  ngOnInit(): void {}

  isReady(): boolean {
    return this.tooltip.envName !== undefined;
  }

  getData(): string {
    const dateTime: Date = new Date(
      this.currentSnapshot.timestamp.seconds * 1000
    ).toLocaleString('en-GB');
    const localTimeZone: string = Intl.DateTimeFormat().resolvedOptions()
      .timeZone;
    const currentTime: string = dateTime + ' ' + localTimeZone;
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
