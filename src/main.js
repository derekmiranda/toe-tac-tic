import "./style.css";

// TODO: when clicking, pause
const tween = gsap.to("#x", {
  morphSVG: {
    shape: "#circle",
    shapeIndex: 3, // TODO: set to 0 or 1 for diff players
  },
  duration: 2,
  repeat: -1,
  ease: CustomEase.create(
    "custom",
    "M0,0 C0,0 0.071,0.285 0.116,0.3 0.155,0.313 0.466,0.476 0.5,0.5 0.533,0.524 0.86,0.657 0.882,0.706 0.905,0.759 1,1 1,1 ",
  ),
  yoyo: true,
});

document.getElementById("svg").addEventListener("click", () => {
  tween.paused() ? tween.resume() : tween.pause();
});
