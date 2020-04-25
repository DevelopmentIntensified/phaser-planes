var Plane = window.Plane
window.Player = class Player {
  constructor(config,scene){
    this.x = config.x;
    this.y = config.y;
    this.w = config.w;
    this.h = config.h;
    this.skin = config.skin;
    this.r = config.r;
    this.landed = config.landed;
    this.landing = config.landing;
    this.size = config.size;
    this.name = config.name;
    this.namecol = config.namecol;
    this.symbol = config.symbol;
    this.scene = scene;
    this.abletoshoot = false;
    this.bullets = config.bullets;
    this.id = config.id;
    this.kills = config.kills;
    this.deaths = config.deaths;
    this.powerups = config.powerups;
    this.health = config.health;
    this.shape = "normal";
    this.ownedshapes = ["normal"];
    this.ownedskins = config.ownedskins;
    this.xp = 0;
    this.guest = config.guest;
    this.plane = new Plane(this,scene)
    this.rotspeed = config.rotspeed;
  }
  draw(m,t){
    this.plane.update(this)
    this.plane.draw(m,t)
    //this.scene.add.existing(this.plane);
  }
  pupdate(){
    this.plane.update(this)
    this.plane.pupdate(this)
  }
  update(data){
    for(let i in data){
      if(this[i]!==undefined){
        this[i]=data[i]
      }
    }
  }
}