$(function () {
  $('.start').one('click', function () {
    $('.modal-wrapper').hide();
    $('.start-game').hide();
    var context = $('#canvas')[0].getContext("2d");
    var game = new Asteroids.Game({
      dimX: window.innerWidth,
      dimY: window.innerHeight,
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

      context.canvas.width = width;
      context.canvas.height = height;
      game.dimX = width;
      game.dimY = height;
      Asteroids.Vector.setDimensions(width, height);
			gameView.game.draw(gameView.context);
    }

    $(window).resize();
  });
});
