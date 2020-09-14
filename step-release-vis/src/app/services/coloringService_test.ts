import {TestBed} from '@angular/core/testing';

import {
  CandidateEdge,
  ColoringService,
  CandidateColor,
} from './coloringService';
import {CandidateService} from './candidateService';
import {CandidateServiceStub} from '../../testing/CandidateServiceStub';

describe('ColoringService', () => {
  let service: ColoringService;

  beforeEach(() => {
    const candidateServiceStub = new CandidateServiceStub(
      new CandidateService()
    );
    TestBed.configureTestingModule({
      providers: [{provide: CandidateService, useValue: candidateServiceStub}],
    });
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
    it('no color indices are equal', () => {
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

    it('color indices are equal', () => {
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

  describe('#pairCandidatesToProportionalColors', () => {
    beforeEach(() => {
      service.noOfCandidates = 3;
      service.candidateGraph.set('1', ['2', '3']);
      service.colorOf = new Map();
    });

    it('three candidates', () => {
      service.colorOf = new Map([
        ['1', 0.75],
        ['2', 0.75],
        ['3', 1.5],
      ]);
      // @ts-ignore
      const result: CandidateColor[] = service.pairCandidatesToProportionalColors();
      expect(result).toEqual([
        new CandidateColor('1', 90),
        new CandidateColor('2', 90),
        new CandidateColor('3', 180),
      ]);
    });
  });

  describe('#assignColorIndices', () => {
    beforeEach(() => {
      service.noOfCandidates = 3;
      service.candNames = new Set(['1', '2', '3']);
    });
    it('triangle, different priorities', () => {
      service.edgeOccurrences = new Map([
        [new CandidateEdge('1', '2').toKey(), 1],
        [new CandidateEdge('2', '3').toKey(), 1],
        [new CandidateEdge('1', '3').toKey(), 2],
      ]);
      service.candidateGraph = new Map([
        ['1', ['2', '3']],
        ['2', ['1', '3']],
        ['3', ['1', '2']],
      ]);

      service.assignColorIndices();

      expect(service.colorOf.get('1')).toEqual(0);
      expect(service.colorOf.get('2')).toEqual(0.75);
      expect(service.colorOf.get('3')).toEqual(1.5);
    });

    it('chain, same priorities', () => {
      service.edgeOccurrences = new Map([
        [new CandidateEdge('1', '2').toKey(), 1],
        [new CandidateEdge('2', '3').toKey(), 1],
      ]);
      service.candidateGraph = new Map([
        ['1', ['2', '3']],
        ['2', ['1']],
        ['3', ['1']],
      ]);

      service.assignColorIndices();

      expect(service.colorOf.get('1')).toEqual(0);
      expect(service.colorOf.get('2')).toEqual(1.5);
      expect(service.colorOf.get('3')).toEqual(1.5);
    });

    it('independent candidates', () => {
      service.edgeOccurrences = new Map();
      service.candidateGraph = new Map();

      service.assignColorIndices();

      expect(service.colorOf.get('1')).toEqual(0);
      expect(service.colorOf.get('2')).toEqual(0);
      expect(service.colorOf.get('3')).toEqual(0);
    });
  });

  describe('#addReleaseEdges', () => {
    it('should add edges', () => {
      service.addReleaseEdges(); // edges from the candidateServiceStub

      expect(service.candidateGraph.get('1')).toEqual(['2']);
      expect(service.candidateGraph.get('2')).toEqual(['1']);
      expect(service.edgeOccurrences).toEqual(
        new Map([
          [new CandidateEdge('1', '2').toKey(), service.releaseEdgeCost],
          [new CandidateEdge('2', '1').toKey(), service.releaseEdgeCost],
        ])
      );
    });
  });
});
