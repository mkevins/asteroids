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
    this.registerListeners();
    this.game.unPause();
    this.state = 'playing';

    this.stepIntervalId = setInterval((function () {
      if (this.game.isOver) {
        this.stop();
      } else {
        this.game.draw(this.context);
        this.game.step();
      }
    }).bind(this), 20);
  };

  GameView.prototype.stop = function () {
    if (!(this.state == 'stopped')) {
      this.state = 'stopped';
      clearInterval(this.stepIntervalId);
      this.showGameOverModal();
      this.unregisterListeners();
    }
  };

  GameView.prototype.showGameOverModal = function () {

    var $wrapper = $('<div />', {class: 'modal-wrapper'});
    $('body').prepend($wrapper);

    var $modal = $('<div />', {class: 'modal', text: "game over"});
    $wrapper.html($modal);

    var $replayButton = $('<div />', {class: 'replay', text: "play again?"});
    $replayButton.one('click', this.restart.bind(this));
    $modal.append($replayButton);

  };

  GameView.prototype.restart = function() {
    $('.modal-wrapper').remove();
    this.game.start();
    this.start();
  };

  GameView.prototype.registerListeners = function() {
    $(window).bind('keydown', this.handleKeydown.bind(this));;
    $(window).bind('keyup', this.handleKeyup.bind(this));;
  };

  GameView.prototype.unregisterListeners = function() {
    $(window).unbind('keydown', this.handleKeydown.bind(this));;
    $(window).unbind('keyup', this.handleKeyup.bind(this));;
  };

  GameView.prototype.handleKeydown = function(event) {
    var ship = this.game.ship;
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
        ship.firing(true);
        event.preventDefault();
        break;
      default:
    }
  };

  GameView.prototype.handleKeyup = function(event) {
    var ship = this.game.ship;
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
      case 32:  // space
        ship.firing(false);
        event.preventDefault();
        break;
      default:
    }
  };
})();
