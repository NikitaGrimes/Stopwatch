export class StopWatch {
    constructor(public seconds: number){

    }

    toTime(): string{
        let mSecond: string = (this.seconds % 10).toString();
        let second: string = this.normolizeNumber(Math.floor(this.seconds / 10) % 60);
        let minute: string = this.normolizeNumber((Math.floor(this.seconds / 600)) % 60);
        let hour: string = this.normolizeNumber(Math.floor(this.seconds / 36000));
        return `${hour}:${minute}:${second}:${mSecond}`;
    }

    private normolizeNumber(value: number): string{
        return value < 10 ? "0" + value.toString() : value.toString();
    }
}
