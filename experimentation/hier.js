import { renderInto } from './react-helper.js';
import { Hierarchy } from './hierarchy.js';

import HierarchicalTable from './HierarchicalTable.js';
import MeasuredCell from './MeasuredCell.js';

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

const data = () => [
  // coord: [col, row]
  // { coord: ['Things', '1'], value: { label: 'Things 1' } },
  {
    coord: ['Things', '4'],
    value: { label: 'Things 4', measure: Math.random() }
  },
  {
    coord: ['Things', '5'],
    value: { label: 'Things 5', measure: Math.random() }
  },
  {
    coord: ['Things', '6'],
    value: { label: 'Things 6', measure: Math.random() }
  },
  {
    coord: ['Things', '9'],
    value: { label: 'Things 9', measure: Math.random() }
  },
  {
    coord: ['Things', 'A'],
    value: { label: 'Things A', measure: Math.random() }
  },
  // { coord: ['Things', 'D'], value: { label: 'Things D', measure: Math.random() } },
  {
    coord: ['Things', 'F'],
    value: { label: 'Things F', measure: Math.random() }
  },
  {
    coord: ['These', '1'],
    value: { label: 'These 1', measure: Math.random() }
  },
  {
    coord: ['These', '4'],
    value: { label: 'These 4', measure: Math.random() }
  },
  // { coord: ['These', '5'], value: { label: 'These 5' } },
  {
    coord: ['These', '6'],
    value: { label: 'These 6', measure: Math.random() }
  },
  {
    coord: ['These', '9'],
    value: { label: 'These 9', measure: Math.random() }
  },
  // { coord: ['These', 'A'], value: { label: 'These A' } },
  {
    coord: ['These', 'D'],
    value: { label: 'These D', measure: Math.random() }
  },
  // { coord: ['These', 'F'], value: { label: 'These F' } },
  {
    coord: ['Misc.', '1'],
    value: { label: 'Misc. 1', measure: Math.random() }
  },
  {
    coord: ['Misc.', '4'],
    value: { label: 'Misc. 4', measure: Math.random() }
  },
  // { coord: ['Misc.', '5'], value: { label: 'Misc. 5' } },
  {
    coord: ['Misc.', '6'],
    value: { label: 'Misc. 6', measure: Math.random() }
  },
  {
    coord: ['Misc.', '9'],
    value: { label: 'Misc. 9', measure: Math.random() }
  },
  {
    coord: ['Misc.', 'A'],
    value: { label: 'Misc. A', measure: Math.random() }
  },
  {
    coord: ['Misc.', 'D'],
    value: { label: 'Misc. D', measure: Math.random() }
  },
  {
    coord: ['Misc.', 'F'],
    value: { label: 'Misc. F', measure: Math.random() }
  }
];

const store = {
  callback: () => {},
  dispatch() {
    // Update model
    // TODO: …
    this.callback({ columns, rows, data: data() });
  },
  subscribe(callback) {
    this.callback = callback;
  }
};
store.subscribe(model => {
  const { columns, rows, data } = model;
  renderInto(
    HierarchicalTable(columns, rows, data, MeasuredCell),
    document.querySelector('section#dynamic > div')
  );
});

setInterval(() => store.dispatch(), 500);
