(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Vector = Asteroids.Vector = function (params) {
    if (params.x) {
      this.x = params.x;
      this.y = params.y;
    }
    else {
      this.x = params.magnitude * Math.cos(params.angle);
      this.y = params.magnitude * Math.sin(params.angle);
    }
  };

  Vector.prototype.add = function (vector) {
    this.x += vector.x;
    this.y += vector.y;
  };

  Vector.prototype.getMagnitude = function () {
    return Math.pow(this.x*this.x + this.y*this.y, 0.5);
  };

  Vector.prototype.getAngle = function () {
    return Math.atan2(this.y, this.x);
  };

  var Util = Asteroids.Util = function () {
  }

  Asteroids.Util.randomVec = function (length) {
   var angle = Math.random() * 2 * Math.PI;
   return new Vector({
     magnitude: length,
     angle: angle
   });
  };

  Function.prototype.inherits = function (SuperClass) {
    var Subclass = this;
    function Surrogate() {};
    Surrogate.prototype = SuperClass.prototype;
    Subclass.prototype = new Surrogate();
  };

})();