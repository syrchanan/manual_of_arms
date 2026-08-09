import { columnOfCompanies, divisionLineFromAnchor } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Fourth, Article III (S.B. ¶492-554): "Column at half distance, into
// line of battle" -- four named sub-cases per the article's own outline:
//   1. To the left (or right) into line of battle (¶492-499)
//   2. On the right (or left) into line of battle (¶500-529)
//   3. Forward, by deployment (¶530)
//   4. Faced to the rear (¶531-554)
//
// This project's default battalion is 8 COMPANIES; the article's text is
// company-numbered throughout ("captain of the 8th (rearmost) company...",
// ¶494), so companies (not the 4-division grouping) are the unit here, same
// choice as fullDistanceIntoLine.js and for the same reason.
//
// ¶492's HALTED variant of sub-case 1 is "no new mechanic" per the spec
// itself: the column first takes distances (Article IX, Part Third) and then
// forms line exactly as Article II. It is documented in reenactorNotes only
// -- not animated as its own sub-movement -- since it would just replay
// fullDistanceIntoLine.js after a distance-opening step. The sub-movement
// actually animated for case 1 is ¶493's MARCHING variant, "by the rear of
// column," which is the genuinely distinct mechanic (deployment starting
// from the REAR company while still at half distance).
//
// ENGINE APPROACH: as in fullDistanceIntoLine.js, the FINAL line for every
// sub-case is taken directly from divisionLineFromAnchor() (guaranteed
// continuous/gapless). Intermediate keyframes use discrete cascade snapshots
// -- substituting an increasing number of companies' FINAL positions into
// the marching state, in each sub-case's own historically-attested arrival
// order -- mirroring the snapshot technique already used in
// part-iii/changeDirectionHalf.js, rather than a single global tween.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 200;
const ORIGIN_Y = 220;
const MARCH_FACING = 90; // marching east
const LINE_FACING = 0; // line of battle faces north

function idsOfCompany(co) {
  return co.soldiers.map((s) => s.id);
}

/** Substitute the FINAL positions of the first `doneCount` companies of
 * `orderedCompanies` (the order in which they actually settle into line)
 * into the still-marching `waiting` positions; the rest keep marching. */
function cascadeSnapshot(waiting, finalMap, orderedCompanies, doneCount) {
  const doneIds = new Set(orderedCompanies.slice(0, doneCount).flatMap(idsOfCompany));
  return waiting.map((p) => (doneIds.has(p.id) ? finalMap.get(p.id) ?? p : p));
}

function buildMarchingAndFinal({ battalion, marchFacing = MARCH_FACING, lineFacing = LINE_FACING, anchorIndex = 0 }) {
  const marching = columnOfCompanies(battalion, {
    originX: ORIGIN_X,
    originY: ORIGIN_Y,
    facing: marchFacing,
    distanceMode: 'half',
  });
  const finalLine = divisionLineFromAnchor(battalion, anchorIndex, {
    originX: ORIGIN_X,
    originY: ORIGIN_Y,
    facing: lineFacing,
  });
  const finalMap = new Map(finalLine.map((p) => [p.id, p]));
  return { marching, finalLine, finalMap };
}

// ---------------------------------------------------------------------------
// Sub-case 1 (marching): "By the rear of column, left into line" (¶493-499)
// ---------------------------------------------------------------------------
function buildByRearOfColumn(battalion) {
  const { marching, finalLine, finalMap } = buildMarchingAndFinal({ battalion, anchorIndex: 0 });

  // Deployment order: rearmost (8th) company wheels first, then each company
  // forward of it in turn, as its own captain judges the gap (¶493-499).
  const rearFirst = [...battalion].reverse();

  const snap2 = cascadeSnapshot(marching, finalMap, rearFirst, 2);
  const snap4 = cascadeSnapshot(marching, finalMap, rearFirst, 4);
  const snap6 = cascadeSnapshot(marching, finalMap, rearFirst, 6);

  return [
    {
      label: 'Column at half distance, marching',
      description: 'The battalion, formed in column of companies at half distance, marches in a straight line of march.',
      caseyRef: '¶493',
      duration: 0,
      positions: marching,
      annotations: ['marchArrow'],
    },
    {
      label: 'Right general guide to the front; 8th company commands the wheel',
      description:
        'The right general guide moves rapidly to the front, positioning himself just beyond where the head of the column will rest, on the guide-line. The captain of the 8th (rearmost) company commands "Left into line, wheel"; the other captains caution their companies to keep marching straight ahead.',
      caseyRef: '¶494',
      duration: 1000,
      positions: marching,
      annotations: ['marchArrow'],
    },
    {
      label: '8th company wheels and halts on the line; the rest press on',
      description:
        "At MARCH, the 8th company's guide halts short and the company wheels left (wheeling-from-halt principles), halting near the line and aligning up. The other companies press briskly onward along the column's flank.",
      caseyRef: '¶496',
      duration: 1500,
      positions: snap2,
      annotations: ['wheelingArc'],
    },
    {
      label: 'Companies deploy in succession, rear to front',
      description:
        "As each captain judges enough gap has opened between his own company and the one ahead of it in line, he commands his own \"Left into line, wheel — MARCH.\" Each new company aligns on the company already established beside it (¶497). The lieutenant-colonel tracks the leading (i.e. first-deploying) guide; the senior major moves down the line assuring each guide as the previous one is set; the junior major stays abreast of the color company (¶498).",
      caseyRef: '¶495-498',
      duration: 1800,
      positions: snap4,
      annotations: ['wheelingArc', 'alignmentLine'],
    },
    {
      label: 'Most of the battalion has deployed',
      description: 'The greater part of the battalion is now on the line; the foremost companies are still arriving and wheeling in.',
      caseyRef: '¶495-497',
      duration: 1500,
      positions: snap6,
      annotations: ['wheelingArc', 'alignmentLine'],
    },
    {
      label: 'Battalion formed in line of battle',
      description: 'All 8 companies have wheeled into line, each dressed against the company beside it. The battalion stands formed, ready for Guides—POSTS.',
      caseyRef: '¶497-499',
      duration: 1200,
      positions: finalLine,
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sub-case 2: "On the right into line" (¶500-529) -- companies turn 90° and
// march up individually, front to rear, rather than wheeling.
// ---------------------------------------------------------------------------
function buildOnRightOrLeft(battalion) {
  const { marching, finalLine, finalMap } = buildMarchingAndFinal({ battalion, anchorIndex: 0 });

  // Deployment order: the leading (1st) company turns and forms first;
  // each following company continues straight on until it reaches the
  // flank of the company just placed, then turns in its own turn (¶505-514).
  const frontFirst = battalion;

  const snap2 = cascadeSnapshot(marching, finalMap, frontFirst, 2);
  const snap4 = cascadeSnapshot(marching, finalMap, frontFirst, 4);
  const snap6 = cascadeSnapshot(marching, finalMap, frontFirst, 6);

  return [
    {
      label: 'Column at half distance, marching',
      description: 'The battalion marches in column of companies at half distance, right in front.',
      caseyRef: '¶500',
      duration: 0,
      positions: marching,
      annotations: ['marchArrow'],
    },
    {
      label: 'Markers placed; On the right into line — Guide right',
      description:
        'The lieutenant-colonel plants two markers so the leading company will present its right shoulder to the battalion when formed (a 90° turn, not a wheel). The colonel commands "On the right into line. Battalion, guide right"; the right guide of each company marches straight forward, each following guide tracking the one ahead (¶500-503).',
      caseyRef: '¶500-503',
      duration: 1200,
      positions: marching,
      annotations: ['marchArrow'],
    },
    {
      label: 'Leading company turns and forms on the markers',
      description:
        'As the leading company nears the first marker, its captain commands "Right turn — MARCH": the company turns 90° (not a wheel) and marches up, halting 3 paces from the line, then "Right—DRESS" against the two markers. "These rules are general for all successive formations" (¶508).',
      caseyRef: '¶505-508',
      duration: 1500,
      positions: snap2,
      annotations: ['alignmentLine'],
    },
    {
      label: 'Following companies turn in succession',
      description:
        "Each company continues straight forward until it reaches the flank of the company just placed, then turns 90° in its own turn, halts 3 paces off, and dresses against the guide markers used by the company immediately to its inside -- not the original markers (¶509-514).",
      caseyRef: '¶509-514',
      duration: 1800,
      positions: snap4,
      annotations: ['alignmentLine'],
    },
    {
      label: 'Colonel follows the front, correcting each turn',
      description:
        'The colonel follows the formation along the front, always opposite the company currently turning, correcting early or late turns; the lieutenant-colonel establishes himself beyond each next turning point in succession (¶519-520). Each guide has at least 10 paces to cover after turning before reaching the line (¶523).',
      caseyRef: '¶514-520, ¶523',
      duration: 1500,
      positions: snap6,
      annotations: ['alignmentLine'],
    },
    {
      label: 'Guides—POSTS',
      description: 'All companies placed; the colonel commands "Guides—POSTS," and the markers before the leading company retire (¶515).',
      caseyRef: '¶515',
      duration: 1000,
      positions: finalLine,
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sub-case 3: "Forward, by deployment" (¶530) -- pure cross-reference to
// Article IV's deployment-from-mass mechanic; no independent mechanic here.
// ---------------------------------------------------------------------------
function buildForward(battalion) {
  const marching = columnOfCompanies(battalion, {
    originX: ORIGIN_X,
    originY: ORIGIN_Y,
    facing: MARCH_FACING,
    distanceMode: 'half',
  });
  const massed = columnOfCompanies(battalion, {
    originX: ORIGIN_X,
    originY: ORIGIN_Y,
    facing: MARCH_FACING,
    distanceMode: 'mass',
  });

  return [
    {
      label: 'Column at half distance, marching',
      description: 'The battalion marches in column of companies at half distance.',
      caseyRef: '¶530',
      duration: 0,
      positions: marching,
      annotations: ['marchArrow'],
    },
    {
      label: 'Column closed in mass',
      description:
        'The colonel first closes the column in mass (Part Third), reducing each company\'s distance to 6 paces between guides. This is a hand-off, not a distinct mechanic of its own: once closed, the battalion deploys on its leading subdivision exactly as Article IV describes -- see the Article IV deployment drills for the continuation of this movement.',
      caseyRef: '¶530',
      duration: 1500,
      positions: massed,
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sub-case 4: "Faced to the rear" (¶531-554) -- forms a line facing the
// OPPOSITE direction of the march, at the ground the column's head occupied.
// Casey's own mechanic is a double file-wheel loop (wheel by file left, pass
// the line, wheel by file left again) for the leading company; that literal
// looping path has no dedicated engine primitive at battalion scale (see the
// spec's own complexity note) and none was added here per the read-only
// engine scope, so the cascade below shows each company's DIRECT transition
// from its marching position to its final, rear-facing position rather than
// tracing the loop -- a simplification flagged in reenactorNotes.
// ---------------------------------------------------------------------------
function buildFacedToRear(battalion) {
  const rearLineFacing = (MARCH_FACING + 180) % 360;
  const { marching, finalLine, finalMap } = buildMarchingAndFinal({
    battalion,
    lineFacing: rearLineFacing,
    anchorIndex: 0,
  });

  // Leading (1st) company forms first, at the ground the column's head
  // occupied; each following company forms in turn (¶532-542).
  const frontFirst = battalion;

  const snap2 = cascadeSnapshot(marching, finalMap, frontFirst, 2);
  const snap4 = cascadeSnapshot(marching, finalMap, frontFirst, 4);
  const snap6 = cascadeSnapshot(marching, finalMap, frontFirst, 6);

  return [
    {
      label: 'Column at half distance, marching',
      description: 'The battalion marches in column of companies at half distance.',
      caseyRef: '¶531',
      duration: 0,
      positions: marching,
      annotations: ['marchArrow'],
    },
    {
      label: 'Into line, faced to the rear — Battalion, right FACE',
      description:
        'The colonel commands "Into line, faced to the rear. Battalion, right FACE." The leading company\'s captain faces it right and marches it, wheeling by file to the left to pass in rear of the line\'s left marker; the other companies face right and stand ready, captains beside their right guides (¶532-534).',
      caseyRef: '¶531-534',
      duration: 1200,
      positions: marching,
      annotations: ['marchArrow'],
    },
    {
      label: "Leading company loops in and halts, faced to the rear",
      description:
        'Once its first file is 3 paces past the line, the leading company wheels by file left a second time, placing itself in rear of the two markers; the captain halts it, faces it front, and aligns by the right against the markers -- a loop-around maneuver distinct from every prior sub-case (¶532-533).',
      caseyRef: '¶532-533',
      duration: 1800,
      positions: snap2,
      annotations: ['alignmentLine'],
    },
    {
      label: 'Companies form in succession, left guides detaching ahead',
      description:
        "Each following company's left guide hastens ahead (12-15 paces early, or all guides at once in double-quick) to mark the line; the captain halts, fronts, and dresses his company right as it arrives, closing any gaps to the right (¶536-542).",
      caseyRef: '¶536-542',
      duration: 1800,
      positions: snap4,
      annotations: ['alignmentLine'],
    },
    {
      label: 'Most companies formed, faced to the rear',
      description: 'The greater part of the battalion now stands on the line, facing the rear of the original march; the remaining companies are still arriving.',
      caseyRef: '¶536-542',
      duration: 1500,
      positions: snap6,
      annotations: ['alignmentLine'],
    },
    {
      label: 'Guides—POSTS',
      description: 'All companies formed, faced to the rear of the original line of march. The colonel commands "Guides—POSTS" (¶544).',
      caseyRef: '¶544',
      duration: 1200,
      positions: finalLine,
      annotations: [],
    },
  ];
}

export default {
  id: 'half-distance-into-line',
  title: 'Column at Half Distance, into Line of Battle',
  part: 4,
  article: 3,
  // Skirmisher-only paragraphs (495, 499, 504, 517, 518, 533, 535, 543, 550,
  // 552 -- present in the source only as 0-N) are excluded; only mainline
  // battalion paragraphs are listed.
  caseyParagraphs: [
    492, 493, 494, 496, 497, 498, 500, 501, 502, 503, 505, 506, 507, 508, 509, 510,
    511, 512, 513, 514, 515, 516, 519, 520, 521, 522, 523, 524, 525, 526, 527, 528, 529,
    530, 531, 532, 534, 536, 537, 538, 539, 540, 541, 542, 544, 545, 546, 547, 548,
    549, 551, 553, 554,
  ],
  subMovements: [
    { id: 'by-rear-of-column', label: '1. By the Rear of Column, into Line' },
    { id: 'on-right-or-left', label: '2. On the Right into Line' },
    { id: 'forward', label: '3. Forward, by Deployment' },
    { id: 'faced-to-rear', label: '4. Faced to the Rear, into Line' },
  ],
  commands: (subMovement) => {
    switch (subMovement) {
      case 'on-right-or-left':
        return [
          { text: '1. On the right into line.', type: 'preparatory' },
          { text: '2. Battalion, guide right.', type: 'execution' },
          { text: '1. Right turn.', type: 'preparatory' },
          { text: '2. MARCH (or double quick—MARCH).', type: 'execution' },
          { text: '1. Such company. 2. HALT.', type: 'execution' },
          { text: '3. Right—DRESS.', type: 'execution' },
          { text: 'Guides—POSTS.', type: 'execution' },
        ];
      case 'forward':
        return [
          { text: '(Close the column in mass — Part Third.)', type: 'preparatory' },
          { text: '(Deploy on the leading subdivision — Part Fourth, Article IV.)', type: 'execution' },
        ];
      case 'faced-to-rear':
        return [
          { text: '1. Into line, faced to the rear.', type: 'preparatory' },
          { text: '2. Battalion, right—FACE.', type: 'execution' },
          { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
          { text: 'Guides—POSTS.', type: 'execution' },
        ];
      default: // 'by-rear-of-column'
        return [
          { text: '1. By the rear of column left (or right) into line, wheel.', type: 'preparatory' },
          { text: '2. MARCH (or double quick—MARCH).', type: 'execution' },
        ];
    }
  },
  reenactorNotes:
    "Four named sub-cases, per the article's own outline. (1) ¶492's HALTED case is 'no new mechanic': the colonel first has the column take distances (Article IX, Part Third), then forms into line exactly as Article II (¶464 ff.) -- not separately animated here, since it would just replay fullDistanceIntoLine.js after a distance-opening step. The MARCHING case, ¶493-499 ('by the rear of column'), IS animated: deployment happens company-by-company while still at half distance, starting from the REAR (8th) company and working forward, each captain timing his own wheel off the visible gap ahead of him -- the battalion's first 'successive formation,' and notably the directing company here is the REARMOST, the reverse of Article II's directing FIRST company. " +
    "(2) ¶500-529, 'on the right into line': fundamentally different geometry from either wheel case -- companies do not wheel at all, they turn 90° individually and march up to snap into a queued position, front company first, each following company tracking the flank of the one just placed. Minimum-clearance constraint: each guide needs at least 10 paces after turning to reach the line (¶523). Oblique-line variants for training in any direction (¶524-525) and the fire-by-file mechanics that accompany successive formations (¶528-529) are noted in the spec but out of this animation's scope (manual-of-arms/firing mechanics, matching this project's existing convention). " +
    "(3) ¶530, 'forward, by deployment': one paragraph, purely a hand-off -- close the column in mass, then deploy on the leading subdivision exactly as Article IV. Shown here only as far as 'closed in mass'; the actual deployment is Article IV's drill. " +
    "(4) ¶531-554, 'faced to the rear': forms a line facing the OPPOSITE direction from the column's march, at the ground the column's head occupied. Casey's mechanic for the leading company is a double file-wheel LOOP (wheel by file left, pass in rear of the line, wheel by file left again) -- geometrically distinct from every other sub-case in this Part, closer to a countermarch than an ordinary line-forming wheel. No dedicated loop-tracing primitive exists in this project's battalion engine (battalionFormations.js/formations.js were read-only for this drill), so the animation shows each company's direct transition from column to its final rear-facing position rather than tracing the physical loop -- flagged here as a simplification, not a claim that the historical path was a straight cross-cut. If a countermarch/file-wheel-loop primitive is added to the engine later (the spec suggests checking Part Third's own countermarch work), this sub-movement is the natural place to upgrade the animation. Only the HALTED-start commands (¶531) are modeled; the marching-column variant (¶547-554, 'Battalion, by the right flank') follows the same principles with a different second command and is documented here only, not separately animated. " +
    "As in fullDistanceIntoLine.js, only the right-in-front / 'left into line' (or 'on the right') sense of each sub-case is animated; the left-in-front mirrors (¶521-522 for case 2, ¶546 for case 4) follow 'the same principles and inverse means' and are not separately built, consistent with this project's existing mirror-case precedent (lesson-vi/formOnRightLeft.js).",

  buildKeyframes: (_company, subMovement = 'by-rear-of-column', battalion = DEFAULT_BATTALION) => {
    switch (subMovement) {
      case 'on-right-or-left':
        return buildOnRightOrLeft(battalion);
      case 'forward':
        return buildForward(battalion);
      case 'faced-to-rear':
        return buildFacedToRear(battalion);
      default:
        return buildByRearOfColumn(battalion);
    }
  },
};
