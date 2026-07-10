import { lineOfBattle, columnOfPlatoons, wheel } from '../../../engine/formations.js';
import { postColumnChiefsAndGuides } from '../../../engine/columnPosts.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2;
const ORIGIN_Y = 200;

export default {
  id: 'form-into-line',
  title: 'To Form into Line of Battle',
  lesson: 5,
  article: 5,
  caseyParagraphs: [
    240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 256, 257, 258,
    259, 260, 261, 262, 263, 264, 265, 266, 267, 268, 269,
  ],
  commands: [
    { text: '1. Left into line, wheel.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
    { text: '1. Platoon.', type: 'preparatory' },
    { text: '2. HALT.', type: 'execution' },
    { text: 'Right—DRESS.', type: 'execution' },
    { text: 'FRONT.', type: 'execution' },
    { text: 'Guides—POSTS.', type: 'execution' },
  ],
  reenactorNotes:
    'This is the reverse of breaking into column (cf. Article I). Both platoons wheel left simultaneously, each on its own guide-flank file (file 10 for the 1st platoon, file 20 for the 2nd), which stands fast while the wheeling (right) flank takes full steps (¶244). Because this wheel starts from a halt, each platoon pivots independently on its own file — unlike Article III\'s change of direction on the march, there is no single shared marker point here (¶230 does not apply). ' +
    'The command "Platoon, HALT" is given independently by each chief of platoon as HIS OWN platoon\'s marching flank nears the line — the 2nd platoon typically halts an instant after the 1st (¶244–245). The chief of the 2nd platoon then resumes his post as a file closer, passing around its left (¶246). The captain moves to where the right of the company is to rest and commands Right—DRESS, aligning the company from the right (¶247–248). After FRONT, the instructor commands Guides—POSTS: the covering sergeant covers the captain, and the 2nd sergeant — left guide during the march — returns to his file-closer post (¶250–251). ' +
    'Casey permits omitting the preliminary Left—DRESS before the wheel command, unless the guides need lateral correction first (¶260). ' +
    'For continuity with Article I\'s end state, the captain and 1st lieutenant begin this drill still posted 2 paces before their platoon centres, and the covering sergeant / 2nd sergeant still posted as guides one file interval beyond the marching (left) flank.',

  buildKeyframes: (company) => {
    // Start: column of platoons, halted, facing east (continuous with Article I's end state).
    const rawColumn = columnOfPlatoons(company, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: 90,
    });
    const column = postColumnChiefsAndGuides(rawColumn);

    const p1Ids = new Set(company.filter((s) => s.platoon === 1).map((s) => s.id));
    const p2Ids = new Set(company.filter((s) => s.platoon === 2).map((s) => s.id));

    // Pivot points: the guide-left (marching) flank file of each platoon, which stands
    // fast as the true pivot of the wheel (¶244). Read from the RAW column so the
    // chief/guide overrides (which touch of-cpt/fc-1lt/nc-cov/fc-2sg only) can never
    // contaminate these corner positions — fr-10/fr-20 are ordinary files either way.
    const file10Pos = rawColumn.find((s) => s.id === 'fr-10');
    const file20Pos = rawColumn.find((s) => s.id === 'fr-20');

    const p1PivotX = file10Pos?.x ?? ORIGIN_X;
    const p1PivotY = file10Pos?.y ?? ORIGIN_Y;
    const p2PivotX = file20Pos?.x ?? ORIGIN_X;
    const p2PivotY = file20Pos?.y ?? ORIGIN_Y;

    // Wheel every member of each platoon (privates, file closers, chiefs and guides
    // alike) rigidly about its own pivot. Because the chiefs/guides were already given
    // a correct offset from that same corner by postColumnChiefsAndGuides, the wheel
    // preserves "2 paces before centre" / "1 file interval beyond the flank" through
    // the rotation. (Simplification: ¶244 has the guide "stand fast" exactly, whereas
    // wheeling him keeps him at a fixed 1-file-interval radius from the true pivot —
    // visually indistinguishable at this scale, and it avoids a separate hand-tracked
    // path for the guide alone.)
    function wheelAll(angleDeg) {
      return column.map((s) => {
        if (p1Ids.has(s.id)) return wheel([s], { pivotX: p1PivotX, pivotY: p1PivotY, angleDeg })[0];
        if (p2Ids.has(s.id)) return wheel([s], { pivotX: p2PivotX, pivotY: p2PivotY, angleDeg })[0];
        return s;
      });
    }

    // Mid-wheel: 45° left, both platoons together.
    const midWheel = wheelAll(-45);

    // The 1st platoon completes its 90° wheel and halts on the line (¶244–245); the 2nd
    // platoon is "an instant" behind, still finishing its own wheel — a modest, low-risk
    // stagger using the same pivot/angle machinery (no pivot or sweep angle is altered).
    const p1HaltP2Wheeling = column.map((s) => {
      if (p1Ids.has(s.id)) return wheel([s], { pivotX: p1PivotX, pivotY: p1PivotY, angleDeg: -90 })[0];
      if (p2Ids.has(s.id)) return wheel([s], { pivotX: p2PivotX, pivotY: p2PivotY, angleDeg: -80 })[0];
      return s;
    });

    // Full wheel: both platoons at 90° left — platoons now face north (facing = 0).
    const fullWheel = wheelAll(-90);

    // Line formed: use lineOfBattle for a clean final state.
    // After the wheel, the captain (file 1) sits 9 file intervals east of the pivot.
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
          '1st platoon in front, 2nd behind, column facing east. The captain and lieutenant stand 2 paces before their platoon centres; the covering sergeant and 2nd sergeant stand as guides one file interval beyond the marching (left) flank — continuous with the end of Article I.',
        caseyRef: '¶240',
        duration: 0,
        positions: column,
        annotations: ['platoonDistance'],
      },
      {
        label: 'Left into line, wheel — MARCH',
        description:
          'Both platoons wheel to the left simultaneously. The guide-flank file of each platoon (file 10, file 20) stands fast as the true pivot; the wheeling (right) flank takes full steps (¶243–244).',
        caseyRef: '¶243–244',
        duration: 1500,
        positions: midWheel,
        annotations: ['wheelingArc'],
      },
      {
        label: '1st platoon halts on the line; 2nd platoon an instant behind',
        description:
          'The chief of the 1st platoon commands Platoon, HALT as its marching flank nears the line of battle. The chief of the 2nd platoon gives the same command an instant later, as his own platoon\'s marching flank arrives (¶244–245).',
        caseyRef: '¶244–245',
        duration: 1200,
        positions: p1HaltP2Wheeling,
        annotations: ['wheelingArc'],
      },
      {
        label: 'Both platoons halted on the line',
        description:
          'Both platoons have wheeled 90° left and halted. The 2nd platoon is now on the left of the 1st, forming one continuous line. The chief of the 2nd platoon passes around its left flank and resumes his post as a file closer (¶246).',
        caseyRef: '¶245–246',
        duration: 800,
        positions: fullWheel,
        annotations: ['wheelingArc'],
      },
      {
        label: 'Right—DRESS',
        description:
          'The captain moves briskly to the point where the right of the company is to rest and commands Right—DRESS; the company dresses up on the alignment, directed from the right (¶247–248).',
        caseyRef: '¶247–248',
        duration: 1000,
        positions: inLine,
        annotations: ['alignmentLine'],
      },
      {
        label: 'FRONT — Guides, POSTS',
        description:
          'The captain commands FRONT. The instructor then commands Guides—POSTS: the covering sergeant covers the captain, and the 2nd sergeant — left guide of the march — returns to his place as a file closer (¶249–251).',
        caseyRef: '¶249–251',
        duration: 1000,
        positions: inLine,
        annotations: [],
      },
    ];
  },
};
