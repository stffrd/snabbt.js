import { _function as isFunction, noop } from "./utils.js";
import Engine from "./engine.js";
import properties from "./properties.js";
import createMatrix from "./matrix.js";

const { preprocessOptions } = properties;

function snabbt(elements, arg2, arg3) {
    if(!elements.length) {
        if(typeof arg2 === "string") {
        return Engine.initializeAnimation(elements, arg2, preprocessOptions(arg3, 0, 1));
    }
    
    return Engine.initializeAnimation(elements, preprocessOptions(arg2, 0, 1), arg3);
  }

    const chainers = [];
    const aggregateChainer = {
        snabbt(opts) {
            var len = chainers.length;

            chainers.forEach((chainer, index) => chainer.snabbt(preprocessOptions(opts, index, len)));
            
            return aggregateChainer;
        },

        setValue(value) {
            chainers.forEach((chainer) => chainer.setValue(value));
        
            return aggregateChainer;
        },

        finish(callback) {
            chainers.forEach((chainer, index) => {
                if(isFunction(callback)) {
                    return chainer.finish(() => callback(index, chainers.length));
                }
                chainer.finish();
            });
        
            return aggregateChainer;
        },
        
        rollback(callback) {
        chainers.forEach((chainer, index) => {
            if(isFunction(callback)) {
                return chainer.rollback(() => callback(index, chainers.length));
            }
            chainer.rollback();
        });
        
            return aggregateChainer;
        }
    };

    for(let i = 0, len = elements.length; i < len; ++i) {
        const stringarg = typeof arg2 === "string";
        const args = [
            elements[i],
            stringarg ? arg2 : preprocessOptions(arg2, i, len),
            stringarg ? preprocessOptions(arg3, i, len) : arg3
        ];

        chainers.push(Engine.initializeAnimation(...args));
    }
  
    return aggregateChainer;
}

export default function(element, something, other) {
  return snabbt(element, something, other);
}

export { createMatrix };

export const sequence = (queue) => {
  let i = -1;

  const next = () => {
    ++i;
    if(i > queue.length - 1) {
      return;
    }

    const [ element, options ] = queue[i];
    const previousAllDone = options.allDone;

    options.allDone = previousAllDone ? () => {
      previousAllDone(); next();
    } : next;
        
    snabbt(element, options);
  };

  next();
};

export { Engine };

