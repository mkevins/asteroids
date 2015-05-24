(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Util = Asteroids.Util;
  var Asteroid = Asteroids.Asteroid;
  var Vector = Asteroids.Vector;
  var Ship = Asteroids.Ship

  var Game = Asteroids.Game = function (dimX, dimY) {
    this.lastStep = Date.now();
    this.dimX = dimX || Game.DIM_X;
    this.dimY = dimY || Game.DIM_Y;
    this.asteroids = [];
    this.bullets = [];
    this.addAsteroids();
    this.ship = new Ship({
      pos: Util.randomPos(this.dimX, this.dimY),
      vel: Util.randomVec(0),
      game: this
    });
    this.image = new Image();
    this.image.src = "./assets/andromeda.jpg";
  };

  // add new asteroids to array
  Game.prototype.addAsteroids = function () {
    for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
      var asteroid = new Asteroid({
        pos: Util.randomPos(this.dimX, this.dimY),
        vel: Util.randomVec(20),
        color: 'hsla(' + Math.random() * 360 + ', 100%, 70%, 0.6)',
        game: this
      });
      this.asteroids.push(asteroid);
    };
  };

  Game.prototype.addBullet = function (bullet) {
    this.bullets.push(bullet);
  };

  Game.prototype.allObjects = function () {
    return this.asteroids.concat(this.bullets, [this.ship]);
  };

  Game.prototype.draw = function (context) {
    //context.drawImage(this.image, 0, 0);
    context.clearRect(0, 0, this.dimX, this.dimY);

    this.allObjects().forEach(function (object) {
      object.draw(context);
    });
  };

  Game.prototype.moveObjects = function (delta) {
    this.allObjects().forEach((function (object) {
      object.move(delta);
      object.pos.wrap(this.dimX, this.dimY);
    }).bind(this));
  };

  Game.prototype.checkCollisions = function () {
    var collisions = [];
    for (var i = 0; i < this.allObjects().length - 1; i++) {
      for (var j = i + 1; j < this.allObjects().length; j++) {
        if (this.allObjects()[i].isCollidedWith(this.allObjects()[j])) {
          collisions.push([this.allObjects()[i],this.allObjects()[j]]);
        }
      };
    };
    collisions.forEach(function (collision) {
      collision[0].collideWith(collision[1]);
    });
  };
  Game.prototype.step = function () {
    this.currentStep = Date.now();
    var delta = (this.currentStep - this.lastStep) / 1000;
    this.moveObjects(delta);
    this.checkCollisions();
    this.lastStep = this.currentStep;
  };

  Game.prototype.over = function() {
    console.log("game over");
  };

  Game.prototype.removeAsteroid = function (asteroid) {
    var index = this.asteroids.indexOf(asteroid);
    this.asteroids.splice(index, 1);
  };

  Game.prototype.removeBullet = function (bullet) {
    var index = this.asteroids.indexOf(bullet);
    this.bullets.splice(index, 1);
  };

  Game.prototype.randomPos = function () {
    return new Vector({
      x: Math.random() * Game.DIM_X,
      y: Math.random() * Game.DIM_Y
    })
  };

  Game.DIM_X = 800;
  Game.DIM_Y = 600;
  Game.NUM_ASTEROIDS = 10;

})();
