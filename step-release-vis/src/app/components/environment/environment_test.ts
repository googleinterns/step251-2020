import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnvironmentComponent} from './environment';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {EnvironmentService} from '../../services/environment';
import {EnvironmentServiceStub} from '../../../testing/EnvironmentServiceStub';
import {By} from '@angular/platform-browser';
import {CandidateServiceStub} from '../../../testing/CandidateServiceStub';
import {CandidateService} from '../../services/candidate';

describe('EnvironmentComponent', () => {
  let component: EnvironmentComponent;
  let fixture: ComponentFixture<EnvironmentComponent>;
  let environmentServiceStub: EnvironmentServiceStub;
  let candidateServiceStub: CandidateServiceStub;
  beforeEach(async(() => {
    environmentServiceStub = new EnvironmentServiceStub();
    candidateServiceStub = new CandidateServiceStub();
    TestBed.configureTestingModule({
      declarations: [EnvironmentComponent],
      providers: [
        {provide: EnvironmentService, useValue: environmentServiceStub},
        {provide: CandidateService, useValue: candidateServiceStub},
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

  it('polygons should be assigned', () => {
    fixture.detectChanges();
    expect(component.polygons).toBeTruthy();
  });

  it('colors should be assigned', () => {
    fixture.detectChanges();
    component.polygons.forEach(({colorHue}) => {
      expect(colorHue).toBeLessThan(360);
      expect(colorHue).toBeGreaterThanOrEqual(0);
    });
  });

  it('candName should be assigned', () => {
    fixture.detectChanges();
    component.polygons.forEach(({candName}) => {
      expect(candName).toEqual(environmentServiceStub.candName);
    });
  });

  it('polygons should fit the screen', () => {
    component.width = 100;
    component.height = 100;
    component.ngOnInit();
    fixture.detectChanges();
    component.polygons.forEach(({points}) =>
      points.forEach(({x, y}) => {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThanOrEqual(component.width);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThanOrEqual(component.height);
      })
    );
  });

  it('polygons should respond to hover events', () => {
    const polygons = fixture.debugElement.queryAll(By.css('polygon'));
    for (let i = 0; i < polygons.length; i++) {
      polygons[i].triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(component.polygons[i].highlight).toBeTrue();

      polygons[i].triggerEventHandler('mouseleave', {});
      fixture.detectChanges();
      expect(component.polygons[i].highlight).toBeFalse();
    }
  });
});
