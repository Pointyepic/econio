class Object {
    constructor(id, x, y, dir, speed) {
      this.id = id;
      this.x = x;
      this.y = y;
      this.direction = dir;
      this.speed = speed;
    }
  
    update(dt) {
      //console.log("dir:" + this.direction);
      //console.log("spd: " + this.speed);
      this.x += dt * this.speed * Math.cos(this.direction);
      this.y -= dt * this.speed * Math.sin(this.direction);
      //console.log("updated:" + this.x);
    }
  
    distanceTo(object) {
      const dx = this.x - object.x;
      const dy = this.y - object.y;
      return Math.sqrt(dx * dx + dy * dy);
    }
  
    setDirection(dir) {
      this.direction = dir;
    }
    
    setSpeed(spd) {
      this.speed=spd;
    }

    serializeForUpdate() {
      return {
        id: this.id,
        x: this.x,
        y: this.y,
      };
    }
  }

module.exports = Object;