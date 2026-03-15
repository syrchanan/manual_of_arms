import { lineOfBattle, translate } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 450;
const MARCH_DIST = 4 * SCALE.PACE_PX * 2;

// Three sub-animations exposed as separate keyframe sets
function buildMarkTime(company) {
  const start = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
  const marching = translate(start, { dx: 0, dy: -MARCH_DIST });
  const resumed = translate(marching, { dx: 0, dy: -MARCH_DIST });

  return [
    {
      label: 'Company marching',
      description: 'The company advances in quick time.',
      caseyRef: '¶57',
      duration: 1500,
      positions: marching,
      annotations: ['marchArrow'],
    },
    {
      label: 'Mark time MARCH',
      description:
        'At MARCH, soldiers continue the cadence of the step in place — raising and lowering each foot without advancing. The formation holds its position.',
      caseyRef: '¶58–60',
      duration: 2000,
      positions: marching, // same positions; animation adds oscillation in canvas
      annotations: [],
      specialEffect: 'markTime',
    },
    {
      label: 'Forward MARCH — resume',
      description: 'The company resumes forward march at the command.',
      caseyRef: '¶61',
      duration: 1500,
      positions: resumed,
      annotations: ['marchArrow'],
    },
  ];
}

function buildDoubleQuick(company) {
  const start = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
  const quickTime = translate(start, { dx: 0, dy: -MARCH_DIST });
  // Double quick: faster pace (165/min), slightly longer steps
  const doubleQuickDist = MARCH_DIST * 1.5;
  const doubleQuickPos = translate(quickTime, { dx: 0, dy: -doubleQuickDist });
  const returnPos = translate(doubleQuickPos, { dx: 0, dy: -MARCH_DIST * 0.5 });

  return [
    {
      label: 'Company at quick time',
      description: 'The company marches at quick time — 110 paces per minute, 28-inch steps.',
      caseyRef: '¶62',
      duration: 1500,
      positions: quickTime,
      annotations: ['marchArrow'],
    },
    {
      label: 'Double quick MARCH',
      description:
        'At MARCH, the cadence increases to 165 paces per minute with 33-inch steps. Arms are held at trail or right-shoulder shift. The pace visibly accelerates.',
      caseyRef: '¶63–65',
      duration: 2000,
      positions: doubleQuickPos,
      annotations: ['marchArrow'],
      speedMultiplier: 1.5,
    },
    {
      label: 'Quick time MARCH — return to normal',
      description:
        'At the command, the company returns to the ordinary quick time cadence.',
      caseyRef: '¶66',
      duration: 1500,
      positions: returnPos,
      annotations: ['marchArrow'],
    },
  ];
}

function buildBackStep(company) {
  const start = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y - 60, facing: 0 });
  // Back step: 15-inch steps rearward
  const backDist = 6 * 8; // 6 paces × ~8px (15" ≈ half a pace)
  const backPos = translate(start, { dx: 0, dy: backDist });

  return [
    {
      label: 'Company halted',
      description: 'The company stands in line, facing front.',
      caseyRef: '¶67',
      duration: 0,
      positions: start,
      annotations: [],
    },
    {
      label: 'Backward MARCH',
      description:
        'At the command, soldiers step directly to the rear, 15-inch steps, without changing front. Used for short distances only — no more than a few paces.',
      caseyRef: '¶67',
      duration: 2000,
      positions: backPos,
      annotations: [],
    },
    {
      label: 'HALT',
      description: 'The company halts. It has moved a short distance to the rear.',
      caseyRef: '¶67',
      duration: 600,
      positions: backPos,
      annotations: [],
    },
  ];
}

export default {
  id: 'mark-time',
  title: 'Mark Time, Double Quick, Back Step',
  lesson: 3,
  article: 4,
  caseyParagraphs: [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67],
  commands: [
    { text: '1. Mark time.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],
  subMovements: [
    { id: 'mark-time', label: 'A) Mark Time' },
    { id: 'double-quick', label: 'B) Double Quick' },
    { id: 'back-step', label: 'C) Back Step' },
  ],
  reenactorNotes: null,

  buildKeyframes: (company, subMovement = 'mark-time') => {
    if (subMovement === 'double-quick') return buildDoubleQuick(company);
    if (subMovement === 'back-step') return buildBackStep(company);
    return buildMarkTime(company);
  },
};
