import { columnOfFiles } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = 200;
const ORIGIN_Y = 250;

// depth 0 = head pair (cpt+cov sgt), depths 1-9 = file pairs (2,3)...(18,19), depth 10 = file 20
const NUM_GROUPS = 11;

/** File → depth index in column of files. File 1→0, files 2-3→1, ..., file 20→10. */
function fileDepthIndex(file) {
  if (file <= 1) return 0;
  return Math.floor((file - 2) / 2) + 1;
}

/**
 * Build an intermediate state where `formedCount` file groups have formed
 * into line (faced left, undoubled) while the rest are still in column.
 *
 * The lead file group halts and fronts at the pivot. Each subsequent group
 * marches past and takes position on the LEFT of the forming line.
 */
function buildFormByFilePositions(columnPositions, company, pivotX, pivotY, formedCount) {
  return columnPositions.map((s) => {
    const soldier = company.find((c) => c.id === s.id);
    if (!soldier || soldier.rank === 'fileCloser') {
      if (formedCount >= NUM_GROUPS) {
        // Line fully formed: file closers go to line-of-battle positions
        // 2 paces (FILE_CLOSER_GAP) behind the rear rank
        const fileIndex = soldier ? soldier.file - 1 : 0;
        return {
          ...s,
          x: pivotX - fileIndex * SCALE.FILE_INTERVAL,
          y: pivotY + SCALE.RANK_GAP + SCALE.FILE_CLOSER_GAP,
          facing: 0,
        };
      }
      if (formedCount > NUM_GROUPS / 2) {
        return { ...s, facing: 0 };
      }
      return s;
    }

    // Compute group index and across-column index
    let groupIndex, acrossIndex;
    const file = soldier.file;

    if (soldier.id === 'of-cpt') {
      groupIndex = 0;
      acrossIndex = 0;
    } else if (soldier.id === 'nc-cov') {
      groupIndex = 0;
      acrossIndex = 1;
    } else {
      groupIndex = fileDepthIndex(file);
      const isSecondInPair = (file - 2) % 2 === 1;
      if (soldier.rank === 'front') {
        acrossIndex = isSecondInPair ? 1 : 0;
      } else {
        acrossIndex = isSecondInPair ? 3 : 2;
      }
    }

    if (groupIndex < formedCount) {
      // This group has formed into line — facing north, in two-rank formation
      // Each soldier returns to their line-of-battle file position
      const lineFileIndex = file - 1;
      const localY = soldier.rank === 'front' ? 0 : SCALE.RANK_GAP;

      return {
        ...s,
        x: pivotX - lineFileIndex * SCALE.FILE_INTERVAL,
        y: pivotY + localY,
        facing: 0,
      };
    } else {
      // Still in column, approaching the formation point
      const distBehind = (groupIndex - formedCount) * 2 * SCALE.FILE_INTERVAL;

      return {
        ...s,
        x: pivotX - distBehind,
        y: pivotY + acrossIndex * SCALE.FILE_INTERVAL,
        facing: 90,
      };
    }
  });
}

export default {
  id: 'form-by-file',
  title: 'To Form by File into Line',
  lesson: 4,
  article: 4,
  caseyParagraphs: [97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107],
  commands: [
    { text: '1. On the right, by file into line.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],
  reenactorNotes:
    'This is one of the most visually satisfying formations. The line builds from right to left as each file group marches past the one before it and fronts. The key is that each group must march far enough to clear the one ahead before wheeling into line. The final result should be a perfectly dressed two-rank line.',

  buildKeyframes: (company) => {
    // Start: column of files marching east (4 abreast, 10 deep)
    const inColumn = columnOfFiles(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 90 });
    const marchDist = 10 * SCALE.PACE_PX;
    const marching = inColumn.map((s) => ({ ...s, x: s.x + marchDist }));

    // Pivot point: where the lead file halts and fronts
    const captainPos = marching.find((s) => s.id === 'of-cpt');
    const pivotX = captainPos?.x ?? ORIGIN_X + marchDist;
    const pivotY = captainPos?.y ?? ORIGIN_Y;

    // Progressive formation
    const formed1 = buildFormByFilePositions(marching, company, pivotX, pivotY, 1);
    const formed4 = buildFormByFilePositions(marching, company, pivotX, pivotY, 4);
    const formed7 = buildFormByFilePositions(marching, company, pivotX, pivotY, 7);
    const formedAll = buildFormByFilePositions(marching, company, pivotX, pivotY, NUM_GROUPS);

    return [
      {
        label: 'Marching by the right flank',
        description: 'The company marches in column of files (4 abreast), heading east.',
        caseyRef: '¶97',
        duration: 1500,
        positions: marching,
        annotations: ['marchArrow'],
      },
      {
        label: 'Lead file halts and fronts',
        description:
          'The lead file group (files 1–2) halts and faces left to the front. They are now the rightmost files of the forming line.',
        caseyRef: '¶98–99',
        duration: 800,
        positions: formed1,
        annotations: [],
      },
      {
        label: 'Files form successively (1–4 formed)',
        description:
          'Each subsequent file group marches past the last formed group, then wheels left and takes position on the left. The line builds from right to left.',
        caseyRef: '¶100–102',
        duration: 2000,
        positions: formed4,
        annotations: [],
      },
      {
        label: 'Files continue forming (1–7 formed)',
        description:
          'The cascading formation continues. Each file group slots in on the left of the line as it arrives.',
        caseyRef: '¶103–104',
        duration: 2000,
        positions: formed7,
        annotations: [],
      },
      {
        label: 'Line formed',
        description:
          'All file groups have formed. The company is in a two-rank line of battle, 20 files wide.',
        caseyRef: '¶105–106',
        duration: 1500,
        positions: formedAll,
        annotations: [],
      },
      {
        label: 'HALT — Left DRESS — FRONT',
        description:
          'The company halts, dresses to the left, and fronts. The formation is now a properly aligned line of battle.',
        caseyRef: '¶107',
        duration: 1000,
        positions: formedAll,
        annotations: ['alignmentLine'],
      },
    ];
  },
};
