export const dot = (p1, p2) => p1.x * p2.x + p1.y * p2.y;
const magSq = ({ x, y }) => x ** 2 + y ** 2;

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
