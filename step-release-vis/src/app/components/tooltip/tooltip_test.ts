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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Compute tooltip location', () => {
    it('#getLeft should get a position with 20px added', () => {
      component.tooltip = new Tooltip();
      component.tooltip.mouseX = 200;
      component.tooltip.envName = '1';
      const div = fixture.debugElement.query(By.css('div'));

      component.getLeft();
      fixture.detectChanges();

      expect(div.nativeElement.style.left).toBe('220px');
    });

    it('#getTop should get a position with 20px added', () => {
      component.tooltip = new Tooltip();
      component.tooltip.mouseY = 500;
      component.tooltip.envName = '1';
      const div = fixture.debugElement.query(By.css('div'));

      component.getTop();
      fixture.detectChanges();

      expect(div.nativeElement.style.top).toBe('520px');
    });

    it('#getShow should be block when true and none when false', () => {
      component.tooltip = new Tooltip();
      const div = fixture.debugElement.query(By.css('div'));

      component.tooltip.show = true;
      component.getShow();
      fixture.detectChanges();

      expect(div.nativeElement.style.display).toBe('block');

      component.tooltip.show = false;
      component.getShow();
      fixture.detectChanges();

      expect(div.nativeElement.style.display).toBe('none');
    });
  });

  describe('getSnapshot', () => {
    it('should round to the left', () => {
      component.tooltip.displayedSnapshots = [
        {timestamp: {seconds: 1, nanos: 0}, candidatesList: []},
        {timestamp: {seconds: 11, nanos: 0}, candidatesList: []},
      ];

      component.tooltip.svgMouseX = 43;
      component.tooltip.envWidth = 100;

      component.getSnapshot();
      expect(component.currentSnapshot.timestamp.seconds).toEqual(1);
    });

    it('should round to the right', () => {
      component.tooltip.displayedSnapshots = [
        {timestamp: {seconds: 1, nanos: 0}, candidatesList: []},
        {timestamp: {seconds: 11, nanos: 0}, candidatesList: []},
      ];

      component.tooltip.svgMouseX = 53;
      component.tooltip.envWidth = 100;

      component.getSnapshot();
      expect(component.currentSnapshot.timestamp.seconds).toEqual(11);
    });

    it('should be exactly the last snapshot', () => {
      component.tooltip.displayedSnapshots = [
        {timestamp: {seconds: 1, nanos: 0}, candidatesList: []},
        {timestamp: {seconds: 11, nanos: 0}, candidatesList: []},
      ];

      component.tooltip.svgMouseX = 100;
      component.tooltip.envWidth = 100;

      component.getSnapshot();
      expect(component.currentSnapshot.timestamp.seconds).toEqual(11);
    });
  });
});
