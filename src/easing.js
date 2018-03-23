import spring from "./easing/create-spring-easing.js";

var easings = {
	linear  : (value) => value,
	ease    : (value) => (Math.cos(value * Math.PI + Math.PI) + 1) / 2,
	easeIn  : (value) => value * value,
	easeOut : (value) => -Math.pow(value - 1, 2) + 1
};

const existing = {
	spring
};

// Create an easer
function create(name, options) {
	// TODO: Parameter magic.
	let fn = () => {
		throw new Error("An easing function wasn't found");
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
