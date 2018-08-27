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
    let depth = 0;
    if (this.hasChildren) {
      this.children.forEach(node => {
        let tmpDepth = node.depth;
        if (tmpDepth > depth) {
          depth = tmpDepth;
        }
      });
    }
    return 1 + depth;
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
}

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
  new Hierarchy('B')
);

function renderHierarchy(hierarchy) {
  // Place holder of temporary hierarchy
  const next = new Hierarchy(null);
  let row = '';
  if (0 === hierarchy.children.length) return '';
  for (const node of hierarchy.children) {
    row += `<th colspan="${node.leaves}" rowspan="${
      node.hasChildren ? 1 : hierarchy.depth
    }">${node.label}<!--(${node.leaves}, ${
      node.hasChildren ? 1 : hierarchy.depth
    })--></th>`;
    next.children.push(...node.children);
  }
  return `<tr>${row}</tr>` + renderHierarchy(next);
}

const el = document.querySelector('#dynamic>div');
el.innerHTML = `<table><thead>${renderHierarchy(h)}</thead></table>`;

