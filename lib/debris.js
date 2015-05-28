(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var MovingObject = Asteroids.MovingObject;
  var Vector = Asteroids.Vector;

  var Debris = Asteroids.Debris = function (object) {
    MovingObject.call(this, object);
    this.birthTime = Date.now();
    this.lifetime = object.lifetime || 0.5;
    this.game = object.game;
    this.halfLength = object.halfLength;
    this.angle = object.angle;
  };

  Debris.inherits(MovingObject);

  Debris.prototype.draw = function (context) {
    var canvasX = context.canvas.width;
    var canvasY = context.canvas.height;
    var radius = this.radius;
    for (var y = -1; y < 2; y++) {
      for (var x = -1; x < 2; x++) {
        var pos = new Vector({
              x: this.pos.x + x * canvasX,
              y: this.pos.y + y * canvasY
            });
        context.save();
        context.translate(pos.x, pos.y);
        this.drawDebris(context);
        context.restore();
      };
    };
  };

  Debris.prototype.drawDebris = function (context) {
    context.strokeStyle = 'white';
    context.rotate(this.angle);
    context.beginPath();
    context.moveTo(-this.halfLength, 0);
    context.lineTo(this.halfLength, 0);
    context.lineWidth = 3;
    context.stroke();
  };


})();
