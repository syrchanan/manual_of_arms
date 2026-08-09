import { columnOfPlatoons } from '../../../engine/formations.js';
import { postColumnChiefsAndGuides } from '../../../engine/columnPosts.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2;
const ORIGIN_Y = 200;

export default {
  id: 'march-in-column',
  title: 'To March in Column',
  lesson: 5,
  article: 2,
  caseyParagraphs: [200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215],
  commands: [
    { text: '1. Column, forward.', type: 'preparatory' },
    { text: '2. Guide left (or right).', type: 'preparatory' },
    { text: '3. MARCH.', type: 'execution' },
  ],
  reenactorNotes:
    'Continuous with the end of Article I (¶177–191): the captain and 1st lieutenant remain 2 paces before the centres of their respective platoons, and the covering sergeant (leading guide) and 2nd sergeant (following guide) stand one file interval beyond the marching (left) flank of their platoons. Before the march command is given, the leading guide takes two points on the ground in his front to steer by (¶200–201). ' +
    'On the march, the following guide (2nd sergeant) marches exactly in the trace of the leading guide (covering sergeant), preserving a distance precisely equal to the front of his platoon (¶206) — this is "the most important principle in the march in column" (¶212). The leading guide alone is responsible for direction and cadence (¶205, ¶213); each chief of platoon repeats the commands march and halt with the greatest promptitude, the instant he catches them, without waiting for another chief (¶215).',

  buildKeyframes: (company) => {
    const rawColumn = columnOfPlatoons(company, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: 90,
    });
    const column = postColumnChiefsAndGuides(rawColumn);

    const marchDist = 10 * SCALE.PACE_PX;
    const marching1 = column.map((s) => ({ ...s, x: s.x + marchDist }));
    const marching2 = marching1.map((s) => ({ ...s, x: s.x + marchDist }));

    return [
      {
        label: 'Column of platoons, stepping off',
        description:
          'The leading guide (covering sergeant) has taken points on the ground in the line of march (¶201). At the command, the chiefs of platoon promptly repeat MARCH and lead off their platoons by a decided step, so the whole column moves off smartly and at the same moment (¶203). The captain and lieutenant lead 2 paces before their platoon centres; the guides march one file interval beyond the left (marching) flank.',
        caseyRef: '¶200–203',
        duration: 2000,
        positions: column,
        annotations: ['marchArrow', 'platoonDistance', 'guideLine'],
      },
      {
        label: 'Column continues',
        description:
          'The following guide (2nd sergeant) marches exactly in the trace of the leading guide, preserving a distance precisely equal to the front of his platoon (¶206). All soldiers feel lightly the elbow of their neighbor toward the guide (¶204).',
        caseyRef: '¶204–208',
        duration: 2000,
        positions: marching1,
        annotations: ['marchArrow', 'platoonDistance'],
      },
      {
        label: 'Sustained march',
        description:
          'The column continues to march. The guide of each subdivision is responsible for direction, distance, and step; the chief of the subdivision is responsible for the order and conformity of his platoon with the movements of its guide (¶213).',
        caseyRef: '¶209–215',
        duration: 2000,
        positions: marching2,
        annotations: ['marchArrow'],
      },
    ];
  },
};
