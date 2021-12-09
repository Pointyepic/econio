const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Bullet extends ObjectClass {
  constructor(parentID, x, y, dir) {
    super(shortid(), x, y, dir, Constants.BULLET_SPEED);
    this.parentID = parentID;
    this.dead=false;
  }

  // Returns true if the bullet should be destroyed
  update(dt) {
    super.update(dt);
    //console.log("bulletx: "+this.x);
    return this.x < 0 || this.x > Constants.MAP_SIZE || this.y < 0 || this.y > Constants.MAP_SIZE;
  }

  takeBulletDamage() {
    this.hp -= Constants.BULLET_DAMAGE;
  }
}

module.exports = Bullet;