"use strict";

var{ expect } = require("chai");

const m = {};
let tweeners;

function createState(props, value) {
  var state = {};

  props.forEach((prop) => {
    state[prop] = value;
  });
    
    return state;
}

describe("tweeners", () => {
    before(() => {
        require("./lib/compile")("./src/tweeners.js", m).then(() => {
            tweeners = m.exports;
            console.log(m.exports);
        });
    });

  describe("stateTweener", () => {
    it("should tween 3d properties that are present", () => {
      var props = [ "position", "rotation" ];
      var startState = createState(props, [ 1, 1, 1 ]);
      var endState = createState(props, [ 2, 2, 2 ]);
      var result = createState(props, [ 0, 0, 0 ]);

      var tweener = tweeners.createStateTweener(startState, endState, result);

      tweener.tween(0.5);

      expect(result.position).to.eql([ 1.5, 1.5, 1.5 ]);
      expect(result.rotation).to.eql([ 1.5, 1.5, 1.5 ]);
    });

    it("should tween 2d properties that are present", () => {
      var props = [ "skew", "scale" ];
      var startState = createState(props, [ 1, 1 ]);
      var endState = createState(props,  [ 2, 2 ]);
      var result = createState(props, [ 0, 0 ]);

      var tweener = tweeners.createStateTweener(startState, endState, result);

      tweener.tween(0.5);

      expect(result.skew).to.eql([ 1.5, 1.5 ]);
      expect(result.scale).to.eql([ 1.5, 1.5 ]);
    });

    it("should tween scalar properties that are present", () => {
      var props = [ "opacity", "width" ];
      var startState = createState(props, 1);
      var endState = createState(props,  2);
      var result = createState(props, 0);

      var tweener = tweeners.createStateTweener(startState, endState, result);

      tweener.tween(0.5);

      expect(result.opacity).to.eql(1.5);
      expect(result.width).to.eql(1.5);
    });
  });

  describe("valueFeederTweener", () => {
    it("should update currentMatrix with return value from valueFeeder", () => {
      let savedMatrix;
      const valueFeeder = (tweenValue, matrix) => {
        savedMatrix = matrix.translate(100, 100, 100);
        
        return savedMatrix;
      };

      const start = {};
      const end = {};
      const result = {};
      const tweener = tweeners.createValueFeederTweener(valueFeeder, start, end, result);

      tweener.tween(0);

      expect(tweener.asMatrix()).to.eql(savedMatrix);
    });
  });
});
