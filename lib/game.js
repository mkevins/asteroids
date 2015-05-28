(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Util = Asteroids.Util;
  var Asteroid = Asteroids.Asteroid;
  var Vector = Asteroids.Vector;
  var Ship = Asteroids.Ship

  var Game = Asteroids.Game = function (object) {
    this.lastStep = Date.now();
    this.dimX = object.dimX || Game.DIM_X;
    this.dimY = object.dimY || Game.DIM_Y;
    this.livesCount = object.livesCount || Ship.LIVES_COUNT;
    this.asteroids = [];
    this.bullets = [];
    this.addAsteroids();
    this.ship = new Ship({
      pos: Util.randomPos(this.dimX, this.dimY),
      vel: Util.randomVec(0),
      game: this
    });
    this.relocate();
    this.image = new Image();
    this.image.src = "./assets/andromeda.jpg";
    this.isPaused = true;
  };

  Game.DIM_X = 800;
  Game.DIM_Y = 600;
  Game.LIVES_COUNT = 3;
  Game.NUM_ASTEROIDS = 10;

  Game.prototype.pause = function () {
    this.isPaused = true;
  };

  Game.prototype.unPause = function ()  {
    this.isPaused = false;
  };

  Game.prototype.loseLife = function () {
    if (--this.livesCount > 0) {
      this.relocate();
    } else {
      this.over();
    }
  };

  Game.prototype.relocate = function () {
    this.ship.vel = new Vector({ x: 0, y: 0});
    var testShip = {
      pos: this.randomPos(),
      radius: 200
    };
    while (this.asteroids.some(function (asteroid) {
      return asteroid.isCollidedWith(testShip);
    })) {
      testShip.pos = this.randomPos();
    }
    this.ship.pos = testShip.pos;
  };

  // add new asteroids to array
  Game.prototype.addAsteroids = function () {
    for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
      var asteroid = new Asteroid({
        pos: Util.randomPos(this.dimX, this.dimY),
        vel: Util.randomVec(20),
        //color: 'hsla(' + Math.random() * 360 + ', 100%, 70%, 0.6)',
        color: 'hsla(' + Math.random() * 360 + ', 100%, 50%, 1)',
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

    this.drawStats(context);
  };

  Game.prototype.drawStats = function (context) {
    // draw lives
    context.save();
    context.translate(-64, this.dimY - 64);
    context.scale(0.5, 0.5);
    for (var i = 0; i < this.livesCount - 1; i++) {
      context.translate(128, 0);
      context.drawImage(Ship.image, 0, 0);
    };
    context.restore();
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
    if (this.isPaused) {
      return;
    }
    this.currentStep = Date.now();
    var delta = (this.currentStep - this.lastStep) / 1000;
    this.ship.step(this.currentStep, delta);
    this.moveObjects(delta);
    this.checkCollisions();
    // TODO: reimplement this
    var deadBullets = [];
    this.bullets.forEach((function (bullet) {
      var age = (this.currentStep - bullet.birthTime) / 1000;
      if (age > bullet.lifetime) {
        deadBullets.push(bullet);
      }
    }).bind(this));
    deadBullets.forEach((function (deadBullet) {
      this.removeBullet(deadBullet);
    }).bind(this));
    this.lastStep = this.currentStep;
  };

  Game.prototype.over = function() {
    if (!this.isOver) {
      this.isOver = true;
      this.pause();
      $('body').prepend($('<div />', {
        class: 'modal-wrapper'
      }).html($('<div />', {
        text: "game over",
        class: 'modal'
      })));
      }
  };

  Game.prototype.removeAsteroid = function (asteroid) {
    var index = this.asteroids.indexOf(asteroid);
    this.asteroids.splice(index, 1);
  };

  Game.prototype.removeBullet = function (bullet) {
    var index = this.bullets.indexOf(bullet);
    this.bullets.splice(index, 1);
  };

  Game.prototype.randomPos = function () {
    return new Vector({
      x: Math.random() * this.dimX,
      y: Math.random() * this.dimY
    })
  };

})();
