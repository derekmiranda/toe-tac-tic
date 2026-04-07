import "./style.css";
import { howCenteredIsPoint } from "./utils";

const root = document.getElementById("root");
const svgEls = [];
const pathEls = [];
const cellStates = [];
const tweens = [];
const CELL_NUM = 9;
const CELL_LEN = 128;
const SVG_STYLE =
  "fill-rule: evenodd; clip-rule: evenodd; stroke-linejoin: round; stroke-miterlimit: 2;";
const PATH_D =
  "M36.103,64L11.398,39.294L39.294,11.398L64,36.103L88.706,11.398L116.602,39.294L91.897,64L116.602,88.706L88.706,116.602L64,91.897L39.294,116.602L11.398,88.706L36.103,64Z";
const X_PATH_STYLE = "fill: none; stroke: black";

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

  svgGrid.addEventListener("mousemove", handleCanvasMouseMove);
})();

function handleCanvasMouseMove(e) {
  const rect = e.target.getBoundingClientRect();
  const progress = (e.clientX - rect.left) / rect.width;

  for (let i = 0; i < tweens.length; i++) {
    const tween = tweens[i];
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
      ease: CustomEase.create(
        "custom",
        "M0,0 C0,0 0.071,0.285 0.116,0.3 0.155,0.313 0.466,0.476 0.5,0.5 0.533,0.524 0.86,0.657 0.882,0.706 0.905,0.759 1,1 1,1 ",
      ),
      yoyo: true,
    })
    .play(0)
    .pause();
}
