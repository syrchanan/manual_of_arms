import { lineOfBattle, columnOfFiles, doubleFiles } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 380;

export default {
  id: 'march-by-flank',
  title: 'To March by the Flank',
  lesson: 4,
  article: 1,
  caseyParagraphs: [76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87],
  commands: [
    { text: '1. Company, right—FACE.', type: 'execution' },
    { text: '2. Forward.', type: 'preparatory' },
    { text: '3. MARCH.', type: 'execution' },
  ],
  reenactorNotes:
    'Per Casey ¶138: the covering sergeant steps to the HEAD of the column; the captain places himself on the sergeant\'s LEFT (guide side). They lead the column as a pair. Behind them, the remaining files double WITHIN EACH RANK (S.S. ¶363): the second man steps beside the first, the fourth beside the third, and so on. The rear rank side-steps right one pace and doubles the same way. Result: a column 4 abreast (except the 2-abreast head pair), with files of 4 men aligned elbow to elbow. File closers side-step right to be 2 paces from the rearmost rank (¶139).',

  buildKeyframes: (company) => {
    // Initial line of battle, facing north
    const inLine = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });

    // After right-face: all soldiers rotate 90° to face east, but stay in place
    const rightFaced = inLine.map((s) => ({ ...s, facing: 90 }));

    // Files double: rear-rank soldiers step beside their front-rank partners
    const doubled = doubleFiles(rightFaced, company);

    // Forward march: column moves right (east, +x direction)
    const marchDist = 14 * SCALE.PACE_PX;
    const marching1 = doubled.map((s) => ({
      ...s,
      x: s.x + marchDist,
    }));

    // Continue marching
    const marching2 = marching1.map((s) => ({
      ...s,
      x: s.x + marchDist * 0.8,
    }));

    return [
      {
        label: 'Company in line of battle',
        description:
          'The company stands in line of battle. 20 files, 2 ranks deep, facing front (north). File closers 2 paces behind the rear rank.',
        caseyRef: '¶76',
        duration: 0,
        positions: inLine,
        annotations: ['fileNumbers'],
      },
      {
        label: 'Right FACE',
        description:
          'At the command of execution, every man faces right. The covering sergeant steps to the head of the front rank; the captain steps out to be on the sergeant\'s left. The remaining files prepare to double.',
        caseyRef: '¶77',
        duration: 600,
        positions: rightFaced,
        annotations: ['fileNumbers'],
      },
      {
        label: 'Files double — captain and covering sergeant at head',
        description:
          'The covering sergeant leads at the head; the captain is on his left. Behind them, the front rank doubles: the second man steps beside the first, the fourth beside the third, etc. The rear rank side-steps right and doubles the same way. The result is a column 4 abreast with the captain/sergeant pair leading. File closers side-step to 2 paces from the rearmost rank.',
        caseyRef: '¶78',
        duration: 1000,
        positions: doubled,
        annotations: ['fileNumbers', 'doublingHighlight'],
      },
      {
        label: 'Forward MARCH — column advances',
        description:
          'The column steps off. The head of the column (files 1–2 group: captain, covering sergeant, and their even-file partners) leads. The company moves to the right (east). File closers march alongside.',
        caseyRef: '¶79–82',
        duration: 2500,
        positions: marching1,
        annotations: ['marchArrow'],
      },
      {
        label: 'Marching by the right flank',
        description:
          'The column continues its advance. Each group of four soldiers maintains alignment. This formation allows the company to move perpendicular to the line of battle.',
        caseyRef: '¶83–87',
        duration: 2000,
        positions: marching2,
        annotations: ['marchArrow'],
      },
    ];
  },
};
