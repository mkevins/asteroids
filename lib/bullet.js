(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject;
  var Ship = Asteroids.Ship;
  var Asteroid = Asteroids.Asteroid;

  var Bullet = Asteroids.Bullet = function (object) {
    MovingObject.call(this, object);
    this.birthTime = Date.now();
    this.lifetime = object.lifetime || 0.5;
    this.color = object.color || Bullet.COLOR;
    this.radius = object.radius || Bullet.RADIUS;
    Bullet.instances.push(this);
  };

  Bullet.instances = [];
  Bullet.inherits(MovingObject);

  Bullet.reaper = function () {
    Bullet.instances = Bullet.instances.filter(function (instance) {
      return (!instance.isDead);
    });
  };

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
