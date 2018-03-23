import utils from "../utils.js";

// Shove defaults into this object
const defaults = {
    startPosition       : 0,
    equilibriumPosition : 1,
    springConstant      : 0.8,
    springDeceleration  : 0.9,
    springMass          : 10,
    initialVelocity     : 0
};

export default function createSpringEasing(options) {
    const pos = {
        current     : options.startPosition || 0,
        equilibrium : options.equilibriumPosition || 1
    };

    const spring = {
        constant     : options.springConstant || 0.8,
        deceleration : options.springDeceleration || 0.9,
        mass         : options.springMass || 10
    };

    let velocity = options.initialVelocity || 0;
	let equilibrium = false;

	// Public API
	return {
		isSpring : true,
		tick(value, isManual) {
			if(value === 0.0 || isManual) {
				return;
			}

			if(equilibrium) {
				return;
			}

			var force = -(pos.current - pos.equilibrium) * spring.constant;
			// f = m * a
			// a = f / m
			var acceleration = force / spring.mass;
			// s = v * t
			// t = 1 ( for now )

			velocity += acceleration;
			pos.current += velocity;

			// Deceleration
            velocity *= spring.deceleration;
            
			if(Math.abs(pos.current - pos.equilibrium) < 0.001 && Math.abs(velocity) < 0.001) {
				equilibrium = true;
			}
		},

		resetFrom(value) {
			pos.current = value;
			velocity = 0;
		},


		getValue  : () => (equilibrium ? pos.equilibrium : pos.current),
		completed : () => equilibrium
	};
}
