import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TooltipComponent} from './tooltip';
import {Tooltip} from '../../models/Tooltip';
import {By} from '@angular/platform-browser';
import {Candidate} from '../../models/Candidate';

describe('TooltipComponent', () => {
  let component: TooltipComponent;
  let fixture: ComponentFixture<TooltipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TooltipComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TooltipComponent);
    component = fixture.componentInstance;
    component.tooltip = new Tooltip();
    component.tooltip.envName = '1';
    component.currentSnapshot = {
      timestamp: {seconds: undefined, nanos: undefined},
      candidatesList: [],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Compute tooltip location', () => {
    it('#getLeft should get a position with 20px added', () => {
      component.tooltip.mouseX = 100;
      const div = fixture.debugElement.query(By.css('div'));

      component.getLeft();
      fixture.detectChanges();

      expect(component.getLeft()).toBe('120px');
    });

    it('#getTop should get the same position', () => {
      component.tooltip.mouseY = 100;
      const div = fixture.debugElement.query(By.css('div'));

      component.getTop();

      fixture.detectChanges();
      expect(component.getTop()).toBe('100px');
    });
  });
});
