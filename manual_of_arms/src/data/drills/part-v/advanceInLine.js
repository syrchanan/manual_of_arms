import { battalionLine } from '../../../engine/battalionFormations.js';
import { translate } from '../../../engine/formations.js';
import { DEFAULT_BATTALION, COLOR_COMPANY_INDEX } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';
import {
  buildColorParty,
  buildFieldAndStaff,
  colorFileAnchor,
  captainPos,
  offsetPaces,
  forwardVec,
  rightFlankVec,
  battalionCentreFront,
} from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article I (S.B. ¶648-685): "To advance in line of battle."
//
// Per battalion-spec/part-fifth-a.md's own "Complexity notes" (recommending
// a split rather than one drill trying to depict everything): this drill
// covers the CORE sequence -- staking the line, the preparatory/execution
// commands, and the steady-state march with its two-tier alignment basis
// (¶648-668) -- plus a single ILLUSTRATIVE instance of the mid-march
// "point of direction" correction (¶669-677), rather than modeling the
// marker relay as a continuous leapfrog loop. The correction is shown once,
// as an extra pair of keyframes near the end, not as a repeatable
// sub-maneuver -- this keeps the drill to a manageable, traceable keyframe
// count while still depicting every mechanic the text describes.
//
// Two sub-movements model ¶678's fork: 'directing' (this battalion is the
// reference unit for a larger line -- markers are staked and relayed behind
// it) and 'subordinate' (no markers; the color-bearer self-directs by his
// own ground points only). Both share the same preparatory/march/alignment
// mechanics; 'subordinate' simply omits every marker-specific step.
// ---------------------------------------------------------------------------

const { PACE_PX, RANK_GAP } = SCALE;
const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 60;
const ORIGIN_Y = 220;
const FACING = 0; // battalion advances "north" (up-screen)

// Distances of 20+ paces are compressed for on-screen legibility -- Casey's
// true 40-110 pace figures (560-1540px) would run the colonel/markers far
// outside CANVAS_BATTALION's 500px-tall viewBox. This mirrors
// part-iv/determineLine.js's precedent of showing markers "not to scale on
// screen" while keeping the true pace counts in the descriptive text.
// Distances under 20 paces are drawn true-to-scale.
const STAFF_SCALE = 0.22;
function staffPaces(paces) {
  return paces >= 20 ? paces * STAFF_SCALE : paces;
}

function behindFacing(facing) {
  return (facing + 180) % 360;
}

function marchVec(paces) {
  const f = forwardVec(FACING);
  return { dx: f.x * paces * PACE_PX, dy: f.y * paces * PACE_PX };
}

function combine(soldiers, colorParty, fieldStaff) {
  return [...soldiers, ...colorParty, ...fieldStaff];
}

/** Nudge the color party laterally (the ¶672 "incline right/left until he
 * exactly covers the centre corporal's file" correction) -- illustrative
 * only, a small visible shift rather than a re-derivation of new march
 * points. */
function nudgeColorParty(colorParty, facing, rightPaces) {
  const r = rightFlankVec(facing);
  const dx = r.x * rightPaces * PACE_PX;
  const dy = r.y * rightPaces * PACE_PX;
  return colorParty.map((p) => ({ ...p, x: p.x + dx, y: p.y + dy }));
}

export default {
  id: 'advance-in-line',
  title: 'To Advance in Line of Battle',
  part: 5,
  article: 1,
  caseyParagraphs: [
    648, 649, 650, 651, 652, 653, 655, 656, 657, 658, 659, 661, 662, 663, 664,
    665, 666, 667, 668, 669, 670, 671, 672, 673, 674, 675, 676, 677, 678,
    679, 680, 681, 682, 683, 684, 685,
  ],
  subMovements: [
    { id: 'directing', label: 'Directing Battalion (with Markers)' },
    { id: 'subordinate', label: 'Subordinate Battalion (no Markers)' },
  ],
  commands: [
    { text: '1. Battalion, forward.', type: 'preparatory' },
    { text: '2. MARCH (or double quick—MARCH).', type: 'execution' },
    { text: 'Point of direction to the right (or left).', type: 'preparatory' },
  ],
  reenactorNotes:
    "This drill covers Article I's core advance (¶648-668) plus a single illustrative pass through the mid-march 'point of direction' correction (¶670-677) -- not a repeatable loop, since Casey describes it as a conditional response to the colonel's judgment, not a fixed part of every advance. The color-bearer, 3 color-guard corporals, and 2 general guides (COLOR_PARTY in battalion.js) and the colonel/lieutenant-colonel/majors (FIELD_AND_STAFF) are newly load-bearing here; their exact rank-and-file layout (color file = the boundary between files 10/11 of the color company; centre corporal directly behind the bearer, right/left corporals flanking him) is this project's own interpretive choice -- see colorPartyPosts.js's header comment for the full rationale, since Casey does not fix this geometry. The colonel's 40-60 pace staking distances, the two rearward markers, and the senior major's 30-40 pace advance are all drawn compressed (see STAFF_SCALE) so they fit the canvas; the true pace figures are in each keyframe's own description. Captain/covering-sergeant left-wing repositioning (¶655) is not re-modeled at battalion scale here -- it is already animated at company scale elsewhere in this project, and duplicating it per-company across all 8 companies would not add new information to this battalion-level drill. The marker relay (¶669) is shown as markers holding a constant distance behind the battalion as it marches, illustrating the leapfrog's net effect rather than animating each individual relay hop.",

  buildKeyframes: (_company, subMovement = 'directing', battalion = DEFAULT_BATTALION) => {
    const directing = subMovement !== 'subordinate';
    const halted = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });
    const anchorHalt = colorFileAnchor(halted);

    // --- KF1: halted, correctly aligned (¶648) ---
    const cpAtRest = buildColorParty(halted, { forwardPaces: 0, atRest: true });
    const fsHalted = buildFieldAndStaff(halted, {});
    const kf1 = combine(halted, cpAtRest, fsHalted);

    // --- KF2: staking the line -- colonel & lieutenant-colonel post (¶648-649) ---
    const colPost40 = offsetPaces(anchorHalt, FACING, { forward: -staffPaces(40) });
    const ltcPost40 = offsetPaces(anchorHalt, FACING, { forward: staffPaces(40) });
    const fsStaking = buildFieldAndStaff(halted, {
      'fs-col': { ...colPost40, facing: FACING },
      'fs-ltc': { ...ltcPost40, facing: behindFacing(FACING) },
    });
    const kf2 = combine(halted, cpAtRest, fsStaking);

    const keyframes = [
      {
        label: 'Battalion halted, correctly aligned',
        description: directing
          ? 'The battalion stands halted, correctly aligned, and supposed to be the directing (reference) battalion for a larger line. The colonel gives the lieutenant-colonel an intimation of his purpose before any command is given.'
          : 'The battalion stands halted, correctly aligned. As a subordinate battalion, it has no line to maintain for others -- no markers will be staked (¶678).',
        caseyRef: '¶648',
        duration: 0,
        positions: kf1,
        annotations: [],
      },
      {
        label: 'Staking the line — colonel and lieutenant-colonel post',
        description:
          'The colonel places himself about 40 paces in rear of the color-file, facing front. The lieutenant-colonel places himself the same distance in front of the color-file, faces the colonel, and is established perpendicular to the line of battle, opposite the color-bearer, by sword signal.',
        caseyRef: '¶648–649',
        duration: 1000,
        positions: kf2,
        annotations: [
          { type: 'wheelingPoint', pivotX: colPost40.x, pivotY: colPost40.y },
          { type: 'wheelingPoint', pivotX: ltcPost40.x, pivotY: ltcPost40.y },
        ],
      },
    ];

    if (directing) {
      const colPost60 = offsetPaces(anchorHalt, FACING, { forward: -staffPaces(60) });
      const rearAnchor = offsetPaces(anchorHalt, FACING, { forward: -(RANK_GAP / PACE_PX) });
      const marker1 = offsetPaces(rearAnchor, FACING, { forward: -staffPaces(25) });
      const marker2 = offsetPaces(marker1, FACING, { forward: -staffPaces(25) });

      const fsMarkers = buildFieldAndStaff(halted, {
        'fs-col': { ...colPost60, facing: FACING },
        'fs-ltc': { ...ltcPost40, facing: behindFacing(FACING) },
      });
      keyframes.push({
        label: 'Markers established behind the battalion',
        description:
          'The colonel moves 20 paces farther to the rear and establishes two markers on the prolongation of the line through the color-bearer and lieutenant-colonel: the first about 25 paces behind the rear rank, the second the same distance behind the first. Both markers face to the rear. The color-bearer takes two points on the ground in the line running between himself and the lieutenant-colonel\'s heels.',
        caseyRef: '¶650–651',
        duration: 1200,
        positions: combine(halted, cpAtRest, fsMarkers),
        annotations: [
          { type: 'wheelingPoint', pivotX: marker1.x, pivotY: marker1.y },
          { type: 'wheelingPoint', pivotX: marker2.x, pivotY: marker2.y },
        ],
      });
    }

    // --- KF: preparatory "Battalion, forward" (¶652-657) ---
    const cpAdvancing = buildColorParty(halted, { forwardPaces: 6, atRest: false });
    const ltcPost665 = offsetPaces(captainPos(halted, COLOR_COMPANY_INDEX), FACING, { right: 13.5 });
    const smajPostFlank = offsetPaces(colorFileAnchor(halted), FACING, { forward: 6, right: 7 });
    const colPrepPost = directing
      ? offsetPaces(anchorHalt, FACING, { forward: -staffPaces(60) })
      : offsetPaces(anchorHalt, FACING, { forward: -staffPaces(40) });
    const fsPrep = buildFieldAndStaff(halted, {
      'fs-ltc': { ...ltcPost665, facing: FACING },
      'fs-smaj': { ...smajPostFlank, facing: FACING },
      'fs-col': { ...colPrepPost, facing: FACING },
    });
    keyframes.push({
      label: 'Battalion, forward — preparatory',
      description:
        'The front rank of the color-guard (the 3 corporals) advances 6 paces to the front; the two general guides move forward abreast with the color-bearer -- the right guide opposite the captain of the right company, the left guide opposite the sergeant closing the left of the battalion. The lieutenant-colonel takes his post 12–15 paces on the right of the color-company captain; the senior major places himself 6–8 paces on the flank of the color-rank.',
      caseyRef: '¶652–657, ¶665',
      duration: 1000,
      positions: combine(halted, cpAdvancing, fsPrep),
      annotations: [],
    });

    // --- KF: MARCH -- battalion steps off (¶658-668) ---
    const MARCH_PACES = 10;
    const marched = translate(halted, marchVec(MARCH_PACES));
    const cpMarched = buildColorParty(marched, { forwardPaces: 6, atRest: false });
    const ltcMarched = offsetPaces(captainPos(marched, COLOR_COMPANY_INDEX), FACING, { right: 13.5 });
    const smajMarched = offsetPaces(colorFileAnchor(marched), FACING, { forward: 6, right: 7 });
    const colMarched = offsetPaces(battalionCentreFront(marched), FACING, { forward: -staffPaces(30) });
    const fsMarched = buildFieldAndStaff(marched, {
      'fs-ltc': { ...ltcMarched, facing: FACING },
      'fs-smaj': { ...smajMarched, facing: FACING },
      'fs-col': { ...colMarched, facing: FACING },
    });
    const markerAnnotAt = (soldierPositions) => {
      if (!directing) return [];
      const rearAnchor = offsetPaces(colorFileAnchor(soldierPositions), FACING, { forward: -(RANK_GAP / PACE_PX) });
      const m1 = offsetPaces(rearAnchor, FACING, { forward: -staffPaces(25) });
      const m2 = offsetPaces(m1, FACING, { forward: -staffPaces(25) });
      return [
        { type: 'wheelingPoint', pivotX: m1.x, pivotY: m1.y },
        { type: 'wheelingPoint', pivotX: m2.x, pivotY: m2.y },
      ];
    };
    keyframes.push({
      label: 'MARCH — battalion steps off',
      description:
        'The battalion steps off with life. The color-bearer, charged with step and direction, marches on the prolongation of his two ground points; the corporals on his right and left match his step without turning head or shoulders. The two general guides march abreast of the color-rank. The 3 centre corporals and the captains of the color-company and next-left company form the alignment basis for both wings; the lieutenant-colonel keeps that basis dressed from his post on the right.',
      caseyRef: '¶658–668',
      duration: 2000,
      positions: combine(marched, cpMarched, fsMarched),
      annotations: markerAnnotAt(marched),
    });

    // --- KF: march continues, steady state / marker relay (¶662-669) ---
    const MARCH_PACES_2 = 8;
    const marched2 = translate(marched, marchVec(MARCH_PACES_2));
    const cpMarched2 = buildColorParty(marched2, { forwardPaces: 6, atRest: false });
    const ltcMarched2 = offsetPaces(captainPos(marched2, COLOR_COMPANY_INDEX), FACING, { right: 13.5 });
    const smajMarched2 = offsetPaces(colorFileAnchor(marched2), FACING, { forward: 6, right: 7 });
    const colMarched2 = offsetPaces(battalionCentreFront(marched2), FACING, { forward: -staffPaces(30) });
    const fsMarched2 = buildFieldAndStaff(marched2, {
      'fs-ltc': { ...ltcMarched2, facing: FACING },
      'fs-smaj': { ...smajMarched2, facing: FACING },
      'fs-col': { ...colMarched2, facing: FACING },
    });
    keyframes.push({
      label: directing ? 'March continues — marker relay extends behind the battalion' : 'March continues — color-bearer self-directs',
      description: directing
        ? 'As the battalion advances, the marker line is continuously extended: a third marker is placed behind the first, the second leapfrogs behind the third, and so on, each facing to the rear as it shifts. A staff officer holds himself 15–20 paces off, facing the rearmost marker, cautioning each in turn.'
        : 'As a subordinate battalion, no markers are maintained behind the line; the color-bearer keeps himself on the perpendicular by his own ground points alone (¶678).',
      caseyRef: directing ? '¶669' : '¶678',
      duration: 1800,
      positions: combine(marched2, cpMarched2, fsMarched2),
      annotations: markerAnnotAt(marched2),
    });

    // --- KF: mid-march correction, illustrative single instance (¶670-677) ---
    const smajAdvancePost = offsetPaces(colorFileAnchor(marched2), FACING, { forward: staffPaces(35) });
    const NUDGE_PACES = 1.5;
    const cpNudged = nudgeColorParty(cpMarched2, FACING, NUDGE_PACES);
    const fsCorrection = buildFieldAndStaff(marched2, {
      'fs-ltc': { ...ltcMarched2, facing: FACING },
      'fs-smaj': { ...smajAdvancePost, facing: behindFacing(FACING) },
      'fs-col': { ...colMarched2, facing: FACING },
    });
    const correctionAnnotations = directing
      ? markerAnnotAt(marched2).map((a) => ({ ...a, pivotX: a.pivotX + NUDGE_PACES * PACE_PX }))
      : [];
    keyframes.push({
      label: 'Point of direction to the right — correction',
      description:
        'Perceiving the color-bearer\'s march is not perpendicular, the colonel commands "Point of direction to the right." The senior major hastens 30–40 paces in advance of the color-rank, halts, faces the colonel, and takes the indicated direction. The centre corporal and color-bearer each direct themselves upon the senior major, inclining until the color-bearer exactly covers the centre corporal\'s file; the general guides conform.' +
        (directing ? ' The officer in charge re-establishes the markers on the new direction.' : ''),
      caseyRef: '¶670–677',
      duration: 1800,
      positions: combine(marched2, cpNudged, fsCorrection),
      annotations: [
        { type: 'wheelingPoint', pivotX: smajAdvancePost.x, pivotY: smajAdvancePost.y },
        ...correctionAnnotations,
      ],
    });

    // --- KF: correction complete, steady march resumes (¶681-685) ---
    const MARCH_PACES_3 = 8;
    const marched3 = translate(marched2, marchVec(MARCH_PACES_3));
    const cpMarched3 = buildColorParty(marched3, { forwardPaces: 6, atRest: false });
    const ltcMarched3 = offsetPaces(captainPos(marched3, COLOR_COMPANY_INDEX), FACING, { right: 13.5 });
    const smajMarched3 = offsetPaces(colorFileAnchor(marched3), FACING, { forward: 6, right: 7 });
    const colMarched3 = offsetPaces(battalionCentreFront(marched3), FACING, { forward: -staffPaces(30) });
    const fsMarched3 = buildFieldAndStaff(marched3, {
      'fs-ltc': { ...ltcMarched3, facing: FACING },
      'fs-smaj': { ...smajMarched3, facing: FACING },
      'fs-col': { ...colMarched3, facing: FACING },
    });
    keyframes.push({
      label: 'Correction complete — steady march resumes',
      description:
        'The battalion, re-directed, resumes its steady march. Openings, crowding, or disorder are corrected calmly and promptly; the general guides continue to show the flank companies the centre\'s step. Habituating the battalion to execute these direction-rectifying movements with order and promptness is of the utmost importance (¶679–685).',
      caseyRef: '¶679–685',
      duration: 1800,
      positions: combine(marched3, cpMarched3, fsMarched3),
      annotations: markerAnnotAt(marched3),
    });

    return keyframes;
  },
};
