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
    /*
    key('up', function () {ship.thrust(10); return false;});
    key('down', function () {ship.thrust(-10); return false;});
    key('left', function () {ship.rotate(-Math.PI / 18); return false;});
    key('right', function () {ship.rotate(Math.PI / 18); return false;});
    key('space', function () {ship.fireBullet(); return false;});
    */
    window.onkeydown = function(event) {
      switch(event.which) {
        case 38:  // up
          ship.thrustOn(true);
          event.preventDefault();
          break;
        case 40:  // down
          ship.reverseThrustOn(true);
          event.preventDefault();
          break;
        case 37:  // left
          ship.rotateLeft(true);
          event.preventDefault();
          break;
        case 39:  // right
          ship.rotateRight(true);
          event.preventDefault();
          break;
        case 32:  // space
          ship.fireBullet();
          event.preventDefault();
          break;
        default:
      }
    };

    window.onkeyup = function(event) {
      switch(event.which) {
        case 38:  // up
          ship.thrustOn(false);
          event.preventDefault();
          break;
        case 40:  // down
          ship.reverseThrustOn(false);
          event.preventDefault();
          break;
        case 37:  // left
          ship.rotateLeft(false);
          event.preventDefault();
          break;
        case 39:  // right
          ship.rotateRight(false);
          event.preventDefault();
          break;
          /*
        case 32:  // space
          ship.fireBullet();
          event.preventDefault();
          break;
          */
        default:
      }
    };


    setInterval(function () {
      gameView.game.draw(gameView.context);
      gameView.game.step();
    }, 20);
  };
})();
