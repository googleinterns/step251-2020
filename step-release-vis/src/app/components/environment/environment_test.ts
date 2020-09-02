import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnvironmentComponent} from './environment';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {EnvironmentService} from '../../services/environmentService';
import {EnvironmentServiceStub} from '../../../testing/EnvironmentServiceStub';
import {By} from '@angular/platform-browser';
import {CandidateServiceStub} from '../../../testing/CandidateServiceStub';
import {CandidateService} from '../../services/candidateService';
import {SimpleChange} from '@angular/core';
import {TooltipComponent} from '../tooltip/tooltip';

describe('EnvironmentComponent', () => {
  let component: EnvironmentComponent;
  let fixture: ComponentFixture<EnvironmentComponent>;
  let environmentServiceStub: EnvironmentServiceStub;
  let candidateServiceStub: CandidateServiceStub;
  beforeEach(async(() => {
    environmentServiceStub = new EnvironmentServiceStub();
    candidateServiceStub = new CandidateServiceStub(new CandidateService());
    TestBed.configureTestingModule({
      declarations: [EnvironmentComponent, TooltipComponent],
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
    component.svgWidth = 100;
    component.svgHeight = 100;
    component.environment = environmentServiceStub.env;
    component.startTimestamp = environmentServiceStub.envMin;
    component.endTimestamp = environmentServiceStub.envMax;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('polygons', () => {
    it('should be assigned', () => {
      expect(component.polygons).toBeTruthy();
    });

    it('should fit the screen', () => {
      component.ngOnInit();
      fixture.detectChanges();
      component.polygons.forEach(({points}) =>
        points.forEach(({x, y}) => {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(component.svgWidth);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThanOrEqual(component.svgHeight);
        })
      );
    });

    it('should respond to hover events', () => {
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

  describe('displayedSnapshots field', () => {
    it('should be assigned', () => {
      expect(component.displayedSnapshots).toBeTruthy();
    });

    it('should be limited in size', () => {
      expect(component.displayedSnapshots.length).toBeLessThanOrEqual(
        component.SNAPSHOTS_PER_ENV
      );
    });

    it('should have timestamps in increasing order', () => {
      const snapshots = component.displayedSnapshots;
      for (let i = 1; i < snapshots.length; i++) {
        expect(snapshots[i].timestamp.seconds).toBeGreaterThan(
          snapshots[i - 1].timestamp.seconds
        );
      }
    });

    it('should have timestamps fitting the range', () => {
      component.displayedSnapshots.forEach(({timestamp}) => {
        expect(timestamp.seconds).toBeGreaterThanOrEqual(
          component.startTimestamp
        );
        expect(timestamp.seconds).toBeLessThanOrEqual(component.endTimestamp);
      });
    });
  });

  describe('time range update', () => {
    let oldStart;
    let oldEnd;
    beforeEach(() => {
      oldStart = component.startTimestamp;
      oldEnd = component.endTimestamp;
      component.ngOnChanges({
        startTimestamp: new SimpleChange(oldStart, oldStart + 1000, false),
        endTimestamp: new SimpleChange(oldEnd, oldEnd - 1000, false),
      });
    });

    it('should update fields', () => {
      expect(component.startTimestamp).toEqual(oldStart + 1000);
      expect(component.endTimestamp).toEqual(oldEnd - 1000);
    });

    it('should update displayed snapshots', () => {
      component.displayedSnapshots.forEach(({timestamp}) => {
        expect(timestamp.seconds).toBeGreaterThanOrEqual(
          component.startTimestamp
        );
        expect(timestamp.seconds).toBeLessThanOrEqual(component.endTimestamp);
      });
    });
  });

  it('colors should be assigned', () => {
    component.polygons.forEach(({colorHue}) => {
      expect(colorHue).toBeLessThan(360);
      expect(colorHue).toBeGreaterThanOrEqual(0);
    });
  });

  it('candName should be assigned', () => {
    component.polygons.forEach(({candName}) => {
      expect(candName).toEqual(environmentServiceStub.candName);
    });
  });
});
