
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
    options = options || defaults;
    
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
        
		tick(value, manual) {
			if(value === 0.0 || manual) {
				return;
			}

			if(equilibrium) {
				return;
            }
            
            // force = mass * acceleration
			// acceleration = force / mass
			const force = -(pos.current - pos.equilibrium) * spring.constant;

            // speed = velocity * time
			// t = 1 ( for now )
			const acceleration = force / spring.mass;


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
