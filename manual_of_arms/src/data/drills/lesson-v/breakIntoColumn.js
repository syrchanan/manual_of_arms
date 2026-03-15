import { lineOfBattle, columnOfPlatoons, wheel } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 350;

export default {
  id: 'break-into-column',
  title: 'To Break into Column by Platoon',
  lesson: 5,
  article: 1,
  caseyParagraphs: [123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141],
  commands: [
    { text: '1. By platoon, right wheel.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
    { text: '3. Forward.', type: 'preparatory' },
    { text: '4. MARCH.', type: 'execution' },
  ],
  reenactorNotes:
    'Both platoons wheel simultaneously. The rightmost file of each platoon is the pivot — it marks time and turns in place. The leftmost file takes full 28-inch steps, describing the widest arc. After wheeling 90°, the platoons face to the right and form a column with the 1st platoon in front. Guide shifts to the LEFT of the column (toward the head). The distance between platoons should equal the front of a platoon (10 files × interval).',

  buildKeyframes: (company) => {
    const inLine = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });

    const p1Ids = new Set(company.filter((s) => s.platoon === 1 && s.rank !== 'fileCloser').map((s) => s.id));
    const p2Ids = new Set(company.filter((s) => s.platoon === 2 && s.rank !== 'fileCloser').map((s) => s.id));

    // Pivot points: rightmost file of each platoon
    const captainPos = inLine.find((s) => s.id === 'of-cpt');
    const file11Pos = inLine.find((s) => s.id === 'fr-11');

    const p1PivotX = captainPos?.x ?? ORIGIN_X;
    const p1PivotY = captainPos?.y ?? ORIGIN_Y;
    const p2PivotX = file11Pos?.x ?? ORIGIN_X - 10 * SCALE.FILE_INTERVAL;
    const p2PivotY = file11Pos?.y ?? ORIGIN_Y;

    // Mid-wheel: 45°
    const midWheel = inLine.map((s) => {
      if (p1Ids.has(s.id)) return wheel([s], { pivotX: p1PivotX, pivotY: p1PivotY, angleDeg: 45 })[0];
      if (p2Ids.has(s.id)) return wheel([s], { pivotX: p2PivotX, pivotY: p2PivotY, angleDeg: 45 })[0];
      return { ...s, facing: 45 };
    });

    // Full wheel: 90°
    const fullWheel = inLine.map((s) => {
      if (p1Ids.has(s.id)) return wheel([s], { pivotX: p1PivotX, pivotY: p1PivotY, angleDeg: 90 })[0];
      if (p2Ids.has(s.id)) return wheel([s], { pivotX: p2PivotX, pivotY: p2PivotY, angleDeg: 90 })[0];
      return { ...s, facing: 90 };
    });

    // Forward march in column
    const column = columnOfPlatoons(company, {
      originX: p1PivotX,
      originY: p1PivotY,
      facing: 90,
      guide: 'left',
    });
    const marchDist = 6 * SCALE.PACE_PX;
    const marching = column.map((s) => ({ ...s, x: s.x + marchDist }));

    return [
      {
        label: 'Company in line, halted',
        description:
          'The company stands in line of battle. 1st platoon (files 1–10) on the right, 2nd platoon (files 11–20) on the left.',
        caseyRef: '¶123–124',
        duration: 0,
        positions: inLine,
        annotations: ['platoonDivider'],
      },
      {
        label: 'By platoon, right wheel — MARCH',
        description:
          'Both platoons begin wheeling to the right simultaneously. The rightmost file of each platoon is the pivot (marks time, turns in place). The leftmost file takes full steps, describing the widest arc.',
        caseyRef: '¶125–128',
        duration: 1500,
        positions: midWheel,
        annotations: ['wheelingArc'],
      },
      {
        label: 'Wheel complete',
        description:
          'Both platoons have wheeled 90°. They now face east. 1st platoon is in front, 2nd platoon behind.',
        caseyRef: '¶129–131',
        duration: 1500,
        positions: fullWheel,
        annotations: ['wheelingArc'],
      },
      {
        label: 'Forward MARCH — column steps off',
        description:
          'The column steps off. 1st platoon leads, 2nd follows at a distance equal to the platoon front. Guide is on the LEFT.',
        caseyRef: '¶132–134',
        duration: 2000,
        positions: marching,
        annotations: ['marchArrow', 'platoonDistance'],
      },
    ];
  },
};
