export function distanceFromCenter(rect, x, y) {
  const midX = rect.left + rect.width / 2;
  const midY = rect.top + rect.height / 2;

  const xDiff = Math.abs(x - midX);
  const yDiff = Math.abs(y - midY);

  return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
}

export function howCenteredIsPoint(rect, x, y) {
  const dist = distanceFromCenter(rect, x, y);
  console.log("dist", dist);
  return (rect.width - dist) / rect.width;
}
