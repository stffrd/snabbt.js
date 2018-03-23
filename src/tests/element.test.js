"use strict";

const { expect } = require("chai");
const m = {};

let element;

describe("element", () => {
  before(() => {
    require("./lib/compile")("./src/element.js", m).then(() => {
      element = m.exports;
    });
  });

  describe("Update Element Transform", () => {
    var matrix;

    beforeEach(() => {
      matrix = {
        asCSS() {
          return "matrix-as-css";
        }
      };
    });

    it("should add perspective before matrix if defined", () => {
      const el = { style : {} };
      const perspective = 500;
      const transformProperty = "transform";

      element.update.transform(el, matrix, transformProperty, perspective);

      expect(el.style[transformProperty]).to.equal(`perspective(${perspective}px) matrix-as-css`);
    });
  });
});
