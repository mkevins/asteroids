(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject;
  var Vector = Asteroids.Vector;
  var Util = Asteroids.Util;
  var Bullet = Asteroids.Bullet;

  var Ship = Asteroids.Ship = function (object) {
    MovingObject.call(this, object);
    this.radius = object.radius || Ship.RADIUS;
    this.color = object.color || Ship.COLOR;
    this.livesCount = object.livesCount || Ship.LIVES_COUNT;
    this.firingRate = object.firingRate || Ship.FIRING_RATE;
    this.lastFire = 0;
    this.vel = object.vel || new Vector({x: 0, y: 0});
    this.angle = object.angle || 0;
    this.image= new Image();
    this.image.src = "./assets/ship.png";
    this.thrustImage = new Image();
    this.thrustImage.src = "./assets/ship-thrust.png";
  };

  Ship.inherits(MovingObject);

  Ship.RADIUS = 64;
  Ship.COLOR = "#0000ff";
  Ship.LIVES_COUNT = 3;
  Ship.FIRING_RATE = 10;  // bullets per second

  Ship.prototype.collideWith = function (otherObject) {
    console.log("colliding with ship")
  };

  Ship.prototype.crash = function () {
    this.livesCount--;
    if (this.livesCount > 0) {
      this.relocate();
    } else {
      this.game.over();
    }
  };


  Ship.prototype.relocate = function () {
    this.pos = this.game.randomPos();
    this.vel = new Vector({ x: 0, y: 0});
  };

  Ship.prototype.step = function (currentStep, delta) {
    if (this.isRotatingLeft) {
      this.rotate(-5 * delta);
    }
    if (this.isRotatingRight) {
      this.rotate(5 * delta);
    }
    if (this.isThrustOn) {
      this.thrust(500 * delta);
    }
    if (this.isReverseThrustOn) {
      this.thrust(-500 * delta);
    }
    if (this.isFiring && 1000 / this.firingRate < currentStep - this.lastFire) {
      this.fireBullet();
      this.lastFire = currentStep;
    }
  };

  Ship.prototype.thrust = function (magnitude) {
    var impulse = new Vector({
      magnitude: magnitude,
      angle: this.angle - Math.PI / 2
    });
    this.vel.addTo(impulse);
  };

  Ship.prototype.thrustOn = function(isThrustOn) {
    this.isThrustOn = isThrustOn;
  };

  Ship.prototype.reverseThrustOn = function(isReverseThrustOn) {
    this.isReverseThrustOn = isReverseThrustOn;
  };

  Ship.prototype.rotateLeft = function(isRotatingLeft) {
    this.isRotatingLeft = isRotatingLeft;
  };

  Ship.prototype.rotateRight = function(isRotatingRight) {
    this.isRotatingRight = isRotatingRight;
  };

  Ship.prototype.rotate = function (angle) {
    this.angle = (this.angle + angle) % (2 * Math.PI);
  };

  Ship.prototype.draw = function (context) {
    var canvasX = context.canvas.width;
    var canvasY = context.canvas.height;
    var radius = this.radius;
    for (var y = -1; y < 2; y++) {
      for (var x = -1; x < 2; x++) {
        var pos = new Vector({
          x: this.pos.x + x * canvasX,
          y: this.pos.y + y * canvasY
        });
        context.save();
        context.translate(pos.x, pos.y);
        context.rotate(this.angle);
        context.fillStyle = this.color;
        if (this.isThrustOn) {
          context.drawImage(this.thrustImage, -64, -64);
        } else {
          context.drawImage(this.image, -64, -64);
        }
        // Util.drawTriangle(context);
        context.restore();
      };
    };
  };

  Ship.prototype.firing = function (isFiring) {
    this.isFiring = isFiring;
  };

  Ship.prototype.fireBullet = function () {
    var bullet = new Bullet({
      pos: this.pos.clone(),
      vel: this.vel.add(new Vector({
        magnitude: 500,
        angle: this.angle - Math.PI / 2
      })),
      lifetime: 1
    });
    this.game.addBullet(bullet);
  };

})();
