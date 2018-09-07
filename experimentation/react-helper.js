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

function el(name, ...stuff) {
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
      for (let p in thing) {
        switch (p) {
          case 'style':
          case 'dataset':
            props[p] = Object.assign({}, props[p], thing[p]);
            break;
          default:
            props[p] = thing[p];
        }
      }
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

export const toFragment = (...p) => el(React.Fragment, ...p);
export const empty      = ()     => toFragment();

export const header     = (...p) => el('header', ...p);
export const nav        = (...p) => el('nav', ...p);
export const footer     = (...p) => el('footer', ...p);
export const div        = (...p) => el('div', ...p);
export const p          = (...p) => el('p', ...p);
export const h1         = (...p) => el('h1', ...p);
export const h2         = (...p) => el('h2', ...p);
export const h3         = (...p) => el('h3', ...p);
export const h4         = (...p) => el('h4', ...p);
export const h5         = (...p) => el('h5', ...p);
export const h6         = (...p) => el('h6', ...p);

export const ul         = (...p) => el('ul', ...p);
export const ol         = (...p) => el('ol', ...p);
export const li         = (...p) => el('li', ...p);
export const dl         = (...p) => el('dl', ...p);
export const dt         = (...p) => el('dt', ...p);
export const dd         = (...p) => el('dd', ...p);

export const table      = (...p) => el('table', ...p);
export const thead      = (...p) => el('thead', ...p);
export const tfoot      = (...p) => el('tfoot', ...p);
export const tbody      = (...p) => el('tbody', ...p);
export const tr         = (...p) => el('tr', ...p);
export const th         = (...p) => el('th', ...p);
export const td         = (...p) => el('td', ...p);

export const span       = (...p) => el('span', ...p);
export const a          = (...p) => el('a', ...p);
export const em         = (...p) => el('em', ...p);
export const strong     = (...p) => el('strong', ...p);
export const mark       = (...p) => el('mark', ...p);

export const input      = (...p) => el('input', { type: 'text' }, ...p);
export const button     = (...p) => el('button', ...p);
export const text       = input;
export const textarea   = (...p) => el('textarea', ...p);
export const checkbox   = (...p) => el('input', { type: 'checkbox' }, ...p);
export const radio      = (...p) => el('input', { type: 'radio' }, ...p);
export const select     = (...p) => el('select', ...p);
export const option     = (...p) => el('option', ...p);
export const file       = (...p) => el('input', { type: 'file' }, ...p);

export const br         = (...p) => el('br', ...p);
export const hr         = (...p) => el('hr', ...p);
