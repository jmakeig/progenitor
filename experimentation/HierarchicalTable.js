import React from 'react';
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
/**
 *
 */
class Table extends React.PureComponent {
  render() {
    const { columns, rows, data } = this.props;
    return renderTable(columns, rows, data);
  }
}

/**
 * Component factory
 *
 * @param {*} columns
 * @param {*} rows
 * @param {*} data
 * @return {React.ComponentElement}
 */
export default function(columns, rows, data) {
  return React.createElement(Table, { columns, rows, data });
}
