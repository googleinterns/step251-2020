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

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should assign environments field', () => {
    expect(component.environments).toBeTruthy();
  });

  it('should assign envWidth and envHeight fields', () => {
    expect(component.envWidth).toBeTruthy();
    expect(component.envHeight).toBeTruthy();
  });

  it('should calculate timelinePoints', () => {
    expect(component.timelinePoints).toBeTruthy();
  });

  it('should generate timelinePoints which fit timeline and bounds', () => {
    component.timelinePoints.forEach(({timestamp, x}) => {
      expect(timestamp).toBeGreaterThanOrEqual(component.startTimestamp);
      expect(timestamp).toBeLessThanOrEqual(component.endTimestamp);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(component.envWidth);
    });
  });

  it('should add candidates to service', () => {
    const candNames = getCandNames();
    expect(candNames.size).toEqual(candidateServiceStub.candColors.size);
    candNames.forEach(candName => {
      expect(candidateServiceStub.candColors.has(candName)).toBeTrue();
    });
  });

  it('should generate unqiue colors for candidates', () => {
    const candColors = new Set<number>();
    getCandNames().forEach(candName => {
      const candColor = candidateServiceStub.candColors.get(candName);
      expect(candColor).toBeTruthy();
      expect(candColors.has(candColor)).toBeFalse();
      candColors.add(candColor);
    });
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

  function getCandNames(): Set<string> {
    const candNames = new Set<string>();
    component.environments.forEach(({snapshotsList}) => {
      snapshotsList.forEach(({candidatesList}) => {
        candidatesList.forEach(({candidate}) => {
          candNames.add(candidate);
        });
      });
    });
    return candNames;
  }
});
