import { columnOfCompanies, alternatingPivotWheel } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION, SCALE } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Third, Article X (S.B. ¶422-436): "Countermarch of a column at full
// or half distance / closed in mass."
//
// Two genuinely different mechanics under one heading:
//
//   'full-half-distance' (¶422-423) -- Casey gives NO new description here:
//   the column countermarches "by the means indicated, school of the
//   company" -- i.e. the exact mechanic already built and audited for
//   Lesson VI (src/data/drills/lesson-vi/countermarch.js), just generalized
//   from 2 platoons (or 20 files) to N companies. There, one file (file 1)
//   wheels around a fixed standing right guide and marches the length of
//   the line to fall in behind the standing left guide, each following file
//   repeating the same ground path in succession; lineOfBattle's own
//   file-from-the-right numbering, recomputed at facing+180, automatically
//   reproduces the reversal with no separate "swap" logic. This drill
//   applies that identical pattern one granularity level up: each COMPANY
//   plays the role a FILE played at company scale, wheeling in succession
//   around a fixed pivot at the head of the column and falling in toward
//   the tail, and columnOfCompanies() at the reversed facing (with the
//   company array in ORIGINAL order, not reversed) reproduces the
//   front-to-rear reversal the same automatic way.
//
//   'closed-in-mass' (¶424-436) -- explicitly new mechanics (¶424 heading
//   note): the column does NOT reverse as one rigid unit and is NOT a
//   sequential relay. Every division countermarches independently and
//   SIMULTANEOUSLY: odd divisions face right and even divisions face left
//   at once (¶426-427); each chief breaks two files to the rear on his own
//   side to clear wheeling room (¶427); at MARCH every division performs
//   its own small in-place file-wheel -- odd divisions left/CCW around
//   their own right guide, even divisions right/CW around their own left
//   guide (¶428) -- arriving behind its OPPOSITE guide. Because every
//   soldier's facing individually flips 180 degrees in this wheel, "which
//   division is leading" flips too WITHOUT the divisions needing to swap
//   ground positions relative to each other -- exactly the same insight
//   that makes the full/half-distance variant's reuse of lineOfBattle's
//   facing-reversal trick work. The alternatingPivotWheel() engine
//   primitive (battalionFormations.js) implements this per-division
//   180-degree pivot; this drill supplies the "break two files to the rear"
//   prep step and the align/FRONT cleanup around it, per ¶427/429-430.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 200;
const ORIGIN_Y = 220;
const OLD_FACING = 0; // marching north
const PACE = SCALE.PACE_PX;

function idsOfCompany(co) {
  return co.soldiers.map((s) => s.id);
}
function idsOfDivision(div) {
  return div.companies.flatMap(idsOfCompany);
}
function groupDivisions(battalion) {
  const divisions = [];
  for (let i = 0; i < battalion.length; i += 2) {
    divisions.push({ companies: [battalion[i], battalion[i + 1]] });
  }
  return divisions;
}

function captainPos(positions, companyIndex) {
  return positions.find((p) => p.id === `c${companyIndex}-of-cpt`);
}

/** Substitute the leading `arrivedCount` companies' (or divisions') worth of
 * positions with their arrived (final) counterparts; the rest stay `waiting`. */
function cascadeSnapshot(waiting, arrivedMap, units, arrivedCount, idsOf) {
  const arrivedIds = new Set(units.slice(0, arrivedCount).flatMap(idsOf));
  return waiting.map((p) => (arrivedIds.has(p.id) ? arrivedMap.get(p.id) ?? p : p));
}

/** Per S.B. ¶427: the two files nearest each division's OWN pivot-flank
 * break to the rear before the wheel, to clear wheeling room. `pivotSide`
 * 'right' -> break files 1-2 of the division's own right (first) company;
 * 'left' -> break files 19-20 of the division's own left (second) company. */
function extremeFileIds(division, pivotSide) {
  const targetCo = pivotSide === 'right' ? division.companies[0] : division.companies[1];
  const targetFiles = pivotSide === 'right' ? [1, 2] : [19, 20];
  return targetCo.soldiers
    .filter((s) => targetFiles.includes(s.file) && s.rank !== 'fileCloser')
    .map((s) => s.id);
}

/** Shift the given soldier ids backward along `facingDeg`'s own "behind"
 * axis by `depthPx` -- the visual stand-in for ¶427's "break two files to
 * the rear," applied per soldier using that soldier's OWN current facing
 * (each division already faces its own alternating direction at this point). */
function breakFilesToRear(positions, idsToBreak, depthPx) {
  const breakSet = new Set(idsToBreak);
  return positions.map((s) => {
    if (!breakSet.has(s.id)) return s;
    const rad = (s.facing * Math.PI) / 180;
    const behindX = -Math.sin(rad);
    const behindY = Math.cos(rad);
    return { ...s, x: s.x + behindX * depthPx, y: s.y + behindY * depthPx };
  });
}

const ALL_PARAGRAPHS = Array.from({ length: 436 - 422 + 1 }, (_, i) => 422 + i);

export default {
  id: 'countermarch',
  title: 'Countermarch of a Column at Full or Half Distance / Closed in Mass',
  part: 3,
  article: 10,
  caseyParagraphs: ALL_PARAGRAPHS,
  subMovements: [
    { id: 'full-half-distance', label: 'At Full or Half Distance' },
    { id: 'closed-in-mass', label: 'Closed in Mass' },
  ],

  commands: (subMovement) => {
    if (subMovement === 'closed-in-mass') {
      return [
        { text: '1. Countermarch.', type: 'preparatory' },
        { text: '2. Battalion, right and left--FACE.', type: 'execution' },
        { text: '3. By file left and right.', type: 'preparatory' },
        { text: '4. MARCH (or double quick--MARCH).', type: 'execution' },
      ];
    }
    return [
      { text: '1. Countermarch.', type: 'preparatory' },
      { text: '2. Battalion right (or left)--FACE.', type: 'execution' },
      { text: '3. By file left (or right).', type: 'preparatory' },
      { text: '4. MARCH (or double quick--MARCH).', type: 'execution' },
    ];
  },

  reenactorNotes:
    'At full or half distance (¶422-423) this movement is executed "by the means indicated, school of the company" -- Casey gives no new description because it is not a new mechanic, only the already-built company-scale countermarch (one file wheeling in succession around a fixed standing guide, falling in toward the far end of the line) generalized so that each COMPANY, instead of each file, plays that role: the head-of-column company wheels first around a fixed pivot and each following company follows the same ground path, falling in progressively toward what becomes the new head of the reversed column. The countermarch always occurs from a halt (¶435). ' +
    'Closed in mass (¶424-436) is a genuinely different, simultaneous mechanic. At the first command, chiefs of odd-numbered divisions caution a right face and chiefs of even-numbered divisions a left face; at the second command both happen AT ONCE, opposite directions, within the same column, and the right and left guides of every division face about (¶426-427). Each chief of an odd division hastens to his own right and causes two files to break to the rear, posting on the left of his leading front-rank man; each chief of an even division does the mirror on his own left (¶427) -- clearing the wheeling room a near-zero mass gap would not otherwise allow. At MARCH every division wheels by file independently and simultaneously: odd divisions to the left around their own right guide, even divisions to the right around their own left guide (¶428), each arriving behind its OPPOSITE guide -- built here with the alternatingPivotWheel() engine primitive, which rotates each division 180 degrees about the extreme file on its own pivot-side flank. Because every soldier\'s facing flips together, the division that was rearmost is now leading WITHOUT the divisions needing to swap ground positions -- "leading" is a function of facing, not of absolute depth, the same insight the full/half-distance variant already relies on. Once fronted, each division aligns by the right (chiefs of even divisions moving rapidly to the right of their own division to conduct it), then FRONT is commanded and the guides shift back to their habitual flanks (¶429-430). ¶434 confirms the identical mechanic for a column by COMPANY, not just by division, closed in mass ("applying to companies what is prescribed for divisions") -- not separately staged here. Left-in-front columns align by the left instead (¶431) -- also not separately staged.',

  buildKeyframes: (_company, subMovement = 'full-half-distance', battalion = DEFAULT_BATTALION) => {
    if (subMovement === 'closed-in-mass') {
      const divisions = groupDivisions(battalion);

      const massHalted = columnOfCompanies(divisions, {
        originX: ORIGIN_X,
        originY: ORIGIN_Y,
        facing: OLD_FACING,
        distanceMode: 'mass',
      });

      // ¶426-427: odd divisions (1st, 3rd -- 0-based index 0, 2) face right;
      // even divisions (2nd, 4th -- 0-based index 1, 3) face left.
      const subdivisions = divisions.map((div, i) => ({
        ids: idsOfDivision(div),
        pivotSide: i % 2 === 0 ? 'right' : 'left',
      }));
      const facingByDivision = new Map(
        divisions.map((div, i) => [i, i % 2 === 0 ? (OLD_FACING + 90) % 360 : (OLD_FACING - 90 + 360) % 360])
      );
      const idToDivisionIndex = new Map();
      divisions.forEach((div, i) => idsOfDivision(div).forEach((id) => idToDivisionIndex.set(id, i)));

      const faced = massHalted.map((s) => ({ ...s, facing: facingByDivision.get(idToDivisionIndex.get(s.id)) }));

      // ¶427: two files break to the rear on each division's own pivot side.
      const breakIds = subdivisions.flatMap((sub, i) => extremeFileIds(divisions[i], sub.pivotSide));
      const broken = breakFilesToRear(faced, breakIds, 2 * SCALE.RANK_GAP);

      // ¶428: MARCH -- each division wheels by file, independently and
      // simultaneously, about its own pivot. A midpoint (90 degree) snapshot
      // shows the wheel in progress (using the "broken" positions, so the
      // opened-up files are visibly part of the turning motion); the
      // completed wheel is computed fresh from the un-broken `faced`
      // positions, since by ¶429 the broken files have closed back onto the
      // line as part of the dress -- not left permanently offset.
      //
      // Note the wheel is 180 degrees measured from each division's ALREADY
      // -flanked facing (odd = OLD+90, even = OLD-90), so `wheeledClean`
      // lands each division facing the OPPOSITE flank from where it started
      // (odd -> OLD-90, even -> OLD+90) -- this is correct: a division that
      // has faced a flank and then performed a 180-degree file-wheel is now
      // filing the other way along the same flank-facing axis, not yet
      // squared up with the column's actual line of march. ¶429-430's
      // separate align-by-the-right-then-FRONT sequence is what reorients
      // every soldier to the true reversed marching facing (OLD_FACING+180)
      // -- modeled below as `fronted`, distinct from the raw wheel result.
      const wheelingMidpoint = alternatingPivotWheel(broken, subdivisions, { angleDeg: 90 });
      const wheeledClean = alternatingPivotWheel(faced, subdivisions, { angleDeg: 180 });
      const newFacing = (OLD_FACING + 180) % 360;
      const fronted = wheeledClean.map((s) => ({ ...s, facing: newFacing }));

      return [
        {
          label: 'Column by division closed in mass, halted',
          description: 'The battalion stands halted, in column by division closed in mass, right in front, facing the original line of march.',
          caseyRef: '¶424-425, ¶435',
          duration: 0,
          positions: massHalted,
          annotations: [],
        },
        {
          label: 'Countermarch -- Battalion, right and left--FACE',
          description: 'Odd-numbered divisions face to the right; even-numbered divisions face to the left, at once. The right and left guides of every division face about.',
          caseyRef: '¶426-427',
          duration: 1200,
          positions: faced,
          annotations: [],
        },
        {
          label: 'Two files break to the rear',
          description: 'Each chief of an odd division hastens to his own right and causes two files to break to the rear, posting on the left of his leading front-rank man; each chief of an even division does the same on his own left -- clearing room for the wheel.',
          caseyRef: '¶427',
          duration: 1200,
          positions: broken,
          annotations: [],
        },
        {
          label: 'By file left and right -- MARCH: every division wheels',
          description: 'Every division wheels by file, independently and simultaneously: odd divisions to the left around their own right guide, even divisions to the right around their own left guide.',
          caseyRef: '¶428',
          duration: 1800,
          positions: wheelingMidpoint,
          annotations: [],
        },
        {
          label: 'Divisions halt and align by the right',
          description: 'Each division, having arrived behind its opposite guide, halts. It aligns by the right, chiefs of even divisions moving rapidly to the right of their own division to conduct it.',
          caseyRef: '¶428-429',
          duration: 1500,
          positions: wheeledClean,
          annotations: ['alignmentLine'],
        },
        {
          label: 'FRONT -- guides to their proper places',
          description: 'Each chief commands FRONT; every soldier squares to the reversed line of march and the guides shift back to their habitual flanks. The column now stands reversed: the division that was rearmost now leads, closed in mass, facing the opposite direction.',
          caseyRef: '¶430',
          duration: 1200,
          positions: fronted,
          annotations: [],
        },
      ];
    }

    // --- full-half-distance (¶422-423) ---
    const companies = battalion;
    const newFacing = (OLD_FACING + 180) % 360;

    const startColumn = columnOfCompanies(companies, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: OLD_FACING,
      distanceMode: 'full',
    });

    // Battalion right--FACE: every soldier faces right in place (¶344's
    // company-scale precedent, generalized here to the whole column at once,
    // since at battalion scale the "guide stands fast" nuance is modeled at
    // the company-block level below, not per individual soldier).
    const rightFaced = startColumn.map((s) => ({ ...s, facing: (OLD_FACING + 90) % 360 }));

    // Fixed pivot: the head of the column (company 1's own position) is the
    // ground point every company in succession wheels around, exactly as
    // the company-scale mechanic's right guide stood fast at the head of
    // the line (lesson-vi/countermarch.js).
    const pivot = captainPos(startColumn, companies[0].index);
    const tailAnchor = captainPos(startColumn, companies[companies.length - 1].index);

    // File 1's (here, company 1's) new ground point: "behind, and two paces
    // from the left guide" (S.C. ¶345) -- at battalion scale, two paces
    // beyond the column's own tail, on the same line. companies are passed
    // in ORIGINAL order (not reversed): lineOfBattle/columnOfCompanies's own
    // numbering convention, recomputed at facing+180, reproduces the
    // front-to-rear reversal automatically, the same trick already used at
    // company scale.
    const newOriginX = tailAnchor.x;
    const newOriginY = tailAnchor.y + 2 * PACE;
    const finalColumn = columnOfCompanies(companies, {
      originX: newOriginX,
      originY: newOriginY,
      facing: newFacing,
      distanceMode: 'full',
    });
    const finalMap = new Map(finalColumn.map((p) => [p.id, p]));

    // Cascade order: the company closest to the fixed pivot (company 1)
    // completes its short wheel first, exactly as file 1 arrived first at
    // company scale; the rearmost company, which must travel the whole
    // length of the column, arrives last.
    const snap2 = cascadeSnapshot(rightFaced, finalMap, companies, 2, idsOfCompany);
    const snap4 = cascadeSnapshot(rightFaced, finalMap, companies, 4, idsOfCompany);
    const snap6 = cascadeSnapshot(rightFaced, finalMap, companies, 6, idsOfCompany);

    return [
      {
        label: 'Column at full distance, halted',
        description: 'The battalion stands halted, in column of companies at full distance, facing the original line of march.',
        caseyRef: '¶435',
        duration: 0,
        positions: startColumn,
        annotations: [],
      },
      {
        label: 'Countermarch -- Battalion, right--FACE',
        description: 'The whole column faces to the right in place, by the same means already established at company scale (School of the Company).',
        caseyRef: '¶422',
        duration: 1200,
        positions: rightFaced,
        annotations: [],
      },
      {
        label: 'By file, left -- MARCH: the head of column wheels',
        description: 'The leading company, nearest the fixed pivot, wheels first and directs its march the length of the column, toward the tail.',
        caseyRef: '¶422',
        duration: 1500,
        positions: snap2,
        annotations: [{ type: 'wheelingPoint', pivotX: pivot.x, pivotY: pivot.y }],
      },
      {
        label: 'Each company wheels in succession',
        description: 'Each company in turn comes to wheel on the same ground the leading company already crossed, falling in toward what becomes the new head of the reversed column.',
        caseyRef: '¶422',
        duration: 1800,
        positions: snap4,
        annotations: [{ type: 'wheelingPoint', pivotX: pivot.x, pivotY: pivot.y }],
      },
      {
        label: 'Most of the column has countermarched',
        description: 'The greater part of the column now stands reversed; the rearmost companies, having the whole column\'s length to cross, are still arriving.',
        caseyRef: '¶422, ¶435',
        duration: 1800,
        positions: snap6,
        annotations: [{ type: 'wheelingPoint', pivotX: pivot.x, pivotY: pivot.y }],
      },
      {
        label: 'Column reversed',
        description: 'The countermarch is complete: the same column, halted, faces the opposite direction, its order of companies reversed front to back -- the company that was rearmost now leads.',
        caseyRef: '¶422, ¶435',
        duration: 1500,
        positions: finalColumn,
        annotations: [],
      },
    ];
  },
};
