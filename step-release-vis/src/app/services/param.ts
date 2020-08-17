import {Injectable} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ParamService {

  constructor() {
  }

  param(route: ActivatedRoute, name: string, defaultValue: string): Observable<string> {
    return route.queryParamMap.pipe(map(pMap => {
      const value = pMap.get(name);
      console.log(pMap);
      return value ? value : defaultValue;
    }));
  }

  paramInt(route: ActivatedRoute, name: string, defaultValue: number): Observable<number> {
    return this.param(route, name, String(defaultValue)).pipe(map(value => parseInt(value, 10)));
  }
}
