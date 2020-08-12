import {ActivatedRoute} from '@angular/router';
import {ParamService} from '../../services/param.service';

export abstract class BaseGridComponent {

  protected xMargin = 10;
  protected yMargin = 10;
  protected readonly aspectRatio: number;

  protected readonly grids: number;
  protected readonly gridWidth: number;
  protected readonly gridHeight: number;

  protected readonly xGrids: number;
  protected readonly yGrids: number;

  protected constructor(route: ActivatedRoute, paramService: ParamService) {
    this.aspectRatio = window.innerWidth / window.innerHeight;
    this.grids = paramService.paramInt(route, 'c', 54);
    this.gridWidth = paramService.paramInt(route, 'w', 10);
    this.gridHeight = paramService.paramInt(route, 'h', 10);
    this.xGrids = Math.floor(Math.sqrt(this.grids * this.aspectRatio));
    this.yGrids = Math.ceil(this.grids / this.xGrids);
  }

  protected initGrid(): void {
    for (let yGrid = 0; yGrid < this.yGrids; yGrid++) {
      for (
        let xGrid = 0;
        xGrid < this.xGrids && yGrid * this.xGrids + xGrid < this.grids;
        xGrid++
      ) {
        const gridElement = this.initGridElement();
        document.getElementById('container').appendChild(gridElement);
        gridElement.setAttribute('width', String((window.innerWidth - this.xMargin * this.xGrids) / this.xGrids));
        gridElement.setAttribute(
          'height',
          String((window.innerHeight - this.yMargin * this.yGrids) / this.yGrids),
        );
        gridElement.setAttribute('style', 'border:1px solid #000000;');

        const cellWidth = parseInt(gridElement.getAttribute('width'), 10) / this.gridWidth;
        const cellHeight = parseInt(gridElement.getAttribute('height'), 10) / this.gridHeight;

        this.drawGrid(gridElement, cellWidth, cellHeight);
      }
    }
  }

  abstract initGridElement(): Element;

  abstract drawGrid(gridElement: Element, cellWidth: number, cellHeight: number): void;

}
