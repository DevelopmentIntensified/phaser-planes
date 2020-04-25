socket = window.socket;
var map1 = window.map1;
var Player = window.Player;
const Phaser = window.Phaser;
var config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  parent: "phaser-example",
  scene: {
    preload: preload,
    create: create,
    update: update
  },
  roundPixels: true,
  pixelArt: true,
  clearBeforeRender: true,
  autoResize: true
};
var camrot = "none"
var bullets2 = []
const game = new Phaser.Game(config);
var map;
var login = document.getElementById("l-w-w");
function preload() {
  var oldurl = "https://cdn.glitch.com/54c959eb-da24-4da7-9fc2-460dff126d7c%2F";
  var newurl = "https://cdn.glitch.com/0f479eb6-7b9d-452a-aec9-e5ffa1959b7b%2F";
  //plane parts
  this.load.image("planeoverlay", newurl + "planeoverlay.png");
  this.load.image("planeoutline", newurl + "test5.png");
  //map https://cdn.glitch.com/0f479eb6-7b9d-452a-aec9-e5ffa1959b7b%2Fmap.png?v=1587497393742
  this.load.image("mapparts", newurl + "map3.png");
  //earned skins
  this.load.image("lava", newurl + "lava.png");
  this.load.image("water", newurl + "water.jpg");
  this.load.image("camo", newurl + "camo.jpg");
  this.load.image("playing with circles", newurl + "elipticalplayground.png");
  this.load.image("alien green", newurl + "8-1-19_c.jpg");
  //default skins
  this.load.image("red", newurl + "red.png");
  this.load.image("orange", newurl + "orange.png");
  this.load.image("yellow", newurl + "yellow.png");
  this.load.image("green", newurl + "green.png");
  this.load.image("blue", newurl + "blue.png");
  this.load.image("purple", newurl + "purple.png");
  this.load.image("white", newurl + "white.png");
  this.load.image("black", newurl + "black.png");
  this.load.image("pink", newurl + "pink.png");
  //symbols
  this.load.image("circle", oldurl + "352px-RAF_Type_A1_Roundel.svg.png");
  this.load.image("x", oldurl + "483px-German_Empire_air_force_inisgnia.svg.png");
  this.load.image("circle2", oldurl + "600px-Roundel_of_France.svg.png");
  this.load.image("star", oldurl + "600px-USAAC_Roundel_1919-1941.svg.png");
  this.load.image("circle3", oldurl + "630px-Red_star.svg.png");
  this.load.image("star2", oldurl + "Imperial_Russian_Aviation_Roundel.svg.png");
  //bullets
  this.load.image("bullet1",newurl + "bullet.png")
  //ui
  this.load.html("loginui","/html/login.html")
  this.load.html("storeui","/html/storeui.html")
  this.load.html("ingameui","/html/ingameui.html")
  //menu sounds
  this.load.audio("Into-Battle", newurl + "Into-Battle_v001.mp3");
  this.load.audio("Move-it-Out", newurl + "Move-it-Out.mp3");
  this.load.audio("Tower-Defense", newurl + "Tower-Defense.mp3");
  this.load.audio("Forward-Assault", newurl + "Forward-Assault.mp3");
  this.load.audio(
    "Ancient-Troops-Amassing",
    newurl + "Ancient-Troops-Amassing.mp3"
  );
  //fx sounds
  this.load.audio(
    "machingun",
    newurl + "Chain%20Gun%20Shooting-SoundBible.com-882681443.mp3"
  );
  this.load.audio("prop", newurl + "Prop.mp3");
  this.load.audio("explode", newurl + "Explosion8.mp3");
  //loading screen
  var progressBar = this.add.graphics();
  var progressBox = this.add.graphics();
  progressBox.fillStyle(0x222222, 0.8);
  progressBox.fillRect(
    game.config.width / 2 - 150,
    game.config.height / 2,
    320,
    50
  );
  var width = this.cameras.main.width;
  var height = this.cameras.main.height;
  var loadingText = this.make.text({
    x: width / 2,
    y: height / 2 - 50,
    text: "Loading...",
    style: {
      font: "20px monospace",
      fill: "#ffffff"
    }
  });
  loadingText.setOrigin(0.5, 0.5);
  var percentText = this.make.text({
    x: width / 2,
    y: height / 2 - 20,
    text: "0%",
    style: {
      font: "18px monospace",
      fill: "#ffffff"
    }
  });
  percentText.setOrigin(0.5, 0.5);
  var assetText = this.make.text({
    x: width / 2,
    y: height / 2 + 70,
    text: "",
    style: {
      font: "18px monospace",
      fill: "#ffffff"
    }
  });
  assetText.setOrigin(0.5, 0.5);

  this.load.on("progress", function(value) {
    console.log("loading:" + Math.round(value * 100) + "%");
    progressBar.clear();
    progressBar.fillStyle(0xffffff, 1);
    progressBar.fillRect(
      game.config.width / 2 - 150 + 10,
      game.config.height / 2 + 10,
      300 * value,
      30
    );
    percentText.setText(parseInt(value * 100) + "%");
  });

  this.load.on("fileprogress", function(file) {
    assetText.setText("Loading asset: " + file.key);
  });

  this.load.on("complete", function() {
    console.log("complete");
    loadingText.destroy();
    percentText.destroy();
    assetText.destroy();
    login.style.display = "block";
  });
  map = this.make.tilemap({
    data: map1,
    tileWidth: 180,
    tileHeight: 180
  });
}
var planeoutline, planeoverlay, planeskin;
var cursors, wasd;
var joined = true;
var usedkeys = ["a", "w", "s", "d", "e"];
var players = {};
var player;
var keysdown = {
  w: false,
  a: false,
  d: false,
  s: false,
  Space: false,
  e: false
};
var planeskin;
var init = false;
function create() {
  const tiles = map.addTilesetImage("mapparts", null, 180, 180, 10, 20);
  const layer = map.createStaticLayer(0, tiles, -7200, -7200);
  this.cameras.main.roundPixels = true;
  var self = this;
  var cam2 = this.cameras
    .add(0, 0, 200, 200)
    .setZoom(0.07)
    .setName("mini");
  cam2.roundPixels = true;
  console.log(this.cameras.getCamera("mini"))
  /*var spawns = [];
  for (var i = 0; i < map1.length; i++) {
    for (var j = 0; j < map1[i].length; j++) {
      if (map1[i][j]===6||map1[i][j]===9) {
        spawns.push({x:j*180-7200+60,y:i*180-7200+135});
        this.add.sprite(j*180-7200+60, i*180-7200+135, "lava").setScale(0.2);
      }
    }
  }
  console.log(JSON.stringify(spawns))*/
  

  cursors = this.input.keyboard.createCursorKeys();
  wasd = this.input.keyboard.addKeys("W,S,A,D");
  this.input.keyboard.on("keydown", e => {
    if (usedkeys.indexOf(e.key) !== -1 || e.code === "Space") {
      if (e.key !== " ") {
        keysdown[e.key] = true;
      } else {
        keysdown.Space = true;
      }
    }
  });
  this.input.keyboard.on("keyup", e => {
    if (usedkeys.indexOf(e.key) !== -1 || e.code === "Space") {
      if (e.key !== " ") {
        keysdown[e.key] = false;
      } else {
        keysdown.Space = false;
      }
    }
  });
  socket.on("update client player", data => {
    player.update(data);
    condole.log(player);
  });
  socket.on("init", function(data, data2) {
    console.log(data);
    player = new Player(data, self);
    console.log(player);
    player.draw(true,false);
    self.cameras.main.startFollow(player);
    cam2.startFollow(player, false, 0.5, 0.5);
    for (var i in data2) {
      if (i !== data.id) {
        let pl = new Player(data2[i], self);
        players[i] = pl;
        pl.draw();
      }
    }
    init = true;
  });
  socket.on("someone joined", function(data, id) {
    if (init && id !== player.id) {
      players[id] = new Player(data, self);
      players[id].update(data);
      players[id].draw(false,false);
      console.log(players);
    }
  });
  socket.on("disconected",function(id){
    if(init){
      players[id].plane.destroy()
      delete players[id]
    }
  })
  socket.on("update", function(data,bullets) {
    if (init) {
      bullets2.forEach(function(bullet){
        bullet.destroy()
      })
      bullets.forEach(function(bullet,i){
        let bsp = self.make.sprite({
          x: bullet.x,
          y: bullet.y,
          rotation:bullet.r,
          key: "bullet1",
          add: true
        }).setScale(1.3);
        bullets2.push(bsp)
      })
      player.update(data[player.id]);
      player.pupdate();
      if (Object.keys(players).length !== 0) {
        for (var i in data) {
          if (i !== player.id) {
            players[i].update(data[i]);
            players[i].pupdate();
          }
        }
      }
    }
  });
}
function update() {
  if (init) {
    socket.emit("movement", keysdown);
    if(camrot === "with plane"){
    this.cameras.main.rotation = -player.r;
    }
  }
}
