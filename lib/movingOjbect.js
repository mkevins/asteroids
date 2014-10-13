(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

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
    context.beginPath();
    context.arc(
      this.pos.x,
      this.pos.y,
      this.radius,
      0,
      2 * Math.PI
    );
    context.fill();
    context.restore();
  };

  MovingObject.prototype.move = function () {
    this.pos.add(this.vel);
  };

})();