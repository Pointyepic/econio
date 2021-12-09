const shortid = require('shortid');
const ObjectClass = require('./object');
const Constants = require('../shared/constants');

class Resource extends ObjectClass {
    constructor(x, y) {
        super(shortid(), x, y, 0, 0);
        this.orientation=0;
    }
    
    update(dt) {
        super.update(dt);
        this.orientation+=0.01;
    }
    serializeForUpdate() {
        return {
          ...(super.serializeForUpdate()),
          orientation: this.orientation,
        };
    }
    
}
module.exports = Resource;