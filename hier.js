/**
 * Whether something is iterable, not including `string` instances.
 *
 * @param {*} item
 * @param {boolean} [ignoreStrings = true]
 * @return {boolean}
 */
function isIterable(item, ignoreStrings = true) {
  if (!exists(item)) return false;
  if ('function' === typeof item[Symbol.iterator]) {
    return 'string' !== typeof item || !ignoreStrings;
  }
  return false;
}
/**
 * Whether something is not `undefined` or `null`
 *
 * @param {*} item
 * @return {boolean}
 */
function exists(item) {
  return !('undefined' === typeof item || null === item);
}
/**
 * Whether something doesn’t exist or is *not* an empty `string`
 *
 * @param {*} item
 * @return {boolean}
 */
function isEmpty(item) {
  return !exists(item) || '' === item;
}
/**
 * Guarantees an interable, even if passed a non-iterable,
 * except for `undefined` and `null`, which are returned as-is.
 *
 * @param {*} oneOrMany
 * @return {Iterable|Array|null|undefined}
 */
function toIterable(oneOrMany) {
  if (!exists(oneOrMany)) return oneOrMany;
  if (isIterable(oneOrMany)) return oneOrMany;
  return [oneOrMany];
}

/**
 * Creates a `Node` instance.
 *
 * @param {Node|string|null|undefined} name
 * @return {Node}
 */
function createElement(name) {
  if (name instanceof Node) return name;
  if (isEmpty(name)) return document.createDocumentFragment();
  return document.createElement(String(name));
}

/**
 *
 * @param {Iterable|Node|string|Object} param
 * @param {Node} el
 * @return {Node}
 */
function applyToElement(param, el) {
  if (isIterable(param)) {
    for (const item of param) {
      applyToElement(item, el);
    }
    return el;
  }

  if (param instanceof Node) {
    el.appendChild(param);
    return el;
  }

  if ('string' === typeof param) {
    el.appendChild(document.createTextNode(param));
    return el;
  }

  if (exists(param) && 'object' === typeof param) {
    for (const p of [
      ...Object.getOwnPropertyNames(param),
      ...Object.getOwnPropertySymbols(param)
    ]) {
      switch (p) {
        case 'style':
        case 'dataset':
          for (let item in param[p]) {
            if (exists(item)) el[p][item] = param[p][item];
          }
          break;
        case 'class':
        case 'className':
        case 'classList':
          for (const cls of toIterable(param[p])) {
            if (exists(cls)) el.classList.add(cls);
          }
          break;
        default:
          el[p] = param[p];
      }
    }
  }
  return el;
}

/**
 *
 * @param {string|Node|undefined|null} name
 * @param {Iterable} rest
 * @return {Node}
 */
function element(name, ...rest) {
  const el = createElement(name);
  for (const param of rest) {
    applyToElement(param, el);
  }
  return el;
}

const toFragment = (...rest) => element(null, ...rest);
const empty = () => toFragment();

const header = (...rest) => element('header', ...rest);
const nav = (...rest) => element('nav', ...rest);
const footer = (...rest) => element('footer', ...rest);
const div = (...rest) => element('div', ...rest);
const p = (...rest) => element('p', ...rest);
const h1 = (...rest) => element('h1', ...rest);
const h2 = (...rest) => element('h2', ...rest);
const h3 = (...rest) => element('h3', ...rest);
const h4 = (...rest) => element('h4', ...rest);
const h5 = (...rest) => element('h5', ...rest);
const h6 = (...rest) => element('h6', ...rest);

const ul = (...rest) => element('ul', ...rest);
const ol = (...rest) => element('ol', ...rest);
const li = (...rest) => element('li', ...rest);
const dl = (...rest) => element('dl', ...rest);
const dt = (...rest) => element('dt', ...rest);
const dd = (...rest) => element('dd', ...rest);

const table = (...rest) => element('table', ...rest);
const thead = (...rest) => element('thead', ...rest);
const tfoot = (...rest) => element('tfoot', ...rest);
const tbody = (...rest) => element('tbody', ...rest);
const tr = (...rest) => element('tr', ...rest);
const th = (...rest) => element('th', ...rest);
const td = (...rest) => element('td', ...rest);

const span = (...rest) => element('span', ...rest);
const a = (...rest) => element('a', ...rest);
const em = (...rest) => element('em', ...rest);
const strong = (...rest) => element('strong', ...rest);
const mark = (...rest) => element('mark', ...rest);

const input = (...rest) => element('input', { type: 'text' }, ...rest);
const button = (...rest) => element('button', ...rest);
const text = input;
const textarea = (...rest) => element('textarea', ...rest);
const checkbox = (...rest) => element('input', { type: 'checkbox' }, ...rest);
const radio = (...rest) => element('input', { type: 'radio' }, ...rest);
const select = (...rest) => element('select', ...rest);
const option = (...rest) => element('option', ...rest);
const file = (...rest) => element('input', { type: 'file' }, ...rest);

const br = (...rest) => element('br', ...rest);
const hr = (...rest) => element('hr', ...rest);

/**
 * Replaces the entire contents of `oldNode` with `newChild`.
 * It’s generally advisable to use a `DocumentFragment` for the
 * the replacement.
 *
 * @param {Node} oldNode
 * @param {Node|DocumentFragment|NodeList|Array<Node>} newChild
 * @returns {Node}  - The new parent wrapper
 */
function replaceChildren(oldNode, newChild) {
  if (!oldNode) return;
  const tmpParent = oldNode.cloneNode();
  if (newChild) {
    if (newChild instanceof Node) {
      tmpParent.appendChild(newChild);
    } else {
      Array.prototype.forEach.call(newChild, child =>
        tmpParent.appendChild(child)
      );
    }
  }
  oldNode.parentNode.replaceChild(tmpParent, oldNode);
  return tmpParent;
}
/*******************/

class Hierarchy {
  constructor(label, ...children) {
    this.label = label;
    this.children = children || [];
  }
  get leaves() {
    if (0 === this.children.length) {
      return 1;
    }
    return this.children.reduce((prev, curr) => prev + curr.leaves, 0);
  }
  get hasChildren() {
    return this.children.length > 0;
  }
  get depth() {
    const max = (prev, curr) => Math.max(curr.depth, prev);
    return 1 + (this.hasChildren ? this.children.reduce(max, 0) : 0);
  }
  toString(indent = '—') {
    return (
      this.val +
      this.children.reduce(
        (prev, curr) => prev + '\n' + curr.toString(indent + indent[0]),
        ''
      )
    );
  }
}
Hierarchy.from = function from(obj) {
  // TODO
};

// prettier-ignore
const h = new Hierarchy(null, 
  new Hierarchy('1'),
  new Hierarchy('2', 
    new Hierarchy('3', 
      new Hierarchy('4'), 
      new Hierarchy('5')), 
    new Hierarchy('6')
  ), 
  new Hierarchy('7', 
  	new Hierarchy('8', 
      new Hierarchy('9')
    ),
    new Hierarchy('A')
  ),
  new Hierarchy('B', 
    new Hierarchy('C', 
    new Hierarchy('D'), 
      new Hierarchy('E', 
        new Hierarchy('F')
      )
    )
  )
);

function renderHierarchy(hierarchy) {
  // Place holder of temporary hierarchy
  const next = new Hierarchy(null);
  if (0 === hierarchy.children.length) return '';
  /* for (const node of hierarchy.children) {
    row += `<th colspan="${node.leaves}" rowspan="${
      node.hasChildren ? 1 : hierarchy.depth
    }">${node.label}<!--(${node.leaves}, ${
      node.hasChildren ? 1 : hierarchy.depth
    })--></th>`;
    next.children.push(...node.children);
  } */
  const rows = hierarchy.children.map(node => {
    next.children.push(...node.children);
    return th(node.label, {
      colSpan: node.leaves,
      rowSpan: node.hasChildren ? 1 : hierarchy.depth
    });
  });
  return toFragment(tr(rows), renderHierarchy(next));
}

const el = document.querySelector('#dynamic>div');
el.appendChild(table(thead(renderHierarchy(h))));
