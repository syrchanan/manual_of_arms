import { battalionLine, cascadeBlend } from '../../../engine/battalionFormations.js';
import { columnOfFiles } from '../../../engine/formations.js';
import { DEFAULT_BATTALION, FIELD_AND_STAFF, COLOR_PARTY, COLOR_COMPANY_INDEX } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article VIII (S.B. ¶753-787, incl. Remarks ¶785-787): "Passage
// of obstacles, advancing and retreating."
//
// SCOPE CHOICE (documented per task instructions): this is the densest
// article in the Part Fifth range (¶753-784 cover a single-company case, a
// multi-company staggered/cascading case, general gait/wing rules, and a
// color-company special case). The spec's own complexity notes recommend
// building the single-company case (¶753-762, the worked example: "third
// company" breaks off and rejoins behind the "4th") as the core reusable
// primitive, treating the multi-company case (¶763-771) and the color-company
// case (¶782-783) as documented-but-not-separately-animated. This drill
// implements ONLY the single-company case; ¶763-787 are carried in
// reenactorNotes as prose, not modeled.
//
// Geometry approach: the obstructed company (3rd) "plies into column...in
// rear of the next company" (¶753) by facing the flank and marching to the
// rear in double quick -- textually identical to the standard company-scale
// march-by-flank/file-doubling mechanic already implemented as
// columnOfFiles() (S.C. ¶138/S.S. ¶363), reused here unmodified via a small
// id-namespacing wrapper (columnOfFiles() checks for the bare ids 'of-cpt'/
// 'nc-cov'; battalion companies carry namespaced ids like 'c3-of-cpt', so the
// wrapper strips/restores the company prefix around the call). The company's
// continuous motion through the break-off and rejoin (¶755, ¶760-761) is
// rendered as a smooth blend between the "still in line" and "settled in
// column" states via the existing cascadeBlend() primitive (per-group
// progress, already built for Phase B1 deployment cascades) rather than as
// discrete 90-degree pivots -- consistent with how this project already
// treats continuous-motion transitions elsewhere.
// ---------------------------------------------------------------------------

const { PACE_PX, RANK_GAP, FILE_CLOSER_GAP, FILE_INTERVAL } = SCALE;

const OBSTACLE_CO = 3; // "Third company" -- Casey's own worked example, ¶753
const NEIGHBOR_CO = 4; // "in rear of the next company toward the color," ¶753
// Trailing distance behind the neighboring company's line, once formed in
// column: not numerically specified in ¶753-762 ("the prescribed distance,"
// ¶756, without a figure in this paragraph range) -- 14 paces chosen as a
// plausible, clearly-staged interval; an interpretive/staging choice, not a
// sourced figure.
const TRAIL_PACES = 14;

const ORIGIN_X = CANVAS_BATTALION.VIEW_W / 2;
const ORIGIN_Y = 140;

function deg2rad(deg) {
  return (deg * Math.PI) / 180;
}

/** columnOfFiles() (formations.js) hardcodes the bare ids 'of-cpt'/'nc-cov'
 * for the column head; battalion companies carry namespaced ids
 * ('c3-of-cpt'). Strip the company prefix before calling, restore it after,
 * so the existing company-scale primitive is reused unmodified. */
function columnOfFilesForCompany(companyObj, opts) {
  const prefix = `c${companyObj.index}-`;
  const stripped = companyObj.soldiers.map((s) => ({ ...s, id: s.id.slice(prefix.length) }));
  const result = columnOfFiles(stripped, opts);
  return result.map((p) => ({ ...p, id: prefix + p.id }));
}

function colorRankAnchor(positions) {
  const right = positions.find((p) => p.id === `c${COLOR_COMPANY_INDEX}-of-cpt`);
  const left = positions.find((p) => p.id === `c${COLOR_COMPANY_INDEX}-fr-20`);
  return { x: (right.x + left.x) / 2, y: (right.y + left.y) / 2 };
}

function battalionCentre(positions) {
  const right = positions.find((p) => p.id === 'c1-of-cpt');
  const left = positions.find((p) => p.id === `c${DEFAULT_BATTALION.length}-fr-20`);
  return { x: (right.x + left.x) / 2, y: (right.y + left.y) / 2, halfWidth: Math.abs(right.x - left.x) / 2 };
}

/** Color party and field-and-staff shown holding simple habitual (front-rank
 * embedded) posts throughout -- ¶753-762 do not touch their positions (only
 * the color-company special case, ¶782-783, out of this drill's scope,
 * does), so they are rendered as stable markers, not choreographed. */
function colorPartyAt(anchor, facing) {
  return [
    { id: 'color-bearer', x: anchor.x, y: anchor.y, facing },
    { id: 'color-cpl-centre', x: anchor.x, y: anchor.y + 6, facing },
    { id: 'color-cpl-right', x: anchor.x + FILE_INTERVAL, y: anchor.y, facing },
    { id: 'color-cpl-left', x: anchor.x - FILE_INTERVAL, y: anchor.y, facing },
    { id: 'guide-right', x: anchor.x + 3 * FILE_INTERVAL, y: anchor.y, facing },
    { id: 'guide-left', x: anchor.x - 3 * FILE_INTERVAL, y: anchor.y, facing },
  ];
}

function fieldAndStaffAt(centre, facing) {
  const depth = RANK_GAP + FILE_CLOSER_GAP + 4 * PACE_PX;
  return [
    { id: 'fs-col', x: centre.x, y: centre.y + depth, facing },
    { id: 'fs-ltc', x: centre.x + centre.halfWidth * 0.5, y: centre.y - 2 * PACE_PX, facing },
    { id: 'fs-smaj', x: centre.x - centre.halfWidth * 0.5, y: centre.y - 2 * PACE_PX, facing },
    { id: 'fs-jmaj', x: centre.x, y: centre.y - 3 * PACE_PX, facing },
  ];
}

function groupOfId(id) {
  return id.startsWith(`c${OBSTACLE_CO}-`) ? 'obstacleCo' : 'other';
}

export default {
  id: 'passage-of-obstacles',
  title: 'Passage of Obstacles, Advancing and Retreating',
  part: 5,
  article: 8,
  caseyParagraphs: [753, 754, 755, 756, 757, 758, 759, 760, 761, 762, 772, 778, 784],
  subMovements: [
    { id: 'advancing', label: 'Advancing' },
    { id: 'retreating', label: 'Retreating' },
  ],
  commands: [
    { text: 'Third company, obstacle.', type: 'preparatory' },
    { text: '1. Third company, by the left flank, to the rear into column. 2. Double quick. 3. MARCH.', type: 'execution' },
    { text: '1. Third company. 2. By the right flank. 3. MARCH. 4. Guide right.', type: 'execution' },
    { text: '1. Quick time. 2. MARCH.', type: 'execution' },
    { text: 'Third company into line.', type: 'preparatory' },
    { text: '1. Company, by the right flank. 2. Double quick. 3. MARCH.', type: 'execution' },
    { text: '1. By the left flank. 2. MARCH. 3. Guide left.', type: 'execution' },
  ],
  reenactorNotes:
    "Single-company case only (¶753-762), Casey's own worked example: the 3rd company, obstructed, plies into column behind the 4th (\"in rear of the next company toward the color\") and rejoins the line once past. The multi-company case (¶763-771, a staggered cascade of several contiguous companies each timing its break off the one ahead) and the color-company special case (¶782-783, extra senior-major choreography to re-establish the color-bearer's perpendicular once the color-company itself must break off) are documented here but not separately animated, per the source spec's own recommendation to build the single-company primitive first. General rule ¶784: right-wing companies (1-4, this project's numbering-from-the-right) always break by the LEFT flank, left-wing by the right -- inverse means, not modeled as a mirrored drill here since the 3rd company is already right-wing. ¶778: retiring in retreat uses the identical principles as advancing in line -- the 'Advancing'/'Retreating' sub-movements here differ only in the battalion's overall facing and marching-arrow direction (0°/180°); the obstacle mechanic itself, and which flank the company breaks by, do not change. The company's continuous marching motion through the break-off and rejoin is shown as a smooth blend between its in-line and in-column states rather than as discrete pivots. The 'prescribed distance' at which the company settles into column behind its neighbor (¶756) has no numerical figure in this paragraph range; 14 paces is used here as a plausible staged interval, not a sourced one. Color party and field-and-staff hold stable habitual posts throughout -- their movement is not addressed in this article's own paragraphs.",

  buildKeyframes: (_company, subMovement, battalion = DEFAULT_BATTALION) => {
    const facing = subMovement === 'retreating' ? 180 : 0;
    const base = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing });
    const anchor = colorRankAnchor(base);
    const centre = battalionCentre(base);
    const lineState = [...base, ...colorPartyAt(anchor, facing), ...fieldAndStaffAt(centre, facing)];

    const obstacleCo = battalion.find((co) => co.index === OBSTACLE_CO);
    const neighborFront = lineState.find((p) => p.id === `c${NEIGHBOR_CO}-of-cpt`);

    const rad = deg2rad(facing);
    const behindX = -Math.sin(rad);
    const behindY = Math.cos(rad);
    const trailPx = TRAIL_PACES * PACE_PX;
    const colOriginX = neighborFront.x + behindX * trailPx;
    const colOriginY = neighborFront.y + behindY * trailPx;

    const columnPositions = columnOfFilesForCompany(obstacleCo, {
      originX: colOriginX,
      originY: colOriginY,
      facing,
    });
    const columnMap = new Map(columnPositions.map((p) => [p.id, p]));
    const columnState = lineState.map((p) => (groupOfId(p.id) === 'obstacleCo' ? columnMap.get(p.id) ?? p : p));

    const breakingOff = cascadeBlend(lineState, columnState, { obstacleCo: 0.5 }, groupOfId);
    const rejoining = cascadeBlend(columnState, lineState, { obstacleCo: 0.5 }, groupOfId);

    const marchAnn = ['marchArrow'];

    return [
      {
        label: 'Battalion marching in line, obstacle ahead',
        description:
          `The battalion marches ${subMovement === 'retreating' ? 'in retreat' : 'in line, advancing'}; the ground in front of the 3rd company is found impracticable for a company front.`,
        caseyRef: '¶753',
        duration: 0,
        positions: lineState,
        annotations: marchAnn,
      },
      {
        label: 'Third company, obstacle',
        description: 'The colonel designates the obstructed company by name.',
        caseyRef: '¶753',
        duration: 700,
        positions: lineState,
        annotations: [],
      },
      {
        label: 'By the left flank, to the rear into column — double quick, MARCH',
        description:
          'The captain turns his company to its front, then hastens to its left. On MARCH, the company faces by the left flank and the two left files disengage to the rear in double quick; the left guide places himself at the head of the front rank and conducts the column behind the 4th company.',
        caseyRef: '¶754–755',
        duration: 1800,
        positions: breakingOff,
        annotations: marchAnn,
      },
      {
        label: 'Company follows in column behind the next company',
        description:
          'Facing right again to preserve its gait, the company drops to quick time at the prescribed distance and follows in column, in close order, its right guide marching in the trace of the company ahead\'s captain.',
        caseyRef: '¶756–757',
        duration: 1500,
        positions: columnState,
        annotations: marchAnn,
      },
      {
        label: 'Third company into line',
        description: 'The obstacle passed, the colonel orders the company back into line.',
        caseyRef: '¶759',
        duration: 700,
        positions: columnState,
        annotations: [],
      },
      {
        label: 'By the right flank, double quick — rejoining the line',
        description:
          'The captain hastens to the right of his company and halts there; the company, led by its guide, files past him parallel to the line. When the left file is abreast him, by the left flank, MARCH, guide left, and it marches straight for the line of battle.',
        caseyRef: '¶760–761',
        duration: 1800,
        positions: rejoining,
        annotations: marchAnn,
      },
      {
        label: 'Obstacle passed, battalion continues in line',
        description: 'The company retakes its habitual position in line of battle; the battalion continues its march unbroken.',
        caseyRef: '¶762',
        duration: 1200,
        positions: lineState,
        annotations: marchAnn,
      },
    ];
  },
};
