
function linear(value) {
	return value;
}

function ease(value) {
	return (Math.cos(value * Math.PI + Math.PI) + 1) / 2;
}

function easeIn(value) {
	return value * value;
}

function easeOut(value) {
	return -Math.pow(value - 1, 2) + 1;
}

export default {
	linear,
	ease,
	easeIn,
	easeOut
};
