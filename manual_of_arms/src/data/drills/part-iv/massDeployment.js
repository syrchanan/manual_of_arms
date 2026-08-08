import { columnOfCompanies, divisionLineFromAnchor, cascadeBlend } from '../../../engine/battalionFormations.js';
import { translate } from '../../../engine/formations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Fourth, Article IV (S.B. ¶555-647): "Deployment of columns closed in
// mass."
//
// Casey's ¶555 overview gives three ways a mass column can form line; this
// drill covers mode 1 only, "faced to the front, by the deployment" -- the
// other two (faced to the rear via countermarch; faced to a flank via change
// of direction, then deployment) compose this same mechanic with material
// from other Parts/Articles and are not re-derived here.
//
// GEOMETRY CHOICE -- no wheel, no net change of body-facing between the
// column and the final line: "faced to the front" deployment means the
// deployed line faces the SAME direction the column was marching (¶555 mode
// 1), unlike Article II/III's wheel-into-line (which turns the body 90
// degrees to face perpendicular to the march). Column and final line both
// use FACING = 0 (north) here: the column's divisions are stacked in DEPTH
// along y (one behind another, mass-closed at 6 paces/84px per ¶333), and
// the deployed line spreads in WIDTH along x -- matching the wide
// CANVAS_BATTALION viewBox. Divisions off the anchor DO physically turn 90
// degrees left or right at the second command (¶562, ¶595, ¶622-623) to
// march "by the flank" into position, then FRONT again once dressed -- but
// since that turn starts and ends at the same body-facing (0), the
// illustrative cascade below shows it as one smooth position+facing glide
// per division rather than three discrete keyframes each. This mirrors the
// same simplification part-iii/changeDirectionHalf.js and
// part-iv/fullDistanceIntoLine.js already use for chained/cascaded
// maneuvers: the FINAL state is geometrically exact (divisionLineFromAnchor's
// own guarantee), only the in-between frames are illustrative.
//
// ANCHOR STAYS PUT: for all three cases (first, rearmost, interior division)
// the directing division never changes its own column position. Casey has it
// "stand fast" in the first/rearmost cases (¶560, ¶591); the interior case's
// anchor takes one small independent step forward once "nearly unmasked"
// (¶623), simplified here to "stands fast" too, matching the front/rear
// anchors' treatment -- the spec flags that third behavior as its own piece
// of engine work, out of scope for this pass. Every OTHER division's final
// position/facing is read directly from divisionLineFromAnchor(), anchored at
// the directing division's own actual column coordinates, so the anchor is
// pinned by construction rather than by a special case in the code.
//
// INTERIOR DIVISION WORKED EXAMPLE: the 2nd division (companies 3-4, array
// index 1) is the directing division for the interior case. One division
// (1st, companies 1-2) marches ahead of it in the column and, per ¶622
// ("divisions that belong to the right of the directing division face
// right"), faces RIGHT to peel to the anchor's right using rearmost-division
// mechanics (¶593 ff). Two divisions (3rd & 4th, companies 5-8) trail behind
// it and face LEFT to peel to the anchor's left using first-division
// mechanics (¶560 ff). Both groups move CONCURRENTLY within the same
// keyframe set -- the genuinely novel bidirectional case per ¶621-631, with
// no analog in Articles II-III or the front/rear-anchor cases above. Any
// interior division works by the same principle (¶621, "on such division");
// the 2nd was picked for an asymmetric 1-vs-2 split that makes the
// simultaneity visually obvious (a symmetric 2-vs-2 split would look
// identical to two independent single-direction peels happening to
// coincide).
//
// MARCHING (NO-HALT) VARIANTS -- ¶580-590 (first division), ¶610-620
// (rearmost), ¶626-630 (interior) -- are NOT separate sub-movements. Each
// uses the identical peel/face/march-by-the-flank geometry already animated
// here; the only differences are procedural (the anchor division halts
// itself in stride rather than already standing halted; guides detach
// earlier; the colonel may resume the march before every division has
// finished forming, ¶620) -- officer-choreography and timing nuances the
// engine has no distinct primitive for, so they are documented in
// reenactorNotes rather than built as their own keyframe sequences.
//
// Field-and-staff figures, the lieutenant-colonel/major supervisory posts,
// and the ground markers (¶556-558, ¶563, ¶596) are not separately rendered,
// matching this project's existing battalion-block-view convention (see
// part-i/openCloseRanks.js).
// ---------------------------------------------------------------------------

const CANVAS_CENTER_X = CANVAS_BATTALION.VIEW_W / 2;
const COL_ORIGIN_Y = 120; // division 0 (head of column)'s depth position
const FACING = 0; // both column march and final line face north; see header note above

function rangeArr(from, to) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(n);
  return out;
}

// Maps a soldier id ("c3-of-cpt", "c7-fr-9", ...) to its DIVISION index
// (0-3): companies 1-2 -> division 0, 3-4 -> division 1, 5-6 -> division 2,
// 7-8 -> division 3, per DEFAULT_BATTALION's numbering convention.
function groupOfId(id) {
  const m = /^c(\d+)-/.exec(id);
  if (!m) return null;
  return Math.floor((Number(m[1]) - 1) / 2);
}

function buildDivisions(battalion) {
  const divisions = [];
  for (let d = 0; d < battalion.length / 2; d++) {
    divisions.push({ companies: [battalion[d * 2], battalion[d * 2 + 1]] });
  }
  return divisions;
}

/**
 * Build the column-closed-in-mass state and the deployed final-line state for
 * a given directing (anchor) division, keeping the anchor pinned at its own
 * actual column position (the whole scene is then translated only so the
 * finished line is centered on the canvas -- a uniform shift preserves the
 * anchor's motionlessness relative to itself).
 */
function buildDeployment(battalion, anchorIndex) {
  const divisions = buildDivisions(battalion);
  const rawColumn = columnOfCompanies(divisions, {
    originX: 0,
    originY: COL_ORIGIN_Y,
    facing: FACING,
    distanceMode: 'mass',
  });

  const anchorCompanyIndex = anchorIndex * 2 + 1;
  const anchorPos = rawColumn.find((p) => p.id === `c${anchorCompanyIndex}-of-cpt`);

  const rawFinal = divisionLineFromAnchor(divisions, anchorIndex, {
    originX: anchorPos.x,
    originY: anchorPos.y,
    facing: FACING,
  });

  const xs = rawFinal.map((p) => p.x);
  const shiftX = CANVAS_CENTER_X - (Math.min(...xs) + Math.max(...xs)) / 2;

  return {
    divisions,
    column: translate(rawColumn, { dx: shiftX }),
    finalLine: translate(rawFinal, { dx: shiftX }),
    anchorCompanyIndex,
  };
}

/** Override facing (in place, no position change) for the given divisions --
 * the "face left"/"face right"/"outward-face" instant, before any marching
 * begins. `facingByDivision` maps division index -> facing degrees. */
function facedInPlace(column, facingByDivision) {
  return column.map((p) => {
    const div = groupOfId(p.id);
    const f = facingByDivision[div];
    return f === undefined ? p : { ...p, facing: f };
  });
}

function buildFirstDivisionKeyframes(battalion) {
  const { column, finalLine } = buildDeployment(battalion, 0);
  // Divisions 1, 2, 3 face LEFT (270) and peel to division 0's left;
  // division 0 (the anchor) stands fast throughout (¶560, ¶565-567).
  const faced = facedInPlace(column, { 1: 270, 2: 270, 3: 270 });
  const midCascade = cascadeBlend(faced, finalLine, { 1: 1, 2: 0.55, 3: 0.25 }, groupOfId);
  const lateCascade = cascadeBlend(faced, finalLine, { 1: 1, 2: 1, 3: 0.6 }, groupOfId);

  return [
    {
      label: 'Column closed in mass, halted',
      description:
        'The battalion stands in column of divisions closed in mass, halted, the 1st division leading. The lieutenant-colonel has staked the line of battle and sent the left general guide out to mark where the left of the deployed battalion will rest.',
      caseyRef: '¶555-558',
      duration: 0,
      positions: column,
      annotations: [],
    },
    {
      label: 'On the first division, deploy column — Battalion, left—FACE',
      description:
        'The 1st division is cautioned to stand fast. The 2nd, 3rd, and 4th divisions face to the left; each chief posts himself by his division\'s left guide, and the junior captain posts by the covering sergeant of the left company.',
      caseyRef: '¶559-562',
      duration: 900,
      positions: faced,
      annotations: [],
    },
    {
      label: 'MARCH — divisions peel off to the left in succession',
      description:
        'The 1st division dresses right on the markers and fronts, standing fast. The three faced divisions march off by the flank, parallel to the line; the 2nd division is let file past its chief, then halted, fronted, and dressed right against the 1st division as soon as its guide draws abreast.',
      caseyRef: '¶565-572',
      duration: 1800,
      positions: midCascade,
      annotations: [],
    },
    {
      label: '3rd and 4th divisions continue to close on the line',
      description:
        'The 3rd division, once the 2nd has fronted, is halted, fronted, and marched forward to dress on the 2nd; the 4th division conforms identically, one division-length further back.',
      caseyRef: '¶573-576',
      duration: 1800,
      positions: lateCascade,
      annotations: [],
    },
    {
      label: 'Guides—POSTS: battalion formed in line of battle',
      description:
        'All four divisions are dressed and fronted, forming one continuous line. The colonel commands Guides—POSTS; the guides resume their line-of-battle posts and the markers retire.',
      caseyRef: '¶578-579',
      duration: 1200,
      positions: finalLine,
      annotations: [],
    },
  ];
}
function buildRearmostDivisionKeyframes(battalion) {
  const { column, finalLine } = buildDeployment(battalion, 3);
  // Divisions 0, 1, 2 face RIGHT (90) and peel to division 3's right; the
  // 4th division (anchor) stands fast (¶591, ¶600-602).
  const faced = facedInPlace(column, { 0: 90, 1: 90, 2: 90 });
  const midCascade = cascadeBlend(faced, finalLine, { 2: 1, 1: 0.55, 0: 0.25 }, groupOfId);
  const lateCascade = cascadeBlend(faced, finalLine, { 2: 1, 1: 1, 0: 0.6 }, groupOfId);

  return [
    {
      label: 'Column closed in mass, halted',
      description:
        'The battalion stands in column of divisions closed in mass, halted, the 4th division at the rear. The right general guide has been sent out to mark where the right of the deployed battalion will rest.',
      caseyRef: '¶555-557, ¶591',
      duration: 0,
      positions: column,
      annotations: [],
    },
    {
      label: 'On the fourth division, deploy column — Battalion, right—FACE',
      description:
        'The 4th division is cautioned to stand fast. The 1st, 2nd, and 3rd divisions face to the right; a third marker is placed opposite one of the three right files of the 4th division\'s left company.',
      caseyRef: '¶592-596',
      duration: 900,
      positions: faced,
      annotations: [],
    },
    {
      label: 'MARCH — divisions peel off to the right in succession',
      description:
        'The three faced divisions march off by the flank, parallel to the line. The 3rd division is let file past its chief, halted, and fronted, closing any gap to the left, once nearly unmasked by the 4th division peeling away.',
      caseyRef: '¶599, ¶603-604',
      duration: 1800,
      positions: midCascade,
      annotations: [],
    },
    {
      label: '1st and 2nd divisions continue to close on the line',
      description:
        'The 4th division, once nearly unmasked, moves forward, guide left, and dresses on the line. The 2nd and 1st divisions, still marching, are halted and dressed left in turn, the same chaining pattern continuing forward.',
      caseyRef: '¶600-605',
      duration: 1800,
      positions: lateCascade,
      annotations: [],
    },
    {
      label: 'Guides—POSTS: battalion formed in line of battle',
      description:
        'All four divisions are dressed and fronted, forming one continuous line. The colonel commands Guides—POSTS to close the movement.',
      caseyRef: '¶607-609',
      duration: 1200,
      positions: finalLine,
      annotations: [],
    },
  ];
}
function buildInteriorDivisionKeyframes(battalion) {
  const anchorIndex = 1; // 2nd division (companies 3-4), the worked example
  const { column, finalLine } = buildDeployment(battalion, anchorIndex);
  // Division 0 (ahead of the anchor in the column) belongs to the RIGHT of
  // the directing division in the final line, so it faces RIGHT (rearmost-
  // division mechanics, ¶622). Divisions 2 and 3 (behind the anchor in the
  // column) belong to its LEFT, so they face LEFT (first-division
  // mechanics). Division 1 (the anchor) stands fast throughout.
  const faced = facedInPlace(column, { 0: 90, 2: 270, 3: 270 });
  // Both sides converge SIMULTANEOUSLY, not one after the other (¶622's
  // "will deploy" reads as concurrent) -- division 0 is the only division on
  // the right side, so it settles as quickly as the first division peeling
  // off in the front-anchor case; divisions 2/3 mirror that same cascade on
  // the left, at the SAME keyframe/time index.
  const midCascade = cascadeBlend(faced, finalLine, { 0: 1, 2: 0.6, 3: 0.3 }, groupOfId);
  const lateCascade = cascadeBlend(faced, finalLine, { 0: 1, 2: 1, 3: 0.65 }, groupOfId);

  return [
    {
      label: 'Column closed in mass, halted',
      description:
        'The battalion stands in column of divisions closed in mass, halted, the 2nd division (companies 3-4) chosen as the directing division for this deployment.',
      caseyRef: '¶555-557',
      duration: 0,
      positions: column,
      annotations: [],
    },
    {
      label: 'On the second division, deploy column — Battalion, outward—FACE',
      description:
        'The 2nd division is cautioned to stand fast. The 1st division — ahead of it in the column, and destined for the right of the final line — faces to the right; the 3rd and 4th divisions — behind it, destined for the left — face to the left. Both groups are faced simultaneously, outward from the directing division.',
      caseyRef: '¶621-623',
      duration: 900,
      positions: faced,
      annotations: [],
    },
    {
      label: 'MARCH — both wings peel outward from the directing division at once',
      description:
        'The 1st division, on the right, and the 3rd and 4th divisions, on the left, march off by the flank concurrently — not one side waiting for the other. The 2nd division, unmasked as its neighbors clear away, begins its own approach to the line, taking the guide to whichever hand is the column\'s lead flank.',
      caseyRef: '¶622-624',
      duration: 1800,
      positions: midCascade,
      annotations: [],
    },
    {
      label: 'The left wing continues to close while the right wing finishes',
      description:
        'The 1st division is already dressed on the directing division\'s right. The 3rd division, once unmasked, halts and fronts beside the 2nd; the 4th division, one division-length further back, follows the same pattern.',
      caseyRef: '¶622-625',
      duration: 1800,
      positions: lateCascade,
      annotations: [],
    },
    {
      label: 'Guides—POSTS: battalion formed in line of battle',
      description:
        'All four divisions are dressed and fronted around the directing 2nd division, forming one continuous line. The movement concludes as the front- and rear-division deployments do, with the colonel\'s Guides—POSTS — the interior-division text (¶621-631) does not itself repeat this command; it is taken by analogy with ¶578 and ¶607.',
      caseyRef: '¶625 (Guides—POSTS by analogy with ¶578, ¶607)',
      duration: 1200,
      positions: finalLine,
      annotations: [],
    },
  ];
}

export default {
  id: 'mass-deployment',
  title: 'Deployment of Columns Closed in Mass',
  part: 4,
  article: 4,
  caseyParagraphs: [...rangeArr(555, 579), ...rangeArr(591, 610), ...rangeArr(621, 636)],
  subMovements: [
    { id: 'first-division', label: 'Deploy on the First Division' },
    { id: 'rearmost-division', label: 'Deploy on the Rearmost (4th) Division' },
    { id: 'interior-division', label: 'Deploy on an Interior (2nd) Division' },
  ],
  commands: (subMovement) => {
    if (subMovement === 'rearmost-division') {
      return [
        { text: '1. On the fourth division, deploy column.', type: 'preparatory' },
        { text: '2. Battalion, right—FACE.', type: 'preparatory' },
        { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
        { text: 'Left—DRESS.', type: 'execution' },
        { text: 'Guides—POSTS.', type: 'execution' },
      ];
    }
    if (subMovement === 'interior-division') {
      return [
        { text: '1. On the second division, deploy column.', type: 'preparatory' },
        { text: '2. Battalion, outward—FACE.', type: 'preparatory' },
        { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
        { text: 'Guides—POSTS.', type: 'execution' },
      ];
    }
    return [
      { text: '1. On the first division, deploy column.', type: 'preparatory' },
      { text: '2. Battalion, left—FACE.', type: 'preparatory' },
      { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
      { text: 'Right—DRESS.', type: 'execution' },
      { text: 'Guides—POSTS.', type: 'execution' },
    ];
  },
  reenactorNotes:
    'Casey gives three ways a column closed in mass can form line (¶555): faced to the front by the deployment (animated here), faced to the rear by the countermarch and the deployment, and faced to a flank by a change of direction and the deployment -- the latter two compose this same mechanic with other Parts\' material and are not separately built. "Faced to the front" means the deployed line faces the SAME direction the column was marching -- unlike Article II/III\'s wheel-into-line, no company or division turns 90 degrees permanently; instead each non-directing division faces left or right IN PLACE, marches "by the flank" sideways into its position on the line, then fronts again, ending at its original facing. The animation compresses that face/march/front sequence into one smooth glide per division rather than three sharp discrete steps, an illustrative simplification (the FINAL state is exact; only the in-between motion is stylized). ' +
    'In all three sub-movements the directing (anchor) division never actually moves -- it "stands fast" (¶560 first division, ¶591 rearmost); the interior case\'s anchor takes one small independent step forward once unmasked by its neighbors (¶623), simplified here to standing fast as well, matching the other two cases and noted as a deliberate simplification (the engine has no separate "creeping anchor" primitive yet). Every other division peels away from the anchor, marches by the flank, and re-dresses on whichever division is already established nearest it -- a chain, not a single synchronized command; division 2 lets itself be filed past by its own chief and is the first to halt/front/dress, with divisions 3 and 4 (or the mirror, for the rearmost case) following in succession (¶569-576, ¶603-605). ' +
    'The interior-division case (¶621-631) is the hardest in this whole Part: divisions are split by which side of the directing division they occupy in the FINAL line, not by their position in the column, and BOTH sides peel outward from the middle at once -- shown here with the 2nd division (companies 3-4) directing, the 1st division facing right to join its right (rearmost-division mechanics), and the 3rd/4th divisions facing left to join its left (first-division mechanics), all in the same keyframes. ' +
    'Marching (no-halt) variants -- ¶580-590, ¶610-620, ¶626-630 -- are not separate sub-movements: the geometry is identical, differing only in officer choreography and in-stride timing (the anchor halts itself rather than already standing halted; guides may detach earlier; the colonel may resume the march before every division has finished forming, ¶620) that this project does not yet render as distinct animation. Field-and-staff figures and the ground markers used to stake the line (¶556-558, ¶563, ¶596) are likewise not individually rendered, matching the existing battalion-block-view convention.',

  buildKeyframes: (_company, subMovement = 'first-division', battalion = DEFAULT_BATTALION) => {
    if (subMovement === 'rearmost-division') return buildRearmostDivisionKeyframes(battalion);
    if (subMovement === 'interior-division') return buildInteriorDivisionKeyframes(battalion);
    return buildFirstDivisionKeyframes(battalion);
  },
};
