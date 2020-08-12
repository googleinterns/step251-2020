const xMargin = 10;
const yMargin = 10;
const aspectRatio = window.innerWidth / window.innerHeight;

const grids = param('c', 54);
const gridWidth = param('w', 10);
const gridHeight = param('h', 10);
const rectRadius = param('r', 0);

const xGrids = Math.floor(Math.sqrt(grids * aspectRatio));
const yGrids = Math.ceil(grids / xGrids);

const svgns = 'http://www.w3.org/2000/svg';

for (let yGrid = 0; yGrid < yGrids; yGrid++) {
  for (
    let xGrid = 0;
    xGrid < xGrids && yGrid * xGrids + xGrid < grids;
    xGrid++
  ) {
    const svg = document.createElementNS(svgns, 'svg');
    document.getElementById('container').appendChild(svg);
    svg.setAttribute('width', (window.innerWidth - xMargin * xGrids) / xGrids);
    svg.setAttribute(
      'height',
      (window.innerHeight - yMargin * yGrids) / yGrids,
    );
    svg.setAttribute('style', 'border:1px solid #000000;');

    const cellWidth = svg.getAttribute('width') / gridWidth;
    const cellHeight = svg.getAttribute('height') / gridHeight;

    for (let i = 0; i < gridHeight; i++) {
      for (let j = 0; j < gridWidth; j++) {
        const rect = document.createElementNS(svgns, 'rect');
        rect.setAttribute('x', j * cellWidth);
        rect.setAttribute('y', i * cellHeight);
        rect.setAttribute('width', cellWidth);
        rect.setAttribute('height', cellHeight);
        rect.setAttribute('rx', rectRadius);
        rect.color = (i + j) % 2 === 0 ? 'lightgray' : 'white';
        rect.setAttribute('fill', rect.color);
        rect.onmouseover = function () {
          rect.setAttribute('fill', 'red');
        };
        rect.onmouseout = function () {
          rect.setAttribute('fill', rect.color);
        };
        svg.appendChild(rect);
      }
    }
  }
}

function param(name, defaultValue) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const value = urlParams.get(name);
  return value ? value : defaultValue;
}
