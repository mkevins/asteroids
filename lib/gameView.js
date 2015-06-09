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
    $('.replay').one('click', this.restart.bind(this));
    $('.level').text(this.game.level);
    $('.score').text(this.game.score.toLocaleString());
    $('.modal-wrapper').show();
  };

  GameView.prototype.restart = function() {
    $('.modal-wrapper').hide();
    this.game.start();
    this.start();
  };

  var mousemoveTimeoutId;
  GameView.prototype.registerListeners = function() {
    $(window).on('keydown', this.handleKeydown.bind(this));
    $(window).on('keyup', this.handleKeyup.bind(this));
    $(window).on('mousemove', this.handleMousemove.bind(this));
    $(window).on('mousedown', this.handleMousedown.bind(this));
    $(window).on('mouseup', this.handleMouseup.bind(this));
    $(window).on('contextmenu', this.handleContext.bind(this));
  };

  GameView.prototype.unregisterListeners = function() {
    $(window).off('keydown', this.handleKeydown.bind(this));// is this working with the binds?
    $(window).off('keyup', this.handleKeyup.bind(this));
    $(window).off('mousemove', this.handleMousemove.bind(this));
    $(window).off('mousedown', this.handleMousedown.bind(this));
    $(window).off('mouseup', this.handleMouseup.bind(this));
    $(window).off('contextmenu', this.handleContext.bind(this));
  };

  GameView.prototype.handleMousedown = function (event) {
    var ship = this.game.ship;
    switch (event.which) {
      case 1: // left mouse down
        //ship.thrustOn(true);
        ship.firing(true);
        event.preventDefault();
        break;
      case 3:  // down
        ship.reverseThrustOn(true);
        event.preventDefault();
        break;
      default:
    }
  };

  GameView.prototype.handleMouseup = function (event) {
    var ship = this.game.ship;
    switch (event.which) {
      case 1: // left mouse up
        //ship.thrustOn(false);
        ship.firing(false);
        event.preventDefault();
        break;
      case 3:  // right mouse up
        ship.reverseThrustOn(false);
        event.preventDefault();
        break;
      default:
    }
  };

  GameView.prototype.handleContext = function (event) {
    event.preventDefault();
  };

  GameView.prototype.handleMousemove = function (event) {
      clearTimeout(mousemoveTimeoutId);
      mousemoveTimeoutId = setTimeout(this.throttledMouseMove.call(this, event), 20);
  };

  GameView.prototype.throttledMouseMove = function (event) {
    this.game.mouse(event.clientX, event.clientY);
  };

  GameView.prototype.handleKeydown = function (event) {
    //console.log(event);
    var ship = this.game.ship;
    switch(event.which) {
      case 38:  // up
      case 87:  // w
        ship.thrustOn(true);
        event.preventDefault();
        break;
      case 40:  // down
      case 83:  // s
        ship.reverseThrustOn(true);
        event.preventDefault();
        break;
      case 37:  // left
      case 65:  // a
        ship.rotateLeft(true);
        event.preventDefault();
        break;
      case 39:  // right
      case 68:  // d
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
      case 87:  // w
        ship.thrustOn(false);
        event.preventDefault();
        break;
      case 40:  // down
      case 83:  // s
        ship.reverseThrustOn(false);
        event.preventDefault();
        break;
      case 37:  // left
      case 65:  // a
        ship.rotateLeft(false);
        event.preventDefault();
        break;
      case 39:  // right
      case 68:  // d
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
