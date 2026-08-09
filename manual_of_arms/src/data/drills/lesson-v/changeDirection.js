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
 * Variant A: Change direction to the side of the guide (¶229, mechanics S.S. ¶415).
 * Guide is already left; the chief commands "Left turn" (not "wheel"). This is
 * NOT a rigid wheel about a fixed pivot man: per S.S. ¶415 the guide "will face
 * to the left in marching, and move forward in the new direction without
 * slackening or quickening the cadence" — i.e. he marches straight through the
 * turn point — while the rest of the rank "advance the shoulder opposite to the
 * guide, take the double quick step... and arrive successively on the alignment."
 * We therefore model it as a diagonal convergence onto the new line of march
 * (each file translated straight to its new place, the guide first and the far
 * files lagging), not the arc-sweep used for the true wheel in buildRightWheel.
 * Each subdivision changes direction at the same marked ground point (¶230).
 */
function buildLeftTurn(company) {
  const rawColumn = columnOfPlatoons(company, {
    originX: ORIGIN_X,
    originY: ORIGIN_Y,
    facing: 90,
  });
  const column = postColumnChiefsAndGuides(rawColumn);

  const marchDist = 8 * SCALE.PACE_PX;
  const marching = column.map((s) => ({ ...s, x: s.x + marchDist }));
  const marchingMap = new Map(marching.map((s) => [s.id, s]));

  // Turning ground point: the left (guide) file of the 1st platoon, file 10.
  const turnPt = marchingMap.get('fr-10');
  const pivotX = turnPt?.x ?? ORIGIN_X + marchDist;
  const pivotY = turnPt?.y ?? ORIGIN_Y;

  // Arrived state: the column re-formed marching NORTH. Because the guide does
  // not stop and pivot (S.S. ¶415) but steps straight off in the new direction,
  // we build a north-facing column and slide it so the 1st-platoon guide
  // (file 10) sits on the straight continuation of its own line, a couple of
  // paces past the turn point (he has kept marching while the rank forms).
  const GUIDE_ADVANCE = 2 * SCALE.PACE_PX;
  const north0 = postColumnChiefsAndGuides(
    columnOfPlatoons(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 })
  );
  const g0 = north0.find((s) => s.id === 'fr-10');
  const dx = pivotX - g0.x;
  const dy = pivotY - GUIDE_ADVANCE - g0.y;
  const arrived = north0.map((s) => ({ ...s, x: s.x + dx, y: s.y + dy }));
  const arrivedMap = new Map(arrived.map((s) => [s.id, s]));

  const platoonOf = new Map(company.map((s) => [s.id, s.platoon]));
  const fileOf = new Map(company.map((s) => [s.id, s.file]));

  // Diagonal-convergence snapshot: interpolate each man straight from his
  // marching position to his place on the new alignment, with a per-file delay
  // so the guide (nearest the turn) arrives first and each successive file
  // toward the far flank lags ("arrive successively on the alignment," ¶415).
  // Facing eases 90 -> 0 as he carries himself into the new direction. This
  // deliberately reads as a shoulder-shift convergence, not the rigid arc of a
  // wheel — the whole point of the "turn vs wheel" contrast (¶229).
  const MAX_DELAY = 0.55;
  function snapshot(progressByPlatoon) {
    return marching.map((s) => {
      const progress = progressByPlatoon[platoonOf.get(s.id)] ?? 0;
      if (progress <= 0) return s;
      const to = arrivedMap.get(s.id);
      if (!to) return s;
      const localFile = ((fileOf.get(s.id) - 1) % 10) + 1; // 1..10; file 10 = guide (left)
      const delay = ((10 - localFile) / 9) * MAX_DELAY; // guide -> 0, far flank -> MAX_DELAY
      const frac = Math.max(0, Math.min(1, (progress - delay) / (1 - delay)));
      return {
        ...s,
        x: s.x + (to.x - s.x) * frac,
        y: s.y + (to.y - s.y) * frac,
        facing: 90 + (0 - 90) * frac,
      };
    });
  }

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
        'The chief commands "Left turn" (not "wheel"). The guide faces left in marching and steps straight off in the new direction without checking his cadence; the rest of the rank advance the opposite shoulder, take the double-quick step, and arrive successively on his alignment — a shoulder-shift onto the new line, not a wheel about a fixed pivot (¶229; S.S. ¶415).',
      caseyRef: '¶229–231',
      duration: 2000,
      positions: snapshot({ 1: 0.65, 2: 0 }),
      annotations: ['marchArrow', 'wheelingPoint'],
    },
    {
      label: '2nd platoon turns at the same point',
      description:
        'The 1st platoon, formed on the new alignment, marches north. The 2nd platoon comes straight on and turns at the identical ground point where the 1st platoon turned — never at its own separately-judged point (¶230).',
      caseyRef: '¶230–231',
      duration: 2000,
      positions: snapshot({ 1: 1, 2: 0.65 }),
      annotations: ['marchArrow', 'wheelingPoint'],
    },
    {
      label: 'Column in new direction',
      description:
        'The column continues marching north. Throughout, the guides never alter the length or cadence of the step (¶233).',
      caseyRef: '¶233',
      duration: 1500,
      positions: arrived,
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
