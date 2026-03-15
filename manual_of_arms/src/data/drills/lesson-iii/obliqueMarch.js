import { lineOfBattle, translate, oblique } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 450;
const MARCH_DIST = 4 * SCALE.PACE_PX * 2;

export default {
  id: 'oblique-march',
  title: 'Oblique March',
  lesson: 3,
  article: 3,
  caseyParagraphs: [50, 51, 52, 53, 54, 55, 56],
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

    // Half-face right: soldiers rotate 45°
    const halfFaced = marching.map((s) => ({ ...s, facing: 45 }));

    // Oblique march: 7 paces diagonally right-forward
    const obliquePositions = oblique(marching, { directionDeg: 45, paces: 7 });
    const obliqueFaced = obliquePositions.map((s) => ({ ...s, facing: 45 }));

    // Return to direct march
    const directResumed = translate(obliquePositions, { dx: 0, dy: -MARCH_DIST });
    const directFaced = directResumed.map((s) => ({ ...s, facing: 0 }));

    const finalMarching = translate(directFaced, { dx: 0, dy: -MARCH_DIST / 2 });

    return [
      {
        label: 'Company marching in line',
        description: 'The company advances in line of battle, guide right.',
        caseyRef: '¶50',
        duration: 1500,
        positions: marching,
        annotations: ['marchArrow'],
      },
      {
        label: 'Right oblique MARCH — half-face',
        description:
          'At MARCH, each soldier makes a half-face to the right (approximately 45°). He no longer touches elbows with his neighbors but glances along the shoulders of the men to his obliquing side to keep alignment.',
        caseyRef: '¶51–52',
        duration: 600,
        positions: halfFaced,
        annotations: ['obliqueAngle'],
      },
      {
        label: 'Oblique march in progress',
        description:
          'The company marches diagonally to the right and forward. Each man keeps his shoulders parallel to the rank.',
        caseyRef: '¶53–54',
        duration: 2500,
        positions: obliqueFaced,
        annotations: ['obliqueAngle'],
      },
      {
        label: 'Forward MARCH — return to direct march',
        description:
          'At MARCH, each soldier makes a half-face back to the original direction (left, ~45°), restoring direct facing. Elbow-to-elbow touch is re-established.',
        caseyRef: '¶55',
        duration: 600,
        positions: directFaced,
        annotations: ['marchArrow'],
      },
      {
        label: 'Direct march resumed',
        description:
          'The company resumes its direct march in line of battle. Note that the formation has shifted to the right relative to where it started.',
        caseyRef: '¶56',
        duration: 1500,
        positions: finalMarching,
        annotations: ['marchArrow'],
      },
    ];
  },
};
