import {
    translate as mtranslate,
    rotatex as mrx,
    rotatey as mry,
    rotatez as mrz,

    scale as mscale,
    skew as mskew,

    multiplication,
    overwrite
} from "./matrix-array-assignments.js";

// Take a matrix state and modify the parts that correspond to translates
export function translate(matrix, [ x, y, z ]) {
    const { state } = matrix;

    overwrite(state.result, state.current);
    mtranslate(state.multiplier, x, y, z);
    multiplication(state.current, state.multiplier, state.result);

    return matrix;
}

// Take a matrix state and modify the parts that correspond to rotates
// this function processes x, y, z sequentially
export function rotate(matrix, radians) {
    const { state } = matrix;

    const [ x, y, z ] = radians;
    
    if(x) {
        overwrite(state.result, state.current);
        mrx(state.multiplier, x);
        multiplication(state.current, state.multiplier, state.result);
    }

    if(y) {
        overwrite(state.result, state.current);
        mry(state.multiplier, y);
        multiplication(state.current, state.multiplier, state.result);
    }

    if(z) {
        overwrite(state.result, state.current);
        mrz(state.multiplier, z);
        multiplication(state.current, state.multiplier, state.result);
    }

    return matrix;
}

// Take a matrix state and modify the parts that correspond to scaling
export function scale(matrix, [ x, y ]) {
    const { state } = matrix;

    overwrite(state.result, state.current);
    mscale(state.multiplier, x, y);
    multiplication(state.current, state.multiplier, state.result);

    return matrix;
}

// Take a matrix state and modify the parts that correspond to skewing
export function skew(matrix, [ ax, ay ]) {
    const { state } = matrix;

    overwrite(state.result, state.current);
    mskew(state.multiplier, ax, ay);
    multiplication(state.current, state.multiplier, state.result);

    return matrix;
}

// Turn a matrix into CSS
export function css(matrix) {
    const m = matrix.map((item) => ((item < 0.0001) ? 0 : item.toFixed(10)));

    return `matrix3d(${m.join(",")})`;
}
