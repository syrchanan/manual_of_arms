import { battalionLine } from '../../../engine/battalionFormations.js';
import { wheel } from '../../../engine/formations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Second, Article I (S.B. ¶77-107): "To break to the right or the left
// into column."
//
// Each company wheels as a rigid block, all 8 simultaneously, pivoting on
// its own flank guide (the file next the wheeling shoulder marks time; the
// company files sweep around him) -- ¶79-83. This is the battalion-scale
// generalization of the identical per-unit-wheel technique already used at
// company scale for "by platoon, right wheel"
// (src/data/drills/lesson-v/breakIntoColumn.js), just with 8 units (one per
// company) instead of 2 (one per platoon): each company's pivot is its own
// pre-wheel line-of-battle position at the flank about which it turns, and
// wheel() is applied independently to each company's soldier subset.
//
// Breaking BY DIVISION or BY PLATOON (¶87-88) uses the identical means,
// substituting the larger/smaller subdivision for "company" -- not modeled
// as separate sub-movements here (see reenactorNotes); this file covers the
// plain by-company case, right and left.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 100;
const ORIGIN_Y = 250;

function idsOfCompany(co) {
  return co.soldiers.map((s) => s.id);
}

export default {
  id: 'break-by-company',
  title: 'To Break to the Right or the Left into Column',
  part: 2,
  article: 1,
  caseyParagraphs: [77, 78, 79, 81, 82, 83, 85, 87, 88, 93, 97, 99, 100, 106],
  subMovements: [
    { id: 'right', label: 'By Company, Right Wheel' },
    { id: 'left', label: 'By Company, Left Wheel' },
  ],
  commands: (subMovement) => {
    const side = subMovement === 'left' ? 'left' : 'right';
    return [
      { text: `1. By company, ${side} wheel.`, type: 'preparatory' },
      { text: '2. MARCH (or double quick -- MARCH).', type: 'execution' },
      { text: '1. Such company. 2. HALT.', type: 'execution' },
    ];
  },
  reenactorNotes:
    'Lines of battle habitually break into column by company (¶77), though breaking by division (¶87) or by platoon (¶88) follows the identical commands and principles, substituting the larger or smaller subdivision -- not separately animated here. At the first command each captain places himself before the centre of his own company and cautions it to wheel; the covering sergeant replaces him in the front rank (¶79). At MARCH, each company wheels on its own pivot flank (per S. C. No. 178); as the company nears the perpendicular, its captain independently times and commands "Such company. HALT" -- eight companies wheeling at the same MARCH, but each halting on its own captain\'s judgment, not one synchronized halt (¶81-83). Breaking to the left (¶85) is the same by inverse means: the covering sergeant, not the left guide, conducts the marching flank. Once the column is formed, the lieutenant colonel and major post six paces from the directing flank, abreast the leading and last subdivisions respectively (¶93); a battalion already marching in line, or wishing to prolong the column and continue forward without re-halting, breaks by the same commands and then resumes with "Forward. MARCH. Guide left" (¶97-100). The special double-wheel-and-marker case for breaking one way to march the other (¶106) is not modeled in this drill.',

  buildKeyframes: (_company, subMovement, battalion = DEFAULT_BATTALION) => {
    const isRight = subMovement !== 'left';
    const angleDeg = isRight ? 90 : -90;

    const inLine = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
    const posMap = new Map(inLine.map((p) => [p.id, p]));

    // Right wheel pivots on each company's own right-flank file (file 1,
    // of-cpt's line position); left wheel pivots on its left-flank file
    // (file 20, fr-20's line position) -- ¶81 (right) / ¶85 (left).
    const pivotOf = (co) =>
      isRight ? posMap.get(`c${co.index}-of-cpt`) : posMap.get(`c${co.index}-fr-20`);

    function applyWheel(angle) {
      const out = [];
      battalion.forEach((co) => {
        const pivot = pivotOf(co);
        const subset = idsOfCompany(co).map((id) => posMap.get(id));
        out.push(...wheel(subset, { pivotX: pivot.x, pivotY: pivot.y, angleDeg: angle }));
      });
      return out;
    }

    const quarterWheel = applyWheel(angleDeg * 0.25);
    const halfWheel = applyWheel(angleDeg * 0.5);
    const nearPerpendicular = applyWheel(angleDeg * 0.85);
    const fullWheel = applyWheel(angleDeg);

    return [
      {
        label: 'Battalion in line of battle',
        description:
          'The battalion stands in line of battle, 8 companies abreast on one continuous line, either halted or already marching.',
        caseyRef: '¶77',
        duration: 0,
        positions: inLine,
        annotations: [],
      },
      {
        label: `By company, ${isRight ? 'right' : 'left'} wheel`,
        description:
          'At the first command, each captain places himself rapidly before the centre of his own company and cautions it to wheel; each covering sergeant replaces the captain in the front rank.',
        caseyRef: '¶79',
        duration: 700,
        positions: inLine,
        annotations: [],
      },
      {
        label: 'MARCH -- companies wheel',
        description:
          'At MARCH, all 8 companies wheel simultaneously, each on its own pivot flank -- the marching flank\'s guide conducts it as the company sweeps around.',
        caseyRef: isRight ? '¶81' : '¶85',
        duration: 1200,
        positions: quarterWheel,
        annotations: ['wheelingPoint'],
      },
      {
        label: 'Wheel continues',
        description:
          'Each company continues to wheel toward the perpendicular; captains watch their own companies independently.',
        caseyRef: isRight ? '¶81' : '¶85',
        duration: 1200,
        positions: halfWheel,
        annotations: ['wheelingPoint'],
      },
      {
        label: 'Nearing the perpendicular -- HALT commanded',
        description:
          'As each company nears the perpendicular to the original line, its captain (timed so the marching guide is three paces from the perpendicular) commands "Such company. HALT." Companies halt independently, clustered around the same moment rather than all at once.',
        caseyRef: '¶81-82',
        duration: 1200,
        positions: nearPerpendicular,
        annotations: ['wheelingPoint'],
      },
      {
        label: 'Column of companies formed',
        description:
          'Each company halts, faces front, and is aligned by its captain on the marching guide, who has placed himself on the alignment; the captain then takes post two paces before the company\'s centre. The battalion now stands in column of companies. Guides that are slightly out of line stand fast rather than propagate the error, and self-correct once the column is put in march.',
        caseyRef: '¶82-83, ¶93',
        duration: 1200,
        positions: fullWheel,
        annotations: ['marchArrow'],
      },
    ];
  },
};
