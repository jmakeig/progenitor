import {
  renderInto,
  table,
  thead,
  tbody,
  tr,
  th,
  td,
  toFragment,
  empty
} from './react-helper.js';
import {
  Hierarchy,
  hasChildren,
  descendants,
  maxDepth,
  traverseDepthFirst,
  countDescendantLeaves
} from './hierarchy.js';

// const columns = new Hierarchy(null, new Hierarchy('A'), new Hierarchy('B'));

// prettier-ignore
const columns = new Hierarchy(null, 
  new Hierarchy({ id: 'Things', label: 'Things' }),
  new Hierarchy({ id: 'Stuff', label: 'Stuff' }, 
  new Hierarchy({ id: 'These', label: 'These' }),
    new Hierarchy({ id: 'Others', label: 'Others' }, 
      new Hierarchy({ id: 'Misc.', label: 'Misc.' }), 
      new Hierarchy({ id: 'Various', label: 'Various' })) 
  ), 
  new Hierarchy({ id: 'Those', label: 'Those' }, 
  	new Hierarchy({ id: 'What’s it?', label: 'What’s it?' }, 
      new Hierarchy({ id: 'That', label: 'That' }, 
        new Hierarchy({ id: 'More', label: 'More' }, 
          new Hierarchy({ id: 'Better', label: 'Better' })))
    ),
    new Hierarchy({ id: 'Him', label: 'Him' })
  ),
  new Hierarchy({ id: 'Her', label: 'Her' })
);

// prettier-ignore
const rows = new Hierarchy(null, 
  new Hierarchy({ id: '1', label: '1' }),
  new Hierarchy({ id: '2', label: '2' }, 
    new Hierarchy({ id: '3', label: '3' }, 
      new Hierarchy({ id: '4', label: '4' }), 
      new Hierarchy({ id: '5', label: '5' })), 
    new Hierarchy({ id: '6', label: '6' })
  ), 
  new Hierarchy({ id: '7', label: '7' }, 
  	new Hierarchy({ id: '8', label: '8' }, 
      new Hierarchy({ id: '9', label: '9' })
    ),
    new Hierarchy({ id: 'A', label: 'A' })
  ),
  new Hierarchy({ id: 'B', label: 'B' }, 
    new Hierarchy({ id: 'C', label: 'C' }, 
    new Hierarchy({ id: 'D', label: 'D' }), 
      new Hierarchy({ id: 'E', label: 'E' }, 
        new Hierarchy({ id: 'F', label: 'F' })
      )
    )
  )
);

// prettier-ignore
// const values = [
//   ['A0', 'A1', 'A2', 'A3', 'A4', 'A5', 'A6'],
//   ['B0', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6'],
//   ['C0', 'C1', 'C2', 'C3', 'C4', 'C5', 'C6'],
//   ['D0', 'D1', 'D2', 'D3', 'D4', 'D5', 'D6'],
//   ['E0', 'E1', 'E2', 'E3', 'E4', 'E5', 'E6'],
//   ['F0', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6'],
//   ['G0', 'G1', 'G2', 'G3', 'G4', 'G5', 'G6'],
//   ['H0', 'H1', 'H2', 'H3', 'H4', 'H5', 'H6'],
// ];

const data = [
  // coord: [col, row]
  // { coord: ['Things', '1'], value: { label: 'Things 1' } },
  { coord: ['Things', '4'], value: { label: 'Things 4' } },
  { coord: ['Things', '5'], value: { label: 'Things 5' } },
  { coord: ['Things', '6'], value: { label: 'Things 6' } },
  { coord: ['Things', '9'], value: { label: 'Things 9' } },
  { coord: ['Things', 'A'], value: { label: 'Things A' } },
  // { coord: ['Things', 'D'], value: { label: 'Things D' } },
  { coord: ['Things', 'F'], value: { label: 'Things F' } },
  { coord: ['These', '1'], value: { label: 'These 1' } },
  { coord: ['These', '4'], value: { label: 'These 4' } },
  // { coord: ['These', '5'], value: { label: 'These 5' } },
  { coord: ['These', '6'], value: { label: 'These 6' } },
  { coord: ['These', '9'], value: { label: 'These 9' } },
  // { coord: ['These', 'A'], value: { label: 'These A' } },
  { coord: ['These', 'D'], value: { label: 'These D' } },
  // { coord: ['These', 'F'], value: { label: 'These F' } },
  { coord: ['Misc.', '1'], value: { label: 'Misc. 1' } },
  { coord: ['Misc.', '4'], value: { label: 'Misc. 4' } },
  // { coord: ['Misc.', '5'], value: { label: 'Misc. 5' } },
  { coord: ['Misc.', '6'], value: { label: 'Misc. 6' } },
  { coord: ['Misc.', '9'], value: { label: 'Misc. 9' } },
  { coord: ['Misc.', 'A'], value: { label: 'Misc. A' } },
  { coord: ['Misc.', 'D'], value: { label: 'Misc. D' } },
  { coord: ['Misc.', 'F'], value: { label: 'Misc. F' } },
];

/**
 * Transforms a sparse lookup table, keyed on column and row IDs, into a
 * two-dimensional `Array` suitable for mapping to table cells.
 *
 * @param {Array} data `{ coord: [colID, rowID], value: { … } }`
 * @param {Hierarchy} columnHeaders
 * @param {Hierarchy} rowHeaders
 * @return {Array<Array>}
 */
function mapToCells(data, columnHeaders, rowHeaders) {
  const getID = node => node.data.id;
  const colIDs = descendants(columnHeaders, node => !hasChildren(node), getID);
  const rowIDs = descendants(rowHeaders, node => !hasChildren(node), getID);
  const cells = createTable(colIDs.length, rowIDs.length);

  const err = (needle, haystack) => {
    throw new ReferenceError(
      `${needle} is not found in [${haystack.join(', ')}]`
    );
  };
  for (const item of data) {
    const c = colIDs.indexOf(item.coord[0]);
    const r = rowIDs.indexOf(item.coord[1]);
    if (c < 0) err(item.coord[0], colIDs);
    if (r < 0) err(item.coord[1], rowIDs);
    cells[r][c] = item;
  }
  return cells;
}

/**
 * Eagerly creates a two-dimensional array filled with a static value,
 * or `undefined`, by default.
 *
 * @param {number} [width = 0]
 * @param {number} [height = 0]
 * @param {number} [fill = undefined]
 * @return {Array<Array>}
 */
function createTable(width = 0, height = 0, fill = undefined) {
  const table = [];
  for (let r = 0; r < height; r++) {
    table[r] = [];
    for (let c = 0; c < width; c++) {
      table[r][c] = fill;
    }
  }
  return table;
}

// console.table(mapToCells(data, columns, rows));

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
function renderTable(columns, rows, data) {
  const spacer = {
    colSpan: maxDepth(rows) - 1,
    rowSpan: maxDepth(columns) - 1
  };
  const toCell = (cell, col, row) => td(cell ? cell.value.label : '');
  return table(
    thead(renderColumnHeaders(columns, th, spacer)),
    tbody(renderRows(rows, mapToCells(data, columns, rows), toCell))
  );
}

renderInto(
  renderTable(columns, rows, data),
  document.querySelector('section#dynamic > div')
);
