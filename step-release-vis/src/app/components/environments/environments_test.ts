import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnvironmentsComponent} from './environments';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FileServiceStub} from '../../../testing/FileServiceStub';
import {FileService} from '../../services/file';
import {ActivatedRouteStub} from '../../../testing/ActivatedRouteStub';
import {ActivatedRoute} from '@angular/router';
import {EnvironmentComponent} from '../environment/environment';

describe('EnvironmentsComponent', () => {
  let component: EnvironmentsComponent;
  let fixture: ComponentFixture<EnvironmentsComponent>;
  let activatedRouteStub: ActivatedRouteStub;
  let fileServiceStub: FileServiceStub;

  beforeEach(async(() => {
    fileServiceStub = new FileServiceStub();
    activatedRouteStub = new ActivatedRouteStub({
      jsonUri: fileServiceStub.jsonUri,
    });
    TestBed.configureTestingModule({
      declarations: [EnvironmentsComponent, EnvironmentComponent],
      imports: [HttpClientTestingModule],
      providers: [
        {provide: FileService, useValue: fileServiceStub},
        {provide: ActivatedRoute, useValue: activatedRouteStub},
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
    fixture.detectChanges();
    expect(component.environments).toEqual(
      fileServiceStub.files[fileServiceStub.jsonUri]
    );
  });
});
