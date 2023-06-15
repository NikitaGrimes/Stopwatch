import { ChangeDetectionStrategy, Component } from '@angular/core';
import { BehaviorSubject, interval, of, startWith, switchMap, map, Observable, bufferCount, Subject } from 'rxjs';

type Command = "start" | "stop" | "wait" | "reset";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent{
  timer$: Observable<number>;
  active$: Observable<boolean>;
  command$ = new BehaviorSubject<Command>("stop");
  dbClick$ = new Subject<number>;
  
  constructor(){
    let time = 0;
    this.timer$ = this.command$.pipe(switchMap(command => {
      const temp = time;
      switch (command){
        case "start":
          return interval(100).pipe(map(() => ++time), startWith(time));
        case "stop":
          time = 0;
          return of(temp);
        case "wait":
          return of(time);
        case "reset":
          time = 0;
          return interval(100).pipe(map(() => ++time), startWith(0));
      }
    }));

    this.active$ = this.command$.pipe(map(command => {
      return command === "start" || command === "reset";
    }));

    this.dbClick$.pipe(bufferCount(2, 1)).subscribe(clicks => {
      if ((clicks[1] - clicks[0]) < 300)
        this.command$.next("wait");
    });
  }

  get runChangeDetection() {
    console.log('Checking the view');
    return "";
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
    this.dbClick$.next(Date.now());
  }
}
