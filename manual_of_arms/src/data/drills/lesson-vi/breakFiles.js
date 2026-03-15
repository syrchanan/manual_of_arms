import { lineOfBattle } from '../../../engine/formations.js';
import { CANVAS, SCALE } from '../../constants.js';
const ORIGIN_X = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;
const ORIGIN_Y = 400;
export default {
  id: 'breakFiles',
  title: 'breakFiles',
  lesson: 6,
  caseyParagraphs: [],
  commands: [],
  reenactorNotes: null,
  buildKeyframes: (company) => [{
    label: 'Coming soon',
    description: 'This drill animation is in development.',
    caseyRef: '',
    duration: 0,
    positions: lineOfBattle(company, { originX: ORIGIN_X, originY: ORIGIN_Y }),
    annotations: [],
  }],
};
