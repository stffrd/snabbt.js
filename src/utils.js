export function _function(fn) {
  return typeof fn === "function";
}

export function noop() {
  return;
}

export function duplicate(object) {
  return Object.assign(Object.create(null), object);
}

export function ancestor(node) {
  let current = node;
  
  while(current.parentNode) {
    current = current.parentNode;
  }
  
  return current;
}

