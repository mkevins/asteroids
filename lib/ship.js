(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject;
  var Vector = Asteroids.Vector;
  var Util = Asteroids.Util;
  var Bullet = Asteroids.Bullet;
  var Powerup = Asteroids.Powerup;

  var Ship = Asteroids.Ship = function (object) {
    MovingObject.call(this, object);
    this.radius = object.radius || Ship.RADIUS;
    this.color = object.color || Ship.COLOR;
    this.firingRate = object.firingRate || Ship.FIRING_RATE;
    this.shootingMode = object.shootingMode || Ship.SHOOTING_MODE;
    this.bulletLifetime = object.bulletLifetime || Ship.BULLET_LIFETIME;
    this.lastFire = 0;
    this.vel = object.vel || new Vector({x: 0, y: 0});
    this.angle = object.angle || 0;
		this.sprayBirthTime = 0;
		this.shieldBirthTime = 0;
		this.rotation = 0;
  };


  Ship.inherits(MovingObject);

  Ship.RADIUS = 32;
  Ship.COLOR = "#0000ff";
  Ship.FIRING_RATE = 5;  // bullets per second
  Ship.SHOOTING_MODE = 'single';  // single, or spray
  Ship.BULLET_LIFETIME = 1; // bullet lifetime
	Ship.FLASH_DURATION = 50; // milliseconds
	Ship.ANGULAR_ACCELERATION = 200 / Math.PI; // radians / seconds^2
	
	// l, r, c, f = 1, 2, 4, 8
  Ship.image = [
		"./assets/ship/ship.png",
		"./assets/ship/ship-l.png",
		"./assets/ship/ship-r.png",
		"./assets/ship/ship-lr.png",
		"./assets/ship/ship-c.png",
		"./assets/ship/ship-lc.png",
		"./assets/ship/ship-rc.png",
		"./assets/ship/ship-lrc.png",
		"./assets/ship/ship-f.png",
		"./assets/ship/ship-lf.png",
		"./assets/ship/ship-rf.png",
		"./assets/ship/ship-lrf.png",
		"./assets/ship/ship-cf.png",
		"./assets/ship/ship-lcf.png",
		"./assets/ship/ship-rcf.png",
		"./assets/ship/ship-lrcf.png"
	].map(function (url) {
		var image = new Image()
		image.src = url;
		return image;
	});

  Ship.prototype.collideWith = function (otherObject) {
    if (otherObject instanceof Powerup) {
      this.powerup(otherObject);
      otherObject.isDead = true;
    }
    //console.log("colliding with ship")
  };

  Ship.prototype.crash = function () {
    this.game.loseLife();
  };

  Ship.prototype.powerup = function (powerup) {
    switch (powerup.type) {
      case 'extraLife':
        this.game.livesCount++;
        break;
      case 'spray':
        this.sprayBirthTime = Date.now();
        break;
      case 'rate':
        this.firingRate = Math.min(this.firingRate + 1, 50);
        break;
      case 'range':
        this.bulletLifetime = Math.min(this.bulletLifetime + 0.1, 5);
        break;
      case 'shield':
        this.shieldBirthTime = Date.now();
        break;
    }
  };

  Ship.prototype.step = function (currentStep, delta) {
		if (!(this.isRotatingLeft ^ this.isRotatingRight)) {
			this.rotation = 0;
		} else {
			if (this.isRotatingLeft) {
				this.rotation -= Ship.ANGULAR_ACCELERATION * delta;
				this.rotation = Math.max(this.rotation, -10);
			}
			if (this.isRotatingRight) {
				this.rotation += Ship.ANGULAR_ACCELERATION * delta;
				this.rotation = Math.min(this.rotation, 10);
			}
		}
		this.rotate(this.rotation * delta);
    if (this.isThrustOn) {
      this.thrust(500 * delta);
    }
    if (this.isReverseThrustOn) {
      this.thrust(-500 * delta);
    }
    if (this.isFiring && 1000 / this.firingRate < currentStep - this.lastFire) {
      this.shoot();
      this.lastFire = currentStep;
    }

    this.sprayAge = (currentStep - this.sprayBirthTime) / 1000;
    if (this.sprayAge > 10) {
      this.shootingMode = 'single';
    } else {
      this.shootingMode = 'spray';
    }

    this.shieldAge = (currentStep - this.shieldBirthTime) / 1000;
    if (this.shieldAge > 5) {
      this.isShielded = false;
      this.radius = 32;
    } else {
      this.isShielded = true;
      this.radius = 100;
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

	Ship.prototype.getShipImage = function () {
		var flash = Date.now() < this.lastFire + Ship.FLASH_DURATION;
		var bits = this.isRotatingRight
			| this.isRotatingLeft << 1
			| this.isThrustOn << 2
			| flash << 3;
		return Ship.image[bits];
	};

  Ship.prototype.draw = function (context) {
    context.save();
    context.translate(this.pos.x, this.pos.y);
    this.drawMeters(context);
    context.rotate(this.angle);
    context.fillStyle = this.color;
		context.drawImage(this.getShipImage(), -64, -64);
    context.restore();
  };

  Ship.prototype.drawMeters = function (context) {
    if (this.isShielded) {
      var gradient = context.createRadialGradient(0, 0, 100, 0, 0, 80 + this.shieldAge * 4);
      gradient.addColorStop(0,'transparent');
      gradient.addColorStop(0.7,'hsla(120,100%,50%,0.7)');
      gradient.addColorStop(1,'transparent');
      context.fillStyle = gradient;
      context.fillRect(-100,-100,200,200);
    }

    var length;
    context.lineWidth = '5';
    context.lineCap = 'round';
    if (this.sprayAge < 10) {
      context.strokeStyle = '#ff0';
      length = 1 - this.sprayAge / 10;
      drawMeter(context, -64, 64, 128 * length);
    }
    context.strokeStyle = '#0ff';
    length = (this.firingRate - Ship.FIRING_RATE) / (50 - Ship.FIRING_RATE);
    drawMeter(context, -64, 69, 128 * length);
    context.strokeStyle = '#f0f';
    length = (this.bulletLifetime - Ship.BULLET_LIFETIME) / (5 - Ship.BULLET_LIFETIME);
    drawMeter(context, -64, 74, 128 * length);
  };

  function drawMeter(context, x, y, length) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + length, y);
    context.stroke();
  }

  Ship.prototype.firing = function (isFiring) {
    this.isFiring = isFiring;
  };

  Ship.prototype.fireBullet = function (angle, lifetime) {
    new Bullet({
      pos: this.pos.clone(),
      vel: this.vel.add(new Vector({
        magnitude: 500,
        angle: this.angle + angle - Math.PI / 2
      })),
      lifetime: lifetime
    });
  };

  Ship.prototype.shoot = function () {
    switch (this.shootingMode) {
      case 'single':
        this.fireBullet(0, this.bulletLifetime);
        break;
      case 'spray':
        var angle;
        for (var i = 0; i < 5; i++) {
          angle = (i - 2) / Math.PI;
          this.fireBullet(angle, this.bulletLifetime);
        };
        break;
      default:
        break;
    }
  };

})();
