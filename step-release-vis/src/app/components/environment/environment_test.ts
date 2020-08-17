import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnvironmentComponent} from './environment';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Observable, of} from 'rxjs';
import {Polygon} from '../../models/Polygon';
import {EnvironmentService} from '../../services/environment';

describe('EnvironmentComponent', () => {
  let component: EnvironmentComponent;
  let fixture: ComponentFixture<EnvironmentComponent>;
  const fakeEnvironmentService = {
    getPolygons(jsonFile: string): Observable<Polygon[]> {
      return of([
        new Polygon(
          [
            {x: 0, y: 0},
            {x: 0, y: 1},
            {x: 1, y: 1},
            {x: 1, y: 0},
          ],
          'test'
        )
      ]);
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnvironmentComponent],
      providers: [{provide: EnvironmentService, useValue: fakeEnvironmentService}],
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('colors should be assigned', () => {
    fixture.detectChanges();
    component.polygons.forEach(({color}) =>
      expect(color).toMatch(/^#[0-9a-f]{6}$/));
  });
});
