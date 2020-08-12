import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ParamService} from '../../../services/param.service';
import {BaseGridComponent} from '../base-grid.component';

@Component({
  selector: 'app-svg-grid',
  templateUrl: './svg-grid.component.html',
  styleUrls: ['./svg-grid.component.css']
})
export class SvgGridComponent extends BaseGridComponent implements OnInit {

  private readonly rectRadius: number;

  private svgns = 'http://www.w3.org/2000/svg';

  constructor(route: ActivatedRoute, paramService: ParamService) {
    super(route, paramService);
    this.rectRadius = paramService.paramInt(route, 'r', 0);
  }

  ngOnInit(): void {
    this.initGrid();
  }

  drawGrid(gridElement: Element, cellWidth: number, cellHeight: number): void {
      for (let i = 0; i < this.gridHeight; i++) {
      for (let j = 0; j < this.gridWidth; j++) {
        const rect = document.createElementNS(this.svgns, 'rect');
        rect.setAttribute('x', String(j * cellWidth));
        rect.setAttribute('y', String(i * cellHeight));
        rect.setAttribute('width', String(cellWidth));
        rect.setAttribute('height', String(cellHeight));
        rect.setAttribute('rx', String(this.rectRadius));
        rect.setAttribute('color', (i + j) % 2 === 0 ? 'lightgray' : 'white');
        rect.setAttribute('fill', rect.getAttribute('color'));
        rect.addEventListener('mouseover', () => {
          rect.setAttribute('fill', 'red');
        });
        rect.addEventListener('mouseout',  () => {
          rect.setAttribute('fill', rect.getAttribute('color'));
        });
        gridElement.appendChild(rect);
      }
    }
  }

  initGridElement(): Element {
    return document.createElementNS(this.svgns, 'svg');
  }

}

