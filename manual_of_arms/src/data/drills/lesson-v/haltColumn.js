import { columnOfPlatoons } from '../../../engine/formations.js';
import { postColumnChiefsAndGuides } from '../../../engine/columnPosts.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2;
const ORIGIN_Y = 200;

export default {
  id: 'halt-column',
  title: 'To Halt the Column',
  lesson: 5,
  article: 4,
  caseyParagraphs: [236, 237, 238, 239],
  commands: [
    { text: '1. Column.', type: 'preparatory' },
    { text: '2. HALT.', type: 'execution' },
  ],
  reenactorNotes:
    'The chiefs of platoon must repeat HALT with the greatest vivacity, executing it at the very same instant — any hesitation loses distance (¶238). Critically, the guides STAND FAST at the halt, even if they have lost distance or direction during the march (¶237): they do NOT try to correct their position at this moment. If a guide who has lost his distance tries to recover it right after the halt, he only throws his own fault onto the guide behind him — and if that guide, having marched well, also corrects to compensate, the error is propagated all the way to the rear of the column (¶239). Realigning the column is a separate, deliberate dressing movement, never attempted at the instant of the halt itself.',

  buildKeyframes: (company) => {
    const marchDist = 10 * SCALE.PACE_PX;
    const rawColumn = columnOfPlatoons(company, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: 90,
    });
    const column = postColumnChiefsAndGuides(rawColumn);
    const marching = column.map((s) => ({ ...s, x: s.x + marchDist }));

    return [
      {
        label: 'Column of platoons, marching',
        description: 'The column marches east. 1st platoon leading, 2nd following at platoon distance.',
        caseyRef: '¶236',
        duration: 1500,
        positions: marching,
        annotations: ['marchArrow', 'platoonDistance'],
      },
      {
        label: 'HALT',
        description:
          'At the second command, promptly repeated by each chief of platoon, the whole column halts at the same instant (¶237). The guides stand fast exactly where they are — even a guide who has lost distance or direction makes no attempt to correct it now. Doing so would only throw his fault onto the guide behind him, propagating the error down the length of the column (¶238–239).',
        caseyRef: '¶237–239',
        duration: 600,
        positions: marching,
        annotations: ['platoonDistance'],
      },
    ];
  },
};
