const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Consumer extends ObjectClass {
    constructor(x, y) {
        super(shortid(), x, y, 0, 0);
        this.hp=Constants.CONSUMER_MAX_HP;
    }
    
    update(dt) {
        super.update(dt); 
    }
    takeBulletDamage() {
        this.hp -= Constants.BULLET_DAMAGE;
    }
    serializeForUpdate() {
        return {
          ...(super.serializeForUpdate()),
          hp: this.hp,
        };
    }
    
}
module.exports = Consumer;