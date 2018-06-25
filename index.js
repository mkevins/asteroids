$(function () {
  $('.start').one('click', function () {
    $('.modal-wrapper').hide();
    $('.start-game').hide();
    var context = $('#canvas')[0].getContext("2d");
    var game = new Asteroids.Game({
			/*
      dimX: window.innerWidth,
      dimY: window.innerHeight,
			*/
      livesCount: 3
    });
    var gameView = new Asteroids.GameView(game, context);
    gameView.start();

    var resizeTimeoutId;

    $(window).resize(function (event) {
      clearTimeout(resizeTimeoutId);
      resizeTimeoutId = setTimeout(throttledResize, 100);
    });

    function throttledResize (event) {
      //console.log("window resized");
      var width = $(window).width();
      var height = $(window).height();;
      console.log("width: " + width);
      console.log("height: " + height);

			// TODO: refactor view and game size (clean up duplicate data)
			// convert between screen and game coordinates (screen / mouse input)


      context.canvas.width = Math.min(width, (16 / 9) * height);
      context.canvas.height = Math.min(height, (9 / 16) * width);
			/*
      game.dimX = 1920;
      game.dimY = 1080;
			*/
      Asteroids.Vector.setDimensions(1920, 1080);
			gameView.game.draw(gameView.context);
    }

    $(window).resize();
  });
});
