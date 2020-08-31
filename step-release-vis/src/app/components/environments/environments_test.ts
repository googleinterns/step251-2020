import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnvironmentsComponent} from './environments';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FileServiceStub} from '../../../testing/FileServiceStub';
import {FileService} from '../../services/file';
import {ActivatedRouteStub} from '../../../testing/ActivatedRouteStub';
import {ActivatedRoute} from '@angular/router';
import {EnvironmentComponent} from '../environment/environment';
import {CandidateServiceStub} from '../../../testing/CandidateServiceStub';
import {CandidateService} from '../../services/candidate';
import {ProtoBufferService} from '../../services/proto_buffer';
import {ProtoBufferServiceStub} from '../../../testing/ProtoBufferServiceStub';

describe('EnvironmentsComponent', () => {
  let component: EnvironmentsComponent;
  let fixture: ComponentFixture<EnvironmentsComponent>;
  let activatedRouteStub: ActivatedRouteStub;
  let fileServiceStub: FileServiceStub;
  let candidateServiceStub: CandidateServiceStub;
  let protoBufferServiceStub: ProtoBufferServiceStub;

  beforeEach(async(() => {
    fileServiceStub = new FileServiceStub();
    activatedRouteStub = new ActivatedRouteStub({
      jsonUri: fileServiceStub.jsonUri,
    });
    candidateServiceStub = new CandidateServiceStub();
    protoBufferServiceStub = new ProtoBufferServiceStub();
    TestBed.configureTestingModule({
      declarations: [EnvironmentsComponent, EnvironmentComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {provide: FileService, useValue: fileServiceStub},
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

  it('timelinePoints should fit timeline and bounds', () => {
    component.timelinePoints.forEach(({timestamp, x}) => {
      expect(timestamp).toBeGreaterThanOrEqual(component.startTimestamp);
      expect(timestamp).toBeLessThanOrEqual(component.endTimestamp);
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(component.envWidth);
    });
  });

  it('candidates should be added to service', () => {
    const candNames = getCandNames();
    expect(candNames.size).toEqual(candidateServiceStub.candColors.size);
    candNames.forEach(candName => {
      expect(candidateServiceStub.candColors.has(candName)).toBeTrue();
    });
  });

  it('candidates should have unique colors', () => {
    const candColors = new Set<number>();
    getCandNames().forEach(candName => {
      const candColor = candidateServiceStub.candColors.get(candName);
      expect(candColor).toBeTruthy();
      expect(candColors.has(candColor)).toBeFalse();
      candColors.add(candColor);
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
