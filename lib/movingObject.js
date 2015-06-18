(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }
  var Util = Asteroids.Util;
  var Vector = Asteroids.Vector;

  var MovingObject = Asteroids.MovingObject = function (object) {
    this.pos = object.pos || new Vector({ x: 0, y: 0 });
    this.vel = object.vel || new Vector({ x: 0, y: 0 });
    this.radius = object.radius || 10;
    this.color = object.color || "#000000";
    this.game = object.game;
    MovingObject.instances.push(this);
  };

  MovingObject.instances = [];

  MovingObject.reaper = function () {
    MovingObject.instances = MovingObject.instances.filter(function (instance) {
      return (!instance.isDead);
    });
  };

  MovingObject.prototype.draw = function (context) {
    context.save();
    context.fillStyle = this.color;
    var radius = this.radius;
    Util.drawCircle(context, this.pos, radius);
    context.restore();
  };

  MovingObject.prototype.move = function (delta) {
    this.pos.addTo(this.vel.scale(delta));
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    if (this.isDead || otherObject.isDead) {
      return false;
    }
    var distance = this.pos.distanceTo(otherObject.pos);
    return (distance < this.radius + otherObject.radius);
  };

  MovingObject.prototype.collideWith = function (otherObject) {
    // if (this.isCollidedWith(otherObject)) {
    //   this.game.remove(otherObject);
    //   this.game.remove(this);
    // }
  };

})();
