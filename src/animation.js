import easing from "./easing.js";
import tweeners from "./tweeners.js";
import state from "./state.js";
import element from "./element.js";

function createAnimation(startState, endState, options, transformProperty) {
  const duration = options.duration || 500;

  const delay = options.delay || 0;
  const easer = easing.createEaser(options.easing || "linear", options);
  const currentState = duration === 0 ? endState.clone() : startState.clone();

  currentState.transformOrigin = options.transformOrigin;
  currentState.perspective = options.perspective;

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
                                                startState,
                                                endState,
                                                currentState);
  } else {
    tweener = tweeners.createStateTweener(startState, endState, currentState);
  }

  // Public api
  return {
    options,

    endState : () => endState,

    finish(callback) {
      manual = false;
      var manualDuration = duration * manualValue;

      startTime = currentTime - manualDuration;
      manualCallback = callback;
      easer.resetFrom(manualValue);
    },

    rollback(callback) {
      manual = false;
      tweener.setReverse();
      var manualDuration = duration * (1 - manualValue);

      startTime = currentTime - manualDuration;
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
      var tweenValue = easer.getValue();

      if(manual) {
        var value = Math.max(0.00001, manualValue - manualDelayFactor);

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

    updateElement(el, forceUpdate) {
        if(!started && !forceUpdate) {
            return;
        }
        var matrix = tweener.asMatrix();
        var properties = tweener.getProperties();

        element.update.transform(el, matrix, transformProperty, properties.perspective, options.staticTransform);
        element.update.properties(el, properties);
    }
  };
}

export default {
  createAnimation
};
