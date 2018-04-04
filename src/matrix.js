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
    var data = new Float32Array(16);
    var a = new Float32Array(16);
    var b = new Float32Array(16);

    assignIdentity(data);

    return {
        data,
        
        css() {

        },

        asCSS() {
            const matrix = data.map((item) => ((item < 0.0001) ? 0 : item.toFixed(10)));

            return `matrix3d(${matrix.join(",")})`;
        },

        clear() {
            assignIdentity(data);
        },

        translate(x, y, z) {
            copyArray(data, a);
            assignTranslate(b, x, y, z);
            assignedMatrixMultiplication(a, b, data);
            
            return this;
        },

        rotateX(radians) {
            copyArray(data, a);
            assignRotateX(b, radians);
            assignedMatrixMultiplication(a, b, data);
            
            return this;
        },

        rotateY(radians) {
            copyArray(data, a);
            assignRotateY(b, radians);
            assignedMatrixMultiplication(a, b, data);
            
            return this;
        },

        rotateZ(radians) {
            copyArray(data, a);
            assignRotateZ(b, radians);
            assignedMatrixMultiplication(a, b, data);
            
            return this;
        },

        scale(x, y) {
            copyArray(data, a);
            assignScale(b, x, y);
            assignedMatrixMultiplication(a, b, data);
            
            return this;
        },

        skew(ax, ay) {
            copyArray(data, a);
            assignSkew(b, ax, ay);
            assignedMatrixMultiplication(a, b, data);
            
            return this;
        }
  };
}

export default createMatrix;
