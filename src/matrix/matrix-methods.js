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


export function translate(instance, state, [ x, y, z ]) {
    overwrite(state.result, state.current);
    mtranslate(state.multiplier, x, y, z);
    multiplication(state.current, state.multiplier, state.result);
    
    return instance;
}

export function rotate(instance, state, radians) {
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
        mrx(state.multiplier, z);
        multiplication(state.current, state.multiplier, state.result);
    }
    
    return instance;
}

export function scale(instance, state, [ x, y ]) {
    overwrite(state.result, state.current);
    mscale(state.multiplier, x, y);
    multiplication(state.current, state.multiplier, state.result);
    
    return instance;
}

export function skew(instance, state, [ ax, ay ]) {
    overwrite(state.result, state.current);
    mskew(state.multiplier, ax, ay);
    multiplication(state.current, state.multiplier, state.result);
    
    return instance;
}
