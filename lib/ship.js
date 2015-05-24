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
    this.vel = object.vel || new Vector({x: 0, y: 0});
    this.angle = object.angle || 0;
    this.image = new Image();
    this.image.src = "./assets/ship.png";
  };

  Ship.inherits(MovingObject);

  Ship.RADIUS = 20;
  Ship.COLOR = "#0000ff";
  Ship.LIVES_COUNT = 3;

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

  Ship.prototype.power = function (impulse) {
    this.vel.addTo(impulse);
  };

  Ship.prototype.thrust = function (magnitude) {
    var impulse = new Vector({
      magnitude: magnitude,
      angle: this.angle + Math.PI / 2
    });
    this.power(impulse);
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
        context.drawImage(this.image, -64, -64);
        // Util.drawTriangle(context);
        context.restore();
      };
    };
  };

  Ship.prototype.fireBullet = function () {
    var bullet = new Bullet({
      pos: new Vector({x: this.pos.x, y: this.pos.y}),
      vel: this.vel.add(new Vector({
        magnitude: 500,
        angle: this.angle + Math.PI / 2
      }))
    });
    this.game.addBullet(bullet);
  };

})();
