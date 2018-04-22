"use strict";

import { duplicate, _function as isFunction } from "./utils";

const SCALAR = 1;
const ARRAY_2 = 2;
const ARRAY_3 = 3;

function fromPrefixed(name) {
  return `from${name.charAt(0).toUpperCase()}${name.slice(1)}`;
}

var tweenableProperties = {
  position     : [ ARRAY_3, [ 0, 0, 0 ]],
  rotation     : [ ARRAY_3, [ 0, 0, 0 ]],
  rotationPost : [ ARRAY_3, [ 0, 0, 0 ]],
  skew         : [ ARRAY_2, [ 0, 0 ]],
  scale        : [ ARRAY_2, [ 1, 1 ]],
  scalePost    : [ ARRAY_2, [ 1, 1 ]],
  opacity      : [ SCALAR ],
  width        : [ SCALAR ],
  height       : [ SCALAR ]
};

function preprocessOptions(options, index, len) {
  if(!options) {
    console.warn("Preprocess Options: Malformed or invalid options passed in!");
    
    return;
  }
  
  const clone = duplicate(options);

  const hasAllDoneCallback = isFunction(options.allDone);
  const hasCompleteCallback = isFunction(options.complete);

    if(hasCompleteCallback || hasAllDoneCallback) {
        clone.complete = function() {
            if(hasCompleteCallback) {
                options.complete.call(this, index, len);
            }
            if(hasAllDoneCallback && index === len - 1) {
                options.allDone();
            }
        };
    }

    if(isFunction(options.valueFeeder)) {
        clone.valueFeeder = function(i, matrix) {
            return options.valueFeeder(i, matrix, index, len);
        };
    }
    if(isFunction(options.easing)) {
        clone.easing = function(i) {
            return options.easing(i, index, len);
        };
    }
    if(isFunction(options.start)) {
        clone.start = function() {
            return options.start(index, len);
        };
    }
    if(isFunction(options.update)) {
        clone.update = function(i) {
            return options.update(i, index, len);
        };
    }

    var properties = Object.keys(tweenableProperties).concat([
      "perspective",
      "transformOrigin",
      "duration",
      "delay"
    ]);

    properties.forEach((property) => {
        var fromProperty = fromPrefixed(property);

        if(isFunction(options[property])) {
            clone[property] = options[property](index, len);
        }
        if(isFunction(options[fromProperty])) {
            clone[fromProperty] = options[fromProperty](index, len);
        }
    });

  return clone;
}

export default {
  tweenableProperties,
  fromPrefixed,
  preprocessOptions,
  types : {
    SCALAR,
    ARRAY_2,
    ARRAY_3
  }
};
