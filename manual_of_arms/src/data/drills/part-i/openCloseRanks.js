import { battalionLine } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';

// The battalion's rightmost file sits near the canvas's right edge; the
// line spans NUM_COMPANIES * 20 files at FILE_INTERVAL px each (see
// battalionFormations.js's COMPANY_STRIDE) -- 1590px for 8 companies, fitting
// CANVAS_BATTALION's wider viewBox (DrillPage selects this viewBox whenever
// the drill's school is 'battalion').
const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 60;
const ORIGIN_Y = 200;

// ¶30: covering sergeants + left sergeant mark the new rear-rank line 4
// paces behind the front rank -- a battalion-specific "open order" depth,
// distinct from SCALE.RANK_GAP (16in close-order interval, S.C. ¶135).
const OPEN_ORDER_DEPTH_PX = 4 * SCALE.PACE_PX;
// File closers hold 2 paces behind the (now-relocated) rear rank at open
// order (¶32) -- the same 2-pace figure SCALE.FILE_CLOSER_GAP already
// encodes for close order, so both rear rank and file closers shift by the
// same extra depth relative to their close-order positions.
const OPEN_SHIFT_PX = OPEN_ORDER_DEPTH_PX - SCALE.RANK_GAP;

// id -> rank lookup across all 8 companies, for deciding which soldiers
// shift when opening/closing ranks (battalionLine()'s output only carries
// { id, x, y, facing }, not roster fields).
const rankById = new Map(
  DEFAULT_BATTALION.flatMap((co) => co.soldiers.map((s) => [s.id, s.rank]))
);

/** Shift rear-rank and file-closer soldiers back by extraDepthPx along the
 * facing's "behind" axis; front rank and any other roles stay in place. */
function openOrder(positions, extraDepthPx) {
  return positions.map((s) => {
    const rank = rankById.get(s.id);
    if (rank !== 'rear' && rank !== 'fileCloser') return s;
    const rad = (s.facing * Math.PI) / 180;
    const depthX = -Math.sin(rad);
    const depthY = Math.cos(rad);
    return { ...s, x: s.x + depthX * extraDepthPx, y: s.y + depthY * extraDepthPx };
  });
}

export default {
  id: 'open-close-ranks',
  title: 'To Open and to Close Ranks',
  part: 1,
  article: 1,
  caseyParagraphs: [27, 28, 29, 30, 31, 32, 33, 34],
  commands: [
    { text: '1. Prepare to open ranks.', type: 'preparatory' },
    { text: '2. To the rear, open order.', type: 'preparatory' },
    { text: '3. MARCH.', type: 'execution' },
    { text: '4. FRONT.', type: 'execution' },
  ],
  reenactorNotes:
    "This is a whole-battalion depth change, not a per-company drill: at MARCH (¶31), the rear rank and file closers of all 8 companies step back in one synchronized motion. The lieutenant colonel (right flank, at the file-closer line) and major (right flank, 4 paces in front) supervise the new alignment; the covering sergeants and the battalion's left sergeant (the leftmost company's own left guide) mark the new rear-rank line by stepping out to it first, inverting their pieces as a visual marker (¶30). Closing ranks (¶34) is not independently detailed in this manual's own text -- Casey defers to a School-of-the-Company reference (S.C. No. 28) that falls in Lessons I-II, not present in this project's source extraction -- so closing is implemented here as the documented mirror of opening (rear rank and file closers return to their normal close-order depth). Field-and-staff figures (colonel, lieutenant colonel, majors) are not yet individually rendered in the battalion block view; only the company bands (front rank, rear rank, file closers) are shown in this pass.",

  buildKeyframes: (_company, _subMovement, battalion = DEFAULT_BATTALION) => {
    const closed = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
    const opened = openOrder(closed, OPEN_SHIFT_PX);

    return [
      {
        label: 'Battalion in line, ranks closed',
        description:
          'The battalion stands in line of battle, 8 companies forming one continuous line. Ranks are closed: rear rank at the normal close interval behind the front rank, file closers 2 paces behind the rear rank.',
        caseyRef: '¶27',
        duration: 0,
        positions: closed,
        annotations: [],
      },
      {
        label: 'Prepare to open ranks',
        description:
          'At the preparatory command, the lieutenant colonel places himself on the right of the battalion at the file-closer line; the major places himself on the right, 4 paces in front of the battalion.',
        caseyRef: '¶27–28',
        duration: 600,
        positions: closed,
        annotations: [],
      },
      {
        label: 'To the rear, open order — MARCH',
        description:
          'At MARCH, the rear rank and file closers of every company step to the rear together: the rear rank halts 4 paces behind the front rank, file closers 2 paces behind that, 6 paces from the front rank in all. The covering sergeants and the left sergeant of the battalion mark the new rear-rank line; the lieutenant colonel aligns the file closers on the left file closer. FRONT is then commanded once the ranks are aligned, and the lieutenant colonel, major, and left sergeant resume their normal posts.',
        caseyRef: '¶29–33',
        duration: 2000,
        positions: opened,
        annotations: [],
      },
      {
        label: 'Close ranks',
        description:
          'The battalion returns to close order: rear rank and file closers resume their normal close-order depth behind the front rank.',
        caseyRef: '¶34',
        duration: 1500,
        positions: closed,
        annotations: [],
      },
    ];
  },
};
