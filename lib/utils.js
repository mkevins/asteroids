(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Vector = Asteroids.Vector = function (params) {
    if (typeof params.x !== "undefined") {
      this.x = params.x;
      this.y = params.y;
    }
    else {
      this.x = params.magnitude * Math.cos(params.angle);
      this.y = params.magnitude * Math.sin(params.angle);
    }
  };

  Vector.prototype.clone = function () {
    return new Vector({
      x: this.x,
      y: this.y
    });
  };

  Vector.prototype.add = function (vector) {
    return new Vector({
      x: this.x + vector.x,
      y: this.y + vector.y
    });
  };

  Vector.prototype.addTo = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
  };

  Vector.prototype.subtract = function (vector) {
    return new Vector({
      x: this.x - vector.x,
      y: this.y - vector.y
    });
  };

  Vector.prototype.subtractFrom = function (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  };

  Vector.prototype.scale = function(scale) {
    return new Vector({
      x: this.x * scale,
      y: this.y * scale
    });
  };

  Vector.prototype.scaleTo = function(scale) {
    this.x *= scale;
    this.y *= scale;
  };

  Vector.prototype.distanceTo = function (vector) {
    return this.subtract(vector).getMagnitude();
  };

  Vector.prototype.angleTo = function (vector) {
    return this.subtract(vector).getAngle();
  };

  Vector.prototype.getMagnitude = function () {
    return Math.pow(this.x * this.x + this.y * this.y, 0.5);
  };

  Vector.prototype.getAngle = function () {
    return Math.atan2(this.y, this.x);
  };

  Vector.prototype.wrap = function (width, height) {
    var w = width;
    var h = height;
    var x = this.x;
    var y = this.y;
    this.x = (x % w + w) % w;
    this.y = (y % h + h) % h;
  };

  var Util = Asteroids.Util = function () {
  }

  Util.randomPos = function (width, height) {
    return new Vector({
      x: Math.random() * width,
      y: Math.random() * height
    });
  }

  Util.randomVec = function (length) {
   var angle = Math.random() * 2 * Math.PI;
   return new Vector({
     magnitude: length,
     angle: angle
   });
  };

  Util.drawCircle = function (context, pos, radius) {
    context.beginPath();
    context.arc(
      pos.x,
      pos.y,
      radius,
      0,
      2 * Math.PI
    );
    context.fill();
  }

  Util.drawTriangle = function (context) {
    context.beginPath();
    context.moveTo(1, 0);
    context.lineTo(-1, 0);
    context.lineTo(0, 2);
    context.lineTo(1, 0);
    context.fill();
  }

  Function.prototype.inherits = function (SuperClass) {
    var Subclass = this;
    function Surrogate() {};
    Surrogate.prototype = SuperClass.prototype;
    Subclass.prototype = new Surrogate();
  };

})();
