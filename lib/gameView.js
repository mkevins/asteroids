(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Game = Asteroids.Game;
  var Vector = Asteroids.Vector;

  var GameView = Asteroids.GameView = function (game, context) {
    this.game = game;
    this.context = context;
  };

  GameView.prototype.start = function () {
    var gameView = this;
    var ship = gameView.game.ship;
    key('up', function () {ship.thrust(1);});
    key('down', function () {ship.thrust(-1);});
    key('left', function () {ship.rotate(-Math.PI / 18);});
    key('right', function () {ship.rotate(Math.PI / 18);});
    key('space', function () {ship.fireBullet();});

    setInterval(function () {
      gameView.game.draw(gameView.context);
      gameView.game.step();
    }, 20);
  };
})();