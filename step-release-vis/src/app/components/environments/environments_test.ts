import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnvironmentsComponent} from './environments';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DataServiceStub} from '../../../testing/DataServiceStub';
import {DataService} from '../../services/dataService';
import {ActivatedRouteStub} from '../../../testing/ActivatedRouteStub';
import {ActivatedRoute} from '@angular/router';
import {EnvironmentComponent} from '../environment/environment';
import {CandidateServiceStub} from '../../../testing/CandidateServiceStub';
import {CandidateService} from '../../services/candidateService';
import {ProtoBufferService} from '../../services/protoBufferService';
import {ProtoBufferServiceStub} from '../../../testing/ProtoBufferServiceStub';
import {TooltipComponent} from '../tooltip/tooltip';
import {By} from '@angular/platform-browser';

describe('EnvironmentsComponent', () => {
  let component: EnvironmentsComponent;
  let fixture: ComponentFixture<EnvironmentsComponent>;
  let activatedRouteStub: ActivatedRouteStub;
  let dataServiceStub: DataServiceStub;
  let candidateServiceStub: CandidateServiceStub;
  let protoBufferServiceStub: ProtoBufferServiceStub;

  beforeEach(async(() => {
    dataServiceStub = new DataServiceStub();
    activatedRouteStub = new ActivatedRouteStub({
      jsonUri: dataServiceStub.data.jsonData,
    });
    candidateServiceStub = new CandidateServiceStub(new CandidateService());
    protoBufferServiceStub = new ProtoBufferServiceStub();
    TestBed.configureTestingModule({
      declarations: [
        EnvironmentsComponent,
        EnvironmentComponent,
        TooltipComponent,
      ],
      imports: [HttpClientTestingModule],
      providers: [
        {provide: DataService, useValue: dataServiceStub},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: CandidateService, useValue: candidateServiceStub},
        {provide: ProtoBufferService, useValue: protoBufferServiceStub},
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    sessionStorage.removeItem(component.START_TIMESTAMP_KEY);
    sessionStorage.removeItem(component.END_TIMESTAMP_KEY);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign environments field', () => {
    expect(component.environments).toBeTruthy();
  });

  it('should assign envWidth and envHeight fields', () => {
    expect(component.envSmallWidth).toBeTruthy();
    expect(component.envSmallHeight).toBeTruthy();
  });

  it('should calculate timelinePoints', () => {
    expect(component.timelinePoints).toBeTruthy();
  });

  describe('start/end fields', () => {
    it('should assign start/end fields', () => {
      expect(component.startTimestamp).toBeTruthy();
      expect(component.endTimestamp).toBeTruthy();
    });

    it('should read start/end from sessionStorage', () => {
      sessionStorage.setItem(
        component.START_TIMESTAMP_KEY,
        `${component.minTimestamp}`
      );
      sessionStorage.setItem(
        component.END_TIMESTAMP_KEY,
        `${component.maxTimestamp}`
      );
      component.ngOnInit();
      fixture.detectChanges();
      expect(component.startTimestamp).toEqual(component.minTimestamp);
      expect(component.endTimestamp).toEqual(component.maxTimestamp);
    });
  });

  it('should generate timelinePoints which fit timeline and bounds', () => {
    component.timelinePoints.forEach(({timestamp, x}) => {
      expect(timestamp).toBeGreaterThanOrEqual(component.startTimestamp);
      expect(timestamp).toBeLessThanOrEqual(component.endTimestamp);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(component.envBigWidth);
    });
  });
  it('should have first and last timeline points close to edges', () => {
    expect(
      Math.abs(component.timelinePoints[0].timestamp - component.startTimestamp)
    ).toBeLessThan(100);
    expect(
      Math.abs(
        component.timelinePoints[component.timelinePoints.length - 1]
          .timestamp - component.endTimestamp
      )
    ).toBeLessThan(100);
  });

  describe('candidates', () => {
    it('should add candidates to service', () => {
      const candNames = getVisibleCandNames();
      expect(candNames.size).toEqual(candidateServiceStub.candColors.size);
      candNames.forEach(candName => {
        expect(candidateServiceStub.candColors.has(candName)).toBeTrue();
      });
    });

    it('should generate unique colors for candidates', () => {
      const candColors = new Set<number>();
      getVisibleCandNames().forEach(candName => {
        const candColor = candidateServiceStub.candColors.get(candName);
        expect(candColor).toBeTruthy();
        expect(candColors.has(candColor)).toBeFalse();
        candColors.add(candColor);
      });
    });

    function getVisibleCandNames(): Set<string> {
      const candNames = new Set<string>();
      component.environments.forEach(({snapshotsList}) => {
        snapshotsList
          .filter(
            ({timestamp}) =>
              component.startTimestamp <= timestamp.seconds &&
              timestamp.seconds <= component.endTimestamp
          )
          .forEach(({candidatesList}) => {
            candidatesList.forEach(({candidate}) => {
              candNames.add(candidate);
            });
          });
      });
      return candNames;
    }
  });

  describe('#sortEnvSnapshots', () => {
    it('should produce sorted snapshots', () => {
      component
        // @ts-ignore
        .sortEnvSnapshots(dataServiceStub.data.jsonData)
        .forEach(({snapshotsList}) => {
          for (let i = 1; i < snapshotsList.length; i++) {
            expect(snapshotsList[i].timestamp.seconds).toBeGreaterThan(
              snapshotsList[i - 1].timestamp.seconds
            );
          }
        });
    });
  });

  describe('#getISOString', () => {
    it('should produce result of length 19 (yyyy-MM-ddThh:mm:ss)', () => {
      // @ts-ignore
      expect(component.getLocalISOString(0).length).toEqual(19);
    });

    it('should format dates correctly', () => {
      // @ts-ignore
      expect(component.getLocalISOString(component.TZ_OFFSET)).toEqual(
        '1970-01-01T00:00:00'
      );
      expect(
        // @ts-ignore
        component.getLocalISOString(1598389200 + component.TZ_OFFSET)
      ).toEqual('2020-08-25T21:00:00');
    });
  });

  describe('#getTimestampFromEvent', () => {
    it('should be opposite of getLocalISOString', () => {
      let timestamp = 0;
      expect(
        // @ts-ignore
        component.getTimestampFromEvent(event(timestamp))
      ).toEqual(timestamp);
      timestamp = 1598389200;
      expect(
        // @ts-ignore
        component.getTimestampFromEvent(event(timestamp))
      ).toEqual(timestamp);
    });
  });

  describe('time range update', () => {
    it('should update start/end timestamps on event triggers', () => {
      const startInput = fixture.debugElement.query(
        By.css('#timerange-start-input')
      );
      const endInput = fixture.debugElement.query(
        By.css('#timerange-end-input')
      );
      const newStart = component.startTimestamp + 1000;
      const newEnd = component.endTimestamp - 1000;
      startInput.triggerEventHandler('input', event(newStart));
      endInput.triggerEventHandler('input', event(newEnd));
      expect(component.startTimestamp).toEqual(newStart);
      expect(component.endTimestamp).toEqual(newEnd);
      component.timelinePoints.forEach(({timestamp}) => {
        expect(timestamp).toBeGreaterThanOrEqual(component.startTimestamp);
        expect(timestamp).toBeLessThanOrEqual(component.endTimestamp);
      });
    });

    it('should save start/end timestamps to storage', () => {
      const startInput = fixture.debugElement.query(
        By.css('#timerange-start-input')
      );
      const endInput = fixture.debugElement.query(
        By.css('#timerange-end-input')
      );
      const newStart = component.startTimestamp + 1000;
      const newEnd = component.endTimestamp - 1000;
      startInput.triggerEventHandler('input', event(newStart));
      endInput.triggerEventHandler('input', event(newEnd));
      expect(sessionStorage.getItem(component.START_TIMESTAMP_KEY)).toEqual(
        `${newStart}`
      );
      expect(sessionStorage.getItem(component.END_TIMESTAMP_KEY)).toEqual(
        `${newEnd}`
      );
    });
  });

  function event(value: number): any {
    // @ts-ignore
    return {target: {value: component.getLocalISOString(value)}};
  }
});
