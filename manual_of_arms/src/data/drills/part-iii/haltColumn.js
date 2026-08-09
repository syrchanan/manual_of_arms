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

// Deterministic "drift" off the column's guide-line, so there is something
// visible to straighten. The guide-line runs in the direction of march (east,
// +x); a guide "without or within the direction" (¶290) is displaced
// perpendicular to it, i.e. along y -- so we nudge whole companies in y.
//
// NAMED case (¶290): only a few guides are out -- companies 3, 5, 6 -- the
// rest already correct, matching "the colonel corrects only such as may be
// without, or within the direction; the others stand fast."
// GENERAL case (¶291): the guide-line is broadly irregular (most companies a
// little off), the situation in which the colonel judges a general
// realignment of every guide necessary instead of naming a few.
const DRIFT_PX = { 3: 10, 5: -14, 6: 6 };
const GENERAL_DRIFT_PX = { 1: 7, 2: -9, 3: 12, 4: -6, 6: 8, 7: -11, 8: 5 };

function idsOfCompany(co) {
  return co.soldiers.map((s) => s.id);
}

function jitterColumn(positions, battalion, driftMap) {
  const byId = new Map();
  battalion.forEach((co) => {
    const drift = driftMap[co.index];
    if (!drift) return;
    idsOfCompany(co).forEach((id) => byId.set(id, drift));
  });
  return positions.map((p) => (byId.has(p.id) ? { ...p, y: p.y + byId.get(p.id) } : p));
}

export default {
  id: 'halt-the-column',
  title: 'To Halt the Column',
  part: 3,
  article: 4,
  caseyParagraphs: [286, 287, 288, 289, 290, 291, 292, 293],

  // ¶290 and ¶291-293 are two MUTUALLY-EXCLUSIVE ways to square the guide-line,
  // chosen by the colonel's judgment ("If the colonel judge it NOT necessary to
  // give a general direction..." ¶290 vs. "If, ON THE CONTRARY..." ¶291) -- not
  // sequential steps. They are therefore separate sub-movements here.
  subMovements: [
    { id: 'halt', label: 'A) Column, HALT' },
    { id: 'dress-named', label: 'B) Name a Few Guides to the Line (¶290)' },
    { id: 'dress-general', label: 'C) Guides, Cover — General Realignment (¶291)' },
  ],

  commands: (subMovement) => {
    if (subMovement === 'dress-named') {
      return [
        { text: 'Guide of (such) company, or guides of (such) companies, to the right (or the left).', type: 'execution' },
      ];
    }
    if (subMovement === 'dress-general') {
      return [
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

    // ¶290 method: only a few guides are out; the colonel names them, they
    // move to the line, the others stand fast. Two beats, no general dress.
    if (subMovement === 'dress-named') {
      const drifted = jitterColumn(halted, battalion, DRIFT_PX);
      return [
        {
          label: 'Column halted, a few guides out of line',
          description: 'The column stands halted at full distance. During the march a few companies\' guides have drifted slightly off a common line; the rest are correct.',
          caseyRef: '¶289-290',
          duration: 0,
          positions: drifted,
          annotations: [],
        },
        {
          label: 'Guides named to the line',
          description: 'Judging a general realignment unnecessary, the colonel names only the companies whose guides are out: "Guide of (such) company, or guides of (such) companies, to the right (or the left)." Those guides move onto the line; the others stand fast.',
          caseyRef: '¶290',
          duration: 1500,
          positions: halted,
          annotations: [],
        },
      ];
    }

    // ¶291-293 method: the guide-line is broadly irregular, so the colonel
    // orders a general realignment of every guide. Two beats, starting from a
    // still-imperfect state distinct from the named case (no no-op frame).
    if (subMovement === 'dress-general') {
      const irregular = jitterColumn(halted, battalion, GENERAL_DRIFT_PX);
      return [
        {
          label: 'Column halted, general realignment wanted',
          description: 'The column stands halted, its guide-line irregular enough that the colonel judges it necessary to realign every guide rather than name a few.',
          caseyRef: '¶289-291',
          duration: 0,
          positions: irregular,
          annotations: [],
        },
        {
          label: 'Guides, cover -- Left (or right)--DRESS',
          description: 'The colonel places the first two guides on the chosen line and commands "Guides, cover"; every other guide covers the one ahead of it in file, each one company-front\'s distance back, the lieutenant-colonel assuring them on the line. Then, at "Left (or right)--DRESS," each company inclines and dresses on its guide, the captain posting two paces outside it, commanding FRONT, and returning to his post.',
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
