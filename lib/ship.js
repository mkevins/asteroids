(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject;
  var Vector = Asteroids.Vector;
  var Util = Asteroids.Util;

  var Ship = Asteroids.Ship = function (object) {
    MovingObject.call(this, object);
    this.radius = object.radius || Ship.RADIUS;
    this.color = object.color || Ship.COLOR;
    this.vel = object.vel || new Vector({x: 0, y: 0});
  };

  Ship.inherits(MovingObject);

  Ship.RADIUS = 20;
  Ship.COLOR = "#bb2200";

  Ship.prototype.collideWith = function (otherObject) {
    console.log("colliding with ship")
  };
  Ship.prototype.relocate = function () {
    this.pos = this.game.randomPos();
    this.vel = new Vector({ x: 0, y: 0});
  };
})();