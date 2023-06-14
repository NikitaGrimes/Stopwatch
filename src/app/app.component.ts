import { Component, OnDestroy } from '@angular/core';
import { Subscription, BehaviorSubject, interval} from 'rxjs';
import { StopWatch } from './models/stop-watch';
import { TimerService } from './services/timer.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy{
  time: StopWatch = new StopWatch(0);
  timerSubscription?: Subscription;
  isTimerRunning: boolean = false;
  dbClickSubject?: BehaviorSubject<number>;
  
  constructor(private timerService: TimerService){

  }

  ngOnDestroy(): void {
    this.timerSubscription?.unsubscribe();
  }

  startWatching(): void{
    if (this.isTimerRunning)
      return;

    this.timerSubscription = this.timerService.getTimer().subscribe(second => this.time.seconds = second)
    this.isTimerRunning = true;
  }

  stopWatching(): void{
    this.timerSubscription?.unsubscribe();
    this.timerService.clear();
    this.isTimerRunning = false;
  }

  resetWatching(): void{
    this.timerSubscription?.unsubscribe();
    this.timerService.clear();
    this.timerSubscription = this.timerService.getTimer().subscribe(second => this.time.seconds = second)
    this.isTimerRunning = true;
  }

  waitWatching(): void{
    if(!this.dbClickSubject){
      this.dbClickSubject = new BehaviorSubject<number>(Date.now());
      return;
    }

    let timeNow = Date.now();
    this.dbClickSubject.subscribe(lastTime => {
      if ((timeNow - lastTime) < 300){
        this.timerSubscription?.unsubscribe();
        this.isTimerRunning = false;
      }
    }).unsubscribe();
    this.dbClickSubject.next(timeNow);
  }
}
