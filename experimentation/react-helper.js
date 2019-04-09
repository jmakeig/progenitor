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

/**
 * Whether something is a React type.
 *
 * @param {*} obj
 * @return {boolean}
 */
function isReact(obj) {
  if (!exists(obj)) return false;
  return (
    obj instanceof React.Component ||
    Symbol.for('react.element') === obj['$$typeof']
  );
}

/**
 *
 * @param {String|React.Component} name
 * @param  {...any} stuff Any combination of properties object or React.Component
 *                        Iterables will be flattened  and applied recusively
 * @return {React.DetailedReactHTMLElement} Same as `React.createElement`
 */
function componentInstance(name, ...stuff) {
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

/**
 * @function
 * @param {string|React.Component} name - The name or component type
 * @return {function}
 */
const curryComponentInstance = name => (...params) =>
  componentInstance(name, ...params);

/* prettier-ignore */ export const toFragment = (...p) => componentInstance(React.Fragment, ...p);
/* prettier-ignore */ export const empty      = ()     => toFragment();

/* prettier-ignore */ export const header     = curryComponentInstance('header');
/* prettier-ignore */ export const nav        = curryComponentInstance('nav');
/* prettier-ignore */ export const footer     = curryComponentInstance('footer');
/* prettier-ignore */ export const div        = curryComponentInstance('div');
/* prettier-ignore */ export const p          = curryComponentInstance('p');
/* prettier-ignore */ export const h1         = curryComponentInstance('h1');
/* prettier-ignore */ export const h2         = curryComponentInstance('h2');
/* prettier-ignore */ export const h3         = curryComponentInstance('h3');
/* prettier-ignore */ export const h4         = curryComponentInstance('h4');
/* prettier-ignore */ export const h5         = curryComponentInstance('h5');
/* prettier-ignore */ export const h6         = curryComponentInstance('h6');

/* prettier-ignore */ export const ul         = curryComponentInstance('ul');
/* prettier-ignore */ export const ol         = curryComponentInstance('ol');
/* prettier-ignore */ export const li         = curryComponentInstance('li');
/* prettier-ignore */ export const dl         = curryComponentInstance('dl');
/* prettier-ignore */ export const dt         = curryComponentInstance('dt');
/* prettier-ignore */ export const dd         = curryComponentInstance('dd');

/* prettier-ignore */ export const table      = curryComponentInstance('table');
/* prettier-ignore */ export const thead      = curryComponentInstance('thead');
/* prettier-ignore */ export const tfoot      = curryComponentInstance('tfoot');
/* prettier-ignore */ export const tbody      = curryComponentInstance('tbody');
/* prettier-ignore */ export const tr         = curryComponentInstance('tr');
/* prettier-ignore */ export const th         = curryComponentInstance('th');
/* prettier-ignore */ export const td         = curryComponentInstance('td');

/* prettier-ignore */ export const span       = curryComponentInstance('span');
/* prettier-ignore */ export const a          = curryComponentInstance('a');
/* prettier-ignore */ export const em         = curryComponentInstance('em');
/* prettier-ignore */ export const strong     = curryComponentInstance('strong');
/* prettier-ignore */ export const mark       = curryComponentInstance('mark');

/* prettier-ignore */ export const input      = (...p) => componentInstance('input', { type: 'text' }, ...p);
/* prettier-ignore */ export const button     = curryComponentInstance('button');
/* prettier-ignore */ export const text       = input;
/* prettier-ignore */ export const textarea   = curryComponentInstance('textarea');
/* prettier-ignore */ export const checkbox   = (...p) => componentInstance('input', { type: 'checkbox' }, ...p);
/* prettier-ignore */ export const radio      = (...p) => componentInstance('input', { type: 'radio' }, ...p);
/* prettier-ignore */ export const select     = curryComponentInstance('select');
/* prettier-ignore */ export const option     = curryComponentInstance('option');
/* prettier-ignore */ export const file       = (...p) => componentInstance('input', { type: 'file' }, ...p);

/* prettier-ignore */ export const br         = curryComponentInstance('br');
/* prettier-ignore */ export const hr         = curryComponentInstance('hr');
