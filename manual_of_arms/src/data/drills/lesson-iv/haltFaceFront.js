import { columnOfFiles, undoubleFiles } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = 200;
const ORIGIN_Y = 300;

export default {
  id: 'halt-face-front',
  title: 'To Halt and Face to the Front',
  lesson: 4,
  article: 3,
  caseyParagraphs: [93, 94, 95, 96],
  commands: [
    { text: '1. Company.', type: 'preparatory' },
    { text: '2. HALT.', type: 'execution' },
    { text: '3. FRONT.', type: 'execution' },
  ],
  reenactorNotes:
    'At HALT, no one adjusts position even if distance has been lost during the march. At FRONT, each man faces to the LEFT (the opposite of the flank originally faced). Even-numbered men undouble — they step back to their original rear-rank position. The company re-forms in the standard two-rank line.',

  buildKeyframes: (company) => {
    // Start: column of files marching east (4 abreast, 10 deep)
    const inColumn = columnOfFiles(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 90 });
    const marchDist = 12 * SCALE.PACE_PX;
    const marching = inColumn.map((s) => ({ ...s, x: s.x + marchDist }));

    // HALT: all stop in place
    const halted = marching;

    // FRONT: face left (from facing 90, rotate -90 → facing 0/north)
    // Files undouble: even men return to rear rank, rear rank returns behind front
    const fronted = undoubleFiles(
      halted.map((s) => ({ ...s, facing: 0 })),
      company
    );

    return [
      {
        label: 'Marching by the right flank',
        description:
          'The company marches in column of files (4 abreast, 10 deep), heading east.',
        caseyRef: '¶93',
        duration: 1500,
        positions: marching,
        annotations: ['marchArrow'],
      },
      {
        label: 'HALT',
        description:
          'At HALT, all soldiers stop in place. No one adjusts position even if distance was lost during the march.',
        caseyRef: '¶94',
        duration: 600,
        positions: halted,
        annotations: [],
      },
      {
        label: 'FRONT — files undouble, company re-forms',
        description:
          'At FRONT, each man faces left (opposite of the right-face that began the flank march). Even-numbered men undouble back to their rear-rank positions. The company re-forms in the standard two-rank line facing north.',
        caseyRef: '¶95–96',
        duration: 1000,
        positions: fronted,
        annotations: [],
      },
    ];
  },
};
