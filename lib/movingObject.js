(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }
  var Util = Asteroids.Util;
  var Vector = Asteroids.Vector;

  var MovingObject = Asteroids.MovingObject = function (object) {
    this.pos = object.pos || new Vector({ x: 0, y: 0 });
    this.vel = object.vel || new Vector({ x: 0, y: 0 });
    this.radius = object.radius || 10;
    this.color = object.color || "#000000";
    this.game = object.game
  }

  MovingObject.prototype.draw = function (context) {
    context.save();
    context.fillStyle = this.color;
    var canvasX = context.canvas.width;
    var canvasY = context.canvas.height;
    var radius = this.radius;
    for (var y = -1; y < 2; y++) {
      for (var x = -1; x < 2; x++) {
        var pos = new Vector({
              x: this.pos.x + x * canvasX,
              y: this.pos.y + y * canvasY
            });
        Util.drawCircle(context, pos, radius);
      };
    };
    context.restore();
  };

  MovingObject.prototype.move = function () {
    this.pos = this.pos.add(this.vel);
  };

  MovingObject.prototype.isCollidedWith = function (otherObject) {
    var distance = this.pos.distanceTo(otherObject.pos);
    return (distance < this.radius + otherObject.radius);
  };

  MovingObject.prototype.collideWith = function (otherObject) {
    // if (this.isCollidedWith(otherObject)) {
    //   this.game.remove(otherObject);
    //   this.game.remove(this);
    // }
  };

})();