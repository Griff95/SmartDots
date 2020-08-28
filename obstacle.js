class Obstacle {
  constructor(x, y, dim_x, dim_y) {
    this.x = x;
    this.y = y;
    this.dim_x = dim_x;
    this.dim_y = dim_y;


  }

  draw() {
    fill(0, 0, 255);
    rect(this.x, this.y, this.dim_x, this.dim_y);
  }

  inside(x, y) {

  }
}
