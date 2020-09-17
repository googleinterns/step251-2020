/*
 * Copyright 2020 Google LLC.
 * SPDX-License-Identifier: Apache-2.0
 */

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home';
import {SvgGridComponent} from './components/grid/svg/svg';
import {CanvasGridComponent} from './components/grid/canvas/canvas';
import {EnvironmentsComponent} from './components/environments/environments';
import {DataSubmissionFormComponent} from './components/form/dataSubmissionForm';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'svg', component: SvgGridComponent},
  {path: 'canvas', component: CanvasGridComponent},
  {path: 'env', component: EnvironmentsComponent},
  {path: 'form', component: DataSubmissionFormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
