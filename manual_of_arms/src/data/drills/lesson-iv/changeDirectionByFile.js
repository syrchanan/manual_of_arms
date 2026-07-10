import { columnOfFiles } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = 340;
const ORIGIN_Y = 480;
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
      if (!soldier) return s;
      // Sync file closers with their corresponding group depth.
      const fcGroupIdx = fileDepthIndex(soldier.file);
      const acrossOffset = 3 * SCALE.FILE_INTERVAL + SCALE.FILE_CLOSER_GAP;
      if (fcGroupIdx < wheeledCount) {
        // Group has wheeled — march north alongside it
        const marchDist = (wheeledCount - fcGroupIdx) * groupSpacing;
        return { ...s, x: pivotX + acrossOffset, y: pivotY - marchDist, facing: 0 };
      } else {
        // Still approaching from the east
        const distBehind = (fcGroupIdx - wheeledCount) * 2 * SCALE.FILE_INTERVAL;
        return { ...s, x: pivotX - distBehind, y: pivotY + acrossOffset, facing: 90 };
      }
    }

    // Compute group index and across-column index
    let groupIndex, acrossIndex;

    if (soldier.id === 'nc-cov') {
      groupIndex = 0;
      acrossIndex = 0; // covering sergeant = innermost man = wheel pivot
    } else if (soldier.id === 'of-cpt') {
      groupIndex = 0;
      acrossIndex = -1; // captain outside/north of the column body
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
  caseyParagraphs: [144, 145, 146],
  commands: [
    { text: '1. By file, left.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],
  reenactorNotes: 'Each file must wheel on the SAME POINT. If files cut the corner, the column loses its shape and subsequent files have no reference point. The inner man of each file shortens his steps for 5 or 6 paces while wheeling.',

  buildKeyframes: (company) => {
    // Company already in column of files marching east (4 abreast, 10 deep)
    const inColumn = columnOfFiles(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 90 });
    const marchDist = 10 * SCALE.PACE_PX;
    const marching = inColumn.map((s) => ({ ...s, x: s.x + marchDist }));

    // Pivot = covering sergeant: innermost man of the lead file (captain is outside the column)
    const covSgtPos = marching.find((s) => s.id === 'nc-cov');
    const pivotX = covSgtPos?.x ?? ORIGIN_X + marchDist;
    const pivotY = covSgtPos?.y ?? ORIGIN_Y;

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
        caseyRef: '¶144',
        duration: 1500,
        positions: marching,
        annotations: ['marchArrow', { type: 'wheelingPoint', pivotX, pivotY }],
      },
      {
        label: 'Lead file wheels left at the point',
        description:
          'The leading file group arrives at the turning point and wheels left (90°). The inner man shortens his steps for the first 5 or 6 paces to maintain the wheel.',
        caseyRef: '¶145',
        duration: 1000,
        positions: cascade1,
        annotations: [{ type: 'wheelingArc', pivotX, pivotY }, { type: 'wheelingPoint', pivotX, pivotY }],
      },
      {
        label: 'Successive files wheel on the same point',
        description:
          'Each subsequent file group wheels on the SAME POINT where the lead file wheeled. Files that have wheeled march north; files still approaching continue east until they reach the turning point.',
        caseyRef: '¶145',
        duration: 2500,
        positions: cascade4,
        annotations: [{ type: 'wheelingArc', pivotX, pivotY }, { type: 'wheelingPoint', pivotX, pivotY }],
      },
      {
        label: 'All files have wheeled',
        description:
          'All file groups have completed their wheel. The column is now marching north.',
        caseyRef: '¶145–146',
        duration: 2000,
        positions: cascadeAll,
        annotations: [{ type: 'wheelingPoint', pivotX, pivotY }],
      },
      {
        label: 'Column in new direction',
        description: 'The column continues its march in the new direction (north).',
        caseyRef: '¶146',
        duration: 1000,
        positions: newDirectionMarch,
        annotations: ['marchArrow'],
      },
    ];
  },
};
