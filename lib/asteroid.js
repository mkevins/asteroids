(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject;
  var Ship = Asteroids.Ship;
  var Bullet = Asteroids.Bullet;
  var Vector = Asteroids.Vector;

  var Asteroid = Asteroids.Asteroid = function (object) {
    object.color = object.color || Asteroid.COLOR;
    object.radius = object.radius || Asteroid.RADIUS;
    MovingObject.call(this, object);
    this.image = Asteroid.getRandomImage();
  };

  Asteroid.inherits(MovingObject);

  Asteroid.COLOR = "#efefef";
  Asteroid.RADIUS = 50;
  Asteroid.imageSources =  [
    "./assets/aaron.png",
    "./assets/collinj.png",
    "./assets/florin.png",
    "./assets/john.png",
    "./assets/mattn.png",
    "./assets/benjy.png",
    "./assets/davidcharnuska.png",
    "./assets/gary.png",
    "./assets/kc.png",
    "./assets/max.png",
    "./assets/charles.png",
    "./assets/davidcolucci.png",
    "./assets/jacob.png",
    "./assets/kenny.png",
    "./assets/mike.png",
    "./assets/chris.png",
    "./assets/davidr.png",
    "./assets/jeremy.png",
    "./assets/kevin.png",
    "./assets/norris.png",
    "./assets/collind.png",
    "./assets/dennis.png",
    "./assets/jessie.png",
    "./assets/mattk.png",
    "./assets/zak.png"
  ];
  Asteroid.getRandomImage = function () {
    var srcs = Asteroid.imageSources;
    var image = new Image();
    image.src = srcs[Math.floor(Math.random() * srcs.length)];
    return image;
  }

  Asteroid.prototype.collideWith = function (otherObject) {
    if (this.isCollidedWith(otherObject)) {
      if (otherObject instanceof Ship) {
        otherObject.crash();
      } else if (otherObject instanceof Bullet) {
        this.game.removeAsteroid(this);
      }
    }
  };

  Asteroid.prototype.draw = function (context) {
    var canvasX = context.canvas.width;
    var canvasY = context.canvas.height;
    var radius = this.radius;
    for (var y = -1; y < 2; y++) {
      for (var x = -1; x < 2; x++) {
        var pos = new Vector({
              x: this.pos.x + x * canvasX,
              y: this.pos.y + y * canvasY
            });
        //Util.drawCircle(context, pos, radius);
        context.save();
        context.translate(pos.x, pos.y);
        context.scale(100 / 36, 100 / 36);
        context.drawImage(this.image, -12, -18);
        context.restore();
      };
    };
  };

})();
