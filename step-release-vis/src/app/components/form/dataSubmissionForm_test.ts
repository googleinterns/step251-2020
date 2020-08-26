import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DataSubmissionFormComponent} from './dataSubmissionForm';
import {FormBuilder, FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('DataSumbissionFormComponent', () => {
  let component: DataSubmissionFormComponent;
  let fixture: ComponentFixture<DataSubmissionFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, FormsModule],
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
