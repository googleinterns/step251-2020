/*
 * Copyright 2020 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

import {Injectable} from '@angular/core';
import {Polygon} from '../app/models/Polygon';
import {CandidateService} from '../app/services/candidateService';

@Injectable({
  providedIn: 'root',
})
export class CandidateServiceStub {
  constructor(private candidateService: CandidateService) {}
  candColors = new Map<string, number>();
  inRelease = new Map<string, string>([
    ['1', 'r'],
    ['2', 'r'],
  ]);
  releaseCandidates = new Map<string, string[]>([['r', ['1', '2']]]);
  scale = this.candidateService.scale;
  sparseArray = this.candidateService.sparseArray;
  processMetadata = this.candidateService.processMetadata;

  getColor(candName: string): number {
    return 0;
  }

  addPolygons(polygons: Polygon[]): void {}

  polygonHovered(polygon: Polygon): void {
    polygon.highlight = true;
  }

  polygonUnhovered(polygon: Polygon): void {
    polygon.highlight = false;
  }

  addCandidate(color: number, name: string): void {
    this.candColors.set(name, color);
  }
}
