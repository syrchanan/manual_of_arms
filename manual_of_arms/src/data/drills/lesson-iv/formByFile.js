import { columnOfFiles } from '../../../engine/formations.js';
import { SCALE } from '../../constants.js';

const ORIGIN_X = 200;
const ORIGIN_Y = 250;

// depth 0 = head pair (cpt+cov sgt), depths 1-9 = file pairs (2,3)...(18,19), depth 10 = file 20
const NUM_GROUPS = 11;

// ¶151: "the rear-rank doubled... [takes] care not to commence the movement
// until four men of the front-rank are established on the line of battle." The
// rear rank of the ordinary files therefore lags the front rank by ~2 depth
// groups (the captain plus files 2-5 front = ~4-5 men). The head-pair covering
// sergeant (group 0) still forms with the captain, so the lag is applied only
// to rear-rank men in groups >= 1.
const REAR_RANK_LAG = 2;

/** Map file number → column depth index. File 1 → 0; files 2–3 → 1; …; file 20 → 10. */
function fileDepthIndex(file) {
  if (file <= 1) return 0;
  return Math.floor((file - 2) / 2) + 1;
}

/**
 * Build an intermediate state where `formedCount` depth-groups have peeled
 * off the column and formed into line south of the march path.
 *
 * Per ¶151: the captain turns right (south), marches past the file-closer
 * rank + 6 paces, and halts on the line of battle. Subsequent file groups
 * march east past the pivot, turn south, and place themselves to the left
 * (west) of the already-formed groups.
 *
 * Formed soldiers → line-of-battle positions at (pivotX, pivotY), facing 0.
 * Unformed soldiers → stay at their march positions (return s unchanged).
 */
function buildFormByFilePositions(marchingPositions, company, pivotX, pivotY, formedCount) {
  return marchingPositions.map((s) => {
    const soldier = company.find((c) => c.id === s.id);
    if (!soldier) return s;

    // File closers: form progressively as their depth group forms.
    if (soldier.rank === 'fileCloser') {
      if (fileDepthIndex(soldier.file) < formedCount) {
        return {
          ...s,
          x: pivotX + (soldier.file - 1) * SCALE.FILE_INTERVAL,
          y: pivotY - SCALE.RANK_GAP - SCALE.FILE_CLOSER_GAP,
          facing: 180,
        };
      }
      return s;
    }

    const groupIndex = fileDepthIndex(soldier.file);

    // Rear-rank men of the ordinary files hold back until ~4 front-rank men are
    // established (¶151); the head-pair covering sergeant (group 0) is exempt.
    const lag = soldier.rank === 'rear' && groupIndex >= 1 ? REAR_RANK_LAG : 0;

    if (groupIndex < formedCount - lag) {
      // This group has formed into line — south-facing (facing=180°), per ¶151.
      //
      // The captain turned RIGHT from facing east = now faces SOUTH (180°).
      // His left = east (+x). Files place themselves to his left, so the line
      // extends EAST from the pivot: file 1 at pivotX, file 2 at pivotX+10, etc.
      // The rear rank is NORTH (−y) of the front rank because "behind" a
      // south-facing soldier = north. This matches lineOfBattle(facing=180°).
      const fileOffset = (soldier.file - 1) * SCALE.FILE_INTERVAL;
      const rankOffset = soldier.rank === 'front' ? 0 : -SCALE.RANK_GAP;
      return {
        ...s,
        x: pivotX + fileOffset,
        y: pivotY + rankOffset,
        facing: 180,
      };
    }

    // Still in column: return actual march position unchanged.
    return s;
  });
}

export default {
  id: 'form-by-file',
  title: 'To Form by File into Line',
  lesson: 4,
  article: 4,
  caseyParagraphs: [150, 151, 152, 153, 154],
  commands: [
    { text: '1. On the right, by file into line.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],
  reenactorNotes:
    'This is one of the most visually satisfying formations. The line builds from right to left as each file group marches east past the pivot, turns south, and slots in on the left. The rear rank marks time until 4 front-rank men are established on the line, then follows the same sequence. The final result is a perfectly dressed two-rank line.',

  buildKeyframes: (company) => {
    // Start: column of files marching east (4 abreast, 10 deep)
    const inColumn = columnOfFiles(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 90 });
    const marchDist = 10 * SCALE.PACE_PX;
    const marching = inColumn.map((s) => ({ ...s, x: s.x + marchDist }));

    // Pivot: where the captain halts on the line of battle.
    //
    // Per ¶151, at MARCH the captain turns right (south from facing east) and
    // marches straight-forward until halted at least 6 paces beyond the rank
    // of file closers.
    //
    // In columnOfFiles (facing=90/east):
    //   captain y = ORIGIN_Y − FILE_INTERVAL  (acrossOffset = −FILE_INTERVAL)
    //   file-closer rank y = ORIGIN_Y + 3×FILE_INTERVAL + FILE_CLOSER_GAP
    //   distance captain → file closers = 4×FILE_INTERVAL + FILE_CLOSER_GAP = 68 px
    //   plus 6 paces = 6×PACE_PX = 84 px
    //   total southward displacement = 4×FILE_INTERVAL + FILE_CLOSER_GAP + 6×PACE_PX = 152 px
    //
    // pivotX is unchanged (captain marches south, not east).
    const captainPos = marching.find((s) => s.id === 'of-cpt');
    const pivotX = captainPos?.x ?? ORIGIN_X + marchDist;
    const pivotY =
      (captainPos?.y ?? ORIGIN_Y - SCALE.FILE_INTERVAL) +
      4 * SCALE.FILE_INTERVAL +
      SCALE.FILE_CLOSER_GAP +
      6 * SCALE.PACE_PX;

    // Numeric trace-through with ORIGIN_X=200, ORIGIN_Y=250, marchDist=140:
    //   captainPos = (340, 240)
    //   pivotX = 340, pivotY = 240 + 40 + 28 + 84 = 392
    //   Line faces SOUTH (180°): captain at (340, 392), files extend EAST.
    //   front rank: y=392, x from 340 (file 1) to 530 (file 20)
    //   rear rank: y=385 (north of front rank); file closers: y=357
    //   column (march state): y=240–308, x=140–340  — all within 960×600 canvas ✓

    const formed1 = buildFormByFilePositions(marching, company, pivotX, pivotY, 1);
    const formed4 = buildFormByFilePositions(marching, company, pivotX, pivotY, 4);
    const formed7 = buildFormByFilePositions(marching, company, pivotX, pivotY, 7);
    // + REAR_RANK_LAG so the lagged rear rank of the last groups also completes.
    const formedAll = buildFormByFilePositions(marching, company, pivotX, pivotY, NUM_GROUPS + REAR_RANK_LAG);

    return [
      {
        label: 'Marching by the right flank',
        description: 'The company marches in column of files (4 abreast, 10 deep), heading east.',
        caseyRef: '¶150',
        duration: 1500,
        positions: marching,
        annotations: ['marchArrow'],
      },
      {
        label: 'Captain and covering sergeant halt on the line of battle',
        description:
          'At MARCH, the captain and covering sergeant turn right (south), march straight-forward, and are halted at least 6 paces beyond the rank of file closers (¶151). The captain places himself on the line of battle; the covering sergeant stands behind him at rear-rank distance. Files 1–2 follow, turn south, and place themselves to the left of the captain. The odd-number man precedes the even-number man onto the line.',
        caseyRef: '¶151',
        duration: 800,
        positions: formed1,
        annotations: [],
      },
      {
        label: 'Files form successively — groups 1–4 on line',
        description:
          'Each file group marches east past the last formed group, turns south, and places itself to the left. Odd-number precedes even-number onto the line. The rear rank marks time until 4 front-rank men are established, then begins the same sequence.',
        caseyRef: '¶151',
        duration: 2000,
        positions: formed4,
        annotations: [],
      },
      {
        label: 'Files continue forming — groups 1–7 on line',
        description:
          'The cascade continues. Each group peels off the column, turns south, and slots into the forming line to the left of the preceding group.',
        caseyRef: '¶151',
        duration: 2000,
        positions: formed7,
        annotations: [],
      },
      {
        label: 'Line fully formed',
        description:
          'All file groups have formed. The company stands in a two-rank line of battle, 20 files wide, facing south. Rear-rank men cover their file leaders accurately.',
        caseyRef: '¶151',
        duration: 1500,
        positions: formedAll,
        annotations: [],
      },
      {
        label: 'Captain verifies the alignment',
        description:
          'The captain, on the line of battle at the right-flank rest point, assures himself that each file conforms to what is prescribed in ¶151 and aligns the company.',
        caseyRef: '¶154',
        duration: 1000,
        positions: formedAll,
        annotations: ['alignmentLine'],
      },
    ];
  },
};
