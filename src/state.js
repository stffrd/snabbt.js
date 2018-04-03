"use strict";

import createMatrix from "./matrix.js";
import prp from "./properties.js";

import utils from "./utils.js";

const { fromPrefixed, types, tweenableProperties:props } = prp;

function createState(config, useDefault) {
    /*
    So here's what's happening:

    Someone passes a config with transform data (skew, rotate, position, etc)
    and then this fucking function just creates an api object to export and then
    SLAMS ALL OF THE CONFIG ONTO THE FUCKING API OBJECT.
    GET THE FUCK OUT OF HERE WITH THAT SHIT, JESUS CHRIST.
    */
    var matrix = createMatrix();
    const properties = {
        opacity     : undefined,
        width       : undefined,
        height      : undefined,
        perspective : undefined
    };

  // Public API
    const API = {

        clone() {
        const imposter = {};

        Object.keys(props).forEach((property) => {
            var type = props[property][0];

            if(this[property]) {
                imposter[property] = type === types.SCALAR ? this[property] : this[property].slice(0);
            }
        });

        return createState(imposter);
        },

        asMatrix() {
            const m = matrix;

            m.clear();

            if(this.transformOrigin) {
                m.translate(-this.transformOrigin[0], -this.transformOrigin[1], -this.transformOrigin[2]);
            }

            if(this.scale) {
                m.scale(this.scale[0], this.scale[1]);
            }

            if(this.skew) {
                m.skew(this.skew[0], this.skew[1]);
            }

            if(this.rotation) {
                m.rotateX(this.rotation[0]);
                m.rotateY(this.rotation[1]);
                m.rotateZ(this.rotation[2]);
            }

            if(this.position) {
                m.translate(this.position[0], this.position[1], this.position[2]);
            }

            if(this.rotationPost) {
                m.rotateX(this.rotationPost[0]);
                m.rotateY(this.rotationPost[1]);
                m.rotateZ(this.rotationPost[2]);
            }

            if(this.scalePost) {
                m.scale(this.scalePost[0], this.scalePost[1]);
            }

            if(this.transformOrigin) {
                m.translate(this.transformOrigin[0], this.transformOrigin[1], this.transformOrigin[2]);
            }
        
            return m;
        },

        getProperties() {
            properties.opacity = this.opacity;
            properties.width = `${this.width}px`;
            properties.height = `${this.height}px`;
            properties.perspective = this.perspective;
            
            return properties;
        }
    };

  Object.keys(props).forEach((property) => {
    if(useDefault) {
    API[property] = (config[property] || props[property][1]);
    } else {
    API[property] = config[property];
    }
  });

  return API;
}

function stateFromOptions(options, previousState, useFromPrefix) {
  var state = previousState && previousState.clone() || createState({}, true);

  var propName = useFromPrefix ? fromPrefixed : (p) => p;

  Object.keys(props).forEach((key) => {
    state[key] = (options[propName(key)] || state[key]);
    if(state[key] && state[key].slice) {
      state[key] = state[key].slice();
    }
  });

  return state;
}

export default {
  createState,
  stateFromOptions
};
