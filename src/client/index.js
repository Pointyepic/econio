import { connect, play } from './networking';
import { startRendering, startRenderingDead } from './render';
import { startCapturingInput, stopCapturingInput } from './input';
import { downloadAssets } from './assets';
import { initState } from './state';
import { setLeaderboardHidden } from './leaderboard';
import './main.css';
import _ from 'lodash';
//import { tsLiteralType } from '@babel/types';

const playMenu = document.getElementById('play-menu');
const iconsMenu = document.getElementById('icons-menu');
const playButton = document.getElementById('play-button');
const gameCanvas = document.getElementById('game-canvas');
const usernameInput = document.getElementById('username-input');
const iconsInput = document.getElementById('icons');
const title = document.getElementById('title');
var connected=false;
Promise.all([
  connect(onGameOver),
  downloadAssets(),
]).then(() => {
  playMenu.classList.remove('hidden');
  iconsMenu.classList.remove('hidden');
  usernameInput.focus();
  playButton.onclick = () => {
    // Play!
    play(usernameInput.value,iconsInput.value);
    console.log("play");
    playMenu.classList.add('hidden');
    iconsMenu.classList.add('hidden');
    initState();
    if (!connected) {
      startRendering();
      gameCanvas.classList.remove('hidden');
      connected=true;
    }
    setTimeout(() => { startCapturingInput(); }, 250);
    
    setLeaderboardHidden(false);
  };
}).catch(console.error);

function onGameOver() {
  stopCapturingInput();
  playMenu.classList.remove('hidden');
  iconsMenu.classList.remove('hidden');
  //gameCanvas.classList.add('hidden');
  title.innerHTML = "In the long run we're all dead...";
  setLeaderboardHidden(true);
  
}