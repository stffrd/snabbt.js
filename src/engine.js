"use strict";
/* global document, window */

import state from "./state.js";
import animation from "./animation.js";
import utils from "./utils.js";

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
            const element = runningAnimation[0];
            const anim = runningAnimation[1];

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
            var element = anim[0];
            var chainer = anim[2];
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
    var previousState = previousEndState || this.findCurrentState(element);
    var startState = stateFromOptions(options, previousState, true);
    var endState = stateFromOptions(options, previousState, false);

    this.runningAnimations = this.runningAnimations.filter((anim) => element !== anim[0]);
    var anim = Animation.createAnimation(startState, endState, options, this.transformProperty);

    
    return anim;
  },

  createAttentionAnimation(element, options) {
    var movement = stateFromOptions(options, createState({}, false));

    options.movement = movement;
    var anim = Animation.createAttentionAnimation(options);

    return anim;
  },

    stopAnimation(element) {
        const stoppedAnimation = this.runningAnimations.filter((anim) => anim[0] === element);

        this.runningAnimations = this.runningAnimations.filter((anim) => anim[0] !== element);
        Array.prototype.push.apply(this.completedAnimations, stoppedAnimation);
    },

    initializeAnimation(element, arg2 = "default", arg3) {
        let anim;
        
        // const types = {
        //     attention : (element, two, three) => this.createAttentionAnimation(element, three),
        //     stop      : (element, two, three) => this.stopAnimation(element),
        //     default   : (element, two, three) => this.createAttentionAnimation(element, three)
        // };

       // anim = types[arg2]();

       
        if(arg2 === "attention") {
            anim = this.createAttentionAnimation(element, arg3);
        } else if(arg2 === "stop") {
            return this.stopAnimation(element);
        } else {
            anim = this.createAnimation(element, arg2);
        }
        const chainer = this.createChainer();

        anim.updateElement(element, true);

        this.runningAnimations.push([ element, anim, chainer ]);
        this.scheduleNextFrame();

        return arg2.manual ? anim : chainer;
    },

    findCurrentState(element) {
        var match =  this.runningAnimations.find((anim) => element === anim[0]);

        if(match) {
        return match[1].getCurrentState();
        }
        match =  this.completedAnimations.find((anim) => element === anim[0]);
        if(match) {
        return match[1].getCurrentState();
        }
    },

  clearOphanedEndStates() {
    //
    this.completedAnimations = this.completedAnimations.filter((anim) => utils.ancestor(anim[0]).body);
  }
};

export default Engine;

export { Animation };
