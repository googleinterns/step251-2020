import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SvgGridComponent } from './svg';
import {RouterTestingModule} from '@angular/router/testing';

describe('SvgGridComponent', () => {
  let component: SvgGridComponent;
  let fixture: ComponentFixture<SvgGridComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SvgGridComponent ],
      imports: [ RouterTestingModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SvgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
