import "./style.css";
import {
  getRectCenter,
  getAngleBetweenTwoPoints,
  howCenteredIsPoint,
} from "./utils";

const root = document.getElementById("root");
const svgEls = [];
const pathEls = [];
const cellStates = [];
const tweens = [];
const CELL_NUM = 9;
const CELL_LEN = 128;
const PROGRESS_SPEED = 1;
const SVG_STYLE =
  "fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2;";
const PATH_D =
  "M36.103,64L11.398,39.294L39.294,11.398L64,36.103L88.706,11.398L116.602,39.294L91.897,64L116.602,88.706L88.706,116.602L64,91.897L39.294,116.602L11.398,88.706L36.103,64Z";
const X_PATH_STYLE = "fill: none; stroke: black";
const INITIAL_OPACITY = 0.2;

let svgGrid;

(function main() {
  svgGrid = document.createElement("div");
  svgGrid.classList.add("ttt-grid");
  root.appendChild(svgGrid);

  for (let i = 0; i < CELL_NUM; i++) {
    const shapeIndex = Math.random() * 10;
    cellStates.push(createCellState({ index: i, shapeIndex }));
    const [svg, path] = createXSvg(svgGrid, `x${i}`);
    svgEls.push(svg);
    pathEls.push(path);
    tweens.push(createMorphTween(i, shapeIndex));
  }

  root.addEventListener("mousemove", handleMouseMove);
})();

function handleMouseMove(e) {
  for (let i = 0; i < tweens.length; i++) {
    const svgEl = svgEls[i];
    const tween = tweens[i];
    const rect = svgEl.getBoundingClientRect();
    const progress = (e.clientX - rect.left) / rect.width;

    tween.progress(progress);
    const centeredPercent = howCenteredIsPoint(rect, e.clientX, e.clientY);
    pathEls[i].style.stroke = `rgba(0,0,0,${centeredPercent})`;
  }
}

function createCellState({ index, progress = 0, opacity = 1, shapeIndex }) {
  return {
    index,
    progress,
    opacity,
    shapeIndex,
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

  const xPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
  xPath.setAttribute("id", id);
  xPath.setAttribute("d", PATH_D);
  xPath.setAttribute("style", X_PATH_STYLE);
  xPath.style.stroke = `rgba(0,0,0,${INITIAL_OPACITY})`;

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
