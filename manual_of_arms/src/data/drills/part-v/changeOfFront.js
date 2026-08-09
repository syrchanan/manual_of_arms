import { battalionLine, cascadeBlend } from '../../../engine/battalionFormations.js';
import { wheel, aboutFace } from '../../../engine/formations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';
import { buildColorParty, buildFieldAndStaff, forwardVec } from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article XII (S.B. ¶830-873): "Changes of Front" -- forward
// (halted, ¶830-842), forward while marching (¶843-851), and to the rear
// (¶852-870), plus general remarks on wheel-timing/obliquity (¶871-873).
//
// Per battalion-spec/part-fifth-c.md's consolidated complexity assessment,
// this reuses the existing rigid wheel() pivot pattern already used at
// battalion scale by Article IV (changeDirectionInLine.js), with three
// additive mechanics:
//   (1) TWO-STAGE PIVOT: the pivot company (company 1, per ¶830/¶850's
//       "first company," mirrored "by inverse means" onto the 8th company at
//       ¶850/¶867 -- that mirror is documented here but not separately
//       animated, see reenactorNotes) self-positions onto the new line via
//       its OWN company-scale wheel (S.C. No. 189, ¶831/¶852) BEFORE the
//       battalion-wide wheel command fires; the rest of the battalion then
//       wheels about that now-fixed company.
//   (2) CASCADING TURN-ONTO-LINE: companies 2-8 do not halt simultaneously.
//       Each, in succession outward from the pivot, wheels ~45 degrees on
//       its OWN fixed pivot (¶835/¶859, "the eighth of the circle" per
//       ¶871), marches straight until it reaches the point vacated by the
//       company ahead of it, then turns onto the final line itself
//       (¶837-840, mirrored ¶861-864) -- modeled with cascadeBlend(), the
//       same serial-timing primitive Article XI (formByFileIntoLine.js)
//       already uses for an analogous company-to-company relay.
//   (3) UNDERSHOOT (forward) vs OVERSHOOT (rear): the forward case halts each
//       company 3 paces SHORT of the new line before the final "align by the
//       right" closes the gap (¶838); the rear case is the mirror image --
//       because the OPERATIVE (leading) rank during a rear-case wheel is the
//       rear rank (every non-pivot company has faced about), each company
//       must cross 3 paces BEYOND the line before facing about again to
//       bring its true front rank onto it (¶862-863).
//
// GEOMETRY KEY INSIGHT: despite (1)-(3) reading as substantial new
// choreography, the NET whole-battalion rotation in both the forward and
// rear cases is the same ~90-degree "perpendicular change of front" (¶871's
// "half wheel -- the eighth of the circle" describes each COMPANY's own
// partial in-place wheel, not the whole-battalion angle). A company's
// about-face + left-wheel + re-about-face (rear case) nets the exact same
// total rotation as a single rigid wheel of the SAME sign as the forward
// case's single right-wheel, just negative -- so both cases' *settled* final
// line is produced by ONE wheel() call of the whole old-line cast about
// company 1's original captain position, angleDeg = +90 (forward) or -90
// (rear). The about-face/overshoot business (2)-(3) above is layered on as
// an intermediate keyframe detail, not a different final geometry.
//
// PIVOT CHOICE: company 1's ORIGINAL captain position (c1-of-cpt, before any
// movement) is used as the single fixed hinge point for both cases. ¶830 and
// ¶852 both describe markers placed "before where the company will stand" /
// "before the right and left files of that company's new position" -- i.e.
// close to, not necessarily identical to, its original ground -- Casey gives
// no coordinates, so anchoring the whole rotation on the company's own
// starting point is a defensible, documented simplification (consistent
// with changeDirectionInLine.js's own flank-pivot convention).
//
// COLOR PARTY / FIELD-AND-STAFF: ¶830-873 gives NO choreography for these
// individuals (contrast Article IV's ¶717-729, which threads them through
// the whole wheel). Per this project's established convention for such gaps
// (see formByFileIntoLine.js's identical note), they are computed ONCE from
// the FINAL formed line via colorPartyPosts.js's shared helpers and held
// FIXED at that post through every keyframe of a given sub-movement -- an
// interpretive placement, not a sourced one.
//
// CANVAS NOTE: a "perpendicular change of front" necessarily rotates the
// battalion's ~1590px line-of-battle width into a VERTICAL extent of the
// same magnitude, which exceeds CANVAS_BATTALION.VIEW_H (500px) regardless
// of origin choice -- the same inherent mismatch already present in
// changeDirectionInLine.js's own 90-degree "change of direction" wheel
// (that file rotates the same width into the same height). Not a new
// limitation introduced here; not solved here either (out of scope).
//
// SUB-MOVEMENTS: 'forward' (¶830-842), 'forward-marching' (¶843-849, which
// re-invokes ¶833-840 verbatim per ¶848 for everything but the pivot
// company's own marching-turn), and 'rear' (¶852-870). ¶850/¶867's mirror
// onto the 8th (left) company "by inverse means," and ¶871-873's oblique
// variant (a continuous wheel-angle/timing parameter, not new choreography
// per the spec's own recommendation), are documented in reenactorNotes only.
// ---------------------------------------------------------------------------

const { PACE_PX } = SCALE;

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 100;
const ORIGIN_Y = 250;
const OLD_FACING = 0; // battalion's old front, facing north
const WHEEL_ANGLE = 90; // net perpendicular change of front (see header note)
const PARTIAL_WHEEL_ANGLE = 45; // ¶871: "about a half wheel (the eighth of the circle)"
const UNDERSHOOT_OVERSHOOT_PACES = 3; // ¶838 (undershoot) / ¶862 (overshoot)
const PIVOT_COMPANY_INDEX = 1;
const CASCADE_ORDER = [2, 3, 4, 5, 6, 7, 8]; // outward from the pivot, per ¶840/¶864

function groupOfId(id) {
  const m = /^c(\d+)-/.exec(id);
  return m ? Number(m[1]) : null;
}

function companyIds(battalion, index) {
  const co = battalion.find((c) => c.index === index);
  return co ? co.soldiers.map((s) => s.id) : [];
}

/** Replace `companyIndex`'s ids in `positions` with their values from
 * `overrideSource` -- used to splice the pivot company's already-settled
 * final position into an otherwise still-forming battalion snapshot. */
function withCompanyOverride(positions, overrideSource, battalion, companyIndex) {
  const ids = new Set(companyIds(battalion, companyIndex));
  const overrideMap = new Map(overrideSource.filter((p) => ids.has(p.id)).map((p) => [p.id, p]));
  return positions.map((p) => overrideMap.get(p.id) ?? p);
}

/** Each non-pivot company wheels `angleDeg` about its OWN current fixed
 * pivot (front-rank captain, or -- post-about-face, rear case -- the
 * covering sergeant, now the leading rank per ¶859) independently, per
 * ¶835/¶859's explicit citation of the existing company-scale wheel (S.C.
 * No. 189). NOT a single shared battalion-wide pivot. */
function perCompanyWheel(positions, battalion, { excludeIndex, angleDeg, useRearRankPivot = false } = {}) {
  const byId = new Map(positions.map((p) => [p.id, p]));
  let out = positions;
  battalion.forEach((co) => {
    if (co.index === excludeIndex) return;
    const pivotId = useRearRankPivot ? `c${co.index}-nc-cov` : `c${co.index}-of-cpt`;
    const pivot = byId.get(pivotId);
    if (!pivot) return;
    const ids = new Set(companyIds(battalion, co.index));
    const subset = out.filter((p) => ids.has(p.id));
    const rotated = wheel(subset, { pivotX: pivot.x, pivotY: pivot.y, angleDeg });
    const rotatedMap = new Map(rotated.map((p) => [p.id, p]));
    out = out.map((p) => rotatedMap.get(p.id) ?? p);
  });
  return out;
}

/** The undershoot (forward) / overshoot (rear) point each non-pivot company
 * turns onto before its final halt-and-dress -- `finalFull` translated by
 * `paces` (signed) along `approachFacing`'s own forward axis, with facing
 * set to `approachFacing` (still turned toward the line, not yet the
 * true settled facing for the rear case -- see ¶862-863). The pivot company
 * is left untouched (already at its own true final). */
function buildCascadeTarget(finalFull, battalion, { pivotIndex, approachFacing, paces }) {
  const fv = forwardVec(approachFacing);
  const dx = fv.x * paces * PACE_PX;
  const dy = fv.y * paces * PACE_PX;
  const pivotIds = new Set(companyIds(battalion, pivotIndex));
  return finalFull.map((p) => (pivotIds.has(p.id) ? p : { ...p, x: p.x + dx, y: p.y + dy, facing: approachFacing }));
}

function cascadeProgress(order, doneThroughIndex, midProgress) {
  const progress = {};
  order.forEach((idx, i) => {
    if (i < doneThroughIndex) progress[idx] = 1;
    else if (i === doneThroughIndex) progress[idx] = midProgress;
    else progress[idx] = 0;
  });
  return progress;
}

/** All the shared position sets for a given change-of-front direction
 * (angleSign = +1 forward, -1 rear). See header note: both directions share
 * one geometric formula, differing only in sign and (for the rear case) an
 * inserted about-face + overshoot. */
function buildCore(battalion, angleSign) {
  const oldFull = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: OLD_FACING });
  const pivot = oldFull.find((p) => p.id === `c${PIVOT_COMPANY_INDEX}-of-cpt`);
  const finalFull = wheel(oldFull, { pivotX: pivot.x, pivotY: pivot.y, angleDeg: angleSign * WHEEL_ANGLE });
  const newFacing = (OLD_FACING + angleSign * WHEEL_ANGLE + 360) % 360;
  // Rear case: companies approach rear-rank-leading, i.e. facing the
  // opposite of their eventual true-final facing, until the last "face
  // about" (¶863) restores the true front. Forward case needs no such
  // correction -- approach facing IS final facing.
  const approachFacing = angleSign === 1 ? newFacing : (newFacing + 180) % 360;

  const pivotOnlyFinal = withCompanyOverride(oldFull, finalFull, battalion, PIVOT_COMPANY_INDEX);

  const aboutFacedFull =
    angleSign === -1 ? withCompanyOverride(aboutFace(oldFull), finalFull, battalion, PIVOT_COMPANY_INDEX) : null;

  const stage1Input = angleSign === -1 ? aboutFacedFull : oldFull;
  const stage1Full = withCompanyOverride(
    perCompanyWheel(stage1Input, battalion, {
      excludeIndex: PIVOT_COMPANY_INDEX,
      angleDeg: angleSign * PARTIAL_WHEEL_ANGLE,
      useRearRankPivot: angleSign === -1,
    }),
    finalFull,
    battalion,
    PIVOT_COMPANY_INDEX
  );

  const cascadeTargetFull = buildCascadeTarget(finalFull, battalion, {
    pivotIndex: PIVOT_COMPANY_INDEX,
    approachFacing,
    paces: angleSign === 1 ? -UNDERSHOOT_OVERSHOOT_PACES : UNDERSHOOT_OVERSHOOT_PACES,
  });

  const party = buildColorParty(finalFull, { forwardPaces: 0 });
  const staff = buildFieldAndStaff(finalFull, {});

  return {
    oldFull,
    finalFull,
    pivotOnlyFinal,
    aboutFacedFull,
    stage1Full,
    cascadeTargetFull,
    party,
    staff,
    newFacing,
    approachFacing,
  };
}

const CASEY_PARAGRAPHS = Array.from({ length: 873 - 830 + 1 }, (_, i) => 830 + i);

export default {
  id: 'change-of-front',
  title: 'Changes of Front',
  part: 5,
  article: 12,
  caseyParagraphs: CASEY_PARAGRAPHS,
  subMovements: [
    { id: 'forward', label: 'Forward, on First Company (Halted)' },
    { id: 'forward-marching', label: 'Forward, on First Company (Marching)' },
    { id: 'rear', label: 'To the Rear, on First Company' },
  ],
  commands: (subMovement) => {
    if (subMovement === 'rear') {
      return [
        { text: '1. Change front to the rear, on first company.', type: 'preparatory' },
        { text: '2. Battalion, about—FACE.', type: 'execution' },
        { text: '3. By company, left half wheel.', type: 'preparatory' },
        { text: '4. MARCH (or double quick—MARCH).', type: 'execution' },
        { text: '5. Forward.', type: 'preparatory' },
        { text: '6. MARCH.', type: 'execution' },
        { text: '7. Guide left.', type: 'execution' },
        { text: 'Guides—POSTS.', type: 'execution' },
      ];
    }
    const marchingNote =
      subMovement === 'forward-marching'
        ? ' (1st company\'s own captain, in the same instant: "1. Right turn; 2. Quick time.")'
        : '';
    return [
      { text: '1. Change front forward on first company.', type: 'preparatory' },
      { text: '2. By company, right half wheel.', type: 'preparatory' },
      { text: '3. MARCH (or double quick—MARCH).' + marchingNote, type: 'execution' },
      { text: '4. Forward.', type: 'preparatory' },
      { text: '5. MARCH.', type: 'execution' },
      { text: '6. Guide right.', type: 'execution' },
      { text: 'Guides—POSTS.', type: 'execution' },
    ];
  },
  reenactorNotes:
    'Every "change of front" pivots on company 1 (the right/first company), which self-positions onto the new line BEFORE the battalion command fires (¶831, halted case) or as part of the same command (¶844-846, marching case) -- S.C. No. 189\'s company-scale wheel, re-cited verbatim rather than re-derived. The other 7 companies then each wheel roughly 45 degrees ("about a half wheel -- the eighth of the circle," ¶871) on their OWN individual fixed pivot -- not a single shared battalion pivot -- before marching straight and, one by one from the pivot outward, turning onto the final line the instant each reaches the point vacated by the company ahead of it (¶837-840): a company-to-company relay, modeled here with the same cascadeBlend() serial-timing primitive Article XI (form by file into line) uses for its own leading-company-first relay. The forward case halts each company 3 paces SHORT of the true line before a final "align by the right" closes the gap (¶838); the rear case is the geometric mirror -- because every non-pivot company has faced about (¶855) and therefore wheels and marches with its REAR rank leading (¶859-861), each company must cross 3 paces BEYOND the line, then face about a second time, to bring its true front rank onto it (¶862-863). Both directions nonetheless share one settled final geometry: despite the extra about-face bracket, the rear case\'s net rotation (about-face, left-wheel, re-about-face) works out to the same 90-degree turn as the forward case\'s single right-wheel, just opposite in sign -- so both are built from one wheel() of the whole old line about company 1\'s own original captain position (+90 forward, -90 rear), with the about-face/overshoot business layered on as intermediate keyframe detail, not a different destination. The colonel may instead pivot on the 8th (left) company "by inverse means" (¶850, ¶867) -- a mirror-image drill, documented here but not separately animated, since it is geometrically identical to the company-1 case reflected across the battalion\'s centre. ¶871-873\'s "oblique change of front" is likewise not separately animated: it is a continuous parameter on the SAME choreography (a shallower wheel angle, and, for angles of 45 degrees or less, no discrete turn-onto-line halt at all, per ¶872) rather than new choreography of its own. The color party and field-and-staff go unmentioned anywhere in ¶830-873 (contrast Article IV\'s explicit wheel-long choreography for them); they are computed once from the FINAL formed line via the shared colorPartyPosts.js helpers and held fixed at that post through every keyframe of a given sub-movement, a documented simplification rather than a sourced position. Casey\'s own "half wheel" (¶832/¶843/¶854, 45 degrees per ¶871\'s gloss) and this project\'s wheel() angle convention should not be confused with the 90-degree NET battalion rotation both cases converge on -- see the file header for the full reconciliation.',
  buildKeyframes: (battalion = DEFAULT_BATTALION, subMovement = 'forward') => {
    const angleSign = subMovement === 'rear' ? -1 : 1;
    const core = buildCore(battalion, angleSign);
    const { oldFull, finalFull, pivotOnlyFinal, aboutFacedFull, stage1Full, cascadeTargetFull, party, staff } = core;
    const combine = (positions) => [...positions, ...party, ...staff];

    const kfCo2Done_Co3Forming = cascadeBlend(
      stage1Full,
      cascadeTargetFull,
      cascadeProgress(CASCADE_ORDER, CASCADE_ORDER.indexOf(3), 0.5),
      groupOfId
    );
    const kfCo5Done_Co6Forming = cascadeBlend(
      stage1Full,
      cascadeTargetFull,
      cascadeProgress(CASCADE_ORDER, CASCADE_ORDER.indexOf(6), 0.5),
      groupOfId
    );

    if (subMovement === 'rear') {
      return [
        {
          label: 'Battalion halted in line of battle',
          description:
            'The battalion stands halted in line of battle, facing its original front. The colonel communicates privately to the first company\'s captain his intent to change front to the rear on that company.',
          caseyRef: '¶852',
          duration: 0,
          positions: combine(oldFull),
          annotations: [],
        },
        {
          label: 'First company about-faces, wheels left, re-fronts, and aligns on the new line',
          description:
            'Before any battalion command is given, the first company\'s captain faces his company about, wheels it to the left on the fixed pivot, halts it on the direction the colonel indicated, faces it back to the front, and aligns it by the right against two markers placed before the right and left files of its new (rear-facing) position.',
          caseyRef: '¶852',
          duration: 1600,
          positions: combine(pivotOnlyFinal),
          annotations: [],
        },
        {
          label: 'Battalion, about—FACE',
          description:
            'At the second command, every company except the first (already established on the new line) faces about. The captains of these companies place themselves behind the centre of their own company, two paces from what is now, by the about-face, their leading rank.',
          caseyRef: '¶854-857',
          duration: 1200,
          positions: combine(aboutFacedFull),
          annotations: [],
        },
        {
          label: 'By company, left half wheel — MARCH: each company wheels on the fixed pivot, by the rear rank',
          description:
            'At the command of execution, each company (save the first) wheels to the left on its own fixed pivot — now the covering sergeant\'s post, since the company has faced about and the rear rank leads. Each company\'s guide places himself on what is now functionally the left of the leading rank.',
          caseyRef: '¶857-859',
          duration: 1800,
          positions: combine(stage1Full),
          annotations: [],
        },
        {
          label: 'Forward — MARCH, Guide left: companies cross the new line in succession',
          description:
            'Companies stop wheeling and march straight, rear rank leading, taking the touch of the elbow to the left. The second company, once opposite the left of the first, turns to the left, crosses the new line of battle, and — front rank now trailing — halts three paces beyond it. Each following company repeats this in succession as it reaches the point opposite the left of the company already placed.',
          caseyRef: '¶860-864',
          duration: 1800,
          positions: combine(kfCo2Done_Co3Forming),
          annotations: [],
        },
        {
          label: 'Cascade continues down the line',
          description:
            'Each company in turn conforms to the same pattern, once the company ahead of it has crossed and halted — a company-to-company relay, not a fixed clock. The lieutenant-colonel assures the direction of the guides as they successively arrive on the new line.',
          caseyRef: '¶861-864, ¶870',
          duration: 1800,
          positions: combine(kfCo5Done_Co6Forming),
          annotations: [],
        },
        {
          label: 'Second company, HALT — faces about, aligns by the right; Guides—POSTS',
          description:
            'At HALT, files not yet in line with the guide close up promptly; the captain faces his company about a second time, bringing its true front rank onto the line, and aligns it by the right. Once the whole line is re-formed, the colonel commands "Guides—POSTS."',
          caseyRef: '¶863-866',
          duration: 1400,
          positions: combine(finalFull),
          annotations: [],
        },
      ];
    }

    if (subMovement === 'forward-marching') {
      return [
        {
          label: 'Battalion marching forward in line of battle',
          description:
            'The battalion marches forward in line of battle, on a straight course, ready to change front on the first company without an intervening halt.',
          caseyRef: '¶843',
          duration: 0,
          positions: combine(oldFull),
          annotations: [],
        },
        {
          label: 'Change front forward on first company; by company, right half wheel — captains move to the front-centre of their companies',
          description:
            'At the preparatory command, captains move rapidly to the centre-front of their companies. The first company\'s captain will, at the command of execution, turn his own company by the S.S. marching right-turn; the other captains merely caution their companies that they are about to wheel to the right.',
          caseyRef: '¶843-845',
          duration: 1200,
          positions: combine(oldFull),
          annotations: [],
        },
        {
          label: 'MARCH: first company executes a marching right turn; the rest wheel on their own fixed pivots',
          description:
            'The first company executes a right turn at quick time (S.S. No. 415), halts three paces short of the markers, closes promptly into line, and aligns by the right — the marching-case equivalent of the halted case\'s preliminary wheel, but executed within this same command rather than before it. Every other company wheels to the right on its own fixed pivot, exactly as in the halted case.',
          caseyRef: '¶846-847',
          duration: 1800,
          positions: combine(stage1Full),
          annotations: [],
        },
        {
          label: 'Forward — MARCH, Guide right: companies turn onto the new line in succession',
          description:
            'Executed exactly as indicated at ¶833 and following (the halted case\'s own cascading turn-onto-line): each company, once opposite the left of the company already placed, turns to the right and halts three paces short of the line.',
          caseyRef: '¶847-848',
          duration: 1800,
          positions: combine(kfCo2Done_Co3Forming),
          annotations: [],
        },
        {
          label: 'Cascade continues down the line',
          description:
            'Each company in turn repeats the identical pattern once the company ahead of it has completed its own — a company-to-company relay timed by each company\'s own arrival, not a fixed clock.',
          caseyRef: '¶847-848',
          duration: 1800,
          positions: combine(kfCo5Done_Co6Forming),
          annotations: [],
        },
        {
          label: 'Battalion formed on the new line, still marching — Guides—POSTS',
          description:
            'Files not yet aligned with the guide close up; captains align their companies by the right; the whole line, once formed, continues to march on the new direction. Guides return to their normal posts.',
          caseyRef: '¶848, ¶842',
          duration: 1400,
          positions: combine(finalFull),
          annotations: [],
        },
      ];
    }

    // Default: 'forward' (halted battalion, ¶830-842)
    return [
      {
        label: 'Battalion halted in line of battle',
        description:
          'The battalion stands halted in line of battle. The colonel places two markers on the new line before the first company\'s intended new position, and orders its captain to establish the company against them.',
        caseyRef: '¶830',
        duration: 0,
        positions: combine(oldFull),
        annotations: [],
      },
      {
        label: 'First company wheels onto the new line',
        description:
          'Before any battalion command is given, the first company\'s captain immediately wheels his company to the right on the fixed pivot onto the markers, halts it, and aligns it by the right.',
        caseyRef: '¶830-831',
        duration: 1600,
        positions: combine(pivotOnlyFinal),
        annotations: [],
      },
      {
        label: 'Change front forward on first company; by company, right half wheel — MARCH: each company begins its own wheel',
        description:
          'At the command of execution, every other company wheels to the right on its own fixed pivot, per the company-scale wheel already established (S.C. No. 189). Each company\'s captain has placed himself before its centre; its left guide places himself on its left as soon as he can get there.',
        caseyRef: '¶832-835',
        duration: 1800,
        positions: combine(stage1Full),
        annotations: [],
      },
      {
        label: 'Forward — MARCH, Guide right: companies turn onto the new line in succession',
        description:
          'When the colonel judges the companies have sufficiently wheeled, he commands "Forward — MARCH, Guide right": companies stop wheeling and march straight, touching elbows to the right. The second company, once opposite the left file of the first, turns to the right and, at three paces from the line, halts.',
        caseyRef: '¶835-838',
        duration: 1800,
        positions: combine(kfCo2Done_Co3Forming),
        annotations: [],
      },
      {
        label: 'Cascade continues down the line',
        description:
          'Each following company repeats what was prescribed for the second, in succession, as it reaches the point opposite the left of the company already established before it. The colonel gives general superintendence to the whole movement throughout.',
        caseyRef: '¶839-840, ¶869',
        duration: 1800,
        positions: combine(kfCo5Done_Co6Forming),
        annotations: [],
      },
      {
        label: 'Battalion formed on the new line of battle — Guides—POSTS',
        description:
          'Files not yet aligned with the guide close up promptly; the left guide posts on the line of battle; the lieutenant-colonel confirms each company\'s direction as it arrives; the captain aligns his company by the right. Once the whole line is formed, the colonel commands "Guides—POSTS."',
        caseyRef: '¶838-842',
        duration: 1400,
        positions: combine(finalFull),
        annotations: [],
      },
    ];
  },
};
