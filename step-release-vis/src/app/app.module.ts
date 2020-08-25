import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HashLocationStrategy, LocationStrategy} from '@angular/common';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app-routing.module';
import {SvgGridComponent} from './components/grid/svg/svg';
import {CanvasGridComponent} from './components/grid/canvas/canvas';
import {HomeComponent} from './components/home/home';
import {EnvironmentComponent} from './components/environment/environment';
import {HttpClientModule} from '@angular/common/http';
import {EnvironmentsComponent} from './components/environments/environments';
import {FormComponent} from './components/form/form';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [
    AppComponent,
    SvgGridComponent,
    CanvasGridComponent,
    HomeComponent,
    EnvironmentComponent,
    EnvironmentsComponent,
    FormComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
  ],
  providers: [{provide: LocationStrategy, useClass: HashLocationStrategy}],
  bootstrap: [AppComponent],
})
export class AppModule {}
