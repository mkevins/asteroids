function sum() {
  var sum = 0;
  var args = [].slice.apply(arguments);
  args.forEach(function (el) {
    sum += el;
  });
  return sum;
}

Function.prototype.myBind = function (obj) {
  var fn = this;
  var args = [].slice.call(arguments, 1);
  return function() {
    var args2 = [].slice.apply(arguments);
    return fn.apply(obj, args.concat(args2));
  };
};

Function.prototype.curry = function (numArgs) {
  var fn = this;
  debugger;
  if (numArgs === 1) {
    return function (arg) {
      return fn.call(null, arg);
    };
  }
  else {
    return function (arg) {
      fn = fn.bind(null, arg);
      return fn.curry(numArgs - 1);
    }
  }
};

function currySum(numArgs) {
  var numbers = [];
  return function _curriedSum(num) {
    numbers.push(num);
    if (numbers.length === numArgs) {
      var sum = 0;
      numbers.forEach(function (el) {
        sum += el;
      })
      numbers = [];
      return sum;
    } else {
      return _curriedSum;
    }
  };
};

Function.prototype.inherits = function (SuperClass) {
  var Subclass = this;
  function Surrogate() {};
  Surrogate.prototype = SuperClass.prototype;
  Subclass.prototype = new Surrogate();
};
