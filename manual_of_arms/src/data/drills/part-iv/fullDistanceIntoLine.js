import { columnOfCompanies, divisionLineFromAnchor, cascadeBlend } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';

// ---------------------------------------------------------------------------
// Part Fourth, Article II (S.B. ¶464-491): "Column at full distance, right
// in front, to the left into line of battle" (and its mirror, "to the
// right").
//
// Per ¶464-472: every company wheels simultaneously, each on its own pivot
// flank (¶466), then dresses successively right-to-left (or left-to-right
// for the mirror) onto the company already established beside it (¶467-468).
// The FIRST company of the march is the anchor -- ¶465 has only its guide
// pre-positioned on the line, and ¶468 gives it a different dressing
// reference (its own guide) than every other company (which dresses on the
// company to its right/left already in line).
//
// This project's default battalion is 8 COMPANIES (not divisions) -- ¶466's
// "each company" language, and ¶493-499's later company-numbered sequence
// ("captain of the 8th company... 7th company..."), both describe this
// article's core mechanic at company granularity. The 4-division grouping
// suggested for Part Fourth generally is Article IV's own unit (its worked
// example is explicitly division-based); Article II/III's text never groups
// by division except as the ¶475 "column by division" VARIANT, which is not
// separately animated here (documented in reenactorNotes instead, per scope).
// divisionLineFromAnchor()/columnOfCompanies() both accept bare companies as
// "single-company divisions" (see battalionFormations.js docstrings), so no
// engine change is needed to work at company scale.
//
// ENGINE APPROACH: rather than hand-deriving each company's own wheel arc
// (fragile to get pixel-continuous with 8 units), the FINAL line is taken
// directly from divisionLineFromAnchor() -- which already guarantees a
// continuous, gapless line -- and intermediate keyframes are produced with
// cascadeBlend() between the marching-column state and that final state,
// using a small per-company progress stagger to depict the chain-dress
// (each company finishing "an instant" after the one it dresses on),
// mirroring the stagger technique already used in lesson-v/formIntoLine.js.
// ---------------------------------------------------------------------------

const ANCHOR_Y = 250;
const MARCH_Y = 250;

function groupOfId(id) {
  const m = /^c(\d+)-/.exec(id);
  return m ? Number(m[1]) : null;
}

/** Build a { companyIndex: progress } map from an array of companies already
 * ordered start-to-finish (i.e. the order in which each company completes
 * its wheel/dress), with a small stagger between consecutive companies. */
function staggeredProgress(orderedCompanies, { start = 1, step = 0.05 } = {}) {
  const progress = {};
  orderedCompanies.forEach((co, i) => {
    progress[co.index] = Math.max(0, start - i * step);
  });
  return progress;
}

export default {
  id: 'full-distance-into-line',
  title: 'Column at Full Distance, into Line of Battle',
  part: 4,
  article: 2,
  caseyParagraphs: [464, 465, 466, 467, 468, 469, 470, 471, 472, 473, 474],
  subMovements: [
    { id: 'left', label: 'Right in Front — Left into Line' },
    { id: 'right', label: 'Left in Front — Right into Line' },
  ],
  commands: (subMovement) => {
    const side = subMovement === 'right' ? 'Right' : 'Left';
    return [
      { text: `1. ${side} into line, wheel.`, type: 'preparatory' },
      { text: '2. MARCH (or double quick—MARCH).', type: 'execution' },
      { text: '3. Such company. HALT.', type: 'execution' },
      { text: '4. Right—DRESS (or Left—DRESS).', type: 'execution' },
      { text: '5. FRONT.', type: 'execution' },
      { text: '6. Guides—POSTS.', type: 'execution' },
    ];
  },
  reenactorNotes:
    "Before commanding, the colonel assures the guides' positions by Article I's staking means (¶464). At the first command, the right guide (or, left in front, the left guide) of the LEADING company hastens to the perpendicular direction line the whole column will wheel onto, positioning himself opposite one of the three flank files of his own company as it will stand in line (¶465). At MARCH, briskly repeated by each captain, every company wheels simultaneously, each on its own pivot flank -- the LEFT front-rank man of each company faces left and rests his breast on his guide's right arm for a left wheel (mirror for right), 'on the principle of wheeling from a halt' (cross-ref S.C. No. 244, this project's formIntoLine.js) (¶466). Each captain watches his own company and halts it 3 paces from the line, then dresses it up against the company already in place on its right (or left) -- a CHAIN, not a single simultaneous dress; only the anchor (first/right, or first/left for the mirror) company dresses on its OWN guide, since it has no company yet in line beside it (¶467-468). Guides then return to their normal posts, passing through the nearest captain's interval; file closers place themselves 2 paces behind the rear rank; the colonel, lieutenant-colonel, majors, adjutant and sergeant-major return to their line-of-battle posts (¶469-472) -- general rules for all line-of-battle formations. " +
    "Left-in-front mirror (¶473-474): the left guide of the left (leading) company takes the role ¶465 gives the right guide of the right company, and captains align by the LEFT at Guides-POSTS. " +
    "TWO CASES DELIBERATELY NOT ANIMATED, per the spec's own complexity notes: 'By inversion' (¶484-489) is a pure handedness flip of this same wheel-into-line geometry -- used when a right-in-front column must form to its reverse (right) flank by the shortest path -- implementable as a mirrored parameter on this same mechanic rather than new geometry, so it is not given its own sub-movement here. 'Successive formations' (¶490-491) is a transition-DEFINITION, not a maneuver of its own: it names the pattern used by Article III's sub-cases (subdivisions arriving on the line one after another, in mixed quick/double-quick time) as opposed to this Article's simultaneous wheel; Article III's own drill file is where that pattern is actually animated. The ¶475 'column by division' variant (same commands/means, but only the FIRST right-hand company's guide is assured directly, others align off division guides) is likewise a staging/officer-choreography nuance on top of this identical geometry, not a distinct animation.",

  buildKeyframes: (_company, subMovement = 'left', battalion = DEFAULT_BATTALION) => {
    const isRight = subMovement === 'right';

    // March order = the order companies actually arrive at the head of the
    // column. Right-in-front ("left" sub-movement): company 1 leads.
    // Left-in-front ("right" sub-movement, ¶473-474 mirror): company 8 leads.
    const marchOrder = isRight ? [...battalion].reverse() : battalion;
    const marchFacing = isRight ? 270 : 90; // west vs east, so both wheel to facing 0 (north)
    const originX = isRight ? 110 : 1600;

    const marching = columnOfCompanies(marchOrder, {
      originX,
      originY: MARCH_Y,
      facing: marchFacing,
      distanceMode: 'full',
    });

    // Final line: always natural battalion order (company 1 rightmost ...
    // company 8 leftmost); the anchor is whichever company led the march.
    // anchorIndex 0 = company 1 (right-in-front case), 7 = company 8
    // (left-in-front mirror).
    const anchorIndex = isRight ? battalion.length - 1 : 0;
    const anchorOriginX = isRight ? 110 : 1600;
    const finalLine = divisionLineFromAnchor(battalion, anchorIndex, {
      originX: anchorOriginX,
      originY: ANCHOR_Y,
      facing: 0,
    });

    // Chain-dress order follows march order (each company dresses on the one
    // ahead of it as it arrives), so the stagger below walks marchOrder.
    const midProgress = Object.fromEntries(marchOrder.map((co) => [co.index, 0.5]));
    const dressProgress = staggeredProgress(marchOrder, { start: 1, step: 0.05 });

    const wheeling = cascadeBlend(marching, finalLine, midProgress, groupOfId);
    const dressing = cascadeBlend(marching, finalLine, dressProgress, groupOfId);

    // Anchor company's marker position (right guide for the left-in-front-
    // wheels-left case, left guide for the mirror), read off the FINAL line
    // so the "first command" annotation shows where the guide is headed.
    const anchorCompanyIndex = marchOrder[0].index;
    const guideId = isRight ? `c${anchorCompanyIndex}-fc-2sg` : `c${anchorCompanyIndex}-nc-cov`;
    const guideMarker = finalLine.find((p) => p.id === guideId);

    const sideWord = isRight ? 'Right' : 'Left';

    return [
      {
        label: `Column at full distance, ${isRight ? 'left' : 'right'} in front, halted`,
        description:
          'The battalion stands in column of companies at full distance, halted, ready to form line of battle.',
        caseyRef: '¶464',
        duration: 0,
        positions: marching,
        annotations: [],
      },
      {
        label: `First command — ${anchorCompanyIndex === marchOrder[0].index ? "leading company's guide" : "guide"} moves to the direction line`,
        description:
          "At the first command, the guide of the leading company hastens to the perpendicular direction line the whole column will wheel onto, opposite one of the three flank files of his own company as it will stand in line. The lieutenant-colonel assures this position.",
        caseyRef: '¶465',
        duration: 1000,
        positions: marching,
        annotations: guideMarker
          ? [{ type: 'wheelingPoint', pivotX: guideMarker.x, pivotY: guideMarker.y }]
          : [],
      },
      {
        label: `${sideWord} into line, wheel — MARCH`,
        description:
          "At MARCH, every company wheels simultaneously, each on its own pivot flank -- the marching flank of each company takes full steps while the pivot flank stands fast, exactly as a company-scale wheel from a halt.",
        caseyRef: '¶466',
        duration: 1800,
        positions: wheeling,
        annotations: ['wheelingArc'],
      },
      {
        label: 'Companies halt and dress in succession',
        description:
          `Each captain halts his own company 3 paces from the line, then dresses it against the company already established beside it -- a chain proceeding ${isRight ? 'left to right' : 'right to left'}; only the anchor company dresses on its own guide.`,
        caseyRef: '¶467-468',
        duration: 1800,
        positions: dressing,
        annotations: ['alignmentLine'],
      },
      {
        label: 'FRONT — Guides, POSTS',
        description:
          'Each captain commands FRONT; guides return to their normal posts through the nearest captain\'s interval; file closers place themselves 2 paces behind the rear rank; the colonel, lieutenant-colonel and majors resume their line-of-battle posts.',
        caseyRef: '¶469-472',
        duration: 1200,
        positions: finalLine,
        annotations: [],
      },
    ];
  },
};
