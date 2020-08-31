import {Snapshot} from '../models/Data';

/*
  Used for describing which positions of the mouse correlate to which snapshot to be displayed.
  If the mouse is in [start, end] on the X axis, show details about this snapshot in the tooltip.
  Start and End represent the number of pixels from the environment's svg's border (0 to svg.width)
  Interval ends are halfway between to consecutive timestamps, like in the following representation:

  intervals:  |---||-----||----|...|--|
  timestamps: T1     T2     T3 ...  Tn
*/
export class SnapshotInterval {
  start: number;
  end: number;
  snapshot: Snapshot;
}
