import {ActivatedRoute} from '@angular/router';
import {ParamService} from '../../services/param';

export abstract class BaseGridComponent {

  protected xMargin = 10;
  protected yMargin = 10;
  protected aspectRatio: number;

  protected grids: number;
  protected gridWidth: number;
  protected gridHeight: number;

  protected xGrids: number;
  protected yGrids: number;

  protected constructor(protected route: ActivatedRoute, protected paramService: ParamService) {
  }

  protected initGrid(containerId: string): void {
    this.aspectRatio = window.innerWidth / window.innerHeight;
    this.paramService.paramInt(this.route, 'c', 54)
      .subscribe(grids => {
        this.grids = grids;
        this.paramService.paramInt(this.route, 'w', 10)
          .subscribe(gridWidth => {
            this.gridWidth = gridWidth;
            this.paramService.paramInt(this.route, 'h', 10)
              .subscribe(gridHeight => {
                this.gridHeight = gridHeight;
                this.xGrids = Math.floor(Math.sqrt(this.grids * this.aspectRatio));
                this.yGrids = Math.ceil(this.grids / this.xGrids);
                this.calculateGrid(containerId);
              });
          });
      });
  }

  private calculateGrid(containerId: string): void {
    for (let yGrid = 0; yGrid < this.yGrids; yGrid++) {
      for (
        let xGrid = 0;
        xGrid < this.xGrids && yGrid * this.xGrids + xGrid < this.grids;
        xGrid++
      ) {
        const gridElement = this.initGridElement();
        document.getElementById(containerId).appendChild(gridElement);
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
