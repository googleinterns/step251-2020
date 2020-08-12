const xMargin = 10;
const yMargin = 10;
const aspectRatio = window.innerWidth / window.innerHeight;

const grids = param('c', 54);
const gridWidth = param('w', 10);
const gridHeight = param('h', 10);
const xGrids = Math.floor(Math.sqrt(grids * aspectRatio));
const yGrids = Math.ceil(grids / xGrids);
const fps = param('fps', 60);

for (let yGrid = 0; yGrid < yGrids; yGrid++) {
  for (
    let xGrid = 0;
    xGrid < xGrids && yGrid * xGrids + xGrid < grids;
    xGrid++
  ) {
    const canvas = document.createElement('canvas');
    document.getElementById('container').appendChild(canvas);
    canvas.width = (window.innerWidth - xMargin * xGrids) / xGrids;
    canvas.height = (window.innerHeight - yMargin * yGrids) / yGrids;
    canvas.style = 'border:1px solid #000000;';

    const cellWidth = canvas.width / gridWidth;
    const cellHeight = canvas.height / gridHeight;

    const rects = [];
    for (let i = 0; i < gridHeight; i++) {
      rects.push([]);
      for (let j = 0; j < gridWidth; j++) {
        const color = (i + j) % 2 === 0 ? 'lightgray' : 'white';
        const rect = {
          x: j * cellWidth,
          y: i * cellHeight,
          w: cellWidth,
          h: cellHeight,
          color: color,
        };
        rects[i].push(rect);
      }
    }

    canvas.onmousemove = function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const pipe = Math.floor(map(y, 0, rect.bottom - rect.top, 0, gridHeight));
      const cand = Math.floor(map(x, 0, rect.right - rect.left, 0, gridWidth));
      if (rects[pipe]) {
        hoverRect = rects[pipe][cand];
      }
    };

    let hoverRect;
    canvas.onmouseout = function () {
      hoverRect = undefined;
    };

    setInterval(function () {
      repaint(canvas, rects, hoverRect);
    }, 1000 / fps);
  }
  if (yGrid < yGrids - 1) {
    br();
  }
}

function repaint(canvas, rects, hoverRect) {
  const ctx = canvas.getContext('2d');
  for (let i = 0; i < gridHeight; i++) {
    for (let j = 0; j < gridWidth; j++) {
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

function map(num, in_min, in_max, out_min, out_max) {
  return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function param(name, defaultValue) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(name);
  return value ? value : defaultValue;
}

function br() {
  document
    .getElementById('container')
    .appendChild(document.createElement('br'));
}
