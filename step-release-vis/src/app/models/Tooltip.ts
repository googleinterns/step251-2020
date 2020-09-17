/*
 * Copyright 2020 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @param mouseX the X position of the mouse relative to the page
 * @param mouseY the Y position of the mouse relative to the page
 * @param show if the tooltip is shown or not
 * @param envName the environment on which the tooltip is
 */
export class Tooltip {
  mouseX: number;
  mouseY: number;
  clickOn: boolean;

  show = false;

  envName: string;
}
