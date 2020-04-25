var express = require("express"); // Express contains some boilerplate to for routing and such
var app = express();
var http = require("http").Server(app);
var io = require("socket.io")(http); // Here's where we include socket.io as a node module
var Player = require("./Player");
var Bullet = require("./bullet");
var db = require("./database");
var math = require("./mathFunctions");
app.use(express.static("public"));
var players = {};
var bullets = [];
var replay = [];
// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function(request, response) {
  response.sendFile(__dirname + "/views/index.html");
});
io.on("connection", function(socket) {
  console.log("a user connected");
  var p = new Player({ id: socket.id });
  players[socket.id] = p;
  socket.broadcast.emit("someone joined", p, socket.id);
  socket.on("register", function(data) {});
  socket.on("login attempt", function(data) {
    console.log("login attempt" + JSON.stringify(data));
    let match = false;
    let ownedskins, ownedshapes, xp;
    let query = db.usersref
      .where("userName", "==", data.user)
      .get()
      .then(users => {
        if (users.empty) {
          console.log("No matching documents.");
          socket.emit("login failed");
          return;
        }
        users.forEach(user => {
          //console.log(user.data().userName)
          if (user.data().password === data.pass) {
            match = true;
            xp = user.data().xp;
            ownedshapes = user.data().ownedshapes;
            ownedskins = user.data().ownedskins;
          }
        });
        if (match) {
          db.update(data.user, {
            visitNum: db.FV.increment(1),
            lastLogin: new Date().toISOString(),
            online: true
          });
          //push(payload, "",webPush)
          players[socket.id].login(data.user, ownedskins, ownedshapes, xp);
          //console.log(players[socket.id])
          socket.emit("logged in", data.user);
          socket.emit("init", players[socket.id], players);
        } else {
          socket.emit("login failed");
        }
      });
  });
  socket.on("get skins", function(p) {});
  socket.on("update player", data => {});
  socket.on("guest", function(data) {
    players[socket.id].joingame();
  });
  socket.on("join game", function(u, uc, c, s, tf) {});
  socket.on("movement", function(keys) {
    players[socket.id].update({ keys: keys });
    //console.log(keys)
  });
  socket.on("disconnect", function() {
    delete players[socket.id];
    io.emit("disconected",socket.id)
  });
});
function serverGameLoop() {
  bullets.forEach(function(bullet, i) {
    if(bullet.checkborders()){
      bullets.splice(i, 1);
    }
    bullet.move();
    for (var i in players) {
      if (bullet.powerup === "keep going") {
        if (bullet.checkhit(players[i].x, players[i].y)&&bullet.id!==players[i].id) {
          players[i].health -= 10;
        }
      } else {
        if (bullet.checkhit(players[i].x, players[i].y)&&bullet.id!==players[i].id) {
          players[i].health -= 10;
          bullets.splice(i, 1);
        }
      }
    }
    if (bullet.checkdist()) {
      bullets.splice(i, 1);
    }
  });
  for (var i in players) {
    let p = players[i]
    p.checkborders()
    if(p.checkdeath()){
      console.log("player "+p.name+" died")
    }
    p.move();
    if (p.keys.Space && p.shootable) {
      let b = new Bullet({
        id: i,
        x: p.x,
        y: p.y,
        r: p.r,
        xspeed: Math.cos(p.r - math.d2r(180) + Math.PI / 2) * 50,
        yspeed: Math.sin(p.r - math.d2r(180) + Math.PI / 2) * 50
      });
      bullets.push(b);
      p.shootable = false;
      setTimeout(function() {
        p.shoot();
      }, p.firerate * 1000);
    }
  }
  io.emit("update", players, bullets);
}
setInterval(serverGameLoop, 15);
// listen for requests :)
app.set("port", process.env.PORT || 5000);
http.listen(app.get("port"), function() {
  console.log("listening on port", app.get("port"));
});