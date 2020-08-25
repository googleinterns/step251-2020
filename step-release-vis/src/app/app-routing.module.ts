import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from './components/home/home';
import {SvgGridComponent} from './components/grid/svg/svg';
import {CanvasGridComponent} from './components/grid/canvas/canvas';
import {EnvironmentsComponent} from './components/environments/environments';
import {FormComponent} from './components/form/form';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'svg', component: SvgGridComponent},
  {path: 'canvas', component: CanvasGridComponent},
  {path: 'env', component: EnvironmentsComponent},
  {path: 'form', component: FormComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
