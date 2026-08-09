import { battalionLine, divisionColumns, doubleColumn, columnOfCompanies, cascadeBlend } from '../../../engine/battalionFormations.js';
import { translate } from '../../../engine/formations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION, SCALE } from '../../constants.js';
import { buildColorParty, buildFieldAndStaff, captainPos } from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article XIII, Sections 5-8 (S.B. ¶922-945): marching/obliquing
// in a line of division columns, passage of an obstacle, and the two
// cross-formation transitions between the line of division columns and the
// double column.
//
// FOLD/UNFOLD ENGINEERING CHOICE (the hardest new lift in this article --
// see part-fifth-d.md's own "Engine primitives needed" #3):
//
// The key fact making the transition tractable (spec overview §3): DC2
// (companies 4 front, 3 rear) and DC3 (5 front, 6 rear) sit laterally
// adjacent at the line's centre -- their front companies (4, 5) are already
// abreast, exactly Division 1 of the double column; their rear companies
// (3, 6) are already abreast behind them, exactly Division 2. Only DC1
// (2/1, rightmost) and DC4 (7/8, leftmost) are laterally displaced and must
// close in diagonally to become Divisions 3 and 4.
//
// In THIS ENGINE, divisionColumns() and doubleColumn() each compute their own
// independent lateral anchor math (see each function's header comment) --
// divisionColumns() centres a division-column at the MIDPOINT of its pair's
// original two-company footprint, which is not pixel-identical to where
// doubleColumn() places that same pair inside a two-company-wide division.
// So DC2/DC3 do not literally travel zero pixels when folding into Divisions
// 1/2 -- there is a small final dressing adjustment even for the "stand
// fast" pair, on top of Casey's own text (division chiefs command
// "Right—DRESS" once aligned, ¶883). Rather than hand-deriving a
// pixel-exact reconciliation between the two primitives' independent origin
// conventions (out of scope for this pass), this drill uses cascadeBlend()
// with DC2/DC3's progress reaching 1 in the FIRST post-start keyframe (an
// instant snap standing in for "no choreography shown, ¶928's own
// instruction that they simply stand fast") while DC1/DC4's progress ramps
// gradually across the remaining keyframes, visibly showing the genuine
// diagonal closing-in march that IS the new content of ¶928-930/¶936-938.
// This choice is documented here rather than assumed authoritative, per the
// spec's own flagged ambiguity on the diagonal path shape (¶936-938 gives
// endpoints -- markers -- and general direction only, not an exact path).
//
// Unfold (Section 8, ¶931-945) is the harder, symmetric-opposite case: DC2/
// DC3 (already Divisions 1/2 of the double column) again settle immediately
// (this time settling INTO their divisionColumns() slots), while DC1/DC4
// peel apart and travel diagonally AWAY from the centre. The engine has no
// distinct "marker" objects; per the header note above, the straight-line
// cascade between the two primitives' own computed states stands in for the
// marker-guided diagonal march ¶936-938 describes.
// ---------------------------------------------------------------------------

const LINE_ORIGIN_X = CANVAS_BATTALION.VIEW_W - 60;
const LINE_ORIGIN_Y = 260;
const FACING = 0; // battalion faces/marches north (up-screen)
const { PACE_PX } = SCALE;

function rangeArr(from, to) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(n);
  return out;
}

/** DC (division-column) group per adjacency pairing, matches
 * divisionColumns()'s own DIVISION_COLUMN_PAIRS: (2,1)->0, (4,3)->1,
 * (5,6)->2, (7,8)->3. Groups 1 and 2 are the "already correct" centre pair
 * that becomes Divisions 1/2 of the double column (spec overview §3); groups
 * 0 and 3 are the outer pair that must close in / peel out diagonally. */
function dcGroupOfId(id) {
  const m = /^c(\d+)-/.exec(id);
  if (!m) return null;
  return Math.floor((Number(m[1]) - 1) / 2);
}

function combine(soldiers, colorParty, fieldStaff) {
  return [...soldiers, ...colorParty, ...fieldStaff];
}

function cpAtRest(positions) {
  return buildColorParty(positions, { forwardPaces: 0, atRest: true });
}
function fsAtRest(positions) {
  return buildFieldAndStaff(positions, {});
}

function buildBaseStates(battalion) {
  const halted = battalionLine(battalion, { originX: LINE_ORIGIN_X, originY: LINE_ORIGIN_Y, facing: FACING });
  const lineOfDCs = divisionColumns(battalion, {
    originX: LINE_ORIGIN_X,
    originY: LINE_ORIGIN_Y,
    facing: FACING,
    distanceMode: 'full',
  });
  // Anchor the double column's Division 1 (companies 4,5) at company 4's own
  // actual position within the line of division columns, so the "already
  // correct" DC2/DC3 pair snaps to a geometrically nearby target rather than
  // an arbitrarily distant one (see header note on the two primitives'
  // independent origin math).
  const div1Anchor = captainPos(lineOfDCs, 4);
  const dblColumn = doubleColumn(battalion, {
    originX: div1Anchor.x,
    originY: div1Anchor.y,
    facing: FACING,
    distanceMode: 'half',
  });
  return { halted, lineOfDCs, dblColumn };
}

// ---------------------------------------------------------------------------
// Section 5 (¶922-923): advance in a line of division columns -- a plain
// group translation, all four columns keeping station together.
// ---------------------------------------------------------------------------
function buildAdvanceKeyframes(battalion) {
  const { lineOfDCs } = buildBaseStates(battalion);
  const ADVANCE_PACES = 10;
  const advanced = translate(lineOfDCs, { dy: -ADVANCE_PACES * PACE_PX });

  return [
    {
      label: 'Line of division columns, halted',
      description:
        'The battalion stands in a line of four division columns, at company distance, ready to advance.',
      caseyRef: '¶922',
      duration: 0,
      positions: combine(lineOfDCs, cpAtRest(lineOfDCs), fsAtRest(lineOfDCs)),
      annotations: [],
    },
    {
      label: 'Forward — MARCH',
      description:
        'The line of division columns advances by the commands and means already prescribed for a battalion in line (¶648 and following). The captain on the left of the leading company of the 1st division column, and the captain on the right of the leading company of the 4th, are each responsible for preserving the interval to the column next to their own.',
      caseyRef: '¶922',
      duration: 1800,
      positions: combine(advanced, cpAtRest(advanced), fsAtRest(advanced)),
      annotations: ['marchArrow'],
    },
  ];
}

// ---------------------------------------------------------------------------
// Section 6 (¶924-927): passage of an obstacle -- one division column (the
// 2nd, chosen as a representative interior column) breaks to the rear,
// closes in mass on the last company of the column behind which it
// marches (illustrated here as tucking directly behind the 1st division
// column), then rejoins the line once past the obstacle.
// ---------------------------------------------------------------------------
function buildObstacleKeyframes(battalion) {
  const { lineOfDCs } = buildBaseStates(battalion);

  const obstructedGroup = 1; // 2nd division column (companies 4 front, 3 rear)
  // Shelters behind the 1st division column (companies 2 front, 1 rear).

  // DC2 (companies 4 front, 3 rear) tucks in directly behind DC1's own
  // leading company (2), at mass distance, sheltered from the obstacle --
  // mirrors divisionColumns()'s own per-pair columnOfCompanies([front, rear])
  // call, just re-anchored at the shelter column's position instead of DC2's
  // own original lateral slot.
  const shelterFrontAnchor = captainPos(lineOfDCs, 2);
  const byIndex = Object.fromEntries(battalion.map((c) => [c.index, c]));
  // Stack DC1's own two companies (2, 1) then DC2's two (4, 3) as one mass
  // column behind DC1's front anchor -- only companies 4/3's resulting
  // positions are used below, placing DC2 directly behind DC1's rear
  // company (1), fully sheltered.
  const detour = columnOfCompanies(
    [byIndex[2], byIndex[1], byIndex[4], byIndex[3]],
    { originX: shelterFrontAnchor.x, originY: shelterFrontAnchor.y, facing: FACING, distanceMode: 'mass' }
  );
  // The detoured division column marches to full distance behind the
  // shelter column (¶926 -- "take full distance" before returning to line).
  const detourMap = new Map(detour.map((p) => [p.id, p]));
  const detoured = lineOfDCs.map((p) => detourMap.get(p.id) ?? p);

  const rejoinCascade = cascadeBlend(detoured, lineOfDCs, { [obstructedGroup]: 0.5 }, dcGroupOfId);

  return [
    {
      label: 'Line of division columns, advancing',
      description:
        'The battalion advances in line of division columns; an obstacle ahead is judged to cover the 2nd division column.',
      caseyRef: '¶924',
      duration: 0,
      positions: combine(lineOfDCs, cpAtRest(lineOfDCs), fsAtRest(lineOfDCs)),
      annotations: [],
    },
    {
      label: 'The 2nd division column breaks to the rear',
      description:
        'The colonel gives "2nd division column, obstacle." The senior captain of the column (not the colonel) gives the necessary commands to break it off; its leading company closes in mass on the last company of the column behind which it now marches, sheltering it from the obstacle.',
      caseyRef: '¶924',
      duration: 1800,
      positions: combine(detoured, cpAtRest(detoured), fsAtRest(detoured)),
      annotations: [],
    },
    {
      label: 'Returning toward the line, diagonally',
      description:
        'Once clear of the obstacle, the division column is conducted by its chief diagonally to the front; on reaching proper distance from its neighbor it files right, prolongs itself parallel to the line, and is faced by the flank to take the line\'s own step.',
      caseyRef: '¶925',
      duration: 1800,
      positions: combine(rejoinCascade, cpAtRest(rejoinCascade), fsAtRest(rejoinCascade)),
      annotations: [],
    },
    {
      label: 'Rejoined the line of division columns',
      description:
        'The 2nd division column has regained its proper place and interval in the line, all four columns again keeping station together.',
      caseyRef: '¶925-926',
      duration: 1500,
      positions: combine(lineOfDCs, cpAtRest(lineOfDCs), fsAtRest(lineOfDCs)),
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// Section 7 (¶928-930): form double column from a line of division columns.
// DC2/DC3 (already correctly positioned) stand fast; DC1/DC4 close in
// diagonally. See header note on the fold/unfold engineering choice.
// ---------------------------------------------------------------------------
function buildFoldKeyframes(battalion, { marching }) {
  const { lineOfDCs, dblColumn } = buildBaseStates(battalion);

  const settled = cascadeBlend(lineOfDCs, dblColumn, { 0: 0, 1: 1, 2: 1, 3: 0 }, dcGroupOfId);
  const partial = cascadeBlend(lineOfDCs, dblColumn, { 0: 0.5, 1: 1, 2: 1, 3: 0.5 }, dcGroupOfId);

  return [
    {
      label: marching ? 'Line of division columns, marching' : 'Line of division columns, halted',
      description:
        'The battalion stands in a line of four division columns. The 2nd (companies 4/3) and 3rd (5/6) division columns are already correctly positioned at the centre to become Divisions 1 and 2 of the double column.',
      caseyRef: '¶928-929',
      duration: 0,
      positions: combine(lineOfDCs, cpAtRest(lineOfDCs), fsAtRest(lineOfDCs)),
      annotations: [],
    },
    {
      label: 'Preparatory — 2nd and 3rd division columns cautioned to stand fast',
      description: marching
        ? 'Executed by the commands/means for forming the double column on the march (¶889), except: captains of the 2nd and 3rd division columns caution "march straight-forward," command Quick time, rather than facing.'
        : 'Executed by the commands/means for forming the double column at a halt (¶874), except: captains of the companies of the 2nd and 3rd division columns caution them to stand fast, since they are already paired correctly, front-to-rear, for Divisions 1 and 2.',
      caseyRef: '¶928-929',
      duration: 900,
      positions: combine(settled, cpAtRest(settled), fsAtRest(settled)),
      annotations: [],
    },
    {
      label: 'MARCH — the 1st and 4th division columns close in diagonally',
      description:
        'Divisions 1 and 2 of the emerging double column (the former 2nd/3rd division columns) stand fast in place. The 1st division column (companies 2/1) and 4th (7/8), still laterally displaced, close in diagonally toward the centre axis to become Divisions 3 and 4.',
      caseyRef: '¶928-930',
      duration: 1800,
      positions: combine(partial, cpAtRest(partial), fsAtRest(partial)),
      annotations: [],
    },
    {
      label: 'Double column formed',
      description:
        'The battalion now stands in the double column: Division 1 (4,5), Division 2 (3,6), Division 3 (2,7) and Division 4 (1,8), the outer division columns having closed the interval entirely.',
      caseyRef: '¶928-930',
      duration: 1500,
      positions: combine(dblColumn, cpAtRest(dblColumn), fsAtRest(dblColumn)),
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// Section 8 (¶931-945): form line of division columns from the double
// column -- the reverse, harder direction: DC2/DC3 (already Divisions 1/2)
// settle into place while DC1/DC4 peel apart and travel diagonally away
// from the centre toward the lieutenant-colonel's / senior major's markers.
// Halted case only (¶931-940); the marching case (¶941-945) is documented in
// reenactorNotes, not separately animated, matching this project's existing
// marching-variant convention.
// ---------------------------------------------------------------------------
function buildUnfoldKeyframes(battalion) {
  const { lineOfDCs, dblColumn } = buildBaseStates(battalion);

  const settled = cascadeBlend(dblColumn, lineOfDCs, { 0: 0, 1: 1, 2: 1, 3: 0 }, dcGroupOfId);
  const partial = cascadeBlend(dblColumn, lineOfDCs, { 0: 0.5, 1: 1, 2: 1, 3: 0.5 }, dcGroupOfId);

  return [
    {
      label: 'Double column, halted',
      description:
        'The battalion stands in the double column, halted, at half distance. The lieutenant-colonel and senior major have each placed a pair of markers -- one at company distance, one a little less than company distance farther -- on the right and left of Division 1, to guide the outer divisions back to the line.',
      caseyRef: '¶931-932',
      duration: 0,
      positions: combine(dblColumn, cpAtRest(dblColumn), fsAtRest(dblColumn)),
      annotations: [],
    },
    {
      label: '1. Form line division columns. 2. Battalion, outward—FACE.',
      description:
        'Captains of the companies constituting Divisions 1 and 2 (4, 5, 3, 6 -- which will become the 2nd and 3rd division columns) caution their companies to stand fast. The right-wing companies of Divisions 3 and 4 (2, 1) face right; the left-wing companies (7, 8) face left.',
      caseyRef: '¶932-935',
      duration: 900,
      positions: combine(settled, cpAtRest(settled), fsAtRest(settled)),
      annotations: [],
    },
    {
      label: 'MARCH — the outer companies move diagonally to the front',
      description:
        'Divisions 1 and 2 (the future 2nd and 3rd division columns) stand fast. The companies forming the 1st division column (2, 1) and the 4th (7, 8) move diagonally to the front, each leading company conducted onto its marker; other companies preserve parallelism with their own leading company.',
      caseyRef: '¶936-938',
      duration: 1800,
      positions: combine(partial, cpAtRest(partial), fsAtRest(partial)),
      annotations: [],
    },
    {
      label: 'Guides—POSTS: line of division columns formed',
      description:
        'The line of division columns is formed: the 1st (2/1) and 4th (7/8) division columns have taken their places on the flanks of the 2nd (4/3) and 3rd (5/6), which never moved. The colonel commands "Guides—POSTS."',
      caseyRef: '¶938-940',
      duration: 1500,
      positions: combine(lineOfDCs, cpAtRest(lineOfDCs), fsAtRest(lineOfDCs)),
      annotations: [],
    },
  ];
}

export default {
  id: 'double-column-movements',
  title: 'Marching, Obstacles, and Folding Between the Line of Division Columns and the Double Column',
  part: 5,
  article: 13,
  caseyParagraphs: rangeArr(922, 945),
  subMovements: [
    { id: 'advance', label: 'Advance in Line of Division Columns' },
    { id: 'obstacle', label: 'Passage of an Obstacle' },
    { id: 'fold', label: 'Form Double Column from Division Columns' },
    { id: 'unfold', label: 'Form Division Columns from Double Column' },
  ],
  commands: (subMovement) => {
    if (subMovement === 'obstacle') {
      return [{ text: '(Such) division column, obstacle.', type: 'preparatory' }];
    }
    if (subMovement === 'fold') {
      return [
        { text: '1. Double column, at half distance.', type: 'preparatory' },
        { text: '2. Battalion, inward—FACE (or by the right and left flanks).', type: 'preparatory' },
        { text: '3. MARCH.', type: 'execution' },
      ];
    }
    if (subMovement === 'unfold') {
      return [
        { text: '1. Form line division columns.', type: 'preparatory' },
        { text: '2. Battalion, outward—FACE.', type: 'preparatory' },
        { text: '3. MARCH (or double quick—MARCH).', type: 'execution' },
      ];
    }
    return [
      { text: '1. Battalion, forward.', type: 'preparatory' },
      { text: '2. MARCH (or double quick—MARCH).', type: 'execution' },
    ];
  },
  reenactorNotes:
    'A line of division columns marches, retires, obliques, or changes direction by the same commands already used for a battalion in line (¶922, No. 648 and following), the whole group of four columns moving together; the flank captains of the 1st and 4th columns are responsible for keeping their own interval to the column beside them, a duty that swaps sides between advancing and retiring (¶922) -- a role reassignment, not a geometry change. Passage of an obstacle (¶924-927) breaks the affected division column to the rear, sheltering it in mass behind the column it trails, then returns it to the line by a diagonal reconnection path once past -- shown here for the 2nd division column as a representative case; if the battalion is brought to right-about while a column is broken off, the colonel first has it take full distance before rejoining the line (¶926). ' +
    'The fold (¶928-930, division columns into double column) and unfold (¶931-945, double column into division columns) are the two cross-formation transitions and the hardest new engine work in this article. The load-bearing fact (spec overview §3): the 2nd division column (companies 4 front, 3 rear) and the 3rd (5 front, 6 rear) already sit exactly where Divisions 1 and 2 of the double column belong -- their front companies (4, 5) are already abreast at the centre. Only the 1st (2/1, rightmost) and 4th (7/8, leftmost) division columns are laterally displaced and must travel diagonally -- inward to fold, outward to unfold. This drill represents that "stand fast" pair by letting their cascade progress reach 1 in the very first post-start keyframe (Casey\'s own instruction that no choreography is shown for them) while the outer pair\'s progress ramps gradually across the remaining keyframes, visibly performing the genuine diagonal march the text describes. Because divisionColumns() and doubleColumn() compute their lateral placement by independent conventions (each function\'s own header explains why), the "stand fast" pair is not rendered as literally zero-pixel motion -- a small settling adjustment is folded into their snap-to-final step, standing in for Casey\'s own "Right—DRESS" dressing correction (¶883) rather than a literal absence of motion. The exact diagonal path shape for the outer division columns (¶936-938) is specified by Casey only as an endpoint (a marker) and a general direction ("diagonally to the front"), not an intermediate path -- this drill uses a straight-line interpolation between the division-columns state and the double-column state, flagged as an interpretive choice, not a sourced geometry. The unfold\'s marching (no-halt) variant (¶941-945) uses the identical geometry with different officer-choreography timing and is documented here rather than separately animated, matching this project\'s established marching-variant convention.',

  buildKeyframes: (_company, subMovement = 'advance', battalion = DEFAULT_BATTALION) => {
    if (subMovement === 'obstacle') return buildObstacleKeyframes(battalion);
    if (subMovement === 'fold') return buildFoldKeyframes(battalion, { marching: false });
    if (subMovement === 'unfold') return buildUnfoldKeyframes(battalion);
    return buildAdvanceKeyframes(battalion);
  },
};
