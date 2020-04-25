var math = require("./mathFunctions");
module.exports = class Bullet {
  constructor(config) {
    this.x = config.x;
    this.y = config.y;
    this.xspeed = config.xspeed;
    this.yspeed = config.yspeed;
    this.r = config.r;
    this.size = 0.3;
    this.id = config.id;
    this.powerup = config.power;
    this.type = config.type;
    this.startx = config.x;
    this.starty = config.y;
  }
  update(data) {
    for (let i in data) {
      if (this[i] !== undefined) {
        this[i] = data[i];
      }
    }
  }
  move() {
    this.x += this.xspeed;
    this.y += this.yspeed;
  }
  checkhit(x, y) {
    if (math.dist(this.x, this.y, x, y) < 50) {
      return true;
    } else {
      return false;
    }
  }
  checkdist() {
    if (math.dist(this.x, this.y, this.startx, this.starty) > 2000) {
      return true;
    } else {
      return false;
    }
  }
  checkborders() {
    if (this.x < -7200) {
      return true;
    } else if (this.x > 7200) {
      return true;
    } else if (this.y < -7200) {
      return true;
    } else if (this.y > 7200) {
      return true;
    } else {
      return false;
    }
  }
};
