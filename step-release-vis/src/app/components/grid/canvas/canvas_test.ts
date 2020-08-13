import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CanvasGridComponent } from './canvas';
import {RouterTestingModule} from '@angular/router/testing';

describe('CanvasGridComponent', () => {
  let component: CanvasGridComponent;
  let fixture: ComponentFixture<CanvasGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CanvasGridComponent ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CanvasGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
