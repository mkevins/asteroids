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

  var width, height;

  Vector.setDimensions = function (w, h) {
    width = w;
    height = h;
  };

  Vector.random = function (length) {
    if (typeof length !== 'undefined') {
      var angle = 2 * Math.PI * Math.random();
      return new Vector({
        magnitude: length,
        angle: angle
      });
    } else {
      return new Vector({
        x: Math.random() * width,
        y: Math.random() * height
      });
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
    return this;
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
    return this;
  };

  Vector.prototype.scale = function (scale) {
    return new Vector({
      x: this.x * scale,
      y: this.y * scale
    });
  };

  Vector.prototype.scaleTo = function (scale) {
    this.x *= scale;
    this.y *= scale;
    return this;
  };

  Vector.prototype.repel = function () {
    this.addTo(new Vector({x: width / 2, y: height / 2}));
  };

  Vector.getDim = function () {
    return {width: width, height: height};
  };

  Vector.prototype.distanceTo = function (vector) {
    var dX = Math.abs(this.x - vector.x);
    var dY = Math.abs(this.y - vector.y);
    dX = Math.min(dX, width - dX);
    dY = Math.min(dY, height - dY);
    return Math.pow(dX * dX + dY * dY, 0.5);
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

  Vector.prototype.wrap = function () {
    this.x = (this.x % width + width) % width;
    this.y = (this.y % height + height) % height;
  };

  var Util = Asteroids.Util = function () {
  };

  Util.getPoisson = function (lambda) {
    var L = Math.exp(-lambda);
    var p = Math.random();
    var n = 0;
    while (p > L) {
      n++;
      p *= Math.random();
    }
    return n;
  };

  Util.fillCircle = function (context, pos, radius) {
    context.beginPath();
    context.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    context.fill();
  }

  Util.strokeCircle = function (context, pos, radius) {
    context.beginPath();
    context.arc(pos.x, pos.y, radius, 0, 2 * Math.PI);
    context.stroke();
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
