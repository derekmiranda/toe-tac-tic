const MAX_DASH_GAP = 100;
const MIN_DASH_GAP = 3;
const DASH_RADIUS = 1.5;
const DASH_COLOR = 'white';

export const dot = (p1, p2) => p1.x * p2.x + p1.y * p2.y;
const magSq = ({ x, y }) => x ** 2 + y ** 2;

export function smoothStep(x) { //Normal smoothstep
  return -2 * Math.pow(x, 3) + 3 * Math.pow(x, 2);
}

// Source - https://stackoverflow.com/a/68309369
// Posted by Exodus 4D
// Retrieved 2026-04-07, License - CC BY-SA 4.0
export const getAngleBetweenTwoPoints = (p1, p2) =>
  Math.acos(dot(p1, p2) / Math.sqrt(magSq(p1) * magSq(p2)));

export function getRectCenter(rect) {
  return [rect.left + rect.width / 2, rect.top + rect.height / 2];
}

export function distanceFromCenter(rect, x, y) {
  const [midX, midY] = getRectCenter(rect);

  const xDiff = Math.abs(x - midX);
  const yDiff = Math.abs(y - midY);

  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

export function howCenteredIsPoint(rect, x, y) {
  const dist = distanceFromCenter(rect, x, y);
  const shorterAxis = Math.min(rect.width, rect.height);
  return (shorterAxis - dist) / shorterAxis;
}

export function debounce(func, delay) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

export function getCellNeighbors(i, rowLen = 3, len = 9) {
  const neighbors = [];
  for (let j = -1; j <= 1; j++) {
    for (let k = -1; k <= 1; k++) {
      const neighbor = i + j + rowLen * k;
      const xValue = (i % rowLen) + j;
      const yValue = Math.floor(i / rowLen) + k;
      if (
        (j === 0 && k === 0) ||
        neighbor < i ||
        xValue < 0 ||
        yValue < 0 ||
        xValue >= rowLen ||
        yValue >= rowLen ||
        neighbor >= len
      ) {
        continue;
      }

      neighbors.push(neighbor);
    }
  }
  return neighbors;
}

export function drawDashedLine({
  ctx,
  clickPoint1,
  clickPoint2,
  ratio1,
  ratio2,
}) {
  const xDiff = clickPoint2[0] - clickPoint1[0];
  const yDiff = clickPoint2[1] - clickPoint1[1];
  const vectorLen = Math.hypot(xDiff, yDiff);
  const ratioDiff = smoothStep(Math.abs(ratio1 - ratio2));
  const dashGap = Math.max(MAX_DASH_GAP * ratioDiff, MIN_DASH_GAP);

  let currentRayLen = 0;

  ctx.fillStyle = DASH_COLOR
  while (currentRayLen <= vectorLen) {
    const dx = (currentRayLen / vectorLen) * xDiff;
    const dy = (currentRayLen / vectorLen) * yDiff;
    ctx.beginPath();
    ctx.arc(
      clickPoint1[0] + dx,
      clickPoint1[1] + dy,
      DASH_RADIUS,
      0,
      2 * Math.PI,
    );
    ctx.fill();
    currentRayLen += dashGap;
  }
}
