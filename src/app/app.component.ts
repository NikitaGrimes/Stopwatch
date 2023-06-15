import { Component, OnDestroy } from '@angular/core';
import { BehaviorSubject, interval, of, startWith, switchMap, map, Subscription, Subject, filter, timer } from 'rxjs';

type Command = "start" | "stop" | "wait" | "reset";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  timer$ = new BehaviorSubject<number>(0);
  command$ = new BehaviorSubject<Command>("stop");
  commandSubscribtion?: Subscription;
  
  constructor(){
    let currentTime = 0;
    let waitTime = 0;
    let lastClickTime = 0;
    this.commandSubscribtion = this.command$.pipe(filter(command => {
      const nowClickTime = Date.now();
      if (command !== "wait" || (command === "wait" && ((nowClickTime - lastClickTime) < 300)))
        return true;
      lastClickTime = nowClickTime;
      return false;
    }), switchMap(command => {
      switch (command){
        case "start":
          return interval(1000).pipe(map(value => ++value), startWith(0));
        case "stop":
          currentTime += waitTime;
          waitTime = 0;
          return of(currentTime);
        case "wait":
           waitTime += currentTime;
          return of(0);
        case "reset":
          waitTime = 0;
          return interval(1000).pipe(map(value => ++value), startWith(0));
      }
    })).subscribe(value => {
      
      currentTime = value;
      this.timer$.next(waitTime + currentTime);
    });
  }

  ngOnDestroy(): void {
    this.commandSubscribtion?.unsubscribe();
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
