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
    key('up', function () {ship.thrust(1); return false;});
    key('down', function () {ship.thrust(-1); return false;});
    key('left', function () {ship.rotate(-Math.PI / 18); return false;});
    key('right', function () {ship.rotate(Math.PI / 18); return false;});
    key('space', function () {ship.fireBullet(); return false;});

    setInterval(function () {
      gameView.game.draw(gameView.context);
      gameView.game.step();
    }, 20);
  };
})();
