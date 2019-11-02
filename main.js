const canvas = document.getElementsByTagName("canvas")[0];
const ctx = canvas.getContext("2d");
const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// var w = c.width = window.innerWidth,
// 		h = c.height = window.innerHeight,
// 		ctx = c.getContext( '2d' ),

const GROW_SPEED = 3; //0.5;
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
    this.start = start;
    this.currentLength = 0;
    this.length = 20 + Math.random() * 100;
    this.end = start.plus(direction.multiply(this.length));
    this.thickness = 2;
    this.currentThickness = 0;
    this.branches = [];
    this.index = index;
    this.parent = parent;
  }

  createBranches() {
    const n = Math.ceil(Math.random() * 4);
    const angle = -20 + Math.random() * 40;
    const angles = [angle, -angle, angle + Math.random() * angle];
    // console.log(angles);
    for (let i = 0; i < n; i++) {
      const branch = new Branch(
        this.direction.rotate(angles[i]),
        this.end,
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
    // this.getThicker();
    if (this.parent) {
      this.parent.onChildBranched(childIndex);
    }
  }

  getThicker() {
    this.thickness *= 1.1;
  }

  update() {
    if (this.currentLength < this.length) {
      this.currentLength += GROW_SPEED;
    } else if (this.branches.length === 0 && this.index < 8) {
      this.createBranches();
    }
    if (this.currentThickness < this.thickness) {
      this.currentThickness += GROW_SPEED / 10;
    }
  }

  render() {
    const currentEnd = this.start.plus(
      this.direction.multiply(this.currentLength)
    );
    ctx.strokeStyle = "#000";
    ctx.lineWidth = this.currentThickness;
    ctx.beginPath();
    ctx.moveTo(this.start.x, this.start.y);
    ctx.lineTo(currentEnd.x, currentEnd.y);
    ctx.stroke();

    // console.log("Draw from ", this.start, "to", this.end);
  }
}

const trunk = new Branch(new Vector2(0, -1), new Vector2(width / 2, height), 0);
scene.branches.push(trunk);

function tick() {
  window.requestAnimationFrame(tick);

  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, width, height);

  scene.branches.forEach(branch => {
    branch.update();
  });

  scene.branches.forEach(branch => {
    branch.render();
  });
}

tick();
