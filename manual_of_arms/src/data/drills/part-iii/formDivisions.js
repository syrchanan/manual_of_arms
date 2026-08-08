import { columnOfCompanies } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Third, Article XI (S.B. ¶437-461): "Being in column by company closed
// in mass, to form divisions."
//
// One lateral pairing-up maneuver, given in three flavors:
//   'from-halt' (¶437-448, closed in mass) -- at a halt, each pair's LEFT
//   company (the rear company of the pair, in column order) faces left,
//   marches up alongside its partner, halts, fronts, and dresses onto it;
//   the RIGHT company of each pair (the front company of the pair) stands
//   fast throughout.
//   'from-march' (¶449-452, closed in mass) -- the same join, but without a
//   full halt: right companies mark time in place instead of halting while
//   their partner comes abreast; the whole column resumes its prior gait
//   together once every division is formed.
//   'full-or-half-distance' (¶453-456) -- the same lateral join executed
//   from a column that is at full or half distance rather than closed in
//   mass (¶453); the same commands and cascade logic apply, only the
//   starting/ending distanceMode differs.
//
// INTERPRETIVE CHOICES:
//  - Right/left pairing: within each pair (companies 1-2, 3-4, 5-6, 7-8),
//    the FRONT company of the pair in column order (lower number: 1, 3, 5,
//    7) is the "right company" that stands fast (¶440); its partner (2, 4,
//    6, 8) is the "left company" that sidesteps to join it (¶438-439). This
//    matches columnOfCompanies()'s existing division-unit convention, where
//    a division's companies array is [rightCompany, leftCompany] in the
//    same right-anchored order battalionLine() already uses.
//  - Depth compression: Casey's text describes only ONE pair's local
//    mechanics (a left company joining its own stationary right partner)
//    and states it is repeated "in succession" for the remaining pairs; it
//    does not separately explain how the column's total DEPTH closes up
//    when 8 single-company mass-spaced slots become 4 division mass-spaced
//    slots (a division and a company share the same 6-pace "closed in mass"
//    interval definition, ¶333, already encoded once in
//    columnOfCompanies()'s distanceMode:'mass'). Rather than inventing a
//    depth-holding rule the source does not give, this drill applies the
//    engine's own 'mass'/'full'/'half' distance definitions consistently to
//    both the 8-company start state and the 4-division end state, and shows
//    the necessary depth-closing as part of the same cascade that carries
//    each left company to its partner -- documented here rather than
//    silently left as an unexplained gap or an invented new spacing rule.
//  - The guide-marks-direction-by-contact alignment technique (¶440,
//    ¶444-445) and the 4-pace-early halt caution (¶442) are drill-master
//    timing cues for the humans executing this movement, not separate
//    animation geometry; they are called out in reenactorNotes, matching
//    this project's established convention (cf. changeDirectionHalf.js's
//    step-length note).
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 200;
const ORIGIN_Y = 220;
const OLD_FACING = 90; // marching east

function idsOfCompany(co) {
  return co.soldiers.map((s) => s.id);
}
function idsOfDivision(div) {
  return div.companies.flatMap(idsOfCompany);
}
function groupDivisions(battalion) {
  const divisions = [];
  for (let i = 0; i < battalion.length; i += 2) {
    divisions.push({ companies: [battalion[i], battalion[i + 1]] });
  }
  return divisions;
}

/** Substitute the leading `arrivedCount` divisions' worth of positions with
 * their arrived (final, formed) counterparts; the rest stay `waiting`. */
function cascadeSnapshot(waiting, arrivedMap, divisions, arrivedCount) {
  const arrivedIds = new Set(divisions.slice(0, arrivedCount).flatMap(idsOfDivision));
  return waiting.map((p) => (arrivedIds.has(p.id) ? arrivedMap.get(p.id) ?? p : p));
}

const ALL_PARAGRAPHS = Array.from({ length: 461 - 437 + 1 }, (_, i) => 437 + i);

export default {
  id: 'form-divisions',
  title: 'Being in Column by Company Closed in Mass, to Form Divisions',
  part: 3,
  article: 11,
  caseyParagraphs: ALL_PARAGRAPHS,
  subMovements: [
    { id: 'from-halt', label: 'From a Halt' },
    { id: 'from-march', label: 'From a March' },
    { id: 'full-or-half-distance', label: 'At Full Distance' },
  ],

  commands: (subMovement) => {
    if (subMovement === 'from-march') {
      return [
        { text: '1. Form divisions.', type: 'preparatory' },
        { text: 'Right companies: Mark time.', type: 'preparatory' }, // ¶450, the right companies' parallel command to the left companies' facing caution
        { text: '2. Left companies, by the left flank.', type: 'preparatory' },
        { text: '3. MARCH (or double quick--MARCH).', type: 'execution' },
        { text: 'Such company, by the right flank--MARCH.', type: 'execution' },
        { text: '4. Forward.', type: 'preparatory' },
        { text: '5. MARCH.', type: 'execution' },
      ];
    }
    if (subMovement === 'full-or-half-distance') {
      return [
        { text: '1. Form divisions.', type: 'preparatory' },
        { text: '2. Left company, left--FACE.', type: 'execution' },
        { text: '3. MARCH (or double quick--MARCH).', type: 'execution' },
        { text: '1. Such company, forward. 2. Guide right. 3. MARCH.', type: 'execution' },
        { text: 'Such company, by the right flank--MARCH.', type: 'execution' },
      ];
    }
    // from-halt (default)
    return [
      { text: '1. Form divisions.', type: 'preparatory' },
      { text: '2. Left company, left--FACE.', type: 'execution' },
      { text: '3. MARCH (or double quick--MARCH).', type: 'execution' },
      { text: '1. Such company.', type: 'preparatory' },
      { text: '2. HALT.', type: 'execution' },
      { text: '3. FRONT.', type: 'execution' },
      { text: 'Right--DRESS.', type: 'execution' },
      { text: 'Guides--POSTS.', type: 'execution' },
    ];
  },

  reenactorNotes:
    'From a halt (¶437-448): at command 1, captains of the LEFT companies (the rear company of each pair, in column order) caution a left face; at command 2, they face left and post beside their own left guides. The RIGHT companies (front company of each pair) stand fast; each right company\'s guides post in front of its right and left files, facing right, to mark direction for the incoming left company (¶438-440). At MARCH, only the left companies march; each captain, watching his own company file past, cautions the halt with 4 paces still to go, commands HALT the instant it clears its right company, and FRONT immediately after (¶441-442). Files incline right to close up; the captain posts on the left of the right company, aligning on its front rank; the left guide posts before one of the left company\'s own three left files, faces right, and covers the right company\'s guides, at which point the captain commands Right--DRESS (¶443-444). The left company dresses forward, its front-rank man opposite the guide resting lightly against the guide\'s arm, then FRONT is commanded without the captain leaving his post (¶445). Once every division is formed, the colonel commands Guides--POSTS, and the marking guides return to their normal column posts (¶446-447). ' +
    'From a march (¶449-452): the same pairing, but without a full halt -- at command 1, right companies\' captains command Mark time in place while left companies\' captains caution a left-flank face; at command 3 the right companies mark time and the left companies face left and march sideways to join them, each captain commanding his company back to the right flank once clear of the column to rejoin the marching line abreast its partner; once every division is formed, the colonel commands Forward, MARCH and the column resumes its prior gait (¶450-452). ' +
    'At full or half distance (¶453-456): the identical join, but starting from a column that is not closed in mass -- at quick time the left company\'s captain gives Forward, Guide right, MARCH once fronted; at double-quick he instead gives the by-the-right-flank command as soon as his company clears the column; the left company\'s right guide directs his march to arrive beside the right company\'s left-most man, halting once nearly up with its rear rank (¶453-454). Left-in-front columns are the mirror image throughout (¶455). This tab is shown at FULL distance; the half-distance case (¶453) is executed by the identical commands and cascade logic, differing only in the column\'s spacing, and is not separately rendered (hence the label "At Full Distance" rather than modeling both). ¶457-461\'s remarks stress that this movement is "the element of deployments" and must be executed with exact timing: halting too early leaves the joining company short of room; halting too late forces an oblique incline to dress -- both faults propagate into any later deployment built on this formation. None of these timing faults are separately modeled here; the animation shows the intended, correctly-timed result.',

  buildKeyframes: (_company, subMovement = 'from-halt', battalion = DEFAULT_BATTALION) => {
    const divisions = groupDivisions(battalion);
    const distanceMode = subMovement === 'full-or-half-distance' ? 'full' : 'mass';

    const companyColumn = columnOfCompanies(battalion, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: OLD_FACING,
      distanceMode,
    });

    // Left companies (the rear company of each pair -- companies[1] of each
    // division) face left in place before marching to join their partner
    // (¶438-439, ¶450). Right companies (companies[0] of each pair) stand
    // fast, facing the original march direction throughout.
    const leftCompanyIds = new Set(divisions.flatMap((div) => idsOfCompany(div.companies[1])));
    const facedLeft = companyColumn.map((s) => (
      leftCompanyIds.has(s.id) ? { ...s, facing: (OLD_FACING - 90 + 360) % 360 } : s
    ));

    const finalDivisionColumn = columnOfCompanies(divisions, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: OLD_FACING,
      distanceMode,
    });
    const finalMap = new Map(finalDivisionColumn.map((p) => [p.id, p]));

    const snap1 = cascadeSnapshot(facedLeft, finalMap, divisions, 1);
    const snap2 = cascadeSnapshot(facedLeft, finalMap, divisions, 2);
    const snap3 = cascadeSnapshot(facedLeft, finalMap, divisions, 3);

    if (subMovement === 'from-march') {
      return [
        {
          label: 'Column by company closed in mass, in march',
          description: 'The battalion, in column by company closed in mass, is in march.',
          caseyRef: '¶449',
          duration: 800,
          positions: companyColumn,
          annotations: ['marchArrow'],
        },
        {
          label: 'Right companies mark time; left companies face the left flank',
          description: 'At command 1, right companies\' captains command Mark time in place; left companies\' captains caution a left-flank face.',
          caseyRef: '¶450',
          duration: 1200,
          positions: facedLeft,
          annotations: [],
        },
        {
          label: 'By the left flank -- leading division forms',
          description: 'The first left company faces left and marches to join its partner; once clear of the column, its captain commands it back to the right flank to rejoin the marching line abreast its partner.',
          caseyRef: '¶451',
          duration: 1600,
          positions: snap1,
          annotations: [],
        },
        {
          label: 'Remaining divisions form in succession',
          description: 'Each following left company repeats the join in turn while its own right company continues to mark time.',
          caseyRef: '¶451',
          duration: 1800,
          positions: snap2,
          annotations: [],
        },
        {
          label: 'Most divisions are formed',
          description: 'The greater part of the column now marches by division; the rearmost pair is still joining.',
          caseyRef: '¶451',
          duration: 1800,
          positions: snap3,
          annotations: [],
        },
        {
          label: 'Forward, MARCH -- column by division, in march',
          description: 'Every division is formed; the column resumes its prior gait, now marching by division instead of by company, still closed in mass.',
          caseyRef: '¶452',
          duration: 1500,
          positions: finalDivisionColumn,
          annotations: ['marchArrow'],
        },
      ];
    }

    const distanceLabel = subMovement === 'full-or-half-distance' ? 'at full distance' : 'closed in mass';
    return [
      {
        label: `Column by company ${distanceLabel}, halted`,
        description: `The battalion stands halted, in column by company ${distanceLabel}, right in front.`,
        caseyRef: subMovement === 'full-or-half-distance' ? '¶453' : '¶437',
        duration: 0,
        positions: companyColumn,
        annotations: [],
      },
      {
        label: 'Left company, left--FACE',
        description: 'Captains of the left companies caution and execute a left face, posting beside their own left guides; right companies stand fast, their guides posting in front of the right and left files to mark direction.',
        caseyRef: '¶438-440',
        duration: 1200,
        positions: facedLeft,
        annotations: [],
      },
      {
        label: 'MARCH -- leading pair forms',
        description: 'The first left company marches, halting the instant it clears its right company, fronting, and dressing onto it; the captain posts on the left of the newly formed division.',
        caseyRef: '¶441-444',
        duration: 1600,
        positions: snap1,
        annotations: ['alignmentLine'],
      },
      {
        label: 'Remaining pairs form in succession',
        description: 'Each following left company repeats the same halt-front-dress sequence in turn, its own right company standing fast throughout.',
        caseyRef: '¶441-445',
        duration: 1800,
        positions: snap2,
        annotations: ['alignmentLine'],
      },
      {
        label: 'Most divisions are formed',
        description: 'The greater part of the column now stands formed by division; the rearmost pair is still dressing.',
        caseyRef: '¶443-445',
        duration: 1800,
        positions: snap3,
        annotations: ['alignmentLine'],
      },
      {
        label: 'Guides--POSTS -- column by division',
        description: `Every division is formed. The marking guides return to their normal column posts; the column now stands ${distanceLabel}, by division instead of by company.`,
        caseyRef: '¶446-448',
        duration: 1500,
        positions: finalDivisionColumn,
        annotations: [],
      },
    ];
  },
};
