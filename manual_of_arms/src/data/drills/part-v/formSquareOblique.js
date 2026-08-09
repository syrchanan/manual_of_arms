import { wheel } from '../../../engine/formations.js';
import { battalionLine, columnOfCompanies, formSquare } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { buildColorParty, buildFieldAndStaff, captainPos } from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article XIV (S.B. ¶1167-1181): "Oblique squares" -- a
// battalion square whose whole footprint is rotated to a diagonal (oblique)
// angle relative to the original line of battle or column heading, rather
// than a different rank-depth or entry-path variant.
//
// ROTATION ANGLE: Casey's text (¶1168, ¶1175) never states a degree figure
// -- it specifies the lieutenant-colonel tracing two 12-pace legs, the
// first along the original front, the second perpendicular to it, meeting
// at a marker. Two equal legs meeting at a right angle describe a right
// isosceles triangle, whose non-right angles are 45 degrees each -- so the
// new heading sits 45 degrees off the original one. This is this project's
// OWN INFERENCE from the geometry described, not an explicit source
// statement (flagged in battalion-spec/part-fifth-f.md's own complexity
// notes for this section) -- worth double-checking against the original
// plates if a diagram surfaces, since this project's source extraction is
// text-only.
//
// ARCHITECTURE: `formSquare()` already accepts an arbitrary `facing` --
// exactly the "rotation parameter threaded through the whole pipeline" the
// spec flags as the key architectural requirement for oblique squares. Both
// sub-movements below simply reach the ordinary baseline square shape at
// facing = 45 (a right oblique; a left oblique, facing = -45 / 315, is the
// mirror image and not separately animated) instead of facing = 0 -- no new
// square geometry, only a new ENTRY heading.
// ---------------------------------------------------------------------------

const ORIGIN_X = 1050;
const ORIGIN_Y = 320;
const FACING = 0;
const OBLIQUE_FACING = 45; // see ROTATION ANGLE note above

function rangeArr(from, to) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(n);
  return out;
}

function combine(soldiers, colorParty, fieldStaff) {
  return [...soldiers, ...colorParty, ...fieldStaff];
}

function withStaff(positions) {
  const cp = buildColorParty(positions, { forwardPaces: 0, atRest: true });
  const fs = buildFieldAndStaff(positions, {});
  return combine(positions, cp, fs);
}

function buildDivisions(battalion) {
  const divisions = [];
  for (let d = 0; d < battalion.length / 2; d++) {
    divisions.push({ companies: [battalion[d * 2], battalion[d * 2 + 1]] });
  }
  return divisions;
}

function companyOfId(id) {
  const m = /^c(\d+)-/.exec(id);
  return m ? Number(m[1]) : null;
}

// ---------------------------------------------------------------------------
// Sub-movement 1: from line of battle, on a flank division (¶1167-1173)
//
// The lieutenant-colonel traces the new alignment by a fixed-pivot wheel:
// the first division wheels right on a fixed pivot (its own right-flank
// file, staked by the markers) until it lies on the new 45-degree heading,
// then the trailing divisions ploy into column behind it on that new
// heading (¶1168-1171).
// ---------------------------------------------------------------------------
function buildFromLineKeyframes(battalion) {
  const divisions = buildDivisions(battalion);
  const halted = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });

  // The first division (companies 1-2) wheels 45 degrees right, pivoting on
  // its own right-flank file (company 1's file-1 anchor) -- the "fixed
  // pivot wheel against the staked markers" of ¶1168-1169.
  const firstDivisionIds = halted
    .filter((p) => companyOfId(p.id) === 1 || companyOfId(p.id) === 2)
    .map((p) => p.id);
  const pivot = captainPos(halted, 1); // company 1's own file-1 anchor
  const wheeledFirstDivision = wheel(
    halted.filter((p) => firstDivisionIds.includes(p.id)),
    { pivotX: pivot.x, pivotY: pivot.y, angleDeg: OBLIQUE_FACING }
  );
  const stillHalted = halted.filter((p) => !firstDivisionIds.includes(p.id));
  const wheeled = [...wheeledFirstDivision, ...stillHalted];

  // Trailing divisions (2nd-4th) ploy into column, half distance, behind
  // the now-obliqued first division, on the new 45-degree heading (¶1170).
  const obliqueColumn = columnOfCompanies(divisions, {
    originX: pivot.x, originY: pivot.y, facing: OBLIQUE_FACING, distanceMode: 'half',
  });

  const square = formSquare(battalion, { originX: pivot.x, originY: pivot.y, facing: OBLIQUE_FACING });

  return [
    {
      label: 'Battalion in line of battle, halted',
      description: 'The battalion stands deployed in line of battle. The lieutenant-colonel hastens to the front and stakes the new oblique alignment: from a point before the right file of the first division, twelve paces along the front rank, then twelve paces perpendicular to the front, placing a marker.',
      caseyRef: '¶1167-1168',
      duration: 0,
      positions: withStaff(halted),
      annotations: [],
    },
    {
      label: 'To form oblique square — On the first division, form column — the division wheels onto the new alignment',
      description: 'The first division\'s chief wheels it to the right, on a fixed pivot at its own right file, against the staked markers, and aligns it on the new (oblique) heading; the other chiefs caution their divisions to face right. The colonel then commands Battalion, right—FACE — MARCH.',
      caseyRef: '¶1169',
      duration: 1600,
      positions: withStaff(wheeled),
      annotations: [],
    },
    {
      label: 'The trailing divisions ploy into column on the oblique heading',
      description: 'The second, third, and fourth divisions direct their march to place themselves at half distance from each other, in rear of the first division, now standing on the oblique line.',
      caseyRef: '¶1170-1171',
      duration: 1800,
      positions: withStaff(obliqueColumn),
      annotations: [],
    },
    {
      label: 'Oblique square formed',
      description: 'The colonel forms square by the ordinary baseline commands and means; the whole square\'s footprint inherits the oblique heading established by the first division\'s wheel.',
      caseyRef: '¶999ff (baseline, cross-ref)',
      duration: 1800,
      positions: withStaff(square),
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sub-movement 2: from column, by changing direction (¶1174-1181)
// ---------------------------------------------------------------------------
function buildFromColumnKeyframes(battalion) {
  const divisions = buildDivisions(battalion);
  const column = columnOfCompanies(divisions, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING, distanceMode: 'half' });

  // Change of direction by the flank: the whole column wheels 45 degrees,
  // pivoting on the leading division's own right-flank file, per the
  // existing change-of-direction mechanic (Part Fifth Art. XII), reused
  // here rather than re-derived (¶1174-1176). Markers trace the same
  // 12-pace/12-pace figure as the from-line case, anchored off the
  // column's flank instead of the line's right file (¶1175).
  const pivot = captainPos(column, 1);
  const wheeledColumn = wheel(column, { pivotX: pivot.x, pivotY: pivot.y, angleDeg: OBLIQUE_FACING });

  const square = formSquare(battalion, { originX: pivot.x, originY: pivot.y, facing: OBLIQUE_FACING });

  return [
    {
      label: 'Battalion in column by company, half distance, halted',
      description: 'The battalion stands in column by company, right in front, half distance, halted. The lieutenant-colonel traces the new direction, placing markers before the right and left files of the headmost division and a third marker on their prolongation, twelve paces from the column\'s flank, then twelve paces perpendicular to the front.',
      caseyRef: '¶1174-1175',
      duration: 0,
      positions: withStaff(column),
      annotations: [],
    },
    {
      label: 'To form oblique square — Change direction by the right flank — Battalion, right—FACE — MARCH',
      description: 'The whole column changes direction by the flank, exactly as prescribed for an ordinary half-distance column, pivoting the leading division onto the marker-staked oblique heading; the senior major rectifies the position of the guides on the side of the column opposite the direction of the change.',
      caseyRef: '¶1176-1180',
      duration: 1800,
      positions: withStaff(wheeledColumn),
      annotations: [],
    },
    {
      label: 'Oblique square formed',
      description: 'Once the change of direction is executed, the colonel forms the square by the ordinary baseline dispositions (No. 1000 and following); the whole square inherits the oblique heading.',
      caseyRef: '¶1177, ¶1180',
      duration: 1800,
      positions: withStaff(square),
      annotations: [],
    },
  ];
}

export default {
  id: 'form-square-oblique',
  title: 'Oblique Squares',
  part: 5,
  article: 14,
  caseyParagraphs: rangeArr(1167, 1181),
  subMovements: [
    { id: 'from-line', label: 'From Line, on a Flank Division' },
    { id: 'from-column', label: 'From Column, by Changing Direction' },
  ],
  commands: (subMovement) => {
    if (subMovement === 'from-column') {
      return [
        { text: '1. To form oblique square.', type: 'preparatory' },
        { text: '2. Change direction by the right (or left) flank.', type: 'preparatory' },
        { text: '3. Battalion right (or left)—FACE.', type: 'preparatory' },
        { text: '4. MARCH (or double quick—MARCH).', type: 'execution' },
        { text: '1. Form square. 2. Right and left into line, wheel.', type: 'preparatory' },
        { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
        { text: 'Guides—POSTS.', type: 'execution' },
      ];
    }
    return [
      { text: '1. To form oblique square.', type: 'preparatory' },
      { text: '2. On the first division form, column.', type: 'preparatory' },
      { text: '3. Battalion right—FACE.', type: 'preparatory' },
      { text: '4. MARCH (or double quick—MARCH).', type: 'execution' },
      { text: '1. Form square. 2. Right and left into line, wheel.', type: 'preparatory' },
      { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
      { text: 'Guides—POSTS.', type: 'execution' },
    ];
  },
  reenactorNotes:
    'An oblique square is not a different rank depth or entry path but a WHOLE-SQUARE ROTATION: the resulting square\'s four faces sit at a diagonal angle to the original line-of-battle or column heading, rather than square (in the perpendicular sense) to it. Casey never states a degree figure for this angle; he specifies the lieutenant-colonel tracing two 12-pace legs at a right angle to each other (¶1168, ¶1175) -- a right isosceles triangle, whose acute angles are 45 degrees, which is this project\'s own inference (not an explicit source statement) for the OBLIQUE_FACING = 45 constant used throughout this file. The mechanism that actually produces the obliquity is a FIXED-PIVOT WHEEL: in the from-line case (¶1167-1173), the first division wheels on its own right file against the staked markers before the rest of the column ploys in behind it on the new heading; in the from-column case (¶1174-1181), an already-formed column changes direction by the flank (the existing change-of-direction mechanic, reused rather than re-derived) to the same effect. Both sub-movements terminate in the ordinary baseline square shape produced by `formSquare()`, just called with facing = 45 instead of facing = 0 -- confirming the spec\'s own architectural point that the square-formation pipeline only needed to accept an arbitrary rotation parameter, not a new square geometry. Left-oblique squares (wheeling left instead of right) are the mirror image and not separately animated. Four-rank oblique squares (¶1179) use the identical means as the two-rank ones shown here, combined with part-v/formSquareFourRanks.js\'s rank-doubling step -- a direct combination of this file\'s rotation and that file\'s rank-depth modifier, not built as its own file per the source\'s own framing ("no separate four-rank oblique procedure given"). The senior major\'s guide-position correction on the non-obliqued side of the column (¶1180) is a minor officer-level detail, not separately rendered at this project\'s block-view scale.',

  buildKeyframes: (_company, subMovement = 'from-line', battalion = DEFAULT_BATTALION) => {
    if (subMovement === 'from-column') return buildFromColumnKeyframes(battalion);
    return buildFromLineKeyframes(battalion);
  },
};
