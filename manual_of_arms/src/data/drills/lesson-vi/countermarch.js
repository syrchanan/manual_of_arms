import { lineOfBattle, addRandomJitter } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

// ---------------------------------------------------------------------------
// Lesson Sixth, Article IV (¶343-349): "Countermarch."
//
// The company, at a halt in line of battle, is "supposed to constitute part
// of a column, right in front" (¶343) -- i.e. this line stands as though it
// were the right-in-front subdivision of a battalion column, and the
// countermarch reverses its facing (and so the column's direction of march)
// while keeping the two-rank line intact. The company's two habitual guides
// -- nc-cov (covering sergeant / right guide, rear rank of file 1) and
// fc-2sg (2nd sergeant / left guide, habitually opposite file 19, ¶26) --
// face "to the right about" and then STAND FAST for the whole movement
// (¶344-345), marking the two ends of the emerging new line while every
// other file wheels, in succession beginning with file 1, around the
// standing right guide and marches along the ground the old front rank
// occupied, until it falls in behind, and level with, the standing left
// guide (¶345).
//
// Because file 1 travels the whole length of the line while the last file to
// go barely moves at all, the net effect is NOT a simple rigid wheel of the
// whole body -- it is a reversal. The re-formed line is an ordinary line of
// battle facing exactly opposite the original front, with file 1 now falling
// at the end nearer the (former) left guide and file 20 nearer the (former)
// right guide. Casey's own "files numbered from the right" convention
// re-applies automatically once computed for the new facing -- lineOfBattle()
// naturally produces this reversal for facing=180 (see NEW_ORIGIN below), so
// no separate "swap" logic is needed for the final state.
//
// SIMPLIFICATIONS (documented, not modeled in separate keyframes):
//  - ¶344's "the captain...cause[s] two files to break to the rear" before
//    stepping off is elided; in this project's roster the captain already
//    IS file 1's front-rank man (of-cpt), so no separate repositioning is
//    needed for him to "conduct" the leading file.
//  - ¶345 describes each of the 20 files wheeling in succession, one at a
//    time, along its own short arc around the (fixed) right guide. Modeling
//    each file's individual arc is not attempted; instead -- following this
//    codebase's established pattern for cascading movements (cf.
//    lesson-v/formIntoLine.js's p1-halted/p2-still-wheeling snapshot, and
//    lesson-vi/breakFiles.js's advancing-front snapshots) -- the cascade is
//    approximated with discrete arrival snapshots: file 1 first, then half
//    the company, then all of it. Casey specifies only each file's START
//    state (post-right-face, awaiting its turn) and END state (fallen in on
//    the new line); the path between is this animation's interpretive choice.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 200;
const PACE = SCALE.PACE_PX;

/**
 * After "Company, right—FACE" (¶344): every soldier faces to the right (90°)
 * to await the march, EXCEPT the two guides, who face "to the right about"
 * (180° from their original facing) and then stand fast in place for the
 * whole movement -- they do not march with the rest of the company.
 */
function rightFaceState(initialLine) {
  return initialLine.map((s) => {
    if (s.id === 'nc-cov' || s.id === 'fc-2sg') {
      return { ...s, facing: 180 }; // right about (¶344)
    }
    return { ...s, facing: 90 }; // ordinary right face
  });
}

/**
 * Blend the waiting (post-right-face) state with the final re-formed line:
 * soldiers whose file number is in `arrivedFiles` are shown at their final,
 * wheeled-and-marched position; everyone else is still standing in the
 * post-right-face waiting state, facing 90 and not yet moved. The two guides
 * are always excluded from "arrival" here -- Casey has them stand fast until
 * they "shift to their proper places" only after the dress (¶349).
 */
function arrivalSnapshot(waiting, finalMap, fileById, arrivedFiles) {
  return waiting.map((s) => {
    if (s.id === 'nc-cov' || s.id === 'fc-2sg') return s;
    const file = fileById.get(s.id);
    return arrivedFiles.has(file) ? finalMap[s.id] : s;
  });
}

/** Apply jitter to every soldier except the listed ids (used to keep the
 * standing-fast guides pixel-precise while the rest of the company looks
 * informally, not yet precisely, halted -- cf. formations.js's
 * addRandomJitter, documented there as simulating informal spacing). */
function roughenExcept(positions, excludeIds, opts) {
  const jitterById = Object.fromEntries(addRandomJitter(positions, opts).map((p) => [p.id, p]));
  return positions.map((s) => (excludeIds.has(s.id) ? s : jitterById[s.id]));
}

const ALL_FILES = new Set(Array.from({ length: 20 }, (_, i) => i + 1));
const FIRST_TEN_FILES = new Set(Array.from({ length: 10 }, (_, i) => i + 1));

export default {
  id: 'countermarch',
  title: 'Countermarch',
  lesson: 6,
  article: 4,
  caseyParagraphs: [343, 344, 345, 346, 347, 348, 349],
  commands: [
    { text: '1. Countermarch.', type: 'preparatory' },
    { text: '2. Company, right—FACE.', type: 'execution' },
    { text: '3. By file, left.', type: 'preparatory' },
    { text: '4. MARCH.', type: 'execution' },
    { text: '1. Company.', type: 'preparatory' },
    { text: '2. HALT.', type: 'execution' },
    { text: '3. FRONT.', type: 'execution' },
    { text: '4. Right—DRESS.', type: 'execution' },
  ],
  reenactorNotes:
    'At the second command the company faces to the right, but the two guides face to the right ABOUT instead, and then stand fast for the entire movement (¶344). The captain goes to the right of his company, causes two files to break to the rear, and places himself by the front-rank man of file 1 to conduct it — in this project\'s roster the captain already occupies file 1\'s front-rank slot, so that repositioning is not separately animated. ' +
    'At the march, both guides stand fast; the first file, conducted by the captain, wheels around the standing right guide and marches along the (old) front rank until it arrives behind, and two paces from, the standing left guide; each following file comes in succession to wheel on the SAME ground around the right guide (¶345). This animation approximates that one-at-a-time cascade with discrete snapshots (file 1 arrived; half the company arrived; all arrived) rather than tracing each file\'s individual arc — Casey specifies each file\'s start and end condition, not the path between. ' +
    'The leading file\'s arrival opposite the left guide cues Company, HALT — FRONT — Right—DRESS (¶345-348). At the dress, the captain steps two paces outside of the left guide — now on the right of the new line — and directs the alignment so the front rank is enclosed between the two guides (¶349); this is the same ground point ¶345 already described as "two paces from the left guide," described here a second time from the dressing captain\'s perspective, not an additional displacement. The company being aligned, the captain commands FRONT and takes post before the centre "as if in column"; the guides then pass along the front rank to their proper places on the right and left of it — modeled here simply as the two guides resuming their ordinary habitual posts (rear rank of the new file 1; file-closer opposite the new file 19) on the newly-faced line. ' +
    'In a column by platoon, the countermarch is executed by the same commands and principles, each platoon\'s own guide facing about and its chief conducting it, independently of the other platoon (¶350) — not separately staged here. In a column left in front, the countermarch is executed by inverse commands and means: the movement is made by the LEFT flank of each subdivision instead of the right, wheeling by file to the side of the front rank (¶351) — also not separately staged.',

  buildKeyframes: (company) => {
    const fileById = new Map(company.map((c) => [c.id, c.file]));

    // Halted line of battle, facing north — "part of a column, right in front" (¶343).
    const initialLine = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
    const rightGuideStart = initialLine.find((s) => s.id === 'nc-cov');
    const leftGuideStart = initialLine.find((s) => s.id === 'fc-2sg');

    // Company, right—FACE: everyone faces 90; the two guides face about (180)
    // and stand fast at these positions for the whole march (¶344).
    const waiting = rightFaceState(initialLine);

    // File 1's new position: "behind, and two paces from the left guide"
    // (¶345) — the same ground point the captain later stands upon, "two
    // paces outside of the left guide, now on the right" (¶349), to direct
    // the dress. Same lateral line as the standing left guide, two paces
    // further along the new direction of march.
    const NEW_ORIGIN_X = leftGuideStart.x;
    const NEW_ORIGIN_Y = leftGuideStart.y + 2 * PACE;

    // The re-formed line, facing directly opposite the original front.
    // lineOfBattle's own file-from-the-right convention, recomputed at this
    // facing, reproduces Casey's reversal automatically: file 1 falls at the
    // end nearer the old left guide, file 20 at the end nearer the old right
    // guide (¶345, ¶349).
    const finalLine = lineOfBattle(company, {
      originX: NEW_ORIGIN_X,
      originY: NEW_ORIGIN_Y,
      facing: 180,
    });
    const finalMap = Object.fromEntries(finalLine.map((p) => [p.id, p]));

    const firstFileArrived = arrivalSnapshot(waiting, finalMap, fileById, new Set([1]));
    const halfArrived = arrivalSnapshot(waiting, finalMap, fileById, FIRST_TEN_FILES);
    const allArrivedRough = roughenExcept(
      arrivalSnapshot(waiting, finalMap, fileById, ALL_FILES),
      new Set(['nc-cov', 'fc-2sg']),
      { maxPx: 2, maxDeg: 3 }
    );
    // Precisely dressed: every file at its final position; guides still
    // standing fast at their original (pre-march) spots, marking the two
    // ends the company has just dressed between (¶349, first part).
    const dressed = arrivalSnapshot(waiting, finalMap, fileById, ALL_FILES);

    const wheelPointAnnotation = {
      type: 'wheelingPoint',
      pivotX: rightGuideStart.x,
      pivotY: rightGuideStart.y,
    };

    return [
      {
        label: 'Halted, part of a column right in front',
        description:
          'The company is at a halt, in line of battle, supposed to constitute part of a column, right in front. The instructor wishes to cause it to countermarch.',
        caseyRef: '¶343',
        duration: 0,
        positions: initialLine,
        annotations: ['guideRight', 'guideLeft'],
      },
      {
        label: 'Countermarch — Company, right FACE',
        description:
          'At the second command the company faces to the right. The two guides instead face to the right about, and will stand fast for the whole movement. The captain goes to the right of his company, causes two files to break to the rear, and places himself by the front-rank man of file 1, to conduct it.',
        caseyRef: '¶344',
        duration: 1200,
        positions: waiting,
        annotations: ['guideRight', 'guideLeft'],
      },
      {
        label: 'By file, left — MARCH: the first file wheels',
        description:
          'At the command march, both guides stand fast. The first file, conducted by the captain, wheels around the right guide and directs its march along the front rank, toward the left guide.',
        caseyRef: '¶345',
        duration: 1500,
        positions: firstFileArrived,
        annotations: ['guideRight', 'guideLeft', wheelPointAnnotation],
      },
      {
        label: 'Each file wheels in succession',
        description:
          'Each file comes in succession to wheel on the same ground around the right guide. Roughly half the company has now fallen in on the new line; the rest still awaits its turn.',
        caseyRef: '¶345',
        duration: 1800,
        positions: halfArrived,
        annotations: ['guideRight', 'guideLeft', wheelPointAnnotation],
      },
      {
        label: 'Company, HALT',
        description:
          'The leading file, having arrived at a point opposite the left guide, prompts the captain to command Company, HALT. Every file has completed its wheel, though the line is not yet precisely dressed.',
        caseyRef: '¶345, ¶347',
        duration: 1200,
        positions: allArrivedRough,
        annotations: ['guideRight', 'guideLeft'],
      },
      {
        label: 'FRONT — Right, DRESS',
        description:
          'The company faces to the front, then dresses by the right: the captain steps two paces outside of the left guide — now on the right — and directs the alignment, so that the front rank is enclosed between the two guides.',
        caseyRef: '¶348-349',
        duration: 1200,
        positions: dressed,
        annotations: ['alignmentLine', 'guideRight', 'guideLeft'],
      },
      {
        label: 'FRONT — guides to their proper places',
        description:
          'The company being aligned, the captain commands FRONT and takes post before the centre of the company, as if in column. The guides, passing along the front rank, shift to their proper places — resuming their habitual posts on the newly-faced line.',
        caseyRef: '¶349',
        duration: 1000,
        positions: finalLine,
        annotations: ['alignmentLine'],
      },
    ];
  },
};
