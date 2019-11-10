const dpr = window.devicePixelRatio || 1;
const canvas = document.getElementsByTagName("canvas")[0];
const WIDTH = (canvas.width = window.innerWidth);
const HEIGHT = (canvas.height = window.innerHeight);
const boundingRect = canvas.getBoundingClientRect();
canvas.width = boundingRect.width * dpr;
canvas.height = boundingRect.height * dpr;
const ctx = canvas.getContext("2d");
ctx.scale(dpr, dpr);

// Crazy way of having the right scale for every resolution
const RENDER_SIZE =
  WIDTH > HEIGHT ? (WIDTH * 0.75) / 1000 : (HEIGHT * 1.2) / 1000;

const GROW_SPEED = 3;

let MAX_MIN_LENGTH = 20;
let MAX_MAX_LENGTH = 60;
let MIN_LENGTH = 5;
let MAX_LENGTH = 20;

const MAX_THICKNESS = 4;
let THICKNESS = 1;

const chooseOverlay = document.getElementById("choose-overlay");
const splittingButton = document.getElementById("splitting-button");
const lengthButton = document.getElementById("length-button");
const thicknessButton = document.getElementById("thickness-button");
// const curvyButton = document.getElementById("curvy-button");
const nothingButton = document.getElementById("nothing-button");

const splits = [1, 1, 2, 2, 2, 2, 2, 2, 3, 3];
let currentSplits = splits.slice(0, 1);

const scene = {
  branches: []
};

(function() {
  function tick() {
    window.requestAnimationFrame(tick);

    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);

    scene.branches.forEach(branch => {
      branch.update();
    });

    scene.branches.forEach(branch => {
      branch.render();
    });
  }

  function reset() {
    scene.state = new StateMachine({
      growing: {
        onEnter: () => {
          setTimeout(() => {
            scene.state.setState("choosing");
          }, 1000);
        },
        onExit: () => {}
      },
      choosing: {
        onEnter: () => {
          chooseOverlay.style.display = "block";
        },
        onExit: () => {
          chooseOverlay.style.display = "none";
          scene.branches.forEach(branch => {
            branch.createBranches();
          });
        }
      }
    });
    scene.state.setState("growing");
    scene.trunk = new Branch(new Vector2(0, -1), new Vector2(0, 0), 0);
    scene.branches = [];
    scene.branches.push(scene.trunk);
  }

  function increaseSplitChances() {
    currentSplits = splits.slice(0, currentSplits.length + 1);
    scene.state.setState("growing");
  }

  function increaseMaxLength() {
    MIN_LENGTH *= 1.1;
    MIN_LENGTH = MIN_LENGTH > MAX_MIN_LENGTH ? MAX_MIN_LENGTH : MIN_LENGTH;
    MAX_LENGTH *= 1.1;
    MAX_LENGTH = MAX_LENGTH > MAX_MAX_LENGTH ? MAX_MAX_LENGTH : MAX_LENGTH;
    scene.state.setState("growing");
  }

  function increaseThickness() {
    THICKNESS += 0.5;
    THICKNESS = THICKNESS > MAX_THICKNESS ? MAX_THICKNESS : THICKNESS;
    scene.state.setState("growing");
  }

  function nothing() {
    scene.state.setState("growing");
  }

  function start() {
    reset();
    tick();

    window.addEventListener("resize", function() {
      onResize();
      reset();
    });

    // window.addEventListener("click", function() {
    //   reset();
    // });

    splittingButton.addEventListener("click", function() {
      increaseSplitChances();
    });

    lengthButton.addEventListener("click", function() {
      increaseMaxLength();
    });

    thicknessButton.addEventListener("click", function() {
      increaseThickness();
    });

    // curvyButton.addEventListener("click", function() {
    //   nothing();
    // });

    nothingButton.addEventListener("click", function() {
      nothing();
    });
  }

  window.addEventListener("load", () => {
    start();
  });
})();
