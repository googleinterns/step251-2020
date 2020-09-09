import {TestBed} from '@angular/core/testing';

import {
  CandidateEdge,
  ColoringService,
  CandidateColor,
} from './coloringService';
import {executeProtractorBuilder} from '@angular-devkit/build-angular';

describe('ColoringService', () => {
  let service: ColoringService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColoringService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#constructGraph', () => {
    it('should construct empty graph', () => {
      const edges: Map<string, number> = new Map();
      // @ts-ignore
      service.constructGraph(edges, new Set(['1', '2', '3']));

      expect(service.edgeOccurrences).toEqual(new Map());
      expect(service.candidateGraph).toEqual(new Map());
    });

    it('should construct non-empty graph', () => {
      const edges: Map<string, number> = new Map([
        [new CandidateEdge('1', '2').toKey(), 1],
        [new CandidateEdge('2', '1').toKey(), 1],
        [new CandidateEdge('1', '3').toKey(), 2],
        [new CandidateEdge('3', '1').toKey(), 2],
      ]);
      const graph: Map<string, string[]> = new Map([
        ['1', ['2', '3']],
        ['2', ['1']],
        ['3', ['1']],
      ]);

      // @ts-ignore
      service.constructGraph(edges, new Set(['1', '2', '3']));
      expect(service.edgeOccurrences).toEqual(edges);
      expect(service.candidateGraph).toEqual(graph);
    });
  });

  describe('#pairCandidatesToColor', () => {
    it('no color indexes are equal', () => {
      service.colorOf = new Map([
        ['1', 2],
        ['2', 1],
        ['3', 3],
      ]);
      // @ts-ignore
      const result: CandidateColor[] = service.pairCandidatesToColors([
        4,
        5,
        6,
      ]);
      expect(result).toEqual([
        new CandidateColor('2', 4),
        new CandidateColor('1', 5),
        new CandidateColor('3', 6),
      ]);
    });

    it('color indexes are equal', () => {
      service.colorOf = new Map([
        ['1', 1],
        ['2', 1],
        ['3', 1],
      ]);
      // @ts-ignore
      const result: CandidateColor[] = service.pairCandidatesToColors([
        1,
        2,
        3,
      ]);
      expect(result).toEqual([
        new CandidateColor('1', 1),
        new CandidateColor('2', 2),
        new CandidateColor('3', 3),
      ]);
    });

    describe('#selectColorIndex', () => {
      beforeEach(() => {
        service.noOfCandidates = 3;
        service.candidateGraph.set('1', ['2', '3']);
        service.colorOf = new Map();
      });

      it('no neighbours are colored', () => {
        // @ts-ignore
        service.selectColorIndex('1');
        expect(service.colorOf.get('1')).toEqual(0);
      });

      it('both neighbours are colored, different interval lengths', () => {
        service.colorOf.set('2', 0);
        service.colorOf.set('3', 1);
        // @ts-ignore
        service.selectColorIndex('1');
        expect(service.colorOf.get('1')).toEqual(2);
      });

      it('both neighbours are colored, same interval lengths', () => {
        service.colorOf.set('2', 0);
        service.colorOf.set('3', 1.5);
        // @ts-ignore
        service.selectColorIndex('1');
        expect(service.colorOf.get('1')).toEqual(0.75);
      });
    });
  });
});
