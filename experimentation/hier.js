import { table, thead, tr, th, toFragment, empty } from 'dom-helper';
/**
 * A tree data structure. Each node as a label and an ordered list of
 * `Hierarchy` children.
 */
class Hierarchy {
  /**
   *
   * @param {Object} data
   * @param  {...Hierarchy} children
   */
  constructor(data, ...children) {
    this.data = data;
    this.children = children || [];
  }
  /**
   * The total number of *leaf nodes* underneath the current node.
   * This is useful for colspan on vertically-oriented hierarchies.
   */
  get leaves() {
    if (this.hasChildren) {
      return this.children.reduce((prev, curr) => prev + curr.leaves, 0);
    }
    return 1;
  }
  get hasChildren() {
    return this.children.length > 0;
  }
  /**
   * The *maximum depth* under the current node. This is useful for rowspan in
   * vertically-oriented hierarchies.
   */
  get depth() {
    const max = (prev, curr) => Math.max(curr.depth, prev);
    return 1 + (this.hasChildren ? this.children.reduce(max, 0) : 0);
  }
  /**
   * Depth-first traversal
   *
   * @param {Function} callback
   * @return {undefined}
   */
  traverse(callback) {
    (function recurse(node, parent) {
      callback(node, parent);
      for (const child of node.children) {
        recurse(child, node);
      }
    })(this);
  }
  toString(indent = '—') {
    return this.data && this.data.label
      ? this.data.label
      : String(this.data) +
          this.children.reduce(
            (prev, curr) => prev + '\n' + curr.toString(indent + indent[0]),
            ''
          );
  }
}
/**
 * Converts a dictionary-style `Object` into a `Hierarchy`, using the object’s
 * ennumerable properties.
 *
 * @param {*} obj
 * @return {Hierarchy}
 * @static
 */
Hierarchy.from = function from(obj) {
  // TODO
};

// prettier-ignore
const h = new Hierarchy(null, 
  new Hierarchy({ label: '1' }),
  new Hierarchy({ label: '2' }, 
    new Hierarchy({ label: '3' }, 
      new Hierarchy({ label: '4' }), 
      new Hierarchy({ label: '5' })), 
    new Hierarchy({ label: '6' })
  ), 
  new Hierarchy({ label: '7' }, 
  	new Hierarchy({ label: '8' }, 
      new Hierarchy({ label: '9' })
    ),
    new Hierarchy({ label: 'A' })
  ),
  new Hierarchy({ label: 'B' })
);
/*
const h = new Hierarchy(null, 
  new Hierarchy({ label: '1' }),
  new Hierarchy({ label: '2' }, 
    new Hierarchy({ label: '3' }, 
      new Hierarchy({ label: '4' }), 
      new Hierarchy({ label: '5' })), 
    new Hierarchy({ label: '6' })
  ), 
  new Hierarchy({ label: '7' }, 
  	new Hierarchy({ label: '8' }, 
      new Hierarchy({ label: '9' })
    ),
    new Hierarchy({ label: 'A' })
  ),
  new Hierarchy({ label: 'B' }, 
    new Hierarchy({ label: 'C' }, 
    new Hierarchy({ label: 'D' }), 
      new Hierarchy({ label: 'E' }, 
        new Hierarchy({ label: 'F' })
      )
    )
  )
);
*/
function renderVerticalHierarchy(hierarchy) {
  // Place holder of temporary hierarchy
  const next = new Hierarchy(null);
  if (0 === hierarchy.children.length) return empty();
  const rows = hierarchy.children.map(node => {
    next.children.push(...node.children);
    const leaves = node.leaves;
    return th(node.data.label, {
      scope: node.hasChildren ? 'colgroup' : 'col',
      colSpan: leaves,
      rowSpan: node.hasChildren ? 1 : hierarchy.depth
    });
  });
  return toFragment(tr(rows), renderVerticalHierarchy(next));
}

function renderHorizontalHierarchy(hierarchy) {
  let accum = [];
  const rows = [];
  hierarchy.traverse((node, parent) => {
    // console.log(node, parent, node.depth);
    if (null === node.data) return;
    const prop = {
      scope: node.hasChildren ? 'rowgroup' : 'row',
      rowSpan: node.leaves,
      colSpan: parent.depth - node.depth
    };
    accum.push(th(node.data.label, prop));
    if (!node.hasChildren) {
      rows.push(accum);
      accum = [];
    }
  });
  return rows.map(r => tr(r));
}

const el = document.querySelector('#dynamic>div');
// h.traverse(node => console.log(node.data.label));

el.appendChild(table(thead(renderHorizontalHierarchy(h))));
el.appendChild(table(thead(renderVerticalHierarchy(h))));
