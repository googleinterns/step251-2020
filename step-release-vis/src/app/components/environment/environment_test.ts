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
    candidateServiceStub = new CandidateServiceStub(new CandidateService());
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
    component.svgWidth = 100;
    component.svgHeight = 100;
    component.environment = environmentServiceStub.env;
    component.startTimestamp = environmentServiceStub.minTimestamp;
    component.endTimestamp = environmentServiceStub.maxTimestamp;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('polygons', () => {
    it('polygons should be assigned', () => {
      expect(component.polygons).toBeTruthy();
    });

    it('polygons should fit the screen', () => {
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

    it('tooltip should show, move position and disappear', () => {
      const tooltip = document.querySelector('app-tooltip');
      const div = document.createElement('div');
      div.style.position = 'fixed';
      tooltip.appendChild(div);
      const polygons = fixture.debugElement.queryAll(By.css('polygon'));

      polygons[1].triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      expect(div.style.display).toBe('block');

      polygons[1].triggerEventHandler('mousemove', {pageX: 500, pageY: 200});
      fixture.detectChanges();
      expect(div.style.top).toBe('220px');
      expect(div.style.left).toBe('520px');

      polygons[1].triggerEventHandler('mouseleave', {});
      fixture.detectChanges();
      expect(div.style.display).toBe('none');
    });
  });

  describe('displayedSnapshots field', () => {
    it('displayedSnapshots should be assigned', () => {
      expect(component.displayedSnapshots).toBeTruthy();
    });

    it('displayedSnapshots size should be limited', () => {
      expect(component.displayedSnapshots.length).toBeLessThanOrEqual(
        component.SNAPSHOTS_PER_ENV
      );
    });

    it('displayedSnapshots timestamps should be in increasing order', () => {
      const snapshots = component.displayedSnapshots;
      for (let i = 1; i < snapshots.length; i++) {
        expect(snapshots[i].timestamp.seconds).toBeGreaterThan(
          snapshots[i - 1].timestamp.seconds
        );
      }
    });

    it('displayedSnapshots timestamps should fit the range', () => {
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
