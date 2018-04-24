"use strict";

import state from "./state.js";
import animation from "./animation.js";
import { ancestor } from "./utils.js";

const { stateFromOptions, createState } = state;


const Animation = animation;

const Engine = {
    runningAnimations   : [],
    completedAnimations : [],
    transformProperty   : "transform",
    raffing             : false,

    scheduleNextFrame() {
        // If we're not scheduling a RAF.
        if(this.raffing) {
            return;
        }
        
        this.raffing = true;

        window.requestAnimationFrame((time) => {
            this.raffing = false;
            this.stepAnimations(time);
        });
    },

    stepAnimations(time) {
        this.runningAnimations.forEach((runningAnimation) => {
            const [ element, anim ] = runningAnimation;

            this.stepAnimation(element, anim, time);
        });

        this.archiveCompletedAnimations();

        if(this.runningAnimations.length > 0) {
            this.scheduleNextFrame();
        }
    },

    stepAnimation(element, anim, time) {
        anim.tick(time);
        anim.updateElement(element);
    },

    archiveCompletedAnimations() {
        const unFinished = this.runningAnimations.filter((anim) => !anim[1].completed());
        const finished = this.runningAnimations.filter((anim) => anim[1].completed());

        const queuedAnimations = this.createQueuedAnimations(finished);
        // Finished and not queued
        const completed = finished.filter((finishedAnimation) => !queuedAnimations.find((queuedAnimation) => queuedAnimation[0] !== finishedAnimation[0]));

        Engine.runningAnimations = unFinished;

        // Filter out just finished animation from previously completed
        this.completedAnimations = this.completedAnimations.filter((anim) => !completed.find((finishedAnimation) => finishedAnimation[0] === anim[0]));
        
        // Concat?
        Array.prototype.push.apply(this.completedAnimations, completed);
        Array.prototype.push.apply(this.runningAnimations, queuedAnimations);

        // Call complete callback
        finished.forEach((anim) => {
            const completeCallback = anim[1].options.complete;

            if(completeCallback) {
                completeCallback();
            }
        });
        
        this.clearOphanedEndStates();
    },

    createQueuedAnimations(finished) {
        var newAnimations = finished.filter((anim) => {
            var chainer = anim[2];

            
            return chainer.index < chainer.queue.length;
        })
        .map((anim) => {
            const [ element, , chainer ] = anim;

            var options = chainer.queue[chainer.index];

            chainer.index++;
            
            return [ anim[0], this.createAnimation(element, options, anim[1].endState()), chainer ];
        });

        return newAnimations;
    },

    createChainer() {
        var chainer = {
            index : 0,
            queue : [],
            snabbt(opts) {
                this.queue.push(opts);
                
                return chainer;
            }
        };

    
        return chainer;
    },

  createAnimation(element, options, previousEndState) {
        const previousState = previousEndState || this.findCurrentState(element);
        const startState = stateFromOptions(options, previousState, true);
        const endState = stateFromOptions(options, previousState, false);

        this.runningAnimations = this.runningAnimations.filter((anim) => element !== anim[0]);
        const anim = Animation.createAnimation(startState, endState, options, this.transformProperty);

        
        return anim;
  },

    stopAnimation(element) {
        const stoppedAnimation = this.runningAnimations.filter((anim) => anim[0] === element);

        this.runningAnimations = this.runningAnimations.filter((anim) => anim[0] !== element);
        Array.prototype.push.apply(this.completedAnimations, stoppedAnimation);
    },

    initializeAnimation(element, arg2, arg3) {
        let anim;

        if(arg2 === "stop") {
            return this.stopAnimation(element);
        }
            anim = this.createAnimation(element, arg2);
        
        const chainer = this.createChainer();

        anim.updateElement(element, true);

        this.runningAnimations.push([ element, anim, chainer ]);
        this.scheduleNextFrame();

        return arg2.manual ? anim : chainer;
    },

    findCurrentState(element) {
        let match =  this.runningAnimations.find((anim) => element === anim[0]);

        if(match) {
        return match[1].getCurrentState();
        }
        match =  this.completedAnimations.find((anim) => element === anim[0]);
        if(match) {
        return match[1].getCurrentState();
        }
    },

    clearOphanedEndStates() {
        this.completedAnimations = this.completedAnimations.filter((anim) => ancestor(anim[0]).body);
    }
};

export default Engine;

export { Animation };
