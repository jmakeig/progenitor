function isIterable(item, ignoreStrings = true) {
  if (!exists(item)) return false;
  if ('function' === typeof item[Symbol.iterator]) {
    return 'string' !== typeof item || !ignoreStrings;
  }
  return false;
}

function exists(item) {
  return !('undefined' === typeof item || null === item);
}

function isEmpty(item) {
  return !exists(item) || '' === item;
}

function toIterable(oneOrMany) {
  if (!exists(oneOrMany)) return oneOrMany;
  if (isIterable(oneOrMany)) return oneOrMany;
  return [oneOrMany];
}

function createElement(name) {
  if (name instanceof Node) return name;
  if (isEmpty(name)) return document.createDocumentFragment();
  return document.createElement(String(name));
}

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

  if ('function' === typeof param) {
    return applyToElement(param(), el);
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

const input = (...rest) =>
  element(
    'input',
    {
      type: 'text'
    },
    ...rest
  );
const button = (...rest) => element('button', ...rest);
const text = input;
const textarea = (...rest) => element('textarea', ...rest);
const checkbox = (...rest) =>
  element(
    'input',
    {
      type: 'checkbox'
    },
    ...rest
  );
const radio = (...rest) =>
  element(
    'input',
    {
      type: 'radio'
    },
    ...rest
  );
const select = (...rest) => element('select', ...rest);
const option = (...rest) => element('option', ...rest);
const file = (...rest) =>
  element(
    'input',
    {
      type: 'file'
    },
    ...rest
  );

const br = (...rest) => element('br', ...rest);
const hr = (...rest) => element('hr', ...rest);

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

const capabilities = [
  {
    id: '60c1e19a-2f50-44e8-98bc-2396c61e6457',
    parents: ['1.', 'a', 'i'],
    label: 'First'
  },
  {
    id: '9bc9d958-ef5d-4fa8-9185-45f302f7edcd',
    parents: ['1.', 'a', 'i'],
    label: 'Second'
  },
  {
    id: '720216b5-9912-4dfd-aaa6-72dfc37d6097',
    parents: ['1.', 'c', 'ii'],
    label: 'Third'
  },
  {
    id: 'fc9c0c0d-55e4-4f5f-b614-b2d7d9b4019f',
    parents: ['1.', 'a', 'ii'],
    label: 'Fourth'
  },
  {
    id: '35d09117-8543-4319-bad8-4c468c970b02',
    parents: ['1.', 'b', 'i'],
    label: 'Fifth'
  },
  {
    id: '16819445-b1f9-40b2-b447-918a6c9cb360',
    parents: ['2.', 'a', 'i'],
    label: 'Sixth'
  },
  {
    id: '3081cc51-d02e-4c44-b617-9b0f55f2b5a1',
    parents: ['2.', 'a', 'i'],
    label: 'Seventh'
  }
];

window.addEventListener('error', evt => {
  alert(evt.message);
});

document.addEventListener('click', evt => {
  replaceChildren(document.body, render(capabilities));
});

function render(data) {
  function order(a, b) {
    const shorter = a.parents.length < b.parents.length ? a : b;
    for (let i = 0; i < shorter.parents.length; i++) {
      if (a.parents[i] < b.parents[i]) return -1;
      if (a.parents[i] > b.parents[i]) return 1;
    }
    if (a.parents.length < b.parents.length) return -1;
    if (a.parents.length > b.parents.length) return 1;
    return a.label < b.label ? -1 : 1;
  }
  const sorted = data.sort(order);
  //console.dir(sorted);
  return table(
    sorted.map(cap => tr(cap.parents.map(p => th(p)), th(cap.label)))
  );
}
