var spawns = [
  { x: 2760, y: -6525 },
  { x: 3300, y: -6345 },
  { x: 3660, y: -6345 },
  { x: 1140, y: -5625 },
  { x: 240, y: -5445 },
  { x: -7140, y: -5085 },
  { x: 1320, y: -5085 },
  { x: -6420, y: -3645 },
  { x: 1320, y: -3285 },
  { x: 2580, y: -1485 },
  { x: -4260, y: 315 },
  { x: -6600, y: 1215 },
  { x: -5340, y: 1935 },
  { x: -3000, y: 2655 },
  { x: -2640, y: 3195 },
  { x: -4980, y: 3375 },
  { x: -5700, y: 4995 },
  { x: -5160, y: 5355 },
  { x: -2100, y: 6075 },
  { x: -1920, y: 6255 },
  { x: -4260, y: 6795 },
  { x: 5280, y: 6975 },
  { x: 5460, y: 6975 },
  { x: 5460, y: 7155 }
];
var spawnids = [
  { x: 55, y: 3 },
  { x: 58, y: 4 },
  { x: 60, y: 4 },
  { x: 46, y: 8 },
  { x: 41, y: 9 },
  { x: 0, y: 11 },
  { x: 47, y: 11 },
  { x: 4, y: 19 },
  { x: 47, y: 21 },
  { x: 54, y: 31 },
  { x: 16, y: 41 },
  { x: 3, y: 46 },
  { x: 10, y: 50 },
  { x: 23, y: 54 },
  { x: 25, y: 57 },
  { x: 12, y: 58 },
  { x: 8, y: 67 },
  { x: 11, y: 69 },
  { x: 28, y: 73 },
  { x: 29, y: 74 },
  { x: 16, y: 77 },
  { x: 69, y: 78 },
  { x: 70, y: 78 },
  { x: 70, y: 79 }
];
var math = require("./mathFunctions");
var db = require("./database");
var randomstring = require("randomstring");
var namecolors = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "purple",
  "black",
  "white",
  "pink"
];
var symbols = ["circle", "x", "circle2", "star", "circle3", "star2"];
var rewards2 = [
  {
    name: "water",
    rxp: 200
  },
  {
    name: "pc",
    rxp: 400
  },
  {
    name: "lava",
    rxp: 900
  },
  {
    name: "alien green",
    rxp: 800
  },
  {
    name: "camo",
    rxp: 1000
  },
  {
    name: "playing with circles",
    rxp: 600
  }
];
rewards2.sort(function(a, b) {
  return a.rxp - b.rxp;
});
function checkr(u) {
  let used = false;
  let xp = 0;
  let query = db.usersref
    .where("userName", "==", u)
    .get()
    .then(users => {
      users.forEach(user => {
        used = true;
        xp = user.data().lvl;
      });
      if (used) {
        for (var i = 0; i < rewards2.length; i++) {
          if (xp >= rewards2[i].rxp) {
            db.update(u, {
              friends: db.FV.arrayUnion(rewards2[i].name)
            });
          }
        }
      }
    });
}
module.exports = class Player {
  constructor(config) {
    var rstring = randomstring.generate(5);
    var col = namecolors[math.getRandomInt(0, namecolors.length - 1)];
    var spanrand = spawns[math.getRandomInt(0, spawns.length - 1) /*0*/];
    var randsim = symbols[math.getRandomInt(0, symbols.length - 1)];
    this.x = spanrand.x;
    this.y = spanrand.y;
    this.w = 50;
    this.h = 50;
    this.xspeed = 0;
    this.yspeed = 0;
    this.rotspeed = 0.7;
    this.skin = col;
    if (Math.abs(-7200 - spanrand.y) < 7200) {
      this.r = math.d2r(180);
      this.y = spanrand.y - 120;
    } else {
      this.r = 0;
    }
    this.landed = true;
    this.landing = false;
    this.size = 0.3;
    this.name = "guest" + rstring;
    this.namecol = col;
    this.symbol = randsim;
    this.shootable = true;
    this.bullets = 30;
    this.id = config.id;
    this.kills = 0;
    this.deaths = 0;
    this.powerup = "none";
    this.health = 100;
    this.speed = 0.5;
    this.hidden = true;
    this.shape = "normal";
    this.ownedshapes = ["normal"];
    this.keys = {
      w: false,
      a: false,
      d: false,
      s: false,
      Space: false,
      e: false
    };
    this.ownedskins = namecolors;
    this.xp = 0;
    this.guest = true;
    this.firerate = 0.4;
  }
  update(data) {
    for (let i in data) {
      if (this[i] !== undefined) {
        this[i] = data[i];
      }
    }
  }
  move() {
    if (!this.landing && !this.hidden /*&&this.keys.w*/) {
      this.xspeed +=
        Math.cos(this.r - math.d2r(180) + Math.PI / 2) * this.speed;
      this.yspeed +=
        Math.sin(this.r - math.d2r(180) + Math.PI / 2) * this.speed;
      this.x += this.xspeed;
      this.y += this.yspeed;
      this.xspeed *= 0.95;
      this.yspeed *= 0.95;
    }
    if (!this.landed && !this.landing && this.size > 0.5) {
      if (this.keys.a) {
        this.r -= math.d2r(this.rotspeed);
      }
      if (this.keys.d) {
        this.r += math.d2r(this.rotspeed);
      }
    }
    if (this.size < 1 && !this.landing && !this.hidden) {
      this.size += 0.007;
    }
    if (this.keys.e && !this.landed) {
      let closest = { d: 10000, i: 0 };
      for (var i = 0; i < spawns.length; i++) {
        let d = math.dist(this.x, this.y, spawns[i].x, spawns[i].y);
        if (d < closest.d) {
          closest.d = d;
          closest.i = i;
        }
      }
      if (closest.d < 150) {
        this.landing = true;
        this.land(closest.i);
      }
    }
    if (this.landing && !this.keys.e && !this.landed) {
      let closest = { d: 10000, i: 0 };
      for (var i = 0; i < spawns.length; i++) {
        let d = math.dist(this.x, this.y, spawns[i].x, spawns[i].y);
        if (d < closest.d) {
          closest.d = d;
          closest.i = i;
        }
      }
      if (closest.d < 150) {
        this.landing = true;
        this.land(closest.i);
      }
    }
    if (this.size > 0.7) {
      this.landed = false;
    }
    if (this.size > 1) {
      this.size = 1;
    }
  }
  land(id) {
    let tget = spawns[id];
    if (!this.landed) {
      if (Math.abs(-7200 - tget.y) < 7200) {
        this.y = math.lerp(this.y, tget.y - 120, 0.02);
        this.r = math.lerp(this.r, math.d2r(180), 0.08);
      } else {
        this.y = math.lerp(this.y, tget.y, 0.02);
        this.r = math.lerp(this.r, 0, 0.08);
      }
      this.x = math.lerp(this.x, tget.x, 0.02);
      if (this.size >= 0.3) {
        this.size -= 0.02;
      }
      this.shootable = false;
    } else if (!this.landing) {
      this.shootable = true;
    }
    if (Math.round(this.x) === tget.x && this.size < 0.35) {
      if (Math.round(this.y) === tget.y && Math.round(this.r) === 0) {
        console.log("landed");
        this.landing = false;
        this.landed = true;
        this.size = 0.3;
        this.x = tget.x;
        this.y = tget.y;
        this.xspeed = 0;
        this.yspeed = 0;
        this.bullets = 30;
        this.health = 100;
        this.shootable = true;
      }
      if (
        Math.round(this.y) === tget.y - 120 &&
        Math.round(this.r) === Math.round(math.d2r(180))
      ) {
        console.log("landed");
        this.landing = false;
        this.landed = true;
        this.size = 0.3;
        this.x = tget.x;
        this.y = tget.y;
        this.xspeed = 0;
        this.yspeed = 0;
        this.bullets = 30;
        this.health = 100;
        this.shootable = true;
      }
    }
  }
  died() {
    this.deaths++;
    if (!this.guest) {
      db.update(this.name, {
        deaths: db.FV.increment(1)
      });
    }
  }
  killed() {
    this.kills++;
    this.xp += 10;
    if (!this.guest) {
      db.update(this.name, {
        kills: db.FV.increment(1),
        xp: db.FV.increment(10)
      });
      checkr(this.xp);
    }
  }
  login(u, ownedskins, shapes, xp) {
    this.name = u;
    this.ownedskins = this.ownedskins.concat(ownedskins);
    this.ownedshapes = this.ownedshapes.concat(shapes);
    this.xp = xp;
    this.guest = false;
    this.hidden = false;
  }
  join() {
    if (this.guest) {
    } else {
    }
  }
  shoot() {
    this.bullets--;
    if (this.bullets <= 0) {
      this.shootable = false;
    } else {
      this.shootable = true;
    }
    console.log(this.shootable, this.bullets);
    /*if (this.shootable) {
      this.shootable = false;
      setTimeout(function() {
        this.shootable = true;
      }, 1000 * this.firerate);
    }*/
  }
  joingame() {
    this.hidden = false;
  }
  respawn() {
    var spanrand = math.getRandomInt(0, spawns.length - 1);
    this.x = spanrand.x;
    this.y = spanrand.y;
    this.bullets = 30;
    this.health = 100;
    this.shootable = false;
    this.size = 0.3;
    this.landed = true;
    this.hidden = false;
  }
  checkdeath() {
    if (this.health <= 0) {
      return true;
    } else {
      return false;
    }
  }
  checkborders() {
    if (this.x < -7200) {
      this.update({
        r: math.d2r(90),
        x: -7150,
        health: this.health - 10
      });
    }
    if (this.x > 7200) {
      this.update({
        r: math.d2r(270),
        x: 7150,
        health: this.health - 10
      });
    }
    if (this.y < -7200) {
      this.update({
        r: math.d2r(180),
        y: -7150,
        health: this.health - 10
      });
    }
    if (this.y > 7200) {
      this.update({
        r: math.d2r(0),
        y: 7150,
        health: this.health - 10
      });
    }
  }
};
