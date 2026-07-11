import { columnOfCompanies } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Third, Article III (S.B. ¶273-285): "To change direction in column at
// full distance."
//
// The colonel posts a MARKER at the point where the turn begins, standing on
// the flank opposite the direction of the turn (¶273). The leading company's
// chief takes the guide on the side opposite the turn, aims it to graze the
// marker's breast, and wheels the company there per School-of-Company
// principles once the guide reaches it -- then every succeeding company's
// chief repeats exactly what the leading company did, at the same
// ground-fixed marker (¶274-276). This is the cleanest reuse of existing
// engine work in Part Third: a fixed-point wheel, repeated identically by
// each company in succession down the column -- modeled the same way the
// sibling drill changeDirectionHalf.js (Article VII) models it: compute the
// column's "not yet wheeled" state (still marching straight at the old
// facing) and its "already wheeled" state (columnOfCompanies at the new
// facing, anchored at the shared marker), then take discrete snapshots
// substituting an increasing number of leading companies from the wheeled
// state into the waiting state.
//
// Skirmisher platoon-column geometry (¶279-284) is flagged in the spec as
// significantly more complex (diagonal filing, distance-regaining at 33
// paces, asymmetric left/right handling) and skirmisher companies are not
// part of the project's 8-company default battalion model -- deferred, not
// modeled here.
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
  id: 'change-direction-full-distance',
  title: 'To Change Direction in Column at Full Distance',
  part: 3,
  article: 3,
  caseyParagraphs: [273, 274, 275, 276, 277, 278, 285],

  subMovements: [
    { id: 'right', label: 'Right' },
    { id: 'left', label: 'Left' },
  ],

  commands: (subMovement) => {
    const side = subMovement === 'left' ? 'left' : 'right';
    return [
      { text: `1. Head of column to the ${side}.`, type: 'preparatory' },
    ];
  },

  reenactorNotes:
    'The colonel rides in advance to the point where the change of direction should begin and posts a marker there, breast to the flank of the column, standing on the side OPPOSITE the direction of the turn; the marker holds his position until the whole battalion has passed him (¶273). As the leading company nears the marker, the colonel commands "Head of column to the left (or right)"; that company\'s chief takes the guide on the side opposite the turn (aiming it to graze the marker\'s breast), and wheels the company there per the already-established School-of-Company wheeling commands and principles; once the wheel is complete, the chief retakes the guide on the side of the new direction of march (¶274). Every succeeding company\'s chief and guides repeat, at the very same ground point, exactly what the leading company did (¶275) -- the colonel watches that each company\'s guide stays precisely on the arc, neither cutting inside nor swinging outside it (¶276). If no landmark exists for the new direction, the lieutenant-colonel posts himself on it 30-40 paces beyond the marker, confirmed by the colonel; the leading guide, the moment he has turned, sights two ground points in line with the lieutenant-colonel\'s heels (¶277). The senior major watches that each guide aims to graze the marker\'s breast (¶278). The deeper the column, the more rigorously every company must wheel at the same point and clear it promptly, since a small fault compounds with each additional subdivision behind it (¶285).',

  buildKeyframes: (_company, subMovement, battalion = DEFAULT_BATTALION) => {
    const units = battalion;
    const angleDeg = subMovement === 'left' ? -90 : 90;

    const marching = columnOfCompanies(units, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: OLD_FACING,
      distanceMode: 'full',
    });

    // Approach the marker: march the whole column forward a few paces so the
    // wheel has visible run-up before the leading company turns.
    const approachDx = APPROACH_PACES * 14;
    const approaching = marching.map((s) => ({ ...s, x: s.x + approachDx }));

    // Shared marker/wheel point: the leading company's captain position once
    // the column has approached it (¶273's stationary marker).
    const pivot = captainPos(approaching, units[0].index);
    const newFacing = (OLD_FACING + angleDeg + 360) % 360;

    // Column re-established in the new direction, anchored so the leading
    // company's front-rank right file starts exactly at the marker.
    const wheeledColumn = columnOfCompanies(units, {
      originX: pivot.x,
      originY: pivot.y,
      facing: newFacing,
      distanceMode: 'full',
    });
    const wheeledMap = new Map(wheeledColumn.map((p) => [p.id, p]));

    const snap2 = cascadeSnapshot(approaching, wheeledMap, units, 2);
    const snap4 = cascadeSnapshot(approaching, wheeledMap, units, 4);
    const snap6 = cascadeSnapshot(approaching, wheeledMap, units, 6);

    return [
      {
        label: 'Column at full distance, marching',
        description: 'The battalion, formed in column of companies at full distance, marches in a straight line of march.',
        caseyRef: '¶273',
        duration: 0,
        positions: marching,
        annotations: ['marchArrow'],
      },
      {
        label: 'Approaching the marker',
        description: 'The column approaches the marker the colonel has posted at the point where the change of direction is to begin, breast to the flank, on the side opposite the turn.',
        caseyRef: '¶273',
        duration: 1200,
        positions: approaching,
        annotations: ['marchArrow', 'wheelingPoint'],
      },
      {
        label: `${subMovement === 'left' ? 'Left' : 'Right'} -- leading companies wheel at the marker`,
        description: 'The leading companies, in succession, take the guide opposite the turn, graze the marker\'s breast, and wheel there per School-of-Company principles.',
        caseyRef: '¶274-276, 278',
        duration: 1800,
        positions: snap2,
        annotations: ['wheelingArc', 'wheelingPoint'],
      },
      {
        label: 'Companies continue to wheel in succession',
        description: 'Each company in turn reaches the marker and wheels there exactly as the leading company did; half the column now marches in the new direction.',
        caseyRef: '¶274-276',
        duration: 1800,
        positions: snap4,
        annotations: ['wheelingArc', 'wheelingPoint'],
      },
      {
        label: 'Most of the column has wheeled',
        description: 'The greater part of the column has now changed direction at the marker; the rearmost companies are still arriving, each clearing the point promptly so as not to block the one behind it.',
        caseyRef: '¶285',
        duration: 1800,
        positions: snap6,
        annotations: ['wheelingArc', 'wheelingPoint'],
      },
      {
        label: 'Column in new direction',
        description: 'The whole column has changed direction at the same fixed marker and continues its march at full distance.',
        caseyRef: '¶274-276',
        duration: 1500,
        positions: wheeledColumn,
        annotations: ['marchArrow'],
      },
    ];
  },
};
