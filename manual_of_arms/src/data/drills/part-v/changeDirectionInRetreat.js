import { battalionLine } from '../../../engine/battalionFormations.js';
import { wheel } from '../../../engine/formations.js';
import { DEFAULT_BATTALION, FIELD_AND_STAFF, COLOR_PARTY, COLOR_COMPANY_INDEX } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article VII (S.B. ¶751-752): "Change of direction in marching
// in retreat."
//
// Casey gives NO new commands or mechanic here: a battalion retiring in line
// changes direction "by the commands and means indicated No. 717 and
// following" -- the same forward-marching change-of-direction wheel already
// used elsewhere in Part Fifth (out of this article's paragraph range). The
// one wrinkle specific to retreat (¶751): the three file closers united
// behind the color-rank (established during the retreat-facing role-swap,
// cf. Article VI / ¶736) must conform to the color-rank's movement and wheel
// with it, holding a steady distance from the color-bearer.
//
// Engine approach: this project's wheel() primitive already rotates every
// soldier in the input array RIGIDLY about a single pivot -- so building the
// full retreat-faced battalion (companies + color party + field-and-staff,
// per Article VI's geometry) and passing that WHOLE array through wheel()
// automatically preserves every satellite group's relative offset from the
// color-bearer throughout the turn, satisfying ¶751's requirement without
// any additional per-group logic. The centre file closer's longer (14in/17in)
// step, needed so he clears the wheeling point in time, is a human-cadence
// detail with no geometric consequence -- called out in reenactorNotes only,
// matching this project's existing precedent (part-iii/changeDirectionHalf.js
// treats the analogous half-distance step-length detail the same way).
// ---------------------------------------------------------------------------

const { PACE_PX, RANK_GAP, FILE_CLOSER_GAP, FILE_INTERVAL } = SCALE;

const RETREAT_FACING = 180;
const DEPTH_FILE_CLOSER = RANK_GAP + FILE_CLOSER_GAP;
const RETREAT_COLOR_DEPTH = DEPTH_FILE_CLOSER + 6 * PACE_PX; // ¶736 cross-ref

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 260;
const ORIGIN_Y = 160;
const APPROACH_PACES = 6;

const rankById = new Map(
  DEFAULT_BATTALION.flatMap((co) => co.soldiers.map((s) => [s.id, s.rank]))
);
const DEPTH = { front: 0, rear: RANK_GAP, fileCloser: DEPTH_FILE_CLOSER };

function moveToDepth(positions, id, depthPx, acrossNudgePx = 0) {
  return positions.map((p) => {
    if (p.id !== id) return p;
    const curDepth = DEPTH[rankById.get(id)] ?? 0;
    return { ...p, y: p.y - curDepth + depthPx, x: p.x + acrossNudgePx };
  });
}

function colorRankAnchor(positions) {
  const right = positions.find((p) => p.id === `c${COLOR_COMPANY_INDEX}-of-cpt`);
  const left = positions.find((p) => p.id === `c${COLOR_COMPANY_INDEX}-fr-20`);
  return { x: (right.x + left.x) / 2, y: (right.y + left.y) / 2 };
}

function battalionCentre(positions) {
  const right = positions.find((p) => p.id === 'c1-of-cpt');
  const left = positions.find((p) => p.id === `c${DEFAULT_BATTALION.length}-fr-20`);
  return { x: (right.x + left.x) / 2, y: (right.y + left.y) / 2, halfWidth: Math.abs(right.x - left.x) / 2 };
}

function colorPartyAt(anchor, depthPx, facing) {
  return [
    { id: 'color-bearer', x: anchor.x, y: anchor.y + depthPx, facing },
    { id: 'color-cpl-centre', x: anchor.x, y: anchor.y + depthPx + 6, facing },
    { id: 'color-cpl-right', x: anchor.x + FILE_INTERVAL, y: anchor.y + depthPx, facing },
    { id: 'color-cpl-left', x: anchor.x - FILE_INTERVAL, y: anchor.y + depthPx, facing },
    { id: 'guide-right', x: anchor.x + 3 * FILE_INTERVAL, y: anchor.y + depthPx, facing },
    { id: 'guide-left', x: anchor.x - 3 * FILE_INTERVAL, y: anchor.y + depthPx, facing },
  ];
}

function fieldAndStaffAt(centre, depthPx, facing) {
  return [
    { id: 'fs-col', x: centre.x, y: centre.y + depthPx + 6 * PACE_PX, facing },
    { id: 'fs-ltc', x: centre.x + centre.halfWidth * 0.5, y: centre.y + depthPx, facing },
    { id: 'fs-smaj', x: centre.x - centre.halfWidth * 0.5, y: centre.y + depthPx, facing },
    { id: 'fs-jmaj', x: centre.x, y: centre.y + depthPx - 3 * PACE_PX, facing },
  ];
}

/** Build the full 382-soldier battalion, already faced/marching in retreat
 * (Article VI's end state): captains/covering sergeants at the file-closer
 * depth, color party 6 paces beyond it, field-and-staff schematic. */
function buildRetreatBattalion(base) {
  let companies = base.map((p) => ({ ...p, facing: RETREAT_FACING }));
  DEFAULT_BATTALION.forEach((co) => {
    companies = moveToDepth(companies, `c${co.index}-of-cpt`, DEPTH.fileCloser, 0);
    companies = moveToDepth(companies, `c${co.index}-nc-cov`, DEPTH.fileCloser, FILE_INTERVAL);
  });
  const anchor = colorRankAnchor(base);
  const centre = battalionCentre(base);
  return [
    ...companies,
    ...colorPartyAt(anchor, RETREAT_COLOR_DEPTH, RETREAT_FACING),
    ...fieldAndStaffAt(centre, DEPTH.fileCloser, RETREAT_FACING),
  ];
}

export default {
  id: 'change-direction-in-retreat',
  title: 'Change of Direction in Marching in Retreat',
  part: 5,
  article: 7,
  caseyParagraphs: [751],
  subMovements: [
    { id: 'right', label: 'Right Wheel' },
    { id: 'left', label: 'Left Wheel' },
  ],
  commands: (subMovement) => {
    const side = subMovement === 'left' ? 'left' : 'right';
    // ¶751 delegates to "No. 717 and following": the change-of-direction pair
    // (¶717) then the direct-march resume pair (¶726), each with its own
    // numbering restarting at 1 exactly as Casey's text prints them.
    return [
      { text: `1. Change direction to the ${side}.`, type: 'preparatory' },
      { text: '2. MARCH (or double quick—MARCH).', type: 'execution' },
      { text: '1. Forward.', type: 'preparatory' },
      { text: '2. MARCH.', type: 'execution' },
    ];
  },
  reenactorNotes:
    "No new commands: a battalion retiring in line changes direction by the identical commands and means already used for the forward-marching case (¶751, cross-referencing No. 717 and following, out of this article's range). The wrinkle unique to retreat is that the three file closers united behind the color-rank (Article VI's role-swap) must conform to the color-rank's own movement and wheel with it, the centre file closer holding a steady distance from the color-bearer while taking a longer step (14in quick time / 17in double quick) to keep pace through the turn. Because this drill wheels the whole retreat-faced battalion -- companies, color party, and field-and-staff alike -- as one rigid body about the pivot flank, that steady-distance relationship is preserved automatically by the rotation itself; the step-length detail is a cadence note for the human file closer, not a change in the animated geometry. The pivot is the flank now on the geographic side of the change: because the battalion has faced about, the wings have swapped designation (¶736, \"the left wing, now right\"), so a change of direction to the right pivots on company 8's flank and a change to the left on company 1's -- the inverse of the forward-marching case (¶719).",

  buildKeyframes: (_company, subMovement, battalion = DEFAULT_BATTALION) => {
    const base = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
    const marching = buildRetreatBattalion(base);

    // Approach a few paces along the current line of march (retreat facing
    // 180 = "ahead" is +y on screen) before wheeling, for visible run-up.
    const approachPx = APPROACH_PACES * PACE_PX;
    const approaching = marching.map((s) => ({ ...s, y: s.y + approachPx }));

    const isLeft = subMovement === 'left';
    // ¶736: once faced about to retreat, the wings swap designation -- the
    // geographic-left wing (companies 5-8) becomes "the right." So a "change
    // direction to the right" while retreating pivots on the captain now on
    // the geographic right, i.e. company 8's flank; a left change pivots on
    // company 1. This is the inverse of the forward-marching case (¶719).
    const pivotId = isLeft ? 'c1-of-cpt' : `c${DEFAULT_BATTALION.length}-of-cpt`;
    const pivot = approaching.find((p) => p.id === pivotId);
    const angleDeg = isLeft ? -90 : 90;

    const wheel30 = wheel(approaching, { pivotX: pivot.x, pivotY: pivot.y, angleDeg: angleDeg * (30 / 90) });
    const wheel60 = wheel(approaching, { pivotX: pivot.x, pivotY: pivot.y, angleDeg: angleDeg * (60 / 90) });
    const wheeled = wheel(approaching, { pivotX: pivot.x, pivotY: pivot.y, angleDeg });

    return [
      {
        label: 'Battalion marching in retreat, in line',
        description:
          'The battalion, faced and marching to the rear, holds a straight line of march: color-rank leading with the file-closer trio and general guides united behind it, captains and covering sergeants at the file-closer line.',
        caseyRef: '¶751',
        duration: 0,
        positions: marching,
        annotations: ['marchArrow'],
      },
      {
        label: 'Approaching the wheeling point',
        description: 'The battalion approaches the point where the change of direction is to be made, retiring straight.',
        caseyRef: '¶751',
        duration: 1200,
        positions: approaching,
        annotations: ['marchArrow', 'wheelingPoint'],
      },
      {
        label: `${isLeft ? 'Left' : 'Right'} wheel commences`,
        description:
          'The battalion begins to wheel about the pivot flank; the file-closer trio and color party conform to the color-rank\'s movement, holding their distance throughout the turn.',
        caseyRef: '¶751',
        duration: 1200,
        positions: wheel30,
        annotations: ['wheelingArc', 'wheelingPoint'],
      },
      {
        label: 'Wheel continues',
        description: 'The line continues to sweep around the fixed pivot flank, the centre file closer taking a longer step to keep pace.',
        caseyRef: '¶751',
        duration: 1200,
        positions: wheel60,
        annotations: ['wheelingArc', 'wheelingPoint'],
      },
      {
        label: 'Battalion in new direction, still retiring',
        description: 'The wheel complete, the battalion resumes a straight line of march in the new direction, still faced and moving to the rear.',
        caseyRef: '¶751',
        duration: 1500,
        positions: wheeled,
        annotations: ['marchArrow'],
      },
    ];
  },
};
