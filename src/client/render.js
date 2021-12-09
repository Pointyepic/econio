import { getAsset } from './assets';
import { getCurrentState } from './state';

const Constants = require('../shared/constants');
const { PLAYER_RADIUS, PLAYER_MAX_HP, BULLET_RADIUS, MAP_SIZE, CONSUMER_MAX_HP } = Constants;

// Get the canvas graphics context
const canvas = document.getElementById('game-canvas');
const context = canvas.getContext('2d');
let recession=0;
let showGDPIncrease=false;
// Make the canvas fullscreen
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

function render() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  context.clearRect(0, 0, canvas.width, canvas.height);
  const { me, others, bullets, consumers, resources } = getCurrentState();
  if (!me) {
    return;
  }
  // Draw background
  renderBackground(me.x, me.y);
  //console.log("x: "+me.x+ " y: "+ me.y);

  // Draw all bullets
  bullets.forEach(renderBullet.bind(null, me));

  // Draw all consumers
  consumers.forEach(renderConsumer.bind(null, me));

  // Draw all resources
  resources.forEach(renderResource.bind(null, me));

  // Draw all players
  //console.log(me.dead);
  others.forEach(renderPlayer.bind(null, me));
  if (me.dead==false) renderPlayer(me, me);

  //AD notification
  context.fillStyle = 'black';
  context.font = "bold 25px Arial";
  context.textAlign = "center";
  if (recession===1)
    context.fillText("Number of Pelkeys reduced to 5.",canvas.width/2, 50);
  else if (recession === 2)
    context.fillText("Number of Pelkeys back to 20.",canvas.width/2, 50);
  else if (recession === 3)
    context.fillText("Number of Pelkeys increased to 40.",canvas.width/2, 50);

  if (showGDPIncrease===true)
    context.fillText("AS increased. GDP increased by 200.", canvas.width/2, 90);
}

export function renderLessMessage() {
  recession=1;
  setTimeout(() => { recession=0; }, 4000);
}

export function renderMoreMessage() {
  recession=3;
  setTimeout(() => { recession=0; }, 4000);
}

export function renderNormalMessage() {
  recession=2;
  setTimeout(() => { recession=0; }, 4000);
}

export function renderGDPMessage() {
  showGDPIncrease=true;
  setTimeout(() => { showGDPIncrease=false }, 4000);
}
function renderBackground(x, y) {
  //console.log(canvas.width+ " "+canvas.height);
  //context.fillStyle= 'rgba(200,200,200,255)';
  //console.log(x+ " " +y);

  var startX = 0 - (x - canvas.width/2)%25;
  var boundX=canvas.width;
  if (x-canvas.width/2 < 0) {
    startX = canvas.width/2-x;
  }
  if (x+canvas.width/2 > MAP_SIZE) {
    boundX = canvas.width/2+(MAP_SIZE-x);
  }
  
  var startY = 0-(y - canvas.height/2)%25;
  var boundY=canvas.height;
  if (y-canvas.height/2 < 0) {
    startY = canvas.height/2-y;
  }
  if (y+canvas.height/2 > MAP_SIZE) {
    boundY = canvas.height/2+(MAP_SIZE-y);
  }
  //console.log("y " + boundY);
  //console.log("x " + boundX); 
  context.fillStyle= 'rgba(119,221,119,.2)';
  context.fillRect(startX, startY, boundX-startX, boundY-startY);

  context.fillStyle= 'rgba(200,200,200,1)';
  for (var i = startX; i<=boundX; i+=25) {
    context.fillRect(i, startY, 0.25, boundY-startY);
  }
  for (var i = startY; i<=boundY; i+=25) {
     context.fillRect(startX, i, boundX-startX, 0.25);
  }

  context.drawImage(
    getAsset('ADAScurve.png'),
    canvas.width / 2 + 500 - x,
    canvas.height / 2 + 500 - y,
    368,
    321,
  );

  context.drawImage(
    getAsset('phillips-curve.png'),
    canvas.width / 2 + 1500 - x,
    canvas.height / 2 + 500 - y,
    506,
    321,
  );

  context.drawImage(
    getAsset('ppccurve.png'),
    canvas.width / 2 + 1650 - x,
    canvas.height / 2 + 1500 - y,
    302,
    321,
  );

  context.drawImage(
    getAsset('utilitygraph.png'),
    canvas.width / 2 + 450 - x,
    canvas.height / 2 + 1500 - y,
    469,
    321,
  );
}

// Renders a ship at the given coordinates
function renderPlayer(me, player) {
  const { x, y, direction, orientation, icontype } = player;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  console.log(icontype);
  // Draw ship
  context.save();
  context.translate(canvasX, canvasY);
  context.rotate(-1*orientation-Math.PI/2);
  if (icontype==="USANaN") {
    context.drawImage(
      getAsset('usaflagcircle.png'),
      -PLAYER_RADIUS,
      -PLAYER_RADIUS,
      PLAYER_RADIUS * 2,
      PLAYER_RADIUS * 2,
    );
  }
  else if (icontype==="ChinaNaN") {
    context.drawImage(
      getAsset('chinaflagcircle.png'),
      -PLAYER_RADIUS,
      -PLAYER_RADIUS,
      PLAYER_RADIUS * 2,
      PLAYER_RADIUS * 2,
    );
  }
  else if (icontype==="IndiaNaN") {
    context.drawImage(
      getAsset('indiaflagcircle.png'),
      -PLAYER_RADIUS,
      -PLAYER_RADIUS,
      PLAYER_RADIUS * 2,
      PLAYER_RADIUS * 2,
    );
  }
  context.restore();

  // Draw health bar
  context.fillStyle = 'red';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2,
  );
  
  context.fillStyle = 'white';
  context.fillRect(
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * player.hp / player.score,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - player.hp / player.score),
    2,
  );
    
  if (player === me) {
    //big hp bar
    context.fillStyle = 'red';
    context.fillRect(
      canvasX - 200,
      canvas.height-50,
      400,
      15,
    )
    //console.log(player.score);
    context.fillStyle = 'white';
    context.fillRect(
      canvasX - 200 + 400 * player.hp/player.score,
      canvas.height-50,
      400 * (1-player.hp/player.score),
      15,
    ) 
    context.fillStyle = 'black';
    context.font = "bold 12px Arial";
    context.textAlign = "center";
    context.fillText(
      "Current GDP: " + Math.round(player.hp),
      canvasX,
      canvas.height-38,
    )
  }
  else {
    context.fillStyle = 'black';
    context.font = "bold 12px Arial";
    context.textAlign = "center";
    context.fillText(
      player.username.slice(0,player.username.length-3),
      canvasX,
      canvasY - PLAYER_RADIUS - 5,
    )
  }
}

function renderBullet(me, bullet) {
  const { x, y } = bullet;
  //console.log("bulletx: "+ x);
  context.drawImage(
    getAsset('dietpepsican.png'),
    canvas.width / 2 + x - me.x - BULLET_RADIUS,
    canvas.height / 2 + y - me.y - BULLET_RADIUS,
    BULLET_RADIUS * 2,
    BULLET_RADIUS * 2,
  );

  
}

function renderConsumer(me, consumer) {
  const { x, y } = consumer;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  
  context.drawImage(
    getAsset('pelkey.png'),
    canvas.width / 2 + x - me.x - PLAYER_RADIUS,
    canvas.height / 2 + y - me.y - PLAYER_RADIUS,
    PLAYER_RADIUS* 2,
    PLAYER_RADIUS * 2,
  );

  context.fillStyle = 'red';
  context.fillRect(
    canvasX - PLAYER_RADIUS,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2,
    2,
  );
  context.fillStyle = 'white';
  context.fillRect(
    canvasX - PLAYER_RADIUS + PLAYER_RADIUS * 2 * consumer.hp / CONSUMER_MAX_HP,
    canvasY + PLAYER_RADIUS + 8,
    PLAYER_RADIUS * 2 * (1 - consumer.hp / CONSUMER_MAX_HP),
    2,
  );
}

function renderResource(me, resource) {
  const { x, y, orientation } = resource;
  const canvasX = canvas.width / 2 + x - me.x;
  const canvasY = canvas.height / 2 + y - me.y;
  
  context.save();
  context.translate(canvasX,canvasY)
  context.rotate(orientation);
  context.drawImage(
    getAsset('resources.png'),
    -PLAYER_RADIUS,-PLAYER_RADIUS,
    PLAYER_RADIUS* 2,
    PLAYER_RADIUS * 2,
  );
  context.restore();
}
/*
function renderMainMenu() {
  const t = Date.now() / 7500;
  const x = MAP_SIZE / 2 + 800 * Math.cos(t);
  const y = MAP_SIZE / 2 + 800 * Math.sin(t);
  renderBackground(x, y);
}*/
// ... Helper functions here excluded

let renderInterval;

export function startRendering() {
  clearInterval(renderInterval);
  renderInterval = setInterval(render, 1000 / 60);
}