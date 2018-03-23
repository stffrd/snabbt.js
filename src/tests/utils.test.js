"use strict";

const { expect } = require("chai");
const m = {};

let utils;

describe("utils", () => {
  before(() => {
    require("./lib/compile")("./src/utils.js", m).then(() => {
      utils = m.exports;
    });
  });

  describe("isFunction", () => {
    it("should return true for function", () => {
      var fun = () => {};

      expect(utils.isFunction(fun)).to.be.ok;
    });

    it("should return false for non-function", () => {
      var fun = "[Function]";

      expect(utils.isFunction(fun)).to.not.be.ok;
    });
  });
});
