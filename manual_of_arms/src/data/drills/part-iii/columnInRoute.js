import { columnOfCompanies } from '../../../engine/battalionFormations.js';
import { columnOfPlatoons } from '../../../engine/formations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION, SCALE } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Third, Article II (S.B. ¶239-272): "Column in route."
//
// INTERPRETIVE CHOICE (see battalion-spec/part-third-a.md's own Complexity
// note on this article): the source describes a *continuum* of column-width
// responses to a narrowing road or defile -- company front -> platoon front
// -> (break a few files to the rear) -> section front (if platoons have >=12
// files) -> break files to the rear (if <12) -> march by the flank once
// narrower than six files abreast (¶242-248) -- driven by terrain, not a
// single fixed choreography with one correct start/end state. A company's
// own platoons here are 10 files each (<12), so the ">=12 files" section
// threshold in ¶244-245 does not literally apply to this battalion's roster;
// the further narrowing described at ¶246 ("break 1-2 files to the rear...
// as long as six files can march abreast") and the sub-six-abreast
// flank-march case (¶248) are process description, not one drill's worth of
// fixed geometry.
//
// This drill therefore models the two clearest, best-attested states from
// the text -- full company front (¶239, ¶241, the "habitual" formation) and
// platoon front (¶242, the first and most common narrowing step, directly
// reusing the existing company-scale columnOfPlatoons()) -- plus the
// re-forming step back to company front as the defile clears (¶249-253).
// Every company narrows/reforms together (per ¶254: trailing subdivisions
// don't navigate independently, each retraces the one ahead), which is
// modeled by applying the same platoon-column geometry to all 8 companies
// uniformly. Section-front and single-file states are documented in
// reenactorNotes but not separately animated, consistent with the spec's own
// recommendation that this article is better treated as a lower-priority
// reference entry than a discrete fixed drill.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 200;
const ORIGIN_Y = 220;
const FACING = 90; // marching east; column depth extends toward -x (west/rear)
const PLATOON_SPACING = 10 * SCALE.FILE_INTERVAL; // platoon front, S.C. convention
const NARROW_GAP = 20; // px clearance between each company's own 2-platoon column

function behindAxis(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return { x: -Math.sin(rad), y: Math.cos(rad) };
}

/** Every company narrowed to its own 2-platoon column (platoon front, double
 * depth), companies stacked one behind another in the same "behind axis"
 * convention columnOfCompanies() uses, but at platoon-front width instead of
 * full company-front width (¶242). */
function narrowedRouteColumn(battalion, { originX, originY, facing }) {
  const { x: bx, y: by } = behindAxis(facing);
  const unitDepth = 2 * PLATOON_SPACING + NARROW_GAP;
  const positions = [];
  battalion.forEach((co, i) => {
    const depthOffset = i * unitDepth;
    positions.push(...columnOfPlatoons(co.soldiers, {
      originX: originX + bx * depthOffset,
      originY: originY + by * depthOffset,
      facing,
      platoonSpacing: PLATOON_SPACING,
    }));
  });
  return positions;
}

export default {
  id: 'column-in-route',
  title: 'Column in Route',
  part: 3,
  article: 2,
  caseyParagraphs: [239, 241, 242, 249, 250, 254, 260, 261],

  commands: [
    { text: '1. By section (or by platoon) into line.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],

  reenactorNotes:
    "A route column is habitually formed by company (¶241), and should never be deeper than the front it occupied in line of battle minus one subdivision's front (¶239). As the road or defile narrows, each captain narrows his own company in succession without waiting for a battalion-wide command: company front (20 files) to platoon front (10 files, ¶242); if very short, a few files simply break to the rear instead (¶243); to section front if the platoons have twelve or more files (¶244-245, not the case for this battalion's 10-file platoons); otherwise 1-2 files break to the rear, continuing as long as six files can still march abreast (¶246); narrower than that, subdivisions march successively by the flank (¶248, S.C. Nos. 319-320). As the way widens again, each captain re-forms his own company by his own command once it clears the defile (¶249): 'By section (or by platoon) into line. MARCH' (¶250) once six files can march abreast, with more files entering line as width allows (¶251-253). The leading subdivision follows the defile's actual windings; every trailing subdivision does not navigate independently -- it simply retraces the path of the one ahead (¶254). This animation shows the two best-attested states (company front and platoon front) plus re-forming; it does not model the further section-front or single-file states, which are terrain-driven process description rather than one fixed choreography (see the interpretive note in this file's header comment). Ordinary route pace is 110 paces/minute on good ground (¶261); double-quick is capped at 15 minutes on, 5 minutes ordinary route step off, alternating (¶271), except that marches of two miles or less on good ground hold one constant rate throughout (¶272).",

  buildKeyframes: (_company, _subMovement, battalion = DEFAULT_BATTALION) => {
    const companyFront = columnOfCompanies(battalion, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: FACING,
      distanceMode: 'full',
    });

    const platoonFront = narrowedRouteColumn(battalion, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: FACING,
    });

    return [
      {
        label: 'Column in route, company front',
        description: 'The battalion marches in route step, formed by company -- its habitual formation, no deeper than the front it held in line of battle minus one company\'s front.',
        caseyRef: '¶239, 241',
        duration: 0,
        positions: companyFront,
        annotations: ['marchArrow'],
      },
      {
        label: 'Narrowing to platoon front',
        description: 'As the road narrows, each company in turn breaks into a column of two platoons -- its front reduced by half, its depth doubled -- without waiting for a command from the colonel; every following company retraces the path and formation of the one ahead of it.',
        caseyRef: '¶242, 254',
        duration: 2000,
        positions: platoonFront,
        annotations: ['marchArrow'],
      },
      {
        label: 'Re-forming to company front',
        description: 'By section (or by platoon) into line -- MARCH: as the way widens again, each captain re-forms his own company to its full front by his own command as soon as it has cleared the defile.',
        caseyRef: '¶249-253',
        duration: 2000,
        positions: companyFront,
        annotations: ['marchArrow'],
      },
    ];
  },
};
