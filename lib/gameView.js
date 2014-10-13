(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Game = Asteroids.Game;

  var GameView = Asteroids.GameView = function (game, context) {
    this.game = game;
    this.context = context;
  };

  GameView.prototype.start = function () {
    var gameView = this;
    setInterval(function () {
      gameView.game.draw(gameView.context);
      gameView.game.moveObjects();
    }, 20);
  };
})();