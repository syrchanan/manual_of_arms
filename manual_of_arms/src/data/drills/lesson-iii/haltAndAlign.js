import { lineOfBattle, translate } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 450;
// 5 * PACE_PX * 2 = 10 paces of visible march distance before the halt. The
// trailing "* 2" is a visual scale-up for the animation, not a second pace
// multiplier -- SCALE.PACE_PX already equals one pace in px.
const MARCH_DIST = 5 * SCALE.PACE_PX * 2; // ~10 paces of visible movement

// Casey does not specify the exact motion by which the captain and covering
// sergeant "glance their eyes along" their ranks (¶100). We depict it as a
// small step out from the line, clearing a sighting line down the rank, plus
// a turn to look along it -- undone the moment the rectification is
// complete. This is an interpretive choice, not text from the manual.
const SIGHT_STEP_PX = 6; // small lateral step to clear a sighting line
const SIGHT_FACING = 270; // turned to look down the rank toward the left flank

export default {
  id: 'halt-and-align',
  title: 'To Halt and Align',
  lesson: 3,
  article: 2,
  caseyParagraphs: [99, 100],
  commands: [
    { text: '1. Company.', type: 'preparatory' },
    { text: '2. HALT.', type: 'execution' },
    { text: 'Captain, rectify the alignment.', type: 'execution' },
  ],
  reenactorNotes:
    "Per ¶99-100 the men do not dress themselves individually in this article -- there is no 'Right-DRESS' or 'FRONT' here (those belong to the School of the Soldier). The company simply halts, and if the instructor chooses to rectify rather than align on the first files, he commands 'Captain, rectify the alignment.' The captain glances his eye along the front rank and corrects it himself; he directs the covering sergeant to do the same for the rear rank (S.S. ¶329).",

  buildKeyframes: (company) => {
    const marching = translate(
      lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 }),
      { dx: 0, dy: -MARCH_DIST }
    );

    // Slight natural misalignment on halt: stagger some soldiers +/-1-2px
    const halted = marching.map((s, i) => {
      const jitter = ((i * 7 + 3) % 5) - 2; // deterministic pseudo-random, range -2..2
      return { ...s, y: s.y + jitter * 0.8 };
    });

    // Perfectly aligned, at the halted company's location
    const dressed = lineOfBattle(company, {
      originX: ORIGIN_X,
      originY: halted.find((s) => s.id === 'of-cpt')?.y ?? ORIGIN_Y - MARCH_DIST,
      facing: 0,
    });

    // Captain and covering sergeant step out and turn to sight along their
    // ranks while the rest of the company has already settled into dress
    // (¶100) -- the men are corrected by the captain's and sergeant's eye,
    // not by dressing themselves.
    const rectifying = dressed.map((s) => {
      if (s.id === 'of-cpt' || s.id === 'nc-cov') {
        return { ...s, x: s.x + SIGHT_STEP_PX, facing: SIGHT_FACING };
      }
      return s;
    });

    return [
      {
        label: 'Company marching in line',
        description:
          'The company advances in line of battle, marching by the front, before the instructor calls the halt.',
        caseyRef: '¶99',
        duration: 2000,
        positions: marching,
        annotations: ['marchArrow'],
      },
      {
        label: 'HALT — slight misalignment',
        description:
          'At the second command, the company halts. Natural variation leaves some soldiers a half-step ahead or behind their rank.',
        caseyRef: '¶99',
        duration: 600,
        positions: halted,
        annotations: ['alignmentLine'],
      },
      {
        label: 'Captain, rectify the alignment',
        description:
          'The captain steps out and glances his eye along the front rank, promptly rectifying it; he has directed the covering sergeant to do likewise for the rear rank. The men do not dress themselves -- the captain and covering sergeant correct each rank by eye.',
        caseyRef: '¶100',
        duration: 1500,
        positions: rectifying,
        annotations: ['alignmentLine'],
      },
      {
        label: 'Ranks rectified — captain and covering sergeant resume their posts',
        description:
          'The alignment corrected, the captain and covering sergeant return to their habitual posts at the head of their ranks.',
        caseyRef: '¶100',
        duration: 400,
        positions: dressed,
        annotations: ['alignmentLine'],
      },
    ];
  },
};
