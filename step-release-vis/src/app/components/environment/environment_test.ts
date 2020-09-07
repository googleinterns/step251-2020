import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {EnvironmentComponent} from './environment';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {EnvironmentService} from '../../services/environmentService';
import {EnvironmentServiceStub} from '../../../testing/EnvironmentServiceStub';
import {By} from '@angular/platform-browser';
import {CandidateServiceStub} from '../../../testing/CandidateServiceStub';
import {CandidateService} from '../../services/candidateService';
import {DebugElement, SimpleChange} from '@angular/core';
import {TooltipComponent} from '../tooltip/tooltip';
import {shouldBeautify} from '@angular-devkit/build-angular/src/utils/environment-options';

describe('EnvironmentComponent', () => {
  let component: EnvironmentComponent;
  let fixture: ComponentFixture<EnvironmentComponent>;
  let environmentServiceStub: EnvironmentServiceStub;
  let candidateServiceStub: CandidateServiceStub;
  beforeEach(async(() => {
    environmentServiceStub = new EnvironmentServiceStub();
    candidateServiceStub = new CandidateServiceStub(new CandidateService());
    TestBed.configureTestingModule({
      declarations: [EnvironmentComponent, TooltipComponent],
      providers: [
        {provide: EnvironmentService, useValue: environmentServiceStub},
        {provide: CandidateService, useValue: candidateServiceStub},
      ],
      imports: [RouterTestingModule, HttpClientTestingModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnvironmentComponent);
    component = fixture.componentInstance;
    component.svgWidth = 100;
    component.svgBigHeight = 100;
    component.svgSmallHeight = 30;
    component.environment = environmentServiceStub.env;
    component.startTimestamp = environmentServiceStub.envMin;
    component.endTimestamp = environmentServiceStub.envMax;
    component.curGlobalTimestamp = {seconds: undefined};
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('polygons', () => {
    it('should be assigned', () => {
      expect(component.polygons).toBeTruthy();
    });

    it('should fit the screen', () => {
      component.ngOnInit();
      fixture.detectChanges();
      component.polygons.forEach(({points}) =>
        points.forEach(({x, y}) => {
          expect(x).toBeGreaterThanOrEqual(0);
          expect(x).toBeLessThanOrEqual(component.svgWidth);
          expect(y).toBeGreaterThanOrEqual(0);
          expect(y).toBeLessThanOrEqual(component.svgHeight);
        })
      );
    });

    it('should respond to hover events', () => {
      const polygons = fixture.debugElement.queryAll(By.css('.cand-polygon'));
      for (let i = 0; i < polygons.length; i++) {
        polygons[i].triggerEventHandler('mouseenter', {});
        fixture.detectChanges();
        expect(component.polygons[i].highlight).toBeTrue();

        polygons[i].triggerEventHandler('mouseleave', {});
        fixture.detectChanges();
        expect(component.polygons[i].highlight).toBeFalse();
      }
    });
  });

  describe('displayedSnapshots field', () => {
    it('should be assigned', () => {
      expect(component.displayedSnapshots).toBeTruthy();
    });

    it('should be limited in size', () => {
      expect(component.displayedSnapshots.length).toBeLessThanOrEqual(
        component.SNAPSHOTS_PER_ENV
      );
    });

    it('should have timestamps in increasing order', () => {
      const snapshots = component.displayedSnapshots;
      for (let i = 1; i < snapshots.length; i++) {
        expect(snapshots[i].timestamp.seconds).toBeGreaterThan(
          snapshots[i - 1].timestamp.seconds
        );
      }
    });

    it('should have timestamps fitting the range', () => {
      component.displayedSnapshots.forEach(({timestamp}) => {
        expect(timestamp.seconds).toBeGreaterThanOrEqual(
          component.startTimestamp
        );
        expect(timestamp.seconds).toBeLessThanOrEqual(component.endTimestamp);
      });
    });
  });

  describe('time range update', () => {
    let oldStart;
    let oldEnd;
    beforeEach(() => {
      oldStart = component.startTimestamp;
      oldEnd = component.endTimestamp;
      component.ngOnChanges({
        startTimestamp: new SimpleChange(oldStart, oldStart + 1000, false),
        endTimestamp: new SimpleChange(oldEnd, oldEnd - 1000, false),
      });
    });

    it('should update fields', () => {
      expect(component.startTimestamp).toEqual(oldStart + 1000);
      expect(component.endTimestamp).toEqual(oldEnd - 1000);
    });

    it('should update displayed snapshots', () => {
      component.displayedSnapshots.forEach(({timestamp}) => {
        expect(timestamp.seconds).toBeGreaterThanOrEqual(
          component.startTimestamp
        );
        expect(timestamp.seconds).toBeLessThanOrEqual(component.endTimestamp);
      });
    });
  });

  it('colors should be assigned', () => {
    component.polygons.forEach(({colorHue}) => {
      expect(colorHue).toBeLessThan(360);
      expect(colorHue).toBeGreaterThanOrEqual(0);
    });
  });

  it('candName should be assigned', () => {
    component.polygons.forEach(({candName}) => {
      expect(candName).toEqual(environmentServiceStub.candName);
    });
  });

  describe('updateCurrentSnapshot', () => {
    beforeEach(() => {
      component.displayedSnapshots = [
        {timestamp: {seconds: 1, nanos: 0}, candidatesList: []},
        {timestamp: {seconds: 11, nanos: 0}, candidatesList: []},
      ];
      component.svgWidth = 200;
      component.startTimestamp = 0;
      component.endTimestamp = 100;
    });

    it('should round to the left', () => {
      component.updateCurrentSnapshot(11);
      expect(component.currentSnapshot.timestamp.seconds).toEqual(1);
    });

    it('should round to the right', () => {
      component.updateCurrentSnapshot(13);
      expect(component.currentSnapshot.timestamp.seconds).toEqual(11);
    });

    it('should be exactly the last snapshot', () => {
      component.updateCurrentSnapshot(22);
      expect(component.currentSnapshot.timestamp.seconds).toEqual(11);
    });

    it('should be undefined when mouse is outside polygon zone', () => {
      component.updateCurrentSnapshot(23);
      expect(component.currentSnapshot).toEqual(undefined);
    });
  });

  it('tooltip should be shown when flag is true', () => {
    component.tooltip.show = true;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-tooltip'))).toBeTruthy();

    component.tooltip.show = false;
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-tooltip'))).toBeFalsy();
  });

  describe('current snapshot vertical line', () => {
    it(`should show if currentSnapshot is present`, () => {
      expect(getLine()).toBeFalsy();

      component.currentSnapshot = {
        timestamp: {seconds: component.startTimestamp, nanos: 0},
        candidatesList: [],
      };
      component.curGlobalTimestamp.seconds = component.startTimestamp;
      fixture.detectChanges();
      expect(getLine()).toBeTruthy();
    });

    it('should respond to currentSnapshot changes', () => {
      component.currentSnapshot = {
        timestamp: {seconds: component.startTimestamp, nanos: 0},
        candidatesList: [],
      };
      component.curGlobalTimestamp.seconds = component.startTimestamp;
      fixture.detectChanges();
      expect(getLine().nativeElement.getAttribute('x')).toEqual('-1');

      component.currentSnapshot = {
        timestamp: {seconds: component.endTimestamp, nanos: 0},
        candidatesList: [],
      };
      fixture.detectChanges();
      expect(getLine().nativeElement.getAttribute('x')).toEqual(
        `${component.svgWidth - 1}`
      );
    });

    it(`should show if curGlobalTimestamp is in visible time range, shouldn't otherwise`, () => {
      expect(getLine()).toBeFalsy();

      component.currentSnapshot = {
        timestamp: {seconds: component.startTimestamp, nanos: 0},
        candidatesList: [],
      };
      component.curGlobalTimestamp.seconds = component.startTimestamp;
      fixture.detectChanges();
      expect(getLine()).toBeTruthy();

      component.curGlobalTimestamp.seconds = component.startTimestamp - 1000;
      fixture.detectChanges();
      expect(getLine()).toBeFalsy();
    });

    function getLine(): DebugElement {
      return fixture.debugElement.query(By.css('#cur-snapshot-line'));
    }
  });

  describe('expansion', () => {
    it('should be triggered on env title click', () => {
      expect(component.expanded).toBeFalse();
      expect(component.svgWidth).toEqual(component.svgWidth);
      expect(component.svgHeight).toEqual(component.svgSmallHeight);

      fixture.debugElement
        .query(By.css('.title'))
        .triggerEventHandler('click', {});
      expect(component.expanded).toBeTrue();
      expect(component.svgWidth).toEqual(component.svgWidth);
      expect(component.svgHeight).toEqual(component.svgBigHeight);

      fixture.debugElement
        .query(By.css('.title'))
        .triggerEventHandler('click', {});
      expect(component.expanded).toBeFalse();
      expect(component.svgWidth).toEqual(component.svgWidth);
      expect(component.svgHeight).toEqual(component.svgSmallHeight);
    });

    it('should hide/unhide the timeline', () => {
      expect(fixture.debugElement.query(By.css('#timeline'))).toBeFalsy();
      fixture.debugElement
        .query(By.css('.title'))
        .triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#timeline'))).toBeTruthy();

      fixture.debugElement
        .query(By.css('.title'))
        .triggerEventHandler('click', {});
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('#timeline'))).toBeFalsy();
    });
  });

  describe('movement of the tooltip', () => {
    beforeEach(() => {
      // component.environment.name = '1';
    });

    it('#enteredEnvironment', () => {
      const svg = fixture.debugElement.query(
        By.css(`#${component.environment.name}-svg`)
      );
      svg.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();

      expect(component.tooltip.envName).toBe(component.environment.name);
    });

    it('#moveTooltip with both cases of clickOn', () => {
      const svg = fixture.debugElement.query(
        By.css(`#${component.environment.name}-svg`)
      );
      svg.triggerEventHandler('mousemove', {pageX: 100, pageY: 100});
      fixture.detectChanges();

      expect(component.tooltip.mouseX).toEqual(100);
      expect(component.tooltip.mouseY).toEqual(100);

      svg.triggerEventHandler('click', {});
      fixture.detectChanges();
      svg.triggerEventHandler('mousemove', {pageX: 110});
      fixture.detectChanges();

      // the position should be the same as clickOn is true
      expect(component.tooltip.mouseX).toEqual(100);
      expect(component.tooltip.mouseY).toEqual(100);
    });

    it('#leftEnvironment with both cases of clickOn', () => {
      const svg = fixture.debugElement.query(
        By.css(`#${component.environment.name}-svg`)
      );
      svg.triggerEventHandler('mouseleave', {});
      fixture.detectChanges();

      expect(component.tooltip.show).toBeFalse();

      svg.triggerEventHandler('mouseenter', {});
      fixture.detectChanges();
      svg.triggerEventHandler('click', {});
      fixture.detectChanges();
      svg.triggerEventHandler('mouseleave', {});
      fixture.detectChanges();

      expect(component.tooltip.show).toBeTrue();
    });
  });

  it('update ClickOn on click event', () => {
    const svg = fixture.debugElement.query(
      By.css(`#${component.environment.name}-svg`)
    );
    svg.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(component.tooltip.clickOn).toBeTrue();

    svg.triggerEventHandler('click', {});
    fixture.detectChanges();

    expect(component.tooltip.clickOn).toBeFalse();
  });

  it('#hidetooltip', () => {
    component.hideTooltip();
    fixture.detectChanges();

    expect(fixture.debugElement.query(By.css('app-tooltip'))).toBeFalsy();
  });
});
