import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnvironmentComponent } from './environment';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EnvironmentComponent', () => {
  let component: EnvironmentComponent;
  let fixture: ComponentFixture<EnvironmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EnvironmentComponent],
      imports: [RouterTestingModule, HttpClientTestingModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
