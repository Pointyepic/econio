import { PLAYER_FIRE_COOLDOWN } from '../shared/constants';
import { updateMovement, shootBullet, changeOrientation } from './networking';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');

var dir, bulldir, spd = 0;
var counter = 0;
var shoottimer = null;
var left, right, up, down = false;
var mousedown=false;
function onMouseDownInput(e) {
  mousedown=true;
  bulldir = Math.atan2(window.innerHeight / 2 - e.clientY, e.clientX - window.innerWidth / 2);
}

function onMouseUpInput(e) {
  mousedown=false;
}

function onMouseMoveInput(e) {
  const ori = Math.atan2(window.innerHeight / 2 - e.clientY, e.clientX - window.innerWidth / 2);
  bulldir = Math.atan2(window.innerHeight / 2 - e.clientY, e.clientX - window.innerWidth / 2);
  changeOrientation(ori);
}

function onKeyDownInput(e) {
  if (e.key == 'w') {
    up=true;
    console.log("w")
  }
  else if (e.key == 'a') {
    left=true;
    console.log("a")
  }
  else if (e.key == 's') {
    down=true;
    console.log("s")
  }
  else if (e.key == 'd') {
    right=true;
    console.log("d")
  }
  handleInput();
}

function onKeyUpInput(e) {
  if (e.key == 'w') {
    up=false;
  }
  else if (e.key == 'a') {
    left=false;
  }
  else if (e.key == 's') {
    down=false;
  }
  else if (e.key == 'd') {
    right=false;
  }  
  handleInput();
}

function handleInput() {
  spd=Constants.PLAYER_SPEED;
  if (left && up) {
    dir = 3*Math.PI/4;
  }
  else if (left && down) {
    dir = 5*Math.PI/4;
  }
  else if ((left && right) || (up && down)) {
    spd = 0;
  }
  else if (up && right) {
    dir = Math.PI/4;
  }
  else if (down && right) {
    dir = 7*Math.PI/4;
  }
  else if (left) {
    dir = Math.PI;
  }
  else if (right) {
    dir = 0;
  }
  else if (up) {
    dir = Math.PI/2;
  }
  else if (down) {
    dir = 3*Math.PI/2;
  }
  else {
    spd=0;
  }
  updateMovement(spd,dir);
}
export function startCapturingInput() {
  window.addEventListener('mousedown', onMouseDownInput);
  window.addEventListener('mouseup', onMouseUpInput);
  window.addEventListener('mousemove', onMouseMoveInput);
  // window.addEventListener('touchmove', onTouchInput);
  window.addEventListener('keydown', onKeyDownInput);
  window.addEventListener('keyup', onKeyUpInput);

  shoottimer = setInterval(function() {
    //console.log(counter);
    const { me} = getCurrentState();
    let cooldown = (12000/(Math.round(me.hp)));
    //console.log(me.hp);
    if (counter<cooldown) counter++;
    if (mousedown && counter>=cooldown) {
        shootBullet(bulldir);
        counter=0;
    }
  }, 10 );
}

export function stopCapturingInput() {
  window.removeEventListener('mousedown', onMouseDownInput);
  window.removeEventListener('mouseup', onMouseUpInput);
  window.removeEventListener('mousemove', onMouseMoveInput);
  //window.removeEventListener('touchmove', onTouchInput);
  window.removeEventListener('keydown', onKeyDownInput);
  window.removeEventListener('keydown', onKeyUpInput);

  clearInterval(shoottimer);
}