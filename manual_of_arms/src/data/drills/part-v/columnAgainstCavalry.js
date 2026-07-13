import { wheel, aboutFace } from '../../../engine/formations.js';
import { columnOfCompanies } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { buildColorParty, buildFieldAndStaff, captainPos } from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article XIV (S.B. ¶1201-1211): "Column against cavalry" -- an
// alternative to forming a full square under extreme time pressure. This is
// explicitly a THIRD, DISTINCT SHAPE from every square variant elsewhere in
// this Part: not four full fronts meeting at right-angle corners
// (`formSquare()`'s shape), but a column that partially unfolds sideways
// while its head and tail stay column-postured -- leaving a VACANT INTERIOR
// SPACE, open at both ends, rather than a closed box (¶1205, ¶1211's own
// "start/end state" note in the spec: "it's a column that partially
// unfolds sideways... cavalry-resistant on all sides without ever fully
// reconfiguring into the square's four-corner shape").
//
// GEOMETRY (documented approximation -- Casey's text describes this
// qualitatively, "close the interval," "vacant space," with no pace figures
// given, ¶1212 of the spec's own flag):
//   - 1st (leading) division: stands fast, unchanged facing/position --
//     already the full width of the column (2 companies abreast), so no
//     further widening is needed or performed, unlike `formSquare()`'s
//     front face (¶1203, ¶1205).
//   - 4th (rearmost) division: faces about IN PLACE (aboutFace()), also at
//     its own already-full column width, no repositioning (¶1203, ¶1205).
//   - 2nd and 3rd (interior) divisions: split by company (right company ->
//     right wall, left company -> left wall), each company wheeling 90
//     degrees outward -- reusing `formSquare()`'s own wall-wheel technique,
//     since a company wheeling onto a wall is the same primitive regardless
//     of whether the resulting shape closes fully or not. UNLIKE
//     `formSquare()`, the two wall segments are placed with a gap between
//     them (not flush end to end) -- approximating "files remaining in
//     column close on their own now-in-line outer files, creating a vacant
//     space in the column's middle" (¶1205) as a visible gap rather than a
//     literal partial-file peel (a file-level, not company-level, detail
//     this project's block-level companies do not individually track here).
//   - The overall footprint is also more ELONGATED than `formSquare()`'s
//     compact box: the 1st and 4th divisions stay at their actual column
//     depth-spacing (not drawn together at a chosen faceDistance as
//     `formSquare()` does), so the resulting rectangle reads as a genuinely
//     different proportion, not merely a square with a hole in the middle.
// ---------------------------------------------------------------------------

const ORIGIN_X = 1000;
const ORIGIN_Y = 260;
const FACING = 0;

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

/**
 * buildColumnAgainstCavalry(battalion, opts) -- the distinct hollow
 * rectangular COLUMN shape described above.
 */
function buildColumnAgainstCavalry(battalion, { originX = 480, originY = 300, facing = 0, distanceMode = 'full', wallGap = 40 } = {}) {
  const divisions = buildDivisions(battalion);
  const rawColumn = columnOfCompanies(divisions, { originX, originY, facing, distanceMode });

  // 1st division: unchanged. 4th division: faces about in place.
  const div1Ids = rawColumn.filter((p) => companyOfId(p.id) === 1 || companyOfId(p.id) === 2).map((p) => p.id);
  const div4Ids = rawColumn.filter((p) => companyOfId(p.id) === 7 || companyOfId(p.id) === 8).map((p) => p.id);
  const div4 = aboutFace(rawColumn.filter((p) => div4Ids.includes(p.id)));

  // 2nd/3rd division companies wheel 90 degrees outward onto the two side
  // walls, right companies (3, 5) to the right, left companies (4, 6) to
  // the left -- same wheel technique as formSquare()'s walls, but with a
  // visible gap left between the two wall segments (the "vacant space,"
  // ¶1205), and anchored at the divisions' OWN column depth rather than a
  // chosen faceDistance.
  const div2 = rawColumn.filter((p) => companyOfId(p.id) === 3 || companyOfId(p.id) === 4);
  const div3 = rawColumn.filter((p) => companyOfId(p.id) === 5 || companyOfId(p.id) === 6);
  const div2Anchor = captainPos(rawColumn, 3);
  const div3Anchor = captainPos(rawColumn, 5);
  const rad = (facing * Math.PI) / 180;
  const bx = -Math.sin(rad), by = Math.cos(rad);

  const rightFacing = (facing + 90) % 360;
  const leftFacing = (facing - 90 + 360) % 360;

  function wheelCompanyOntoWall(companyPositions, companyIndex, anchor, side) {
    const ids = companyPositions.filter((p) => companyOfId(p.id) === companyIndex).map((p) => p.id);
    const members = companyPositions.filter((p) => ids.includes(p.id));
    const angle = side === 'right' ? 90 : -90;
    return wheel(members, { pivotX: anchor.x, pivotY: anchor.y, angleDeg: angle }).map((p) => ({ ...p, facing: side === 'right' ? rightFacing : leftFacing }));
  }

  const rightWallNear = wheelCompanyOntoWall(div2, 3, div2Anchor, 'right');
  const leftWallNear = wheelCompanyOntoWall(div2, 4, div2Anchor, 'left');
  const rightWallFar = wheelCompanyOntoWall(div3, 5, div3Anchor, 'right')
    .map((p) => ({ ...p, x: p.x + bx * wallGap, y: p.y + by * wallGap }));
  const leftWallFar = wheelCompanyOntoWall(div3, 6, div3Anchor, 'left')
    .map((p) => ({ ...p, x: p.x + bx * wallGap, y: p.y + by * wallGap }));

  return [
    ...rawColumn.filter((p) => div1Ids.includes(p.id)),
    ...div4,
    ...rightWallNear,
    ...leftWallNear,
    ...rightWallFar,
    ...leftWallFar,
  ];
}

function buildKeyframesFor(battalion) {
  const divisions = buildDivisions(battalion);
  const column = columnOfCompanies(divisions, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING, distanceMode: 'mass' });

  // Caution: 4th division cautioned to face about; interior captains
  // designate files to close the intervals -- an officer-choreography beat
  // with no soldier repositioning yet at this project's block-view scale
  // (¶1203), so this keyframe reuses the column's own positions unchanged.
  const cautioned = column;
  const hollowColumn = buildColumnAgainstCavalry(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING, distanceMode: 'mass' });

  // The exact-inverse reversal, "Form column" (¶1207-1208): files that had
  // formed into line retake their column places, the fourth division faces
  // about again to its original front-facing posture, guides resume their
  // posts -- shown here simply as a return to the original column state.
  const reformedColumn = column;

  return [
    {
      label: 'Column closed in mass, halted',
      description: 'The battalion stands in column closed in mass, right in front, halted -- suddenly threatened by cavalry, with no time to take company distance and form a full square.',
      caseyRef: '¶1201',
      duration: 0,
      positions: withStaff(column),
      annotations: [],
    },
    {
      label: 'Column against cavalry — MARCH',
      description: 'At the first command, the leading division stands fast, its file closers passing behind the rear rank. In the interior divisions, each captain designates enough files to close the interval between his own company and the one ahead of it. The fourth (rearmost) division is cautioned to face about, its file closers passing briskly to the front rank. Men fix bayonets automatically, without further command (¶1210).',
      caseyRef: '¶1202-1204',
      duration: 1000,
      positions: withStaff(cautioned),
      annotations: [],
    },
    {
      label: 'Column against cavalry formed',
      description: 'The first division stands fast, facing the original front. The fourth division has faced about, guarding the rear. The second and third divisions\' companies have wheeled outward into the side walls, leaving a vacant space in the column\'s middle -- a hollow rectangle, open at both ends by the first and fourth divisions\' own posture, rather than a closed four-sided square.',
      caseyRef: '¶1205-1206',
      duration: 1800,
      positions: withStaff(hollowColumn),
      annotations: [],
    },
    {
      label: 'Form column — MARCH: the column re-forms',
      description: 'The files that had formed into line close up and retake their column places by stepping backward, except those that closed the gap between the two rear divisions, who retake their places by a flank movement. The fourth division faces about again; the guides resume their posts.',
      caseyRef: '¶1207-1208',
      duration: 1800,
      positions: withStaff(reformedColumn),
      annotations: [],
    },
  ];
}

export default {
  id: 'column-against-cavalry',
  title: 'Column Against Cavalry',
  part: 5,
  article: 14,
  caseyParagraphs: rangeArr(1201, 1211),
  subMovements: [
    { id: 'default', label: 'Column Against Cavalry, and Re-form Column' },
  ],
  commands: [
    { text: '1. Column against cavalry.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
    { text: '1. Form column.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],
  reenactorNotes:
    'Column against cavalry is explicitly presented as an ALTERNATIVE to forming a full square, for use "if so suddenly threatened by cavalry as not to allow time" even for the abbreviated company-distance square (¶1201) -- a genuinely distinct third formation shape, not a square variant. The defining difference from every `formSquare()`-based drill in this Part: the leading and rearmost divisions never reposition or widen -- they simply stand fast (1st) or face about in place (4th), staying at their own actual column width and depth-spacing throughout, rather than being drawn together at a chosen interior faceDistance the way `formSquare()`\'s front/rear faces are. Only the interior (2nd and 3rd) divisions\' companies wheel outward, onto two side walls, leaving a VACANT INTERIOR SPACE that is open at both ends -- Casey\'s own words are "close the interval... creating a vacant space in the column\'s middle" (¶1205), which this file renders as a visible gap between the two wall segments (companies 3/4 near the front, companies 5/6 near the rear) rather than as a literal partial-file peel: Casey\'s actual mechanic has each captain designate only ENOUGH FILES to close the interval to the division ahead (a file-level detail), not whole companies wheeling as this project\'s company-block rendering does -- flagged as a documented simplification, consistent with how `formSquare()` itself does not model corner-file detail. No pace figures are given in the source for the gap width or the wall placement (¶1201-1211 describes spacing qualitatively throughout); the wallGap constant used here is an interpretive, illustrative choice, not a sourced distance. The reverse movement, "Form column" (¶1207-1208), is modeled as its own dedicated final keyframe returning to the original column state -- distinct from the baseline "reduce square" mechanic (which this drill never invokes, since there is no square to reduce). The marching-column variant (¶1206) is a timing delta only (first and fourth divisions halt in stride rather than already standing halted) and is not separately animated, consistent with this Part\'s other marching-variant treatments.',

  buildKeyframes: (_company, _subMovement, battalion = DEFAULT_BATTALION) => buildKeyframesFor(battalion),
};
