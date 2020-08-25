import {TestBed} from '@angular/core/testing';

import {CandidateService} from './candidate';
import {Polygon} from '../models/Polygon';
import {Point} from '../models/Point';

describe('CandidateService', () => {
  let service: CandidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateService);
    service = new CandidateService();
    service.addCandidate(3, '1');
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#addPolygons', () => {
    it('candidate is already present in map', () => {
      const inputPolygons: Polygon[] = [
        new Polygon([new Point(0, 10), new Point(1, 0)], '1'),
      ];

      service.addPolygons(inputPolygons);

      expect(service.cands.get('1').polygons).toEqual(inputPolygons);
    });

    it('candidate is not already present in map', () => {
      const inputPolygons: Polygon[] = [
        new Polygon([new Point(0, 10), new Point(1, 0)], '2'),
      ];

      service.addPolygons(inputPolygons);

      expect(service.cands.get('1').candName).toBe('1');
      expect(service.cands.get('2').polygons).toEqual(inputPolygons);
    });
  });

  describe('#polygonHovered', () => {
    it('test', () => {
      const polygonToBeHoveredOver: Polygon = new Polygon(
        [new Point(0, 10), new Point(1, 0)],
        '1'
      );
      const polygonsOfCandidate: Polygon[] = [
        polygonToBeHoveredOver,
        new Polygon([new Point(0, 20), new Point(1, 0)], '1'),
      ];
      service.addPolygons(polygonsOfCandidate);

      service.polygonHovered(polygonToBeHoveredOver);

      // all the polygons of candidate named '1' should have the highlight property true
      expect(
        service.cands.get('1').polygons.filter(polygon => polygon.highlight)
          .length
      ).toEqual(2);
    });
  });

  describe('#polygonUnhovered', () => {
    it('test', () => {
      const polygonToBeHoveredOver: Polygon = new Polygon(
        [new Point(0, 10), new Point(1, 0)],
        '1'
      );
      const polygonTobeUnhovered: Polygon = new Polygon(
        [new Point(0, 20), new Point(1, 0)],
        '1'
      );
      const polygonsOfCandidate: Polygon[] = [
        polygonToBeHoveredOver,
        polygonTobeUnhovered,
      ];
      service.addPolygons(polygonsOfCandidate);
      // first make all the polygons highlighted
      service.polygonHovered(polygonToBeHoveredOver);

      // then unhover
      service.polygonUnhovered(polygonTobeUnhovered);

      // all the polygons of candidate named '1' should have the highlight property false
      expect(
        service.cands.get('1').polygons.filter(polygon => polygon.highlight)
          .length
      ).toEqual(0);
    });
  });
});
