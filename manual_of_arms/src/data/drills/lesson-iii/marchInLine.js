import { lineOfBattle, translate } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2; // center company
const ORIGIN_Y = 450;
// 8 * PACE_PX * 2 = 16 paces of visible march distance. The trailing "* 2" is
// a visual scale-up for the animation, not a second pace multiplier --
// SCALE.PACE_PX already equals one pace in px.
const MARCH_DIST = 8 * SCALE.PACE_PX * 2; // ~16 paces of visible movement

// ¶86: "a sergeant, previously designated" is charged with the direction and
// marches six paces in advance of the captain. Casey does not name a fixed
// post for this role, and the roster (src/data/company.js) has no dedicated
// "directing sergeant." We press fc-5sg (5th Sergeant, file-closer post at
// file 2 -- the file closer nearest the right/directing flank) into this
// duty for the animation. Article I never narrates his return to post at a
// halt (that's Article II, ¶100, and Article V, ¶127) but both of those
// paragraphs confirm the same sergeant resumes his habitual file-closer
// place the moment the company is done needing him in advance, so the same
// convention is applied here for the closing HALT keyframe.
const SERGEANT_ADVANCE_PX = 6 * SCALE.PACE_PX; // ¶86/¶89: six paces in advance of the captain

/**
 * Move fc-5sg out to his advanced post: six paces ahead of the captain, on
 * the prolongation of the directing file (file 1, the captain's file).
 */
function withDirectingSergeantAdvanced(positions) {
  const captain = positions.find((s) => s.id === 'of-cpt');
  if (!captain) return positions;
  const rad = (captain.facing * Math.PI) / 180;
  const advanceX = SERGEANT_ADVANCE_PX * Math.sin(rad);
  const advanceY = -SERGEANT_ADVANCE_PX * Math.cos(rad);
  return positions.map((s) =>
    s.id === 'fc-5sg'
      ? { ...s, x: captain.x + advanceX, y: captain.y + advanceY, facing: captain.facing }
      : s
  );
}

export default {
  id: 'march-in-line',
  title: 'To March in Line of Battle',
  lesson: 3,
  article: 1,
  caseyParagraphs: [84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98],
  commands: [
    { text: '1. Company, forward.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],
  reenactorNotes:
    "Guide right is established by the posture of the captain and covering sergeant before any command is given (¶84) -- there is no spoken 'Guide right.' At Company, forward (¶85), a previously-designated sergeant (here, fc-5sg) steps out six paces in advance of the captain, on the prolongation of the directing file, and there takes two points on the ground in the straight line he is to steer by (¶86-87). At MARCH, the directing sergeant sets the direction and cadence and the captain marches steadily in his trace, keeping six paces behind (¶89); the man next to the captain keeps his shoulders a little in rear so as not to pass him (¶90). The covering sergeant covers the captain in the rear rank as a matter of his standing post (established at the company's formation, not by ¶89-90) and does not himself set the direction.",

  buildKeyframes: (company) => {
    const halted = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
    const commandGiven = withDirectingSergeantAdvanced(halted);

    const marchingBase = translate(halted, { dx: 0, dy: -MARCH_DIST });
    const marching = withDirectingSergeantAdvanced(marchingBase);

    // At the halt, the directing sergeant returns to his habitual file-closer
    // post; marchingBase already carries fc-5sg there untouched (only
    // commandGiven/marching override his position), just shifted forward
    // with the rest of the company.
    const halted2 = marchingBase;

    return [
      {
        label: 'Halted in line, correctly aligned',
        description:
          'The company stands in line of battle, two ranks deep, correctly aligned. The captain is on the right of the front rank, the covering sergeant behind him in the rear rank -- their shoulders square to their ranks, guide right established by posture alone.',
        caseyRef: '¶84',
        duration: 0,
        positions: halted,
        annotations: ['guideLineRight'],
      },
      {
        label: 'Company, forward — directing sergeant advances',
        description:
          'At the preparatory command, the previously-designated directing sergeant moves six paces in advance of the captain, on the prolongation of the directing file, and there takes two points on the ground in the straight line he is to steer by.',
        caseyRef: '¶85–87',
        duration: 800,
        positions: commandGiven,
        annotations: ['guideLineRight'],
      },
      {
        label: 'MARCH — company advances in the trace of the directing sergeant',
        description:
          "At MARCH, the company steps off with life. The directing sergeant marches on his chosen points, observing the length and cadence of the step with the greatest precision. The captain marches steadily in the sergeant's trace, keeping always six paces from him; the man next to the captain keeps his shoulders a little in rear so as not to pass him. The men feel lightly the elbow of their neighbor on the side of direction. (The covering sergeant covers the captain in the rear rank from his standing post.)",
        caseyRef: '¶88–90',
        duration: 3000,
        positions: marching,
        annotations: ['guideLineRight', 'marchArrow'],
      },
      {
        label: 'HALT — directing sergeant returns to his post',
        description:
          'The company halts. The directing sergeant, no longer needed in advance, resumes his habitual file-closer post two paces behind the rear rank.',
        caseyRef: '¶100, ¶127',
        duration: 600,
        positions: halted2,
        annotations: ['guideLineRight'],
      },
    ];
  },
};
