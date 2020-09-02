class Obstacle {
  constructor(x, y, dim_x, dim_y) {
    this.x = x;
    this.y = y;
    this.dim_x = dim_x;
    this.dim_y = dim_y;
    this.selected = false;


  }

  draw(editMode, hoverSelection = false) {
    push()
    if (editMode) {
      if (this.contains(mouseX, mouseY))
        stroke(127);
      if (this.selected) {
        strokeWeight(4);
        if (hoverSelection)
          stroke(127);
      }
    }
    fill(0, 0, 255);
    rect(this.x, this.y, this.dim_x, this.dim_y);
    pop();
  }

  select() {
    this.selected = !this.selected;
  }

  contains(x, y) {
    if (x < this.x + this.dim_x &&
      x > this.x &&
      y < this.y + this.dim_y &&
      y > this.y)
      return true;
    return false;
  }

  insideSelection(x, y, dim_x, dim_y) {
    let testPoint = function(a, b) {
      return ((a > x && a < x + dim_x && b > y && b < y + dim_y)) ? true : false;
    }

    if (testPoint(this.x, this.y) || testPoint(this.x + this.dim_x, this.y) || testPoint(this.x + this.dim_x, this.y + this.dim_y) || testPoint(this.x, this.y + this.dim_y)) {
      return true;
    }
    return false;
  }
  //
  // move(dx, dy) {
  //     this.x += dx;
  //     this.y += dy;
  // }
}
