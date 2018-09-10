import { td } from './react-helper.js';

// INPROGRESS:
//   Use Function.prototype.bind to curry, getting state data via closure
//   This is inefficient, though becuase each cell will get its own function
//   See #L173 below
function cellClick(cell, col, row, evt) {
  console.log(cell, col, row, evt);
}

export default function MeasuredCell(cell, col, row) {
  const mapColors = value => {
    if (!Number.isFinite(value)) return undefined;
    const colors = [
      'rgba(254, 95, 85, 1)',
      'rgba(240, 182, 127, 1)',
      'rgba(214, 209, 177, 1)',
      'rgba(199, 239, 207, 1)',
      'rgba(238, 245, 219, 1)'
    ].reverse();
    const index = Math.floor(cell.value.measure / (1 / colors.length));
    return colors[index];
  };

  return td(
    cell ? Math.floor(cell.value.measure * 100) / 100 : '',
    {
      className: 'cell',
      onClick: cellClick.bind(undefined, cell, col, row) // Results in one function per cell. Is that efficient?
    },
    cell && cell.value.measure
      ? { style: { backgroundColor: mapColors(cell.value.measure) } }
      : {}
  );
}
