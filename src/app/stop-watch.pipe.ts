import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stopWatch'
})
export class StopWatchPipe implements PipeTransform {

  transform(value: number | null): string {
    if(value !== null){
      let mSecond = (value % 10).toString()
      let second = this.normolizeNumber((Math.floor(value / 10)) % 60);
      let minute = this.normolizeNumber((Math.floor(value / 600)) % 60);
      let hour = this.normolizeNumber(Math.floor(value / 36000));
      return `${hour}:${minute}:${second}:${mSecond}`;
    }

    return "";
  }

  private normolizeNumber(value: number): string{
    return value < 10 ? "0" + value.toString() : value.toString();
  }
}
