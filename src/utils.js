"use strict";

function isFunction(object) {
  return typeof object === "function";
}

function optionOrDefault(option, def) {
  if(option === undefined) {
    return def;
  }
  
  return option;
}

function updateElementTransform(element, matrix, transformProperty, perspective, staticTransform) {
  const cssPerspective = perspective ? `perspective(${perspective}px) ` : "";
  const cssMatrix = matrix.asCSS();
  const cssStaticTransform = staticTransform ? staticTransform : "";
  
  if(transformProperty) {
    element.style[transformProperty] = cssStaticTransform + cssPerspective + cssMatrix;
  } else {
    element.style.transform = cssStaticTransform + cssPerspective + cssMatrix;
  }
}

const updateElementProperties = function(element, properties) {
  // Consider: Multiple Object.Assign calls.
  // Test for perf.
  
  for(const key in properties) {
    if(key === "perspective") {
      continue;
    }
    element.style[key] = properties[key];
  }
};

function duplicate(object) {
  return Object.assign(Object.create(null), object);
}

function findUltimateAncestor(node) {
  var ancestor = node;
  
  while(ancestor.parentNode) {
    ancestor = ancestor.parentNode;
  }
  
  return ancestor;
}

export default {
  optionOrDefault,
  updateElementTransform,
  updateElementProperties,
  isFunction,
  duplicate,
  findUltimateAncestor
};
