import easing from "./easing.js";
import tweeners from "./tweeners.js";
import element from "./element.js";

function createAnimation(startState, endState, options, transformProperty) {
    const state = {
        current : null,
        start   : startState,
        end     : endState
    };

    const { duration = 500, delay = 0 } = options;
    const easer = easing.createEaser(options.easing || "linear", options);

    // If there's no duration, our current state is literally the end state.
    state.current = !duration ? state.end.clone() : state.start.clone();

    state.current.transformOrigin = options.transformOrigin;
    state.current.perspective = options.perspective;

    const timespan = {
        start   : -1,
        current : 0
    };

    let startTime = -1;
    let currentTime = 0;
    let started = false;

    // Manual related
    const manualDelayFactor = delay / duration;
    let manual = options.manual;
    let manualValue = 0;
    let manualCallback;

    let tweener;

    // Setup tweener
    if(options.valueFeeder) {
      tweener = tweeners.createValueFeederTweener(options.valueFeeder,
                                                  state.start,
                                                  state.end,
                                                  state.current);
    } else {
      tweener = tweeners.createStateTweener(state.start, state.end, state.current);
    }

  // Public api
  return {
    options,

    endState : () => endState,

    finish(callback) {
        manual = false;
        const manualDuration = duration * manualValue;

        timespan.start = timespan.current - manualDuration;
        manualCallback = callback;
        easer.resetFrom(manualValue);
    },

    rollback(callback) {
        manual = false;
        tweener.setReverse();
        const manualDuration = duration * (1 - manualValue);

        timespan.start = timespan.current - manualDuration;
        manualCallback = callback;
        easer.resetFrom(manualValue);
    },

    tick(time) {
        if(manual) {
            currentTime = time;
            
            return this.updateCurrentTransform();
        }

        // If first tick, set startTime
        if(startTime === -1) {
            startTime = time;
        }

        if(time - startTime >= delay) {
            if(!started && options.start) {
                options.start();
            }
            started = true;
            currentTime = time - delay;

            var curr = Math.min(Math.max(0.0, currentTime - startTime), duration);

            easer.tick(duration === 0 ? 1 : curr / duration);
            this.updateCurrentTransform();

            if(options.update) {
                options.update(curr / duration);
            }

            if(this.completed() && manualCallback) {
                manualCallback();
            }
        }
    },

    getCurrentState : () => currentState,

    setValue(_manualValue) {
      started = true;
      manualValue = Math.min(Math.max(_manualValue, 0.0001), 0.9999 + manualDelayFactor);
    },

    updateCurrentTransform() {
      let tweenValue = easer.getValue();

      if(manual) {
        const value = Math.max(0.00001, manualValue - manualDelayFactor);

        if(easer.isSpring) {
          tweenValue = value;
        } else {
          easer.tick(value, true);
          tweenValue = easer.getValue();
        }
      }
      tweener.tween(tweenValue);
    },

    completed() {
        if(startTime === 0) {
            return false;
        }
      
        return easer.completed();
    },

    updateElement(node, force) {
        if(!started && !force) {
            return;
        }

        const matrix = tweener.asMatrix();
        const properties = tweener.getProperties();

        element.update.transform(node, matrix, transformProperty, properties.perspective, options.staticTransform);
        element.update.properties(node, properties);
    }
  };
}

export default {
  createAnimation
};
