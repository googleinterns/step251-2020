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
  @Input() currentCandidate: string;
  width = 200;
  height = 30;

  constructor() {}

  ngOnInit(): void {}

  isReady(): boolean {
    return this.tooltip.envName !== undefined;
  }

  /* Displays date,time,local timezone and candidate info with rapid links.
   * Current candidate info is written in bold.
   */
  getData(): string {
    const dateTime: string = new Date(
      this.currentSnapshot.timestamp.seconds * 1000
    ).toLocaleString('en-GB');
    const localTimeZone: string = Intl.DateTimeFormat().resolvedOptions()
      .timeZone;
    const currentTime: string =
      '<h3>' + dateTime + ' ' + localTimeZone + '</h3>';

    let candidateInfo = '';
    for (const candidate of this.currentSnapshot.candidatesList) {
      const name: string = candidate.candidate;
      const link = `<a href=${'https://rapid/' + name}>${name}</a>`;
      let candidateDescription =
        '<p>' + link + ': ' + candidate.jobCount + ' job(s)</p>';

      if (name === this.currentCandidate) {
        candidateDescription = `<b>${candidateDescription}</b>`;
      }

      candidateInfo += candidateDescription;
    }

    this.updateStyle();
    return currentTime + candidateInfo;
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

  // make the tooltip visible or not
  getShow(): string {
    if (this.tooltip.show) {
      return 'block';
    } else {
      return 'none';
    }
  }

  getWidth(): string {
    return this.width + 'px';
  }

  getHeight(): string {
    return this.height + 20 * this.currentSnapshot.candidatesList.length + 'px';
  }

  private updateStyle(): void {
    const tooltipElement = document.getElementById(this.tooltip.envName);
    if (tooltipElement) {
      const style = tooltipElement.style;
      style.width = this.getWidth();
      style.height = this.getHeight();
      style.left = this.getLeft();
      style.top = this.getTop();
      style.display = this.getShow();
    }
  }
}
