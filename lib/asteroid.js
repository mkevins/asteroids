(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject;
  var Ship = Asteroids.Ship;
  var Bullet = Asteroids.Bullet;
  var Vector = Asteroids.Vector;
  var Debris = Asteroids.Debris;
  var Powerup = Asteroids.Powerup;

  var Asteroid = Asteroids.Asteroid = function (object) {
    MovingObject.call(this, object);
    this.hue = object.hue || Math.random() * 360;
    this.radius = object.radius || Asteroid.RADIUS;
    this.health = object.health || Asteroid.HEALTH;
    this.generatePoints();
    Asteroid.instances.push(this);
  };

  Asteroid.instances = [];
  Asteroid.inherits(MovingObject);

  Asteroid.reaper = function () {
    Asteroid.instances = Asteroid.instances.filter(function (instance) {
      return (!instance.isDead);
    });
  };

  Asteroid.RADIUS = 100;
  Asteroid.HEALTH = 5;

  Asteroid.prototype.collideWith = function (otherObject) {
    if (this.isCollidedWith(otherObject)) {
      if (otherObject instanceof Ship) {
        otherObject.crash();
      } else if (otherObject instanceof Bullet) {
        this.takeDamage();
        otherObject.isDead = true;
      }
    }
  };

  Asteroid.prototype.takeDamage = function () {
    this.game.score += 20;
    if (--this.health <= 0) {
      this.generateDebris();
      this.isDead = true;
      this.game.score += 100;
    }
  };

  Asteroid.prototype.draw = function (context) {
    var canvasX = context.canvas.width;
    var canvasY = context.canvas.height;
    var h = this.hue;
    var l = 10 * this.health;
    for (var y = -1; y < 2; y++) {
      for (var x = -1; x < 2; x++) {
        var pos = new Vector({
              x: this.pos.x + x * canvasX,
              y: this.pos.y + y * canvasY
            });
        context.save();
        context.translate(pos.x, pos.y);
        context.fillStyle = 'hsla(' + h + ', 100%, ' + l + '%, 1)',
        this.drawPolygon(context);
        context.restore();
      };
    };
  };

  Asteroid.prototype.drawPolygon = function (context) {
    var point = this.points[0];
    context.beginPath();
    context.moveTo(point.x, point.y);
    for (var i = 0; i < this.points.length; i++) {
      point = this.points[i];
      context.lineTo(point.x, point.y);
    };
    point = this.points[0];
    context.lineTo(point.x, point.y);
    context.fill();
    var h = 120 - 20 * this.health;
    context.strokeStyle = "hsla(0, 0%, " + h + "%, 1)";
    context.lineWidth = 3;
    context.stroke();
  };

  // TODO: rename this method
  Asteroid.prototype.generatePoints = function () {
    this.points = [];
    var pointCount = 7 + Math.round(Math.random() * 5);
    var pointAngle = 2 * Math.PI / pointCount;
    var offsetRadius, offsetAngle;
    for (var i = 0; i < pointCount; i++) {
      offsetRadius = this.radius * (0.6 + 0.6 * Math.random());
      offsetAngle = (i + Math.random() - 0.5) * pointAngle;
      this.points.push(new Vector({
        x: offsetRadius * Math.cos(offsetAngle),
        y: offsetRadius * Math.sin(offsetAngle)
      }));
    };
  };

  function createDebrisPiece(point1, point2) {
    var offset = point1.add(point2).scaleTo(0.5);
    new Debris({
      pos: this.pos.add(offset),
      vel: this.vel.add(offset.scale(2)),
      halfLength: point1.distanceTo(point2) / 2,
      angle: point1.angleTo(point2),
      game: this.game
    });
  }

  Asteroid.prototype.generateDebris = function () {
    for (var i = 0; i < this.points.length - 1; i++) {
      createDebrisPiece.bind(this)(this.points[i], this.points[i + 1]);
    };
    createDebrisPiece.bind(this)(this.points[this.points.length - 1], this.points[0]);

    var random = Math.random();
    if (random < 0.2) {
      new Powerup({
        pos: this.pos,
        vel: this.vel
      });
    }
  };

})();
