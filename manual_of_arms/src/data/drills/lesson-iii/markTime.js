import { lineOfBattle, translate } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 450;

// MARCH_DIST: a quick-time leg's on-screen distance. 4 paces at PACE_PX
// (14px/pace) doubled (x2) for animation legibility -> 8 *apparent* paces of
// travel, not 4. (A comment claiming "4 paces" next to this formula would be
// wrong by a factor of two -- it is 2N paces, not N paces.)
const MARCH_DIST = 4 * SCALE.PACE_PX * 2;
const QUICK_DURATION = 1500; // ms for one quick-time leg
const QUICK_RATE = MARCH_DIST / QUICK_DURATION; // px/ms at quick time (110 spm, 28" pace)

// Three sub-animations exposed as separate keyframe sets
function buildMarkTime(company) {
  const start = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
  const marching = translate(start, { dx: 0, dy: -MARCH_DIST });
  const resumed = translate(marching, { dx: 0, dy: -MARCH_DIST });

  return [
    {
      label: 'Company marching',
      description: 'The company advances in quick time.',
      caseyRef: '¶109',
      duration: QUICK_DURATION,
      positions: marching,
      annotations: ['marchArrow'],
    },
    {
      label: 'Mark time MARCH',
      description:
        'At MARCH, soldiers continue the cadence of the step in place — raising and lowering each foot without advancing. The formation holds its position.',
      caseyRef: '¶109',
      duration: 2000,
      // Positions are unchanged from the previous keyframe; the in-place
      // bob is added by useAnimationEngine.js's applyKeyframe() whenever it
      // sees specialEffect: 'markTime' (see the startMarkTimeOscillation
      // helper there), not by moving these coordinates.
      positions: marching,
      annotations: [],
      specialEffect: 'markTime',
    },
    {
      label: 'Forward MARCH — resume',
      description: 'The company resumes forward march at the command.',
      caseyRef: '¶110',
      duration: QUICK_DURATION,
      positions: resumed,
      annotations: ['marchArrow'],
    },
  ];
}

function buildDoubleQuick(company) {
  const start = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
  const quickTime = translate(start, { dx: 0, dy: -MARCH_DIST });

  // Double quick: 165 steps/min at a 33" pace vs quick time's 110 steps/min
  // at a 28" pace (¶111, ¶117) -- ground-speed ratio =
  //   (165 x 33) / (110 x 28) = 5445 / 3080 ~= 1.7678x.
  // The double-quick leg uses this ratio to scale its DISTANCE while
  // keeping the same leg DURATION (QUICK_DURATION) as the quick-time legs,
  // so px/ms -- not just total ground covered -- reflects the faster
  // cadence. (Previously a flat `speedMultiplier: 1.5` field was attached
  // to the keyframe, but nothing in the engine ever read it -- the
  // animation played at the same rate regardless.)
  const DOUBLE_QUICK_RATIO = (165 * 33) / (110 * 28); // ~= 1.7678
  const doubleQuickDist = MARCH_DIST * DOUBLE_QUICK_RATIO; // ~198px
  const doubleQuickPos = translate(quickTime, { dx: 0, dy: -doubleQuickDist });
  const returnPos = translate(doubleQuickPos, { dx: 0, dy: -MARCH_DIST });

  return [
    {
      label: 'Company at quick time',
      description: 'The company marches at quick time — 110 paces per minute, 28-inch steps.',
      caseyRef: '¶111',
      duration: QUICK_DURATION,
      positions: quickTime,
      annotations: ['marchArrow'],
    },
    {
      label: 'Double quick MARCH',
      description:
        'At MARCH, the cadence increases to 165 paces per minute (¶117) with 33-inch steps (S.S. No. 111). Arms are held at trail or right-shoulder shift (S.S. No. 360). The pace visibly accelerates — roughly 1.77x the ground speed of quick time.',
      caseyRef: '¶111, ¶117; S.S. Nos. 111, 360',
      duration: QUICK_DURATION,
      positions: doubleQuickPos,
      annotations: ['marchArrow'],
    },
    {
      label: 'Quick time MARCH — return to normal',
      description:
        'At the command, the company returns to the ordinary quick time cadence.',
      caseyRef: '¶113–114',
      duration: QUICK_DURATION,
      positions: returnPos,
      annotations: ['marchArrow'],
    },
  ];
}

function buildBackStep(company) {
  const start = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y - 60, facing: 0 });
  // Back step: 14-inch steps rearward (S.S. No. 256, "fourteen inches to the
  // rear"). At SCALE.PACE_PX = 14px/pace (0.5px/inch), 14" = 7px/step.
  const backDist = 6 * 7; // 6 steps × 7px (14" = half a 28" pace)
  const backPos = translate(start, { dx: 0, dy: backDist });

  return [
    {
      label: 'Company halted',
      description: 'The company stands in line, facing front.',
      caseyRef: '¶115',
      duration: 0,
      positions: start,
      annotations: [],
    },
    {
      label: 'Backward MARCH',
      description:
        'At the command, soldiers step directly to the rear, 14-inch steps, without changing front. Used for short distances only — no more than a few paces.',
      caseyRef: '¶115–116',
      duration: 2000,
      positions: backPos,
      annotations: [],
    },
    {
      label: 'HALT',
      description: 'The company halts. It has moved a short distance to the rear.',
      caseyRef: '¶116',
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
  caseyParagraphs: [109, 110, 111, 112, 113, 114, 115, 116, 117, 118],

  // Commands vary by sub-movement — DrillPage calls this as a function of
  // the selected subMovement id (see DrillPage.jsx). Each tab includes the
  // resume command only where its animation actually shows the resume:
  // mark-time and double-quick both end by resuming the prior gait, while
  // back-step ends at a halt (¶115–116), so it has no resume command.
  commands: (subMovement) => {
    if (subMovement === 'double-quick') {
      return [
        { text: '1. Double quick.', type: 'preparatory' }, // ¶111
        { text: '2. MARCH.', type: 'execution' },
        { text: '1. Quick time.', type: 'preparatory' }, // ¶113 — resume shown in the animation
        { text: '2. MARCH.', type: 'execution' },
      ];
    }
    if (subMovement === 'back-step') {
      return [
        { text: '1. Company backward.', type: 'preparatory' }, // ¶115
        { text: '2. MARCH.', type: 'execution' },
      ];
    }
    // 'mark-time' (default)
    return [
      { text: '1. Mark time.', type: 'preparatory' }, // ¶109
      { text: '2. MARCH.', type: 'execution' },
      { text: '1. Forward.', type: 'preparatory' }, // ¶110 — resume shown in the animation
      { text: '2. MARCH.', type: 'execution' },
    ];
  },

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
