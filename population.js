class Population {
  id;
  dots = [];
  fitnessSum;
  gen = 0;
  bestDot = 0;
  minStep = 1000;
  size;
  bestWay = [];
  initial_x;
  initial_y;

  constructor(id, size, startPos_x, startPos_y) {
    this.initial_x = startPos_x;
    this.initial_y = startPos_y;
    this.id = id;
    this.size = size;
    for (let i = 0; i < size; i++) {
      this.dots[i] = new Dot(width/2, height-10);
    }
  }

  show() {
    for (let d of this.dots) {
      d.show();
    }
    // best dot + best way
    if (this.dots[0].isBest && this.bestWay.length > 0) {
      this.dots[0].show();
      fill(0);
      textSize(15);
      text(" " +this.id, this.dots[0].pos.x+4, this.dots[0].pos.y+4);
      line(this.initial_x, this.initial_y, this.bestWay[0].x, this.bestWay[0].y);
      for (let i = 1 ; i < this.bestWay.length; i++) {
        line(this.bestWay[i-1].x, this.bestWay[i-1].y, this.bestWay[i].x, this.bestWay[i].y);
      }
    }
  }

  update(obstacles) {
    for(let d of this.dots) {
      // if the dot has already taken more steps than the best dot to reach the goal
      if (d.brain.step > this.minStep)
        d.dead = true;
      else {
        d.update(obstacles);
      }
    }

    // feed best way
    if (this.dots[0].isBest){
      // console.log(this.dots[0].brain.step-1);
      this.bestWay[this.dots[0].brain.step-1] = Object.create({ x: this.dots[0].pos.x, y: this.dots[0].pos.y});
    }
  }

  calculateFitness() {
    for (let d of this.dots) {
      d.calculateFitness();
    }
  }

  allDotsDead() {
    for (let d of this.dots)
      if (!d.dead && !d.reachedGoal)
        return false;
    return true;
  }

  naturalSelection() {
    let newDots = [];
    this.setBestDot();
    this.calculateFitnessSum();
    let tmp = (this.minStep != 1000)? this.minStep: "not reached";
    console.log("SPECIES " + this.id +
                "\nGeneration n°" + this.gen +
                "\nSize: " + this.dots.length +
                "\nBest Dot Fitness: " + this.dots[0].fitness +
                "\nSteps needed to reach goal: " + tmp);

    // create new generation based on the best element of last one
    newDots[0] = this.dots[this.bestDot].clone(this.initial_x, this.initial_y);
    newDots[0].isBest = true;
    for (let i = 1; i < this.dots.length; i++) {
      let parent = this.selectParent();
      newDots[i] = parent.clone(this.initial_x, this.initial_y);
    }
    this.dots = newDots;
    this.bestWay = [];
    this.gen++;
  }

  calculateFitnessSum() {
    this.fitnessSum = 0;
    for (let i = 0 ; i < this.dots.length; i++) {
      this.fitnessSum += this.dots[i].fitness;
    }
  }

  //this function works by randomly choosing a value between 0 and the sum of all the fitnesses
  //then go through all the dots and add their fitness to a running sum and if that sum is greater than the random value generated that dot is chosen
  //since dots with a higher fitness function add more to the running sum then they have a higher chance of being chosen
  selectParent() {
    let r = random(this.fitnessSum);
    let runningSum = 0;
    for (let d of this.dots) {
      runningSum += d.fitness;
      if (runningSum > r)
        return d;
    }
    return null; // not reached
  }

  mutateBabies() {
    for (let i = 1; i < this.dots.length; i++) {
      this.dots[i].brain.mutate();
    }
  }

  setBestDot() {
    let max = 0;
    let maxIndex = 0;
    for(let i = 0; i < this.dots.length; i++) {
      if (this.dots[i].fitness > max){
        max = this.dots[i].fitness;
        maxIndex = i;
      }
    }

    this.bestDot = maxIndex

    // if the best dot reached the goal then reset the minimum number of steps it takes to get to the goal
    if (this.dots[this.bestDot].reachedGoal) {
      this.minStep = this.dots[this.bestDot].brain.step;
    }
  }
}
