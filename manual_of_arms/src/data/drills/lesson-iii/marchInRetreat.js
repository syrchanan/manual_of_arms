import { lineOfBattle, translate, aboutFace } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 350;
// 6 * PACE_PX * 2 = 12 paces of visible march distance in retreat. The
// trailing "* 2" is a visual scale-up for the animation, not a second pace
// multiplier -- SCALE.PACE_PX already equals one pace in px.
const MARCH_DIST = 6 * SCALE.PACE_PX * 2; // ~12 paces of visible movement

const { RANK_GAP, FILE_CLOSER_GAP, PACE_PX } = SCALE;
const SERGEANT_ADVANCE_PX = 6 * PACE_PX; // ¶122: six paces in front of the line of file closers

/**
 * ¶121-123: at "Company, forward" (before MARCH), three men reposition while
 * the company is still halted, now facing to the rear:
 *  - the covering sergeant steps into the line of file closers, opposite
 *    his own interval (¶123);
 *  - the captain places himself in the rear rank (file 1), now become the
 *    front -- i.e. the rank that is geometrically leading in the new
 *    direction of march (¶123);
 *  - the directing sergeant (fc-5sg, same convention as marchInLine.js's
 *    ¶86) places himself six paces in front of the line of file closers,
 *    now leading (¶122) -- NOT six paces from the captain, as in ¶86.
 *
 * Because the file-closer line already sits two paces (¶91) behind the rank
 * the captain now occupies, the captain-to-sergeant gap during retreat works
 * out to 2 + 6 = 8 paces, not 6. This is what the text actually specifies
 * (¶122's reference point is explicitly "the line of file closers," not the
 * captain), so the geometry below reproduces 8 paces rather than forcing a
 * 6-pace match to ¶86.
 */
function withRetreatReposition(positions) {
  const posMap = Object.fromEntries(positions.map((p) => [p.id, p]));
  const capOld = posMap['of-cpt']; // old front-rank file-1 slot
  const covOld = posMap['nc-cov']; // old rear-rank file-1 slot
  if (!capOld || !covOld) return positions;

  const facing = capOld.facing; // 180: company now faces to the rear
  const rad = (facing * Math.PI) / 180;
  // Unit vector pointing "forward" (the new direction of march) at this facing.
  const fwdX = Math.sin(rad);
  const fwdY = -Math.cos(rad);

  // Captain moves from the old front-rank slot into the old rear-rank slot
  // (now the leading rank of the two).
  const captainNew = { x: covOld.x, y: covOld.y };

  // Covering sergeant steps back into the file-closer line, opposite his own
  // interval (file 1's line), measured forward from the old front-rank slot.
  const covNew = {
    x: capOld.x + fwdX * (RANK_GAP + FILE_CLOSER_GAP),
    y: capOld.y + fwdY * (RANK_GAP + FILE_CLOSER_GAP),
  };

  // Directing sergeant: six paces beyond the (now-leading) file-closer line,
  // on the prolongation of the directing file (captain's file, file 1).
  const sergeantNew = {
    x: covNew.x + fwdX * SERGEANT_ADVANCE_PX,
    y: covNew.y + fwdY * SERGEANT_ADVANCE_PX,
  };

  return positions.map((s) => {
    if (s.id === 'of-cpt') return { ...s, ...captainNew };
    if (s.id === 'nc-cov') return { ...s, ...covNew };
    if (s.id === 'fc-5sg') return { ...s, ...sergeantNew };
    return s;
  });
}

export default {
  id: 'march-in-retreat',
  title: 'March in Retreat',
  lesson: 3,
  article: 5,
  // Subset of ¶119-136 actually dramatized here: the halt-and-about-face
  // opening, the forward march in retreat, and the halt/restore closing
  // (¶119-127). ¶128-136 cover further variants not depicted in this
  // animation (facing about while already marching, double-quick specifics,
  // rank-distance rules).
  caseyParagraphs: [119, 120, 121, 122, 123, 124, 125, 126, 127],
  commands: [
    { text: '1. Company.', type: 'preparatory' },
    { text: '2. About—FACE.', type: 'execution' },
    { text: '3. Company, forward.', type: 'preparatory' },
    { text: '4. MARCH.', type: 'execution' },
  ],
  reenactorNotes:
    'One of the most commonly confused points: when you about-face, the guide switches flanks because RIGHT and LEFT are relative to the direction of march. Before the about-face, guide is on the right (file 1, the captain). After the about-face, the company now marches toward the bottom of the screen, so the captain — still on the physical right side — is now on the LEFT of the new direction of march. Guide becomes LEFT. ' +
    "Also per ¶121-123: at Company, forward, the covering sergeant steps back into the line of file closers, the captain takes the covering sergeant's old rear-rank slot (now the leading rank), and the directing sergeant (fc-5sg) posts six paces beyond the file-closer line, now leading. Because that line is itself two paces behind the captain's new rank, the captain-to-sergeant gap in retreat is 8 paces, not the 6 paces of ¶86.",

  buildKeyframes: (company) => {
    // Initial: facing north (up), guide right, all soldiers at habitual posts.
    const halted = lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0, guide: 'right' });

    // About-face: each man rotates 180 degrees in place -- no position change.
    // The line of file closers, formerly behind the rear rank, is now
    // physically ahead (leading) in the new direction of march (¶122).
    const aboutFaced = aboutFace(halted);

    // "Company, forward": captain, covering sergeant, and directing sergeant
    // reposition while still halted (¶121-123).
    const repositioned = withRetreatReposition(aboutFaced);

    // MARCH: company advances in retreat (south on screen).
    const marching = translate(repositioned, { dx: 0, dy: MARCH_DIST });

    // HALT: same positions, motion simply stops.
    const haltedInRetreat = marching;

    // About-face to restore original front and posts: the captain, covering
    // sergeant, and directing sergeant "resume their habitual places in
    // line, the moment they shall have faced about" (¶127) -- the company
    // returns to ordinary line-of-battle geometry, facing front, at the
    // location it marched to.
    const restored = translate(halted, { dx: 0, dy: MARCH_DIST });

    return [
      {
        label: 'Halted in line, facing front',
        description:
          'The company stands halted and correctly aligned in line of battle, facing front. Guide is on the RIGHT — the captain and covering sergeant on the right flank.',
        caseyRef: '¶119',
        duration: 0,
        positions: halted,
        annotations: ['guideRight'],
      },
      {
        label: 'About—FACE',
        description:
          'At About—FACE, every man turns 180° in place. The line of file closers, formerly behind the rear rank, is now physically ahead. The instructor takes position in front of the directing file, as at ¶84. CRITICAL: guide shifts from RIGHT to LEFT — because "right" and "left" are relative to the direction of march, which has reversed.',
        caseyRef: '¶119–120',
        duration: 1200,
        positions: aboutFaced,
        annotations: ['guideShiftLabel', 'guideLeft'],
      },
      {
        label: 'Company, forward — captain, covering sergeant, and directing sergeant reposition',
        description:
          'Before MARCH, three men reposition: the covering sergeant steps into the line of file closers opposite his own interval; the captain places himself in the rear rank, now become the front; and the directing sergeant posts six paces in front of the line of file closers, now leading.',
        caseyRef: '¶121–123',
        duration: 1000,
        positions: repositioned,
        annotations: ['guideLeft'],
      },
      {
        label: 'MARCH — company marches in retreat',
        description:
          'The company steps off in retreat. The directing sergeant, the captain, and the men conform to what is prescribed for the march in advance (¶89 and following): the directing sergeant sets the direction and cadence on his chosen points, and the captain marches steadily in his trace.',
        caseyRef: '¶124–125',
        duration: 2500,
        positions: marching,
        annotations: ['marchArrow', 'guideLeft'],
      },
      {
        label: 'HALT',
        description:
          'The company halts. The commands and the means of execution for halting in retreat are the same as for marching in advance.',
        caseyRef: '¶126',
        duration: 600,
        positions: haltedInRetreat,
        annotations: ['guideLeft'],
      },
      {
        label: 'About-face — restore original front and habitual posts',
        description:
          'The instructor causes the company to face to the front by the same commands as before (¶119). The captain, the covering sergeant, and the directing sergeant resume their habitual places in line the moment they have faced about.',
        caseyRef: '¶127',
        duration: 1200,
        positions: restored,
        annotations: [],
      },
    ];
  },
};
