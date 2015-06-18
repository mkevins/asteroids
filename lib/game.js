(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Util = Asteroids.Util;
  var Asteroid = Asteroids.Asteroid;
  var Vector = Asteroids.Vector;
  var Ship = Asteroids.Ship;

  var Game = Asteroids.Game = function (object) {
    this.lastStep = Date.now();

    this.dimX = object.dimX || Game.DIM_X;
    this.dimY = object.dimY || Game.DIM_Y;
    Vector.setDimensions(this.dimX, this.dimY);

    this.livesCount = object.livesCount || Ship.LIVES_COUNT;
    this.start();
    this.image = new Image();
    this.image.src = "./assets/andromeda.jpg";
    this.isPaused = true;
    this.fps = 0;
  };

  Game.DIM_X = 800;
  Game.DIM_Y = 600;
  Game.LIVES_COUNT = 3;
  Game.NUM_ASTEROIDS = 10;

  // TODO: refactor this. livesCount should be stored
  Game.prototype.start = function () {
    this.isOver = false;
    this.level = 1;
    this.livesCount = 3;
    this.score = 0;
    this.bullets = [];
    this.asteroids = [];
    this.debris = [];
    this.ship = new Ship({game: this});
    this.addAsteroids();
    this.relocate();
  };

  Game.prototype.mouse = function (x, y) {
    this.ship.angle = this.ship.pos.angleTo(new Vector({x: x, y: y})) - Math.PI / 2;
  };

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
      pos: Vector.random(),
      radius: 200
    };
    var tries = 0;
    while (this.asteroids.some(function (asteroid) {
      return asteroid.isCollidedWith(testShip);
    })) {
      testShip.pos = Vector.random();
      tries++;
      if (tries > 1000) { // hacky failsafe TODO: reimplement this
        break;
      }
    }
    this.ship.pos = testShip.pos;
  };

  // add new asteroids to array
  Game.prototype.addAsteroids = function (count) {
    count = typeof count !== 'undefined' ? count : Game.NUM_ASTEROIDS;
    for (var i = 0; i < count; i++) {
      this.generateAsteroid();
    };
  };

  Game.prototype.generateAsteroid = function () {
    var testAsteroid = {
      pos: Vector.random(),
      vel: Vector.random(10 * this.level),
      radius: 236,
      game: this
    };
    while (this.ship.isCollidedWith(testAsteroid)) {
      testAsteroid.pos = Vector.random();
    }
    delete testAsteroid.radius;
    this.asteroids.push(new Asteroid(testAsteroid));
  };

  Game.prototype.addBullet = function (bullet) {
    this.bullets.push(bullet);
  };

  Game.prototype.addDebrisPiece = function (debrisPiece) {
    this.debris.push(debrisPiece);
  };

  Game.prototype.allObjects = function () {
    return this.asteroids.concat(this.bullets, this.debris, [this.ship]);
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
    // draw fps
    var fps = "FPS: " + this.fps.toFixed(1);
    context.save();
    context.font = '24px sans';
    context.fillStyle = 'black';
    context.fillRect(0, 0, context.measureText(fps).width, 24);
    context.fillStyle = 'red';
    context.textBaseline = 'top';
    context.fillText(fps, 0, 0);
    context.restore();

    // draw level and score
    var score = "Level: " + this.level + "  Score: " + this.score.toLocaleString();
    context.save();
    context.font = '48px monospace';
    context.fillStyle = 'black';
    var scoreWidth = context.measureText(score).width;
    context.fillRect(this.dimX - scoreWidth, 0, scoreWidth, 48);
    context.fillStyle = '#0f0';
    context.textBaseline = 'top';
    context.textAlign = 'right';
    context.fillText(score, this.dimX, 0);
    context.restore();

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
      object.pos.wrap();
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
    this.fps = 0.95 * this.fps + 0.05 / delta;
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
    var deadDebris = [];
    this.debris.forEach((function (debrisPiece) {
      var age = (this.currentStep - debrisPiece.birthTime) / 1000;
      if (age > debrisPiece.lifetime) {
        deadDebris.push(debrisPiece);
      }
    }).bind(this));
    deadDebris.forEach((function (deadDebrisPiece) {
      this.removeDebrisPiece(deadDebrisPiece);
    }).bind(this));

    this.repopulate(delta);
    this.lastStep = this.currentStep;
  };

  Game.prototype.repopulate = function (delta) {
    var count = this.asteroids.length;
    //console.log(count);
    if (count <= 0) {
      this.level++;
      this.addAsteroids();
    } else {
      var lambda = delta * Math.max(0, 10 - count) / 10;
      this.addAsteroids(Util.getPoisson(lambda));
    }
  };

  Game.prototype.over = function() {
    this.isOver = true;
    this.pause();
  };

  Game.prototype.removeAsteroid = function (asteroid) {
    var index = this.asteroids.indexOf(asteroid);
    this.asteroids.splice(index, 1);
  };

  Game.prototype.removeBullet = function (bullet) {
    var index = this.bullets.indexOf(bullet);
    this.bullets.splice(index, 1);
  };

  Game.prototype.removeDebrisPiece = function (debrisPiece) {
    var index = this.debris.indexOf(debrisPiece);
    this.debris.splice(index, 1);
  };

})();
