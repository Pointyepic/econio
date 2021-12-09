const express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackConfig = require('../../webpack.dev.js');
const socketio = require('socket.io');
const Constants = require('../shared/constants');
const Game = require('./game');
const { characters } = require('shortid');

// Setup an Express server
const app = express();
app.use(express.static('public'));

if (process.env.NODE_ENV === 'development') {
  // Setup Webpack for development
  const compiler = webpack(webpackConfig);
  app.use(webpackDevMiddleware(compiler));
} else {
  // Static serve the dist/ folder in production
  app.use(express.static('dist'));
}

// Listen on port
const port = process.env.PORT || 1936;
const server = app.listen(port);
console.log(`Server listening on port ${port}`);


// Setup socket.io
const io = socketio(server);

// Listen for socket.io connections
io.on('connection', socket => {
  console.log('Player connected!', socket.id);

  socket.on(Constants.MSG_TYPES.JOIN_GAME, joinGame);
  socket.on(Constants.MSG_TYPES.KEYINPUT, handleInput);
  socket.on(Constants.MSG_TYPES.MOUSECLICKINPUT, shootBullet);
  socket.on(Constants.MSG_TYPES.MOUSEMOVEINPUT, changeOrientation);
  socket.on('disconnect', onDisconnect);
});

// ...

// Setup the Game
const game = new Game();

function joinGame(username, icontype) {
  game.addPlayer(this, username, icontype);
}


function handleInput(spd, dir) {
  game.handleInput(this, spd, dir);
}

function shootBullet(dir) {
  //console.log(dir);
  game.shootBullet(this, dir);
}

function changeOrientation(ori) {
  game.changeOrientation(this, ori);
}

function onDisconnect() {
  console.log('Player disconnected ', this.id)
  game.removePlayer(this);
}