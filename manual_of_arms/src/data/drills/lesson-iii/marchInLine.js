import { lineOfBattle, translate } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2; // center company
const ORIGIN_Y = 450;
const MARCH_DIST = 8 * SCALE.PACE_PX * 2; // ~8 paces of visible movement

export default {
  id: 'march-in-line',
  title: 'To March in Line of Battle',
  lesson: 3,
  article: 1,
  caseyParagraphs: [34, 35, 36, 37, 38],
  commands: [
    { text: '1. Company, forward.', type: 'preparatory' },
    { text: '2. Guide right.', type: 'preparatory' },
    { text: '3. MARCH.', type: 'execution' },
  ],
  reenactorNotes: null,

  buildKeyframes: (company) => {
    const halted = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
    const marching = translate(halted, { dx: 0, dy: -MARCH_DIST });
    const halted2 = marching; // same positions, just stopped

    return [
      {
        label: 'Halted in line',
        description:
          'The company stands in line of battle, two ranks deep. The captain is on the right of the front rank. The covering sergeant (right guide) stands behind him in the rear rank.',
        caseyRef: '¶34',
        duration: 0,
        positions: halted,
        annotations: ['guideLineRight', 'marchArrow'],
      },
      {
        label: 'Command given',
        description:
          '"Company, forward — Guide right." The preparatory command alerts the company; all eyes dress right toward the captain and covering sergeant.',
        caseyRef: '¶35',
        duration: 800,
        positions: halted,
        annotations: ['guideLineRight', 'marchArrow'],
      },
      {
        label: 'MARCH — company advances',
        description:
          'At the command MARCH, the entire company steps off on the left foot. The covering sergeant (right guide) marches perfectly straight. Every soldier maintains touch of elbows toward the guide side and dresses to the right.',
        caseyRef: '¶36–37',
        duration: 3000,
        positions: marching,
        annotations: ['guideLineRight', 'marchArrow'],
      },
      {
        label: 'HALT',
        description:
          'At the command HALT, all soldiers stop. The rear foot is brought up beside the front foot. The covering sergeant checks alignment.',
        caseyRef: '¶38',
        duration: 600,
        positions: halted2,
        annotations: ['guideLineRight'],
      },
    ];
  },
};
