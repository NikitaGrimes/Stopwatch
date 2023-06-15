import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { StopWatchPipe } from './pipes/stop-watch.pipe';

@NgModule({
  declarations: [
    AppComponent,
    StopWatchPipe
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
