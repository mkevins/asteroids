(function () {
  if (typeof Asteroids === "undefined") {
    window.Asteroids = {};
  }

  var Util = Asteroids.Util;
  var MovingObject = Asteroids.MovingObject;

  var Powerup = Asteroids.Powerup = function (object) {
    MovingObject.call(this, object);
    this.birthTime = Date.now();
    this.lifetime = object.lifetime || 5;
    //this.color = object.color || Powerup.COLOR;
    switch (object.type) {
      case 'extraLife':
        this.color = 'white';
        break;
      case 'spray':
        this.color = 'yellow';
        break;
      case 'rate':
        this.color = 'blue';
        break;
      case 'range':
        this.color = 'purple';
        break;
      case 'boom':
        this.color = 'gray';
        break;
      default:
        this.color = '#0f0';
    }
    this.radius = object.radius || Powerup.RADIUS;
    this.type = object.type || Powerup.TYPE;
    Powerup.instances.push(this);
  };

  Powerup.instances = [];
  Powerup.inherits(MovingObject);

  Powerup.reaper = function () {
    Powerup.instances = Powerup.instances.filter(function (instance) {
      return (!instance.isDead);
    });
  };

  Powerup.COLOR = 'green';
  Powerup.RADIUS = 32;
  Powerup.TYPE = 'spray';

  var shipImage = new Image();
  shipImage.src = "./assets/ship/ship.png";

  Powerup.prototype.draw = function (context) {
    switch (this.type) {
      case 'extraLife':
        drawExtraLife.call(this, context);
        break;
      case 'spray':
        drawSpray.call(this, context);
        break;
      case 'rate':
        drawRate.call(this, context);
        break;
      case 'range':
        drawRange.call(this, context);
        break;
      default:
        break;
    }
  };

  function drawExtraLife (context) {
    context.save();
    context.fillStyle = '#222';
    context.strokeStyle = '#0f0';
    context.lineWidth = 3;
    Util.fillCircle(context, this.pos, this.radius);
    Util.strokeCircle(context, this.pos, this.radius);
    context.translate(this.pos.x - 32, this.pos.y - 28);
    context.scale(0.5, 0.5);
    context.drawImage(shipImage, 0, 0);
    context.restore();
  }

  function drawSpray (context) {
    context.save();
    context.fillStyle = '#222';
    context.strokeStyle = '#ff0';
    context.lineWidth = 3;
    Util.fillCircle(context, this.pos, this.radius);
    Util.strokeCircle(context, this.pos, this.radius);
    context.fillStyle = 'white';
    var x = this.pos.x - 16;
    var y = this.pos.y;
    Util.fillCircle(context, {x: x, y: y}, 5);
    Util.fillCircle(context, {x: x + 13, y: y - 7}, 5);
    Util.fillCircle(context, {x: x + 13, y: y + 7}, 5);
    Util.fillCircle(context, {x: x + 30, y: y}, 5);
    Util.fillCircle(context, {x: x + 26, y: y - 15}, 5);
    Util.fillCircle(context, {x: x + 26, y: y + 15}, 5);
    context.restore();
  }

  function drawRate (context) {
    context.save();
    context.fillStyle = '#222';
    context.strokeStyle = '#0ff';
    context.lineWidth = 3;
    Util.fillCircle(context, this.pos, this.radius);
    Util.strokeCircle(context, this.pos, this.radius);
    context.fillStyle = 'white';
    var x = this.pos.x - 15;
    var y = this.pos.y;
    Util.fillCircle(context, {x: x, y: y}, 5);
    Util.fillCircle(context, {x: x + 15, y: y}, 5);
    Util.fillCircle(context, {x: x + 30, y: y}, 5);
    context.restore();
  }

  function drawRange (context) {
    context.save();
    context.strokeStyle = '#f0f';
    context.lineWidth = 3;
    Util.fillCircle(context, this.pos, this.radius);
    Util.strokeCircle(context, this.pos, this.radius);
    context.fillStyle = 'white';
    var x = this.pos.x - 15;
    var y = this.pos.y;
    Util.fillCircle(context, {x: x, y: y}, 5);
    Util.fillCircle(context, {x: x + 30, y: y}, 5);
    context.restore();
  }

})();
