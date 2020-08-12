import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AppComponent} from './app.component';
import {SvgGridComponent} from './components/grid/svg-grid/svg-grid.component';
import {CanvasGridComponent} from './components/grid/canvas-grid/canvas-grid.component';

const routes: Routes = [
  { path: '', component: AppComponent },
  { path: 'svg', component: SvgGridComponent },
  { path: 'canvas', component: CanvasGridComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
