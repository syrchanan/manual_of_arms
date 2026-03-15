import { columnOfFiles } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = 200;
const ORIGIN_Y = 300;
// depth 0 = head pair (cpt+cov sgt), depths 1-9 = file pairs (2,3)...(18,19), depth 10 = file 20
const NUM_GROUPS = 11;

/** File → depth index in column of files. File 1→0, files 2-3→1, ..., file 20→10. */
function fileDepthIndex(file) {
  if (file <= 1) return 0;
  return Math.floor((file - 2) / 2) + 1;
}

/**
 * Build an intermediate cascade position: groups 0..wheeledCount-1 have wheeled
 * and are marching in the new direction; the rest are still approaching the pivot.
 *
 * pivotX/pivotY = the wheeling point.
 * Each wheeled group has advanced (wheeledCount - groupIndex) * groupSpacing
 * past the pivot in the new direction.
 * Each un-wheeled group is at its approach position, marching toward the pivot.
 */
function buildCascadePositions(allPositions, company, pivotX, pivotY, wheeledCount, groupSpacing) {
  return allPositions.map((s) => {
    const soldier = company.find((c) => c.id === s.id);
    if (!soldier || soldier.rank === 'fileCloser') {
      if (wheeledCount >= NUM_GROUPS) {
        // All wheeled: file closers alongside the new column (marching north)
        const fcDepthIdx = soldier ? fileDepthIndex(soldier.file) : 0;
        const acrossOffset = 3 * SCALE.FILE_INTERVAL + SCALE.FILE_CLOSER_GAP;
        return {
          ...s,
          x: pivotX + acrossOffset,
          y: pivotY - fcDepthIdx * 2 * SCALE.FILE_INTERVAL,
          facing: 0,
        };
      }
      if (wheeledCount > NUM_GROUPS / 2) {
        return { ...s, facing: 0 };
      }
      return s;
    }

    // Compute group index and across-column index
    let groupIndex, acrossIndex;

    if (soldier.id === 'of-cpt') {
      groupIndex = 0;
      acrossIndex = 0; // captain on left/guide side
    } else if (soldier.id === 'nc-cov') {
      groupIndex = 0;
      acrossIndex = 1; // covering sergeant beside captain
    } else {
      const file = soldier.file;
      groupIndex = fileDepthIndex(file);
      const isSecondInPair = (file - 2) % 2 === 1; // files 3,5,7,...,19
      if (soldier.rank === 'front') {
        acrossIndex = isSecondInPair ? 1 : 0;
      } else {
        acrossIndex = isSecondInPair ? 3 : 2;
      }
    }

    if (groupIndex < wheeledCount) {
      // This group has already wheeled — it's marching north (facing=0)
      const marchDist = (wheeledCount - groupIndex) * groupSpacing;
      return {
        ...s,
        x: pivotX + acrossIndex * SCALE.FILE_INTERVAL,
        y: pivotY - marchDist,
        facing: 0,
      };
    } else {
      // This group hasn't wheeled yet — still approaching from the east
      const distBehind = (groupIndex - wheeledCount) * 2 * SCALE.FILE_INTERVAL;
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
  id: 'change-direction-by-file',
  title: 'To Change Direction by File',
  lesson: 4,
  article: 2,
  caseyParagraphs: [88, 89, 90, 91, 92],
  commands: [
    { text: '1. By file left.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],
  reenactorNotes: 'Each file must wheel on the SAME POINT. If files cut the corner, the column loses its shape and subsequent files have no reference point. The inner man of each file shortens his steps for 5 or 6 paces while wheeling.',

  buildKeyframes: (company) => {
    // Company already in column of files marching east (4 abreast, 10 deep)
    const inColumn = columnOfFiles(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 90 });
    const marchDist = 10 * SCALE.PACE_PX;
    const marching = inColumn.map((s) => ({ ...s, x: s.x + marchDist }));

    // Pivot = position of the innermost soldier of the lead file (captain)
    const captainPos = marching.find((s) => s.id === 'of-cpt');
    const pivotX = captainPos?.x ?? ORIGIN_X + marchDist;
    const pivotY = captainPos?.y ?? ORIGIN_Y;

    // Spacing between wheeled groups in the new direction
    const groupSpacing = 2 * SCALE.FILE_INTERVAL;

    // Cascade keyframes: show progressive wheeling
    const cascade1 = buildCascadePositions(marching, company, pivotX, pivotY, 1, groupSpacing);
    const cascade4 = buildCascadePositions(marching, company, pivotX, pivotY, 4, groupSpacing);
    const cascadeAll = buildCascadePositions(marching, company, pivotX, pivotY, NUM_GROUPS, groupSpacing);

    // Continue marching in new direction
    const newDirectionMarch = cascadeAll.map((s) => ({
      ...s,
      y: s.facing === 0 ? s.y - marchDist * 0.5 : s.y,
    }));

    return [
      {
        label: 'Marching by the right flank',
        description: 'The company marches in column of files (4 abreast), heading east.',
        caseyRef: '¶88',
        duration: 1500,
        positions: marching,
        annotations: ['marchArrow', 'wheelingPoint'],
      },
      {
        label: 'Lead file wheels left at the point',
        description:
          'The leading file group arrives at the turning point and wheels left (90°). The inner man shortens his steps for the first 5 or 6 paces to maintain the wheel.',
        caseyRef: '¶89–90',
        duration: 1000,
        positions: cascade1,
        annotations: ['wheelingArc', 'wheelingPoint'],
      },
      {
        label: 'Successive files wheel on the same point',
        description:
          'Each subsequent file group wheels on the SAME POINT where the lead file wheeled. Files that have wheeled march north; files still approaching continue east until they reach the turning point.',
        caseyRef: '¶91',
        duration: 2500,
        positions: cascade4,
        annotations: ['wheelingArc', 'wheelingPoint'],
      },
      {
        label: 'All files have wheeled',
        description:
          'All file groups have completed their wheel. The column is now marching north.',
        caseyRef: '¶91–92',
        duration: 2000,
        positions: cascadeAll,
        annotations: ['wheelingPoint'],
      },
      {
        label: 'Column in new direction',
        description: 'The column continues its march in the new direction (north).',
        caseyRef: '¶92',
        duration: 1000,
        positions: newDirectionMarch,
        annotations: ['marchArrow'],
      },
    ];
  },
};
