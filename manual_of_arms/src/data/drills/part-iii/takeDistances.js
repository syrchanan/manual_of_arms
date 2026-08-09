import { columnOfCompanies } from '../../../engine/battalionFormations.js';
import { translate } from '../../../engine/formations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Third, Article IX (S.B. ¶385-421): "Being in column at half distance
// or closed in mass, to take distances."
//
// Three sub-procedures, all going from a packed column (half distance or
// mass) to a fully-opened "wheeling distance" (full-distance) column, but
// differing in WHICH end of the column is the fixed reference and which
// direction the rest of the companies release:
//   1st. By the head of the column (¶386-396) -- the LEADING company steps
//        off first; each following company follows the instant it has
//        opened wheeling distance behind the one ahead of it. No ground
//        marker is described for this variant.
//   2nd. On the rear of the column (¶397-407) -- the REARMOST (8th) company
//        is the fixed anchor and does not move; two ground markers fix the
//        line; every other company marches forward at once but halts,
//        front-to-rear NEAREST-the-anchor-first (7th, then 6th, ... then
//        1st), each judging its own wheeling-distance gap by eye.
//   3rd. On the head of the column (¶408-420) -- the LEADING (1st) company
//        is the fixed anchor, remaining faced front; every other company
//        about-faces and marches to the REAR, halting and re-fronting in
//        succession nearest-the-anchor-first (2nd, then 3rd, ... then 8th).
//        ¶419 confirms the same principle for closing to HALF distance
//        instead of full (substituting "half" for "wheeling distance" in
//        the command) and ¶420 for division, not just company, granularity.
//
// INTERPRETIVE CHOICES:
//  - All three variants are modeled here going from HALF distance to FULL
//    (wheeling) distance -- the case actually spelled out with verbatim
//    commands in ¶386, ¶397, ¶408. The closed-mass-to-half-distance and
//    division-granularity generalizations (¶419-420) are real and are
//    documented in reenactorNotes, following this project's established
//    "state the generalization, don't re-derive its geometry" convention
//    (cf. changeDirectionHalf.js's step-length note, countermarch.js's
//    platoon-column asides) rather than adding six more subMovements for a
//    mechanic that is, per the spec, "the same algorithm parameterized."
//  - Casey specifies each company's release/halt is judged "by eye," not by
//    a fixed timer (¶388-389, ¶402, ¶441). This animation approximates that
//    judged cascade with discrete arrival snapshots, released in the stated
//    front-to-rear or rear-to-front order, exactly the same interpretive
//    choice already used for the file-by-file cascade in
//    lesson-vi/countermarch.js and the company cascade in
//    changeDirectionHalf.js.
//  - "By the head of the column" has no ground marker and no fixed anchor in
//    Casey's text (unlike the other two variants, which explicitly plant
//    markers). Since the whole column's absolute position is otherwise
//    undetermined, this drill anchors the column's own leading company at
//    the SAME origin in both the half-distance start and full-distance end
//    states, so the animation reads as "the column opens out," without
//    inventing a net forward advance distance nowhere given in the source.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 200;
const ORIGIN_Y = 220;
const OLD_FACING = 90; // marching east

function idsOfCompany(co) {
  return co.soldiers.map((s) => s.id);
}

function captainPos(positions, companyIndex) {
  return positions.find((p) => p.id === `c${companyIndex}-of-cpt`);
}

/** Substitute the positions of every company in `orderedCompanies[0..count)`
 * with its `finalMap` (arrived) counterpart; everyone else stays `waiting`. */
function cascadeByOrder(waiting, finalMap, orderedCompanies, arrivedCount) {
  const arrivedIds = new Set(orderedCompanies.slice(0, arrivedCount).flatMap(idsOfCompany));
  return waiting.map((p) => (arrivedIds.has(p.id) ? finalMap.get(p.id) ?? p : p));
}

// Mainline battalion paragraphs only; skirmisher-scope 0-N (396, 399, 403,
// 404, 410, 412, 416, 421) are excluded.
const ALL_PARAGRAPHS = [
  385, 386, 387, 388, 389, 390, 391, 392, 393, 394, 395, 397, 398, 400, 401, 402,
  405, 406, 407, 408, 409, 411, 413, 414, 415, 417, 418, 419, 420,
];

export default {
  id: 'take-distances',
  title: 'Being in Column at Half Distance or Closed in Mass, to Take Distances',
  part: 3,
  article: 9,
  caseyParagraphs: ALL_PARAGRAPHS,
  subMovements: [
    { id: 'by-head', label: 'By the Head of the Column' },
    { id: 'on-rear', label: 'On the Rear of the Column' },
    { id: 'on-head-about', label: 'On the Head of the Column (About Face)' },
  ],

  commands: (subMovement) => {
    if (subMovement === 'on-rear') {
      return [
        { text: '1. On the eighth company, take wheeling distance.', type: 'preparatory' },
        { text: '2. Column forward.', type: 'preparatory' },
        { text: '3. Guide left.', type: 'preparatory' },
        { text: '4. MARCH (or double quick--MARCH).', type: 'execution' },
      ];
    }
    if (subMovement === 'on-head-about') {
      return [
        { text: '1. On the first company, take wheeling distance.', type: 'preparatory' },
        { text: '2. Battalion, about--FACE.', type: 'execution' },
        { text: '3. Column, forward.', type: 'preparatory' },
        { text: '4. Guide right.', type: 'preparatory' },
        { text: '5. MARCH (or double quick--MARCH).', type: 'execution' },
      ];
    }
    // by-head (default)
    return [
      { text: 'By the head of column, take wheeling distance.', type: 'preparatory' },
      { text: '1. First company, forward.', type: 'preparatory' },
      { text: '2. Guide left.', type: 'preparatory' },
      { text: '3. MARCH (or double quick--MARCH).', type: 'execution' },
    ];
  },

  reenactorNotes:
    'By the head of the column (¶386-396): given at a halt, the captain of the LEADING company puts it in march first; each following captain, in turn, commands his own company forward the instant it has nearly gained wheeling distance behind the one ahead, taking the step from it (¶387-389). The colonel verifies each company starts exactly when it has its distance; the lieutenant-colonel holds at the head directing the leading guide; the senior major stays abreast the rearmost guide (¶390-392). If the column is already marching, the colonel simply adds MARCH to the same first command (¶393). ' +
    'On the rear of the column (¶397-407, named here for an 8-company battalion): the colonel plants two markers on the intended line, company distance apart, and the right general guide dashes ahead to stand on their prolongation. The EIGHTH (rearmost) company stands fast throughout -- it is cautioned, not marched. At MARCH every other company steps off at once, but each halts, in succession NEAREST THE ANCHOR FIRST (7th on the second marker, then 6th once it judges a full wheeling gap behind the 7th, then 5th, 4th, 3rd, 2nd, and finally 1st), aligning by the left on the markers\' prolongation each time (¶400-402). The colonel follows verifying each company\'s distance; the lieutenant-colonel confirms each left guide as it arrives; the senior major stays at the head directing the leading guide\'s march (¶405-407). ' +
    'On the head of the column (¶408-420): mirror image of the rear-anchor case -- the colonel plants two markers facing FRONT this time, and the left general guide dashes to the rear to stand on their prolongation. The FIRST (leading) company stands fast, remaining faced to the front; at Battalion, about-FACE every other company faces about, then marches to the REAR at MARCH, halting in succession nearest-the-anchor-first (2nd, then 3rd, ... up to 8th), each facing about again once aligned (¶409-415). The same principles apply to a column with the left in front (¶418), to closing only to HALF distance instead of full by substituting "half" for "wheeling distance" in the command (¶419), and to a column by DIVISION rather than by company (¶420) -- none of these are separately staged here, each being, per the source, the identical algorithm at a different parameter.',

  buildKeyframes: (_company, subMovement = 'by-head', battalion = DEFAULT_BATTALION) => {
    const companies = battalion;
    const halfColumn = columnOfCompanies(companies, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: OLD_FACING,
      distanceMode: 'half',
    });

    if (subMovement === 'on-rear') {
      const fullAtHeadOrigin = columnOfCompanies(companies, {
        originX: ORIGIN_X,
        originY: ORIGIN_Y,
        facing: OLD_FACING,
        distanceMode: 'full',
      });
      const rearIdx = companies.length - 1;
      const rearHalfPos = captainPos(halfColumn, companies[rearIdx].index);
      const rearFullPos = captainPos(fullAtHeadOrigin, companies[rearIdx].index);
      const dx = rearHalfPos.x - rearFullPos.x;
      const dy = rearHalfPos.y - rearFullPos.y;
      const fullColumn = translate(fullAtHeadOrigin, { dx, dy });
      const finalMap = new Map(fullColumn.map((p) => [p.id, p]));

      // Release order: nearest-the-anchor-first, i.e. 7th, 6th, ..., 1st
      // (the 8th/anchor company never moves, so it is excluded).
      const releaseOrder = companies.slice(0, rearIdx).slice().reverse();

      const snap2 = cascadeByOrder(halfColumn, finalMap, releaseOrder, 2);
      const snap4 = cascadeByOrder(halfColumn, finalMap, releaseOrder, 4);
      const snap6 = cascadeByOrder(halfColumn, finalMap, releaseOrder, 6);

      return [
        {
          label: 'Column at half distance, halted; markers planted',
          description: 'The battalion stands at half distance. The colonel plants two markers on the intended line of battle, company distance apart, opposite and just ahead of the eighth (rearmost) company; the right general guide dashes ahead to stand on their prolongation.',
          caseyRef: '¶397',
          duration: 0,
          positions: halfColumn,
          annotations: [],
        },
        {
          label: 'On the eighth company, take wheeling distance -- Column forward, Guide left -- MARCH',
          description: 'The eighth company stands fast. Every other company steps off; the seventh aligns on the second marker; the leading company\'s guide directs himself slightly inside the right general guide.',
          caseyRef: '¶398-401',
          duration: 1500,
          positions: snap2,
          annotations: ['guideLeft'],
        },
        {
          label: 'Companies halt, front-to-rear, nearest the anchor first',
          description: 'The sixth, fifth, and further companies each halt in turn the instant a full wheeling-distance gap has opened behind the one that halted before it, aligning by the left.',
          caseyRef: '¶402',
          duration: 1800,
          positions: snap4,
          annotations: ['guideLeft'],
        },
        {
          label: 'Most companies have taken their distance',
          description: 'The colonel follows, verifying each company halts at the prescribed distance; the lieutenant-colonel confirms each left guide as it arrives.',
          caseyRef: '¶405-406',
          duration: 1800,
          positions: snap6,
          annotations: ['guideLeft'],
        },
        {
          label: 'Column at full (wheeling) distance',
          description: 'The leading company, last to halt, completes the movement. The eighth company has not moved; every other company now stands at proper wheeling distance, aligned on the markers\' prolongation.',
          caseyRef: '¶405-407',
          duration: 1500,
          positions: fullColumn,
          annotations: ['guideLeft'],
        },
      ];
    }

    if (subMovement === 'on-head-about') {
      const fullColumn = columnOfCompanies(companies, {
        originX: ORIGIN_X,
        originY: ORIGIN_Y,
        facing: OLD_FACING,
        distanceMode: 'full',
      });
      const finalMap = new Map(fullColumn.map((p) => [p.id, p]));

      // The first company stands fast, facing front, throughout. Every other
      // company about-faces in place before marching to the rear (¶409).
      const aboutFaced = halfColumn.map((s) => {
        if (s.id === `c${companies[0].index}-of-cpt` || s.id.startsWith(`c${companies[0].index}-`)) return s;
        return { ...s, facing: (OLD_FACING + 180) % 360 };
      });

      // Release order: nearest-the-anchor-first, i.e. 2nd, 3rd, ..., 8th.
      const releaseOrder = companies.slice(1);

      const snap2 = cascadeByOrder(aboutFaced, finalMap, releaseOrder, 2);
      const snap4 = cascadeByOrder(aboutFaced, finalMap, releaseOrder, 4);
      const snap6 = cascadeByOrder(aboutFaced, finalMap, releaseOrder, 6);

      return [
        {
          label: 'Column at half distance, halted; markers planted',
          description: 'The colonel plants two markers facing to the front, opposite and just behind the first (leading) company, company distance apart; the left general guide dashes to the rear to stand on their prolongation.',
          caseyRef: '¶408',
          duration: 0,
          positions: halfColumn,
          annotations: [],
        },
        {
          label: 'Battalion, about--FACE',
          description: 'The first company is cautioned to remain facing front. Every other company faces about; their guides, now in what was the front rank, are in the rear.',
          caseyRef: '¶409',
          duration: 1200,
          positions: aboutFaced,
          annotations: [],
        },
        {
          label: 'Column, forward, Guide right -- MARCH',
          description: 'The first company\'s captain aligns it on its own marker; every other (now rear-facing) company marches to the rear, its rearmost guide directing slightly inside the left general guide. The second company halts, faces about, and aligns by the left once opposite the second marker.',
          caseyRef: '¶411-414',
          duration: 1800,
          positions: snap2,
          annotations: [],
        },
        {
          label: 'Companies halt and re-front, nearest the anchor first',
          description: 'The third company halts the instant it has wheeling distance, faces about, and aligns by the left; the remaining companies repeat this in succession.',
          caseyRef: '¶415',
          duration: 1800,
          positions: snap4,
          annotations: [],
        },
        {
          label: 'Most companies have taken their distance',
          description: 'The colonel follows, verifying each company\'s distance and correcting faults; the lieutenant-colonel and senior major confirm the guides as they arrive.',
          caseyRef: '¶417',
          duration: 1800,
          positions: snap6,
          annotations: [],
        },
        {
          label: 'Column at full (wheeling) distance',
          description: 'The eighth company, last to halt and front, completes the movement. The first company has not moved; every other company now stands at proper wheeling distance, faced to the front.',
          caseyRef: '¶417',
          duration: 1500,
          positions: fullColumn,
          annotations: [],
        },
      ];
    }

    // by-head (default)
    const fullColumn = columnOfCompanies(companies, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: OLD_FACING,
      distanceMode: 'full',
    });
    const finalMap = new Map(fullColumn.map((p) => [p.id, p]));

    const snap2 = cascadeByOrder(halfColumn, finalMap, companies, 2);
    const snap4 = cascadeByOrder(halfColumn, finalMap, companies, 4);
    const snap6 = cascadeByOrder(halfColumn, finalMap, companies, 6);

    return [
      {
        label: 'Column at half distance, halted',
        description: 'The battalion stands at half distance, each company closely nested behind the one ahead of it.',
        caseyRef: '¶385-386',
        duration: 0,
        positions: halfColumn,
        annotations: [],
      },
      {
        label: 'By the head of column, take wheeling distance -- First company, forward, Guide left -- MARCH',
        description: 'The captain of the leading company puts it in march; the colonel verifies it starts exactly on the command.',
        caseyRef: '¶386-387, ¶390',
        duration: 1500,
        positions: snap2,
        annotations: ['guideLeft'],
      },
      {
        label: 'Each following company steps off in turn',
        description: 'Each captain, in turn, commands his own company forward the instant it has nearly gained wheeling distance behind the one ahead, taking the step from it.',
        caseyRef: '¶388-389',
        duration: 1800,
        positions: snap4,
        annotations: ['guideLeft'],
      },
      {
        label: 'Most of the column has opened to full distance',
        description: 'The lieutenant-colonel holds at the head directing the leading guide\'s march; the senior major stays abreast the rearmost guide.',
        caseyRef: '¶391-392',
        duration: 1800,
        positions: snap6,
        annotations: ['guideLeft'],
      },
      {
        label: 'Column at full (wheeling) distance',
        description: 'Every company now stands at proper wheeling distance behind the one ahead of it, in march at the same gait throughout.',
        caseyRef: '¶388-390',
        duration: 1500,
        positions: fullColumn,
        annotations: ['guideLeft'],
      },
    ];
  },
};
