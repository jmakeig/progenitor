class Hierarchy {
  constructor(label, ...children) {
    this.label = label;
    this.children = children || [];
  }
  leaves() {
    if (0 === this.children.length) {
      return 1;
    }
    return this.children.reduce((prev, curr) => prev + curr.leaves(), 0);
  }
  depth() {
    if (0 === children.length) {
      return 1;
    }
    // AHHHHHHHHHH!
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

// prettier-ignore
const h = new Hierarchy(null, 
  //new Hierarchy('1'),
  //new Hierarchy('2', 
    new Hierarchy('3', 
      new Hierarchy('4'), 
      new Hierarchy('5')), 
    new Hierarchy('6')
  //), 
  //new Hierarchy('7', 
  	//new Hierarchy('8', 
      //new Hierarchy('9')
    //),
    //new Hierarchy('A')
  //)
);

function renderHierarchy(children) {
  const next = [];
  let row = '';
  if (!children || 0 === children.length) return '';
  for (const node of children) {
    row += `<th colspan="${node.leaves()}">${
      node.label
    } (${node.leaves()})</th>`;
    next.push(...node.children);
  }
  return `<tr>${row}</tr>` + renderHierarchy(next);
}

const el = document.querySelector('#dynamic>div');
el.innerHTML = `<table><thead>${renderHierarchy(h.children)}</thead></table>`;
