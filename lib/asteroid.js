(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject;
  var Ship = Asteroids.Ship;

  var Asteroid = Asteroids.Asteroid = function (object) {
    object.color = object.color || Asteroid.COLOR;
    object.radius = object.radius || Asteroid.RADIUS;
    MovingObject.call(this, object);
  };

  Asteroid.inherits(MovingObject);

  Asteroid.COLOR = "#efefef";
  Asteroid.RADIUS = 10;

  MovingObject.prototype.collideWith = function (otherObject) {
    if (this.isCollidedWith(otherObject)) {
      if (otherObject instanceof Ship) {
        otherObject.relocate();
      }
      else {
        this.game.remove(otherObject);
      }
      this.game.remove(this);
    }
  };

})();