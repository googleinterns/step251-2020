/*
 * Copyright 2020 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

import { convertToParamMap, ParamMap, Params } from '@angular/router';
import { ReplaySubject } from 'rxjs';

/**
 * An ActivateRoute test double with a `queryParamMap` observable.
 * Use the `setQueryParamMap()` method to add the next `paramMap` value.
 */
export class ActivatedRouteStub {
  // Use a ReplaySubject to share previous values with subscribers
  // and pump new values into the `paramMap` observable
  private subject = new ReplaySubject<ParamMap>();

  constructor(initialParams?: Params) {
    this.setQueryParamMap(initialParams);
  }

  /** The mock queryParamMap observable */
  readonly queryParamMap = this.subject.asObservable();

  /** Set the queryParamMap observables' next value */
  setQueryParamMap(params?: Params): void {
    this.subject.next(convertToParamMap(params));
  }
}
