import { columnOfCompanies } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Third, Article VII (S.B. ¶343-344): "To change direction in column at
// half distance."
//
// Casey gives NO new commands or mechanic here -- a half-distance column
// changes direction "by the same commands and according to the same
// principles as a column at full distance" (¶343), i.e. the same
// wheel-in-marching relay already used for the company-scale column-of-
// platoons change of direction (School of Company Lesson V), just
// generalized from 2 platoons to N companies. The one wrinkle: because
// subdivisions are packed closer together at half distance, the PIVOT man's
// step is actually LONGER than at full distance -- 14in (quick time) / 17in
// (double quick) instead of 9in/11in -- "in order to clear, in time, the
// wheeling point," so the marching flank can describe the arc of a larger
// circle to compensate (¶343). This is a step-length/cadence detail for the
// human wheeling man, not a change to the engine geometry, so it is called
// out in reenactorNotes rather than modeled as a distinct animation.
//
// Engine approach: each company reaches a single, shared wheel point (the
// same ground point for every company, per the already-established ¶230
// principle used at company scale) and wheels there in succession, front to
// rear, continuing in the new direction at the same half-distance interval.
// Rather than tracing each company's individual arc, this is modeled the
// same way lesson-vi/countermarch.js models its file-by-file cascade:
// compute the column's "already wheeled" final state (columnOfCompanies at
// the new facing, anchored at the shared wheel point) and the "not yet
// wheeled" state (still marching straight, half distance, old facing), then
// take discrete snapshots substituting an increasing number of leading
// companies from the final state into the waiting state.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 200;
const ORIGIN_Y = 220;
const OLD_FACING = 90; // marching east
const APPROACH_PACES = 8;

function idsOfCompany(co) {
  return co.soldiers.map((s) => s.id);
}

function captainPos(positions, companyIndex) {
  return positions.find((p) => p.id === `c${companyIndex}-of-cpt`);
}

/** Substitute the leading `wheeledCount` companies' positions with their
 * `arrivedMap` (already-wheeled) counterparts; the rest stay in `waiting`. */
function cascadeSnapshot(waiting, arrivedMap, units, wheeledCount) {
  const wheeledIds = new Set(units.slice(0, wheeledCount).flatMap(idsOfCompany));
  return waiting.map((p) => (wheeledIds.has(p.id) ? arrivedMap.get(p.id) ?? p : p));
}

export default {
  id: 'change-direction-half-distance',
  title: 'To Change Direction in Column at Half Distance',
  part: 3,
  article: 7,
  caseyParagraphs: [343, 344],
  subMovements: [
    { id: 'right', label: 'Right Wheel' },
    { id: 'left', label: 'Left Wheel' },
  ],
  commands: (subMovement) => {
    const side = subMovement === 'left' ? 'left' : 'right';
    return [
      { text: `1. Battalion, ${side} wheel.`, type: 'preparatory' },
      { text: '2. MARCH.', type: 'execution' },
      { text: '3. Forward.', type: 'preparatory' },
      { text: '4. MARCH.', type: 'execution' },
    ];
  },
  reenactorNotes:
    'A column at half distance changes direction by the identical commands and principles already used for a column at full distance (¶343) -- no new command is given here. The one difference the drill-master must know: because half-distance subdivisions are packed closer together, the wheeling pivot man\'s step is actually LONGER than at full distance -- 14 inches at quick time, 17 at double quick, instead of the full-distance figures of 9 and 11 -- so that he clears the wheeling point in time and the marching flank can describe the arc of a correspondingly larger circle (¶343-344). Each company, in succession from the head, reaches the same marked ground point and wheels there before resuming the march in the new direction, exactly as at company scale (School of Company, Lesson V); this animation shows that cascade across all 8 companies rather than tracing each one\'s individual arc.',

  buildKeyframes: (_company, subMovement, battalion = DEFAULT_BATTALION) => {
    const units = battalion;
    const angleDeg = subMovement === 'left' ? -90 : 90;

    const marching = columnOfCompanies(units, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: OLD_FACING,
      distanceMode: 'half',
    });

    // Approach the wheel point: march the whole column forward a few paces
    // (screen-space "forward" for facing 90 = +x) so the wheel has visible
    // run-up before the leading company turns.
    const approachDx = APPROACH_PACES * 14;
    const approaching = marching.map((s) => ({ ...s, x: s.x + approachDx }));

    // Shared wheel point: the leading company's captain position once the
    // column has approached it (¶230's "same ground point" principle, reused
    // from the company-scale change-of-direction drill).
    const pivot = captainPos(approaching, units[0].index);
    const newFacing = (OLD_FACING + angleDeg + 360) % 360;

    // Column re-established in the new direction, anchored so the leading
    // company's front-rank right file starts exactly at the wheel point.
    const wheeledColumn = columnOfCompanies(units, {
      originX: pivot.x,
      originY: pivot.y,
      facing: newFacing,
      distanceMode: 'half',
    });
    const wheeledMap = new Map(wheeledColumn.map((p) => [p.id, p]));

    const snap2 = cascadeSnapshot(approaching, wheeledMap, units, 2);
    const snap4 = cascadeSnapshot(approaching, wheeledMap, units, 4);
    const snap6 = cascadeSnapshot(approaching, wheeledMap, units, 6);

    return [
      {
        label: 'Column at half distance, marching',
        description:
          'The battalion, formed in column of companies at half distance, marches in a straight line of march.',
        caseyRef: '¶343',
        duration: 0,
        positions: marching,
        annotations: ['marchArrow'],
      },
      {
        label: 'Approaching the wheeling point',
        description:
          'The column approaches the point where the change of direction is to be made, same ground point for every company in succession.',
        caseyRef: '¶343',
        duration: 1200,
        positions: approaching,
        annotations: ['marchArrow', 'wheelingPoint'],
      },
      {
        label: `${subMovement === 'left' ? 'Left' : 'Right'} wheel — leading companies turn`,
        description:
          'The leading companies wheel at the marked point in succession, the pivot man taking a longer step (14in quick time) than he would at full distance, to clear the wheeling point in time (¶343-344).',
        caseyRef: '¶343-344',
        duration: 1800,
        positions: snap2,
        annotations: ['wheelingArc', 'wheelingPoint'],
      },
      {
        label: 'Companies continue to wheel in succession',
        description: 'Each company in turn reaches the same point and wheels, half the column now in the new direction.',
        caseyRef: '¶343-344',
        duration: 1800,
        positions: snap4,
        annotations: ['wheelingArc', 'wheelingPoint'],
      },
      {
        label: 'Most of the column has wheeled',
        description: 'The greater part of the column has now changed direction; the rearmost companies are still arriving.',
        caseyRef: '¶343-344',
        duration: 1800,
        positions: snap6,
        annotations: ['wheelingArc', 'wheelingPoint'],
      },
      {
        label: 'Column in new direction',
        description:
          'The whole column has changed direction and continues its march at half distance, guides and cadence unchanged throughout.',
        caseyRef: '¶343-344',
        duration: 1500,
        positions: wheeledColumn,
        annotations: ['marchArrow'],
      },
    ];
  },
};
