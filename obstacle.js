class Obstacle {
  constructor(x, y, dim_x, dim_y) {
    this.x = x;
    this.y = y;
    this.dim_x = dim_x;
    this.dim_y = dim_y;


  }

  draw() {
    rect(this.x, this.y, this.dim_x, this.dim_y);
  }
}
