import { battalionLine, columnOfCompanies, doubleColumn, formSquare, cascadeBlend } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';
import { buildColorParty, buildFieldAndStaff, captainPos, offsetPaces } from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article XIV (S.B. ¶1090-1125): "To form square from line of
// battle" -- three distinct ploy-then-square entry paths, per ¶1092's own
// enumeration: (1) column on a flank division, (2) double column, (3)
// forward on the centre companies. This file assumes the sibling baseline
// drill (formSquareBaseline.js) already covers the ¶999-1018 column-based
// square geometry; the shared `formSquare()` primitive in
// engine/battalionFormations.js IS that baseline geometry, reused here
// wholesale as the terminal state for every sub-movement -- only the ENTRY
// path (how the battalion gets from line of battle into a column shape square
// can be formed from) differs sub-movement to sub-movement.
//
// Marching-start variants (¶1096-1099 flank-division-marching, ¶1103-1105
// double-column-marching, ¶1123-1125 centre-forward-marching) are NOT
// separate sub-movements -- per Casey they are timing/gait deltas only (no
// initial halt-and-caution beat; "prepare for square" vs "to form square"
// only changes gait, ¶1099), identical end geometry to their halted
// counterparts. This mirrors part-iv/massDeployment.js's precedent for
// marching variants -- documented in reenactorNotes, not built as distinct
// keyframe sequences.
// ---------------------------------------------------------------------------

const ORIGIN_X = 1000;
const ORIGIN_Y = 300;
const FACING = 0;

function rangeArr(from, to) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(n);
  return out;
}

function combine(soldiers, colorParty, fieldStaff) {
  return [...soldiers, ...colorParty, ...fieldStaff];
}

/** Maps a soldier id ("c3-of-cpt", "c7-fr-9", ...) to its COMPANY index
 * (1-8), per DEFAULT_BATTALION's `c${index}-...` namespacing convention. */
function companyOfId(id) {
  const m = /^c(\d+)-/.exec(id);
  return m ? Number(m[1]) : null;
}

function buildDivisions(battalion) {
  const divisions = [];
  for (let d = 0; d < battalion.length / 2; d++) {
    divisions.push({ companies: [battalion[d * 2], battalion[d * 2 + 1]] });
  }
  return divisions;
}

/** Rest-posture color party + field-and-staff for a given soldier-position
 * array -- generic fallback, not square-specific choreography (¶1005,
 * ¶1108's music/color-bearer/junior-major repositioning during the ploy is
 * procedural detail this project's block-view does not separately render;
 * see reenactorNotes). */
function withStaff(positions) {
  const cp = buildColorParty(positions, { forwardPaces: 0, atRest: true });
  const fs = buildFieldAndStaff(positions, {});
  return combine(positions, cp, fs);
}

function facedInPlace(positions, facingByCompany) {
  return positions.map((p) => {
    const co = companyOfId(p.id);
    const f = facingByCompany[co];
    return f === undefined ? p : { ...p, facing: f };
  });
}

// ---------------------------------------------------------------------------
// Sub-movement 1: ploy into column on a flank division (¶1093-1099)
// ---------------------------------------------------------------------------
function buildFlankDivisionKeyframes(battalion) {
  const divisions = buildDivisions(battalion);
  const halted = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });
  const column = columnOfCompanies(divisions, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING, distanceMode: 'half' });
  const square = formSquare(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });

  return [
    {
      label: 'Battalion in line of battle, halted',
      description: 'The battalion stands deployed in line of battle, ready to form square. Squares may be formed in a direction parallel or perpendicular to this original line, at the colonel\'s choice.',
      caseyRef: '¶1090-1092',
      duration: 0,
      positions: withStaff(halted),
      annotations: [],
    },
    {
      label: 'To form square — Column at half distance by division — Battalion, right—FACE — MARCH',
      description: 'On the first division, the battalion ploys into column at half distance by division, right in front, exactly per the Part Second ploy-into-column mechanic (No. 159 and following), with one delta: each division takes its half distance measured from the rear rank of the division in front of it.',
      caseyRef: '¶1093-1094',
      duration: 1600,
      positions: withStaff(column),
      annotations: [],
    },
    {
      label: 'Form square',
      description: 'With the battalion now in half-distance column standing on the first division, the colonel forms square by the same commands and means as from an ordinary column (No. 999 and following) -- the first division becomes the front face, the fourth division closes up and faces about to become the rear face, and the second and third divisions split by company to wheel into the right and left walls.',
      caseyRef: '¶999ff (baseline, cross-ref)',
      duration: 1800,
      positions: withStaff(square),
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sub-movement 2: ploy into double column (¶1100-1105)
// ---------------------------------------------------------------------------
function buildDoubleColumnKeyframes(battalion) {
  const halted = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });
  const dblColumn = doubleColumn(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING, distanceMode: 'half' });
  const square = formSquare(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });

  return [
    {
      label: 'Battalion in line of battle, halted',
      description: 'The battalion stands deployed in line of battle. Double column is Casey\'s preferred entry for a perpendicular square where circumstances allow, since it forms fastest (¶1190).',
      caseyRef: '¶1090-1092',
      duration: 0,
      positions: withStaff(halted),
      annotations: [],
    },
    {
      label: 'To form square — Double column at half distance — Battalion, inward—FACE — MARCH',
      description: 'The battalion ploys into double column at half distance exactly as prescribed for Article XIII\'s double column (No. 876 and following) -- both wings face inward, toward the centre, rather than uniformly to one flank as in the flank-division case.',
      caseyRef: '¶1100-1101',
      duration: 1600,
      positions: withStaff(dblColumn),
      annotations: [],
    },
    {
      label: 'Form square',
      description: 'From the double column, the colonel forms square by the same baseline dispositions (No. 999 and following). Casey does not specify exactly which companies of the double column\'s mirror-paired divisions land on which of the four faces -- shown here interpretively as settling into the same standard baseline square shape.',
      caseyRef: '¶999ff (baseline, cross-ref)',
      duration: 1800,
      positions: withStaff(square),
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sub-movement 3: forward on the centre companies (¶1106-1125)
//
// The most novel geometry in this file: instead of a column peeling into
// four fronts from one end, the square GROWS OUTWARD FROM THE CENTRE of the
// original line. Companies 4 and 5 (the two centre companies, adjacent at
// the battalion's own centre seam) stand fast in facing and march straight
// ahead to become the square's front face. Companies 3 and 6 (immediately
// adjacent to the centre) wheel by file onto the right/left walls. Companies
// 2 and 7 "follow in the trace of their leading file" (¶1110) -- a cascading
// file-chain, not a synchronized wheel -- landing further back on the same
// walls. Companies 1 and 8 (the outermost flank companies) march straight
// forward and swing around independently to close the rear face LAST, by
// filing past the already-formed three sides and meeting in the middle
// (¶1117).
//
// Implementation: `formSquare()`'s fixed baseline geometry only cares about
// each company's ROLE (front-right, front-left, right-wall-near,
// right-wall-far, left-wall-near, left-wall-far, rear-right, rear-left) via
// its `.index` field, not which physical company fills that role. Remapping
// the 8 companies onto formSquare()'s 8 role-slots reuses its exact,
// already-verified geometry for the terminal square shape, while the
// intermediate keyframes below construct the centre-outward choreography by
// hand (facing changes + cascadeBlend, the same technique
// part-iv/massDeployment.js uses for its interior-division deployment case).
// ---------------------------------------------------------------------------
function buildCentreForwardSquare(battalion, opts) {
  const byIndex = Object.fromEntries(battalion.map((c) => [c.index, c]));
  const remapped = [
    { ...byIndex[4], index: 1 }, // front-right slot <- right-centre company
    { ...byIndex[5], index: 2 }, // front-left slot  <- left-centre company
    { ...byIndex[3], index: 3 }, // right-wall-near  <- immediately right of centre (wheels)
    { ...byIndex[6], index: 4 }, // left-wall-near   <- immediately left of centre (wheels)
    { ...byIndex[2], index: 5 }, // right-wall-far   <- cascades, follows company 3's trace
    { ...byIndex[7], index: 6 }, // left-wall-far    <- cascades, follows company 6's trace
    { ...byIndex[1], index: 7 }, // rear-right       <- outermost right, closes rear last
    { ...byIndex[8], index: 8 }, // rear-left        <- outermost left, closes rear last
  ];
  return formSquare(remapped, opts);
}

function buildForwardOnCentreKeyframes(battalion) {
  const halted = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });
  const centreAnchor = captainPos(halted, 4);
  const finalOrigin = offsetPaces(centreAnchor, FACING, { forward: 6 }); // centre companies advance a short distance before the walls close in
  const square = buildCentreForwardSquare(battalion, { originX: finalOrigin.x, originY: finalOrigin.y, facing: FACING });

  // Caution: right wing (1,2,3) faces left; left wing (6,7,8) faces right;
  // centre companies (4,5) stay faced front (¶1110).
  const faced = facedInPlace(halted, { 1: 270, 2: 270, 3: 270, 6: 90, 7: 90, 8: 90 });

  // MARCH: centre + immediately-adjacent wheeling companies arrive first;
  // cascading companies (2, 7) lag behind them; the outermost flank
  // companies (1, 8), which must file all the way around to close the rear,
  // arrive last (¶1111-1117).
  const midCascade = cascadeBlend(faced, square, { 4: 1, 5: 1, 3: 0.7, 6: 0.7, 2: 0.35, 7: 0.35, 1: 0.1, 8: 0.1 }, companyOfId);
  const lateCascade = cascadeBlend(faced, square, { 4: 1, 5: 1, 3: 1, 6: 1, 2: 1, 7: 1, 1: 0.55, 8: 0.55 }, companyOfId);

  return [
    {
      label: 'Battalion in line of battle, halted',
      description: 'The battalion stands deployed in line. The lieutenant-colonel places three markers in front of the centre companies; every captain steps two paces to the front of his company\'s centre.',
      caseyRef: '¶1106-1108',
      duration: 0,
      positions: withStaff(halted),
      annotations: [],
    },
    {
      label: 'Forward on the centre, form square — Battalion, inward face',
      description: 'The two centre companies (4th and 5th) stay faced to the front. The rest of the right wing faces to the left; the rest of the left wing faces to the right. Captains of the companies next to the centre caution that they will wheel by file; every other faced captain (except the outermost) cautions his company to follow in the trace of its leading file.',
      caseyRef: '¶1110-1111',
      duration: 1000,
      positions: withStaff(faced),
      annotations: [],
    },
    {
      label: 'MARCH — the centre advances, the walls begin to close in',
      description: 'The centre companies march straight forward toward the markers, becoming the square\'s leading front. The companies next to the centre wheel by file onto the right and left walls.',
      caseyRef: '¶1113-1114',
      duration: 1800,
      positions: withStaff(midCascade),
      annotations: [],
    },
    {
      label: 'The cascading companies close along both walls',
      description: 'The companies following in the trace of their leading files (2nd and 7th) close up along the already-forming walls, behind the companies that wheeled first.',
      caseyRef: '¶1114, ¶1116',
      duration: 1600,
      positions: withStaff(lateCascade),
      annotations: [],
    },
    {
      label: 'Battalion, by the right and left flanks — HALT: square closed from the rear',
      description: 'The two outermost flank companies (1st and 8th), which marched straight forward throughout, file past the nearly-completed square and meet in the middle, closing the fourth (rear) front last. Guides—POSTS: the square is formed.',
      caseyRef: '¶1115-1121',
      duration: 1800,
      positions: withStaff(square),
      annotations: [],
    },
  ];
}

export default {
  id: 'form-square-from-line',
  title: 'To Form Square from Line of Battle',
  part: 5,
  article: 14,
  caseyParagraphs: rangeArr(1090, 1125),
  subMovements: [
    { id: 'flank-division', label: 'Column on a Flank Division' },
    { id: 'double-column', label: 'Double Column' },
    { id: 'forward-on-centre', label: 'Forward on the Centre Companies' },
  ],
  commands: (subMovement) => {
    if (subMovement === 'double-column') {
      return [
        { text: '1. To form square.', type: 'preparatory' },
        { text: '2. Double column, at half distance.', type: 'preparatory' },
        { text: '3. Battalion, inward—FACE.', type: 'preparatory' },
        { text: '4. MARCH (or double quick—MARCH).', type: 'execution' },
        { text: '1. Form square. 2. Right and left into line, wheel.', type: 'preparatory' },
        { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
        { text: 'Guides—POSTS.', type: 'execution' },
      ];
    }
    if (subMovement === 'forward-on-centre') {
      return [
        { text: '1. Forward on the centre, form square.', type: 'preparatory' },
        { text: '2. Battalion, inward face.', type: 'preparatory' },
        { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
      ];
    }
    return [
      { text: '1. To form square.', type: 'preparatory' },
      { text: '2. Column at half distance by division.', type: 'preparatory' },
      { text: '3. On the first (or fourth) division.', type: 'preparatory' },
      { text: '4. Battalion, right (or left)—FACE.', type: 'preparatory' },
      { text: '5. MARCH (or double quick—MARCH).', type: 'execution' },
      { text: '1. Form square. 2. Right and left into line, wheel.', type: 'preparatory' },
      { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
      { text: 'Guides—POSTS.', type: 'execution' },
    ];
  },
  reenactorNotes:
    'Casey\'s ¶1090-1092 lays out the master distinction for this whole group: a square formed from a deployed line of battle (this drill) may be parallel or perpendicular to that line\'s original front, and offers three ploy paths into the shared column-to-square mechanic already covered by the baseline drill (¶999ff): a simple column on a named flank division (¶1093-1099, parallel case), a double column (¶1100-1105, perpendicular case), or forming square with the two centre companies advancing forward (¶1106-1125, the most novel of the three). All three sub-movements end at the same terminal shape produced by `formSquare()` -- for the first two, no new geometry is required, since each is a direct reuse of an already-implemented ploy primitive (Part Second\'s column-by-division, and Article XIII\'s double column) feeding the baseline square mechanic; only the "forward on the centre" sub-movement needed genuinely new choreography, since its square grows outward from the middle of the line rather than folding from one end of a column. ' +
    'Marching-start variants (¶1096-1099, ¶1103-1105, ¶1123-1125) are not separate sub-movements: Casey\'s text for each says the movement executes "by the same commands and means" as its halted counterpart, with only officer-choreography and gait deltas (the leading division/company halts itself in stride rather than starting from a halt; "prepare for square" instead of "to form square" only changes the gait to quick time, ¶1099) -- no distinct geometry, consistent with how part-iv/massDeployment.js treats its own marching variants. ' +
    'The "forward on the centre" square\'s company-to-face mapping (front = companies 4 & 5; right wall = companies 3 & 2; left wall = companies 6 & 7; rear = companies 1 & 8, closed last) is read directly from ¶1107-1117\'s description of which companies wheel, which cascade, and which close the rear -- reused as an explicit remap onto `formSquare()`\'s existing role-slots (its geometry cares only about each slot\'s role, not which physical company fills it) rather than as new corner/wall math. The double-column sub-movement\'s exact company-to-face mapping is not specified by Casey\'s text at this paragraph range (only that it uses the shared baseline mechanic); it is shown reaching the same standard baseline square shape as an interpretive simplification, flagged here rather than asserted as sourced. Color party and field-and-staff figures use each drill\'s generic rest-posture placement (see colorPartyPosts.js) rather than the square-specific repositioning of the music, color-bearer, and junior major described at ¶1108/¶1120 -- those officer/NCO-level choreography details are not separately rendered at this project\'s block-view scale.',

  buildKeyframes: (_company, subMovement = 'flank-division', battalion = DEFAULT_BATTALION) => {
    if (subMovement === 'double-column') return buildDoubleColumnKeyframes(battalion);
    if (subMovement === 'forward-on-centre') return buildForwardOnCentreKeyframes(battalion);
    return buildFlankDivisionKeyframes(battalion);
  },
};
