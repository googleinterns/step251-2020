/*
 * Copyright 2020 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {Project} from '../app/models/Data';
import {SampleData} from './SampleData';

@Injectable({
  providedIn: 'root',
})
export class ProtoBufferServiceStub {
  project = new SampleData().project;

  getDataFromBinary(data: Uint8Array): Project {
    return this.project;
  }

  getDataFromString(data: Uint8Array): Project {
    return this.project;
  }
}
