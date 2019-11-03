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

const GROW_SPEED = 6;
const scene = {
  branches: []
};

class Vector2 {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  minus(other) {
    return new Vector2(this.x - other.x, this.y - other.y);
  }
  plus(other) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }
  multiply(other) {
    if (typeof other === "number") {
      return new Vector2(this.x * other, this.y * other);
    }
  }
  rotate(degrees) {
    const radians = degrees * (Math.PI / 180);
    return new Vector2(
      this.x * Math.cos(radians) - this.y * Math.sin(radians),
      this.x * Math.sin(radians) + this.y * Math.cos(radians)
    );
  }
}

class Branch {
  constructor(direction, start, index, parent) {
    this.direction = direction;
    this.startPosition = start;
    this.currentLength = 0;
    this.length = 20 + Math.random() * 60;
    this.initialLength = this.length;
    this.thickness = 2;
    this.currentThickness = 0;
    this.branches = [];
    this.index = index;
    this.parent = parent;
  }

  start() {
    if (this.parent) {
      return this.parent.end();
    }
    return this.startPosition;
  }

  end() {
    return this.start().plus(this.direction.multiply(this.currentLength));
  }

  createBranches() {
    const splits = [1, 2, 2, 2, 3];
    // const splits = [2, 3, 4];
    const n = splits[Math.floor(Math.random() * splits.length)];
    // const n = Math.ceil(Math.random() * 4);
    const angle = -20 + Math.random() * 40;
    const angles = [angle, -angle, angle + Math.random() * angle];
    // console.log(angles);
    for (let i = 0; i < n; i++) {
      const branch = new Branch(
        this.direction.rotate(angles[i]),
        this.end(),
        this.index + 1,
        this
      );
      this.branches.push(branch);
      scene.branches.push(branch);
    }
    this.getThicker();
    if (this.parent) {
      this.parent.onChildBranched(this.index);
    }
  }

  onChildBranched(childIndex) {
    this.thickness = 3 * (childIndex - this.index);

    this.length = this.initialLength * (1 + (childIndex - this.index) / 5);
    if (this.parent) {
      this.parent.onChildBranched(childIndex);
    }
  }

  //   updateStart(start) {
  //     this.start = start;
  //     this.end = this.start.plus(this.direction.multiply(this.length));
  //     if (this.branches.length > 0) {
  //       this.branches.forEach(branch => {
  //         branch.updateStart(this.end);
  //       });
  //     }
  //   }

  getThicker() {
    this.thickness *= 1.1;
  }

  update() {
    if (this.currentLength < this.length) {
      this.currentLength +=
        this.branches.length == 0 ? GROW_SPEED : GROW_SPEED / 5;
    } else if (this.branches.length === 0 && this.index < 7) {
      this.createBranches();
    }
    if (this.currentThickness < this.thickness) {
      this.currentThickness += GROW_SPEED / 10;
    }
  }

  render() {
    const currentEnd = this.start().plus(
      this.direction.multiply(this.currentLength)
    );

    // Makes sure that the zero point of the world is in the bottom
    // of the screen and that everything scales nicely on all resolutions
    const projectedStart = new Vector2(WIDTH / 2, HEIGHT).plus(
      this.start().multiply(RENDER_SIZE)
    );
    const projectedEnd = new Vector2(WIDTH / 2, HEIGHT).plus(
      currentEnd.multiply(RENDER_SIZE)
    );

    ctx.strokeStyle = "#000";
    ctx.lineWidth = this.currentThickness * RENDER_SIZE;
    ctx.beginPath();
    ctx.moveTo(projectedStart.x, projectedStart.y);
    ctx.lineTo(projectedEnd.x, projectedEnd.y);
    ctx.stroke();
  }
}

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
  const trunk = new Branch(new Vector2(0, -1), new Vector2(0, 0), 0);
  scene.branches = [];
  scene.branches.push(trunk);
}

reset();
tick();

window.addEventListener("resize", function() {
  onResize();
  reset();
});

window.addEventListener("click", function() {
  reset();
});
