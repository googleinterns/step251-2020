import {TestBed} from '@angular/core/testing';

import {CandidateService} from './candidate';
import {Candidate} from '../models/Candidate';
import {Polygon} from '../models/Polygon';
import {Point} from '../models/Point';

describe('CandidateService', () => {
  let service: CandidateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CandidateService);
  });

  // TODO(#171): Add tests for polygonHovered/Unhovered.

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#addCandidate', () => {
    it('test if the color changes when the candidate already exists', () => {
      service = new CandidateService();
      service.addCandidate(3, '1');
      // readd same candidate
      service.addCandidate(6, '1');
      expect(service.cands.get('1').color).toEqual(6);
    });
  });

  describe('#addPolygons', () => {
    it('candidate is already present in map', () => {
      service = new CandidateService();
      service.addCandidate(3, '1');
      const inputPolygons: Polygon[] = [
        new Polygon([new Point(0, 10), new Point(1, 0)], '1', 3),
      ];
      service.addPolygons(inputPolygons);
      expect(service.cands.get('1').polygons).toEqual(inputPolygons);
    });

    it('candidate is not already present in map', () => {
      service = new CandidateService();
      service.addCandidate(5, '1');
      const inputPolygons: Polygon[] = [
        new Polygon([new Point(0, 10), new Point(1, 0)], '2', 3),
      ];
      service.addPolygons(inputPolygons);
      expect(service.cands.get('1').candName).toBe('1');
      expect(service.cands.get('2').polygons).toEqual(inputPolygons);
    });
  });
});
