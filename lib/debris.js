(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject;
  var Vector = Asteroids.Vector;

  var Debris = Asteroids.Debris = function (object) {
    MovingObject.call(this, object);
    this.birthTime = Date.now();
    this.lifetime = object.lifetime || 0.5;
    this.game = object.game;
    this.halfLength = object.halfLength;
    this.angle = object.angle;
    Debris.instances.push(this);
  };

  Debris.instances = [];
  Debris.inherits(MovingObject);

  Debris.reaper = function () {
    Debris.instances = Debris.instances.filter(function (instance) {
      return (!instance.isDead);
    });
  };

  Debris.prototype.draw = function (context) {
    var radius = this.radius;
    context.save();
    context.translate(this.pos.x, this.pos.y);
    this.drawDebris(context);
    context.restore();
  };

  Debris.prototype.drawDebris = function (context) {
    context.strokeStyle = 'white';
    context.rotate(this.angle);
    context.beginPath();
    context.moveTo(-this.halfLength, 0);
    context.lineTo(this.halfLength, 0);
    context.lineWidth = 3;
    context.stroke();
  };


})();
