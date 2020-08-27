export class TimelinePoint {
  timestamp: number;
  x: number;
  timestampString: string;

  constructor(timestamp: number, x: number) {
    this.timestamp = timestamp;
    this.x = x;
    this.timestampString = new Date(this.timestamp * 1000).toLocaleString(
      'en-GB'
    );
  }
}
