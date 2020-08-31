export class TimelinePoint {
  timestamp: number;
  x: number;
  timeString: string;
  dateString: string;

  constructor(timestamp: number, x: number) {
    this.timestamp = timestamp;
    this.x = x;
    const dateTime = new Date(this.timestamp * 1000)
      .toLocaleString('en-GB')
      .split(', ');
    this.dateString = dateTime[0];
    this.timeString = dateTime[1];
  }
}
