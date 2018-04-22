"use strict";

const sinon = require("sinon");
const expect = require("chai").expect;

const m = {};
const n = {};
const o = {};
const p = {};

let engine;
let animation;
let utils;
let state;

let Animation;
let Engine;
let createState = (a) => {
 console.log("IT CAN BE REACHED", a);
};


/* Some of these "engine" tests are really just checking the animation module? these need better tests. */

describe("Engine", (done) => {
  before(() => {
    require("./lib/compile")("./src/engine.js", m).then(() => {
      engine = m.exports.default;
      Engine = engine;
    });

    require("./lib/compile")("./src/animation.js", n).then(() => {
      animation = n.exports;
      Animation = animation;
    });

    require("./lib/compile")("./src/state.js", o).then(() => {
      state = o.exports;
      createState = state.createState;
    });

    require("./lib/compile")("./src/utils.js", p).then(() => {
      utils = p.exports;
    });
  });

  beforeEach(() => {
    const root = {
      body : "body"
    };

    sinon.stub(utils, "ancestor").returns(root);
  });

  afterEach(() => utils.ancestor.restore());

  describe("createAnimation", () => {
    it("needs tests");
  });

  describe("stepAnimation", () => {
    it("should call animation.tick and animation.updateElement", () => {
      const animation = {
        isStopped() {
          return false;
        },
        tick          : sinon.stub(),
        updateElement : sinon.stub()
      };
      const element = { style : {} };
      const time = 42;

      Engine.stepAnimation(element, animation, time);

      sinon.assert.calledOnce(animation.tick);
      sinon.assert.calledWith(animation.tick, time);
      sinon.assert.calledOnce(animation.updateElement);
    });
  });

  describe("stepAnimations", () => {
    beforeEach(() => {
      sinon.stub(Engine, "stepAnimation");
      sinon.stub(Engine, "archiveCompletedAnimations");
      sinon.stub(Engine, "scheduleNextFrame");
    });

    afterEach(() => {
      Engine.stepAnimation.restore();
      Engine.archiveCompletedAnimations.restore();
      Engine.scheduleNextFrame.restore();
    });

    it("should call stepAnimation for each animation", () => {
      Engine.runningAnimations = [
        [{}, {}, {}],
        [{}, {}, {}]
      ];

      Engine.stepAnimations();

      sinon.assert.calledTwice(Engine.stepAnimation);
    });

    it("should call archiveAnimations", () => {
      Engine.stepAnimations();
      sinon.assert.calledOnce(Engine.archiveCompletedAnimations);
    });
  });

  describe("archiveCompletedAnimations", () => {
    // it("should move finished animations from running to completed", () => {
    //   const anim = {
    //     options : {},
    //     completed() {
    //       return true;
    //     }
    //   };

    //   Engine.runningAnimations = [[{}, anim, Engine.createChainer() ]];
    //   Engine.completedAnimations = [[{}, anim, Engine.createChainer() ]];
      
    //   Engine.archiveCompletedAnimations();

    //   expect(Engine.runningAnimations.length).to.eql(0);
    //   expect(Engine.completedAnimations.length).to.eql(2);
    // });

    it("should not save old finished animations on the same element", () => {
      const anim = {
        options : {},
        completed() {
          return true;
        }
      };

      // Element needs a goddamn parent node, Daniel.
      const element = { parentNode : { body : {} } };

      Engine.runningAnimations = [[ element, anim, Engine.createChainer() ]];
      Engine.completedAnimations = [[ element, anim, Engine.createChainer() ]];
      Engine.completedAnimations = [[{ parentNode : { body : {} } }, anim, Engine.createChainer() ]];

      Engine.archiveCompletedAnimations();

      expect(Engine.runningAnimations.length).to.eql(0);
      expect(Engine.completedAnimations.length).to.eql(2);
    });

    it("should start next queued animation", () => {
      const chainer = Engine.createChainer();

      chainer.snabbt({});

      const anim = {
        options : {},
        stop() {},
        completed() {
          return true;
        },
        endState() {
          return null;
        },
        getCurrentState() {
          return null;
        }
      };

      Engine.runningAnimations = [[{}, anim, chainer ]];

      Engine.archiveCompletedAnimations();

      expect(Engine.runningAnimations.length).to.eql(1);
    });

    it("should not remove completed", () => {
      const element = { parentNode : { body : {} } };

      Engine.runningAnimations = [];
      Engine.completedAnimations = [[ element, {}, Engine.createChainer ]];

      Engine.archiveCompletedAnimations();
      Engine.archiveCompletedAnimations();

      expect(Engine.completedAnimations.length).to.eql(1);
    });
  });

  describe("initializeAnimation", () => {
    beforeEach(() => {
      sinon.spy(Animation, "createAnimation");
      sinon.stub(Engine, "scheduleNextFrame");
      Engine.runningAnimations = [];
    });

    afterEach(() => {
      Animation.createAnimation.restore();
      Engine.scheduleNextFrame.restore();
    });


    it("should call createAnimation with states and options needs a test");

    it("should append to runningAnimations", () => {
      expect(Engine.runningAnimations.length).to.eql(0);

      const element = { style : {} };
      const options = {
        fromPosition : [ -1, -1, -1 ],
        position     : [ 1, 1, 1 ]
      };

      Engine.initializeAnimation(element, options);

      expect(Engine.runningAnimations.length).to.eql(1);
      expect(Engine.runningAnimations[0].length).to.eql(3);
    });

    it("should use current state from running animations", () =>
      // const previousState = createState({ position : [ 100, 100, 100 ] });
      // const previousAnimation = {
      //   stop() {},
      //   getCurrentState() {
      //     return previousState;
      //   }
      // };
      // const element = { style : {} };

      // Engine.runningAnimations = [[ element, previousAnimation, {}]];

      // const options = {
      //   position : [ 200, 200, 200 ]
      // };

      // Engine.initializeAnimation(element, options);

      // const startState = Animation.createAnimation.lastCall.args[0];

      // expect(startState.position).to.eql([ 100, 100, 100 ]);
      true
    );

    it("should cancel running animations on the same element", () => {
      const element = { style : {} };
      const anim = {
        stop() {},
        getCurrentState() {}
      };

      Engine.runningAnimations = [[ element, anim, {}]];

      Engine.initializeAnimation(element, {});

      expect(Engine.runningAnimations).to.have.length(1);
    });

    it("should stop animation with 'stop' command", () => {
      const element = { style : {} };

      Engine.completedAnimations = [];
      Engine.runningAnimations = [[ element, {}, {}]];

      Engine.initializeAnimation(element, "stop");

      expect(Engine.runningAnimations).to.have.length(0);
      expect(Engine.completedAnimations).to.have.length(1);
    });

    describe("attention animations", () => {
      beforeEach(() => {
        sinon.stub(Animation, "createAttentionAnimation").returns({
          updateElement() {}
        });
      });

      afterEach(() => {
        Animation.createAttentionAnimation.restore();
      });

      it("should create attention animation", () =>
        // const element = { style : {} };
        // const options = {};

        // Engine.initializeAnimation(element, "attention", options);

        // sinon.assert.calledOnce(Animation.createAttentionAnimation);
        // sinon.assert.calledWith(Animation.createAttentionAnimation, options);
         true
      );
    });
  });
});
