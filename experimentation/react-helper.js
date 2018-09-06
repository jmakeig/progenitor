import React from 'react';

/**
 * Whether something is not `undefined` or `null`
 *
 * @param {*} item
 * @return {boolean}
 */
function exists(item) {
  return !('undefined' === typeof item || null === item);
}

function isPrimitive(obj) {
  switch (typeof obj) {
    case 'string':
    case 'number':
    case 'boolean':
    case 'undefined':
      return true;
    case 'object':
      return null === obj;
  }
  return false;
}

function isIterable(item, ignoreStrings = true) {
  if (!exists(item)) return false;
  if ('function' === typeof item[Symbol.iterator]) {
    return 'string' !== typeof item || !ignoreStrings;
  }
  return false;
}

function isReact(obj) {
  return (
    obj instanceof React.Component ||
    Symbol.for('react.element') === obj['$$typeof']
  );
}

function reactComponent(name, ...stuff) {
  // console.log(name);
  const props = {};
  const children = [];

  function dispatch(thing) {
    if (isReact(thing) || isPrimitive(thing)) {
      children.push(thing);
    } else if ('function' === typeof thing) {
      // Doesn’t allow for passing props. Is this right?
      children.push(React.createElement(thing));
    } else if (isIterable(thing)) {
      for (const item of thing) {
        dispatch(item);
      }
    } else {
      Object.assign(props, thing);
    }
  }
  for (const thing of stuff) {
    //console.log(Object.prototype.toString.call(thing));
    //console.log(thing);
    dispatch(thing);
  }
  return React.createElement(name, props, ...children);
}

export function h1(...stuff) {
  return reactComponent('h1', ...stuff);
}
export function table(...stuff) {
  return reactComponent('table', ...stuff);
}
export function thead(...stuff) {
  return reactComponent('thead', ...stuff);
}
export function tbody(...stuff) {
  return reactComponent('tbody', ...stuff);
}
export function tr(...stuff) {
  return reactComponent('tr', ...stuff);
}
export function th(...stuff) {
  return reactComponent('th', ...stuff);
}
export function td(...stuff) {
  return reactComponent('td', ...stuff);
}
export function div(...stuff) {
  return reactComponent('div', ...stuff);
}
export function toFragment(...stuff) {
  return reactComponent(React.Fragment, ...stuff);
}
export function empty() {
  return toFragment();
}
