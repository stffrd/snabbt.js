import spring from "./easing/create-spring-easing.js";

const { cos, pow, PI } = Math;

var easings = {
	linear  : (value) => value,
	ease    : (value) => (cos(value * PI + PI) + 1) / 2,
	easeIn  : (value) => value * value,
	easeOut : (value) => -pow(value - 1, 2) + 1
};

const existing = {
	spring
};

// Create an easer
function create(name, options) {
	// TODO: Parameter magic.
	// This function should be replaced at runtime, that's why it throws.
	let fn = () => {
		/* eslint-disable-next-line */
		console.error("An easing function wasn't found");
	};
	
	// if the easing exists, invoke it.
	if(existing[name]) {
		return existing[name](options);
	}

	// If this is one of the four pre-packaged easings, use that
	// HARD ASSUMPTION: if easings[name] isn't found, name is a function
	if(easings[name]) {
		fn = easings[name] ? easings[name] : name;
	}

	// Assign easer to whatever fn became.
	const easer = fn;

	let current = 0;
	let previous;

	return {
		tick : (v) => {
			current  = easer(v);
			previous = v;
		},

		resetFrom : () => (previous = 0),
		getValue  : () => (current),
		completed : () => ((previous >= 1) ? previous : false)
	};
}

export default {
	createEaser        : create,
	createSpringEasing : spring
};
