import { lineOfBattle, translate } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

// ---------------------------------------------------------------------------
// Lesson Sixth, Article II (¶294-310): "Being in column, to break files to
// the rear, and to cause them to re-enter into line."
//
// The company marches in LINE OF BATTLE, one subdivision of a (battalion)
// column, right (or left) in front (¶294 -- the identical setup phrase as
// Article I's ¶270). Two files are peeled off a flank, face, and fall in
// marching to the rear behind the file closers, narrowing the company's
// front; later they file back up into their original places.
//
// We demonstrate breaking TWO files from the LEFT (files 19 and 20), one of
// Casey's two textually-equal alternatives ("left (or right)", ¶294). The
// right-flank alternative is not chosen for the worked example because it
// would relocate the captain and covering sergeant (file 1) out of their
// posts -- not the ordinary case the text means to illustrate.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 400;
const FI = SCALE.FILE_INTERVAL;
const PACE = SCALE.PACE_PX;

const BREAK_IDS = ['fr-19', 'rr-19', 'fr-20', 'rr-20'];

// True left flank before breaking = file 20's front-rank x.
const FLANK_X = ORIGIN_X - 19 * FI;

// Depth, from the front rank, of the ordinary file-closer line.
const FILE_CLOSER_Y = SCALE.RANK_GAP + SCALE.FILE_CLOSER_GAP;

// The broken files come to rest one further FILE_CLOSER_GAP (2 paces) behind
// the file-closer line. Casey gives no exact distance for this gap -- ¶297
// speaks only of "shortening the step... to make room" for files ordered
// out after them -- so this reuses the already-established 2-pace file-
// closer interval (¶139-140) for consistency rather than inventing a new unit.
const TRAIL_Y = FILE_CLOSER_Y + SCALE.FILE_CLOSER_GAP;

// 2nd sergeant (fc-2sg), the company's left guide, habitually stands
// opposite file 19 (src/data/company.js). Per ¶305, as files break off that
// flank he "gradually closes on the nearest front-rank man remaining in
// line" -- i.e. shifts one file interval inward, to opposite file 18.
const GUIDE_OPEN_X = ORIGIN_X - 18 * FI; // opposite file 19 (habitual)
const GUIDE_CLOSED_X = ORIGIN_X - 17 * FI; // opposite file 18 (closed up)

function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * The trailing arrangement for the two broken files, one FILE_INTERVAL
 * apart, facing forward (0 -- the direction of march is unchanged; the
 * "face to the right/left" of ¶295 is the brief turning-and-filing motion
 * that gets them there, not their resulting standing orientation, matching
 * ¶320's later assumption that broken files are still in ordinary marching
 * orientation and must WHEEL, like everyone else, when the company itself
 * later faces to march by the flank).
 *
 * Across order "from that flank" (¶295): the odd file (19) covers the 1st
 * and 3rd of the four positions, the even file (20) the 2nd and 4th --
 * i.e. [odd-front, even-front, odd-rear, even-rear], identical to the
 * doubling convention already used for a column of files' head
 * (engine/formations.js's _columnFilePosition: front pairs share a row,
 * across index 0-3, rather than front/rear standing one behind the other).
 */
function trailingPositions(trailY) {
  return [
    { id: 'fr-19', x: FLANK_X, y: trailY, facing: 0 },
    { id: 'fr-20', x: FLANK_X + FI, y: trailY, facing: 0 },
    { id: 'rr-19', x: FLANK_X + 2 * FI, y: trailY, facing: 0 },
    { id: 'rr-20', x: FLANK_X + 3 * FI, y: trailY, facing: 0 },
  ];
}

/**
 * Build one keyframe's positions.
 *
 * @param company        the 47-soldier roster
 * @param advancePx       how far (px) the whole company has marched forward
 *                        (north) from the starting line, ORIGIN_Y - advancePx
 * @param mode            'inLine'   - no break in progress; standard march
 *                         'faced'    - the two files have faced in place,
 *                                      not yet advanced from their original
 *                                      (pre-march) spot (¶295, facing clause)
 *                         'trailing' - the two files are fully in their
 *                                      rear-trailing arrangement
 *                         'return'   - blends the trailing arrangement
 *                                      toward the original in-line slot by
 *                                      `t` (0 = still trailing, 1 = home)
 * @param guideT          0 = guide at his habitual post (opposite file 19),
 *                        1 = guide fully closed/reopened as appropriate
 * @param t               interpolation fraction, only used when mode === 'return'
 */
function buildFrame(company, { advancePx, mode, guideT = 0, t = 0 }) {
  const base = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
  let positions = translate(base, { dx: 0, dy: -advancePx });

  if (mode === 'faced') {
    // The two files face in place -- they hold their ORIGINAL (untranslated)
    // ground position while the rest of the company has already advanced
    // ahead of them (¶295: at MARCH they face; the separation that lets
    // them fall behind opens up as the company continues on).
    positions = positions.map((s) =>
      BREAK_IDS.includes(s.id) ? { ...base.find((o) => o.id === s.id), facing: 90 } : s
    );
  } else if (mode === 'trailing') {
    const trailY = ORIGIN_Y + TRAIL_Y - advancePx;
    const trailMap = Object.fromEntries(trailingPositions(trailY).map((p) => [p.id, p]));
    positions = positions.map((s) => trailMap[s.id] ?? s);
  } else if (mode === 'return') {
    const trailY = ORIGIN_Y + TRAIL_Y - advancePx;
    const trailMap = Object.fromEntries(trailingPositions(trailY).map((p) => [p.id, p]));
    positions = positions.map((s) => {
      if (!BREAK_IDS.includes(s.id)) return s;
      const from = trailMap[s.id];
      const homeSoldier = base.find((o) => o.id === s.id);
      const to = { x: homeSoldier.x, y: homeSoldier.y - advancePx };
      return { id: s.id, x: lerp(from.x, to.x, t), y: lerp(from.y, to.y, t), facing: 0 };
    });
  }
  // mode === 'inLine': positions is just the plain translate -- files 19/20
  // are indistinguishable from any other file, which is exactly the point
  // (both the very first and the fully-restored final keyframes use this).

  if (guideT !== 0 || mode === 'trailing' || mode === 'return') {
    positions = positions.map((s) => {
      if (s.id !== 'fc-2sg') return s;
      return { ...s, x: lerp(GUIDE_OPEN_X, GUIDE_CLOSED_X, guideT) };
    });
  }

  return positions;
}

// ---------------------------------------------------------------------------
// Sub-movement A: files break off to the rear (¶294-298)
// ---------------------------------------------------------------------------

function buildBreakOff(company) {
  const inLine = buildFrame(company, { advancePx: 0, mode: 'inLine' });
  const faced = buildFrame(company, { advancePx: 2 * PACE, mode: 'faced' });
  const filing = buildFrame(company, { advancePx: 4 * PACE, mode: 'trailing', guideT: 1 });
  const steady = buildFrame(company, { advancePx: 6 * PACE, mode: 'trailing', guideT: 1 });
  const continued = buildFrame(company, { advancePx: 9 * PACE, mode: 'trailing', guideT: 1 });

  return [
    {
      label: 'Company marching in line',
      description:
        'The company marches in the cadenced step, one subdivision of a column, right (or left) in front.',
      caseyRef: '¶294',
      duration: 1200,
      positions: inLine,
      annotations: ['fileNumbers'],
    },
    {
      label: 'Two files from the left to rear -- MARCH',
      description:
        'The captain commands "Two files from the left to rear, MARCH." At the command, the two files on the left of the company (files 19 and 20) face to the right; the rest of the company continues to march straight forward.',
      caseyRef: '¶294-295',
      duration: 1000,
      positions: faced,
      annotations: [],
    },
    {
      label: 'Files file to the left, falling to the rear',
      description:
        'The two faced files immediately file to the left, so that the odd numbers (file 19) cover the 1st and 3rd files, and the even numbers (file 20) the 2nd and 4th, reckoned from that flank. The guide on that flank (2nd sergeant) gradually closes on the nearest front-rank man remaining in line -- now file 18.',
      caseyRef: '¶295, ¶305',
      duration: 1200,
      positions: filing,
      annotations: ['guideShiftLabel'],
    },
    {
      label: 'Company advances with a reduced front',
      description:
        'The company continues to march with a front of eighteen files; the two broken files follow directly behind the file closers, keeping pace and distance.',
      caseyRef: '¶305-306',
      duration: 1200,
      positions: steady,
      annotations: ['marchArrow'],
    },
    {
      label: 'March continues, distances preserved',
      description:
        'The broken files take care not to lose their distances and to keep aligned; the column\'s discipline depends on their precision (¶307-309).',
      caseyRef: '¶306-309',
      duration: 1200,
      positions: continued,
      annotations: ['marchArrow'],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sub-movement B: files re-enter into line (¶299-304)
// ---------------------------------------------------------------------------

function buildReenter(company) {
  // Continuous with the end of "break-off": advance carries over.
  const trailing = buildFrame(company, { advancePx: 9 * PACE, mode: 'trailing', guideT: 1 });
  const commandGiven = buildFrame(company, { advancePx: 11 * PACE, mode: 'trailing', guideT: 1 });
  const midReturn = buildFrame(company, { advancePx: 13 * PACE, mode: 'return', guideT: 0.5, t: 0.5 });
  const reentered = buildFrame(company, { advancePx: 13 * PACE, mode: 'inLine' });
  const continued = buildFrame(company, { advancePx: 15 * PACE, mode: 'inLine' });

  return [
    {
      label: 'Company marching with reduced front',
      description:
        'The company marches with a front of eighteen files; two files (19 and 20) march to the rear, behind the file closers -- continuous with the end of "Break Files to the Rear."',
      caseyRef: '¶299',
      duration: 1200,
      positions: trailing,
      annotations: ['marchArrow'],
    },
    {
      label: 'Two files into line -- command given',
      description:
        'Wishing to cause the broken files to return into line, the captain commands "Two files into line, MARCH." The company continues its march as the command is given.',
      caseyRef: '¶299',
      duration: 900,
      positions: commandGiven,
      annotations: [],
    },
    {
      label: 'MARCH -- files advance the inner shoulder, moving up',
      description:
        'At the command, the designated files advance the inner shoulder and move up to form on the flank of the company by the shortest line. The guide begins to open out again to make room for them (¶304-305).',
      caseyRef: '¶300, ¶304-305',
      duration: 1200,
      positions: midReturn,
      annotations: ['guideShiftLabel'],
    },
    {
      label: 'Files re-entered at their original places',
      description:
        'Files 19 and 20 return briskly into line, retaking their exact original places; the 2nd sergeant reopens to his habitual post opposite file 19. The company\'s full twenty-file front is restored.',
      caseyRef: '¶300-301',
      duration: 1200,
      positions: reentered,
      annotations: ['fileNumbers'],
    },
    {
      label: 'Company continues to march, full line restored',
      description: 'The company advances in line of battle, its full front of twenty files reunited.',
      caseyRef: '¶301',
      duration: 1200,
      positions: continued,
      annotations: ['marchArrow'],
    },
  ];
}

export default {
  id: 'break-files',
  title: 'Being in Column, to Break Files to the Rear, and to Cause Them to Re-enter into Line',
  lesson: 6,
  article: 2,
  caseyParagraphs: [
    294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 308, 309, 310,
  ],
  commands: (subMovement = 'break-off') =>
    subMovement === 're-enter'
      ? [
          { text: '1. Two files into line.', type: 'preparatory' }, // ¶299
          { text: '2. MARCH.', type: 'execution' }, // ¶299-300
        ]
      : [
          { text: '1. Two files from left (or right) to rear.', type: 'preparatory' }, // ¶294
          { text: '2. MARCH.', type: 'execution' }, // ¶294-295
        ],
  subMovements: [
    { id: 'break-off', label: 'A) Break Files to the Rear' },
    { id: 're-enter', label: 'B) Re-enter into Line' },
  ],
  reenactorNotes:
    'A) Breaking off (¶294-298): demonstrated here breaking two files from the LEFT (files 19-20) -- Casey\'s text treats "left (or right)" as equally valid; the right-flank alternative is not used for the worked example because it would pull the captain and covering sergeant (file 1) out of their posts, which is not the ordinary case intended. At MARCH the two files face to the right and then file to the left, the odd file covering the 1st and 3rd of the four resulting positions and the even file the 2nd and 4th, reckoned from that flank (¶295) -- the identical across-file doubling convention already used for the head of a column of files (Lesson IV\'s march-by-flank). The guide on that flank (2nd sergeant, habitually opposite file 19) gradually closes on the new nearest front-rank man, file 18 (¶305). Successive pairs may break the same way, the first pair shifting further toward the flank to make room for the next (¶296-298); the instructor may also break four or six files at once by the same commands, substituting the larger number (¶302). Only this single pair is animated here for clarity; ¶296-298 and ¶302-303\'s larger cases are not separately staged. ' +
    'B) Re-entering (¶299-304): "Two files into line, MARCH" brings the broken files briskly back to their exact original places, advancing the inner shoulder to move up by the shortest line (¶300, ¶304); any other broken groups further back would, at the same time, gain the space of two files by advancing their own inner shoulder (¶300) -- again not separately staged for a single pair. The captain turns to his company to watch the observance of these principles (¶301). Casey also provides the command "Four or six files into line, MARCH" for returning larger groups at once (¶303). ' +
    'General cautions (¶306-310): broken files are disposed as though the company had faced by the flank on their side (¶306) -- any odd file on a flank, belonging to no pair, is broken singly (¶306). Precision in filing off and moving up is essential; if a newly broken file does not step off smartly, or a returning file does not move up promptly, the files behind it are arrested and the column is lengthened (¶307-308). The instructor stations himself on the flank from which files are broken, to observe closely (¶309). Files are broken only from the side of direction, so that the whole company can readily pass from front to flank march (¶310).',

  buildKeyframes: (company, subMovement = 'break-off') => {
    if (subMovement === 're-enter') return buildReenter(company);
    return buildBreakOff(company);
  },
};
