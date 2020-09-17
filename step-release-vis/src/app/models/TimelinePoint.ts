export class TimelinePoint {
  timestamp: number;
  x: number;
  timeString: string;
  dateString: string;

  constructor(timestamp: number, x: number) {
    this.timestamp = timestamp;
    this.x = x;
    const date = new Date(this.timestamp * 1000);
    this.dateString = date.toLocaleDateString();
    this.timeString = date.toLocaleTimeString();
  }
}
