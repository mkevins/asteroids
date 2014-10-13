(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }
  var Util = Asteroids.Util;
  var Vector = Asteroids.Vector;

  var MovingObject = Asteroids.MovingObject = function (object) {
    this.pos = object.pos || new Vector({ x: 0, y: 0 });
    this.vel = object.vel || new Vector({ x: 0, y: 0 });
    this.radius = object.radius || 50;
    this.color = object.color || "#000000";
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
        Util.drawCircle(pos, radius, context);
      };
    };
    context.restore();
  };

  MovingObject.prototype.move = function () {
    this.pos.add(this.vel);
  };

})();