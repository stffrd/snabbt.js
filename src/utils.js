function _function(fn) {
  return typeof fn === "function";
}

function duplicate(object) {
  return Object.assign(Object.create(null), object);
}

function ancestor(node) {
  let current = node;
  
  while(current.parentNode) {
    current = current.parentNode;
  }
  
  return current;
}

export default {
  isFunction : _function,
  duplicate,
  ancestor
};
