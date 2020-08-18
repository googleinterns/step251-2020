import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnvironmentComponent} from './environment';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {EnvironmentService} from '../../services/environment';
import {EnvironmentServiceStub} from '../../../testing/EnvironmentServiceStub';
import {ActivatedRoute} from '@angular/router';
import {ActivatedRouteStub} from '../../../testing/ActivatedRouteStub';

describe('EnvironmentComponent', () => {
  let component: EnvironmentComponent;
  let fixture: ComponentFixture<EnvironmentComponent>;
  let environmentServiceStub: EnvironmentServiceStub;
  let activatedRouteStub: ActivatedRouteStub;
  const routeParams = {
    jsonFile: 'test.json',
    envName: 'test',
  };
  beforeEach(async(() => {
    environmentServiceStub = new EnvironmentServiceStub();
    activatedRouteStub = new ActivatedRouteStub(routeParams);
    TestBed.configureTestingModule({
      declarations: [EnvironmentComponent],
      providers: [
        {provide: EnvironmentService, useValue: environmentServiceStub},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
      ],
      imports: [RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('query params should be assigned', () => {
    fixture.detectChanges();
    expect(component.jsonFile).toEqual(routeParams.jsonFile);
    expect(component.envName).toEqual(routeParams.envName);
  });

  it('colors should be assigned', () => {
    fixture.detectChanges();
    component.polygons.forEach(({color, candName}) => {
      expect(color).toMatch(/^#[0-9a-f]{6}$/);
      expect(candName).toEqual('test');
    });
  });

  it('polygons should be assigned', () => {
    fixture.detectChanges();
    expect(component.polygons).toBeTruthy();
  });

  it('polygons should be ', () => {});
});
