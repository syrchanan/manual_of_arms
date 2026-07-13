import { doubleColumn, columnOfCompanies, divisionLineFromAnchor, cascadeBlend } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';
import { buildColorParty, buildFieldAndStaff, captainPos } from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article XIII, Sections 9-12 (S.B. ¶946-998): deploying the
// double column into line of battle -- faced to the front (¶946-957), faced
// to the right or left (¶958-978) -- and forming the double column from a
// simple column by company (¶982-998).
//
// SECTIONS 9/10 ENGINE APPROACH: per the spec's own complexity notes, this
// reuses the existing "deploy column into line" primitive
// (divisionLineFromAnchor(), already built for Part Fourth), with the
// deploying unit being Division 1 (companies 4, 5 together) as the anchor
// rather than a single company. Casey's own choreography (¶947, ¶987) has
// each OUTER division split back into its two ORIGINAL wing companies, which
// peel to their own original side (the company that came from the right wing
// returns right, the one from the left wing returns left) -- i.e. deploying
// the double column is the mirror image of ployDoubleColumn.js's fold, so
// divisionsInFinalOrder here lists the 6 outer companies individually (not
// as double-column divisions) around the {4,5} anchor, in the SAME
// left-to-right order they held in the original line of battle.
//
// "Faced to the front" (¶946, Section 9) vs. "faced to the right/left"
// (¶958, Section 10): the deployed line's own facing relative to the
// column's march direction is the only difference between these two cases --
// front-faced keeps the SAME facing as the march (no wheel, ¶946's own
// mechanic is a standard mass-deployment on two head companies); right/
// left-faced rotates the resulting line 90 degrees from the march axis (a
// "right into line wheel" generalized to a division-wide anchor, ¶958-962).
// This mirrors the precedent already set by
// part-iv/halfDistanceIntoLine.js's "faced to the rear" sub-case, which
// changes ONLY the `lineFacing` parameter passed to divisionLineFromAnchor()
// relative to its "faced forward" sibling, with the anchor's own position
// held fixed and its facing rotating in place. Section 11 (deploy a line of
// division columns, ¶979-981) reuses these identical commands/means per
// Casey's own text and is not separately built -- see reenactorNotes.
//
// SECTION 12 ENGINE APPROACH: starting formation is a SIMPLE column by
// company (1 wide, 8 deep, company 1 leading, "right in front") -- a third
// distinct starting point reaching the same double-column target as Sections
// 1/2/7. The new detail here is a SERIALIZED, one-pair-at-a-time merge with
// mark-time gating (¶992) rather than a simultaneous fold -- and, unlike
// Sections 1/2/7, the merge order is forced by the column's own marching
// order: companies 4 and 5 are already adjacent in the simple column (4
// leads, 5 follows immediately), so they unite FIRST with no waiting; then
// 3 unites with 6, then 2 with 7, then 1 with 8, each pair waiting its turn
// (¶991-993). cascadeBlend()'s per-group progress -- built for exactly this
// kind of serialized reveal (used already for Article XI's form-by-file) --
// drives this staged merge directly.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 60;
const ORIGIN_Y = 260;
const MARCH_FACING = 0; // column/battalion marches north (up-screen)

function rangeArr(from, to) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(n);
  return out;
}

function combine(soldiers, colorParty, fieldStaff) {
  return [...soldiers, ...colorParty, ...fieldStaff];
}
function cpAtRest(positions) {
  return buildColorParty(positions, { forwardPaces: 0, atRest: true });
}
function fsAtRest(positions) {
  return buildFieldAndStaff(positions, {});
}

/** Maps a soldier id to its "wing rank" -- 0 (companies 3/6, nearest the
 * anchor), 1 (2/7), 2 (1/8, outermost) -- for a staggered, nearest-first
 * cascade arrival as the outer companies peel off the double column and
 * settle onto the deployed line, mirroring the front-to-rear arrival order
 * already used in ployDoubleColumn.js's own fold. Anchor companies (4, 5)
 * are not represented (always fully settled). */
function wingRankOfId(id) {
  const m = /^c(\d+)-/.exec(id);
  if (!m) return null;
  const idx = Number(m[1]);
  if (idx === 3 || idx === 6) return 0;
  if (idx === 2 || idx === 7) return 1;
  if (idx === 1 || idx === 8) return 2;
  return null;
}

function buildDeploySequence(battalion, { lineFacing, sectionLabel, caseyRefRange }) {
  const byIndex = Object.fromEntries(battalion.map((c) => [c.index, c]));
  const column = doubleColumn(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: MARCH_FACING, distanceMode: 'half' });
  const anchorPos = captainPos(column, 4);

  // Final line, listed in the ORIGINAL left-to-right line-of-battle order,
  // company 4/5 combined as the fixed anchor division; see header note.
  const divisionsInFinalOrder = [
    byIndex[1], byIndex[2], byIndex[3],
    { companies: [byIndex[4], byIndex[5]] },
    byIndex[6], byIndex[7], byIndex[8],
  ];
  const anchorIndex = 3;
  const finalLine = divisionLineFromAnchor(divisionsInFinalOrder, anchorIndex, {
    originX: anchorPos.x,
    originY: anchorPos.y,
    facing: lineFacing,
  });

  const stage1 = cascadeBlend(column, finalLine, { 0: 1, 1: 0.5, 2: 0 }, wingRankOfId);
  const stage2 = cascadeBlend(column, finalLine, { 0: 1, 1: 1, 2: 0.6 }, wingRankOfId);

  return [
    {
      label: 'Double column, halted',
      description:
        `The battalion stands in the double column, halted, Division 1 (companies 4, 5) at the head. ${sectionLabel}`,
      caseyRef: caseyRefRange[0],
      duration: 0,
      positions: combine(column, cpAtRest(column), fsAtRest(column)),
      annotations: [],
    },
    {
      label: 'Markers placed; preparatory command',
      description:
        'The colonel places markers on the alignment the deployed line will take; the two general guides spring out onto that alignment, slightly beyond where the battalion\'s flanks will rest. Captains post before their companies\' centres.',
      caseyRef: caseyRefRange[1],
      duration: 900,
      positions: combine(column, cpAtRest(column), fsAtRest(column)),
      annotations: [],
    },
    {
      label: 'MARCH — the nearest outer companies begin to settle onto the line',
      description:
        'The column deploys on Division 1, which stands fast. The companies of Divisions 2 (3, 6) begin peeling outward, each returning to its own original wing side, while Divisions 3 and 4 (2/7, 1/8) continue to close up behind.',
      caseyRef: caseyRefRange[2],
      duration: 1800,
      positions: combine(stage1, cpAtRest(stage1), fsAtRest(stage1)),
      annotations: [],
    },
    {
      label: 'Outer divisions continue to arrive and align',
      description:
        'Divisions 3 (2, 7) settle onto the line beside Division 2; Division 4 (1, 8), the outermost, is close behind. Each captain aligns his company against the company already established beside it.',
      caseyRef: caseyRefRange[3],
      duration: 1800,
      positions: combine(stage2, cpAtRest(stage2), fsAtRest(stage2)),
      annotations: [],
    },
    {
      label: 'Guides—POSTS: battalion deployed in line of battle',
      description:
        'All 8 companies now stand in one continuous line of battle, each dressed against its neighbor. The colonel commands "Guides—POSTS."',
      caseyRef: caseyRefRange[4],
      duration: 1500,
      positions: combine(finalLine, cpAtRest(finalLine), fsAtRest(finalLine)),
      annotations: [],
    },
  ];
}

function buildFacedFrontKeyframes(battalion) {
  return buildDeploySequence(battalion, {
    lineFacing: MARCH_FACING,
    sectionLabel: 'It will deploy faced to the front, on the same alignment the column has been marching.',
    caseyRefRange: ['¶946', '¶946', '¶947', '¶947', '¶951'],
  });
}
function buildFacedRightKeyframes(battalion) {
  return buildDeploySequence(battalion, {
    lineFacing: (MARCH_FACING + 90) % 360,
    sectionLabel: 'It will deploy faced to the right, the resulting line standing perpendicular to the column\'s own line of march.',
    caseyRefRange: ['¶958', '¶959, ¶961', '¶962', '¶962', '¶958'],
  });
}
function buildFacedLeftKeyframes(battalion) {
  return buildDeploySequence(battalion, {
    lineFacing: (MARCH_FACING - 90 + 360) % 360,
    sectionLabel: 'It will deploy faced to the left, the mirror image of the faced-right case (¶974).',
    caseyRefRange: ['¶974', '¶959, ¶961', '¶962', '¶962', '¶958'],
  });
}

// ---------------------------------------------------------------------------
// Section 12 (¶982-998): form double column from a simple column by company.
// ---------------------------------------------------------------------------
function mirrorDivisionOfId(id) {
  const m = /^c(\d+)-/.exec(id);
  if (!m) return null;
  const idx = Number(m[1]);
  if (idx === 4 || idx === 5) return 0;
  if (idx === 3 || idx === 6) return 1;
  if (idx === 2 || idx === 7) return 2;
  if (idx === 1 || idx === 8) return 3;
  return null;
}

function buildFromSimpleColumnKeyframes(battalion) {
  const simpleColumn = columnOfCompanies(battalion, {
    originX: ORIGIN_X,
    originY: ORIGIN_Y,
    facing: MARCH_FACING,
    distanceMode: 'full',
  });
  const anchor4 = captainPos(simpleColumn, 4);
  const dblColumn = doubleColumn(battalion, {
    originX: anchor4.x,
    originY: anchor4.y,
    facing: MARCH_FACING,
    distanceMode: 'full',
  });

  const stageA = cascadeBlend(simpleColumn, dblColumn, { 0: 1, 1: 0, 2: 0, 3: 0 }, mirrorDivisionOfId);
  const stageB = cascadeBlend(simpleColumn, dblColumn, { 0: 1, 1: 1, 2: 0, 3: 0 }, mirrorDivisionOfId);
  const stageC = cascadeBlend(simpleColumn, dblColumn, { 0: 1, 1: 1, 2: 1, 3: 0 }, mirrorDivisionOfId);

  return [
    {
      label: 'Simple column by company, right in front, marching',
      description:
        'The battalion marches in a simple column by company, one company wide, eight deep, company 1 leading -- "right in front" -- at full distance.',
      caseyRef: '¶982',
      duration: 0,
      positions: combine(simpleColumn, cpAtRest(simpleColumn), fsAtRest(simpleColumn)),
      annotations: ['marchArrow'],
    },
    {
      label: '1. Form double column. 2. Right wing, right—FACE.',
      description:
        'Captains of the right wing (companies 1-4, the front half of the column) caution their companies to face right; captains of the left wing (5-8) caution "stand fast." The left general guide places himself on the prolongation of the front rank of the last company (8).',
      caseyRef: '¶983-985',
      duration: 900,
      positions: combine(simpleColumn, cpAtRest(simpleColumn), fsAtRest(simpleColumn)),
      annotations: [],
    },
    {
      label: 'MARCH — company 4 files right and unites with company 5 as Division 1',
      description:
        'The faced companies march straight forward. Company 4, already immediately ahead of company 5 in the column, files right, its left guide grazing the covering sergeant of company 5, halts, about-faces, and unites with it as Division 1 -- the only pair already adjacent, so it forms with no waiting.',
      caseyRef: '¶986-987',
      duration: 1800,
      positions: combine(stageA, cpAtRest(stageA), fsAtRest(stageA)),
      annotations: [],
    },
    {
      label: 'Company 3 unites with company 6 as Division 2',
      description:
        'Once the three right companies (1, 2, 3) have marched a distance equal to one division-front, the colonel commands "Three right companies, by the right flank. MARCH. Guide right." Company 3, the nearest of the three, reaches its corresponding company (6) and unites with it as Division 2, its captain commanding halt, front, and dress.',
      caseyRef: '¶991-993',
      duration: 1800,
      positions: combine(stageB, cpAtRest(stageB), fsAtRest(stageB)),
      annotations: [],
    },
    {
      label: 'Company 2 unites with company 7 as Division 3; company 1 waits its turn',
      description:
        'If in close order, companies 1 and 2 mark time until company 3 has passed; company 2 then unites with company 7 as Division 3, and company 1, marking time in its own turn, prepares to unite last with company 8.',
      caseyRef: '¶992-993',
      duration: 1800,
      positions: combine(stageC, cpAtRest(stageC), fsAtRest(stageC)),
      annotations: [],
    },
    {
      label: 'Double column formed',
      description:
        'Company 1 unites with company 8 as Division 4, the last pair to arrive. The battalion now stands in the double column: Division 1 (4, 5), Division 2 (3, 6), Division 3 (2, 7), Division 4 (1, 8). The lieutenant-colonel has assured each division\'s right guides on direction as they successively arrived.',
      caseyRef: '¶993-994',
      duration: 1500,
      positions: combine(dblColumn, cpAtRest(dblColumn), fsAtRest(dblColumn)),
      annotations: [],
    },
  ];
}

export default {
  id: 'deploy-double-column',
  title: 'Deploying the Double Column into Line; Forming It from Simple Column',
  part: 5,
  article: 13,
  caseyParagraphs: rangeArr(946, 998),
  subMovements: [
    { id: 'faced-front', label: 'Deploy, Faced to the Front' },
    { id: 'faced-right', label: 'Deploy, Faced to the Right' },
    { id: 'faced-left', label: 'Deploy, Faced to the Left' },
    { id: 'from-simple-column', label: 'Form Double Column from Simple Column by Company' },
  ],
  commands: (subMovement) => {
    if (subMovement === 'faced-right') {
      return [
        { text: '1. Right into line wheel, left companies on the right into line.', type: 'preparatory' },
        { text: '2. Battalion, guide right.', type: 'preparatory' },
        { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
      ];
    }
    if (subMovement === 'faced-left') {
      return [
        { text: '1. Left into line wheel, right companies on the left into line.', type: 'preparatory' },
        { text: '2. Battalion, guide left.', type: 'preparatory' },
        { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
      ];
    }
    if (subMovement === 'from-simple-column') {
      return [
        { text: '1. Form double column.', type: 'preparatory' },
        { text: '2. Right wing, right—FACE.', type: 'preparatory' },
        { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
        { text: '1. Three right companies, by the right flank.', type: 'preparatory' },
        { text: '2. MARCH.', type: 'execution' },
        { text: '3. Guide right.', type: 'execution' },
      ];
    }
    return [
      { text: '1. Deploy column.', type: 'preparatory' },
      { text: '2. Battalion outward—FACE.', type: 'preparatory' },
      { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
    ];
  },
  reenactorNotes:
    'Deploying the double column reverses ployDoubleColumn.js\'s fold: each outer division splits back into its two ORIGINAL wing companies, which peel apart to their own original sides of the line rather than staying together as a two-company block -- only Division 1 (companies 4, 5) remains a fixed, un-split anchor throughout. "Faced to the front" (¶946-957) deploys the line on the same alignment the column was marching, no net rotation; "faced to the right or left" (¶958-978) rotates the resulting line 90 degrees from the march axis, a "right (or left) into line wheel" generalized so the wheeling/marching unit is Division 1 (two companies abreast) rather than a single company -- this drill models both cases with the identical divisionLineFromAnchor() geometry, differing only in the `facing` passed for the final line, mirroring the precedent set by part-iv/halfDistanceIntoLine.js\'s own "faced to the rear" sub-case. The double column is habitually deployed on its centre division (4, 5), but Casey allows deployment on any interior division or the outermost company (¶977) -- not modeled as separate sub-movements here, consistent with this project\'s convention of animating the habitual case and documenting variants. Section 11 (deploy a line of division columns, ¶979-981) reuses these identical Section 9/10 commands and mechanics verbatim, with only a pre-positioning detail (the outer division columns\' leading-company guides align toward the centre markers before deploying begins) -- not separately built, since it is not a new geometry, matching this project\'s convention of documenting rather than re-animating pure command/means reuse; ¶981\'s "detach the outer division columns to strike a flank" is a tactical option, not a fixed choreography, and likewise not modeled. ' +
    'Forming the double column from a SIMPLE column by company (¶982-998) is a third distinct path to the same double-column target (alongside Sections 1/2 from line and Section 7 from a line of division columns), starting from a one-wide, eight-deep column, company 1 leading ("right in front"). The new mechanic here is a SERIALIZED, one-pair-at-a-time merge with mark-time gating (¶991-993): companies 4 and 5, already adjacent in the marching column, unite first with no waiting; then 3 with 6, then 2 with 7, then 1 with 8, each pair waiting its turn rather than all four wings converging at once as in Sections 1/2/7. This drill drives that staged merge with cascadeBlend()\'s per-group progress, the same helper already used for Article XI\'s form-by-file serialized reveal. The marching (no-halt) variant from full distance (¶995-998) uses the identical merge order at double-quick time for the right wing and is documented here rather than separately animated. Skirmisher-related paragraphs throughout this range (`0-`-prefixed, e.g. ¶948-950, ¶956-957, ¶960, ¶963-964, ¶967, ¶969, ¶973, ¶978, ¶980, ¶984, ¶988-990, ¶998) are out of this project\'s scope, consistent with every prior drill in this series.',

  buildKeyframes: (_company, subMovement = 'faced-front', battalion = DEFAULT_BATTALION) => {
    if (subMovement === 'faced-right') return buildFacedRightKeyframes(battalion);
    if (subMovement === 'faced-left') return buildFacedLeftKeyframes(battalion);
    if (subMovement === 'from-simple-column') return buildFromSimpleColumnKeyframes(battalion);
    return buildFacedFrontKeyframes(battalion);
  },
};
