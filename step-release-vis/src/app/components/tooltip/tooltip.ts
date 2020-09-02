import {Component, Input, OnInit} from '@angular/core';
import {Snapshot} from '../../models/Data';
import {Tooltip} from '../../models/Tooltip';

@Component({
  selector: 'app-tooltip',
  templateUrl: './tooltip.html',
  styleUrls: ['./tooltip.css'],
})
export class TooltipComponent implements OnInit {
  @Input() tooltip: Tooltip;
  @Input() currentSnapshot: Snapshot;
  width = 200;
  height = 50;

  // TODO(#234): Compute width/height of the tooltip according to the data.

  constructor() {}

  ngOnInit(): void {}

  isReady(): boolean {
    return this.currentSnapshot !== undefined;
  }

  getData(): string {
    const dateTime: Date = new Date(
      this.currentSnapshot.timestamp.seconds * 1000
    );
    const localTimeZone: string = Intl.DateTimeFormat().resolvedOptions()
      .timeZone;
    // TODO(#210): add other details
    this.updateStyle();
    return dateTime.toLocaleString('en-GB') + ' ' + localTimeZone;
  }

  // computes the left position of the tooltip according to the mouse's X position
  getLeft(): string {
    const divTooltip = document.getElementById(this.tooltip.envName);

    if (this.tooltip.mouseX + divTooltip.offsetWidth + 40 > window.innerWidth) {
      return this.tooltip.mouseX - divTooltip.offsetWidth - 10 + 'px';
    }
    return this.tooltip.mouseX + 20 + 'px';
  }

  // computes the top position of the tooltip according to the mouse's Y position
  getTop(): string {
    const divTooltip = document.getElementById(this.tooltip.envName);

    if (
      this.tooltip.mouseY + divTooltip.offsetHeight + 40 >
      window.innerHeight
    ) {
      return this.tooltip.mouseY - divTooltip.offsetHeight - 10 + 'px';
    }
    return this.tooltip.mouseY + 20 + 'px';
  }

  getWidth(): string {
    return this.width + 'px';
  }

  getHeight(): string {
    return this.height + 'px';
  }

  private updateStyle(): void {
    const tooltipElement = document.getElementById(this.tooltip.envName);
    if (tooltipElement) {
      const style = tooltipElement.style;
      style.width = this.getWidth();
      style.height = this.getHeight();
      style.left = this.getLeft();
      style.top = this.getTop();
    }
  }
}
