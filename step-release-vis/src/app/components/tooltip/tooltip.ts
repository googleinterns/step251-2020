import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
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
  @Output() tooltipHovered = new EventEmitter<boolean>();
  @Output() tooltipHovered: EventEmitter<boolean> = new EventEmitter();
  @Input() currentCandidate: string;

  readonly PIXELS_PER_CAND = 20;
  width = 200;
  height = 50;
  @Input() currentCandidate: string;

  /* Set tooltip font size to "fontMultiplier vw" */
  readonly oneVwInPixels =
    Math.max(document.documentElement.clientWidth, window.innerWidth || 0) /
    100;
  readonly fontMultiplier = 0.8;
  readonly PIXELS_PER_CAND = 2 * (this.fontMultiplier * this.oneVwInPixels);

  width = 14 * this.oneVwInPixels;
  height = 2.5 * this.oneVwInPixels;

  constructor() {}

  ngOnInit(): void {}

  isReady(): boolean {
    return this.currentSnapshot !== undefined;
  }

  /* Displays date,time,local timezone and candidate info with rapid links.
   * Current candidate info is written in bold.
   */
  getData(): string {
    const dateTime: string = new Date(
      this.currentSnapshot.timestamp.seconds * 1000
    ).toLocaleString('en-GB', {timeZoneName: 'short'});
    const currentTime = `<h3>${dateTime}</h3>`;

    let candidateInfo = '';
    for (const candidate of this.currentSnapshot.candidatesList) {
      const name: string = candidate.candidate;
      const link = `<a href=${'https://rapid/' + name}>${name}</a>`;
      let candidateDescription = `<p>${link}: ${candidate.jobCount} job(s)</p>`;

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

  getWidth(): string {
    return this.width + 'px';
  }

  getHeight(): string {
    return (
      this.height +
      this.PIXELS_PER_CAND * this.currentSnapshot.candidatesList.length +
      'px'
    );
  }

  enteredTooltip(): void {
    this.tooltipHovered.emit(true);
  }

  leftTooltip(): void {
    this.tooltipHovered.emit(false);
    this.tooltip.clickOn = false;
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
