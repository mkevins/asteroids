(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject;
  var Ship = Asteroids.Ship;
  var Asteroid = Asteroids.Asteroid;

  var Powerup = Asteroids.Powerup = function (object) {
    MovingObject.call(this, object);
    this.birthTime = Date.now();
    this.lifetime = object.lifetime || 5;
    this.color = object.color || Powerup.COLOR;
    this.radius = object.radius || Powerup.RADIUS;
    this.type = object.type || Powerup.TYPE;
    Powerup.instances.push(this);
  };

  Powerup.instances = [];
  Powerup.inherits(MovingObject);

  Powerup.reaper = function () {
    Powerup.instances = Powerup.instances.filter(function (instance) {
      return (!instance.isDead);
    });
  };

  Powerup.COLOR = 'green';
  Powerup.RADIUS = 50;
  Powerup.TYPE = 'spray';

})();
