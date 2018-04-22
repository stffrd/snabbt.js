"use strict";

const { expect } = require("chai");
const m = {};

let utils;
let fn;

describe("utils", () => {
  before(() => {
    require("./lib/compile")("./src/utils.js", m).then(() => {
      fn = m.exports._function;
    });
  });

  describe("isFunction", () => {
    it("should return true for function", () => {
      var fun = () => {};

      expect(fn(fun)).to.be.ok;
    });

    it("should return false for non-function", () => {
      var fun = "[Function]";

      expect(fn(fun)).to.not.be.ok;
    });
  });
});
