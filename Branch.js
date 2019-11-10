class Branch {
  constructor(direction, start, index, parent) {
    this.direction = direction;
    this.startPosition = start;
    this.currentLength = 0;
    this.length = MIN_LENGTH + Math.random() * MAX_LENGTH;
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
    if (this.branches.length > 0) {
      return;
    }
    // const splits = [2, 3, 4];
    const n = currentSplits[Math.floor(Math.random() * currentSplits.length)];
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
    this.thickness = THICKNESS * (childIndex - this.index);

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
