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
