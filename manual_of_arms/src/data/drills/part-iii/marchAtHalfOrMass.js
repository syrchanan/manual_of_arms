import { columnOfCompanies } from '../../../engine/battalionFormations.js';
import { translate } from '../../../engine/formations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION, SCALE } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Third, Article VI (S.B. ¶335-342): "To march in column at half
// distance, or closed in mass."
//
// No new geometry per the spec's own Complexity note: this article is a
// COMPOSABILITY guarantee, not a new movement -- a column already closed to
// half distance or in mass (Article V) marches, halts, and (per ¶339) can be
// marched to the rear using the exact same commands and principles already
// established for a full-distance column at ¶219 (march) and ¶286 (halt),
// with its distance parameter simply carried through unchanged. This drill
// therefore shows the same march/halt sequence as marchInColumnFull.js's
// 'forward' sub-movement, but starting from a column already closed to the
// chosen distance, to make that invariance visible.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 200;
const ORIGIN_Y = 220;
const FACING = 90; // marching east
const MARCH_PACES = 6;
const MARCH_DX = MARCH_PACES * SCALE.PACE_PX;

export default {
  id: 'march-column-half-or-mass',
  title: 'To March in Column at Half Distance, or Closed in Mass',
  part: 3,
  article: 6,
  caseyParagraphs: [335, 336, 337, 338, 339, 340],

  subMovements: [
    { id: 'half', label: 'A) March at Half Distance' },
    { id: 'mass', label: 'B) March Closed in Mass' },
  ],

  commands: [
    { text: '1. Column forward.', type: 'preparatory' },
    { text: '2. Guide left (or right).', type: 'preparatory' },
    { text: '3. MARCH (or double quick--MARCH).', type: 'execution' },
    { text: '1. Column.', type: 'preparatory' },
    { text: '2. HALT.', type: 'execution' },
  ],

  reenactorNotes:
    "A column already at half distance or closed in mass, halted, is put in march by the exact same commands already prescribed for a column at full distance (¶219): \"Column forward. Guide left (or right). MARCH\" (¶335). Markers, guide-tracing, and every other means of holding direction are likewise identical to the full-distance case; if the column is closed in mass, the junior major simply occupies the route-column post already prescribed at ¶259 (¶336). Halting uses the exact same commands as halting a full-distance column (¶286); if a general guide realignment is then wanted, the ¶290ff commands and means apply unchanged (¶337). Chiefs of subdivision still repeat march and halt exactly as they do in a full-distance column (¶338). The colonel will often march a half-distance or mass column to the rear using the about-while-marching means of ¶225-226 (¶339) -- the same in-place company-by-company facing reversal already modeled in marchInColumnFull.js's 'about' sub-movement, unchanged by the closer distance. A column by division or company, at any distance, halted or marching, can simply be faced to a new direction and marched off (¶340) -- a plain change of front, distinct from the wheeling \"change direction in column\" of Article III. The through-line of this whole article: the distance parameter set by Article V (half distance or mass) persists unchanged through every march, halt, and facing operation shown here -- it is only Article V's own \"close column\" command that ever changes it.",

  buildKeyframes: (_company, subMovement, battalion = DEFAULT_BATTALION) => {
    const distanceMode = subMovement === 'mass' ? 'mass' : 'half';

    const halted = columnOfCompanies(battalion, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: FACING,
      distanceMode,
    });
    const marching = translate(halted, { dx: MARCH_DX, dy: 0 });
    const haltedAgain = marching;

    const distLabel = distanceMode === 'mass' ? 'closed in mass' : 'at half distance';

    return [
      {
        label: `Column halted, ${distLabel}`,
        description: `The battalion stands halted in column of companies, ${distLabel} -- the distance set by the previous "close column" movement (Article V), unchanged.`,
        caseyRef: '¶335',
        duration: 0,
        positions: halted,
        annotations: [],
      },
      {
        label: 'Column forward -- Guide left -- MARCH',
        description: `The column steps off by the exact same commands used for a column at full distance; every means of holding direction is likewise identical. The column continues to march ${distLabel} throughout.`,
        caseyRef: '¶335-336, 338',
        duration: 1800,
        positions: marching,
        annotations: ['marchArrow'],
      },
      {
        label: 'Column -- HALT',
        description: `The column halts by the exact same commands used to halt a column at full distance, its distance ${distLabel} unchanged.`,
        caseyRef: '¶337',
        duration: 1200,
        positions: haltedAgain,
        annotations: [],
      },
    ];
  },
};
