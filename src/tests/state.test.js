"use strict";

const { expect } = require("chai");

const m = {};
const n = {};

let state;
let properties;
let props;
let types;

function generateRandomConfig(types) {
  var config = {};

  Object.keys(props).forEach((property) => {
    var type = props[property][0];

    if(type === types.SCALAR) {
 config[property] = Math.random();
 }
    if(type === types.ARRAY_2) {
 config[property] = [ Math.random(), Math.random() ];
 }
    if(type === types.ARRAY_3) {
 config[property] = [ Math.random(), Math.random(), Math.random() ];
}
  });
  
return config;
}

describe("state", () => {
  before(() => {
    require("./lib/compile")("./src/state.js", m).then(() => {
      state = m.exports;
    });

    require("./lib/compile")("./src/properties.js", n).then(() => {
      properties = n.exports;
      props = n.exports.tweenableProperties;
      types = n.exports.types;
    });
  });

  it("should assign properties from config", () => {
    var config = generateRandomConfig(types);
    var generatedState = state.createState(config);

    Object.keys(config).forEach((key) => {
      expect(config[key]).to.equal(generatedState[key]);
    });
  });

  it("should clone properties", () => {
    var config = generateRandomConfig(types);
    var generatedState = state.createState(config);
    var clone = generatedState.clone();

    Object.keys(config).forEach((key) => {
      expect(config[key]).to.equal(generatedState[key]);
      expect(clone[key]).to.eql(config[key]);

      if(!Number.isFinite(config[key])) {
        expect(clone[key]).to.not.equal(config[key]);
      }
    });
  });

  it("should return properties with units", () => {
    var generatedState = state.createState({
      width   : 100,
      height  : 100,
      opacity : 0.5
    });

    var properties = generatedState.getProperties();

    expect(properties).to.have.property("width", "100px");
    expect(properties).to.have.property("height", "100px");
    expect(properties).to.have.property("opacity", 0.5);
  });

  describe("stateFromOptions", () => {
    it("should create new state with default values", () => {
      var res = state.stateFromOptions({});

      Object.keys(props).forEach((prop) => {
        var defaultValue = props[prop][1];

        expect(res[prop]).to.eql(defaultValue);
      });
    });

    it("should copy properties from previous state", () => {
      var previousState = state.createState({
        rotation : [ 1, 1, 1 ]
      });
      var res = state.stateFromOptions({ position : [ 2, 2, 2 ] }, previousState);

      expect(res.rotation).to.eql([ 1, 1, 1 ]);
      expect(res.position).to.eql([ 2, 2, 2 ]);
    });

    it("should overwrite properties from previous state", () => {
      var previousState = state.createState({
        rotation : [ 1, 1, 1 ]
      });
      var res = state.stateFromOptions({ rotation : [ 2, 2, 2 ] }, previousState);

      expect(res.rotation).to.eql([ 2, 2, 2 ]);
    });
  });

  describe("asMatrix", () => {
  });
});
