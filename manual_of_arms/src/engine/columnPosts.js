/**
 * columnPosts.js
 *
 * Shared geometry for posting the company's chiefs of platoon and guides
 * within a "column of platoons" formation (Lesson V, Articles II-V), so that
 * every drill's column-of-platoons frames are continuous with the end state
 * of "break into column by platoon" (Lesson V, Article I, ¶177-191):
 *
 *   - of-cpt (captain, chief of the 1st platoon): 2 paces before the centre
 *     of the 1st platoon (¶177, ¶189, ¶191).
 *   - fc-1lt (1st lieutenant, chief of the 2nd platoon -- roster file 18):
 *     2 paces before the centre of the 2nd platoon, having passed around the
 *     left of the company (¶177).
 *   - nc-cov (covering sergeant, leading guide): replaces the captain at the
 *     head of the column and marches one file interval beyond the marching
 *     (left) flank of the 1st platoon (¶178, ¶191, ¶205).
 *   - fc-2sg (2nd sergeant, following guide): the same post for the 2nd
 *     platoon, marching in the trace of the leading guide at platoon-front
 *     distance (¶191, ¶206).
 *
 * These four soldiers are otherwise ordinary members of columnOfPlatoons()'s
 * output (of-cpt/nc-cov occupy platoon 1's file-1 front/rear rank slots;
 * fc-1lt/fc-2sg are ordinary file closers of platoon 2) -- this module
 * overrides only their positions, leaving everyone else untouched.
 *
 * IMPORTANT: `basePositions` must be the RAW, un-overridden output of
 * columnOfPlatoons(company, { originX, originY, facing }) (or a pure
 * translate()/wheel() of that output) so that of-cpt and fr-11 still mark
 * the true file-1-front-rank corner of each platoon at the column's current
 * facing. Because chiefs/guides are given a position that is rigidly offset
 * from that corner, the whole set can then safely be carried through a
 * further wheel() or translate() together with the rest of the column and
 * remain correctly posted -- see marchInColumn.js, changeDirection.js,
 * haltColumn.js and formIntoLine.js.
 *
 * Caution: if a caller needs the TRUE ground position of a platoon's file-1
 * corner for use as a wheel() pivot (e.g. a right wheel pivoting on file 1),
 * it must read that position from the RAW column, not from the output of
 * this function -- of-cpt's position here is the overridden chief position,
 * not the corner.
 */
import { rotatePoint } from './formations.js';
import { SCALE } from '../data/constants.js';

// Distance from a platoon's file-1 (or file-11) front-rank corner to the
// centre of its 10-file front (files 1-10 or 11-20): 4.5 file intervals.
const HALF_SPREAD = 4.5 * SCALE.FILE_INTERVAL;

// Chief of platoon stands 2 paces before the centre (¶177, ¶189).
const TWO_PACES = 2 * SCALE.PACE_PX;

// Guide stands one file interval beyond the marching flank: the flank itself
// is 9 file intervals from the file-1/file-11 corner (file 10 or file 20),
// plus one more file interval to clear it (¶191, ¶168).
const GUIDE_BEYOND_FLANK = 9 * SCALE.FILE_INTERVAL + SCALE.FILE_INTERVAL;

/**
 * Position 2 paces in front of a platoon's centre, given the platoon's
 * file-1 (or file-11) front-rank corner position (with its current facing).
 */
function chiefOffset(cornerPos) {
  const r = rotatePoint(-HALF_SPREAD, -TWO_PACES, 0, 0, cornerPos.facing);
  return { x: cornerPos.x + r.x, y: cornerPos.y + r.y, facing: cornerPos.facing };
}

/**
 * Position one file interval beyond the guide-left marching flank, level
 * with the front rank, given the platoon's file-1 (or file-11) corner.
 */
function guideOffset(cornerPos) {
  const r = rotatePoint(-GUIDE_BEYOND_FLANK, 0, 0, 0, cornerPos.facing);
  return { x: cornerPos.x + r.x, y: cornerPos.y + r.y, facing: cornerPos.facing };
}

/**
 * Re-post the four chiefs/guides onto the Article-I end-state geometry.
 *
 * @param {Array<{id,x,y,facing}>} basePositions - RAW columnOfPlatoons() output
 *   (of-cpt and fr-11 must still be at their true file-1/file-11 corners).
 * @returns {Array<{id,x,y,facing}>} positions with of-cpt/fc-1lt/nc-cov/fc-2sg overridden.
 */
export function postColumnChiefsAndGuides(basePositions) {
  const posMap = Object.fromEntries(basePositions.map((p) => [p.id, p]));
  const p1Corner = posMap['of-cpt']; // platoon 1's file-1 front-rank corner
  const p2Corner = posMap['fr-11']; // platoon 2's file-1-equivalent (file 11) corner
  if (!p1Corner || !p2Corner) return basePositions;

  return basePositions.map((s) => {
    switch (s.id) {
      case 'of-cpt':
        return { id: s.id, ...chiefOffset(p1Corner) };
      case 'fc-1lt':
        return { id: s.id, ...chiefOffset(p2Corner) };
      case 'nc-cov':
        return { id: s.id, ...guideOffset(p1Corner) };
      case 'fc-2sg':
        return { id: s.id, ...guideOffset(p2Corner) };
      default:
        return s;
    }
  });
}
