import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SvgGridComponent } from './components/grid/svg-grid/svg-grid.component';
import { AppRoutingModule } from './app-routing.module';
import { CanvasGridComponent } from './components/grid/canvas-grid/canvas-grid.component';

@NgModule({
  declarations: [
    AppComponent,
    SvgGridComponent,
    CanvasGridComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
