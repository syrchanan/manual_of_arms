import { lineOfBattle, translate } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 350;
const MARCH_DIST = 6 * SCALE.PACE_PX * 2;

export default {
  id: 'march-in-retreat',
  title: 'March in Retreat',
  lesson: 3,
  article: 5,
  caseyParagraphs: [68, 69, 70, 71, 72, 73, 74, 75],
  commands: [
    { text: '1. Company.', type: 'preparatory' },
    { text: '2. About—FACE.', type: 'execution' },
    { text: '3. Company, forward.', type: 'preparatory' },
    { text: '4. MARCH.', type: 'execution' },
  ],
  reenactorNotes:
    'One of the most commonly confused points: when you about-face, the guide switches flanks because RIGHT and LEFT are relative to the direction of march. Before the about-face, guide is on the right (file 1, the captain). After the about-face, the company now marches toward the bottom of the screen, so the captain — still on the physical right side — is now on the LEFT of the new direction of march. Guide becomes LEFT.',

  buildKeyframes: (company) => {
    // Initial: facing north (up), guide right
    const halted = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0, guide: 'right' });

    // About-face: each man rotates 180° IN PLACE — no position changes.
    // File closers, formerly behind the rear rank, are now physically ahead
    // (leading in the new direction of march). This is correct per Casey.
    // The captain (still physically on the right side of the formation) is now
    // on the LEFT relative to the new southward direction of march → guide LEFT.
    const aboutFaced = halted.map((s) => ({ ...s, facing: 180 }));

    // March in retreat: company advances southward
    const marching = aboutFaced.map((s) => ({ ...s, y: s.y + MARCH_DIST }));

    // Final halt
    const finalHalt = marching;

    // Restore facing (about-face back to north) — soldiers turn in place
    const restored = finalHalt.map((s) => ({ ...s, facing: 0 }));

    return [
      {
        label: 'Halted in line, facing front',
        description:
          'The company stands in line of battle, facing front (north). Guide is on the RIGHT — the captain and covering sergeant on the right flank.',
        caseyRef: '¶68',
        duration: 0,
        positions: halted,
        annotations: ['guideRight'],
      },
      {
        label: 'About—FACE',
        description:
          'At About—FACE, every man turns 180° in place. What was the rear rank is now physically in front. The file closers, formerly behind the rear rank, are now ahead. CRITICAL: guide shifts from RIGHT to LEFT — because "right" and "left" are relative to the direction of march, which has reversed.',
        caseyRef: '¶69–72',
        duration: 1200,
        positions: aboutFaced,
        annotations: ['guideShiftLabel', 'guideLeft'],
      },
      {
        label: 'Forward MARCH, guide left — march in retreat',
        description:
          'The company marches in the new direction (southward on screen). Guide is now LEFT (the captain, who was on the right of the original formation, is now on the left of the new direction of march).',
        caseyRef: '¶73–74',
        duration: 2500,
        positions: marching,
        annotations: ['marchArrow', 'guideLeft'],
      },
      {
        label: 'HALT',
        description: 'Company halts.',
        caseyRef: '¶75',
        duration: 600,
        positions: finalHalt,
        annotations: [],
      },
      {
        label: 'About-face to restore original facing',
        description:
          'The company faces about again to restore its original facing direction.',
        caseyRef: '¶75',
        duration: 1200,
        positions: restored,
        annotations: [],
      },
    ];
  },
};
