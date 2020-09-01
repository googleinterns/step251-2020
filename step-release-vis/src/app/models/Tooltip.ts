/**
 * @param x the X position of the mouse
 * @param y the Y position of the mouse
 * @param show if the tooltip is shown or not
 * @param envName the environment on which the tooltip is
 */
export class Tooltip {
  x: number;
  y: number;
  show = false;
  envName: string;
}
