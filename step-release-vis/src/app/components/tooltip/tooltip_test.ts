import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {Tooltip} from './tooltip';

describe('TooltipComponent', () => {
  let component: Tooltip;
  let fixture: ComponentFixture<Tooltip>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [Tooltip],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Tooltip);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
