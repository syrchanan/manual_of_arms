import { columnOfPlatoons, wheel, translate, lineOfBattle, rotatePoint } from '../../../engine/formations.js';
import { postColumnChiefsAndGuides } from '../../../engine/columnPosts.js';
import { SCALE } from '../../constants.js';

const { PACE_PX, FILE_INTERVAL } = SCALE;

// Column starts marching WEST (facing 270). Casey fixes only the RELATIVE
// turn (right) and flank (right), never a compass heading, so the absolute
// starting heading is a free choice; picking west means the right turn
// (270 + 90 = 0) leaves the finished line facing north -- the same
// orientation used by every other completed line-of-battle drill in this
// project (file 1 ends up at the larger x, per the codebase convention).
const ORIGIN_X = 780;
const ORIGIN_Y = 250;
const INITIAL_FACING = 270;

// ¶355: "the guide of each platoon, after having turned to the right, may
// have, at least, ten paces to take before arriving upon that line."
const MARCH_TO_LINE = 10 * PACE_PX;

/**
 * Position one file interval beyond a platoon's file-1 (or file-11) corner,
 * on the corner's OWN (right) side rather than the marching-flank side that
 * columnPosts.js's guideOffset() uses. Mirrors that helper's geometry (same
 * "beyond the flank, level with the front rank" idea) but for ¶353's
 * "guide of each platoon will shift quickly to its right flank."
 */
function guideRightOffset(cornerPos) {
  const r = rotatePoint(FILE_INTERVAL, 0, 0, 0, cornerPos.facing);
  return { x: cornerPos.x + r.x, y: cornerPos.y + r.y, facing: cornerPos.facing };
}

/**
 * Re-post the two platoon guides (nc-cov, fc-2sg) from their marching
 * (left-flank) posts onto the right flank (¶353). The chiefs of platoon
 * (of-cpt, fc-1lt) are unaffected -- ¶353 only moves the guides; the chiefs
 * keep the "2 paces before centre" post given by postColumnChiefsAndGuides.
 *
 * @param {Array} rawColumn - RAW columnOfPlatoons() output (of-cpt / fr-11
 *   must still be at the true file-1 / file-11 corners -- see columnPosts.js).
 */
function postGuidesRight(rawColumn) {
  const posted = postColumnChiefsAndGuides(rawColumn);
  const posMap = Object.fromEntries(rawColumn.map((p) => [p.id, p]));
  const p1Corner = posMap['of-cpt'];
  const p2Corner = posMap['fr-11'];
  return posted.map((s) => {
    if (s.id === 'nc-cov') return { id: s.id, ...guideRightOffset(p1Corner) };
    if (s.id === 'fc-2sg') return { id: s.id, ...guideRightOffset(p2Corner) };
    return s;
  });
}

export default {
  id: 'form-on-right-left',
  title: 'Being in Column by Platoon, to Form on the Right (or Left) into Line of Battle',
  lesson: 6,
  article: 5,
  caseyParagraphs: [352, 353, 354, 355, 356, 357, 358, 359, 360, 361, 362, 363, 364, 365, 366],
  commands: [
    { text: '1. On the right into line.', type: 'preparatory' },
    { text: '2. Guide right.', type: 'execution' },
    { text: '1. Right turn.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
    { text: '1. Platoon.', type: 'preparatory' },
    { text: '2. HALT.', type: 'execution' },
    { text: 'Right—DRESS.', type: 'execution' },
    { text: 'FRONT.', type: 'execution' },
    { text: 'Guides—POSTS.', type: 'execution' },
  ],
  reenactorNotes:
    'The column (right in front) is marching when the captain commands "On the right into line. Guide right." (¶352). At the second command the guide of EACH platoon shifts to its right flank and the column continues to march straight forward (¶353) -- this is not yet the turn. The point where the right of the company is to rest is fixed on the chosen line of direction (¶354), and the line is chosen so each platoon\'s guide has at least ten paces to cover after turning (¶355). ' +
    'When the head of the column is nearly opposite him, the chief of the 1st platoon commands "Right turn -- MARCH" (¶356-357). This "turn" (S. S. No. 415, the same citation used for the change-of-direction "turn" in Lesson V, ¶229) is modeled here exactly as changeDirection.js models that maneuver: a rigid rotation of the whole platoon about the corner where its guide now stands, rather than a wheel about a stationary pivot man -- the most defensible reading available without S.S. Vol. I\'s full turning-mechanics text, and consistent with how this codebase already treats the identical citation. The platoon marches forward on the new (perpendicular) heading and halts when its marching flank is three paces from the line (¶358); its guide then springs onto the line itself, opposite one of the three files nearest that flank, and the chief -- having gone to the point where the right of the company rests -- commands Right-DRESS (¶358-359). ' +
    'The 2nd platoon does not turn yet: it continues straight forward until its guide is level with the LEFT file of the 1st platoon (file 10) -- i.e., level with where the 1st platoon\'s far flank ends up once formed on the line, not merely closing the ordinary column distance (¶360). Only then does its chief command its own "Right turn -- MARCH," directing the guide onto the line beside the 1st platoon\'s left file (¶360-361); the chief of the 2nd platoon commands Right-DRESS and immediately resumes his file-closer post (¶362-363). The captain then commands FRONT (¶363), and commands "Guides -- POSTS," at which the covering sergeant resumes covering the captain and the left guide (2nd sergeant) resumes his file-closer post (¶364-365). ' +
    'Because the final dressed line is geometrically identical whether captured at Right-DRESS, FRONT, or Guides-POSTS (lineOfBattle() already seats every soldier, guides included, at their normal covered posts), the last three keyframes share one computed position set -- the same simplification lesson-v/formIntoLine.js uses for its own final three commands. ' +
    'A column left in front forms on the LEFT into line by the same principles and inverse means (¶366): the 2nd platoon (now leading) turns and forms first, on a marked point d\'appui at the left of the line, while the 1st platoon (now trailing) continues on and forms to its right; the captain, rather than a platoon chief, aligns the trailing (1st) platoon before commanding FRONT. That mirror-image case is not built here, per the drill\'s scope.',

  buildKeyframes: (company) => {
    const rawColumn = columnOfPlatoons(company, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: INITIAL_FACING,
    });
    const columnGuideLeft = postColumnChiefsAndGuides(rawColumn);
    const columnGuideRight = postGuidesRight(rawColumn);

    const p1Ids = new Set(company.filter((s) => s.platoon === 1).map((s) => s.id));
    const p2Ids = new Set(company.filter((s) => s.platoon === 2).map((s) => s.id));

    // 1st platoon's turning point: the true (raw, un-offset) file-1 corner --
    // this is where its guide now stands beside it (¶353, ¶356-357).
    const p1Corner = rawColumn.find((s) => s.id === 'of-cpt');
    const p1PivotX = p1Corner.x;
    const p1PivotY = p1Corner.y;

    // The finished line: 1st platoon's right (file 1) is the fixed point
    // d'appui fixed on the chosen line of direction (¶354); the company faces its new
    // front once both platoons have turned and marched up (¶356-363).
    const finalLine = lineOfBattle(company, {
      originX: p1PivotX,
      originY: p1PivotY - MARCH_TO_LINE,
      facing: 0,
    });

    // 2nd platoon's turning point (¶360): read directly off the finished
    // line's file-11 position (not hand-computed), so it lands exactly
    // "opposite the left file of the first" with proper file spacing --
    // this is the ground point its guide must reach, still at the marching
    // level (before its own turn), directly abreast of where file 10 ends
    // up once the 1st platoon has formed.
    const p2Corner = rawColumn.find((s) => s.id === 'fr-11');
    const finalFile11 = finalLine.find((s) => s.id === 'fr-11');
    const p2PivotX = finalFile11.x;
    const p2PivotY = p1PivotY;
    const p2AdvanceDx = p2PivotX - p2Corner.x;

    const p1GuideRight = columnGuideRight.filter((s) => p1Ids.has(s.id));
    const p2GuideRight = columnGuideRight.filter((s) => p2Ids.has(s.id));

    // 1st platoon: turn right (¶357), then march to the line and halt (¶358).
    const p1Turned = wheel(p1GuideRight, { pivotX: p1PivotX, pivotY: p1PivotY, angleDeg: 90 });
    const p1OnLine = translate(p1Turned, { dx: 0, dy: -MARCH_TO_LINE });

    // 2nd platoon: continues straight on to its own turning point (¶360),
    // still facing the original march heading -- no turn yet.
    const p2AtTurnPoint = translate(p2GuideRight, { dx: p2AdvanceDx, dy: 0 });

    // 2nd platoon: turns right at that point (¶360-361), marches to the line.
    const p2Turned = wheel(p2AtTurnPoint, { pivotX: p2PivotX, pivotY: p2PivotY, angleDeg: 90 });
    const p2OnLine = translate(p2Turned, { dx: 0, dy: -MARCH_TO_LINE });

    return [
      {
        label: 'Column of platoons, right in front, marching; guide left',
        description:
          'The column marches with the guide of each platoon on its left (marching) flank, as in the ordinary march in column.',
        caseyRef: '¶352',
        duration: 0,
        positions: columnGuideLeft,
        annotations: ['platoonDistance', 'guideLeft', 'marchArrow'],
      },
      {
        label: 'On the right into line — Guide right',
        description:
          'The captain commands "On the right into line. Guide right." At the second command the guide of each platoon shifts quickly to its right flank; the men touch elbows to the right, and the column continues to march straight forward (¶352-353).',
        caseyRef: '¶352-353',
        duration: 1200,
        positions: columnGuideRight,
        annotations: ['guideRight', 'marchArrow'],
      },
      {
        label: 'Right turn — MARCH (1st platoon); 2nd platoon continues on',
        description:
          'The chief of the 1st platoon commands "Right turn — MARCH" as the head of the column draws opposite the point where the right is to rest. The 1st platoon turns and marches to the line, halting there (¶356-358), while the 2nd platoon continues straight forward, still facing the old front, until level with the 1st platoon\'s left file (¶360).',
        caseyRef: '¶354-360',
        duration: 1800,
        positions: [...p1OnLine, ...p2AtTurnPoint],
        annotations: ['wheelingPoint', 'wheelingArc'],
      },
      {
        label: 'Right turn — MARCH (2nd platoon)',
        description:
          'The chief of the 2nd platoon commands its own "Right turn — MARCH." The platoon turns and marches to the line, its guide directing himself onto the line beside the 1st platoon\'s left file (¶360-361).',
        caseyRef: '¶360-361',
        duration: 1500,
        positions: [...p1OnLine, ...p2OnLine],
        annotations: ['wheelingPoint', 'wheelingArc'],
      },
      {
        label: 'Right—DRESS',
        description:
          'Both guides having sprung onto the line, each chief of platoon commands Right-DRESS; the 2nd platoon dresses up on the alignment of the 1st, and the chief of the 2nd platoon resumes his post as a file closer (¶358-359, ¶362-363).',
        caseyRef: '¶358-359, ¶362-363',
        duration: 1000,
        positions: finalLine,
        annotations: ['alignmentLine'],
      },
      {
        label: 'FRONT',
        description: 'The company being aligned, the captain commands FRONT (¶363).',
        caseyRef: '¶363',
        duration: 800,
        positions: finalLine,
        annotations: [],
      },
      {
        label: 'Guides—POSTS',
        description:
          'The captain commands "Guides — POSTS": the covering sergeant covers the captain, and the left guide (2nd sergeant) returns to his place as a file closer (¶364-365).',
        caseyRef: '¶364-365',
        duration: 800,
        positions: finalLine,
        annotations: [],
      },
    ];
  },
};
