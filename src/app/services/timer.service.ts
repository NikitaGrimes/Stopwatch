import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TimerService {
  private lastmSecond: number = 0;
  constructor() { }

  getTimer(): Observable<number>{
    return new Observable<number>(subscriber => {
      subscriber.next(this.lastmSecond);
      const timer = setInterval(() => subscriber.next(++this.lastmSecond), 100)
      
      return{
        unsubscribe() {
          clearInterval(timer);
        }
      }
    });
  }

  clear(): void{
    this.lastmSecond = 0;
  }
}
