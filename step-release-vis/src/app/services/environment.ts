import {Injectable} from '@angular/core';
import {Polygon} from '../models/Polygon';
import {Point} from '../models/Point';
import {CandidateInfo, Environment} from '../models/Data';

// TODO(naoai): Iterate and calculate the polygons
@Injectable({
  providedIn: 'root'
})
export class EnvironmentService {

  constructor() {
  }

  // xs: 0-100, ys: timestamps
  getPolygons(jsonFile: string): Polygon[] {
    const environments = this.readJson(jsonFile);

    var polys: Polygon[] = [];

    // Assume there is only one environment
    // Assume for now a candidate appears only once per environment (solution: give the polygons ids)

    for (var environment of environments) {
      var newPointSet: PointSet = new PointSet();
      var lastPointSet: PointSet = new PointSet();
      var lowerBounds : Map<string, Point[]> = new Map(); // both upper and lower bounds will contain the leftmost / rightmost point
      var upperBounds : Map<string, Point[]> = new Map();
      var lastTimeStamp = 0;

      for (var snapshot of environment.snapshots) {
        var update: [PointSet, number] = this.insertAndAdjustPoints(snapshot.cands_info, lastPointSet);
        newPointSet = update[0];
        this.addSnapshotToPolygons(lowerBounds, upperBounds, newPointSet.snapshot, update[1], snapshot.timestamp, lastTimeStamp);

        lastPointSet = this.closePolygons(polys, lowerBounds, upperBounds, newPointSet); // delete inexisting ones
        lastTimeStamp = snapshot.timestamp;
      }

      // draw the vertical line and add remaining polys
      for (var i = 0; i < lastPointSet.snapshot.length; i ++) {
        var name: string = lastPointSet.snapshot[i].candName;
        this.addToMap(lowerBounds, name, {x: lastTimeStamp, y: lastPointSet.snapshot[i].position});
        polys.push(this.createPolygon(lowerBounds.get(name), upperBounds.get(name)));
      }
    }

    this.printPolys(polys);
    return polys;
  }

  private printPolys (v : Polygon[]) {
    console.log("These are the final polygons:");
    for (var x of v) {
      console.log("-----");
      for (var point of x.points) {
        console.log(point.x, point.y);
      }
    }
  }

  private addToMap (map: Map<string, Point[]>, key: string, point: Point) {
    var prev: Point[] = [];
    if (map.has(key)) {
      prev = map.get(key);
    }

    var curr: Point[] = prev;
    curr.push(point);
    map.set(key, curr);
  }

  private addSnapshotToPolygons(lower: Map<string, Point[]>, upper: Map<string, Point[]>,
                                set: CandidatePosition[], insertions: number,
                                time: number, lastTime: number) {
    for (var i = set.length - insertions; i < set.length; i ++) {
      this.addToMap(lower, set[i].candName, {x: lastTime, y: 0});
      this.addToMap(upper, set[i].candName, {x: lastTime, y: 0});
    }

    for (var i = 0; i < set.length; i ++) {
      this.addToMap(upper, set[i].candName, {x: time, y: set[i].position});
      this.addToMap(lower, set[i].candName, {x: time, y: ((i==0) ? 0 : set[i-1].position)});
    }
  }

  private createPolygon (lower: Point[], upper: Point[]) : Polygon {
    var points : Point[] = [];
    for (var point of lower)
      points.push(point);
    points.pop();

    var revUpper = upper.reverse();
    for (var point of revUpper)
      points.push(point);
    points.pop();

    return new Polygon(points);
  }

  private closePolygons (polys: Polygon[], lower: Map<string, Point[]>,
                          upper: Map<string, Point[]>, set: PointSet) : PointSet {
    var newSet : PointSet = new PointSet();

    for (var i = 0; i < set.snapshot.length; i ++) {
      if (set.snapshot[i].position == ((i == 0) ? 0 : set.snapshot[i - 1].position)) {
        var name: string = set.snapshot[i].candName;
        polys.push(this.createPolygon(lower.get(name), upper.get(name)));
      } else {
        newSet.orderMap.set(set.snapshot[i].candName, newSet.snapshot.length);
        newSet.snapshot.push(set.snapshot[i]);
      }
    }

    return newSet;
  }

  private insertAndAdjustPoints(candsInfo: CandidateInfo[], set: PointSet): [PointSet, number] {
    let percentages = this.getPercentages(candsInfo);
    var newSet : PointSet = set;

    for (var i = 0; i < set.snapshot.length; i ++) {
      if (percentages.has(set.snapshot[i].candName)) { // still exists
        newSet.snapshot[i].position = percentages.get(set.snapshot[i].candName);
      } else { // will be erased
        newSet.snapshot[i].position = 0;
      }
    }

    var newCandidates = 0;
    for (let entry of percentages.entries()) {
      if (!set.orderMap.has(entry[0])) { // the candidate has to be introduced
        newCandidates ++;
        newSet.orderMap.set(entry[0], newSet.snapshot.length);
        newSet.snapshot.push(new CandidatePosition(entry[0], entry[1]));
      }
    }

    var sum = 0;
    for (var i = 0; i < newSet.snapshot.length; i ++) {
      sum += newSet.snapshot[i].position;
      newSet.snapshot[i].position = sum;
    }
    return [newSet, newCandidates];
  }

  private getPercentages(candsInfo: CandidateInfo[]): Map<string, number> {
    var map : Map<string, number> = new Map();
    var totalJobSum = 0;

    for (var candInfo of candsInfo) {
      totalJobSum += candInfo.job_count;
    }

    var percentageSum = 0;
    for (var candInfo of candsInfo) {
      var percentage = Math.floor(candInfo.job_count / totalJobSum * 100);
      map.set(candInfo.name, percentage);
      percentageSum += percentage;
    }

    // treat rounding error here
    var prevValue = map.get(candsInfo[0].name);
    map.set(candsInfo[0].name, prevValue + 100 - percentageSum);
    return map;
  }

  // TODO(andreystar): add json from file
  private readJson(jsonFile: string): Environment[] {
    var json = `[
  {
    "environment": "prod",
    "snapshots": [
      {
        "timestamp": 125,
        "cands_info": [
          {
            "name": "1",
            "job_count": 100
          },
          {
            "name": "2",
            "job_count": 1000
          },
          {
            "name": "3",
            "job_count": 900
          }
        ]
      },
      {
        "timestamp": 900,
        "cands_info": [
          {
            "name": "2",
            "job_count": 2000
          }
        ]
      }
    ]
  }
]
`;
    json = `[
  {
    "environment": "prod",
    "snapshots": [
      {
        "timestamp": 1,
        "cands_info": [
          {
            "name": "1",
            "job_count": 10
          },
          {
            "name": "2",
            "job_count": 90
          }
        ]
      },
            {
        "timestamp": 2,
        "cands_info": [
          {
            "name": "1",
            "job_count": 90
          },
          {
            "name": "2",
            "job_count": 10
          }
        ]
      }
    ]
  }
]`;
    const envs: Environment[] = JSON.parse(json);
    return envs;
  }
}

type CandidatesSnapshot = CandidateSnapshot[];

class PointSet {
  orderMap: Map<string, number>;
  snapshot: CandidatePosition[];

  constructor() {
    this.orderMap = new Map();
    this.snapshot = [];
  }
}

class CandidatePosition {
  candName: string;
  position: number;

  constructor (name: string, pos: number) {
    this.candName = name;
    this.position = pos;
  }
}

interface CandidateSnapshot {
  candName: string;
  percentage: number;
}
