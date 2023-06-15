import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, of, startWith, switchMap, map, Observable, bufferCount, Subject, Subscription, timestamp } from 'rxjs';

type Command = "start" | "stop" | "wait" | "reset";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent implements OnDestroy{
  timer$: Observable<number>;
  active$: Observable<boolean>;
  command$ = new BehaviorSubject<Command>("stop");
  dbClick$ = new Subject<void>;
  dbClickSubscription?: Subscription;
  
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

    this.dbClickSubscription = this.dbClick$.pipe(timestamp(), bufferCount(2, 1)).subscribe(clicks => {
      if ((clicks[1].timestamp - clicks[0].timestamp) < 300)
        this.command$.next("wait");
    });
  }

  ngOnDestroy(): void {
    this.dbClickSubscription?.unsubscribe();
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
    this.dbClick$.next();
  }
}
