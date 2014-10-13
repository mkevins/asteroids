(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject;


  var Asteroid = Asteroids.Asteroid = function (object) {
    object.color = object.color || Asteroid.COLOR;
    object.radius = object.radius || Asteroid.RADIUS;
    MovingObject.call(this, object);
  };

  Asteroid.inherits(MovingObject);

  Asteroid.COLOR = "#efefef";
  Asteroid.RADIUS = 50;



})();