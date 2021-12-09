const ObjectClass = require('./object');
const Bullet = require('./bullet');
const Constants = require('../shared/constants');


class Player extends ObjectClass {
  constructor(id, username, icontype, x, y, ori) {
    super(id, x, y, 0, 0);
    this.username = username;
    this.icontype = icontype;
    this.orientation = ori;
    this.hp = Constants.PLAYER_MAX_HP;
    this.fireCooldown = 0;
    this.score = Constants.PLAYER_MAX_HP;
    this.dead=false;
  }

  // Returns a newly created bullet, or null.
  update(dt) {
    super.update(dt);
    if (this.hp<this.score) this.hp+=(0.07*Math.pow(this.score,0.85)/300);
    // Update score
    //this.score += dt * Constants.SCORE_PER_SECOND;
    // Make sure the player stays in bounds
    this.x = Math.max(Constants.PLAYER_RADIUS, 
      Math.min(Constants.MAP_SIZE-Constants.PLAYER_RADIUS, this.x));
    this.y = Math.max(Constants.PLAYER_RADIUS, 
      Math.min(Constants.MAP_SIZE-Constants.PLAYER_RADIUS, this.y));
  }
  //the way player is looking
  setOrientation(ori) {
      this.orientation = ori;
  }  

  shoot(dir) { 
    //Fire a bullet, if needed
    //this.fireCooldown -= dt;
    //if (this.fireCooldown <= 0) {
      //this.fireCooldown += Constants.PLAYER_FIRE_COOLDOWN;
    return new Bullet(this.id, this.x, this.y, dir);
  }
  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }

  onDealtDamage() {
    this.score += Constants.SCORE_BULLET_HIT;
    this.hp += (Constants.SCORE_BULLET_HIT)/2;
  }
  onKillPlayer(score) {
    this.score += score;
    this.hp += score/2;
  }
  serializeForUpdate() {
    return {
      ...(super.serializeForUpdate()),
      direction: this.direction,
      orientation: this.orientation,
      hp: this.hp,
      score: this.score,
      dead: this.dead,
      username: this.username,
      icontype: this.icontype,
    };
  }
}

module.exports = Player;