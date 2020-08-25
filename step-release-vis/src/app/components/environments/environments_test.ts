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

describe('EnvironmentsComponent', () => {
  let component: EnvironmentsComponent;
  let fixture: ComponentFixture<EnvironmentsComponent>;
  let activatedRouteStub: ActivatedRouteStub;
  let fileServiceStub: FileServiceStub;
  let candidateServiceStub: CandidateServiceStub;

  beforeEach(async(() => {
    fileServiceStub = new FileServiceStub();
    activatedRouteStub = new ActivatedRouteStub({
      jsonUri: fileServiceStub.jsonUri,
    });
    candidateServiceStub = new CandidateServiceStub();
    TestBed.configureTestingModule({
      declarations: [EnvironmentsComponent, EnvironmentComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {provide: FileService, useValue: fileServiceStub},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
        {provide: CandidateService, useValue: candidateServiceStub},
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
    expect(component.environments).toEqual(
      fileServiceStub.files[fileServiceStub.jsonUri]
    );
  });

  it('should assign envWidth and envHeight fields', () => {
    expect(component.envWidth).toBeTruthy();
    expect(component.envHeight).toBeTruthy();
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
    });
  });

  function getCandNames(): Set<string> {
    const candNames = new Set<string>();
    component.environments.forEach(({snapshots}) => {
      snapshots.forEach(({candsInfo}) => {
        candsInfo.forEach(({candidate}) => {
          candNames.add(candidate);
        });
      });
    });
    return candNames;
  }
});
