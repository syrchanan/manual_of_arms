import { columnOfPlatoons } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2;
const ORIGIN_Y = 200;

export default {
  id: 'halt-column',
  title: 'To Halt the Column',
  lesson: 5,
  article: 4,
  caseyParagraphs: [173, 174, 175, 176],
  commands: [
    { text: '1. Company.', type: 'preparatory' },
    { text: '2. HALT.', type: 'execution' },
  ],
  reenactorNotes:
    'Both platoons halt simultaneously. The guides align their platoons immediately after the halt.',

  buildKeyframes: (company) => {
    const marchDist = 10 * SCALE.PACE_PX;
    const column = columnOfPlatoons(company, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: 90,
      guide: 'left',
    });
    const marching = column.map((s) => ({ ...s, x: s.x + marchDist }));

    return [
      {
        label: 'Column of platoons, marching',
        description: 'The column marches east. 1st platoon leading, 2nd following.',
        caseyRef: '¶173',
        duration: 1500,
        positions: marching,
        annotations: ['marchArrow', 'platoonDistance'],
      },
      {
        label: 'HALT',
        description:
          'Both platoons halt simultaneously. Guides align their platoons.',
        caseyRef: '¶174–176',
        duration: 600,
        positions: marching,
        annotations: ['platoonDistance'],
      },
    ];
  },
};
