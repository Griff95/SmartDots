class Dot {
  pos;
  vel;
  acc;
  brain;
  dead = false;
  reachedGoal = false;
  isBest = false;
  fitness = 0;


  constructor() {
      this.brain = new Brain(1000);
      this.pos = new Vector(width/2, height-10);
      this.vel = new Vector(0,0);
      this.acc = new Vector(0,0);
  }

  show() {
    if (this.isBest) {
      fill(0, 255, 0);
      ellipse(this.pos.x, this.pos.y, 8, 8);
    } else {
      fill(0);
      ellipse(this.pos.x, this.pos.y, 4, 4);
    }
  }

  move() {
    if (this.brain.directions.length > this.brain.step) {
      this.acc = this.brain.directions[this.brain.step];
      this.brain.step++;
    } else {
      this.dead = true;
    }
    this.vel.addTo(this.acc);
    this.vel.limitMagnitude(5); // don't go too fast
    this.pos.addTo(this.vel);

  }

  update(obstacles) {
    if (!this.dead && !this.reachedGoal) {
      this.move();
      if (this.pos.x < 2 || this.pos.y < 2 || this.pos.y > height-2 || this.pos.x > width-2){ // if near edges, kill it
        this.dead = true;
      }
      else if (dist(this.pos.x, this.pos.y, goal.x, goal.y) < 5) // if reachedGoal
        this.reachedGoal = true;
        // if the dot has not end but touches an obstacle
      else
        for(let obs of obstacles)
          // if obs.collide(pos)
          if (this.pos.x < obs.x + obs.dim_x &&
              this.pos.x > obs.x &&
              this.pos.y < obs.y + obs.dim_y &&
              this.pos.y > obs.y)
            this.dead = true;
    }
  }


  calculateFitness() {
    if (this.reachedGoal) // if reachedGoal then fitness is based on the amount of steps it took to get there
      this.fitness = 1.0/16.0 + 10000.0/(this.brain.step*this.brain.step);
    else {
      let distanceToGoal = dist(this.pos.x, this.pos.y, goal.x, goal.y);
      this.fitness = 1.0 / (distanceToGoal*distanceToGoal);
    }
  }

  clone() {
    let clone = new Dot();
    clone.brain = this.brain.clone();
    return clone;
  }

  collide(obstacles) {

  }
}
