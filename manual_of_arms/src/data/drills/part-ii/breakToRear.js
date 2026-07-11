import { battalionLine } from '../../../engine/battalionFormations.js';
import { wheel } from '../../../engine/formations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Second, Article II (S.B. ¶108-156): "To break to the rear, by the
// right or left, into column, and to advance or retire by the right or left
// of companies."
//
// Unlike Article I (each company wheels as one rigid block, pivoting on its
// flank guide), this article's underlying mechanic is per-FILE: at "Battalion
// right (or left) -- FACE" every soldier turns in place (no position change);
// at MARCH, each company's files, starting from the flank the captain
// hastens to, wheel in succession -- one file at a time, "like cars merging
// one at a time" -- rather than the whole company turning together (¶111-112,
// ¶138). The resulting column is the same perpendicular column-of-companies
// family as Article I (¶140: captain "conducts his company perpendicular to
// the original line"), so this file models the settled column with the same
// per-company wheel() primitive already used in breakByCompany.js, but
// stages the transition as a file-by-file cascade (least-recently-broken file
// still "faced," most-recently-broken already at its column position) to
// reflect this article's genuinely different geometry, rather than the
// simultaneous rigid block-wheel of Article I. Each company runs the same
// cascade simultaneously, since all 8 break at the one battalion MARCH.
//
// Four named variants are modeled: breaking to the rear by the right (¶108-
// 124) and by the left (¶125-129), and advancing or retiring by the right of
// companies (¶135-149) -- which share the identical "battalion FACE, then
// per-file break" mechanic and perpendicular-column result, differing only
// in which flank the files break to (rear vs front) during the transition
// and in the resulting column's direction of march relative to the original
// front. Advancing/retiring BY THE LEFT of companies (¶143, ¶148) is not
// separately modeled -- textually a mirror of the right-hand case, as noted
// in reenactorNotes.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 100;
const ORIGIN_Y = 250;

const fileById = new Map(
  DEFAULT_BATTALION.flatMap((co) => co.soldiers.map((s) => [s.id, s.file]))
);

function idsOfCompany(co) {
  return co.soldiers.map((s) => s.id);
}

/** 0 (breaks first) .. 19 (breaks last), per which flank the captain hastens
 * to: 'right' breaks file 1 (captain's own file) first, ascending; 'left'
 * breaks file 20 first, descending (¶111 vs ¶125). */
function breakOrderRank(file, side) {
  return side === 'left' ? 20 - file : file - 1;
}

const VARIANTS = {
  'rear-right': { side: 'right', label: 'Break to the Rear, by the Right', kind: 'rear' },
  'rear-left': { side: 'left', label: 'Break to the Rear, by the Left', kind: 'rear' },
  'advance-right': { side: 'right', label: 'Advance by the Right of Companies', kind: 'advance' },
  'retire-right': { side: 'right', label: 'Retire by the Right of Companies', kind: 'retire' },
};

export default {
  id: 'break-to-rear',
  title: 'To Break to the Rear into Column, and to Advance or Retire by Companies',
  part: 2,
  article: 2,
  caseyParagraphs: [
    108, 109, 111, 112, 113, 114, 115, 121, 123, 125, 134, 135, 136, 138, 140, 145,
  ],
  subMovements: [
    { id: 'rear-right', label: 'Break to Rear, by the Right' },
    { id: 'rear-left', label: 'Break to Rear, by the Left' },
    { id: 'advance-right', label: 'Advance by the Right of Companies' },
    { id: 'retire-right', label: 'Retire by the Right of Companies' },
  ],
  commands: (subMovement = 'rear-right') => {
    const v = VARIANTS[subMovement] ?? VARIANTS['rear-right'];
    const side = v.side;
    if (v.kind === 'rear') {
      return [
        { text: `1. By the ${side} of companies to the rear into column.`, type: 'preparatory' },
        { text: `2. Battalion ${side} — FACE.`, type: 'preparatory' },
        { text: '3. MARCH (or double quick — MARCH).', type: 'execution' },
      ];
    }
    const frontRear = v.kind === 'advance' ? 'front' : 'rear';
    return [
      { text: `1. By the ${side} of companies to the ${frontRear}.`, type: 'preparatory' },
      { text: `2. Battalion, ${side} — FACE.`, type: 'preparatory' },
      { text: '3. MARCH (or double quick — MARCH).', type: 'execution' },
      { text: '4. Guide right (left) or (centre).', type: 'execution' },
    ];
  },
  reenactorNotes:
    'Breaking to the rear (¶108-134) is "the most prompt and regular" method and is preferred on actual service unless there is a particular reason to break to the front (¶134). At the second command the battalion faces to the named flank in place; at MARCH each captain hastens to that flank and breaks two files to the rear -- the first file breaking the whole depth of both ranks, the second less -- while the covering sergeant (breaking right) or left guide (breaking left) conducts the headmost file; the remaining files wheel in succession at the same spot, the captain watching until the last file has wheeled, then commanding "Such company. HALT. FRONT. Left-DRESS" (¶111-115). Breaking to the left (¶125) is the identical mechanic by inverse means. Advancing or retiring by the right of companies (¶135-149) uses the same battalion-FACE-then-file-break mechanic, but the files break to the FRONT rather than the rear (¶138), and a fourth command, "Guide right (left) or (centre)," dresses the column\'s guide once formed (¶140); the resulting column still marches perpendicular to the original line in both cases (¶140), the "advance" and "retire" naming referring to which of the colonel\'s two named directions was ordered, not to a different final column heading. Advancing/retiring by the LEFT of companies (¶143, ¶148) is the textual mirror of the right-hand case and is not separately modeled. This animation approximates the file-by-file peel with a threshold cascade (each file "arrives" at its column position once its break-order rank is reached) rather than tracing each file\'s individual wheeling arc, since Casey\'s own file-by-file geometry is a different primitive than this project\'s existing whole-unit wheel() and was not built as a new engine primitive for this pass.',

  buildKeyframes: (_company, subMovement = 'rear-right', battalion = DEFAULT_BATTALION) => {
    const v = VARIANTS[subMovement] ?? VARIANTS['rear-right'];
    const side = v.side;
    const angleDeg = side === 'right' ? 90 : -90;
    const facedFacing = side === 'right' ? 90 : 270;

    const inLine = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
    const inLineIds = inLine.map((p) => p.id);
    const posMap = new Map(inLine.map((p) => [p.id, p]));

    const faced = inLine.map((p) => ({ ...p, facing: facedFacing }));
    const facedMap = new Map(faced.map((p) => [p.id, p]));

    // Pivot per company: right-hand variants pivot on the company's own file-1
    // (of-cpt) line position; left variant pivots on file-20 (fr-20) --
    // mirrors breakByCompany.js's pivot convention, since the settled column
    // this article produces belongs to the same perpendicular-column family.
    const pivotOf = (co) =>
      side === 'right' ? posMap.get(`c${co.index}-of-cpt`) : posMap.get(`c${co.index}-fr-20`);

    const arrived = [];
    battalion.forEach((co) => {
      const pivot = pivotOf(co);
      const subset = idsOfCompany(co).map((id) => posMap.get(id));
      arrived.push(...wheel(subset, { pivotX: pivot.x, pivotY: pivot.y, angleDeg }));
    });
    const arrivedMap = new Map(arrived.map((p) => [p.id, p]));

    function cascadeSnapshot(thresholdFrac) {
      return inLineIds.map((id) => {
        const file = fileById.get(id);
        const rank = breakOrderRank(file, side);
        const normalized = rank / 19;
        return normalized <= thresholdFrac ? arrivedMap.get(id) : facedMap.get(id);
      });
    }

    const snap25 = cascadeSnapshot(0.25);
    const snap60 = cascadeSnapshot(0.6);
    const snap90 = cascadeSnapshot(0.9);

    const breakToward = v.kind === 'advance' ? 'front' : v.kind === 'retire' ? 'rear' : 'rear';
    const firstFileLabel = side === 'right' ? 'first (right) file' : 'first (left) file';

    return [
      {
        label: 'Battalion in line of battle',
        description: 'The battalion stands in line of battle, halted.',
        caseyRef: '¶108',
        duration: 0,
        positions: inLine,
        annotations: [],
      },
      {
        label: `Battalion, ${side} — FACE`,
        description: `At the second command, the battalion faces to the ${side} in place. Each captain hastens to his company's ${side}; covering sergeants step into the front rank.`,
        caseyRef: v.kind === 'rear' ? '¶109, ¶111' : '¶136, ¶138',
        duration: 900,
        positions: faced,
        annotations: [],
      },
      {
        label: `MARCH — files break to the ${breakToward}`,
        description: `At MARCH, the ${firstFileLabel} of each company wheels ${breakToward === 'rear' ? 'perpendicularly to the rear' : 'to the front'}, conducted by its ${side === 'right' ? 'covering sergeant' : 'left guide'}; the remaining files wheel in succession, at the same spot, close upon its rear.`,
        caseyRef: v.kind === 'rear' ? '¶111-112' : '¶138',
        duration: 1400,
        positions: snap25,
        annotations: ['wheelingPoint'],
      },
      {
        label: 'Files continue to wheel in succession',
        description:
          'Files continue to peel off and wheel in succession, each company\'s captain watching his own company file past.',
        caseyRef: v.kind === 'rear' ? '¶112' : '¶138, ¶140',
        duration: 1400,
        positions: snap60,
        annotations: ['wheelingPoint'],
      },
      {
        label: 'Last files wheeling',
        description:
          'The last files of each company wheel; the instant the last file has passed, each captain commands "Such company. HALT. FRONT. Left-DRESS."',
        caseyRef: '¶112-114',
        duration: 1400,
        positions: snap90,
        annotations: ['wheelingPoint'],
      },
      {
        label:
          v.kind === 'rear'
            ? 'Column of companies formed, to the rear'
            : `Column of companies formed — ${v.kind}`,
        description:
          v.kind === 'rear'
            ? 'Each company, now faced front and dressed on its guide, stands in column, conducted perpendicular to the original line. The captain takes post before his company\'s centre.'
            : `Each company's guide dresses to the indicated point (${v.kind === 'advance' ? 'guide right, left, or centre' : 'guide right, left, or centre'}), preserving distance accurately; the column marches perpendicular to the original line.`,
        caseyRef: v.kind === 'rear' ? '¶114-115' : '¶140',
        duration: 1200,
        positions: arrived,
        annotations: ['marchArrow'],
      },
    ];
  },
};
