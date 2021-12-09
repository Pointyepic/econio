const Constants = require('../shared/constants');

// Returns an array of bullets to be destroyed.
function applyCollisions(players, bullets, type, players2) {
  const destroyedBullets = [];
  for (let i = 0; i < bullets.length; i++) {
    // Look for a player (who didn't create the bullet) to collide each bullet with.
    // As soon as we find one, break out of the loop to prevent double counting a bullet.
    if (type==="player") {
      for (let j = 0; j < players.length; j++) {
        const bullet = bullets[i];
        const player = players[j];
        if (
          bullet.parentID !== player.id &&
          player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS 
          && player.dead==false
        ) {
          destroyedBullets.push(bullet);
          player.takeBulletDamage();
          if (player.hp<=0) {
            players2[bullet.parentID].onKillPlayer(player.score);
            //console.log(bullet.parentID);
          }
          break;
        }
      }
    }
    else if (type==="consumer") {
      for (let j = 0; j < players.length; j++) {
        const bullet = bullets[i];
        const player = players[j];
        if (
          player.distanceTo(bullet) <= Constants.PLAYER_RADIUS + Constants.BULLET_RADIUS 
        ) {
          destroyedBullets.push(bullet);
          player.takeBulletDamage();
          if (player.hp<=0) {
            players2[bullet.parentID].onDealtDamage();
            //console.log(bullet.parentID);
          }
          break;
        }
      }
    }
  }
  return destroyedBullets;
}
module.exports = applyCollisions;