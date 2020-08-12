import { Injectable } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ParamService {

  constructor() { }

   param(route: ActivatedRoute, name: string, defaultValue: string): string {
    const value = route.snapshot.queryParamMap.get(name);
    return value ? value : defaultValue;
  }

   paramInt(route: ActivatedRoute, name: string, defaultValue: number): number {
    return parseInt(this.param(route, name, String(defaultValue)), 10);
  }
}
