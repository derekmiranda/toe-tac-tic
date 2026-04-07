const canvas = document.getElementById("ttt"),
  ctx = canvas.getContext("2d"),
  vw = canvas.width,
  vh = canvas.height,
  CELL_LEN = 128;
MorphSVGPlugin.defaultRender = draw;

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

const tweens = [];
for (let i = 0; i < 2; i++) {
  tweens.push(createMorphTween(i, 20 * Math.random()));
}

canvas.addEventListener("mousemove", function handleCanvasMouseMove(e) {
  const rect = e.target.getBoundingClientRect();
  const progress = (e.clientX - rect.left) / vw;

  for (let i = 0; i < tweens.length; i++) {
    const tween = tweens[i];
    tween.progress(progress);
  }
});

function ticTacToeLines() {
  ctx.beginPath();
  for (let i = 0; i < 4; i++) {
    ctx.moveTo(i < 2 ? CELL_LEN * (i + 1) : 0, i < 2 ? 0 : CELL_LEN * (i - 1));
    ctx.lineTo(
      i < 2 ? CELL_LEN * (i + 1) : CELL_LEN * 3,
      i < 2 ? CELL_LEN * 3 : CELL_LEN * (i - 1),
    );
  }
  ctx.stroke();
}

function draw(rawPath, target) {
  var l, segment, j, i;
  // ctx.clearRect(0, 0, vw, vh);
  ticTacToeLines();
  ctx.beginPath();
  for (j = 0; j < rawPath.length; j++) {
    segment = rawPath[j];
    l = segment.length;
    ctx.moveTo(segment[0], segment[1]);
    for (i = 2; i < l; i += 6) {
      ctx.bezierCurveTo(
        segment[i],
        segment[i + 1],
        segment[i + 2],
        segment[i + 3],
        segment[i + 4],
        segment[i + 5],
      );
    }
    if (segment.closed) {
      ctx.closePath();
    }
  }
  ctx.stroke();
}
