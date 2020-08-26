import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DataSubmissionFormComponent} from './dataSubmissionForm';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';

describe('DataSubmissionFormComponent', () => {
  let component: DataSubmissionFormComponent;
  let fixture: ComponentFixture<DataSubmissionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule, RouterTestingModule],
      declarations: [DataSubmissionFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubmissionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('form invalid when empty', () => {
    expect(component.dataForm.valid).toBeFalsy();
  });
});
