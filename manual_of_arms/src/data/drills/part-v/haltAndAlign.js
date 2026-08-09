import { battalionLine } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION, COLOR_COMPANY_INDEX, NUM_COMPANIES } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';
import {
  buildColorParty,
  buildFieldAndStaff,
  colorFileAnchor,
  captainPos,
  offsetPaces,
} from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article III (S.B. ¶699-716): "To halt the battalion marching
// in line of battle, and to align it."
//
// Per the spec's complexity note, this article has two genuinely different
// paths: a simple halt-and-rectify (¶699-703, "a straightforward
// generalization" of lesson-iii/haltAndAlign.js -- each captain eyeballs
// and corrects his own company) and a much bigger general-alignment
// operation (¶704-715, guides chain-post on a newly-indicated line, then
// every company dresses up to its own guide). Both are modeled here via the
// 'rectify' / 'general-alignment' sub-movements, per the spec's own
// recommendation to build the simple path first and treat the general path
// as a separate, larger piece.
//
// Wing split: Casey does not fix the right/left wing boundary for an
// 8-company battalion. This project uses a 4/4 split (companies 1-4 right
// wing, 5-8 left wing, color company = first of the left wing) -- a clean,
// defensible choice consistent with battalion.js's own "not fixed by Casey"
// COLOR_COMPANY_INDEX note.
//
// General-alignment simplification: rather than chain-computing each
// company guide's proportional spacing along the new line by hand (the
// spec flags this as possibly needing a wholly new "dress to a pre-marked
// line" primitive), this drill uses battalionLine() itself at a new
// origin/facing as the FINAL dressed state -- battalionLine() already *is*
// the "everyone on one continuous line" primitive, so the new line's
// company guides are simply that final state's own nc-cov/fc-2sg positions.
// The animation shows each company's guide (¶706: right guide for
// right-wing companies, left guide for left-wing companies) jumping onto
// the new line first, then the rest of the company dressing up to it --
// which is the visual substance of ¶706-709 without re-deriving the
// per-company spacing math from scratch.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 60;
const ORIGIN_Y = 260;
const FACING = 0;

const STAFF_SCALE = 0.22;
function staffPaces(paces) {
  return paces >= 20 ? paces * STAFF_SCALE : paces;
}

function combine(soldiers, colorParty, fieldStaff) {
  return [...soldiers, ...colorParty, ...fieldStaff];
}

/** ¶706: right guide (nc-cov) for right-wing companies, left guide (fc-2sg)
 * for left-wing companies -- see header comment for the 4/4 wing split. */
function companyGuideId(index, numCompanies = NUM_COMPANIES) {
  return index <= numCompanies / 2 ? `c${index}-nc-cov` : `c${index}-fc-2sg`;
}

// Small lateral step + turn a captain makes to sight along his own
// company's rank, same interpretive device already used at company scale
// in lesson-iii/haltAndAlign.js (¶100's "glance the eye along the rank" is
// not given an exact motion by Casey).
const SIGHT_STEP_PX = 6;
const SIGHT_FACING = 270;

function fieldStaffHaltedFallback(positions) {
  return buildFieldAndStaff(positions, {});
}

export default {
  id: 'halt-and-align-line',
  title: 'To Halt the Battalion Marching in Line, and Align It',
  part: 5,
  article: 3,
  caseyParagraphs: [699, 700, 701, 702, 703, 704, 705, 706, 707, 708, 709, 710, 711, 712, 713, 714, 715],
  subMovements: [
    { id: 'rectify', label: 'Simple Rectify' },
    { id: 'general-alignment', label: 'General Alignment' },
  ],
  commands: [
    { text: '1. Battalion. 2. HALT.', type: 'execution' },
    { text: 'Color and general guides—POSTS.', type: 'execution' },
    { text: 'Captains, rectify the alignment.', type: 'execution' },
    { text: '1. Guides—ON THE LINE.', type: 'preparatory' },
    { text: '2. On the centre—DRESS.', type: 'execution' },
    { text: '3. Color and guides—POSTS.', type: 'execution' },
  ],
  reenactorNotes:
    "The 'rectify' sub-movement (¶699-703) is the low-risk, direct generalization of lesson-iii/haltAndAlign.js: the battalion halts, the color-rank and general guides remain in front until recalled, and if the colonel wants only a simple rectify (not a full new alignment) each captain glances along his own company and corrects it, supervised by the lieutenant-colonel. The 'general-alignment' sub-movement (¶704-715) is the bigger operation: the colonel establishes a new direction on the right general guide and color-bearer, the wing-appropriate guide of every company (right guide for the right wing, left guide for the left wing -- see this file's header comment on the 4/4 wing split, not fixed by Casey for an 8-company example) chain-posts onto that new line, and every company then marches up in quick time to dress against its own guide. This drill uses battalionLine() at a new origin/facing as the ready-made 'everyone on one continuous line' final state rather than hand-deriving each guide's proportional spacing (¶706's 'distance equal to the front of his own company') -- see header comment for the full rationale. The new line shown is drawn at a modest oblique angle purely to illustrate ¶710's 'if the alignment is oblique' case; a colonel choosing a parallel realignment would simply pick a new line at the same facing.",

  buildKeyframes: (_company, subMovement = 'rectify', battalion = DEFAULT_BATTALION) => {
    const halted = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });
    const cpAdvanced = buildColorParty(halted, { forwardPaces: 6, atRest: false });
    const fsAdvanced = buildFieldAndStaff(halted, {
      'fs-ltc': { ...offsetPaces(captainPos(halted, COLOR_COMPANY_INDEX), FACING, { right: 13.5 }), facing: FACING },
      'fs-smaj': { ...offsetPaces(colorFileAnchor(halted), FACING, { forward: 6, right: 7 }), facing: FACING },
    });

    const kfHalt = {
      label: 'Battalion, HALT',
      description:
        'At the second command the battalion halts. The color-rank and general guides remain in front, in their marching posts -- they are not automatically restored to the line.',
      caseyRef: '¶699–700',
      duration: 1000,
      positions: combine(halted, cpAdvanced, fsAdvanced),
      annotations: [],
    };

    if (subMovement === 'general-alignment') {
      // ¶704: colonel establishes the right general guide and color-bearer
      // on the new direction; both face him.
      const guideRightPos = cpAdvanced.find((p) => p.id === 'guide-right');
      const colOutside = offsetPaces(guideRightPos, FACING, { right: staffPaces(10) });
      const fsEstablishing = buildFieldAndStaff(halted, {
        'fs-col': { ...colOutside, facing: FACING },
        'fs-ltc': fsAdvanced.find((p) => p.id === 'fs-ltc'),
        'fs-smaj': fsAdvanced.find((p) => p.id === 'fs-smaj'),
      });
      const kfEstablish = {
        label: 'Colonel establishes the new direction',
        description:
          'The colonel moves some paces outside the right general guide, cautions him and the color-bearer to face him, and establishes them by sword signal on the desired direction (parallel or oblique). The left general guide will place himself on their direction, assured by the senior major.',
        caseyRef: '¶704',
        duration: 1200,
        positions: combine(halted, cpAdvanced, fsEstablishing),
        annotations: [],
      };

      // The new line of battle: a modest oblique shift, illustrating
      // ¶710's "if the alignment is oblique" case (see header comment).
      const NEW_FACING = (FACING + 8) % 360;
      const newAnchorCap = offsetPaces(captainPos(halted, 1), FACING, { forward: 10, right: 4 });
      const finalLine = battalionLine(battalion, {
        originX: newAnchorCap.x,
        originY: newAnchorCap.y,
        facing: NEW_FACING,
      });
      const finalMap = new Map(finalLine.map((p) => [p.id, p]));

      const guideIds = new Set(battalion.map((co) => companyGuideId(co.index)));
      const guidesOnLine = halted.map((p) => (guideIds.has(p.id) ? finalMap.get(p.id) : p));
      const cpOnLine = buildColorParty(finalLine, { forwardPaces: 0, atRest: true });
      const fsOnLine = buildFieldAndStaff(finalLine, {
        'fs-col': { ...offsetPaces(colorFileAnchor(finalLine), NEW_FACING, { right: staffPaces(10) }), facing: NEW_FACING },
      });
      const kfGuidesOnLine = {
        label: 'Guides — ON THE LINE',
        description:
          'The right guide of each right-wing company, and the left guide of each left-wing company, each places himself on the direction of the color-bearer and the two general guides, in rear of the guide next before him at a distance equal to the front of his own company -- a chained guide-placement across all 8 companies. (¶707 also shifts the captains to their companies\' opposite flanks; that individual-captain movement is not shown at this square/block scale.)',
        caseyRef: '¶705–706, ¶708',
        duration: 1800,
        positions: combine(guidesOnLine, cpOnLine, fsOnLine),
        annotations: [],
      };

      const kfDress = {
        label: 'On the centre — DRESS',
        description:
          'The companies move up in quick time against their guides; each captain aligns his own company by the prescribed principles, and the lieutenant-colonel aligns the color-company. Captains conform their companies to the new direction, oblique or parallel, while conducting them toward the line.',
        caseyRef: '¶709–710',
        duration: 2000,
        positions: combine(finalLine, cpOnLine, fsOnLine),
        annotations: [],
      };

      const fsFinal = buildFieldAndStaff(finalLine, {});
      const cpFinal = buildColorParty(finalLine, { forwardPaces: 0, atRest: true });
      const kfPosts = {
        label: 'Color and guides — POSTS',
        description:
          'The battalion is aligned. The color-bearer, general and company guides, and the right-wing captains take their places in the line of battle; the color-bearer replaces the color-lance\'s heel against his right hip.',
        caseyRef: '¶711–712',
        duration: 1000,
        positions: combine(finalLine, cpFinal, fsFinal),
        annotations: [],
      };

      return [kfHalt, kfEstablish, kfGuidesOnLine, kfDress, kfPosts];
    }

    // --- 'rectify' path (¶700-703) ---
    const cpAtRest = buildColorParty(halted, { forwardPaces: 0, atRest: true });
    const fsHalted = fieldStaffHaltedFallback(halted);
    const kfPosts = {
      label: 'Color and general guides — POSTS',
      description:
        'Not intending an immediate advance or a general alignment, the colonel commands "Color and general guides—POSTS." The color-rank and general guides retake their places in the line of battle; captains in the left wing shift back to the right of their companies.',
      caseyRef: '¶700–701',
      duration: 1000,
      positions: combine(halted, cpAtRest, fsHalted),
      annotations: [],
    };

    const rectifying = halted.map((s) => {
      const isCaptain = battalion.some((co) => `c${co.index}-of-cpt` === s.id);
      if (isCaptain) return { ...s, x: s.x + SIGHT_STEP_PX, facing: SIGHT_FACING };
      return s;
    });
    const kfRectify = {
      label: 'Captains, rectify the alignment',
      description:
        'The colonel judges only a rectify is needed. Each captain casts an eye toward the centre, aligns himself on the alignment basis (which the lieutenant-colonel ensures is well directed), then promptly dresses his own company. The lieutenant-colonel admonishes any captain not accurately aligned.',
      caseyRef: '¶702–703',
      duration: 1500,
      positions: combine(rectifying, cpAtRest, fsHalted),
      annotations: [],
    };

    const kfDone = {
      label: 'Ranks rectified — captains resume their posts',
      description: 'The alignment corrected, every captain resumes his habitual post at the head of his company.',
      caseyRef: '¶703',
      duration: 500,
      positions: combine(halted, cpAtRest, fsHalted),
      annotations: [],
    };

    return [kfHalt, kfPosts, kfRectify, kfDone];
  },
};
