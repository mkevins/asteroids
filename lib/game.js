(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Util = Asteroids.Util;
  var Asteroid = Asteroids.Asteroid;
  var Vector = Asteroids.Vector;

  var Game = Asteroids.Game = function () {
    this.asteroids = [];
    this.addAsteroids();
  };

  // add new asteroids to array
  Game.prototype.addAsteroids = function () {
    for (var i = 0; i < Game.NUM_ASTEROIDS; i++) {
      var asteroid = new Asteroid({
        pos: new Vector({
          x: Math.random() * Game.DIM_X,
          y: Math.random() * Game.DIM_Y
        }),
        vel: Util.randomVec(2),
        color: 'hsla(' + Math.random() * 360 + ', 100%, 70%, 0.6)'
      });
      this.asteroids.push(asteroid);
    };
  };

  Game.prototype.draw = function (context) {
    context.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    this.asteroids.forEach(function (asteroid) {
      asteroid.draw(context);
    });
  };

  Game.prototype.moveObjects = function () {
    this.asteroids.forEach(function (asteroid) {
      asteroid.move();
      asteroid.pos.wrap(Game.DIM_X, Game.DIM_Y);
    });
  };



  Game.DIM_X = 800;
  Game.DIM_Y = 600;
  Game.NUM_ASTEROIDS = 20;

})();