import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ParamService} from '../../../services/param.service';
import {BaseGridComponent} from '../base-grid.component';

@Component({
  selector: 'app-canvas-grid',
  templateUrl: './canvas-grid.component.html',
  styleUrls: ['./canvas-grid.component.css']
})
export class CanvasGridComponent extends BaseGridComponent implements OnInit {

  private readonly fps: number;

  constructor(route: ActivatedRoute, paramService: ParamService) {
    super(route, paramService);
    this.fps = paramService.paramInt(route, 'fps', 60);
  }

  ngOnInit(): void {
    this.initGrid();
  }

  initGridElement(): HTMLCanvasElement {
    return document.createElement('canvas');
  }

  drawGrid(gridElement: Element, cellWidth: number, cellHeight: number): void {
    const rects = [];
    for (let i = 0; i < this.gridHeight; i++) {
      rects.push([]);
      for (let j = 0; j < this.gridWidth; j++) {
        const rect = {
          x: j * cellWidth,
          y: i * cellHeight,
          w: cellWidth,
          h: cellHeight,
          color: (i + j) % 2 === 0 ? 'lightgray' : 'white',
        };
        rects[i].push(rect);
      }
    }

    let hoveredRect;
    gridElement.addEventListener('mousemove', (e: MouseEvent) => {
        const bounds = gridElement.getBoundingClientRect();
        const mouseX = e.clientX - bounds.left;
        const mouseY = e.clientY - bounds.top;

        const x = Math.floor(
          this.map(mouseY, 0, bounds.bottom - bounds.top, 0, this.gridHeight),
        );
        const y = Math.floor(
          this.map(mouseX, 0, bounds.right - bounds.left, 0, this.gridWidth),
        );
        if (rects[x]) {
          hoveredRect = rects[x][y];
        }
      }
    );

    gridElement.addEventListener('mouseout', () => {
      hoveredRect = undefined;
    });

    setInterval(() => {
      this.repaint(gridElement, rects, hoveredRect);
    }, 1000 / this.fps);
  }

  private repaint(canvas, rects, hoverRect): void {
    const ctx = canvas.getContext('2d');
    for (let i = 0; i < this.gridHeight; i++) {
      for (let j = 0; j < this.gridWidth; j++) {
        const rect = rects[i][j];
        ctx.fillStyle = rect.color;
        ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
      }
    }
    if (hoverRect) {
      ctx.fillStyle = 'red';
      ctx.fillRect(hoverRect.x, hoverRect.y, hoverRect.w, hoverRect.h);
    }
  }

  private map(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  }

}