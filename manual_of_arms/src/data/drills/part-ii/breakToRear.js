import { battalionLine, columnOfCompanies } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION, SCALE } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Second, Article II (S.B. ¶108-156): "To break to the rear, by the
// right or left, into column, and to advance or retire by the right or left
// of companies."
//
// Unlike Article I (each company wheels as one rigid block, pivoting on its
// flank guide, forming a column ALONG the flank), this article's underlying
// mechanic is per-FILE: at "Battalion right (or left) -- FACE" every soldier
// turns in place (no position change); at MARCH, each company's files, starting
// from the flank the captain hastens to, wheel in succession -- one file at a
// time, "like cars merging one at a time" -- and are conducted PERPENDICULAR
// to the original line (¶111-112, ¶138). That perpendicular direction is the
// key distinction from Article I: the rear break (¶108-115) conducts the column
// to the REAR (companies faced 180), while the advance/retire family (¶135-140)
// breaks to the FRONT (¶138) and conducts it to the front (companies faced 0).
// The settled column is therefore a genuine column of companies built with
// columnOfCompanies() at the appropriate facing -- NOT the Article-I flank
// wheel this file previously (incorrectly) reused for all variants. The
// transition is staged as a file-by-file cascade (least-recently-broken file
// still "faced," most-recently-broken already at its column position); every
// company runs the cascade simultaneously, since all 8 break at the one
// battalion MARCH. (¶114 has the captain judge the "new alignment perpendicular
// to that occupied in line of battle" -- read here as the COLUMN AXIS being
// perpendicular to the old E-W line; each company broadside runs parallel to
// the old front, as in any column of companies.)
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
    'Breaking to the rear (¶108-134) is "the most prompt and regular" method and is preferred on actual service unless there is a particular reason to break to the front (¶134). At the second command the battalion faces to the named flank in place; at MARCH each captain hastens to that flank and breaks two files to the rear -- the first file breaking the whole depth of both ranks, the second less -- while the covering sergeant (breaking right) or left guide (breaking left) conducts the headmost file; the remaining files wheel in succession at the same spot, the captain watching until the last file has wheeled, then commanding "Such company. HALT. FRONT. Left-DRESS" (¶111-115). Breaking to the left (¶125) is the identical mechanic by inverse means. Advancing or retiring by the right of companies (¶135-149) uses the same battalion-FACE-then-file-break mechanic, but the files break to the FRONT rather than the rear (¶138), and a fourth command, "Guide right (left) or (centre)," dresses the column\'s guide once formed (¶140); the resulting column still marches perpendicular to the original line in both cases (¶140), the "advance" and "retire" naming referring to which of the colonel\'s two named directions was ordered, not to a different final column heading. Advancing/retiring by the LEFT of companies (¶143, ¶148) is the textual mirror of the right-hand case and is not separately modeled. The settled column is a true column of companies conducted PERPENDICULAR to the original line -- to the rear for the break-to-rear case, to the front for advance/retire -- which is what distinguishes this article from Article I (break-by-company), whose column forms along the flank. The transition is approximated with a threshold cascade (each file "arrives" at its column position once its break-order rank is reached) rather than tracing each file\'s individual wheeling arc; Casey\'s footwork detail (¶114) has each captain judge the new alignment "perpendicular to that occupied in line of battle," which is read here as the column axis being perpendicular to the old line.',

  buildKeyframes: (_company, subMovement = 'rear-right', battalion = DEFAULT_BATTALION) => {
    const v = VARIANTS[subMovement] ?? VARIANTS['rear-right'];
    const side = v.side;
    const facedFacing = side === 'right' ? 90 : 270;

    const inLine = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
    const inLineIds = inLine.map((p) => p.id);
    const posMap = new Map(inLine.map((p) => [p.id, p]));

    const faced = inLine.map((p) => ({ ...p, facing: facedFacing }));
    const facedMap = new Map(faced.map((p) => [p.id, p]));

    // Arrived: a true column of companies conducted PERPENDICULAR to the
    // original line -- the defining distinction of this article from Article I
    // (break-by-company), which forms a column ALONG the flank. The rear break
    // (¶108-115) conducts the column to the REAR (companies faced 180); the
    // advance/retire family (¶135-140) breaks to the FRONT (¶138) and conducts
    // it to the front (faced 0). "By the right" -> company 1 leads; "by the
    // left" -> company 8 leads (units reversed). The column is anchored at the
    // lead company's own line position and stacks the rest behind it at full
    // (one-company-front) distance. Note: ¶114 has the captain judge that "the
    // new alignment may be perpendicular to that which the company had occupied
    // in line of battle" -- read here as the COLUMN AXIS being perpendicular to
    // the old E-W line (true in this construction); each company broadside runs
    // parallel to the old front, as in any column of companies.
    const arrivedFacing = v.kind === 'rear' ? 180 : 0;
    const units = side === 'left' ? [...battalion].reverse() : battalion;
    const leadAnchor = posMap.get(`c${units[0].index}-of-cpt`);
    // Anchor so the column forms on the correct side of the original line: the
    // rear break extends to the rear (south of the line), the advance/retire
    // break to the front (north). The lead company (first to break, "by the
    // right/left") sits at the deep end and the column trails back toward the
    // line, so the company nearest the line is the last to fall in.
    const COMPANY_FRONT_PX = 19 * SCALE.FILE_INTERVAL; // one company front = 'full' distance
    const columnDepth = (units.length - 1) * COMPANY_FRONT_PX;
    const arrived = columnOfCompanies(units, {
      originX: leadAnchor.x,
      originY: leadAnchor.y + (v.kind === 'rear' ? columnDepth : -columnDepth),
      facing: arrivedFacing,
      distanceMode: 'full',
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

    // ¶138 governs the whole advance/retire family (¶135-149): files break to
    // the FRONT regardless of whether the colonel named "front" or "rear" as
    // the direction to advance/retire toward -- the naming is the destination,
    // not the break direction. Only the genuinely distinct ¶108 maneuver
    // (kind: 'rear') breaks to the rear.
    const breakToward = v.kind === 'rear' ? 'rear' : 'front';
    const firstFileLabel = side === 'right' ? 'first (right) file' : 'first (left) file';

    // The rear break (¶108-115) ends with the captain's "Such company. HALT.
    // FRONT. Left-DRESS" (¶112); the advance/retire family (¶135-140) instead
    // dresses on the colonel's separate 4th command ("Guide right/left/centre",
    // ¶140) with no captain-commanded HALT/FRONT/DRESS.
    const lastFilesDesc = v.kind === 'rear'
      ? 'The last files of each company wheel; the instant the last file has passed, each captain commands "Such company. HALT. FRONT. Left-DRESS."'
      : 'The last files of each company wheel; each captain conducts his company perpendicular to the original line, and at the colonel\'s fourth command each guide dresses to the right, left, or centre — there is no separate captain-commanded "Such company. HALT. FRONT. DRESS" in this case.';
    const lastFilesRef = v.kind === 'rear' ? '¶112-114' : '¶140';

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
        description: lastFilesDesc,
        caseyRef: lastFilesRef,
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
