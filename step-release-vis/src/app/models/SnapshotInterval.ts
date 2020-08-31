import {Snapshot} from '../models/Data';

/*
  Used for describing which positions of the mouse corelate to which snapshot to be displayed.
  If the mouse is in [start, end] on the X axis, show details about this snapshot in the tooltip.
*/
export class SnapshotInterval {
  start: number;
  end: number;
  snapshot: Snapshot;
}
