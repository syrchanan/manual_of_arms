import { lineOfBattle, columnOfPlatoons, wheel } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 350;

export default {
  id: 'break-into-column',
  title: 'To Break into Column by Platoon',
  lesson: 5,
  article: 1,
  caseyParagraphs: [176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199],
  commands: [
    { text: '1. By platoon, right wheel.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
    { text: '3. Forward.', type: 'preparatory' },
    { text: '4. MARCH.', type: 'execution' },
    { text: '5. Guide left.', type: 'execution' },
  ],
  reenactorNotes:
    'Both platoons wheel simultaneously. The rightmost file of each platoon is the pivot — it marks time and turns in place. The leftmost file takes full 28-inch steps, describing the widest arc. After wheeling 90°, the platoons face to the right and form a column with the 1st platoon in front. Guide shifts to the LEFT of the column (toward the head). The distance between platoons should equal the front of a platoon (10 files × interval).',

  buildKeyframes: (company) => {
    const inLine = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });

    // Pivot points: rightmost front-rank man of each platoon (¶190).
    // P1 pivot = of-cpt's line position (nc-cov will stand here after replacing him).
    // P2 pivot = fr-11.
    const captainPos = inLine.find((s) => s.id === 'of-cpt');
    const file11Pos  = inLine.find((s) => s.id === 'fr-11');

    const p1PivotX = captainPos?.x ?? ORIGIN_X;
    const p1PivotY = captainPos?.y ?? ORIGIN_Y;
    const p2PivotX = file11Pos?.x  ?? ORIGIN_X - 10 * SCALE.FILE_INTERVAL;
    const p2PivotY = file11Pos?.y  ?? ORIGIN_Y;

    // Chiefs are excluded from the wheel sets and handled via chiefPos() instead.
    // File closers are included so they rotate with their platoon per ¶182.
    // nc-cov is included in p1Ids; it starts at the pivot coordinate in firstCommand
    // so wheel() correctly leaves it in place (marks time, ¶190).
    const p1Ids = new Set(company.filter((s) => s.platoon === 1 && s.id !== 'of-cpt').map((s) => s.id));
    const p2Ids = new Set(company.filter((s) => s.platoon === 2 && s.id !== 'fc-1lt').map((s) => s.id));

    // Each chief stays 2 paces in front of his platoon's centre as the platoon wheels (¶189).
    // Platoon centre = 4.5 × FILE_INTERVAL from the pivot (midpoint between files 5/6 or 15/16).
    // "In front" at angle θ = direction the platoon faces = θ from north.
    const HALF_SPREAD = 4.5 * SCALE.FILE_INTERVAL; // pivot → platoon centre distance (10-file platoon)
    const TWO_PACES  = 2 * SCALE.PACE_PX;

    function chiefPos(pivotX, pivotY, angleDeg, id) {
      const rad = (angleDeg * Math.PI) / 180;
      return {
        id,
        x: pivotX - HALF_SPREAD * Math.cos(rad) + TWO_PACES * Math.sin(rad),
        y: pivotY - HALF_SPREAD * Math.sin(rad) - TWO_PACES * Math.cos(rad),
        facing: angleDeg,
      };
    }

    // ── Keyframe 1: Company in line ──────────────────────────────────────────
    // (no changes needed)

    // ── Keyframe 2: At first command (¶189) ─────────────────────────────────
    // of-cpt  → 2 paces in front of P1 centre
    // fc-1lt  → around the left of company, 2 paces in front of P2 centre
    // nc-cov  → replaces captain at front-rank file 1 (pivot position)
    const firstCommand = inLine.map((s) => {
      if (s.id === 'of-cpt') return chiefPos(p1PivotX, p1PivotY, 0, 'of-cpt');
      if (s.id === 'fc-1lt') return chiefPos(p2PivotX, p2PivotY, 0, 'fc-1lt');
      if (s.id === 'nc-cov') return { ...s, x: p1PivotX, y: p1PivotY, facing: 0 };
      return s;
    });

    // ── Keyframe 3: Mid-wheel 45° (¶190) ────────────────────────────────────
    // Chiefs follow their platoon centres continuously; everyone else wheels.
    // nc-cov is at the pivot in firstCommand → wheel() leaves it in place (marks time).
    function applyWheel(base, angleDeg) {
      return base.map((s) => {
        if (s.id === 'of-cpt') return chiefPos(p1PivotX, p1PivotY, angleDeg, 'of-cpt');
        if (s.id === 'fc-1lt') return chiefPos(p2PivotX, p2PivotY, angleDeg, 'fc-1lt');
        if (p1Ids.has(s.id)) return wheel([s], { pivotX: p1PivotX, pivotY: p1PivotY, angleDeg })[0];
        if (p2Ids.has(s.id)) return wheel([s], { pivotX: p2PivotX, pivotY: p2PivotY, angleDeg })[0];
        return { ...s, facing: angleDeg };
      });
    }

    const midWheel  = applyWheel(firstCommand, 45);
    const fullWheel = applyWheel(firstCommand, 90);

    // ── Keyframe 5: Forward MARCH (¶191) ────────────────────────────────────
    // Base column positions, then override the four special soldiers.
    const column = columnOfPlatoons(company, {
      originX: p1PivotX,
      originY: p1PivotY,
      facing: 90,
      guide: 'left',
    });
    const marchDist  = 6 * SCALE.PACE_PX;
    const NINE_FILES = 9 * SCALE.FILE_INTERVAL; // pivot → marching flank = left of column

    const marching = column.map((s) => {
      switch (s.id) {
        case 'of-cpt':
          // Chief stays 2 paces in front of P1 centre throughout the column (¶189, ¶191)
          return { ...s, x: p1PivotX + TWO_PACES + marchDist, y: p1PivotY - HALF_SPREAD, facing: 90 };
        case 'fc-1lt':
          // Chief stays 2 paces in front of P2 centre (¶189, ¶191)
          return { ...s, x: p2PivotX + TWO_PACES + marchDist, y: p2PivotY - HALF_SPREAD, facing: 90 };
        case 'nc-cov':
          // Guide stands ONE file-interval outside the left flank so he has no file partner (¶191, ¶168)
          return { ...s, x: p1PivotX + marchDist, y: p1PivotY - NINE_FILES - SCALE.FILE_INTERVAL, facing: 90 };
        case 'fc-2sg':
          // Same for fc-2sg as left guide of P2 (¶191, ¶167–168)
          return { ...s, x: p2PivotX + marchDist, y: p2PivotY - NINE_FILES - SCALE.FILE_INTERVAL, facing: 90 };
        default:
          return { ...s, x: s.x + marchDist };
      }
    });

    // Arc parameters: right wheel from facing=0; marching flank sweeps west→north (upper-left).
    // Radius = 9 × FILE_INTERVAL (file 10 / file 20 are 9 files from their respective pivots).
    const wheelArcAnnotations = [
      { type: 'wheelingArc', pivotX: p1PivotX, pivotY: p1PivotY, radiusPx: 9 * SCALE.FILE_INTERVAL, startAngle: -Math.PI / 2, endAngle: 0 },
      { type: 'wheelingArc', pivotX: p2PivotX, pivotY: p2PivotY, radiusPx: 9 * SCALE.FILE_INTERVAL, startAngle: -Math.PI / 2, endAngle: 0 },
    ];

    return [
      {
        label: 'Company in line, halted',
        description:
          'The company stands in line of battle. 1st platoon (files 1–10) on the right, 2nd platoon (files 11–20) on the left.',
        caseyRef: '¶176',
        duration: 0,
        positions: inLine,
        annotations: ['platoonDivider'],
      },
      {
        label: 'By platoon, right wheel',
        description:
          'At the first command: the captain moves to 2 paces in front of P1\'s centre; the 1st lieutenant passes around the left of the company to 2 paces in front of P2\'s centre. The covering sergeant replaces the captain at front-rank file 1.',
        caseyRef: '¶189',
        duration: 800,
        positions: firstCommand,
        annotations: [],
      },
      {
        label: 'MARCH — wheeling',
        description:
          'Both platoons wheel to the right. The pivot man (nc-cov for P1, fr-11 for P2) marks time in place — does not face right. Chiefs remain 2 paces in front of their rotating platoon centres.',
        caseyRef: '¶190',
        duration: 1500,
        positions: midWheel,
        annotations: wheelArcAnnotations,
      },
      {
        label: 'Wheel complete',
        description:
          'Both platoons have wheeled 90° and now face east. 1st platoon is in front. Chiefs are 2 paces east of their platoon centres.',
        caseyRef: '¶190',
        duration: 1000,
        positions: fullWheel,
        annotations: wheelArcAnnotations,
      },
      {
        label: 'Forward MARCH — column steps off',
        description:
          'At the fourth command the column steps off. The covering sergeant (nc-cov) moves rapidly to the LEFT of P1; the second sergeant (fc-2sg) moves to the LEFT of P2 — both are now left guides per ¶168. Chiefs remain 2 paces in front of their platoon centres.',
        caseyRef: '¶191–192',
        duration: 2000,
        positions: marching,
        annotations: ['marchArrow'],
      },
    ];
  },
};
