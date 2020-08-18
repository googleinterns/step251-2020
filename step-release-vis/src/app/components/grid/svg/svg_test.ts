import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgGridComponent } from './svg';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRouteStub} from '../../../../testing/ActivatedRouteStub';
import {ActivatedRoute} from '@angular/router';

describe('SvgGridComponent', () => {
  let component: SvgGridComponent;
  let fixture: ComponentFixture<SvgGridComponent>;
  let activatedRouteStub: ActivatedRouteStub;
  const routeParams = {
    c: 1,
    w: 2,
    h: 3,
    r: 4
  };

  beforeEach(async(() => {
    activatedRouteStub = new ActivatedRouteStub(routeParams);
    TestBed.configureTestingModule({
      declarations: [ SvgGridComponent ],
      providers: [
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('params should be assigned', () => {
    fixture.detectChanges();
    expect(component.grids).toEqual(routeParams.c);
    expect(component.gridWidth).toEqual(routeParams.w);
    expect(component.gridHeight).toEqual(routeParams.h);
    expect(component.rectRadius).toEqual(routeParams.r);
  });

  it('svg initialized', () => {
    expect(document.getElementById('svg_grid')).toBeTruthy();
  });
});
