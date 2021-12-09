import io from 'socket.io-client';
import { processGameUpdate } from './state';
import { renderLessMessage, renderMoreMessage, renderNormalMessage, renderGDPMessage } from './render';
const Constants = require('../shared/constants');

const socket = io(`ws://${window.location.host}`);
const connectedPromise = new Promise(resolve => {
  socket.on('connect', () => {
    console.log('Connected to server!');
    resolve();
  });
});

export const connect = onGameOver => (
  connectedPromise.then(() => {
    // Register callbacks
    socket.on(Constants.MSG_TYPES.GAME_UPDATE, processGameUpdate);
    socket.on(Constants.MSG_TYPES.GAME_OVER, onGameOver);
    socket.on(Constants.MSG_TYPES.REDUCE_PELKEYS, reportLessPelkeys);
    socket.on(Constants.MSG_TYPES.INCREASE_PELKEYS, reportMorePelkeys);
    socket.on(Constants.MSG_TYPES.NORMAL_PELKEYS, reportNormalPelkeys);
    socket.on(Constants.MSG_TYPES.GDP_INCREASE, reportGDPIncrease);
    socket.on('disconnect', () => {
      console.log('Disconnected from server.');
      document.getElementById('disconnect-modal').classList.remove('hidden');
      document.getElementById('reconnect-button').onclick = () => {
        window.location.reload();
      };
    });
  })
);
function reportMorePelkeys() {
  renderMoreMessage();
}

function reportLessPelkeys() {
  renderLessMessage();
}

function reportNormalPelkeys() {
  renderNormalMessage();
}
function reportGDPIncrease() {
  renderGDPMessage();
}
export const play = (username, icontype) => {
  socket.emit(Constants.MSG_TYPES.JOIN_GAME, username, icontype);
};

export const updateMovement = (spd,dir) => {
  socket.emit(Constants.MSG_TYPES.KEYINPUT, spd, dir);
};

export const shootBullet = (dir) => {
  socket.emit(Constants.MSG_TYPES.MOUSECLICKINPUT, dir);
};

export const changeOrientation = (ori) => {
  socket.emit(Constants.MSG_TYPES.MOUSEMOVEINPUT, ori);
}


