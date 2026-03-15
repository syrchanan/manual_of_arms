import { columnOfPlatoons } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2;
const ORIGIN_Y = 200;

export default {
  id: 'march-in-column',
  title: 'To March in Column',
  lesson: 5,
  article: 2,
  caseyParagraphs: [142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157],
  commands: [],
  reenactorNotes:
    'The guide of the 2nd platoon maintains distance on the guide of the 1st. The distance between platoons should equal the platoon front (10 files × file interval). The guide of each platoon marches on the side nearest the head of the column — in a right-in-front column, this is the LEFT side.',

  buildKeyframes: (company) => {
    const column = columnOfPlatoons(company, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: 90,
      guide: 'left',
    });

    const marchDist = 10 * SCALE.PACE_PX;
    const marching1 = column.map((s) => ({ ...s, x: s.x + marchDist }));
    const marching2 = marching1.map((s) => ({ ...s, x: s.x + marchDist }));

    return [
      {
        label: 'Column of platoons, marching',
        description:
          '1st platoon leads, 2nd follows at a distance equal to the platoon front. Guide is on the left.',
        caseyRef: '¶142–145',
        duration: 2000,
        positions: column,
        annotations: ['marchArrow', 'platoonDistance', 'guideLine'],
      },
      {
        label: 'Column continues',
        description:
          'The guide of the 2nd platoon maintains distance on the guide of the 1st. All soldiers touch elbows toward the guide side.',
        caseyRef: '¶146–150',
        duration: 2000,
        positions: marching1,
        annotations: ['marchArrow', 'platoonDistance'],
      },
      {
        label: 'Sustained march',
        description:
          'The column continues. Platoon guides maintain their lines and distance.',
        caseyRef: '¶151–157',
        duration: 2000,
        positions: marching2,
        annotations: ['marchArrow'],
      },
    ];
  },
};
