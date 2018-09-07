import React from 'react';
import ReactDOM from 'react-dom';

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
    dispatch(thing);
  }
  return React.createElement(name, props, ...children);
}

export function renderInto(component, element) {
  return ReactDOM.render(component, element);
}

export const toFragment = (...rest) => reactComponent(React.Fragment, ...rest);
export const empty = () => toFragment();

export const header = (...rest) => reactComponent('header', ...rest);
export const nav = (...rest) => reactComponent('nav', ...rest);
export const footer = (...rest) => reactComponent('footer', ...rest);
export const div = (...rest) => reactComponent('div', ...rest);
export const p = (...rest) => reactComponent('p', ...rest);
export const h1 = (...rest) => reactComponent('h1', ...rest);
export const h2 = (...rest) => reactComponent('h2', ...rest);
export const h3 = (...rest) => reactComponent('h3', ...rest);
export const h4 = (...rest) => reactComponent('h4', ...rest);
export const h5 = (...rest) => reactComponent('h5', ...rest);
export const h6 = (...rest) => reactComponent('h6', ...rest);

export const ul = (...rest) => reactComponent('ul', ...rest);
export const ol = (...rest) => reactComponent('ol', ...rest);
export const li = (...rest) => reactComponent('li', ...rest);
export const dl = (...rest) => reactComponent('dl', ...rest);
export const dt = (...rest) => reactComponent('dt', ...rest);
export const dd = (...rest) => reactComponent('dd', ...rest);

export const table = (...rest) => reactComponent('table', ...rest);
export const thead = (...rest) => reactComponent('thead', ...rest);
export const tfoot = (...rest) => reactComponent('tfoot', ...rest);
export const tbody = (...rest) => reactComponent('tbody', ...rest);
export const tr = (...rest) => reactComponent('tr', ...rest);
export const th = (...rest) => reactComponent('th', ...rest);
export const td = (...rest) => reactComponent('td', ...rest);

export const span = (...rest) => reactComponent('span', ...rest);
export const a = (...rest) => reactComponent('a', ...rest);
export const em = (...rest) => reactComponent('em', ...rest);
export const strong = (...rest) => reactComponent('strong', ...rest);
export const mark = (...rest) => reactComponent('mark', ...rest);

export const input = (...rest) =>
  reactComponent('input', { type: 'text' }, ...rest);
export const button = (...rest) => reactComponent('button', ...rest);
export const text = input;
export const textarea = (...rest) => reactComponent('textarea', ...rest);
export const checkbox = (...rest) =>
  reactComponent('input', { type: 'checkbox' }, ...rest);
export const radio = (...rest) =>
  reactComponent('input', { type: 'radio' }, ...rest);
export const select = (...rest) => reactComponent('select', ...rest);
export const option = (...rest) => reactComponent('option', ...rest);
export const file = (...rest) =>
  reactComponent('input', { type: 'file' }, ...rest);

export const br = (...rest) => reactComponent('br', ...rest);
export const hr = (...rest) => reactComponent('hr', ...rest);
