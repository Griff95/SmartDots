class Brain {

  constructor(size) {
    this.directions = [];
    this.step = 0;
    this.size = size;
    this.randomize();
  }

  randomize() {
    for (let i = 0; i < this.size; i++) {
      let randomAngle = random(2 * PI);
      // console.log("r angle: " + randomAngle);
      let randomVector = new Vector(1, 0);
      randomVector.setDirection(randomAngle);
      // console.log('r vector: ');
      // console.log(randomVector);
      this.directions.push(randomVector);
    }
  }

  clone() {
    let clone = new Brain(this.directions.length);
    for (let i = 0; i < this.directions.length; i++) {
      clone.directions[i] = this.directions[i].copy();
    }
    return clone;
  }

  mutate() {
    let mutationRate = 0.05;
    for (let i = 0; i < this.directions.length; i++) {
      let r = random(1);
      if (r < mutationRate) {
        let randomAngle = random(2 * PI);
        let newVector = new Vector(1, 0);
        newVector.setDirection(randomAngle);
        this.directions[i] = newVector;
      }
    }
  }


}
