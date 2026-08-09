import { columnOfCompanies } from '../../../engine/battalionFormations.js';
import { setFacing } from '../../../engine/formations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Third, Article VIII (S.B. ¶345-384): "To change direction in column
// closed in mass."
//
// Two sub-articles, each with a right- and left-hand version:
//   1st. In marching (¶345-364) -- the leading division wheels at a marked
//        ground point, the way a company-scale wheel-in-march already works
//        (Lesson V/VI precedent), and every trailing division CONFORMS at
//        once, closing from its near-zero mass-column gap to a transient
//        4-pace interval while it wheels, snapping back to the standing
//        6-pace mass interval (¶362) once the whole column has resumed a
//        straight march (¶356).
//   2nd. From a halt (¶365-384) -- NOT a wheel at all: the whole column
//        faces the turning flank as one body (¶367), then each subdivision
//        in turn (leader first) files forward-and-across onto a pair of
//        planted ground markers, halts, fronts, and dresses (¶369-372)
//        before the next subdivision follows.
//
// INTERPRETIVE CHOICES (documented, not modeled with additional geometry):
//  - Subdivision granularity: this drill always groups the battalion into 4
//    divisions of 2 companies each (¶345, ¶425's convention, this project's
//    8-company default). ¶361 explicitly generalizes the marching variant to
//    column-by-company, and ¶365/¶434-style company-granularity variants are
//    not separately staged here (documented, per the project's established
//    "state once, don't re-derive" convention -- cf. changeDirectionHalf.js).
//  - The marching wheel's ¶349 4-pace transient gap and the ¶362 standing
//    6-pace mass gap are both real, but the engine's columnOfCompanies only
//    exposes a single 'mass' distance mode (6-pace, matching ¶362 exactly).
//    Rather than inventing a second custom interval, this drill approximates
//    the transient closing-up visually with the SAME cascade/relay technique
//    already used for the half-distance change of direction
//    (changeDirectionHalf.js) -- each division reaching the shared wheel
//    point in succession -- and calls out the 4-pace figure in reenactorNotes
//    rather than laying out a separate intermediate spacing geometry.
//  - Both variants converge on the identical final geometry (a mass column
//    of divisions at the new facing) since "changing direction" always ends
//    with the same column, marching a new way; only the PATH there differs
//    (wheeling arcs vs. face-flank-and-file), which is where this drill's
//    two subMovement families differ.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 200;
const ORIGIN_Y = 220;
const OLD_FACING = 90; // marching east
const APPROACH_PACES = 8;
const PACE = 14;

function idsOfCompany(co) {
  return co.soldiers.map((s) => s.id);
}
function idsOfDivision(div) {
  return div.companies.flatMap(idsOfCompany);
}

/** Group an 8-company battalion into 4 divisions of 2 companies each, front
 * company first (the "right" company of the pair, per battalion.js's
 * right-in-front numbering) -- the standard grouping used throughout this
 * range's drills (S.B. ¶425). */
function groupDivisions(battalion) {
  const divisions = [];
  for (let i = 0; i < battalion.length; i += 2) {
    divisions.push({ companies: [battalion[i], battalion[i + 1]] });
  }
  return divisions;
}

function leadCompanyOf(division) {
  return division.companies[0];
}

function captainPos(positions, companyIndex) {
  return positions.find((p) => p.id === `c${companyIndex}-of-cpt`);
}

/** Substitute the leading `arrivedCount` divisions' positions with their
 * arrived (final) counterparts; the rest stay in `waiting`. */
function cascadeSnapshot(waiting, arrivedMap, divisions, arrivedCount) {
  const arrivedIds = new Set(divisions.slice(0, arrivedCount).flatMap(idsOfDivision));
  return waiting.map((p) => (arrivedIds.has(p.id) ? arrivedMap.get(p.id) ?? p : p));
}

function commandsFor(subMovement) {
  const mode = subMovement.startsWith('marching') ? 'marching' : 'halt';
  const side = subMovement.endsWith('left') ? 'left' : 'right';

  if (mode === 'marching') {
    return [
      { text: `1. Battalion, ${side} wheel.`, type: 'preparatory' },
      { text: '2. MARCH.', type: 'execution' },
      { text: '3. Forward.', type: 'preparatory' },
      { text: '4. MARCH.', type: 'execution' },
    ];
  }
  return [
    { text: `1. Change direction by the ${side} flank.`, type: 'preparatory' },
    { text: `2. Battalion, ${side}--FACE.`, type: 'execution' },
    { text: '3. MARCH (or double quick--MARCH).', type: 'execution' },
    { text: '1. First division.', type: 'preparatory' },
    { text: '2. HALT.', type: 'execution' },
    { text: '3. FRONT.', type: 'execution' },
    { text: `4. ${side === 'right' ? 'Left' : 'Right'}--DRESS.`, type: 'execution' },
  ];
}

// Mainline battalion paragraphs only; skirmisher-scope 0-N (363, 364, 368,
// 373, 376, 379) are excluded.
const ALL_PARAGRAPHS = [
  345, 346, 347, 348, 349, 350, 351, 352, 353, 354, 355, 356, 357, 358, 359, 360,
  361, 362, 365, 366, 367, 369, 370, 371, 372, 374, 375, 377, 378, 380, 381, 382, 383, 384,
];

export default {
  id: 'change-direction-closed-in-mass',
  title: 'To Change Direction in Column Closed in Mass',
  part: 3,
  article: 8,
  caseyParagraphs: ALL_PARAGRAPHS,
  subMovements: [
    { id: 'marching-right', label: 'Marching -- Right Wheel' },
    { id: 'marching-left', label: 'Marching -- Left Wheel' },
    { id: 'halt-right', label: 'From a Halt -- Right Flank' },
    { id: 'halt-left', label: 'From a Halt -- Left Flank' },
  ],
  commands: commandsFor,

  reenactorNotes:
    'Marching variant (¶345-360): the colonel first has the battalion take the guide on the flank OPPOSITE the turn, then plants a marker at the wheel point. At MARCH, the leading division wheels there exactly as if it were a half-distance column\'s leading subdivision (¶347, reusing the Article VII step-length rule); the instant it starts, every OTHER division conforms at once -- inclining toward the pivot flank, lengthening step slightly, and closing from the column\'s normal near-zero mass gap up to a constant 4-pace interval behind the division ahead of it (¶349), only straightening out once it covers that division\'s guide. Each chief of division keeps his own division between its guides and nearly parallel to the one ahead (¶351); the colonel, lieutenant-colonel, and senior major each hold posts described in ¶352-354 to regulate the wheel. Forward, MARCH is given the instant the leading division completes its own wheel (¶355), and the pivot-side guide of a wheeling subdivision must hold the standing 6-pace mass distance from the guide ahead of it once straightened (¶362) -- the engine only models a single mass interval (6 paces, ¶362\'s standing figure), so the transient 4-pace closing-up during the wheel itself is described here rather than laid out as a second geometry. ¶361 confirms the identical mechanic applies to a column by company, not just by division. ' +
    'From-a-halt variant (¶365-384): this is NOT a wheel -- at the second command the WHOLE column faces the turning flank simultaneously (¶367), each chief of subdivision posting beside his own now-leading guide. At MARCH every subdivision steps off TOGETHER (filing, not relaying), each one\'s outer guide keeping parallel to two markers the lieutenant-colonel planted on the new line (¶366); but each subdivision individually times its own halt, front, and dress (¶369-372) as it clears the one ahead of it and reaches the markers\' prolongation, in strict leader-to-rear order -- so although they all start together, they finish in succession. ¶383\'s hard constraint (the leading subdivision must fully unmask the column -- its trailing edge must clear the leading division\'s own starting point by a full division-front -- before it may halt) is what forces every following subdivision to also cross a full division-front of open ground, which is why this animation shows a clean leader-first cascade despite the simultaneous start. ¶384: "by this method there is no direction that may not be given to a column in mass."',

  buildKeyframes: (_company, subMovement = 'marching-right', battalion = DEFAULT_BATTALION) => {
    const divisions = groupDivisions(battalion);
    const mode = subMovement.startsWith('marching') ? 'marching' : 'halt';
    const side = subMovement.endsWith('left') ? 'left' : 'right';
    const angleDeg = side === 'left' ? -90 : 90;
    const newFacing = (OLD_FACING + angleDeg + 360) % 360;

    const massHalted = columnOfCompanies(divisions, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: OLD_FACING,
      distanceMode: 'mass',
    });

    if (mode === 'marching') {
      const approachDx = APPROACH_PACES * PACE;
      const approaching = massHalted.map((s) => ({ ...s, x: s.x + approachDx }));

      const pivot = captainPos(approaching, leadCompanyOf(divisions[0]).index);
      const wheeledColumn = columnOfCompanies(divisions, {
        originX: pivot.x,
        originY: pivot.y,
        facing: newFacing,
        distanceMode: 'mass',
      });
      const wheeledMap = new Map(wheeledColumn.map((p) => [p.id, p]));

      const snap1 = cascadeSnapshot(approaching, wheeledMap, divisions, 1);
      const snap2 = cascadeSnapshot(approaching, wheeledMap, divisions, 2);
      const snap3 = cascadeSnapshot(approaching, wheeledMap, divisions, 3);

      const oldRad = (OLD_FACING * Math.PI) / 180;
      const newRad = (newFacing * Math.PI) / 180;
      const arcData = {
        pivotX: pivot.x,
        pivotY: pivot.y,
        radiusPx: 200,
        startAngle: Math.min(oldRad, newRad),
        endAngle: Math.max(oldRad, newRad),
      };
      const pointData = { pivotX: pivot.x, pivotY: pivot.y };

      return [
        {
          label: 'Column by division closed in mass, marching',
          description: 'The battalion, in column by division closed in mass, marches in a straight line, guide on the flank opposite the intended turn.',
          caseyRef: '¶345-346',
          duration: 0,
          positions: massHalted,
          annotations: ['marchArrow'],
        },
        {
          label: 'Approaching the wheeling point',
          description: 'The column approaches the marked ground point at which the leading division is to wheel.',
          caseyRef: '¶347',
          duration: 1200,
          positions: approaching,
          annotations: ['marchArrow', { type: 'wheelingPoint', ...pointData }],
        },
        {
          label: `${side === 'left' ? 'Left' : 'Right'} wheel -- leading division turns, others conform`,
          description: 'The leading division wheels at the marked point; every other division conforms at once, inclining toward the pivot flank and closing to a 4-pace interval behind the one ahead.',
          caseyRef: '¶347-349',
          duration: 1800,
          positions: snap1,
          annotations: [{ type: 'wheelingArc', ...arcData }, { type: 'wheelingPoint', ...pointData }],
        },
        {
          label: 'Divisions continue to wheel in succession',
          description: 'Each division in turn reaches the wheeling point and turns, kept between its own guides and nearly parallel to the division ahead.',
          caseyRef: '¶349-351',
          duration: 1800,
          positions: snap2,
          annotations: [{ type: 'wheelingArc', ...arcData }, { type: 'wheelingPoint', ...pointData }],
        },
        {
          label: 'Most of the column has wheeled',
          description: 'The greater part of the column has changed direction; the rearmost division is still arriving at the wheeling point.',
          caseyRef: '¶351-354',
          duration: 1800,
          positions: snap3,
          annotations: [{ type: 'wheelingArc', ...arcData }, { type: 'wheelingPoint', ...pointData }],
        },
        {
          label: 'Forward, MARCH -- column in new direction',
          description: 'The whole column has changed direction and resumes a straight march at the standing 6-pace mass interval; the guide is restored to its habitual flank once straightened out.',
          caseyRef: '¶355-356, ¶362',
          duration: 1500,
          positions: wheeledColumn,
          annotations: ['marchArrow'],
        },
      ];
    }

    // --- From a halt (¶365-384) ---
    const facedFlank = setFacing(massHalted, newFacing);
    const pivot = captainPos(massHalted, leadCompanyOf(divisions[0]).index);
    const finalColumn = columnOfCompanies(divisions, {
      originX: pivot.x,
      originY: pivot.y,
      facing: newFacing,
      distanceMode: 'mass',
    });
    const finalMap = new Map(finalColumn.map((p) => [p.id, p]));

    const snap1 = cascadeSnapshot(facedFlank, finalMap, divisions, 1);
    const snap2 = cascadeSnapshot(facedFlank, finalMap, divisions, 2);
    const snap3 = cascadeSnapshot(facedFlank, finalMap, divisions, 3);

    return [
      {
        label: 'Column closed in mass, halted',
        description: 'The battalion is at a halt, in column by division closed in mass, facing the original line of march.',
        caseyRef: '¶365',
        duration: 0,
        positions: massHalted,
        annotations: [],
      },
      {
        label: `Battalion, ${side}--FACE`,
        description: `The whole column faces to the ${side} as one body; each chief of subdivision places himself beside his (now-leading) guide. The lieutenant-colonel has planted two markers on the new line, spaced a little less than one subdivision's front apart.`,
        caseyRef: '¶366-367',
        duration: 1200,
        positions: facedFlank,
        annotations: [],
      },
      {
        label: 'MARCH -- leading division files onto the new line',
        description: 'All subdivisions step off together; the leading division\'s guide directs himself parallel to the markers from the first step, halts once it has cleared the column, fronts, and dresses.',
        caseyRef: '¶369-370, ¶383',
        duration: 1600,
        positions: snap1,
        annotations: ['alignmentLine'],
      },
      {
        label: 'Following divisions conform in succession',
        description: 'Each following division\'s guide conforms to the guide of the division ahead of it, entering the new direction parallel to it, at 4 paces from its rear rank, then halts, fronts, and dresses.',
        caseyRef: '¶371-372',
        duration: 1600,
        positions: snap2,
        annotations: ['alignmentLine'],
      },
      {
        label: 'Rearmost divisions complete the movement',
        description: 'The remaining divisions in turn unmask the column, cross to the new line, halt, front, and dress, each squared with the division ahead of it.',
        caseyRef: '¶371-372, ¶383',
        duration: 1600,
        positions: snap3,
        annotations: ['alignmentLine'],
      },
      {
        label: 'Column formed on the new direction',
        description: 'The whole column now stands, halted, faced in the new direction it is henceforth to keep (¶365) -- the change of direction complete. By this method there is no direction that may not be given to a column in mass.',
        caseyRef: '¶383-384',
        duration: 1200,
        positions: finalColumn,
        annotations: [],
      },
    ];
  },
};
