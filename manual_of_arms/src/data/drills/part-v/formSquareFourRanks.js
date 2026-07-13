import { rotatePoint } from '../../../engine/formations.js';
import { battalionLine, columnOfCompanies, cascadeBlend } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { SCALE } from '../../constants.js';
import { buildColorParty, buildFieldAndStaff, captainPos, offsetPaces } from './colorPartyPosts.js';

const { FILE_INTERVAL, RANK_GAP, FILE_CLOSER_GAP } = SCALE;

// ---------------------------------------------------------------------------
// Part Fifth, Article XIV (S.B. ¶1126-1166): "Squares in four ranks" -- a
// DEFENSIVE-STRENGTH modifier applied to the baseline square forms (¶1126),
// not a different formation family. Every command form mirrors a two-rank
// counterpart 1:1 (from column, from line on a flank division, forward on
// the centre), with the delta always being "each company doubles its files
// to fold two ranks into four" at the appropriate step (¶1126, ¶1186).
//
// RANK-DOUBLING PRIMITIVE (fourRankLine, below): the existing
// `doubleFiles()` in formations.js folds a company's TWO-RANK LINE into a
// FOUR-ABREAST COLUMN (a 90-degree reorientation, for marching by the
// flank) -- not what four-rank squares need. A four-rank square face stays
// facing the SAME direction it always did; it merely halves its file-width
// and doubles its rank-depth. `fourRankLine()` below is this project's own
// lighter-weight primitive for that: adjacent file pairs (1,2), (3,4), ...,
// (19,20) collapse so the first (odd) file of each pair stays in ranks 1-2
// and the second (even) file steps directly BEHIND it into ranks 3-4 --
// same underlying "doubling" concept as doubleFiles(), applied without the
// 90-degree turn. This is an explicit, documented APPROXIMATION: Casey's
// text (¶1186) specifies doubling always happens on the file NEXT THE
// GUIDE (i.e. inward, toward the division's own centre seam), a
// per-division-side pivot direction; this implementation instead always
// pairs by simple file adjacency (1-2, 3-4, ...) regardless of which flank
// is the guide side. The resulting four-rank block's proportions (half
// width, quadruple-rank depth) are correct; the precise pivot-file identity
// is a documented simplification, not a re-derivation of ¶1128-1131's
// per-company pivot-direction choreography.
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

function companyOfId(id) {
  const m = /^c(\d+)-/.exec(id);
  return m ? Number(m[1]) : null;
}

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

// One four-rank company occupies 10 file-slots (half of the two-rank
// company's 20), spanning 9 intervals -- the four-rank analog of
// battalionFormations.js's COMPANY_FRONT (19*FILE_INTERVAL) and
// COMPANY_STRIDE (20*FILE_INTERVAL).
const FOUR_RANK_FRONT = 9 * FILE_INTERVAL;
const FOUR_RANK_STRIDE = 10 * FILE_INTERVAL;

/**
 * fourRankLine(soldiers, { originX, originY, facing })
 *
 * Places one company's soldiers in FOUR ranks instead of two, at HALF the
 * two-rank file-width -- see header note above for the doubling convention
 * and its documented approximation. originX/Y = the file-1/2 pair's front
 * rank point (same anchor role as lineOfBattle()'s originX/Y).
 */
function fourRankLine(soldiers, { originX = 480, originY = 300, facing = 0 } = {}) {
  return soldiers.map((soldier) => {
    const file = soldier.file;
    const pairSlot = Math.ceil(file / 2) - 1; // 0-9
    const isSecond = file % 2 === 0; // even file doubles behind its odd partner
    const localX = -pairSlot * FILE_INTERVAL;
    let localY;
    if (!isSecond) {
      if (soldier.rank === 'front') localY = 0; // rank 1
      else if (soldier.rank === 'rear') localY = RANK_GAP; // rank 2
      else localY = 2 * RANK_GAP + FILE_CLOSER_GAP; // file closer, behind rank 2
    } else {
      if (soldier.rank === 'front') localY = 2 * RANK_GAP; // rank 3
      else if (soldier.rank === 'rear') localY = 3 * RANK_GAP; // rank 4
      else localY = 4 * RANK_GAP + FILE_CLOSER_GAP; // file closer, behind rank 4
    }
    const rotated = rotatePoint(localX, localY, 0, 0, facing);
    return { id: soldier.id, x: originX + rotated.x, y: originY + rotated.y, facing };
  });
}

function acrossAxis(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

function placeFourRankUnitLine(companies, originX, originY, facing) {
  const { x: ax, y: ay } = acrossAxis(facing);
  const positions = [];
  let stride = 0;
  companies.forEach((co) => {
    positions.push(...fourRankLine(co.soldiers, {
      originX: originX - stride * ax,
      originY: originY - stride * ay,
      facing,
    }));
    stride += FOUR_RANK_STRIDE;
  });
  return positions;
}

/**
 * buildFourRankSquare(companies, opts) -- the four-rank analog of
 * `formSquare()` in battalionFormations.js. Same role-slot structure
 * (division1 = front, division4 = rear about-faced, division2/3 split by
 * company into right/left walls) but built from `fourRankLine()`-doubled
 * companies instead of ordinary `lineOfBattle()` ones, and using
 * FOUR_RANK_FRONT/FOUR_RANK_STRIDE in place of the two-rank constants.
 */
function buildFourRankSquare(companies, { originX = 480, originY = 300, facing = 0, faceDistance = 2 * FOUR_RANK_FRONT } = {}) {
  const byIndex = Object.fromEntries(companies.map((c) => [c.index, c]));
  const { x: acrossX, y: acrossY } = acrossAxis(facing);
  const rad = (facing * Math.PI) / 180;
  const bx = -Math.sin(rad), by = Math.cos(rad);
  const positions = [];

  positions.push(...placeFourRankUnitLine([byIndex[1], byIndex[2]], originX, originY, facing));

  const rearFacing = (facing + 180) % 360;
  const boxWidth = 2 * FOUR_RANK_STRIDE;
  const rearAnchorX = originX + bx * faceDistance - acrossX * boxWidth;
  const rearAnchorY = originY + by * faceDistance - acrossY * boxWidth;
  positions.push(...placeFourRankUnitLine([byIndex[7], byIndex[8]], rearAnchorX, rearAnchorY, rearFacing));

  const rightFacing = (facing + 90) % 360;
  positions.push(...fourRankLine(byIndex[3].soldiers, {
    originX: originX + bx * FOUR_RANK_FRONT,
    originY: originY + by * FOUR_RANK_FRONT,
    facing: rightFacing,
  }));
  positions.push(...fourRankLine(byIndex[5].soldiers, {
    originX: originX + bx * (2 * FOUR_RANK_FRONT),
    originY: originY + by * (2 * FOUR_RANK_FRONT),
    facing: rightFacing,
  }));

  const leftFacing = (facing - 90 + 360) % 360;
  const leftEdgeX = originX - acrossX * boxWidth;
  const leftEdgeY = originY - acrossY * boxWidth;
  positions.push(...fourRankLine(byIndex[4].soldiers, {
    originX: leftEdgeX + bx * FOUR_RANK_FRONT,
    originY: leftEdgeY + by * FOUR_RANK_FRONT,
    facing: leftFacing,
  }));
  positions.push(...fourRankLine(byIndex[6].soldiers, {
    originX: leftEdgeX + bx * (2 * FOUR_RANK_FRONT),
    originY: leftEdgeY + by * (2 * FOUR_RANK_FRONT),
    facing: leftFacing,
  }));

  return positions;
}

function buildDivisions(battalion) {
  const divisions = [];
  for (let d = 0; d < battalion.length / 2; d++) {
    divisions.push({ companies: [battalion[d * 2], battalion[d * 2 + 1]] });
  }
  return divisions;
}

/** Four-rank analog of `columnOfCompanies()` -- divisions stacked front to
 * rear, each division's two companies doubled into four ranks via
 * `fourRankLine()`, spaced at "a company front in four ranks" (¶1131). */
function fourRankColumn(divisions, { originX = 480, originY = 300, facing = 0 } = {}) {
  const rad = (facing * Math.PI) / 180;
  const behindX = -Math.sin(rad), behindY = Math.cos(rad);
  const interval = FOUR_RANK_FRONT;
  const positions = [];
  divisions.forEach((division, i) => {
    const depthOffset = i * interval;
    positions.push(...placeFourRankUnitLine(
      division.companies,
      originX + behindX * depthOffset,
      originY + behindY * depthOffset,
      facing
    ));
  });
  return positions;
}

// ---------------------------------------------------------------------------
// Sub-movement 1: from column by company, at a halt (¶1127-1132)
// ---------------------------------------------------------------------------
function buildFromColumnKeyframes(battalion) {
  const divisions = buildDivisions(battalion);
  const column = columnOfCompanies(divisions, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING, distanceMode: 'half' });
  // First division's right company faces left, left company faces right --
  // pre-facing the pair that will double onto each other first (¶1128).
  const faced = facedInPlace(column, { 1: 270, 2: 90 });
  const doubledColumn = fourRankColumn(divisions, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });
  const fourRankSquare = buildFourRankSquare(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });

  return [
    {
      label: 'Battalion in column by company, half distance, halted',
      description: 'The battalion stands in column by company, right in front, half distance, halted, with divisions formed -- the same precondition as the two-rank baseline (¶999).',
      caseyRef: '¶1126-1127',
      duration: 0,
      positions: withStaff(column),
      annotations: [],
    },
    {
      label: 'To form square in four ranks — To half distance, close column — MARCH',
      description: 'At the first command, the first division\'s right company faces to the left and its left company faces to the right, pre-facing the pair of companies that will double onto each other. The other divisions\' chiefs caution their divisions to move forward.',
      caseyRef: '¶1127-1128',
      duration: 1200,
      positions: withStaff(faced),
      annotations: [],
    },
    {
      label: 'Each division doubles its files into four ranks while closing',
      description: 'The first division\'s right company doubles into four ranks on its left file; its left company doubles on its right file. The other divisions move forward and double their files while marching, in the same pattern, each halting a four-rank company front from the division ahead and aligning left.',
      caseyRef: '¶1130-1131',
      duration: 1800,
      positions: withStaff(doubledColumn),
      annotations: [],
    },
    {
      label: 'Form square in four ranks',
      description: 'The colonel forms square, by the same commands and means as prescribed for a battalion in two ranks, now operating on four-rank-deep divisions.',
      caseyRef: '¶1132',
      duration: 1800,
      positions: withStaff(fourRankSquare),
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sub-movement 2: from line, on a flank division (¶1141-1146)
// ---------------------------------------------------------------------------
function buildFlankDivisionKeyframes(battalion) {
  const divisions = buildDivisions(battalion);
  const halted = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });
  const column = columnOfCompanies(divisions, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING, distanceMode: 'half' });
  const fourRankSquare = buildFourRankSquare(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });

  return [
    {
      label: 'Battalion in line of battle, halted',
      description: 'The battalion stands deployed in line of battle. Each chief of division stands before his division\'s centre and cautions it to face right.',
      caseyRef: '¶1141-1142',
      duration: 0,
      positions: withStaff(halted),
      annotations: [],
    },
    {
      label: 'To form square, in four ranks — Column at half distance, by division — Battalion, right—FACE — MARCH',
      description: 'The right guide of the first division stays faced to the front, as the anchor for the whole ploy; the battalion faces right. At the march, the first division\'s files of four form and step off together, each closing to its proper distance on the file ahead, remaining doubled; the other divisions ploy into column the same way as the two-rank battalion, their chiefs continuing to lead them rather than letting them file past.',
      caseyRef: '¶1143-1145',
      duration: 2000,
      positions: withStaff(column),
      annotations: [],
    },
    {
      label: 'Form square, in four ranks',
      description: 'With the battalion now in a four-rank-deep half-distance column, the colonel forms square by the same commands and means as the two-rank battalion.',
      caseyRef: '¶1132 (baseline mechanic, applied here)',
      duration: 1800,
      positions: withStaff(fourRankSquare),
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sub-movement 3: forward on the centre, in four ranks, from line (¶1160-1166)
// ---------------------------------------------------------------------------
function buildCentreForwardFourRankSquare(battalion, opts) {
  const byIndex = Object.fromEntries(battalion.map((c) => [c.index, c]));
  const remapped = [
    { ...byIndex[4], index: 1 },
    { ...byIndex[5], index: 2 },
    { ...byIndex[3], index: 3 },
    { ...byIndex[6], index: 4 },
    { ...byIndex[2], index: 5 },
    { ...byIndex[7], index: 6 },
    { ...byIndex[1], index: 7 },
    { ...byIndex[8], index: 8 },
  ];
  return buildFourRankSquare(remapped, opts);
}

function buildForwardOnCentreKeyframes(battalion) {
  const halted = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });
  const centreAnchor = captainPos(halted, 4);
  // ¶1161: the wheeling wing companies must march forward a platoon front's
  // distance BEFORE wheeling, to clear room for the now-doubled (deeper)
  // centre division -- an extra forward step not present in the two-rank
  // case (part-v/formSquareFromLine.js's forward-on-centre sub-movement).
  // Modeled as a slightly larger final forward offset (16 paces vs. 6 in
  // the two-rank case) rather than a separate physical pre-wheel keyframe.
  const finalOrigin = offsetPaces(centreAnchor, FACING, { forward: 16 });
  const square = buildCentreForwardFourRankSquare(battalion, { originX: finalOrigin.x, originY: finalOrigin.y, facing: FACING });

  const faced = facedInPlace(halted, { 1: 270, 2: 270, 3: 270, 6: 90, 7: 90, 8: 90 });
  const midCascade = cascadeBlend(faced, square, { 4: 1, 5: 1, 3: 0.7, 6: 0.7, 2: 0.35, 7: 0.35, 1: 0.1, 8: 0.1 }, companyOfId);
  const lateCascade = cascadeBlend(faced, square, { 4: 1, 5: 1, 3: 1, 6: 1, 2: 1, 7: 1, 1: 0.55, 8: 0.55 }, companyOfId);

  return [
    {
      label: 'Battalion in line of battle, halted',
      description: 'The battalion stands deployed in line, as in the two-rank forward-on-centre case, but the centre division will fold into four ranks as it advances.',
      caseyRef: '¶1160',
      duration: 0,
      positions: withStaff(halted),
      annotations: [],
    },
    {
      label: 'Forward on the centre, in four ranks, form square — Battalion inward face',
      description: 'Executed by the same commands and means as the two-rank formation (¶1106-1117): the centre companies stay faced front; the rest of each wing faces inward. The wheeling wing companies march straight forward a platoon front\'s distance before wheeling, clearing room for the now-doubled centre division.',
      caseyRef: '¶1161',
      duration: 1400,
      positions: withStaff(faced),
      annotations: [],
    },
    {
      label: 'MARCH — the centre division doubles into four ranks and advances',
      description: 'The centre division forms four ranks per the method already described (¶1130), while the companies next to it wheel onto the walls.',
      caseyRef: '¶1161',
      duration: 1800,
      positions: withStaff(midCascade),
      annotations: [],
    },
    {
      label: 'Square in four ranks closed from the rear',
      description: 'The cascading companies close along the walls; the two outermost flank companies file around to close the rear front last, exactly as in the two-rank case.',
      caseyRef: '¶1161-1162',
      duration: 1800,
      positions: withStaff(lateCascade),
      annotations: [],
    },
    {
      label: 'Square formed, in four ranks',
      description: 'The square stands complete, each of its four faces four ranks deep -- a stronger defense against a cavalry charge than the two-rank form (¶1126).',
      caseyRef: '¶1126, ¶1162',
      duration: 1200,
      positions: withStaff(square),
      annotations: [],
    },
  ];
}

export default {
  id: 'form-square-four-ranks',
  title: 'Squares in Four Ranks',
  part: 5,
  article: 14,
  caseyParagraphs: rangeArr(1126, 1166),
  subMovements: [
    { id: 'from-column', label: 'From Column by Company, at a Halt' },
    { id: 'flank-division', label: 'From Line, on a Flank Division' },
    { id: 'forward-on-centre', label: 'Forward on the Centre, from Line' },
  ],
  commands: (subMovement) => {
    if (subMovement === 'flank-division') {
      return [
        { text: '1. To form square, in four ranks.', type: 'preparatory' },
        { text: '2. Column at half distance, by division.', type: 'preparatory' },
        { text: '3. On the first (or fourth) division.', type: 'preparatory' },
        { text: '4. Battalion, right (or left)—FACE.', type: 'preparatory' },
        { text: '5. MARCH (or double quick—MARCH).', type: 'execution' },
      ];
    }
    if (subMovement === 'forward-on-centre') {
      return [
        { text: '1. Forward on the centre, in four ranks, form square.', type: 'preparatory' },
        { text: '2. Battalion inward face.', type: 'preparatory' },
        { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
      ];
    }
    return [
      { text: '1. To form square in four ranks.', type: 'preparatory' },
      { text: '2. To half distance, close column.', type: 'preparatory' },
      { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
    ];
  },
  reenactorNotes:
    'Squares in four ranks are a defensive-strength VARIANT, not a different formation family (¶1126): "if the square formed in two ranks... should not be deemed sufficiently strong," the colonel may cause it formed in four ranks instead, doubling each face\'s depth at the cost of halving its file-width. Every command form mirrors a two-rank counterpart 1:1; this project models the rank-count (2 vs. 4) as an ORTHOGONAL PARAMETER layered on top of the same entry paths documented in part-v/formSquareFromLine.js, rather than a wholly separate square shape. Casey\'s doubling rule (¶1186) always pivots on "the file next the guide" -- i.e. inward, toward each division\'s own centre seam, a per-company, per-side pivot direction; this file\'s `fourRankLine()` primitive is a documented, lighter-weight APPROXIMATION of that rule: it pairs files by simple adjacency (1-2, 3-4, ..., 19-20) rather than tracking each company\'s own guide-relative pivot file, which yields the CORRECT proportions (half file-width, quadruple rank-depth) without re-deriving ¶1128-1131\'s exact per-company choreography. The double-column perpendicular four-rank square (¶1151-1159) is not built as its own sub-movement here -- it would compose identically to formSquareFromLine.js\'s double-column entry plus this file\'s four-rank doubling step, and is documented rather than duplicated, consistent with this project\'s practice of not building out every combinatorial pairing of entry-path times rank-depth. Reducing a four-rank square back to two ranks (¶1133-1140) is the exact inverse of the doubling step above (Casey himself cites the School of Company\'s existing file-undoubling mechanic, No. 387) and is likewise not separately animated -- it is the mirror image of the doubling shown in each sub-movement\'s middle keyframes. Marching-start variants (¶1147-1150, ¶1156-1159, ¶1163-1166) are timing/gait deltas only, per the same convention documented in formSquareFromLine.js.',

  buildKeyframes: (_company, subMovement = 'from-column', battalion = DEFAULT_BATTALION) => {
    if (subMovement === 'flank-division') return buildFlankDivisionKeyframes(battalion);
    if (subMovement === 'forward-on-centre') return buildForwardOnCentreKeyframes(battalion);
    return buildFromColumnKeyframes(battalion);
  },
};
