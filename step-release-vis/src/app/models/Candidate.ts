/*
 * Copyright 2020 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

import {Polygon} from './Polygon';

export class Candidate {
  candName: string;
  color: number;
  polygons: Polygon[];

  constructor(candName: string, color: number) {
    this.candName = candName;
    this.color = color;
    this.polygons = [];
  }

  addPolygon(polygon: Polygon): void {
    this.polygons.push(polygon);
  }

  highlight(): void {
    this.polygons.map(polygon => (polygon.highlight = true));
  }

  dehighlight(): void {
    this.polygons.map(polygon => (polygon.highlight = false));
  }

  setColor(color: number): void {
    this.color = color;
    this.polygons.map(polygon => (polygon.colorHue = this.color));

  }
}
