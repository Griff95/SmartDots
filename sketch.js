//environment
var populations = [];
var obstacles = [];
var goal = new Vector(400, 10);
var startPos_x;
var startPos_y;

//editMode
let editMode = false;
let createRectangle = false;
let select_deleteObstacles = false;
let button_addObs;
let button_deleteObs;
let isDragging = false;
let lock = false;
let areaSelection = false;
let xOffset = {};
let yOffset = {};
let xMousePressed;
let yMousePressed;

//options
let stop = false;
let visualize = true;
let wait = false;

//buttons & user inputs
let button_stop;
let button_play;
let button_edit;
let button_hide;
let button_show;
let slider_speed;
let button_compete;
let button_dontCompete;


function setup() {
  let cvn = createCanvas(800, 800);
  cvn.parent('sketch');
  frameRate(60);

  // let inp = createInput('BONJOUR');

  // init population
  startPos_x = width / 2;
  startPos_y = height - 10;
  let nb_population = 5;
  for (let i = 0; i < nb_population; i++) {
    populations[i] = new Population(i, 100, startPos_x, startPos_y);
  }

  // init obstacles
  obstacles[0] = new Obstacle(200, 300, 400, 10);
  obstacles[1] = new Obstacle(50, 700, 50, 10);
  obstacles[2] = new Obstacle(150, 700, 50, 10);
  obstacles[3] = new Obstacle(250, 700, 50, 10);
  obstacles[4] = new Obstacle(350, 700, 150, 10);
  obstacles[5] = new Obstacle(650, 700, 50, 10);
  obstacles[6] = new Obstacle(750, 700, 50, 10);
  obstacles[7] = new Obstacle(550, 700, 50, 10);


  // Pause and play
  button_play = createImg('imgs\\play.png', 'play');
  button_play.mousePressed(play);
  button_stop = createImg('imgs\\pause.png', 'pause');
  button_stop.mousePressed(pause);
  if (stop) {
    button_stop.position(-40, -40);
    button_play.position(width - 30, height - 25);
  } else {
    button_stop.position(width - 30, height - 25);
    button_play.position(-40, -40);
  }

  // Edit mode : enter and validate, add obstacles, remove selection
  button_edit = createImg('imgs\\edit.png', 'edit');
  button_edit.mousePressed(enterEditMode);
  button_validate = createImg('imgs\\validate.png', 'validate');
  button_validate.mousePressed(validateEditMode);
  button_addObs = createImg('imgs\\addShape.jpeg', 'addShape');
  button_addObs.mousePressed(addObstacles);
  button_deleteObs = createImg('imgs\\delete.png', 'delete');
  button_deleteObs.mousePressed(deleteSelection);
  if (editMode) {
    button_edit.position(-100, -100);
    button_validate.position(width - 40, 10);
    button_addObs.position(width - 25, 60);
    button_deleteObs.position(width - 25, 90);
  } else {
    button_edit.position(width - 40, 10);
    button_validate.position(-100, -100);
    button_addObs.position(-100, -100);
    button_deleteObs.position(-100, -100);
  }


  // Button reset
  button_reset = createImg('imgs\\reset.png', 'reset');
  button_reset.position(width - 70, height - 25);
  button_reset.mousePressed(reset);

  // Button hide / show
  button_hide = createImg('imgs\\hide.png', 'hide');
  button_hide.mousePressed(drawOrDont);
  button_show = createImg('imgs\\show.png', 'show');
  button_show.mousePressed(drawOrDont);
  if (visualize) {
    button_hide.position(width - 110, height - 25);
    button_show.position(-100, -100);

  } else {
    button_show.position(width - 110, height - 25);
    button_hide.position(-100, -100);
  }

  // button compete
  button_compete = createImg('imgs\\compete.png', 'compete');
  button_compete.mousePressed(waitOrDont);
  button_dontCompete = createImg('imgs\\run.png', 'run');
  button_dontCompete.mousePressed(waitOrDont);
  if (!wait) {
    button_compete.position(width - 150, height - 25);
    button_dontCompete.position(-100, -100);

  } else {
    button_dontCompete.position(width - 150, height - 25);
    button_compete.position(-100, -100);
  }

  // slider_speed define the number of draw loop to compute each frame
  slider_speed = createSlider(1, 20, 1);
  slider_speed.parent('slider_speed');
}

function draw() {

  // Edition mode activated
  if (editMode) {
    background(255);

    // draw outline of sketch
    line(0, 0, width - 1, 0);
    line(0, 0, 0, height - 1);
    line(0, height - 1, width - 1, height - 1);
    line(width - 1, 0, width - 1, height - 1);

    // draw goal
    fill(255, 0, 0);
    ellipse(goal.x, goal.y, 10, 10);
    textSize(10);
    text("GOAL", goal.x + 10, goal.y + 5)

    // draw obstacle(s)
    hoverSelection = obstacles.filter(el => el.selected && el.contains(mouseX, mouseY)).length > 0;
    for (obstacle of obstacles) {
      obstacle.draw(editMode, hoverSelection);
    }


    // draw selection area
    if (areaSelection) {
      line(mouseX, mouseY, xMousePressed, mouseY);
      line(mouseX, mouseY, mouseX, yMousePressed);
      line(xMousePressed, yMousePressed, mouseX, yMousePressed);
      line(xMousePressed, yMousePressed, xMousePressed, mouseY);
    }

    // outline of create rectangle icon
    if (createRectangle) {
      push();
      strokeWeight(3);
      noFill()
      rect(width - 35, 50, 30, 30);
      pop();
    }

  }


  // Generation (main) mode activated
  else {
    for (let n = 0; n < slider_speed.value(); n++) { // slider gives number of steps to proceed
      background(255);

      // draw goal
      fill(255, 0, 0);
      ellipse(goal.x, goal.y, 10, 10);
      textSize(10);
      text("GOAL", goal.x + 10, goal.y + 5)

      // draw obstacle(s)
      for (let obstacle of obstacles) {
        obstacle.draw();
      }

      let noOneAlive = allPopsDead(populations);
      for (population of populations) {
        if (!stop) {
          if (noOneAlive || !wait && population.allDotsDead()) {
            // genetic algo
            population.calculateFitness();
            population.naturalSelection();
            population.mutateBabies();

          } else {
            // if any dots are alive then update
            if (!population.allDotsDead()) population.update(obstacles);
            // show them if user activates visualization
            if (visualize) population.show();
          }
        } else {
          if (visualize) population.show();
        }
      }
    }
  }
}



function allPopsDead(populations) {
  for (let p of populations)
    if (!p.allDotsDead())
      return false;
  return true;
}



//  button command

function addObstacles() {
  createRectangle = !createRectangle;
}

function deleteSelection() {
  iToDelete = [];
  for (let i in obstacles) {
    if (obstacles[i].selected)
      iToDelete.push(i);
  }
  for (let i of iToDelete.sort(function(a, b) {
      return b - a
    })) {
    obstacles.splice(i, 1);
  }
}

function reset() {
  for (let i = 0; i < populations.length; i++) {
    populations[i] = new Population(i, 20, startPos_x, startPos_y);
  }
}

function play() {
  // play and put button play away
  button_play.position(-40, -40);
  button_stop.position(width - 30, height - 25);
  stop = false;
}

function pause() {
  // pause and put button pause away
  button_play.position(width - 30, height - 25);
  button_stop.position(-40, -40);
  stop = true;
}

function waitOrDont() {
  if (wait) {
    // hide and put button show away
    button_compete.position(width - 150, height - 25)
    button_dontCompete.position(-100, -100);
    wait = false;
  } else {
    button_dontCompete.position(width - 150, height - 25);
    button_show.position(-100, -100);
    wait = true;
  }
}

function drawOrDont() {
  if (visualize) {
    // hide and put button show away
    button_show.position(width - 110, height - 25)
    button_hide.position(-100, -100);
    visualize = false;
  } else {
    button_hide.position(width - 110, height - 25);
    button_show.position(-100, -100);
    visualize = true;
  }
}

function enterEditMode() {
  button_hide.position(-100, -100);
  button_play.position(-100, -100);
  button_stop.position(-100, -100);
  button_compete.position(-100, -100);
  button_reset.position(-100, -100);

  button_edit.position(-100, -100);
  button_validate.position(width - 40, 10);
  button_addObs.position(width - 25, 60);
  button_deleteObs.position(width - 25, 90);
  editMode = true;
}

function validateEditMode() {
  // Set buttons to their initial positions
  if (stop) {
    button_stop.position(-40, -40);
    button_play.position(width - 30, height - 25);
  } else {
    button_stop.position(width - 30, height - 25);
    button_play.position(-40, -40);
  }
  button_reset.position(width - 70, height - 25);
  button_hide.position(width - 110, height - 25);
  button_compete.position(width - 150, height - 25);



  // change validate button into edit button
  button_validate.position(-100, -100);
  button_addObs.position(-100, -100);
  button_deleteObs.position(-100, -100);
  button_edit.position(width - 40, 10);
  editMode = false;

  // all obstacles are deselected
  for (let obs of obstacles) {
    obs.selected = false;
  }

  // SAVE STUFF HERE
}


function mousePressed() {
  if (editMode) {
    xMousePressed = mouseX;
    yMousePressed = mouseY;
    xOffset = {};
    yOffset = {};

    for (let i_obs in obstacles) {
      if (obstacles[i_obs].contains(mouseX, mouseY) && !obstacles[i_obs].selected) {
        for (let obs of obstacles) obs.selected = false;
        obstacles[i_obs].select();
        break;
      }
    }
    //
    // for (let obs of obstacles) {
    //   if (obs.contains(mouseX, mouseY)) {
    //     obs.selected = true;
    //   }
    // }
    for (let i_obs in obstacles) {
      if (obstacles[i_obs].selected) {
        xOffset[i_obs] = mouseX - obstacles[i_obs].x;
        yOffset[i_obs] = mouseY - obstacles[i_obs].y;
        if (obstacles[i_obs].contains(mouseX, mouseY))
          lock = true;
      }

    }
  }
}

function mouseDragged() {
  if (editMode) {
    if (lock) { // drag'n drop to move selected obstacles
      for (let i_obs in obstacles) {
        if (obstacles[i_obs].selected) {
          obstacles[i_obs].x = mouseX - xOffset[i_obs];
          obstacles[i_obs].y = mouseY - yOffset[i_obs];
        }
      }
    } else { // aera selection
      areaSelection = true;
    }
  }
}

function mouseReleased() {
  if (editMode) {
    if (areaSelection) {
      if (createRectangle) {
        obstacles.push(new Obstacle(Math.min(mouseX, xMousePressed), Math.min(yMousePressed, mouseY), Math.abs(xMousePressed - mouseX), Math.abs(yMousePressed - mouseY)));
      } else {
        for (let obs of obstacles) {
          obs.selected = false;
          if (obs.insideSelection(Math.min(mouseX, xMousePressed), Math.min(yMousePressed, mouseY), Math.abs(xMousePressed - mouseX), Math.abs(yMousePressed - mouseY)))
            obs.selected = true;
        }
      }
    }
    if (!lock && !areaSelection)
      for (let obs of obstacles) obs.selected = false;


    // reset variables
    isDragging = false;
    lock = false;
    areaSelection = false;
  }
}
