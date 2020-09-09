import {TestBed} from '@angular/core/testing';

import {CandidateEdge, ColoringService} from './coloringService';
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
      service.constructGraph(edges);

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
      service.constructGraph(edges);
      expect(service.edgeOccurrences).toEqual(edges);
      expect(service.candidateGraph).toEqual(graph);
    });
  });
});
