import { columnOfCompanies } from '../../../engine/battalionFormations.js';
import { translate } from '../../../engine/formations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION, SCALE } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Third, Article IV (S.B. ¶286-293): "To halt the column."
//
// Straightforward per the spec's own Complexity note: a single freeze-frame
// keyframe for the halt itself (¶286-288), plus an optional "dress the
// column" sub-sequence (¶289-293) showing guides being individually or
// generally realigned on a common line once halted. This does NOT deploy the
// column into line of battle (that is Part Fourth) -- it only squares up the
// halted column's own guide-line.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 200;
const ORIGIN_Y = 220;
const FACING = 90; // marching east
const MARCH_PACES = 5;
const MARCH_DX = MARCH_PACES * SCALE.PACE_PX;

// Deterministic "drift" applied to a few companies' guides for the dress
// sub-movement, so there is something visible to straighten (¶290-293).
// Companies 3, 5, 6 are nudged off the guide-line by a small, fixed amount;
// all others sit correctly already -- matching ¶290's "colonel individually
// corrects only the guides that are out of line" (a general realignment of
// every guide is not always needed).
const DRIFT_PX = { 3: 10, 5: -14, 6: 6 };

function idsOfCompany(co) {
  return co.soldiers.map((s) => s.id);
}

function jitterColumn(positions, battalion) {
  const byId = new Map();
  battalion.forEach((co) => {
    const drift = DRIFT_PX[co.index];
    if (!drift) return;
    idsOfCompany(co).forEach((id) => byId.set(id, drift));
  });
  // Facing 90 (east): "across" (perpendicular to the line of march, i.e.
  // along the guide-line) is the y axis.
  return positions.map((p) => (byId.has(p.id) ? { ...p, y: p.y + byId.get(p.id) } : p));
}

export default {
  id: 'halt-the-column',
  title: 'To Halt the Column',
  part: 3,
  article: 4,
  caseyParagraphs: [286, 287, 288, 289, 290, 291, 292, 293],

  subMovements: [
    { id: 'halt', label: 'A) Column, HALT' },
    { id: 'dress', label: 'B) Guides Cover & Dress the Column' },
  ],

  commands: (subMovement) => {
    if (subMovement === 'dress') {
      return [
        { text: 'Guide of (such) company, to the right (or to the left).', type: 'note' },
        { text: '1. Guides, cover.', type: 'preparatory' },
        { text: '2. Left (or right)--DRESS.', type: 'execution' },
      ];
    }
    return [
      { text: '1. Column.', type: 'preparatory' },
      { text: '2. HALT.', type: 'execution' },
    ];
  },

  reenactorNotes:
    'Column, HALT is briskly repeated by the captains and by any skirmisher platoon chiefs; the column halts and no guide moves to fix drift or lost distance -- every company halts exactly where it is (¶286-287). The same commands halt a column marching in double-quick; the men individually fix their own positions in ranks after halting (¶288). To then square up the halted column\'s own guide-line (not to deploy into line of battle -- that is Part Fourth): if only a few guides are out of line, the colonel names them individually, "Guide of (such) company... to the right (or left)" -- named guides move to the line, the others stand fast (¶290). If a general realignment is wanted instead, the colonel places the first two guides himself on the chosen line and commands "Guides, cover" -- every other guide then covers the one ahead of it in file, each exactly one company-front\'s distance back, the lieutenant-colonel assuring them on the line (¶291-292). At "Left (or right)--DRESS," briskly repeated by the chiefs of subdivision, each company inclines and dresses forward or backward to bring its designated flank onto its guide; the captain posts two paces outside his own guide, aligns his company parallel to the one ahead, commands FRONT, and returns to his post (¶293).',

  buildKeyframes: (_company, subMovement, battalion = DEFAULT_BATTALION) => {
    const halted = columnOfCompanies(battalion, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: FACING,
      distanceMode: 'full',
    });

    if (subMovement === 'dress') {
      const drifted = jitterColumn(halted, battalion);
      return [
        {
          label: 'Column halted, guides uncorrected',
          description: 'The column stands halted at full distance. A few companies\' guides have drifted slightly off a common line during the march -- normal after a halt, since no guide moves to fix drift when the column simply halts.',
          caseyRef: '¶286-288',
          duration: 0,
          positions: drifted,
          annotations: [],
        },
        {
          label: 'Guides named to the line',
          description: 'The colonel individually names the companies whose guides are out of line, "Guide of (such) company, to the right (or left)" -- those guides move to the line; the others, already correct, stand fast.',
          caseyRef: '¶290',
          duration: 1500,
          positions: halted,
          annotations: [],
        },
        {
          label: 'Guides, cover -- Left (or right)--DRESS',
          description: 'For a general realignment, the colonel places the first two guides on the chosen line and commands "Guides, cover" -- every other guide covers the guide ahead of it, each one company-front\'s distance back. Each captain then dresses his company on the line, posts two paces outside his guide, commands FRONT, and returns to his post.',
          caseyRef: '¶291-293',
          duration: 2000,
          positions: halted,
          annotations: [],
        },
      ];
    }

    const marching = translate(halted, { dx: -MARCH_DX, dy: 0 });

    return [
      {
        label: 'Column marching',
        description: 'The battalion marches in column of companies at full distance.',
        caseyRef: '¶286',
        duration: 0,
        positions: marching,
        annotations: ['marchArrow'],
      },
      {
        label: 'Column -- HALT',
        description: 'At HALT, briskly repeated by the captains, the column halts at once. No guide moves to fix drift or lost distance -- every company halts exactly where it stands; the men individually fix their own positions in ranks.',
        caseyRef: '¶286-288',
        duration: 1000,
        positions: halted,
        annotations: [],
      },
    ];
  },
};
