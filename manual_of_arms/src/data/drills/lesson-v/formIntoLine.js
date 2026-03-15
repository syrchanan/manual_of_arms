import { lineOfBattle, columnOfPlatoons, wheel } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2;
const ORIGIN_Y = 200;

export default {
  id: 'form-into-line',
  title: 'To Form into Line of Battle',
  lesson: 5,
  article: 5,
  caseyParagraphs: [177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197],
  commands: [
    { text: '1. Left into line, wheel.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
    { text: '3. Company.', type: 'preparatory' },
    { text: '4. HALT.', type: 'execution' },
    { text: '5. Right—DRESS.', type: 'execution' },
    { text: '6. FRONT.', type: 'execution' },
  ],
  reenactorNotes:
    'This is the reverse of breaking into column. Both platoons wheel left simultaneously. The leftmost file of each platoon is the pivot. The wheeling flank (right side) takes full steps. After the wheel, the 2nd platoon is on the left of the 1st, forming one continuous line of battle. This is one of the most important formations — getting back into line from column.',

  buildKeyframes: (company) => {
    // Start: column of platoons, halted, facing east
    const column = columnOfPlatoons(company, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: 90,
      guide: 'left',
    });

    const p1Ids = new Set(company.filter((s) => s.platoon === 1 && s.rank !== 'fileCloser').map((s) => s.id));
    const p2Ids = new Set(company.filter((s) => s.platoon === 2 && s.rank !== 'fileCloser').map((s) => s.id));

    // Pivot points: leftmost file of each platoon (toward the guide/north side)
    // 1st platoon: file 10 (leftmost in platoon 1)
    // 2nd platoon: file 20 (leftmost in platoon 2)
    const file10Pos = column.find((s) => s.id === 'fr-10');
    const file20Pos = column.find((s) => s.id === 'fr-20');

    const p1PivotX = file10Pos?.x ?? ORIGIN_X;
    const p1PivotY = file10Pos?.y ?? ORIGIN_Y;
    const p2PivotX = file20Pos?.x ?? ORIGIN_X;
    const p2PivotY = file20Pos?.y ?? ORIGIN_Y;

    // Mid-wheel: 45° left
    const midWheel = column.map((s) => {
      if (p1Ids.has(s.id)) return wheel([s], { pivotX: p1PivotX, pivotY: p1PivotY, angleDeg: -45 })[0];
      if (p2Ids.has(s.id)) return wheel([s], { pivotX: p2PivotX, pivotY: p2PivotY, angleDeg: -45 })[0];
      return { ...s, facing: 45 };
    });

    // Full wheel: 90° left — platoons now face north (facing = 0)
    const fullWheel = column.map((s) => {
      if (p1Ids.has(s.id)) return wheel([s], { pivotX: p1PivotX, pivotY: p1PivotY, angleDeg: -90 })[0];
      if (p2Ids.has(s.id)) return wheel([s], { pivotX: p2PivotX, pivotY: p2PivotY, angleDeg: -90 })[0];
      return { ...s, facing: 0 };
    });

    // Line formed: use lineOfBattle for a clean final state
    // The line origin should be at the rightmost file (file 1 = captain)
    // after the wheel, the captain should be at approximately p1PivotX + 9*FILE_INTERVAL
    const lineOriginX = p1PivotX + 9 * SCALE.FILE_INTERVAL;
    const lineOriginY = p1PivotY;
    const inLine = lineOfBattle(company, {
      originX: lineOriginX,
      originY: lineOriginY,
      facing: 0,
    });

    return [
      {
        label: 'Column of platoons, halted',
        description:
          '1st platoon in front, 2nd behind. Column faces east. Guide is on the left (north side).',
        caseyRef: '¶177–178',
        duration: 0,
        positions: column,
        annotations: ['platoonDistance'],
      },
      {
        label: 'Left into line, wheel — MARCH',
        description:
          'Both platoons begin wheeling to the left simultaneously. The leftmost file of each platoon is the pivot. The wheeling flank (right side) takes full steps.',
        caseyRef: '¶179–182',
        duration: 1500,
        positions: midWheel,
        annotations: ['wheelingArc'],
      },
      {
        label: 'Wheel complete — line formed',
        description:
          'Both platoons have wheeled 90° left. The 2nd platoon is now on the left of the 1st. One continuous line of battle.',
        caseyRef: '¶183–186',
        duration: 1500,
        positions: fullWheel,
        annotations: ['wheelingArc'],
      },
      {
        label: 'HALT',
        description: 'Company halts.',
        caseyRef: '¶187',
        duration: 600,
        positions: inLine,
        annotations: [],
      },
      {
        label: 'Right DRESS — FRONT',
        description:
          'The company dresses right and fronts. The formation is now a properly aligned line of battle.',
        caseyRef: '¶188–190',
        duration: 1000,
        positions: inLine,
        annotations: ['alignmentLine'],
      },
    ];
  },
};
