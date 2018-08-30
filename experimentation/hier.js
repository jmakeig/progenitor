import { table, thead, tbody, tr, th, td, toFragment, empty } from 'dom-helper';
import {
  Hierarchy,
  hasChildren,
  maxDepth,
  traverseDepthFirst,
  countDescendantLeaves
} from './hierarchy.js';

// const columns = new Hierarchy(null, new Hierarchy('A'), new Hierarchy('B'));

// prettier-ignore
const columns = new Hierarchy(null, 
  new Hierarchy({ label: 'Things' }),
  new Hierarchy({ label: 'Stuff' }, 
  new Hierarchy({ label: 'These' }),
    new Hierarchy({ label: 'Others' }, 
      new Hierarchy({ label: 'Misc.' }), 
      new Hierarchy({ label: 'Various' })) 
  ), 
  new Hierarchy({ label: 'Those' }, 
  	new Hierarchy({ label: 'What’s it?' }, 
      new Hierarchy({ label: 'That' }, 
        new Hierarchy({ label: 'More' }, 
          new Hierarchy({ label: 'Better' })))
    ),
    new Hierarchy({ label: 'Him' })
  ),
  new Hierarchy({ label: 'Her' })
);

// prettier-ignore
const rows = new Hierarchy(null, 
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

// prettier-ignore
const values = [
  ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
  ['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6'],
  ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
  ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
  ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6'],
  ['F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6'],
  ['G0', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'],
  ['H0', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
];

/**
 * Renders column headers as rows with an optional spacer
 * to make room for the row headers.
 *
 * @param {Hierarchy} hierarchy
 * @param {Object} spacer `{ colSpan: #, rowSpan: # }`
 * @return {DocumentFragment}
 */
function renderColumnHeaders(hierarchy, cellRenderer = th, spacer) {
  // Place holder of temporary hierarchy
  const next = new Hierarchy(null);
  if (0 === hierarchy.children.length) return empty();
  const rows = hierarchy.children.map((node, i) => {
    next.children.push(...node.children);
    const leaves = countDescendantLeaves(node);
    const header = cellRenderer(node.data.label, {
      scope: hasChildren(node) ? 'colgroup' : 'col',
      colSpan: leaves,
      rowSpan: hasChildren(node) ? 1 : maxDepth(hierarchy)
    });
    if (spacer && 0 === i) {
      return toFragment(
        th({
          className: 'spacer',
          colSpan: spacer.colSpan,
          rowSpan: spacer.rowSpan
        }),
        header
      );
    }
    return header;
  });
  return toFragment(tr(rows), renderColumnHeaders(next, cellRenderer));
}

/**
 * Renders row headers, optionally appending the cell values for
 * each of the leaf rows.
 *
 * @param {Hierarchy} hierarchy
 * @param {Array<Array<Object>>} [values]
 * @return {Array<HTMLTableRowElement>}
 */
function renderRows(
  hierarchy,
  values,
  cellRenderer = (value, col, row, ...rest) => td(value, ...rest),
  rowHeaderRenderer = th
) {
  let accum = [];
  let index = 0;
  const rows = [];
  traverseDepthFirst(hierarchy, (node, parent) => {
    if (null === node.data) return;
    const prop = {
      scope: hasChildren(node) ? 'rowgroup' : 'row',
      rowSpan: countDescendantLeaves(node),
      colSpan: maxDepth(parent) - maxDepth(node)
    };
    accum.push(rowHeaderRenderer(node.data.label, prop));
    // Data cells (TD’s) are associated with leaf nodes.
    // The rest of the row hierarchy is just for bookkeeping in the headers.
    if (!hasChildren(node)) {
      // Append the values as table cells for each row
      if (values) {
        // TODO: ARIA accessiblity
        //       * <https://www.w3.org/WAI/tutorials/tables/multi-level/>
        //       * <https://developer.mozilla.org/en-US/docs/Web/HTML/Element/th#attr-headers>
        accum.push(
          ...values[index].map((value, c) => cellRenderer(value, c, index))
        );
        index++;
      }
      rows.push(accum);
      accum = [];
    }
  });
  return rows.map(r => tr(r));
}

/**
 *
 * @param {Hierarchy} columns
 * @param {Hierarchy} rows
 * @param {Array<Array<Object>>} values
 */
function renderTable(columns, rows, values) {
  const spacer = {
    colSpan: maxDepth(rows) - 1,
    rowSpan: maxDepth(columns) - 1
  };
  console.log(spacer);
  return table(
    thead(renderColumnHeaders(columns, th, spacer)),
    tbody(renderRows(rows, values, (value, col, row) => td(value)))
  );
}

const el = document.querySelector('#dynamic>div');
// h.traverse(node => console.log(node.data.label));

el.appendChild(renderTable(columns, rows, values));
