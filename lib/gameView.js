(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Game = Asteroids.Game;
  var Vector = Asteroids.Vector;
  var Bullet = Asteroids.Bullet;
  var Debris = Asteroids.Debris;
  var Powerup = Asteroids.Powerup;

  var GameView = Asteroids.GameView = function (game, context) {
    this.game = game;
    this.context = context;
  };

  GameView.prototype.start = function () {
    this.registerListeners();
    this.game.unPause();
		this.beginGameLoop();
  };

	GameView.prototype.beginGameLoop = function () {
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

  GameView.prototype.pauseToggle = function () {
    if (this.state == 'playing') {
      this.state = 'paused';
      clearInterval(this.stepIntervalId);
			this.pauseTime = Date.now();
      this.showPauseModal();
    } else if (this.state = 'paused') {
			$('.modal-wrapper').hide();
			$('.pause').hide();
			var pauseTimeAdjustment = Date.now() - this.pauseTime;
			this.game.lastStep += pauseTimeAdjustment;
			this.game.ship.sprayBirthTime += pauseTimeAdjustment;
			this.game.ship.shieldBirthTime += pauseTimeAdjustment;
			var agingObjects = Bullet.instances.concat(Debris.instances, Powerup.instances);

			agingObjects.forEach(function (object) {
				object.birthTime += pauseTimeAdjustment;
			});
			this.beginGameLoop();
    }
  };

  GameView.prototype.showGameOverModal = function () {
    $('.replay').one('click', this.restart.bind(this));
    $('.level').text(this.game.level);
    $('.score').text(this.game.score.toLocaleString());
    $('.game-over').show();
    $('.modal-wrapper').show();
  };

  GameView.prototype.showPauseModal = function () {
    //debugger;
    $('.resume').one('click', this.pauseToggle.bind(this));
    $('.level').text(this.game.level);
    $('.score').text(this.game.score.toLocaleString());
    $('.pause').show();
    $('.modal-wrapper').show();
  };

  GameView.prototype.restart = function() {
    $('.modal-wrapper').hide();
    $('.game-over').hide();
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
    $(window).off('keydown keyup mousemove mousedown mouseup contextmenu');
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
      case 80:  // p
        this.pauseToggle();
        event.preventDefault();
        break;
      default:
        break;
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
