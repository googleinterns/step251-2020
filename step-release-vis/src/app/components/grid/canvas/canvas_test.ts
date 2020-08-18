import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasGridComponent } from './canvas';
import {RouterTestingModule} from '@angular/router/testing';
import {ActivatedRouteStub} from '../../../../testing/ActivatedRouteStub';
import {ActivatedRoute} from '@angular/router';

describe('CanvasGridComponent', () => {
  let component: CanvasGridComponent;
  let fixture: ComponentFixture<CanvasGridComponent>;
  let activatedRouteStub: ActivatedRouteStub;
  const params = {
    c: 1,
    w: 2,
    h: 3,
    fps: 4
  };

  beforeEach(async(() => {
    activatedRouteStub = new ActivatedRouteStub(params);
    TestBed.configureTestingModule({
      declarations: [ CanvasGridComponent ],
      providers: [
        {provide: ActivatedRoute, useValue: activatedRouteStub}
      ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasGridComponent);
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
    expect(component.fps).toEqual(params.fps);
  });

  it('canvas initialized', () => {
    expect(document.getElementById('canvas_grid')).toBeTruthy();
  });
});
