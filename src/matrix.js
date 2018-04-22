import { baseline } from "./matrix/matrix-array-assignments.js";
import { css as _css } from "./matrix/matrix-methods.js";


function create() {
    const state = {
        current    : new Float32Array(16),
        multiplier : new Float32Array(16),
        result     : new Float32Array(16)
    };

    // Baseline it so it starts with default matrix values.
    baseline(state.result);

    return {
        state,
        
        css   : () => _css(state.result),
        clear : () => baseline(state.result),
    };
}

export default create;
