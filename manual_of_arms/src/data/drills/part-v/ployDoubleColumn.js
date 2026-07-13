import { battalionLine, doubleColumn, cascadeBlend } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';
import { buildColorParty, buildFieldAndStaff, captainPos } from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article XIII, Sections 1-2 (S.B. ¶874-902): "To ploy the
// battalion into column doubled on the centre" / "double column" -- halted
// (¶874-888) and without halting, on the march (¶889-902).
//
// GEOMETRY: doubleColumn() folds the 8-company line inward at its centre,
// pairing companies by MIRROR DISTANCE from the centre -- (4,5), (3,6),
// (2,7), (1,8) -- each pair forming a 2-company-wide division, the four
// divisions stacked front-to-rear on the former centre-line axis (¶874,
// ¶885). Division 1 (companies 4,5) "stands fast" (¶880) -- this drill
// anchors doubleColumn()'s origin at company 4's own actual position within
// the starting line of battle, so Division 1's final position is IDENTICAL
// to its starting position (verified by construction: doubleColumn() places
// its leading unit's first company at exactly the given origin, and company
// 5 exactly COMPANY_STRIDE to its left -- the same offset it already has in
// battalionLine()).
//
// The other six companies face inward in place (right wing 1,2,3 face left;
// left wing 6,7,8 face right, ¶878/¶890), then march to their divisions.
// Divisions 2, 3, 4 do not all arrive simultaneously -- Casey describes them
// "arranging themselves in column" one union at a time, front to rear
// (¶881-882) -- so the cascade below staggers each division's arrival
// slightly, division 2 (3,6) leading, division 4 (1,8) trailing, rather than
// snapping all three at once.
//
// MARCHING VARIANT (¶889-902): identical target geometry and choreography,
// executed "by the right and left flanks" while already in motion rather
// than from a halt (¶889). This drill shows it as the same fold sequence,
// framed as continuous marching rather than starting from a halted line, per
// this project's established "timing variant, not new geometry" convention
// (see part-iii/changeDirectionHalf.js, part-iv/massDeployment.js headers).
// ---------------------------------------------------------------------------

const LINE_ORIGIN_X = CANVAS_BATTALION.VIEW_W - 60;
const LINE_ORIGIN_Y = 260;
const FACING = 0; // battalion faces/marches north (up-screen)

function rangeArr(from, to) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(n);
  return out;
}

/** Maps a soldier id to its double-column DIVISION group (0-3), mirror-pairing
 * (4,5)->0, (3,6)->1, (2,7)->2, (1,8)->3 -- per doubleColumn()'s own pairing. */
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

/** Face each company (by its own soldier-id prefix) in place, no position
 * change -- the "inward-face" instant before any marching begins. */
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

function buildSequence(battalion, { marching }) {
  const halted = battalionLine(battalion, { originX: LINE_ORIGIN_X, originY: LINE_ORIGIN_Y, facing: FACING });
  const div1Anchor = captainPos(halted, 4);
  const finalColumn = doubleColumn(battalion, {
    originX: div1Anchor.x,
    originY: div1Anchor.y,
    facing: FACING,
    distanceMode: 'half',
  });

  // Right wing (1,2,3) faces left (270); left wing (6,7,8) faces right (90);
  // centre companies (4,5) keep facing 0, unchanged -- ¶878 (halted) / ¶892
  // (marching, "the three right companies face to the left... the three left
  // companies face to the right").
  const faced = facedByCompany(halted, { 1: 270, 2: 270, 3: 270, 4: 0, 5: 0, 6: 90, 7: 90, 8: 90 });

  const stage1 = cascadeBlend(faced, finalColumn, { 0: 1, 1: 0.6, 2: 0.2, 3: 0 }, mirrorDivisionOfId);
  const stage2 = cascadeBlend(faced, finalColumn, { 0: 1, 1: 1, 2: 0.7, 3: 0.3 }, mirrorDivisionOfId);

  const cpAtRest = (positions) => buildColorParty(positions, { forwardPaces: 0, atRest: true });
  const fsAtRest = (positions) => buildFieldAndStaff(positions, {});

  const halt = marching
    ? {
        label: 'Battalion in line of battle, marching',
        description:
          'The battalion is in march, in line of battle, correctly aligned, about to form the double column without halting.',
        caseyRef: '¶889',
        duration: 0,
        positions: combine(halted, cpAtRest(halted), fsAtRest(halted)),
        annotations: [],
      }
    : {
        label: 'Battalion in line of battle, halted',
        description:
          'The battalion stands halted, in line of battle, about to ploy into column doubled on the centre.',
        caseyRef: '¶874',
        duration: 0,
        positions: combine(halted, cpAtRest(halted), fsAtRest(halted)),
        annotations: [],
      };

  const face = {
    label: marching
      ? '1st command — companies caution and face by the flank'
      : '1. Double column, at half distance. 2. Battalion, inward—FACE.',
    description: marching
      ? 'Each captain moves briskly to the centre of his company. Captains of companies 4 and 5 caution "march straight-forward" and command Quick time. The three right companies face to the left, the three left companies face to the right, without halting the march.'
      : 'Every captain steps 2 paces in front of his company. Captains of the two centre companies (4, 5) caution them to stand fast. The rest of the right wing (1, 2, 3) faces left; the rest of the left wing (6, 7, 8) faces right. Covering sergeants step into the front rank.',
    caseyRef: marching ? '¶890, ¶892' : '¶876, ¶878',
    duration: 900,
    positions: combine(faced, cpAtRest(faced), fsAtRest(faced)),
    annotations: [],
  };

  const march1 = {
    label: 'MARCH — Division 1 stands fast, Division 2 arranges itself in column',
    description:
      'Companies 4 and 5 (Division 1) stand fast; the senior captain commands "Guide right," the junior takes the interval between the companies. Companies 3 and 6, led by their captains, step off briskly and unite behind Division 1 as Division 2, the left guides of the right companies passing to the file-closer line an instant before each union.',
    caseyRef: '¶880-883',
    duration: 1800,
    positions: combine(stage1, cpAtRest(stage1), fsAtRest(stage1)),
    annotations: [],
  };

  const march2 = {
    label: 'Divisions 3 and 4 continue to arrange themselves in column',
    description:
      'Companies 2 and 7 unite as Division 3 behind Division 2; companies 1 and 8, following, unite as Division 4. Each division, once aligned, dresses right and its chief takes post 2 paces before its centre.',
    caseyRef: '¶881-883, ¶885',
    duration: 1800,
    positions: combine(stage2, cpAtRest(stage2), fsAtRest(stage2)),
    annotations: [],
  };

  const finalKf = {
    label: marching ? 'Double column formed, continuing to march' : 'Double column formed, halted',
    description:
      'The battalion now stands in column doubled on the centre: Division 1 (companies 4, 5) leads, followed by Division 2 (3, 6), Division 3 (2, 7), and Division 4 (1, 8), each two companies wide, at half distance. The lieutenant-colonel and senior major take post outside the column\'s right flank; the music passes to the rear.' +
      (marching ? ' The battalion continues its march in this formation.' : ''),
    caseyRef: '¶885-888',
    duration: 1200,
    positions: combine(finalColumn, cpAtRest(finalColumn), fsAtRest(finalColumn)),
    annotations: [],
  };

  return [halt, face, march1, march2, finalKf];
}

export default {
  id: 'ploy-double-column',
  title: 'To Ploy the Battalion into Column Doubled on the Centre (Double Column)',
  part: 5,
  article: 13,
  caseyParagraphs: rangeArr(874, 902),
  subMovements: [
    { id: 'halted', label: 'At a Halt' },
    { id: 'marching', label: 'On the March, Without Halting' },
  ],
  commands: (subMovement) => {
    if (subMovement === 'marching') {
      return [
        { text: '1. Double column at half distance.', type: 'preparatory' },
        { text: '2. Battalion, by the right and left flanks.', type: 'preparatory' },
        { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
      ];
    }
    return [
      { text: '1. Double column, at half distance.', type: 'preparatory' },
      { text: '2. Battalion, inward—FACE.', type: 'preparatory' },
      { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
    ];
  },
  reenactorNotes:
    'The double column ("column doubled on the centre," ¶874, and "double column" from ¶889 onward -- Casey\'s own two names for the identical formation) folds the whole 8-company line inward at its centre. Companies pair by MIRROR DISTANCE from the centre, not simple adjacency: (4,5), (3,6), (2,7), (1,8), each pair forming a division two companies wide, the four divisions stacked front to rear along the former centre-line axis, numbered Division 1 (front, 4/5) through Division 4 (rear, 1/8) (¶885). Division 1 literally stands fast throughout -- it is already exactly where companies 4 and 5 stood in line of battle; only the other six companies move, facing inward (right wing left, left wing right) and marching to fall in behind their own wing\'s previous company (right wing order behind Division 1: 3, then 2, then 1; left wing order: 6, then 7, then 8, ¶881). "Closed in mass" (¶897) is the identical movement substituting that phrase for "at half distance" in the preparatory command -- not modeled as a separate sub-movement, per this project\'s convention of not re-animating a pure distance-parameter variant (see distanceMode on doubleColumn()). The marching (no-halt) variant (¶889-902) uses the identical target geometry and choreography, executed while already in motion -- a timing variant, not new geometry, matching the treatment already given to other marching-vs-halted pairs in this project. The double column never forms when two or more battalions join into one general column, and takes the guide right, left, or centre per the colonel\'s choice (¶898); it marches, countermarches, and changes direction by the same principles already established for a simple column by division. Skirmisher platoon-column placement and posting (the `0-`-prefixed paragraphs throughout ¶877-902) are out of this project\'s scope, consistent with every prior drill.',

  buildKeyframes: (_company, subMovement = 'halted', battalion = DEFAULT_BATTALION) =>
    buildSequence(battalion, { marching: subMovement === 'marching' }),
};
