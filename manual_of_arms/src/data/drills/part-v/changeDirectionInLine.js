import { battalionLine } from '../../../engine/battalionFormations.js';
import { wheel } from '../../../engine/formations.js';
import { DEFAULT_BATTALION, FIELD_AND_STAFF, COLOR_PARTY, COLOR_COMPANY_INDEX, NUM_COMPANIES } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article IV (S.B. ¶717-729): "Change of direction in marching
// in line of battle."
//
// Per battalion-spec/part-fifth-a.md: this is a battalion-scale
// generalization of the existing wheel-while-marching mechanic already used
// elsewhere in this project (part-iii/changeDirectionHalf.js), NOT a new
// geometric primitive. The graduated step-length detail Casey describes
// (pivot-side/right-wing troops shorten step to 14-17in, sweep-side/left-wing
// troops lengthen to 28-33in, ¶722-723) is exactly what a rigid rotation
// about a single pivot point already produces visually -- points near the
// pivot barely move, points far from it sweep a wide arc -- so this drill
// applies the engine's existing wheel() to the ENTIRE cast (376 company
// soldiers + color party + field/staff) about a single flank pivot, rather
// than modeling per-soldier variable step length directly.
//
// Pivot choice: ¶719 -- "the right general guide wheels on the right captain
// of the battalion as his pivot" -- gives an explicit, literal pivot point
// for a right change of direction: company 1's captain (c1-of-cpt), the
// battalion's rightmost individual. For a left change of direction (not
// itself detailed by ¶717-729's prose, which only narrates the right case,
// per ¶717's "to the right (or left)" command form), this drill mirrors that
// choice onto the opposite flank: company NUM_COMPANIES's leftmost
// front-rank soldier (file 20).
//
// Wheel angle: Casey gives no fixed target angle -- "it is not necessarily a
// full 90 degree turn... the mechanics describe the wheel process itself,
// not a fixed target angle" (spec). This drill shows a representative 90
// degree change of direction, in three graduated snapshots, purely for a
// legible animation; the underlying wheel() primitive works identically for
// any angle.
// ---------------------------------------------------------------------------

const { PACE_PX, FILE_INTERVAL } = SCALE;

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 80;
const ORIGIN_Y = 260;
const FACING = 0; // marching "north" (up-screen) before the change of direction
const WHEEL_ANGLE = 90; // representative change-of-direction angle, see note above

// Distances used to place the color party / field-and-staff for the
// "marching in line, straight" starting state. Several of these have no
// fixed pace figure in ¶717-729 itself (Casey leaves the color-guard's exact
// marching depth to Article I, ¶648-668, out of this drill's scope) -- where
// no figure is given, this drill reuses Article I's own baseline figures
// (marked "¶653" etc.) or, where truly unspecified, documents the choice as
// interpretive.
const COLOR_RANK_ADVANCE_PACES = 6; // ¶653: color-guard front rank's baseline advance
const CENTRE_CPL_TRACE_PACES = 1; // interpretive: "follows exactly in his trace" (¶662, ¶720)
const SENIOR_MAJ_LEAD_PACES = 4; // interpretive: "before the color-bearer, facing him" (¶718); no fixed figure given for this posture
const LT_COL_LEAD_PACES = 8; // interpretive: "before the battalion" (¶725); no fixed figure given
const COLONEL_REAR_PACES = 30; // ¶670 (Art. I), reused per this article's "same functions" relationship to Art. I
const JUNIOR_MAJ_REAR_PACES = 4; // interpretive filler -- no post is specified for the junior major in ¶717-729
const SENIOR_MAJ_RESUME_PACES = 35; // ¶727: "30-40 paces in front" when direct march resumes

function fwdAxis(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return { x: Math.sin(rad), y: -Math.cos(rad) };
}
function acrossAxis(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}
function addPx(p, axis, px) {
  return { x: p.x + axis.x * px, y: p.y + axis.y * px };
}
function addPaces(p, axis, paces) {
  return addPx(p, axis, paces * PACE_PX);
}
function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

const RIGHT_CAPTAIN_ID = 'c1-of-cpt';
const LEFT_FLANK_ID = `c${NUM_COMPANIES}-fr-20`;
const COLOR_CAPTAIN_ID = `c${COLOR_COMPANY_INDEX}-of-cpt`;
const COLOR_LEFT_ID = `c${COLOR_COMPANY_INDEX}-fr-20`;

/**
 * Build the color party (6) + field-and-staff (4) positions for the
 * "marching in line, straight direction" state, given the 376 company
 * positions already laid out by battalionLine(). Returns 10 { id, x, y,
 * facing } entries -- all of COLOR_PARTY's and FIELD_AND_STAFF's ids.
 *
 * Geometry judgment calls (Casey does not fix exact battalion-scale posts
 * for these individuals within ¶717-729 itself -- see file header):
 *   - guide-left is placed opposite the battalion's leftmost front-rank
 *     file (c{N}-fr-20) rather than literally "the sergeant closing the
 *     left of the battalion" (fc-2sg, a file closer set back from the
 *     line) -- using the front-rank flank keeps guide-left visually abreast
 *     of the color-rank at the same depth as guide-right, matching ¶661's
 *     "abreast" requirement more legibly than reproducing fc-2sg's exact
 *     file-closer depth would.
 */
function partyAndStaffMarching(companyPositions, facing) {
  const byId = new Map(companyPositions.map((p) => [p.id, p]));
  const fwd = fwdAxis(facing);
  const across = acrossAxis(facing);

  const rightCaptain = byId.get(RIGHT_CAPTAIN_ID);
  const leftFlank = byId.get(LEFT_FLANK_ID);
  const colorCaptain = byId.get(COLOR_CAPTAIN_ID);
  const colorLeft = byId.get(COLOR_LEFT_ID);

  const colorCenter = midpoint(colorCaptain, colorLeft);
  const battalionCenter = midpoint(rightCaptain, leftFlank);

  const colorBearer = addPaces(colorCenter, fwd, COLOR_RANK_ADVANCE_PACES);
  const centreCpl = addPaces(colorBearer, fwd, -CENTRE_CPL_TRACE_PACES);
  const rightCpl = addPx(centreCpl, across, FILE_INTERVAL);
  const leftCpl = addPx(centreCpl, across, -FILE_INTERVAL);

  const guideRight = addPaces(rightCaptain, fwd, COLOR_RANK_ADVANCE_PACES);
  const guideLeft = addPaces(leftFlank, fwd, COLOR_RANK_ADVANCE_PACES);

  const colonel = addPaces(battalionCenter, fwd, -COLONEL_REAR_PACES);
  const ltCol = addPaces(battalionCenter, fwd, LT_COL_LEAD_PACES);
  const seniorMaj = addPaces(colorBearer, fwd, SENIOR_MAJ_LEAD_PACES);
  const juniorMaj = addPaces(leftFlank, fwd, -JUNIOR_MAJ_REAR_PACES);

  // Keyed by COLOR_PARTY/FIELD_AND_STAFF's own ids, so this function's
  // output is derived from (and validated against) those two rosters rather
  // than a separately hardcoded id list.
  const posById = {
    'color-bearer': { ...colorBearer, facing },
    'color-cpl-right': { ...rightCpl, facing },
    'color-cpl-centre': { ...centreCpl, facing },
    'color-cpl-left': { ...leftCpl, facing },
    'guide-right': { ...guideRight, facing },
    'guide-left': { ...guideLeft, facing },
    'fs-col': { ...colonel, facing },
    'fs-ltc': { ...ltCol, facing },
    // Senior major faces the color-bearer/colonel (¶718: "before the
    // color-bearer, facing him").
    'fs-smaj': { ...seniorMaj, facing: (facing + 180) % 360 },
    'fs-jmaj': { ...juniorMaj, facing },
  };

  return [...COLOR_PARTY, ...FIELD_AND_STAFF].map((person) => ({ id: person.id, ...posById[person.id] }));
}

/** Recompute only the senior major's and lieutenant-colonel's posts for the
 * "Forward -- MARCH" (resume direct march) keyframe, per ¶727-728: the
 * senior major moves 30-40 paces in front on the new perpendicular, and the
 * lieutenant-colonel gives the color-company/next-left company (and, by
 * extension here, his own post) a direction perpendicular to the centre
 * corporal's new line. All other individuals keep the positions they ended
 * the wheel at -- ¶726-728 describes officer bookkeeping only, no further
 * soldier movement beyond continuing to march. */
function resumeMarchStaff(wheeledPositions, newFacing) {
  const byId = new Map(wheeledPositions.map((p) => [p.id, p]));
  const fwd = fwdAxis(newFacing);
  const colorBearer = byId.get('color-bearer');
  const battalionCenter = midpoint(byId.get(RIGHT_CAPTAIN_ID), byId.get(LEFT_FLANK_ID));

  const seniorMaj = addPaces(colorBearer, fwd, SENIOR_MAJ_RESUME_PACES);
  const ltCol = addPaces(battalionCenter, fwd, LT_COL_LEAD_PACES);

  return wheeledPositions.map((p) => {
    if (p.id === 'fs-smaj') return { ...p, x: seniorMaj.x, y: seniorMaj.y, facing: (newFacing + 180) % 360 };
    if (p.id === 'fs-ltc') return { ...p, x: ltCol.x, y: ltCol.y, facing: newFacing };
    return p;
  });
}

export default {
  id: 'change-direction-in-line',
  title: 'Change of Direction in Marching in Line of Battle',
  part: 5,
  article: 4,
  caseyParagraphs: [717, 718, 719, 720, 721, 722, 723, 724, 725, 726, 727, 728],
  subMovements: [
    { id: 'right', label: 'Right' },
    { id: 'left', label: 'Left' },
  ],
  commands: (subMovement) => {
    const side = subMovement === 'left' ? 'left' : 'right';
    return [
      { text: `1. Change direction to the ${side}.`, type: 'preparatory' },
      { text: '2. MARCH (or double quick—MARCH).', type: 'execution' },
      { text: '1. Forward.', type: 'preparatory' },
      { text: '2. MARCH.', type: 'execution' },
    ];
  },
  reenactorNotes:
    "The battalion changes direction WHILE MARCHING -- this is not a halt-then-turn. The pivot-side troops (the flank the colonel names) shorten their step to 14-17 inches and nearly mark time in place; the sweep-side troops lengthen their step to 28-33 inches, in proportion to their distance from the centre, to keep pace on the outside of the arc (¶718, ¶722-723). The centre corporal (of the 3-man color guard) sets the wheel's pace and shoulder-turn for the whole battalion (¶720), with the color-company captain and the next-left captain regulating on him -- the exact alignment-basis mechanic used for the straight advance (¶664/Article I), re-invoked here (¶720). This animation renders that graduated-step wheel as a single rigid rotation about the pivot flank's captain (¶719: 'the right general guide wheels on the right captain of the battalion as his pivot') -- geometrically equivalent, since points near a rotation's pivot barely move while points far from it sweep a wide arc, exactly matching the pivot-shortens/sweep-lengthens principle without needing per-soldier variable step lengths. Casey does not fix a target angle for the change of direction (it depends on terrain/tactical need); 90 degrees is shown here as a representative case. The color-guard, general-guide, and field-and-staff posts shown for the 'marching in line' starting state are inherited from Article I's own baseline figures where given (e.g. the 6-pace color-rank advance, ¶653), and are otherwise interpretive placements documented in code comments, since ¶717-729 itself only re-invokes Article I's cast without repeating their marching depths.",

  buildKeyframes: (battalion = DEFAULT_BATTALION, subMovement = 'right') => {
    const side = subMovement === 'left' ? 'left' : 'right';
    const companies = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });
    const party = partyAndStaffMarching(companies, FACING);
    const marching = [...companies, ...party];

    const pivotId = side === 'right' ? RIGHT_CAPTAIN_ID : LEFT_FLANK_ID;
    const pivot = marching.find((p) => p.id === pivotId);
    // wheel()'s angleDeg is positive-clockwise ("right wheel"); a change of
    // direction to the right is a clockwise sweep of the left (sweeping)
    // wing about the right-flank pivot, and vice versa.
    const angleSign = side === 'right' ? 1 : -1;

    function snapshotAt(angleDeg) {
      return wheel(marching, { pivotX: pivot.x, pivotY: pivot.y, angleDeg: angleSign * angleDeg });
    }

    const snap30 = snapshotAt(WHEEL_ANGLE / 3);
    const snap60 = snapshotAt((2 * WHEEL_ANGLE) / 3);
    const wheeled = snapshotAt(WHEEL_ANGLE);

    const newFacing = (FACING + angleSign * WHEEL_ANGLE + 360) % 360;
    const resumed = resumeMarchStaff(wheeled, newFacing);

    return [
      {
        label: 'Battalion marching in line, straight direction',
        description:
          'The battalion marches in line of battle on a straight course. The color-bearer, flanked by the 3 color-guard corporals, marches 6 paces ahead of the line; the two general guides march abreast of the color-rank on each flank.',
        caseyRef: '¶717',
        duration: 0,
        positions: marching,
        annotations: [],
      },
      {
        label: `Change direction to the ${side} — MARCH: the wheel begins`,
        description:
          `The color-rank shortens its step to 14-17 inches and directs itself circularly to the ${side === 'right' ? 'right' : 'left'}, insensibly advancing the ${side === 'right' ? 'left' : 'right'} shoulder. The senior major places himself before the color-bearer, facing him, to keep the arc neither too large nor too small.`,
        caseyRef: '¶718-719',
        duration: 1500,
        positions: snap30,
        annotations: [],
      },
      {
        label: 'The wheel continues — centre corporal sets the pace, wings conform',
        description:
          'The centre corporal, taking 14-17 inch steps, wheels by insensibly advancing his shoulder; the battalion conforms to his movement. In the sweeping wing, the pace lengthens in proportion to distance from the centre (up to 28-33 inches at the flank); in the pivot wing, the pace shortens toward the flank, which nearly marks time.',
        caseyRef: '¶720-723',
        duration: 1500,
        positions: snap60,
        annotations: [],
      },
      {
        label: 'Change of direction complete — battalion marching on the new line',
        description:
          'The battalion has completed the change of direction and continues to march, now on the new line. The lieutenant-colonel, placed before the battalion (¶725), has attended throughout to keeping the centre\'s arc even and the companies aligned on it without opening or crowding; the colonel superintends from the rear of the centre.',
        caseyRef: '¶724-725',
        duration: 1500,
        positions: wheeled,
        annotations: [],
      },
      {
        label: 'Forward — MARCH: direct march resumed',
        description:
          'The senior major immediately places himself 30-40 paces in front, faces the colonel, and is established by sword signal on the perpendicular direction the centre corporal should pursue; the color-bearer inclines to be exactly opposite that file and takes two new ground points. The lieutenant-colonel gives the color-company and the next-left company a direction perpendicular to the centre corporal\'s new line; all other companies conform without haste.',
        caseyRef: '¶726-728',
        duration: 1200,
        positions: resumed,
        annotations: [],
      },
    ];
  },
};
