import { baseline } from "./matrix/matrix-array-assignments.js";

import {
    css as _css,

    rotate as _rotate,
    translate as _translate,
    scale as _scale,
    skew as _skew
} from "./matrix/matrix-methods.js";


function create() {
    const state = {
        current    : new Float32Array(16),
        multiplier : new Float32Array(16),
        result     : new Float32Array(16)
    };

    baseline(state.result);

    return {
        data : state.result,

        css   : () => _css(state.result),
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
            return _scale(this, state, [ x, y ]);
        },

        skew(ax, ay) {
            return _skew(this, state, [ ax, ay ]);
        }
    };
}

export default create;
