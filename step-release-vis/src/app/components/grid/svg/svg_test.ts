import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgGridComponent } from './svg';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRouteStub} from '../../../../testing/ActivatedRouteStub';
import {ActivatedRoute} from '@angular/router';

describe('SvgGridComponent', () => {
  let component: SvgGridComponent;
  let fixture: ComponentFixture<SvgGridComponent>;
  let activatedRouteStub: ActivatedRouteStub;
  const params = {
    c: 1,
    w: 2,
    h: 3,
    r: 4
  };

  beforeEach(async(() => {
    activatedRouteStub = new ActivatedRouteStub(params);
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
    expect(component.grids).toEqual(params.c);
    expect(component.gridWidth).toEqual(params.w);
    expect(component.gridHeight).toEqual(params.h);
    expect(component.rectRadius).toEqual(params.r);
  });

  it('svg initialized', () => {
    expect(document.getElementById('svg_grid')).toBeTruthy();
  });
});
