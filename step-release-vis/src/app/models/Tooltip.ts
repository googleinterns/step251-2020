import {Snapshot} from './Data';

/**
 * @param mouseX the X position of the mouse relative to the page
 * @param mouseY the Y position of the mouse relative to the page
 * @param svgMouseX the X position of the mouse relative to the svg element
 * @param show if the tooltip is shown or not
 * @param envName the environment on which the tooltip is
 * @param envWidth the width of the environment's svg
 * @param displayedSnapshots the snapshots displayed in the environment
 */
export class Tooltip {
  mouseX: number;
  mouseY: number;
  svgMouseX: number;

  show = false;

  envName: string;
  envWidth: number;
  displayedSnapshots: Snapshot[];
}
