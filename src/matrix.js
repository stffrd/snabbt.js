import {
    multiplication,
    translate,
    rotatex, rotatey, rotatez,
    skew,
    scale,
    baseline,
    copy } from "./matrix/matrix-operations";

const assignedMatrixMultiplication = multiplication;
const assignTranslate = translate;
const assignRotateX = rotatex;
const assignRotateY = rotatey;
const assignRotateZ = rotatez;
const assignSkew = skew;
const assignScale = scale;
const assignIdentity = baseline;
const copyArray = copy;

function createMatrix() {
    const data = new Float32Array(16);

    const state = {
        current    : new Float32Array(16),
        multiplier : new Float32Array(16)
    };

    baseline(data);

    return {
        data,

        asCSS() {
            const matrix = data.map((item) => ((item < 0.0001) ? 0 : item.toFixed(10)));

            return `matrix3d(${matrix.join(",")})`;
        },

        clear : () => baseline(data),

        translate(x, y, z) {
            copyArray(data, state.current);
            assignTranslate(state.multiplier, x, y, z);
            assignedMatrixMultiplication(state.current, state.multiplier, data);
            
            return this;
        },

        rotateX(radians) {
            copyArray(data, state.current);
            assignRotateX(state.multiplier, radians);
            assignedMatrixMultiplication(state.current, state.multiplier, data);
            
            return this;
        },

        rotateY(radians) {
            copyArray(data, state.current);
            assignRotateY(state.multiplier, radians);
            assignedMatrixMultiplication(state.current, state.multiplier, data);
            
            return this;
        },

        rotateZ(radians) {
            copyArray(data, state.current);
            assignRotateZ(state.multiplier, radians);
            assignedMatrixMultiplication(state.current, state.multiplier, data);
            
            return this;
        },

        scale(x, y) {
            copyArray(data, state.current);
            assignScale(state.multiplier, x, y);
            assignedMatrixMultiplication(state.current, state.multiplier, data);
            
            return this;
        },

        skew(ax, ay) {
            copyArray(data, state.current);
            assignSkew(state.multiplier, ax, ay);
            assignedMatrixMultiplication(state.current, state.multiplier, data);
            
            return this;
        }
  };
}

export default createMatrix;
