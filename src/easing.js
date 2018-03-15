"use strict";

import utils from "./utils.js";

function linearEasing(value) {
  return value;
}

function ease(value) {
  return (Math.cos(value * Math.PI + Math.PI) + 1) / 2;
}

function easeIn(value) {
  return value * value;
}

function easeOut(value) {
  return -Math.pow(value - 1, 2) + 1;
}

var createSpringEasing = function(options) {
  var position = utils.optionOrDefault(options.startPosition, 0);
  var equilibriumPosition = utils.optionOrDefault(options.equilibriumPosition, 1);
  var velocity = utils.optionOrDefault(options.initialVelocity, 0);
  var springConstant = utils.optionOrDefault(options.springConstant, 0.8);
  var deceleration = utils.optionOrDefault(options.springDeceleration, 0.9);
  var mass = utils.optionOrDefault(options.springMass, 10);

  var equilibrium = false;

  // Public API
  return {
    isSpring : true,
    tick(value, isManual) {
      if(value === 0.0 || isManual)
        {return;}
      if(equilibrium)
        {return;}
      var springForce = -(position - equilibriumPosition) * springConstant;
      // f = m * a
      // a = f / m
      var a = springForce / mass;
      // s = v * t
      // t = 1 ( for now )

      velocity += a;
      position += velocity;

      // Deceleration
      velocity *= deceleration;
      if(Math.abs(position - equilibriumPosition) < 0.001 && Math.abs(velocity) < 0.001) {
        equilibrium = true;
      }
    },

    resetFrom(value) {
      position = value;
      velocity = 0;
    },


    getValue() {
      if(equilibrium)
        {return equilibriumPosition;}
      
return position;
    },

    completed() {
      return equilibrium;
    }
  };
};

var EASING_FUNCS = {
  linear    : linearEasing,
  ease    : ease,
  easeIn,
  easeOut : easeOut
};


function createEaser(easerName, options) {
  if(easerName === "spring") {
    return createSpringEasing(options);
  }
  var easeFunction = easerName;

  if(!utils.isFunction(easerName)) {
    easeFunction = EASING_FUNCS[easerName];
  }

  var easer = easeFunction;
  var value = 0;
  var lastValue;

  // Public API
  return {
    tick(v) {
      value = easer(v);
      lastValue = v;
    },

    resetFrom() {
      lastValue = 0;
    },

    getValue() {
      return value;
    },

    completed() {
      if(lastValue >= 1) {
        return lastValue;
      }
      
return false;
    }
  };
}

export default {
  createEaser,
  createSpringEasing
};
