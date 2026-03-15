import { columnOfPlatoons, wheel } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 - 40;
const ORIGIN_Y = 200;

export default {
  id: 'change-direction',
  title: 'To Change Direction in Column',
  lesson: 5,
  article: 3,
  caseyParagraphs: [158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172],
  commands: [
    { text: '1. Head of column to the left.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],
  reenactorNotes:
    'Two variants: (A) Change direction to the guide side — the guide turns at the designated point and the platoon swings around. Men farthest from the guide double-quick to maintain alignment. (B) Change direction opposite the guide — the platoon wheels as a body, with the pivot man taking 9-inch steps and the wheeling flank taking full steps. Variant A is a turn; variant B is a wheel.',

  buildKeyframes: (company, subMovement) => {
    if (subMovement === 'rightWheel') {
      return buildRightWheel(company);
    }
    return buildLeftTurn(company);
  },
};

/**
 * Variant A: Change direction to the guide side (left turn).
 * Guide of 1st platoon turns left at the turning point. Rest of platoon swings around.
 */
function buildLeftTurn(company) {
  // Column marching east, guide left (north side)
  const column = columnOfPlatoons(company, {
    originX: ORIGIN_X,
    originY: ORIGIN_Y,
    facing: 90,
    guide: 'left',
  });

  const marchDist = 8 * SCALE.PACE_PX;
  const marching = column.map((s) => ({ ...s, x: s.x + marchDist }));

  // Turning point: where the guide of the 1st platoon turns left
  // Approximate: wheel the 1st platoon around its guide (leftmost = northernmost file)
  const p1Ids = new Set(company.filter((s) => s.platoon === 1 && s.rank !== 'fileCloser').map((s) => s.id));
  const p2Ids = new Set(company.filter((s) => s.platoon === 2 && s.rank !== 'fileCloser').map((s) => s.id));

  // Find leftmost file of 1st platoon (file 10) as pivot for the turn
  const file10Pos = marching.find((s) => s.id === 'fr-10');
  const pivotX = file10Pos?.x ?? ORIGIN_X + marchDist;
  const pivotY = file10Pos?.y ?? ORIGIN_Y;

  // 1st platoon turns left, 2nd still marching
  const p1Turned = marching.map((s) => {
    if (p1Ids.has(s.id)) return wheel([s], { pivotX, pivotY, angleDeg: -90 })[0];
    return s;
  });

  // 2nd platoon arrives at turning point and turns
  const p2PivotX = pivotX;
  const p2PivotY = pivotY;
  const allTurned = p1Turned.map((s) => {
    if (p1Ids.has(s.id)) {
      // 1st platoon has marched further north
      return { ...s, y: s.y - 4 * SCALE.PACE_PX };
    }
    if (p2Ids.has(s.id)) return wheel([s], { pivotX: p2PivotX, pivotY: p2PivotY, angleDeg: -90 })[0];
    return { ...s, facing: 0 };
  });

  // Column in new direction (north)
  const newColumn = columnOfPlatoons(company, {
    originX: pivotX,
    originY: pivotY - 6 * SCALE.PACE_PX,
    facing: 0,
    guide: 'left',
  });

  return [
    {
      label: 'Column marching, guide left',
      description: 'Column of platoons marches east. Guide is on the left (north side).',
      caseyRef: '¶158–159',
      duration: 1500,
      positions: marching,
      annotations: ['marchArrow', 'platoonDistance'],
    },
    {
      label: 'Head of column to the left — MARCH',
      description:
        'The guide of the 1st platoon turns 90° left at the turning point and marches in the new direction. The rest of the platoon swings around — men farthest from the guide double-quick.',
      caseyRef: '¶160–163',
      duration: 2000,
      positions: p1Turned,
      annotations: ['wheelingArc', 'wheelingPoint'],
    },
    {
      label: '2nd platoon turns at the same point',
      description:
        'The guide of the 2nd platoon turns at the same point. Both platoons are now in the new direction.',
      caseyRef: '¶164–166',
      duration: 2000,
      positions: allTurned,
      annotations: ['wheelingArc', 'wheelingPoint'],
    },
    {
      label: 'Column in new direction',
      description: 'The column continues marching north.',
      caseyRef: '¶167',
      duration: 1500,
      positions: newColumn,
      annotations: ['marchArrow'],
    },
  ];
}

/**
 * Variant B: Change direction opposite the guide (right wheel).
 * Each platoon wheels right — pivot man takes 9" steps, wheeling flank full steps.
 */
function buildRightWheel(company) {
  const column = columnOfPlatoons(company, {
    originX: ORIGIN_X,
    originY: ORIGIN_Y,
    facing: 90,
    guide: 'left',
  });

  const marchDist = 8 * SCALE.PACE_PX;
  const marching = column.map((s) => ({ ...s, x: s.x + marchDist }));

  const p1Ids = new Set(company.filter((s) => s.platoon === 1 && s.rank !== 'fileCloser').map((s) => s.id));
  const p2Ids = new Set(company.filter((s) => s.platoon === 2 && s.rank !== 'fileCloser').map((s) => s.id));

  // 1st platoon: rightmost file (file 1) is pivot
  const captainPos = marching.find((s) => s.id === 'of-cpt');
  const p1PivotX = captainPos?.x ?? ORIGIN_X + marchDist;
  const p1PivotY = captainPos?.y ?? ORIGIN_Y;

  // 1st platoon wheels right 90°
  const p1Wheeled = marching.map((s) => {
    if (p1Ids.has(s.id)) return wheel([s], { pivotX: p1PivotX, pivotY: p1PivotY, angleDeg: 90 })[0];
    return s;
  });

  // 1st platoon marches in new direction, 2nd platoon reaches wheel point
  const file11Pos = marching.find((s) => s.id === 'fr-11');
  const p2PivotX = file11Pos?.x ?? ORIGIN_X + marchDist;
  const p2PivotY = file11Pos?.y ?? ORIGIN_Y;

  const allWheeled = p1Wheeled.map((s) => {
    if (p1Ids.has(s.id)) return { ...s, y: s.y + 4 * SCALE.PACE_PX };
    if (p2Ids.has(s.id)) return wheel([s], { pivotX: p2PivotX, pivotY: p2PivotY, angleDeg: 90 })[0];
    return { ...s, facing: 180 };
  });

  // Column in new direction (south)
  const newColumn = columnOfPlatoons(company, {
    originX: p1PivotX,
    originY: p1PivotY + 6 * SCALE.PACE_PX,
    facing: 180,
    guide: 'left',
  });

  return [
    {
      label: 'Column marching, guide left',
      description: 'Column of platoons marches east. Guide is on the left (north side).',
      caseyRef: '¶168',
      duration: 1500,
      positions: marching,
      annotations: ['marchArrow', 'platoonDistance'],
    },
    {
      label: 'Right wheel — MARCH (1st platoon)',
      description:
        'The 1st platoon wheels right. The rightmost file is the pivot (9-inch steps). The left/guide side takes full steps. The platoon arcs through 90°.',
      caseyRef: '¶169–170',
      duration: 2500,
      positions: p1Wheeled,
      annotations: ['wheelingArc', 'wheelingPoint'],
    },
    {
      label: 'Right wheel — MARCH (2nd platoon)',
      description:
        'On reaching the same point, the 2nd platoon wheels right.',
      caseyRef: '¶171',
      duration: 2500,
      positions: allWheeled,
      annotations: ['wheelingArc', 'wheelingPoint'],
    },
    {
      label: 'Column in new direction',
      description: 'The column continues marching south.',
      caseyRef: '¶172',
      duration: 1500,
      positions: newColumn,
      annotations: ['marchArrow'],
    },
  ];
}
