(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Util = Asteroids.Util;
  var MovingObject = Asteroids.MovingObject;
  var Asteroid = Asteroids.Asteroid;
  var Bullet = Asteroids.Bullet;
  var Debris = Asteroids.Debris;
  var Powerup = Asteroids.Powerup;
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
    MovingObject.instances.forEach(function (object) {
      object.isDead = true;
    });
    this.reapers();
    this.isOver = false;
    this.level = 1;
    this.livesCount = 3;
    this.score = 0;
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
    while (Asteroid.instances.some(function (asteroid) {
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
    new Asteroid(testAsteroid);
  };

  Game.prototype.draw = function (context) {
    //context.drawImage(this.image, 0, 0);
    context.clearRect(0, 0, this.dimX, this.dimY);

    MovingObject.instances.forEach((function (object) {
      for (var y = -1; y < 2; y++) {
        for (var x = -1; x < 2; x++) {
          context.save();
          context.translate(x * this.dimX, y * this.dimY);
          object.draw(context);
          context.restore();
        };
      };
    }).bind(this));

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
    MovingObject.instances.forEach((function (object) {
      object.move(delta);
      object.pos.wrap();
    }).bind(this));
  };

  Game.prototype.checkCollisions = function () {
    var objects = MovingObject.instances;
    var collisions = [];
    for (var i = 0; i < objects.length - 1; i++) {
      for (var j = i + 1; j < objects.length; j++) {
        if (objects[i].isCollidedWith(objects[j])) {
          collisions.push([objects[i],objects[j]]);
        }
      };
    };
    collisions.forEach(function (collision) {
      collision[0].collideWith(collision[1]);
      collision[1].collideWith(collision[0]);
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

    /* TODO: reimplement this

       in fact.. entire collision system needs refactoring
       all moving objects should be efficiently checked for collision
       collisions should be marked (added to a list)

     */

    var agingObjects = Bullet.instances.concat(Debris.instances, Powerup.instances);

    agingObjects.forEach((function (object) {
      var age = (this.currentStep - object.birthTime) / 1000;
      if (age > object.lifetime) {object.isDead = true;}
    }).bind(this));

    this.reapers();

    this.repopulate(delta);
    this.lastStep = this.currentStep;
  };

  Game.prototype.reapers = function () {
    MovingObject.reaper();
    Asteroid.reaper();
    Bullet.reaper();
    Debris.reaper();
    Powerup.reaper();
  };

  Game.prototype.repopulate = function (delta) {
    var count = Asteroid.instances.length;
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

})();
