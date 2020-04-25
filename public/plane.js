window.Plane = class Plane{
  constructor(config, scene) {
    this.x = config.x, this.y = config.y
    this.w = config.w;
    this.h = config.h;
    this.skin = config.skin;
    this.r = config.r;
    this.landed = true;
    this.landing = false;
    this.size = config.size;
    this.name = config.name;
    this.namecol = config.namecol;
    this.symbol = config.symbol;
    this.scene = scene;
    this.health = config.health;
  }
  draw(me,team) {
    console.log("draw")
    //this.planecont1 = this.scene.add.container()
    this.planecont2 = this.scene.add.container(this.x,this.y)
    this.planeskin = this.scene.make.sprite({
      x: 0,
      y: 0,
      key: this.skin,
      add: true
    });
    //this.planeskin.setScale(this.size);
    /*this.planeoutline = this.scene.make.sprite({
      x: 0,
      y: 0,
      key: "planeoutline",
      add: false
    })*///.setScale(this.size);
    this.planeoutline = this.scene.add.image(0, 0, "planeoutline").setVisible(false);
    //let mask = this.planeoutline.createBitmapMask();
    this.planeoverlay = this.scene.make.sprite({
      x: 0,
      y: 0,
      key: "planeoverlay",
      add: true
    })//.setScale(this.size);
    this.symbol1 = this.scene.make.sprite({
      x: -20,
      y: -10,
      key: this.symbol,
      add: true
    });
    this.symbol1.displayWidth=15;this.symbol1.displayHeight=15;
    //this.symbol1.setOrigin(-0.4, 0.5)
    //this.symbol1.setScale(0.04)
    this.symbol2 = this.scene.make.sprite({
      x: 20,
      y: -10,
      key: this.symbol,
      add: true
    });
    this.symbol2.displayWidth=15;this.symbol2.displayHeight=15;
    //this.symbol2.setOrigin(0.4, 0.5)
    //this.symbol2.setScale(0.04)
    this.planecont2.mask = new Phaser.Display.Masks.BitmapMask(this.scene,this.planeoutline); 
    //this.planeskin.setMask(mask)
    
    this.symbol1.depth = 402
    this.symbol2.depth = 402
    this.planeskin.depth = 401;
    this.planeoverlay.depth = 402;
    this.planecont2.add(this.planeskin)
    this.planecont2.add(this.planeoverlay)
    //this.planecont1.add(this.planeoutline)
    //this.planecont1.add(this.healthbar)
    //this.planecont1.add(this.healthbarinner)
    this.planecont2.add(this.symbol1)
    this.planecont2.add(this.symbol2)
    this.planecont2.depth = 50;
    this.healthbar = this.scene.add.rectangle(this.x,this.y-50,100,10,0x000)
    this.healthbarinner = this.scene.add.rectangle(this.x,this.y-50,1*this.health,10,0x00cc00)
    this.healthbar.depth = 802;
    this.healthbarinner.depth = 803;
    //this.planecont1.add(this.planecont2)
    let col;
    console.log(me,team)
    if(me){
      this.planecont2.depth = 400
      col = 0x00cc00
    } else if(team){
      col = 0x3333ff
    } else{
      col = 0xcc0000
    }
    this.ellipse = this.scene.add.ellipse(this.x, this.y, 100, 100, col)
    this.scene.cameras.getCamera("mini").ignore(this.planecont2)
    /*
    this.scene.cameras.getCamera("mini").ignore(this.planeoverlay)
    this.scene.cameras.getCamera("mini").ignore(this.planeoutline)*/
    this.scene.cameras.getCamera("mini").ignore(this.healthbar)
    this.scene.cameras.getCamera("mini").ignore(this.healthbarinner)
    this.scene.cameras.main.ignore(this.ellipse)
    //this.scene.cameras.main.rotation = -this.r
  }
  destroy(){
    this.planecont2.destroy()
  }
  update(data) {
    for (let i in data) {
      if (this[i] !== undefined) {
        this[i] = data[i];
      }
    }
  }
  pupdate(data){
    /*this.planeskin.x = data.x;
    this.planeoutline.x = data.x;
    this.planeoverlay.x = data.x;
    this.planeoutline.y = data.y;
    this.planeoverlay.y = data.y;
    this.planeskin.y = data.y;
    this.planeoutline.rotation = data.r;
    this.planeoverlay.rotation = data.r;
    this.planeskin.rotation = data.r;
    this.planeoutline.setScale(data.size);
    this.planeoverlay.setScale(data.size);
    this.planeskin.setScale(data.size);
    this.healthbarinner.x = data.x;
    this.healthbarinner.y = data.y-50;
    
    this.symbol1.x = data.x+15;
    this.symbol1.y = data.y-10;
    this.symbol2.x = data.x-15;
    this.symbol2.y = data.y-10;
    this.symbol1.setScale(data.size/30)
    this.symbol2.setScale(data.size/30);
    this.symbol1.rotation = data.r;
    this.symbol2.rotation = data.r;*/
    this.ellipse.x = data.x;
    this.ellipse.y = data.y;
    this.planecont2.x = data.x;
    this.planecont2.y = data.y;
    this.planecont2.setScale(data.size)
    this.planeoutline.setScale(data.size)
    this.planecont2.rotation = data.r;
    this.planeoutline.x = data.x;
    this.planeoutline.y = data.y;
    this.planeoutline.rotation = data.r;
    this.healthbarinner.x = data.x;
    this.healthbarinner.y = data.y-50;
    this.healthbar.x = data.x;
    this.healthbar.y = data.y-50;
    this.healthbarinner.width = 1 * this.health;
  }
  skinchange(s) {
    this.skin = s;
    this.draw();
    console.log(this);
  }
  fire() {}
};
