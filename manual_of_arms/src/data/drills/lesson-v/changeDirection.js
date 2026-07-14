import { columnOfPlatoons, wheel } from '../../../engine/formations.js';
import { postColumnChiefsAndGuides } from '../../../engine/columnPosts.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 - 40;
const ORIGIN_Y = 200;

export default {
  id: 'change-direction',
  title: 'To Change Direction in Column',
  lesson: 5,
  article: 3,
  caseyParagraphs: [
    216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235,
  ],
  subMovements: [
    { id: 'left-turn', label: 'A) Turn to the Side of the Guide (Left)' },
    { id: 'right-wheel', label: 'B) Wheel Opposite the Guide (Right)' },
  ],
  commands: (subMovement) => {
    if (subMovement === 'right-wheel') {
      return [
        { text: '1. Right wheel.', type: 'preparatory' },
        { text: '2. MARCH.', type: 'execution' },
        { text: '3. Forward.', type: 'preparatory' },
        { text: '4. MARCH.', type: 'execution' },
      ];
    }
    return [
      { text: '1. Left turn.', type: 'preparatory' },
      { text: '2. MARCH.', type: 'execution' },
    ];
  },
  reenactorNotes:
    'Two distinct maneuvers. (A) Turn to the side of the guide (¶229): used to prepare the men for line formations that must turn only right or left. The chief of the leading platoon commands "Left (or right) turn" instead of "wheel," and each file turns in succession, the leading guide taking new points on the ground as soon as he has turned. (B) Wheel opposite the guide (¶216–223): a marker is posted at the exact point where the change is to be made; the leading guide directs his march so his arm just grazes the marker\'s breast, and the chief of platoon commands "Right (or left) wheel, MARCH" at the proper instant. ' +
    'Per ¶230, it is essential that every subdivision of the column change direction at precisely the same ground point where the leading one did — this is why the point is marked in advance, and why each following chief withholds his command until his own guide grazes the same marker. Throughout, the guides never alter the length or cadence of the step, whether the change is to the side of the guide or away from it (¶233).',

  buildKeyframes: (company, subMovement) => {
    if (subMovement === 'right-wheel') {
      return buildRightWheel(company);
    }
    return buildLeftTurn(company);
  },
};

/**
 * Variant A: Change direction to the side of the guide (¶229).
 * Guide is already left; the chief of the leading platoon commands "Left turn"
 * (not "wheel"). Each subdivision turns in succession at the same marked point (¶230).
 */
function buildLeftTurn(company) {
  const rawColumn = columnOfPlatoons(company, {
    originX: ORIGIN_X,
    originY: ORIGIN_Y,
    facing: 90,
  });
  const column = postColumnChiefsAndGuides(rawColumn);

  const marchDist = 8 * SCALE.PACE_PX;
  const marchingRaw = rawColumn.map((s) => ({ ...s, x: s.x + marchDist }));
  const marching = column.map((s) => ({ ...s, x: s.x + marchDist }));

  const p1Ids = new Set(company.filter((s) => s.platoon === 1).map((s) => s.id));
  const p2Ids = new Set(company.filter((s) => s.platoon === 2).map((s) => s.id));

  // Turning point: the guide-flank file of the 1st platoon (file 10), whose guide
  // grazes the marker and turns (¶229–230). fr-10 is an ordinary file, unaffected by
  // the chief/guide overrides, so it is safe to read from either raw or posted column —
  // taken from the raw column here for clarity/consistency with buildRightWheel below.
  const file10Pos = marchingRaw.find((s) => s.id === 'fr-10');
  const pivotX = file10Pos?.x ?? ORIGIN_X + marchDist;
  const pivotY = file10Pos?.y ?? ORIGIN_Y;

  // 1st platoon turns left at the marked point; 2nd platoon has not yet arrived (¶231).
  const p1Turned = marching.map((s) =>
    p1Ids.has(s.id) ? wheel([s], { pivotX, pivotY, angleDeg: -90 })[0] : s
  );

  // Per ¶230, the 2nd platoon must change direction at the SAME ground point the 1st
  // platoon did — reuse the identical pivot (shared variable, not a separately derived
  // one for the 2nd platoon's own file).
  const p2PivotX = pivotX;
  const p2PivotY = pivotY;
  const allTurned = p1Turned.map((s) => {
    if (p1Ids.has(s.id)) {
      // 1st platoon has continued marching in the new (north) direction.
      return { ...s, y: s.y - 4 * SCALE.PACE_PX };
    }
    if (p2Ids.has(s.id)) return wheel([s], { pivotX: p2PivotX, pivotY: p2PivotY, angleDeg: -90 })[0];
    return s;
  });

  // Column re-established in the new direction (north), guide still on its own side.
  const newRaw = columnOfPlatoons(company, {
    originX: pivotX,
    originY: pivotY - 6 * SCALE.PACE_PX,
    facing: 0,
  });
  const newColumn = postColumnChiefsAndGuides(newRaw);

  return [
    {
      label: 'Column marching, guide left',
      description:
        'Column of platoons marches east. The guide is on the left — the side toward which the coming turn will be made (¶229).',
      caseyRef: '¶229',
      duration: 1500,
      positions: marching,
      annotations: ['marchArrow', 'platoonDistance'],
    },
    {
      label: 'Left turn — MARCH (1st platoon)',
      description:
        'The chief of the 1st platoon commands "Left turn" (not "wheel") at the marked point. Each file turns in succession; the leading guide, as soon as he has turned, takes new points on the ground to regulate the new direction (¶229).',
      caseyRef: '¶229–231',
      duration: 2000,
      positions: p1Turned,
      annotations: ['wheelingArc', 'wheelingPoint'],
    },
    {
      label: '2nd platoon turns at the same point',
      description:
        'The 2nd platoon continues straight on and turns at the identical ground point where the 1st platoon turned — never at its own separately-judged point (¶230).',
      caseyRef: '¶230–231',
      duration: 2000,
      positions: allTurned,
      annotations: ['wheelingArc', 'wheelingPoint'],
    },
    {
      label: 'Column in new direction',
      description:
        'The column continues marching north. The guides never alter the length or cadence of the step through the turn (¶233).',
      caseyRef: '¶233',
      duration: 1500,
      positions: newColumn,
      annotations: ['marchArrow'],
    },
  ];
}

/**
 * Variant B: Change direction opposite the guide (¶216–223).
 * Guide is already left (opposite the right-hand turn), so no guide change is needed.
 * The wheel pivots on the flank OPPOSITE the guide: platoon 1's file-1 corner.
 */
function buildRightWheel(company) {
  const rawColumn = columnOfPlatoons(company, {
    originX: ORIGIN_X,
    originY: ORIGIN_Y,
    facing: 90,
  });
  const column = postColumnChiefsAndGuides(rawColumn);

  const marchDist = 8 * SCALE.PACE_PX;
  const marchingRaw = rawColumn.map((s) => ({ ...s, x: s.x + marchDist }));
  const marching = column.map((s) => ({ ...s, x: s.x + marchDist }));

  const p1Ids = new Set(company.filter((s) => s.platoon === 1).map((s) => s.id));
  const p2Ids = new Set(company.filter((s) => s.platoon === 2).map((s) => s.id));

  // Wheel pivot: the flank OPPOSITE the guide (guide is left, so the pivot is the
  // right flank — platoon 1's file-1 corner, ¶216–218). Read from the RAW column: of-cpt
  // is one of the four overridden ids, so its posted position is the CHIEF's offset
  // position, not the true corner — using the raw column here is what avoids that trap.
  const p1Corner = marchingRaw.find((s) => s.id === 'of-cpt');
  const p1PivotX = p1Corner?.x ?? ORIGIN_X + marchDist;
  const p1PivotY = p1Corner?.y ?? ORIGIN_Y;

  const p1Wheeled = marching.map((s) =>
    p1Ids.has(s.id) ? wheel([s], { pivotX: p1PivotX, pivotY: p1PivotY, angleDeg: 90 })[0] : s
  );

  // CRITICAL FIX (¶230): every subdivision must change direction at the exact point
  // where the leading one did. The 2nd platoon's pivot must be the SAME ground point
  // as the 1st platoon's — not the 2nd platoon's own (still-trailing) file-11 corner.
  // Mirrors buildLeftTurn's p2PivotX = pivotX pattern above.
  const p2PivotX = p1PivotX;
  const p2PivotY = p1PivotY;

  const allWheeled = p1Wheeled.map((s) => {
    if (p1Ids.has(s.id)) {
      // 1st platoon has completed its wheel and continues forward in the new direction.
      return { ...s, y: s.y + 4 * SCALE.PACE_PX };
    }
    if (p2Ids.has(s.id)) return wheel([s], { pivotX: p2PivotX, pivotY: p2PivotY, angleDeg: 90 })[0];
    return { ...s, facing: 180 };
  });

  // Column re-established in the new direction (south).
  const newRaw = columnOfPlatoons(company, {
    originX: p1PivotX,
    originY: p1PivotY + 6 * SCALE.PACE_PX,
    facing: 180,
  });
  const newColumn = postColumnChiefsAndGuides(newRaw);

  return [
    {
      label: 'Column marching, guide left',
      description:
        'The column marches east; the guide is on the left, opposite the side to which the change of direction will be made — no guide change is needed for this turn (¶216).',
      caseyRef: '¶216–219',
      duration: 1500,
      positions: marching,
      annotations: ['marchArrow', 'platoonDistance'],
    },
    {
      label: 'Right wheel — MARCH (1st platoon)',
      description:
        'The leading guide\'s left arm just grazes the marker; the chief of the 1st platoon commands Right wheel, MARCH at that instant. The platoon wheels to the right on its file-1 corner, opposite the guide (¶217–220).',
      caseyRef: '¶217–220',
      duration: 2500,
      positions: p1Wheeled,
      annotations: ['wheelingArc', 'wheelingPoint'],
    },
    {
      label: 'Right wheel — MARCH (2nd platoon)',
      description:
        'The 1st platoon, its wheel complete, moves forward in the new direction (¶221–222). The 2nd platoon changes direction at the identical ground point where the 1st platoon did (¶230), then it too moves forward (¶223).',
      caseyRef: '¶221–223, ¶230',
      duration: 2500,
      positions: allWheeled,
      annotations: ['wheelingArc', 'wheelingPoint'],
    },
    {
      label: 'Column in new direction',
      description: 'The column continues marching south, guide still on the flank opposite the turn.',
      caseyRef: '¶216, ¶235',
      duration: 1500,
      positions: newColumn,
      annotations: ['marchArrow'],
    },
  ];
}
