import { battalionLine } from '../../../engine/battalionFormations.js';
import { translate, oblique } from '../../../engine/formations.js';
import { DEFAULT_BATTALION, COLOR_COMPANY_INDEX } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';
import {
  buildColorParty,
  buildFieldAndStaff,
  colorFileAnchor,
  captainPos,
  offsetPaces,
  forwardVec,
  battalionCentreFront,
} from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article II (S.B. ¶686-698): "Oblique march in line of battle."
//
// Per the spec's own complexity note: "mostly a straightforward
// generalization" -- the oblique mechanic itself (each soldier half-facing
// and marching diagonally) is delegated by Casey's own text (¶688) to the
// already-implemented School-of-Company oblique principles
// (lesson-iii/obliqueMarch.js's use of formations.js's oblique()). At
// battalion scale this is run per-company (each company obliques on its own
// roster, exactly as the spec suggests: "run the existing per-company
// oblique on all 8 companies simultaneously"). The only genuinely new
// battalion-level element is the senior major's supervisory position -- in
// front of/facing the color-bearer during the oblique (¶687, ¶690), and 30
// paces in front when direct march resumes (¶694).
//
// NOTE on a minor seam this generalization accepts: oblique()'s rearRankShift
// skips the lateral nudge for a company's own file-1 (or last-file) rear-rank
// man, reasoning "no file to his right/left to march behind" -- true only at
// the battalion's actual flanks (company 1's file 1, the last company's last
// file). Applying oblique() per company (as this file does, matching the
// spec's own suggested approach) means every INTERNAL company boundary also
// skips the shift for that company's edge file, which is not quite physically
// correct (that man does have a neighboring file in the next company) but is
// a small, cosmetic seam at 7 internal boundaries out of 160 files -- not
// re-derived here since fixing it would require a new battalion-wide
// rearRankShift variant, out of scope for what the spec calls "mostly a
// straightforward generalization."
// ---------------------------------------------------------------------------

const { PACE_PX } = SCALE;
const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 60;
const ORIGIN_Y = 260;
const FACING = 0; // continues Article I's advance, "north" (up-screen)

// See advanceInLine.js for the same rationale: distances of 20+ paces are
// compressed for on-screen legibility.
const STAFF_SCALE = 0.22;
function staffPaces(paces) {
  return paces >= 20 ? paces * STAFF_SCALE : paces;
}

function marchVec(paces) {
  const f = forwardVec(FACING);
  return { dx: f.x * paces * PACE_PX, dy: f.y * paces * PACE_PX };
}

function combine(soldiers, colorParty, fieldStaff) {
  return [...soldiers, ...colorParty, ...fieldStaff];
}

/** Run formations.js's oblique() per company across the whole battalion,
 * per this file's header comment. */
function obliqueBattalion(positions, battalion, opts) {
  const posMap = new Map(positions.map((p) => [p.id, p]));
  const out = [];
  battalion.forEach((co) => {
    const coPositions = co.soldiers.map((s) => posMap.get(s.id)).filter(Boolean);
    out.push(...oblique(coPositions, { ...opts, company: co.soldiers }));
  });
  return out;
}

export default {
  id: 'oblique-march-in-line',
  title: 'Oblique March in Line of Battle',
  part: 5,
  article: 2,
  caseyParagraphs: [686, 687, 688, 690, 691, 692, 693, 694, 695, 696, 697, 698],
  subMovements: [
    { id: 'right', label: 'Right Oblique' },
    { id: 'left', label: 'Left Oblique' },
  ],
  commands: [
    { text: '1. Right (or left) oblique.', type: 'preparatory' },
    { text: '2. MARCH (or double quick—MARCH).', type: 'execution' },
    { text: '1. Forward.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],
  reenactorNotes:
    "The object of the oblique step is to gain ground right or left while preserving the line of battle's original direction (¶696). The actual per-soldier oblique mechanic is inherited unchanged from the School of the Company (¶688) -- run per company across all 8 companies, see this file's header comment for the one small cosmetic seam that generalization accepts at internal company boundaries. The senior major's posts (in front of the color-bearer during the oblique, ¶687/690; 30 paces in front when direct march resumes, ¶694) are the only new battalion-level geometry; the lieutenant-colonel (¶691) and colonel (¶692) continue supervising from the same posts established in Article I's steady march (advanceInLine.js), watching that captains and centre corporals stay parallel and that files do not crowd toward the obliquing flank.",

  buildKeyframes: (_company, subMovement = 'right', battalion = DEFAULT_BATTALION) => {
    const directionDeg = subMovement === 'left' ? -45 : 45;
    const halted = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });

    // Baseline: battalion already marching in line (continues Article I).
    const marching = translate(halted, marchVec(8));
    const cpMarching = buildColorParty(marching, { forwardPaces: 6, atRest: false });
    const fsMarching = () => buildFieldAndStaff(marching, {
      'fs-ltc': { ...offsetPaces(captainPos(marching, COLOR_COMPANY_INDEX), FACING, { right: 13.5 }), facing: FACING },
      'fs-smaj': { ...offsetPaces(colorFileAnchor(marching), FACING, { forward: 6, right: 7 }), facing: FACING },
      'fs-col': { ...offsetPaces(battalionCentreFront(marching), FACING, { forward: -staffPaces(30) }), facing: FACING },
    });

    // --- KF: first command, "Right (or left) oblique" (¶686-687) ---
    const bearerAtMarch = cpMarching.find((p) => p.id === 'color-bearer');
    const smajBeforeBearer = offsetPaces(bearerAtMarch, FACING, { forward: 10 });
    const fsFirstCommand = buildFieldAndStaff(marching, {
      'fs-ltc': { ...offsetPaces(captainPos(marching, COLOR_COMPANY_INDEX), FACING, { right: 13.5 }), facing: FACING },
      'fs-smaj': { ...smajBeforeBearer, facing: (FACING + 180) % 360 },
      'fs-col': { ...offsetPaces(battalionCentreFront(marching), FACING, { forward: -staffPaces(30) }), facing: FACING },
    });

    // --- KF: MARCH -- battalion takes the oblique step (¶688, ¶690-692) ---
    const OBLIQUE_PACES = 6;
    const obliquedSoldiers = obliqueBattalion(marching, battalion, {
      directionDeg,
      paces: OBLIQUE_PACES,
      rearRankShift: true,
    });
    const obliqueFacing = (FACING + directionDeg + 360) % 360;
    const obliquedSoldiersFaced = obliquedSoldiers.map((s) => ({ ...s, facing: obliqueFacing }));
    const cpObliqued = oblique(cpMarching, { directionDeg, paces: OBLIQUE_PACES, rearRankShift: false })
      .map((s) => ({ ...s, facing: obliqueFacing }));
    const bearerObliqued = cpObliqued.find((p) => p.id === 'color-bearer');
    const smajDuringOblique = offsetPaces(bearerObliqued, FACING, { forward: 10 });
    const fsDuringOblique = buildFieldAndStaff(obliquedSoldiersFaced, {
      'fs-ltc': { ...offsetPaces(captainPos(obliquedSoldiersFaced, COLOR_COMPANY_INDEX), FACING, { right: 13.5 }), facing: FACING },
      'fs-smaj': { ...smajDuringOblique, facing: (FACING + 180) % 360 },
      'fs-col': { ...offsetPaces(battalionCentreFront(obliquedSoldiersFaced), FACING, { forward: -staffPaces(30) }), facing: FACING },
    });

    // --- KF: oblique continues, a further leg (visual continuation) ---
    // The half-face is already applied above; continue straight along the
    // oblique heading with a plain forward translate at that facing.
    const OBLIQUE_PACES_2 = 5;
    const obliqueForward = (paces) => {
      const rad = (obliqueFacing * Math.PI) / 180;
      return { dx: Math.sin(rad) * paces * PACE_PX, dy: -Math.cos(rad) * paces * PACE_PX };
    };
    const obliqueContinued = translate(obliquedSoldiersFaced, obliqueForward(OBLIQUE_PACES_2));
    const cpObliqueContinued = translate(cpObliqued, obliqueForward(OBLIQUE_PACES_2));
    const bearerContinued = cpObliqueContinued.find((p) => p.id === 'color-bearer');
    const smajContinued = offsetPaces(bearerContinued, FACING, { forward: 10 });
    const fsContinued = buildFieldAndStaff(obliqueContinued, {
      'fs-ltc': { ...offsetPaces(captainPos(obliqueContinued, COLOR_COMPANY_INDEX), FACING, { right: 13.5 }), facing: FACING },
      'fs-smaj': { ...smajContinued, facing: (FACING + 180) % 360 },
      'fs-col': { ...offsetPaces(battalionCentreFront(obliqueContinued), FACING, { forward: -staffPaces(30) }), facing: FACING },
    });

    // --- KF: "Forward. MARCH." -- resume direct march (¶693-695) ---
    const capAtObliqueEnd = captainPos(obliqueContinued, 1);
    const frontRestored = battalionLine(battalion, {
      originX: capAtObliqueEnd.x,
      originY: capAtObliqueEnd.y,
      facing: FACING,
    });
    const cpRestored = buildColorParty(frontRestored, { forwardPaces: 6, atRest: false });
    const smajResumePost = offsetPaces(colorFileAnchor(frontRestored), FACING, { forward: staffPaces(30) });
    const fsRestored = buildFieldAndStaff(frontRestored, {
      'fs-ltc': { ...offsetPaces(captainPos(frontRestored, COLOR_COMPANY_INDEX), FACING, { right: 13.5 }), facing: FACING },
      'fs-smaj': { ...smajResumePost, facing: (FACING + 180) % 360 },
      'fs-col': { ...offsetPaces(battalionCentreFront(frontRestored), FACING, { forward: -staffPaces(30) }), facing: FACING },
    });

    // --- KF: direct march resumed, continues forward ---
    const finalMarched = translate(frontRestored, marchVec(6));
    const cpFinal = buildColorParty(finalMarched, { forwardPaces: 6, atRest: false });
    const fsFinal = buildFieldAndStaff(finalMarched, {
      'fs-ltc': { ...offsetPaces(captainPos(finalMarched, COLOR_COMPANY_INDEX), FACING, { right: 13.5 }), facing: FACING },
      'fs-smaj': { ...offsetPaces(colorFileAnchor(finalMarched), FACING, { forward: 6, right: 7 }), facing: FACING },
      'fs-col': { ...offsetPaces(battalionCentreFront(finalMarched), FACING, { forward: -staffPaces(30) }), facing: FACING },
    });

    return [
      {
        label: 'Battalion marching in line',
        description: 'The battalion advances in line of battle, continuing Article I\'s steady march.',
        caseyRef: '¶686',
        duration: 0,
        positions: combine(marching, cpMarching, fsMarching()),
        annotations: ['marchArrow'],
      },
      {
        label: `${subMovement === 'left' ? 'Left' : 'Right'} oblique — preparatory`,
        description:
          'At the first command, the senior major places himself in front of, and faced to, the color-bearer.',
        caseyRef: '¶686–687',
        duration: 800,
        positions: combine(marching, cpMarching, fsFirstCommand),
        annotations: [],
      },
      {
        label: 'MARCH — oblique step taken',
        description:
          'At MARCH, the whole battalion takes the oblique step, each company following the School-of-the-Company oblique principles. The senior major keeps the color-bearer in line with the centre corporal, watching that both follow parallel directions and the same step length; the lieutenant-colonel ensures the captains and centre corporals stay exactly on a line.',
        caseyRef: '¶688, ¶690–691',
        duration: 1600,
        positions: combine(obliquedSoldiersFaced, cpObliqued, fsDuringOblique),
        annotations: ['obliqueAngle'],
      },
      {
        label: 'Oblique march continues',
        description:
          'The battalion continues obliquely at the same cadence as the direct march. The colonel prevents files from crowding on the flank the battalion obliques toward, causing them to open out if needed (¶692).',
        caseyRef: '¶692, ¶697–698',
        duration: 1400,
        positions: combine(obliqueContinued, cpObliqueContinued, fsContinued),
        annotations: ['obliqueAngle'],
      },
      {
        label: 'Forward MARCH — direct march resumed',
        description:
          'At MARCH, the battalion resumes direct march. The senior major places himself 30 paces in front of the color-bearer, faces the colonel, and is established by sword signal on the direction the color-bearer should pursue; the color-bearer immediately takes two new points on the ground. Care is taken that the files do not close their intervals all at once, but almost insensibly (¶695).',
        caseyRef: '¶693–695',
        duration: 1000,
        positions: combine(frontRestored, cpRestored, fsRestored),
        annotations: [],
      },
      {
        label: 'Direct march resumed',
        description:
          'The battalion continues its direct march in the original line-of-battle direction, on ground shifted right (or left) by the oblique.',
        caseyRef: '¶696',
        duration: 1200,
        positions: combine(finalMarched, cpFinal, fsFinal),
        annotations: ['marchArrow'],
      },
    ];
  },
};
