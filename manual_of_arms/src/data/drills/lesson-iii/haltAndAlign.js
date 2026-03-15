import { lineOfBattle, translate } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 450;
const MARCH_DIST = 5 * SCALE.PACE_PX * 2;

export default {
  id: 'halt-and-align',
  title: 'To Halt and Align',
  lesson: 3,
  article: 2,
  caseyParagraphs: [39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49],
  commands: [
    { text: '1. Company.', type: 'preparatory' },
    { text: '2. HALT.', type: 'execution' },
    { text: 'Right—DRESS.', type: 'execution' },
    { text: 'FRONT.', type: 'execution' },
  ],
  reenactorNotes: null,

  buildKeyframes: (company) => {
    const marching = translate(
      lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 }),
      { dx: 0, dy: -MARCH_DIST }
    );

    // Slight natural misalignment on halt: stagger some soldiers ±1–2px
    const halted = marching.map((s, i) => {
      const jitter = ((i * 7 + 3) % 5) - 2; // deterministic pseudo-random, range -2..2
      return { ...s, y: s.y + jitter * 0.8 };
    });

    // Perfectly aligned after dress
    const dressed = lineOfBattle(company, {
      originX: ORIGIN_X,
      originY: halted.find((s) => s.id === 'of-cpt')?.y ?? ORIGIN_Y - MARCH_DIST,
      facing: 0,
    });

    return [
      {
        label: 'Company marching in line',
        description:
          'The company advances in line of battle. All soldiers maintain touch of elbows toward the guide.',
        caseyRef: '¶39',
        duration: 2000,
        positions: marching,
        annotations: ['marchArrow'],
      },
      {
        label: 'HALT — slight misalignment',
        description:
          'At the command HALT, all soldiers stop. Natural variation leaves some soldiers a half-step ahead or behind. This is normal — dress will correct it.',
        caseyRef: '¶40–41',
        duration: 600,
        positions: halted,
        annotations: ['alignmentLine'],
      },
      {
        label: 'Right DRESS',
        description:
          "Each soldier turns his head and eyes to the right, steps laterally until his arm touches his right-hand neighbor's arm, and aligns his breast with the breast of the man to his right. The covering sergeant aligns the rear rank on the front rank.",
        caseyRef: '¶42–47',
        duration: 1500,
        positions: dressed,
        annotations: ['alignmentLine'],
      },
      {
        label: 'FRONT',
        description:
          'At the command FRONT, heads and eyes snap back to the front. The formation is now perfectly dressed.',
        caseyRef: '¶48–49',
        duration: 400,
        positions: dressed,
        annotations: ['alignmentLine'],
      },
    ];
  },
};
