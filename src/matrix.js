import {
    multiplication,
    skew,
    scale,
    baseline,
    overwrite } from "./matrix/matrix-array-assignments.js";

import { rotate as _rotate, translate as _translate } from "./matrix/matrix-methods.js";

function create() {
    const state = {
        current    : new Float32Array(16),
        multiplier : new Float32Array(16),
        result     : new Float32Array(16)
    };

    baseline(state.result);

    return {
        data : state.result,

        css() {
            const matrix = state.result.map((item) => ((item < 0.0001) ? 0 : item.toFixed(10)));

            return `matrix3d(${matrix.join(",")})`;
        },

        clear : () => baseline(state.result),

        translate(x, y, z) {
            return _translate(this, state, [ x, y, z ]);
        },

        rotateX(radians) {
            return _rotate(this, state, [ radians, null, null ]);
        },

        rotateY(radians) {
            return _rotate(this, state, [ null, radians, null ]);
        },

        rotateZ(radians) {
            return _rotate(this, state, [ null, null, radians ]);
        },

        scale(x, y) {
            // return _scale(this, state[ x, y ]);
        },
        

        skew(ax, ay) {
            overwrite(state.result, state.current);
            skew(state.multiplier, ax, ay);
            multiplication(state.current, state.multiplier, state.result);
            
            return this;
        }
    };
}

export default create;
