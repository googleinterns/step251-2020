import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TooltipComponent} from './tooltip';
import {Tooltip} from '../../models/Tooltip';
import {By} from '@angular/platform-browser';

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
      candidatesList: undefined,
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Compute tooltip location', () => {
    it('#getLeft should get a position with 20px added', () => {
      component.tooltip.mouseX = 200;
      const div = fixture.debugElement.query(By.css('div'));

      component.getLeft();
      fixture.detectChanges();

      expect(component.getLeft()).toBe('220px');
    });

    it('#getTop should get a position with 20px added', () => {
      component.tooltip.mouseY = 500;
      const div = fixture.debugElement.query(By.css('div'));

      component.getTop();
      fixture.detectChanges();

      expect(component.getTop()).toBe('520px');
    });

    it('#getShow should be block when true and none when false', () => {
      component.tooltip.show = true;
      expect(component.getShow()).toBe('block');

      component.tooltip.show = false;
      expect(component.getShow()).toBe('none');
    });
  });
});
