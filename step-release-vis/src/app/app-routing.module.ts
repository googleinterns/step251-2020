import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {HomeComponent} from './components/home/home';
import {SvgGridComponent} from './components/grid/svg/svg';
import {CanvasGridComponent} from './components/grid/canvas/canvas';
import {EnvironmentComponent} from "./components/environment/environment";

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'svg', component: SvgGridComponent },
  { path: 'canvas', component: CanvasGridComponent },
  { path: 'env', component: EnvironmentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
