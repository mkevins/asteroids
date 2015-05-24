(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject;
  var Ship = Asteroids.Ship;
  var Asteroid = Asteroids.Asteroid;

  var Bullet = Asteroids.Bullet = function (object) {
    this.birthTime = Date.now();
    this.lifetime = object.lifetime || 0.5;
    object.color = object.color || Bullet.COLOR;
    object.radius = object.radius || Bullet.RADIUS;
    MovingObject.call(this, object);
  };

  Bullet.inherits(MovingObject);

  Bullet.COLOR = "white";
  Bullet.RADIUS = 5;
  //
  // Bullet.prototype.collideWith = function (otherObject) {
  //   if (this.isCollidedWith(otherObject)) {
  //     if (otherObject instanceof Asteroid) {
  //       this.game.remove(otherObject);
  //       this.game.remove(this);
  //     }
  //   }
  // };

})();
