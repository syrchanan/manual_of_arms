import { lineOfBattle, translate, oblique } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 450;

// MARCH_DIST: a straight (quick-time) leg's on-screen distance. 4 paces at
// PACE_PX (14px/pace) doubled (x2) for animation legibility -> 8 *apparent*
// paces of travel, not 4 (earlier drafts of sibling files under-labeled this
// x2-scaled distance as "N paces" instead of "2N paces").
const MARCH_DIST = 4 * SCALE.PACE_PX * 2;
const MARCH_DURATION = 1500; // ms for one straight-march leg
const MARCH_RATE = MARCH_DIST / MARCH_DURATION; // px/ms, ~0.0747

// ¶102 does not fix a pace count for the oblique leg; 7 paces gives a
// visibly short diagonal. What Casey's text DOES require is that the men
// "shorten or lengthen the step... without altering the cadence" (¶107) --
// i.e. the oblique is walked at the same rate as the direct march. So we
// derive the oblique leg's DURATION from MARCH_RATE rather than reusing a
// fixed ms figure, keeping px/ms identical to the straight legs instead of
// (as before) letting the oblique leg cover ground at half that rate.
const OBLIQUE_PACES = 7;
const OBLIQUE_DIST = OBLIQUE_PACES * SCALE.PACE_PX; // 98px
const OBLIQUE_DURATION = Math.round(OBLIQUE_DIST / MARCH_RATE); // ~1313ms, same px/ms as MARCH_RATE

// Final leg is deliberately shorter (half distance) than the opening leg,
// purely for visual variety; duration is scaled down to match so the rate
// stays constant across the whole animation.
const FINAL_DIST = MARCH_DIST / 2;
const FINAL_DURATION = Math.round(FINAL_DIST / MARCH_RATE);

export default {
  id: 'oblique-march',
  title: 'Oblique March',
  lesson: 3,
  article: 3,
  caseyParagraphs: [101, 102, 103, 104, 105, 106, 107, 108],
  commands: [
    { text: '1. Right oblique.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
    { text: '1. Forward.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],
  reenactorNotes: null,

  buildKeyframes: (company) => {
    const startPositions = translate(
      lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 }),
      { dx: -60, dy: 0 }
    );

    const marching = translate(startPositions, { dx: 0, dy: -MARCH_DIST });

    // Half-face right (¶101-102): an instantaneous facing change only --
    // no translation. Positions are frozen at `marching`; only facing
    // changes to 45.
    const halfFaced = marching.map((s) => ({ ...s, facing: 45 }));

    // Oblique march (¶102): 7 paces diagonally right-forward. rearRankShift
    // implements ¶102's "march in rear of the man next on the right... of
    // their habitual file leaders" -- see the extended comment on oblique()
    // in formations.js for the full rule and its ¶102 edge case (nc-cov).
    const obliquePositions = oblique(marching, {
      directionDeg: 45,
      paces: OBLIQUE_PACES,
      rearRankShift: true,
      company,
    });
    const obliqueFaced = obliquePositions.map((s) => ({ ...s, facing: 45 }));

    // ¶103-104: "Forward. MARCH." -- the half-face and the ¶102 rear-rank
    // shift are both undone the instant direct march resumes; Casey
    // describes no intermediate state. Rather than algebraically inverting
    // oblique()'s lateral shift, we rebuild a fresh lineOfBattle() layout of
    // the company anchored on the captain's (of-cpt) position at the end of the
    // oblique leg -- of-cpt is front-rank, so it was never shifted, and
    // lineOfBattle() naturally reproduces normal (unshifted) covering. This
    // keyframe changes facing/covering only -- no translation -- so it is
    // symmetric with the half-face keyframe above per the drill's own
    // instantaneous-facing-change / marching-leg-does-the-moving convention.
    const capAtObliqueEnd = obliquePositions.find((s) => s.id === 'of-cpt');
    const frontRestored = lineOfBattle(company, {
      originX: capAtObliqueEnd.x,
      originY: capAtObliqueEnd.y,
      facing: 0,
    });

    const finalMarching = translate(frontRestored, { dx: 0, dy: -FINAL_DIST });

    return [
      {
        label: 'Company marching in line',
        description: 'The company advances in line of battle, guide right.',
        caseyRef: '¶101',
        duration: MARCH_DURATION,
        positions: marching,
        annotations: ['marchArrow', 'guideRight'],
      },
      {
        label: 'Right oblique MARCH — half-face',
        description:
          'At MARCH, each soldier makes a half-face to the right (approximately 45°). He no longer touches elbows with his neighbors but glances along the shoulders of the men to his obliquing side to keep alignment. Per ¶106, the instructor at first causes the oblique to be made toward the side of the guide, so the guide (right) does not need to shift.',
        caseyRef: '¶101–102',
        duration: 600,
        positions: halfFaced,
        annotations: ['obliqueAngle', 'guideRight'],
      },
      {
        label: 'Oblique march in progress',
        description:
          'The company marches diagonally to the right and forward, at the same cadence as the direct march (¶107). Each rear-rank man preserves his distance but now marches behind the man next on the right of his habitual file leader (¶102) — visible as a one-file lateral shift of the rear rank toward the oblique side. Per ¶105, the guide remains on the side toward which the oblique is made, without command.',
        caseyRef: '¶102, 105–106',
        duration: OBLIQUE_DURATION,
        positions: obliqueFaced,
        annotations: ['obliqueAngle', 'guideRight'],
      },
      {
        label: 'Forward MARCH — front and covering restored',
        description:
          'At MARCH, each soldier makes a half-face back to the left, restoring direct facing and elbow-to-elbow touch. The rear rank simultaneously resumes covering its own habitual file leader directly (¶102–104).',
        caseyRef: '¶103–104',
        duration: 500,
        positions: frontRestored,
        annotations: ['alignmentLine', 'guideRight'],
      },
      {
        label: 'Direct march resumed',
        description:
          'The company resumes its direct march in line of battle, guide right as before the oblique (¶105). Note that the formation has shifted to the right relative to where it started. The instructor watches that the men follow parallel directions and that files do not crowd (¶107–108).',
        caseyRef: '¶104, 107–108',
        duration: FINAL_DURATION,
        positions: finalMarching,
        annotations: ['marchArrow', 'guideRight'],
      },
    ];
  },
};
