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

/* prettier-ignore */ export const toFragment = (...p) => el(React.Fragment, ...p);
/* prettier-ignore */ export const empty      = ()     => toFragment();

/* prettier-ignore */ export const header     = (...p) => el('header', ...p);
/* prettier-ignore */ export const nav        = (...p) => el('nav', ...p);
/* prettier-ignore */ export const footer     = (...p) => el('footer', ...p);
/* prettier-ignore */ export const div        = (...p) => el('div', ...p);
/* prettier-ignore */ export const p          = (...p) => el('p', ...p);
/* prettier-ignore */ export const h1         = (...p) => el('h1', ...p);
/* prettier-ignore */ export const h2         = (...p) => el('h2', ...p);
/* prettier-ignore */ export const h3         = (...p) => el('h3', ...p);
/* prettier-ignore */ export const h4         = (...p) => el('h4', ...p);
/* prettier-ignore */ export const h5         = (...p) => el('h5', ...p);
/* prettier-ignore */ export const h6         = (...p) => el('h6', ...p);

/* prettier-ignore */ export const ul         = (...p) => el('ul', ...p);
/* prettier-ignore */ export const ol         = (...p) => el('ol', ...p);
/* prettier-ignore */ export const li         = (...p) => el('li', ...p);
/* prettier-ignore */ export const dl         = (...p) => el('dl', ...p);
/* prettier-ignore */ export const dt         = (...p) => el('dt', ...p);
/* prettier-ignore */ export const dd         = (...p) => el('dd', ...p);

/* prettier-ignore */ export const table      = (...p) => el('table', ...p);
/* prettier-ignore */ export const thead      = (...p) => el('thead', ...p);
/* prettier-ignore */ export const tfoot      = (...p) => el('tfoot', ...p);
/* prettier-ignore */ export const tbody      = (...p) => el('tbody', ...p);
/* prettier-ignore */ export const tr         = (...p) => el('tr', ...p);
/* prettier-ignore */ export const th         = (...p) => el('th', ...p);
/* prettier-ignore */ export const td         = (...p) => el('td', ...p);

/* prettier-ignore */ export const span       = (...p) => el('span', ...p);
/* prettier-ignore */ export const a          = (...p) => el('a', ...p);
/* prettier-ignore */ export const em         = (...p) => el('em', ...p);
/* prettier-ignore */ export const strong     = (...p) => el('strong', ...p);
/* prettier-ignore */ export const mark       = (...p) => el('mark', ...p);

/* prettier-ignore */ export const input      = (...p) => el('input', { type: 'text' }, ...p);
/* prettier-ignore */ export const button     = (...p) => el('button', ...p);
/* prettier-ignore */ export const text       = input;
/* prettier-ignore */ export const textarea   = (...p) => el('textarea', ...p);
/* prettier-ignore */ export const checkbox   = (...p) => el('input', { type: 'checkbox' }, ...p);
/* prettier-ignore */ export const radio      = (...p) => el('input', { type: 'radio' }, ...p);
/* prettier-ignore */ export const select     = (...p) => el('select', ...p);
/* prettier-ignore */ export const option     = (...p) => el('option', ...p);
/* prettier-ignore */ export const file       = (...p) => el('input', { type: 'file' }, ...p);

/* prettier-ignore */ export const br         = (...p) => el('br', ...p);
/* prettier-ignore */ export const hr         = (...p) => el('hr', ...p);
