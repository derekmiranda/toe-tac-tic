import "./style.css";
import {
  debounce,
  drawDashedLine,
  getCellNeighbors,
  howCenteredIsPoint,
} from "./utils";

const root = document.getElementById("root");
const svgEls = [];
const pathEls = [];
const cellStates = [];
const clickOrder = [];
const tweens = [];
const CELL_NUM = 9;
const CELL_LEN = 128;
const SVG_STYLE =
  "fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2; stroke-width: 1px";
const PATH_D =
  "M36.103,64L11.398,39.294L39.294,11.398L64,36.103L88.706,11.398L116.602,39.294L91.897,64L116.602,88.706L88.706,116.602L64,91.897L39.294,116.602L11.398,88.706L36.103,64Z";
const X_PATH_STYLE = "fill: url(#grad); stroke: none";
const INITIAL_OPACITY = 0.2;

let svgGrid, canvas, ctx;

(function main() {
  svgGrid = document.createElement("div");
  svgGrid.classList.add("ttt-grid");
  root.appendChild(svgGrid);

  setUpCanvas();

  for (let i = 0; i < CELL_NUM; i++) {
    const shapeIndex = Math.random() * 10;
    cellStates.push(createCellState({ index: i, shapeIndex }));
    const [svg, path] = createXSvg(svgGrid, `x${i}`);
    svgEls.push(svg);
    pathEls.push(path);
    tweens.push(createMorphTween(i, shapeIndex));
  }

  root.addEventListener("mousemove", handleMouseMove);
  root.addEventListener("mousedown", handleMouseDown, true);
})();

function getCellProgress(rect, x) {
  return (x - rect.left) / rect.width;
}

function handleMouseMove(e) {
  for (let i = 0; i < tweens.length; i++) {
    const { lockedIn } = cellStates[i];
    if (lockedIn) {
      continue;
    }

    const svgEl = svgEls[i];
    const tween = tweens[i];
    const pathEl = pathEls[i];
    const rect = svgEl.getBoundingClientRect();
    const progress = getCellProgress(rect, e.clientX);

    tween.progress(progress);
    const centeredPercent = howCenteredIsPoint(rect, e.clientX, e.clientY);
    pathEl.style.stroke = `rgba(0,0,0,${centeredPercent})`;
    pathEl.style.opacity = centeredPercent;
  }
}

function handleMouseDown(e) {
  if (!e.target?.dataset.cellId) {
    return;
  }

  const { cellId } = e.target.dataset;
  const index = parseInt(cellId[1]);
  const cellState = cellStates[index];

  if (cellState.lockedIn) {
    return;
  }

  const rect = svgEls[index].getBoundingClientRect();

  cellState.lockedIn = true;
  cellState.progress = getCellProgress(rect, e.clientX);
  cellState.clickPoint = [e.clientX, e.clientY];
  clickOrder.push(cellState);

  tweens[index].progress(cellState.progress);
  pathEls[index].style.stroke = `rgba(0,0,0,${1})`;
  pathEls[index].style.opacity = 1;

  handleAllCellsLockedIn();
}

function setUpCanvas() {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  resizeCanvas();
  window.addEventListener("resize", debounce(resizeCanvas, 1));
}

function resizeCanvas() {
  canvas.width = document.body.offsetWidth;
  canvas.height = document.body.offsetHeight;
}

function createCellState({ index, progress = 0, opacity = 1, shapeIndex }) {
  return {
    index,
    progress,
    opacity,
    shapeIndex,
    lockedIn: false,
    clickPoint: null,
  };
}

function createXSvg(parent, id) {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", `${CELL_LEN}`);
  svg.setAttribute("height", `${CELL_LEN}`);
  svg.setAttribute("viewBox", `0 0 ${CELL_LEN} ${CELL_LEN}`);
  svg.setAttribute("style", SVG_STYLE);
  svg.classList.add("cell-svg");
  svg.setAttributeNS(
    "http://www.w3.org/2000/xmlns/",
    "xmlns:xlink",
    "http://www.w3.org/1999/xlink",
  );
  svg.dataset.cellId = id;

  const xPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  xPath.setAttribute("id", id);
  xPath.setAttribute("d", PATH_D);
  xPath.setAttribute("style", X_PATH_STYLE);
  xPath.style.stroke = `rgba(0,0,0,${INITIAL_OPACITY})`;
  xPath.style.opacity = INITIAL_OPACITY;
  xPath.dataset.cellId = id;

  svg.appendChild(xPath);
  parent.appendChild(svg);

  return [svg, xPath];
}

function createMorphTween(index, shapeIndex) {
  return gsap
    .to(`#x${index}`, {
      morphSVG: {
        shape: "#circle",
        shapeIndex,
      },
      duration: 2,
      repeat: -1,
      ease: "expo.inOut",
      yoyo: true,
    })
    .play(0)
    .pause();
}

function handleAllCellsLockedIn() {
  const allCellsLockedIn =
    clickOrder.length === CELL_NUM &&
    clickOrder.every((state) => state.lockedIn);
  if (!allCellsLockedIn) return;

  ctx.beginPath();
  ctx.lineWidth = 2;

  cellStates.forEach((state, i) => {
    for (let neighbor of getCellNeighbors(i)) {
      const { clickPoint: clickPoint1, progress: progress1 } = state;
      const { clickPoint: clickPoint2, progress: progress2 } =
        cellStates[neighbor];
      drawDashedLine({
        ctx,
        clickPoint1,
        clickPoint2,
        ratio1: progress1,
        ratio2: progress2,
      });
    }
  });
}
