import { battalionLine, divisionColumns, cascadeBlend } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';
import { buildColorParty, buildFieldAndStaff, captainPos, offsetPaces } from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article XIII, Sections 3-4 (S.B. ¶903-921): "To ploy the
// battalion into division columns" -- halted (¶903-913) and without halting,
// on the march (¶914-921).
//
// GEOMETRY: divisionColumns() ploys the line into FOUR separate, parallel
// columns, each one company wide, two deep, preserving (approximately) its
// original lateral position -- companies pair by simple ADJACENCY, not
// mirror distance: (2 front, 1 rear), (4 front, 3 rear), (5 front, 6 rear),
// (7 front, 8 rear), denominated 1st (rightmost) through 4th (leftmost)
// division-column (¶912). This is distinct from doubleColumn()
// (ployDoubleColumn.js) -- see battalion-spec/part-fifth-d.md's disambiguated
// overview.
//
// "STAND FAST" NUANCE: ¶909 has companies 2, 4, 5, 7 stand fast while their
// rear partners (1, 3, 6, 8) march up behind them. divisionColumns() centres
// each division-column at the LATERAL MIDPOINT of its pair's original
// two-company footprint (documented in that function's own header) -- since
// a division-column is only one company wide, its front company shifts a
// small amount (roughly a quarter company-front) from its exact original
// line position toward that midpoint, rather than being pixel-exact
// motionless. This drill treats that shift as part of the same cascade as
// the rear company's fuller march, an engine-level simplification flagged
// here rather than re-derived from scratch.
// ---------------------------------------------------------------------------

const LINE_ORIGIN_X = CANVAS_BATTALION.VIEW_W - 60;
const LINE_ORIGIN_Y = 260;
const FACING = 0; // battalion faces/marches north (up-screen)

function rangeArr(from, to) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(n);
  return out;
}

/** Maps a soldier id to its division-column group (0-3), adjacency pairing
 * (2,1)->0, (4,3)->1, (5,6)->2, (7,8)->3 -- per divisionColumns()'s own
 * DIVISION_COLUMN_PAIRS. */
function adjacencyDCOfId(id) {
  const m = /^c(\d+)-/.exec(id);
  if (!m) return null;
  const idx = Number(m[1]);
  return Math.floor((idx - 1) / 2);
}

function facedByCompany(positions, facingByCompany) {
  return positions.map((p) => {
    const m = /^c(\d+)-/.exec(p.id);
    if (!m) return p;
    const f = facingByCompany[Number(m[1])];
    return f === undefined ? p : { ...p, facing: f };
  });
}

function combine(soldiers, colorParty, fieldStaff) {
  return [...soldiers, ...colorParty, ...fieldStaff];
}

function buildFieldStaffForFinal(finalDCs) {
  // ¶913: lieutenant-colonel in rear of the centre of DC1 (rightmost, led by
  // company 2), senior major in rear of the centre of DC4 (leftmost, led by
  // company 7), each 12 paces from the file closers behind the rearmost
  // companies of their division columns -- approximated here as 12 paces
  // behind each division-column's REAR company (1 for DC1, 8 for DC4).
  const ltcPost = offsetPaces(captainPos(finalDCs, 1), FACING, { forward: -12 });
  const smajPost = offsetPaces(captainPos(finalDCs, 8), FACING, { forward: -12 });
  return buildFieldAndStaff(finalDCs, {
    'fs-ltc': { ...ltcPost, facing: FACING },
    'fs-smaj': { ...smajPost, facing: FACING },
  });
}

function buildSequence(battalion, { marching }) {
  const halted = battalionLine(battalion, { originX: LINE_ORIGIN_X, originY: LINE_ORIGIN_Y, facing: FACING });
  const finalDCs = divisionColumns(battalion, {
    originX: LINE_ORIGIN_X,
    originY: LINE_ORIGIN_Y,
    facing: FACING,
    distanceMode: 'full',
  });

  // Odd right-wing companies (1,3) face left; even left-wing companies (6,8)
  // face right; companies 2,4,5,7 keep facing 0 -- ¶905 (halted) / ¶915
  // (marching).
  const faced = facedByCompany(halted, { 1: 270, 2: 0, 3: 270, 4: 0, 5: 0, 6: 90, 7: 0, 8: 90 });

  const midCascade = cascadeBlend(faced, finalDCs, { 0: 0.5, 1: 0.5, 2: 0.5, 3: 0.5 }, adjacencyDCOfId);

  const cpAtRest = (positions) => buildColorParty(positions, { forwardPaces: 0, atRest: true });
  const fsAtRest = (positions) => buildFieldAndStaff(positions, {});

  const halt = marching
    ? {
        label: 'Battalion in line of battle, marching',
        description:
          'The battalion is in march, in line of battle, correctly aligned, about to form division columns without halting.',
        caseyRef: '¶914',
        duration: 0,
        positions: combine(halted, cpAtRest(halted), fsAtRest(halted)),
        annotations: [],
      }
    : {
        label: 'Battalion in line of battle, halted',
        description:
          'The battalion stands halted, in line of battle, about to ploy into division columns.',
        caseyRef: '¶903',
        duration: 0,
        positions: combine(halted, cpAtRest(halted), fsAtRest(halted)),
        annotations: [],
      };

  const face = {
    label: marching
      ? '1st command — captains caution and companies face by the flank'
      : '1. Division columns at company distance. 2. Battalion, inward face.',
    description: marching
      ? 'Each captain moves briskly as before. Captains of the even companies of the right wing (2, 4) and odd companies of the left wing (5, 7) caution "march straight-forward," command Quick time. The odd right companies (1, 3) face left, the even left companies (6, 8) face right, without halting the march.'
      : 'Captains step 2 paces in front of their companies. Captains of the even companies of the right wing (2, 4) and odd companies of the left wing (5, 7) caution "stand fast." Captains of the odd companies of the right (1, 3) and even companies of the left (6, 8) caution their companies to face left / right respectively. Covering sergeants step into the front rank.',
    caseyRef: marching ? '¶915, ¶917' : '¶905, ¶907',
    duration: 900,
    positions: combine(faced, cpAtRest(faced), fsAtRest(faced)),
    annotations: [],
  };

  const march1 = {
    label: 'MARCH — each pair arranges itself into its own division column',
    description:
      'Companies 2, 4, 5, and 7 stand as the head of their own separate division columns (they do NOT unite into a single division, unlike the double column). Companies 1, 3, 6, and 8, led by their chiefs, step off briskly toward their own front company: 1 falls in behind 2, 3 behind 4 (right wing); 6 falls in behind 5, 8 behind 7 (left wing).',
    caseyRef: '¶909-910',
    duration: 1800,
    positions: combine(midCascade, cpAtRest(midCascade), fsAtRest(midCascade)),
    annotations: [],
  };

  const finalKf = {
    label: marching ? 'Division columns formed, continuing to march' : 'Division columns formed, halted',
    description:
      'The battalion now stands in four separate, side-by-side division columns at company distance, numbered 1st (rightmost, companies 2/1) through 4th (leftmost, companies 7/8), each preserving its own original lateral position on the line. The lieutenant-colonel posts behind the 1st division column, the senior major behind the 4th, and the music behind the 3rd.' +
      (marching ? ' The battalion continues its march in this formation.' : ''),
    caseyRef: '¶912-913',
    duration: 1200,
    positions: combine(finalDCs, cpAtRest(finalDCs), buildFieldStaffForFinal(finalDCs)),
    annotations: [],
  };

  return [halt, face, march1, finalKf];
}

export default {
  id: 'ploy-division-columns',
  title: 'To Ploy the Battalion into Division Columns',
  part: 5,
  article: 13,
  caseyParagraphs: rangeArr(903, 921),
  subMovements: [
    { id: 'halted', label: 'At a Halt' },
    { id: 'marching', label: 'On the March, Without Halting' },
  ],
  commands: (subMovement) => {
    if (subMovement === 'marching') {
      return [
        { text: '1. Division columns at company distance.', type: 'preparatory' },
        { text: '2. Battalion by the right and left flanks.', type: 'preparatory' },
        { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
      ];
    }
    return [
      { text: '1. Division columns at company distance.', type: 'preparatory' },
      { text: '2. Battalion, inward face.', type: 'preparatory' },
      { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
    ];
  },
  reenactorNotes:
    'Division columns are FOUR separate, parallel columns, each one company wide and two companies deep, arranged side by side across the original battalion frontage -- distinct from the double column (ployDoubleColumn.js), which folds the whole line into ONE column at the centre. Companies pair by simple adjacency, not mirror distance: 1 falls in behind 2, 3 behind 4 (right wing), 6 behind 5, 8 behind 7 (left wing), numbered 1st (rightmost) through 4th (leftmost) division column beginning at the right of the line (¶912). The front company of each pair (2, 4, 5, 7) does not literally stand pixel-still -- because a division column is only one company wide, its centreline settles at roughly the lateral midpoint of the pair\'s original two-company footprint, a small settling shift folded into the same march as the rear company\'s fuller movement, an engine-level detail rather than a Casey-specified motion. Unlike the double column, the two centre companies (4, 5) do NOT unite into one division here -- each stands as the head of its own separate division column (¶909). With only 7 companies present the 7th stands alone as a division column; with fewer, the movement is not performed (¶912). "Division columns closed in mass" (¶920) and the halted/marching distance-change rules (¶921) reuse the existing distance-parameter and simple-column mechanics and are not separately animated. Skirmisher company placement (`0-`-prefixed paragraphs throughout ¶906-919) is out of this project\'s scope.',

  buildKeyframes: (_company, subMovement = 'halted', battalion = DEFAULT_BATTALION) =>
    buildSequence(battalion, { marching: subMovement === 'marching' }),
};
