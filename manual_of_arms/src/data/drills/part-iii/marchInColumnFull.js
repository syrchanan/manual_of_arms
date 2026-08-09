import { columnOfCompanies } from '../../../engine/battalionFormations.js';
import { aboutFace, translate } from '../../../engine/formations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION, SCALE } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Third, Article I (S.B. ¶216-232): "To march in column at full
// distance."
//
// Two sub-drills:
//   'forward' -- ordinary march in column, leading guide tracking a point of
//     direction, following guides simply tracing the guide immediately ahead
//     (¶216-224, ¶234-235 -- the cardinal marching principle).
//   'about' -- the column-about-while-marching variant (¶225-226): every
//     company faces about IN PLACE (no repositioning -- see formations.js's
//     aboutFace(), already proven at company scale), and the column resumes
//     marching in the opposite direction. The physical order of companies
//     along the ground is unchanged; only which end reads as "front" flips,
//     exactly matching Casey's "the column reverses direction in place."
//
// Column units here are the 8 individual companies (not divisions): the
// engine's columnOfCompanies() distanceMode intervals (COMPANY_FRONT for
// 'full', half of that for 'half', 6 paces for 'mass') are all defined
// relative to a SINGLE company's front. Grouping into divisions would need a
// wider "full distance" (a division's front is ~2 company fronts) that the
// engine does not compute automatically, so single companies are used
// throughout Part Third's column drills to keep the distanceMode intervals
// correct.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 200;
const ORIGIN_Y = 220;
const FACING = 90; // marching east; column depth extends toward -x (west/rear)

const MARCH_PACES = 6;
const MARCH_DX = MARCH_PACES * SCALE.PACE_PX;

export default {
  id: 'march-in-column-full-distance',
  title: 'To March in Column at Full Distance',
  part: 3,
  article: 1,
  caseyParagraphs: [216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 232, 234, 235],

  subMovements: [
    { id: 'forward', label: 'A) March Forward' },
    { id: 'about', label: 'B) Column About While Marching' },
  ],

  commands: (subMovement) => {
    if (subMovement === 'about') {
      return [
        { text: '1. Battalion, right about.', type: 'preparatory' },
        { text: '2. MARCH.', type: 'execution' },
        { text: '3. Guide right.', type: 'execution' },
      ];
    }
    return [
      { text: '1. Column forward.', type: 'preparatory' },
      { text: '2. Guide left (or right).', type: 'preparatory' },
      { text: '3. MARCH (or double quick--MARCH).', type: 'execution' },
    ];
  },

  reenactorNotes:
    'The colonel indicates two distant objects on the line of march to the leading guide before starting (¶216); with only one object the guide catches an intermediate point himself (¶217); with no landmark at all, the lieutenant-colonel or adjutant rides 40 paces ahead to mark the direction (¶218). The leading guide keeps the two points aligned to hold a straight line of march (¶221) -- but every FOLLOWING guide does not attend to general direction at all: each simply follows in the exact trace of the guide immediately ahead of him (¶222, restated as the cardinal marching principle at ¶234-235). The lieutenant-colonel rides abreast the leading guide watching for deviation; the senior major abreast the last subdivision, correcting guide drift before it propagates down the column, but only for "sensible or material" faults (¶223-224). The about-while-marching variant (¶225-226) is a column-wide in-place reversal: chiefs of subdivision move behind the new front rank, file closers move in front of the new rear rank, guides relocate to the new front -- functionally identical to the Lesson V company-scale about-face, just applied to every company simultaneously via aboutFace() (no soldier changes ground position, only facing). Full distance is not sustained long except in route step or ceremony (¶232) -- in the presence of the enemy the column habitually marches at half distance or closed in mass (Articles V-VI). The marker-relay method for prolonging a line of direction with no landmarks (¶228-231, three mounted officers leapfrogging 300-400 paces apart) is administrative staging, not troop movement, and is not modeled here.',

  buildKeyframes: (_company, subMovement, battalion = DEFAULT_BATTALION) => {
    const halted = columnOfCompanies(battalion, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: FACING,
      distanceMode: 'full',
    });

    if (subMovement === 'about') {
      const marching = translate(halted, { dx: MARCH_DX, dy: 0 });
      const facedAbout = aboutFace(marching);
      // Forward for the new (reversed) facing of 270 is -x; the physical
      // order of companies along the ground is unchanged, only which end is
      // "front" has flipped.
      const resumed = translate(facedAbout, { dx: -MARCH_DX, dy: 0 });

      return [
        {
          label: 'Column marching at full distance',
          description: 'The battalion marches in column of companies at full distance, the leading guide tracking a point of direction.',
          caseyRef: '¶219-222',
          duration: 0,
          positions: marching,
          annotations: ['marchArrow'],
        },
        {
          label: 'Battalion, right about -- MARCH',
          description: 'Every company faces about in place -- chiefs of subdivision move behind the new front rank, file closers move in front of the new rear rank, guides relocate to what is now the front rank. No company changes ground position; the column simply reverses which end is "front."',
          caseyRef: '¶225-226',
          duration: 1600,
          positions: facedAbout,
          annotations: [],
        },
        {
          label: 'Guide right -- column resumes in the new direction',
          description: 'The senior major gives the new leading guide a point of direction; the column marches off the opposite way, the lieutenant-colonel now trailing abreast the first division (now in rear).',
          caseyRef: '¶226-227',
          duration: 1600,
          positions: resumed,
          annotations: ['marchArrow'],
        },
      ];
    }

    const marching = translate(halted, { dx: MARCH_DX, dy: 0 });
    const continuing = translate(marching, { dx: MARCH_DX, dy: 0 });

    return [
      {
        label: 'Column halted, full distance',
        description: 'The battalion stands formed in column of companies at full distance, at a halt, facing the intended direction of march.',
        caseyRef: '¶216-218',
        duration: 0,
        positions: halted,
        annotations: [],
      },
      {
        label: 'Column forward -- Guide left -- MARCH',
        description: 'At MARCH, briskly repeated by the chiefs of subdivision, the column steps off. The leading guide keeps two points of direction aligned; the lieutenant-colonel rides abreast him watching for deviation.',
        caseyRef: '¶219-221, 223',
        duration: 1800,
        positions: marching,
        annotations: ['marchArrow'],
      },
      {
        label: 'Column continues marching',
        description: 'Every following guide simply traces the guide immediately ahead of him, rather than attending to the general direction himself -- the cardinal principle of marching in column. The colonel holds himself on the directing flank throughout, watching step and distances.',
        caseyRef: '¶222-224, 227, 234-235',
        duration: 1800,
        positions: continuing,
        annotations: ['marchArrow'],
      },
    ];
  },
};
