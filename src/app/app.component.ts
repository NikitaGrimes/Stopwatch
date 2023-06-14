import { Component } from '@angular/core';
import { BehaviorSubject, interval, map, of, pipe, startWith, switchMap } from 'rxjs';

type Command = "start" | "stop" | "wait" | "reset";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent{
  time = 0;
  timer$ = new BehaviorSubject<number>(this.time);
  command$ = new BehaviorSubject<Command>("stop");
  
  constructor(){
    this.command$.pipe(switchMap((command) => interval(100).pipe(map(_ => {
      switch (command){
        case "start":
          this.timer$.next(++this.time);
          break;
        case "reset":
          this.time = 0;
          this.timer$.next(++this.time);
          this.command$.next("start");
          break;
        case "stop":
          this.command$.next("wait");
          this.time = 0;
          break;
        case "wait":
          
      }
    }), startWith(this.timer$.next(this.time))))).subscribe();
  }

  startWatching(): void{
    this.command$.next("start");
  }

  stopWatching(): void{
    this.command$.next("stop");
  }

  resetWatching(): void{
    this.command$.next("reset");
  }

  waitWatching(): void{
    this.command$.next("wait");
  }
}
