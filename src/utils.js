function _function(fn) {
  return typeof fn === "function";
}

function optionOrDefault(option, def) {
  return option ? option : def;
}

function duplicate(object) {
  return Object.assign(Object.create(null), object);
}

function findUltimateAncestor(node) {
  let current = node;
  
  while(current.parentNode) {
    current = current.parentNode;
  }
  
  return current;
}

export default {
  optionOrDefault,
  isFunction : _function,
  duplicate,
  findUltimateAncestor
};
