import { lineOfBattle, columnOfPlatoons, translate, rotatePoint } from '../../../engine/formations.js';
import { postColumnChiefsAndGuides } from '../../../engine/columnPosts.js';
import { SCALE, CANVAS } from '../../constants.js';

// ---------------------------------------------------------------------------
// Lesson Sixth, Article I (¶270-293): "To break the company into platoons,
// and to re-form the company."
//
// Unlike Lesson V's "break into column by platoon" (¶176-199), which is
// executed from a HALT by wheeling both platoons 90 degrees, THIS break is
// executed ON THE MARCH, in line of battle, by having the 2nd platoon mark
// time and then oblique into column behind the 1st -- no wheel is involved.
// Facing never changes (0 = north) for either platoon during the break; only
// the oblique's direction-of-travel is diagonal (¶327-ish oblique
// convention: soldiers keep their standing facing while moving diagonally,
// per engine/formations.js's oblique() -- "facing returns to original").
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const FI = SCALE.FILE_INTERVAL;
const PACE = SCALE.PACE_PX;

// A platoon's centre sits 4.5 file-intervals in from its file-1/file-11
// corner (10-file front); its chief stands 2 paces before that centre
// (¶270-271, and identically ¶177/¶189 in Lesson V's break-into-column,
// and src/engine/columnPosts.js).
const HALF_SPREAD = 4.5 * FI;
const TWO_PACES = 2 * PACE;

// A platoon's guide stands one file-interval beyond its own marching (left)
// flank -- the same convention used for a column of platoons throughout
// Lesson V (engine/columnPosts.js's GUIDE_BEYOND_FLANK), reused here because
// ¶273 puts the covering sergeant on exactly that flank ("the left flank of
// this platoon") once the break is under way.
const GUIDE_BEYOND_FLANK = 9 * FI + FI;

// Distance behind which the 2nd platoon comes to rest, front-rank to
// front-rank, once it has "its exact distance" (¶274): one platoon-front,
// identical to columnOfPlatoons()'s default platoonSpacing.
const PLATOON_SPACING = 10 * FI;

function chiefOffset(cornerX, cornerY, facing) {
  const r = rotatePoint(-HALF_SPREAD, -TWO_PACES, 0, 0, facing);
  return { x: cornerX + r.x, y: cornerY + r.y, facing };
}

function guideOffset(cornerX, cornerY, facing) {
  const r = rotatePoint(-GUIDE_BEYOND_FLANK, 0, 0, 0, facing);
  return { x: cornerX + r.x, y: cornerY + r.y, facing };
}

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Place one platoon's soldiers (front rank, rear rank, and its own file
 * closers) as a 10-file row, given the position of its file-1 (or file-11)
 * front-rank corner. This replicates formations.js's internal (unexported)
 * _platoonLine()/columnOfPlatoons() file-closer math -- duplicated locally
 * because that helper isn't exported, exactly as breakIntoColumn.js (Lesson
 * V) keeps its own local chiefPos() rather than reaching into the engine's
 * private helpers.
 */
function platoonRow(soldiers, baseFile, cornerX, cornerY, facing) {
  return soldiers.map((soldier) => {
    const fileIndex = soldier.file - baseFile;
    const localX = -fileIndex * FI;
    const localY =
      soldier.rank === 'rear'
        ? SCALE.RANK_GAP
        : soldier.rank === 'fileCloser'
        ? SCALE.RANK_GAP + SCALE.FILE_CLOSER_GAP
        : 0;
    const r = rotatePoint(localX, localY, 0, 0, facing);
    return { id: soldier.id, x: cornerX + r.x, y: cornerY + r.y, facing };
  });
}

// ---------------------------------------------------------------------------
// Sub-movement A: TO BREAK THE COMPANY INTO PLATOONS (¶270-277)
// ---------------------------------------------------------------------------

function buildBreak(company) {
  const ORIGIN_Y = 480;

  const p1Soldiers = company.filter((s) => s.platoon === 1);
  const p2Soldiers = company.filter((s) => s.platoon === 2);

  // p1 never shifts laterally -- ¶273: "the first platoon will continue to
  // march straight-forward." p2's corner starts 10 files left of p1's and
  // ends up sharing p1's lane (lateral2 = 10) once the oblique is complete.
  function frame({ paces1, paces2, lateral2, chiefsPosted, covCrossed, sgtGuiding }) {
    const p1CornerX = ORIGIN_X;
    const p1CornerY = ORIGIN_Y - paces1 * PACE;
    const p2CornerX = ORIGIN_X - 10 * FI + lateral2 * FI;
    const p2CornerY = ORIGIN_Y - paces2 * PACE;

    const p1Row = platoonRow(p1Soldiers, 1, p1CornerX, p1CornerY, 0);
    const p2Row = platoonRow(p2Soldiers, 11, p2CornerX, p2CornerY, 0);

    return [...p1Row, ...p2Row].map((s) => {
      if (s.id === 'of-cpt') {
        return chiefsPosted
          ? { id: s.id, ...chiefOffset(p1CornerX, p1CornerY, 0) }
          : s;
      }
      if (s.id === 'fc-1lt') {
        return chiefsPosted
          ? { id: s.id, ...chiefOffset(p2CornerX, p2CornerY, 0) }
          : s;
      }
      if (s.id === 'nc-cov' && covCrossed) {
        return { id: s.id, ...guideOffset(p1CornerX, p1CornerY, 0) };
      }
      if (s.id === 'fc-2sg' && sgtGuiding) {
        return { id: s.id, ...guideOffset(p2CornerX, p2CornerY, 0) };
      }
      return s;
    });
  }

  // KF1: company in line, marching, part of a column of companies (¶270).
  const inLine = frame({
    paces1: 0, paces2: 0, lateral2: 0,
    chiefsPosted: false, covCrossed: false, sgtGuiding: false,
  });

  // KF2: "Break into platoons" -- captain immediately places himself before
  // the centre of the 1st platoon (¶270); the 1st lieutenant passes quickly
  // around the left to the centre of the 2nd platoon and cautions "Mark
  // time" (¶271). Company still marching abreast; oblique has not begun.
  const commandGiven = frame({
    paces1: 2, paces2: 2, lateral2: 0,
    chiefsPosted: true, covCrossed: false, sgtGuiding: false,
  });

  // KF3: at "MARCH" (¶272), the 1st platoon continues straight forward
  // while the 2nd marks time in place (¶273-274, first clause) -- it holds
  // its KF2 position exactly. The covering sergeant moves rapidly to the
  // left flank of the 1st platoon, passing by the front rank, "as soon as
  // the flank shall be disengaged" (¶273); modeled here as complete by this
  // keyframe for clarity.
  const marchMarkTime = frame({
    paces1: 10, paces2: 2, lateral2: 0,
    chiefsPosted: true, covCrossed: true, sgtGuiding: false,
  });

  // KF4: the chief of the 2nd platoon commands "Right oblique, MARCH"
  // (¶274); the platoon shortens its step and obliques right, partway to
  // regaining 1st platoon's lane. Its guide (fc-2sg) settles into the
  // guide-post beyond the (still obliquing) platoon's own left flank, in
  // the trace of the covering sergeant, per ¶275's "guide of the second
  // platoon being near the direction of the guide of the first."
  const midOblique = frame({
    paces1: 16, paces2: 5, lateral2: 5,
    chiefsPosted: true, covCrossed: true, sgtGuiding: true,
  });

  // KF5: "Forward, MARCH" (¶275) -- the moment the guide of the 2nd platoon
  // covers the guide of the 1st, the 2nd platoon ceases obliquing and takes
  // up the straight march at its exact distance (¶274, last sentence): one
  // platoon-front directly behind the 1st. This is now identical in shape
  // to Lesson V's "column of platoons" end state, so it is built with the
  // same shared engine helpers used there for exact consistency.
  const finalPaces1 = 20;
  const columnOriginY = ORIGIN_Y - finalPaces1 * PACE;
  const rawColumn = columnOfPlatoons(company, {
    originX: ORIGIN_X,
    originY: columnOriginY,
    facing: 0,
    platoonSpacing: PLATOON_SPACING,
  });
  const columnFormed = postColumnChiefsAndGuides(rawColumn);

  // KF6: the column continues to march forward, distances preserved
  // (¶292-293's caution against elongating the column).
  const columnContinues = translate(columnFormed, { dx: 0, dy: -6 * PACE });

  return [
    {
      label: 'Company in line, marching',
      description:
        'The company marches in the cadenced step, one subdivision of a column, right in front. 1st platoon (files 1-10) is on the right, 2nd platoon (files 11-20) on the left.',
      caseyRef: '¶270',
      duration: 1200,
      positions: inLine,
      annotations: ['platoonDivider'],
    },
    {
      label: 'Break into platoons',
      description:
        'The captain commands "Break into platoons" and immediately places himself before the centre of the 1st platoon. The 1st lieutenant passes quickly around the left to the centre of the 2nd platoon and cautions it: "Mark time."',
      caseyRef: '¶270-271',
      duration: 900,
      positions: commandGiven,
      annotations: ['guideShiftLabel'],
    },
    {
      label: 'MARCH -- 1st platoon continues, 2nd platoon marks time',
      description:
        'At MARCH, the 1st platoon continues to march straight forward. The 2nd platoon begins to mark time in place. The covering sergeant moves rapidly to the left flank of the 1st platoon, passing by the front rank, as soon as that flank is disengaged.',
      caseyRef: '¶272-273',
      duration: 1400,
      positions: marchMarkTime,
      annotations: ['marchArrow'],
    },
    {
      label: 'Right oblique, MARCH -- 2nd platoon closes into column',
      description:
        'The chief of the 2nd platoon commands "Right oblique, MARCH" the instant the rear rank of the 1st platoon has passed, so as to begin obliquing without delay. The platoon shortens its step so as not to overrun its distance as it closes into the 1st platoon\'s lane.',
      caseyRef: '¶274',
      duration: 1400,
      positions: midOblique,
      annotations: ['marchArrow'],
    },
    {
      label: 'Forward, MARCH -- column of platoons complete',
      description:
        'The instant the guide of the 2nd platoon covers the guide of the 1st, its chief commands "Forward, MARCH"; the platoon ceases obliquing and marches straight, now at its exact distance -- one platoon-front -- behind the 1st. The company is now a column of platoons, right in front.',
      caseyRef: '¶275',
      duration: 1200,
      positions: columnFormed,
      annotations: ['platoonDistance'],
    },
    {
      label: 'Column of platoons continues to march',
      description:
        'The column marches on, both platoons preserving their distance and cadence exactly, guarding against any lengthening of the column (¶292-293).',
      caseyRef: '¶275, ¶292-293',
      duration: 1400,
      positions: columnContinues,
      annotations: ['marchArrow'],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sub-movement B: TO RE-FORM THE COMPANY (¶278-286)
// ---------------------------------------------------------------------------

function buildReform(company) {
  const P1_START_Y = 260;
  const P2_START_Y = P1_START_Y + PLATOON_SPACING; // column distance, ¶278 continuity

  // KF1: column of platoons, right in front, in march -- continuous with the
  // end state of sub-movement A (and of Lesson V's Article I), built with
  // the same shared helpers for consistency.
  const rawColumn0 = columnOfPlatoons(company, {
    originX: ORIGIN_X, originY: P1_START_Y, facing: 0, platoonSpacing: PLATOON_SPACING,
  });
  const column0 = postColumnChiefsAndGuides(rawColumn0);

  // KF2: "Form company" (¶278); captain adds "1. First platoon; 2. Right
  // oblique" (¶279); chief of 2nd platoon cautions it to continue straight
  // (¶280). No repositioning yet -- the column simply continues its march
  // while the commands are given.
  const commandGiven = translate(column0, { dx: 0, dy: -2 * PACE });

  // For the oblique/mark-time frames we again build each platoon as its own
  // row, since the 1st platoon's corner now moves independently in both x
  // (obliquing) and y (marching), while the 2nd platoon's corner moves only
  // in y ("continue to march straight forward," ¶280).
  const p1Soldiers = company.filter((s) => s.platoon === 1);
  const p2Soldiers = company.filter((s) => s.platoon === 2);

  function frame({ p1X, p1Y, p2X, p2Y, covT }) {
    const p1Row = platoonRow(p1Soldiers, 1, p1X, p1Y, 0);
    const p2Row = platoonRow(p2Soldiers, 11, p2X, p2Y, 0);
    const covGuide = guideOffset(p1X, p1Y, 0); // 1st platoon's left-flank guide post
    const covVacant = { x: p1X, y: p1Y, facing: 0 }; // vacant file-1 front-rank slot

    return [...p1Row, ...p2Row].map((s) => {
      if (s.id === 'of-cpt') return { id: s.id, ...chiefOffset(p1X, p1Y, 0) };
      if (s.id === 'fc-1lt') return { id: s.id, ...chiefOffset(p2X, p2Y, 0) };
      if (s.id === 'fc-2sg') return { id: s.id, ...guideOffset(p2X, p2Y, 0) };
      if (s.id === 'nc-cov') {
        // ¶282: "the covering sergeant, on the left of the first platoon,
        // will return to the right of the company, passing by the
        // front-rank." He starts at the 1st platoon's left-flank guide
        // post and crosses to its (vacant, since the captain has stepped
        // out) file-1 front-rank slot -- the company's true right flank.
        return {
          id: s.id,
          x: lerp(covGuide.x, covVacant.x, covT),
          y: lerp(covGuide.y, covVacant.y, covT),
          facing: 0,
        };
      }
      return s;
    });
  }

  // KF3: "MARCH" (¶281); the 1st platoon obliques to the right to unmask
  // the 2nd (¶282), partway through the oblique. The covering sergeant is
  // partway through his crossing to the right of the company.
  const midOblique = frame({
    p1X: ORIGIN_X + 6 * FI, p1Y: (P1_START_Y - 2 * PACE) - 4 * PACE,
    p2X: ORIGIN_X, p2Y: (P2_START_Y - 2 * PACE) - 6 * PACE,
    covT: 0.5,
  });

  // KF4: "Mark time" (¶283, first command) -- the unmasking is complete
  // (lateral shift reaches its full 10 files); the 1st platoon now holds
  // this position exactly (mark time = no further displacement) while the
  // 2nd platoon, still marching straight, continues to close up.
  const p1FinalX = ORIGIN_X + 10 * FI;
  const markTime = frame({
    p1X: p1FinalX, p1Y: 168,
    p2X: ORIGIN_X, p2Y: 232,
    covT: 1,
  });

  // KF5: "Forward, MARCH" (¶284) -- at the instant the two platoons unite,
  // the 1st platoon ceases marking time. The 2nd platoon has advanced to
  // share the 1st platoon's line exactly (same y); together they form one
  // continuous 20-file line (file 10 to file 11 spacing is a single
  // FILE_INTERVAL, identical to every other adjacent pair in the line).
  // Final posts: captain 2 paces before the centre of the WHOLE company
  // (not just the 1st platoon); covering sergeant fills the vacant file-1
  // front-rank slot (¶282's destination, matching the "captain out of the
  // ranks" convention used in lesson-iv/formByCompany.js); 2nd sergeant
  // remains the company's left guide -- see the caseyRef ¶286 note below.
  const lineOriginX = p1FinalX; // 625 -- file-1 corner of the reunited line
  const lineOriginY = 168;
  const unitedLine = lineOfBattle(company, { originX: lineOriginX, originY: lineOriginY, facing: 0 });
  const reformed = unitedLine.map((s) => {
    if (s.id === 'of-cpt') {
      return { ...s, x: lineOriginX - 9.5 * FI, y: lineOriginY - 2 * PACE, facing: 0 };
    }
    if (s.id === 'nc-cov') {
      return { ...s, x: lineOriginX, y: lineOriginY, facing: 0 };
    }
    if (s.id === 'fc-2sg') {
      return { ...s, x: lineOriginX - 20 * FI, y: lineOriginY, facing: 0 };
    }
    // fc-1lt: ¶284's analogue to Lesson V's formIntoLine.js ¶246 -- once the
    // platoons unite, the chief of the (former) 2nd platoon resumes his
    // habitual file-closer post. No override needed; lineOfBattle's default
    // placement already puts him there.
    return s;
  });

  // KF6: the reunited company continues to march in line.
  const continuedLine = translate(reformed, { dx: 0, dy: -6 * PACE });

  return [
    {
      label: 'Column of platoons, in march, right in front',
      description:
        'The column, by platoon, is in march, right in front -- continuous with the end of "Break into Platoons." The captain and 1st lieutenant stand 2 paces before their platoon centres; the covering sergeant and 2nd sergeant stand as guides one file interval beyond the marching (left) flank of their platoons.',
      caseyRef: '¶278',
      duration: 1200,
      positions: column0,
      annotations: ['platoonDistance'],
    },
    {
      label: 'Form company -- First platoon, right oblique',
      description:
        'The captain commands "Form company," then immediately adds "1. First platoon; 2. Right oblique." The chief of the 2nd platoon cautions it to continue to march straight forward.',
      caseyRef: '¶278-280',
      duration: 900,
      positions: commandGiven,
      annotations: [],
    },
    {
      label: 'MARCH -- 1st platoon obliques to unmask the 2nd',
      description:
        'At MARCH, repeated by the chief of the 2nd, the 1st platoon obliques to the right in order to unmask the 2nd. The covering sergeant, on the left of the 1st platoon, returns to the right of the company, passing by the front rank.',
      caseyRef: '¶281-282',
      duration: 1400,
      positions: midOblique,
      annotations: ['marchArrow'],
    },
    {
      label: 'Mark time -- unmasking complete',
      description:
        'When the 1st platoon has nearly unmasked the 2nd, the captain commands "Mark time," and at the instant the unmasking is complete, adds "MARCH." The 1st platoon ceases to oblique and marks time. Meanwhile the 2nd platoon, having continued straight forward, is nearly up with the 1st.',
      caseyRef: '¶283',
      duration: 1200,
      positions: markTime,
      annotations: ['platoonDivider'],
    },
    {
      label: 'Forward, MARCH -- platoons unite',
      description:
        'At the instant the two platoons unite, the captain commands "Forward, MARCH"; the 1st platoon ceases marking time. The company is one continuous line again. The covering sergeant, having crossed to the right of the company, fills the front rank at file 1; the 2nd sergeant remains the left guide (¶286, see interpretive note in code); the captain steps out to 2 paces before the centre of the whole company.',
      caseyRef: '¶284, ¶286',
      duration: 1200,
      positions: reformed,
      annotations: ['alignmentLine'],
    },
    {
      label: 'Company reunited, continuing to march in line',
      description: 'The reformed company advances in line of battle, twenty files under one captain once again.',
      caseyRef: '¶284',
      duration: 1400,
      positions: continuedLine,
      annotations: ['marchArrow'],
    },
  ];
}

export default {
  id: 'break-platoons',
  title: 'To Break the Company into Platoons, and to Re-form the Company',
  lesson: 6,
  article: 1,
  caseyParagraphs: [
    270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291,
    292, 293,
  ],
  commands: (subMovement = 'break') =>
    subMovement === 'reform'
      ? [
          { text: 'Form company.', type: 'preparatory' }, // ¶278
          { text: '1. First platoon; 2. Right oblique.', type: 'preparatory' }, // ¶279
          { text: '3. MARCH.', type: 'execution' }, // ¶281
          { text: '1. Mark time.', type: 'preparatory' }, // ¶283
          { text: '2. MARCH.', type: 'execution' }, // ¶283
          { text: 'Forward.', type: 'preparatory' }, // ¶284
          { text: 'MARCH.', type: 'execution' }, // ¶284
        ]
      : [
          { text: '1. Break into platoons.', type: 'preparatory' }, // ¶270
          { text: '2. MARCH.', type: 'execution' }, // ¶272
          { text: '1. Right oblique.', type: 'preparatory' }, // ¶274 (given by chief of 2nd platoon)
          { text: '2. MARCH.', type: 'execution' }, // ¶274
          { text: 'Forward.', type: 'preparatory' }, // ¶275
          { text: 'MARCH.', type: 'execution' }, // ¶275
        ],
  subMovements: [
    { id: 'break', label: 'A) Break into Platoons' },
    { id: 'reform', label: 'B) Re-form the Company' },
  ],
  reenactorNotes:
    'This break is executed ON THE MARCH by obliquing, NOT by wheeling from a halt (contrast Lesson V\'s "break into column by platoon," ¶176-199) -- no facing ever changes; the oblique is a diagonal march with the standing facing preserved. ' +
    'A) Breaking (¶270-277): the captain moves to 2 paces before the 1st platoon\'s centre; the 1st lieutenant passes around the left to 2 paces before the 2nd platoon\'s centre and cautions "Mark time." At MARCH, the 1st platoon marches straight on; the 2nd marks time until the 1st\'s rear rank has passed, then right-obliques (chief\'s own command) into column behind it, shortening the step to arrive at exact distance; "Forward, MARCH" squares it up the instant its guide covers the guide of the 1st (¶275). The covering sergeant crosses to the left flank of the 1st platoon (its new interior guide post) once disengaged (¶273); the 2nd sergeant, already the company\'s left guide near file 19-20, needs no such crossing and simply becomes the 2nd platoon\'s guide in place (¶275). In a column left in front, all of this is executed by inverse means (¶276-277). ' +
    'B) Re-forming (¶278-286): the captain commands "Form company; First platoon, right oblique; MARCH" -- it is the FRONT platoon (1st) that obliques (to the right, unmasking the 2nd), while the REAR platoon (2nd) simply continues straight and closes the distance -- the mirror image of which platoon moves during breaking. "Mark time" halts the 1st platoon exactly when unmasked; "Forward, MARCH" resumes it the instant the platoons unite. INTERPRETIVE NOTE on ¶286: this paragraph\'s flank language ("the guide of the second platoon, on its right... the guide of the first, on its right, remaining on that flank") is difficult to reconcile at face value with ¶273/275/282\'s unambiguous placement of both guides on the LEFT of their platoons during the column march. Since ¶282 gives an explicit, unambiguous itinerary for the covering sergeant (left flank of 1st platoon -> right of the company, passing by the front rank), that paragraph is treated as authoritative for his movement; the 2nd sergeant, whose left-flank post already coincides with the company\'s true left flank once the platoons unite, is modeled as needing no repositioning at all, arriving at the standard "left guide of the company" post automatically. ' +
    'Cautions (¶287-293), applicable to both halves: a subdivision that marks time too long, in a column of many subdivisions, arrests the march of the one behind it and lengthens the column (¶288); a platoon that obliques must not shorten its step so much as to lose distance, nor oblique so far that it must correct with a second oblique the other way (¶289-290); chiefs of obliquing platoons face toward their own platoons to enforce these principles (¶291); when several companies break in succession, each must hold its step exactly while the one ahead breaks, even at the cost of closing up on it, to prevent the whole column from stretching out (¶292); the captain holds himself on the directing flank to observe every movement (¶293).',

  buildKeyframes: (company, subMovement = 'break') => {
    if (subMovement === 'reform') return buildReform(company);
    return buildBreak(company);
  },
};
