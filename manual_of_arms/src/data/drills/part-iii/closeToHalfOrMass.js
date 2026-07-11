import { columnOfCompanies, cascadeBlend } from '../../../engine/battalionFormations.js';
import { aboutFace } from '../../../engine/formations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Third, Article V (S.B. ¶294-334): "To close the column to half
// distance, or in mass."
//
// Four meaningfully different mechanics, per the spec's own Complexity note:
// closing on the LEADING company (¶294-311, the lead company stands fast,
// every other company marches up and halts as it reaches the target
// distance from the one ahead) vs. closing on the REARMOST/8th company
// (¶316-331, a distinct, harder drill: the whole column faces about first,
// the 8th company stands fast, every other company halts-and-refaces at
// computed intervals while guides temporarily sit in the "wrong" rank, then
// the guides face about again at the end) -- crossed with the two closing
// TARGETS, half distance (platoon front, ¶298-299) and mass (6 paces
// between guides, ¶333). Modeled as four subMovements rather than
// conflating them, since the rear-company case is genuinely different
// choreography, not just a parameter flip.
//
// Column units are the 8 individual companies (see marchInColumnFull.js's
// header note on why divisions are not used for these distanceMode-driven
// drills).
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 200;
const ORIGIN_Y = 220;
const FACING = 90; // marching east; column depth extends toward -x (west/rear)

function companyIndexOf(id) {
  const m = id.match(/^c(\d+)-/);
  return m ? Number(m[1]) : null;
}

export default {
  id: 'close-column-half-or-mass',
  title: 'To Close the Column to Half Distance, or in Mass',
  part: 3,
  article: 5,
  caseyParagraphs: [294, 295, 296, 297, 298, 299, 300, 306, 316, 317, 319, 321, 323, 332, 333, 334],

  subMovements: [
    { id: 'lead-half', label: 'A) Close on Lead Company -- Half Distance' },
    { id: 'lead-mass', label: 'B) Close on Lead Company -- in Mass' },
    { id: 'rear-half', label: 'C) Close on 8th (Rear) Company -- Half Distance' },
    { id: 'rear-mass', label: 'D) Close on 8th (Rear) Company -- in Mass' },
  ],

  commands: (subMovement) => {
    const mass = subMovement === 'lead-mass' || subMovement === 'rear-mass';
    const distPhrase = mass ? 'Column, close in mass.' : 'To half distance, close column.';
    if (subMovement === 'rear-half' || subMovement === 'rear-mass') {
      const onEighth = mass ? 'On the eighth company, column, close in mass.' : 'On the eighth company, to half distance, close column.';
      return [
        { text: `1. ${onEighth}`, type: 'preparatory' },
        { text: '2. Battalion about--FACE.', type: 'preparatory' },
        { text: '3. Column forward.', type: 'preparatory' },
        { text: '4. Guide right.', type: 'preparatory' },
        { text: '5. MARCH (or double quick--MARCH).', type: 'execution' },
      ];
    }
    return [
      { text: `1. ${distPhrase}`, type: 'preparatory' },
      { text: '2. MARCH (or double quick--MARCH).', type: 'execution' },
    ];
  },

  reenactorNotes:
    "Full, half, and mass distance are a single distance PARAMETER on the column, not three separate formations: full distance = one company's front between guides (¶294); half distance = one platoon's front, i.e. half a company's front (¶298-299, demonstrated directly: each following company halts \"as it arrives at platoon distance from the one preceding\"); closed in mass = six paces between guides (¶333). Closing on the LEADING company: at the preparatory command the lead captain cautions his company to stand fast (¶295); at MARCH, repeated by every OTHER captain, the lead company stands fast and aligns by the left while its file closers close one pace onto the rear rank (¶297) -- every other company keeps marching and halts as it reaches the target distance from the company ahead, its guide lining up on the guides ahead, its captain aligning by the left and closing file closers a pace (¶298-300). The colonel superintends from the guide side, confirming each captain halts exactly at the right distance; the lieutenant-colonel confirms each guide's position; the senior major follows abreast the last guide (¶303-305). Closing on the REARMOST (8th) company is a distinct, harder drill: the whole battalion faces about first (guides staying in what is now the rear rank); the 8th company's captain cautions it to keep facing front while every other captain posts on the flank and cautions his company it will face about (¶316-320); at MARCH the 8th company stands fast and aligns by the left, while every other company marches (now effectively rearward, since it is faced about), halting and fronting at the target distance from the company already fixed ahead of it, its rear-faced guide planting the line before facing about again once the captain has aligned the company (¶321). Once every company is closed and aligned, the colonel has the rear-faced guides face about, restoring the column's original forward orientation with the distance now closed toward the rear (¶323). A column BY DIVISION closes to half distance by the identical means as by company (¶332); a column by company or division, at full or half distance, closes into MASS by the identical commands, substituting \"column, close in mass\" for \"to half distance close column\" -- the only mechanical difference being that each chief does not halt his subdivision until its guide is six paces (not platoon distance) from the guide ahead (¶333). In a column left-in-front these movements execute on the same principles, mirrored (¶334).",

  buildKeyframes: (_company, subMovement, battalion = DEFAULT_BATTALION) => {
    const mode = subMovement || 'lead-half';
    const targetDistance = mode.endsWith('mass') ? 'mass' : 'half';
    const rear = mode.startsWith('rear');

    const full = columnOfCompanies(battalion, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: FACING,
      distanceMode: 'full',
    });

    if (!rear) {
      // --- Closing on the LEADING company (¶294-311) ---
      const closed = columnOfCompanies(battalion, {
        originX: ORIGIN_X,
        originY: ORIGIN_Y,
        facing: FACING,
        distanceMode: targetDistance,
      });

      // Cascade: the lead company (index 1) never moves; each following
      // company closes up in succession, front to rear, so a mid-closing
      // snapshot shows progress decreasing toward the rear of the column.
      const progressByGroupId = {};
      battalion.forEach((co, i) => {
        progressByGroupId[co.index] = Math.max(0, 1 - i * 0.16);
      });
      const closing = cascadeBlend(full, closed, progressByGroupId, (id) => companyIndexOf(id));

      const distLabel = targetDistance === 'mass' ? 'in mass' : 'to half distance';
      return [
        {
          label: 'Column at full distance',
          description: 'The battalion stands (or marches) in column of companies at full distance.',
          caseyRef: '¶294',
          duration: 0,
          positions: full,
          annotations: [],
        },
        {
          label: `To half distance, close column -- MARCH${targetDistance === 'mass' ? ' (in mass)' : ''}`,
          description: `The lead company stands fast and aligns by the left, file closers closing one pace onto the rear rank. Every other company continues marching, each halting in succession as it reaches ${targetDistance === 'mass' ? 'six paces from the guide of the company ahead' : 'platoon distance from the company ahead'}.`,
          caseyRef: targetDistance === 'mass' ? '¶295-297, 333' : '¶295-300',
          duration: 2000,
          positions: closing,
          annotations: ['marchArrow'],
        },
        {
          label: `Column closed ${distLabel}`,
          description: `The whole column has closed up on the lead company, every guide now at the correct interval and dressed on the guides ahead.`,
          caseyRef: targetDistance === 'mass' ? '¶333' : '¶298-300, 303-305',
          duration: 1500,
          positions: closed,
          annotations: [],
        },
      ];
    }

    // --- Closing on the REARMOST (8th) company (¶316-331) ---
    const NEW_FACING = (FACING + 180) % 360;
    const aboutFaced = aboutFace(full);
    const eighthCaptain = aboutFaced.find((p) => p.id === 'c8-of-cpt');

    // Reversed order: company 8 anchors the new "lead" position (it is
    // already physically furthest in the new forward direction), companies
    // 7..1 close up onto it in succession.
    const reversedUnits = [...battalion].reverse();
    const closedReversed = columnOfCompanies(reversedUnits, {
      originX: eighthCaptain.x,
      originY: eighthCaptain.y,
      facing: NEW_FACING,
      distanceMode: targetDistance,
    });

    const progressByGroupId = {};
    reversedUnits.forEach((co, i) => {
      progressByGroupId[co.index] = Math.max(0, 1 - i * 0.16);
    });
    const closing = cascadeBlend(aboutFaced, closedReversed, progressByGroupId, (id) => companyIndexOf(id));

    // Final: guides face about again, restoring the original forward
    // orientation while the column now sits closed toward the 8th company.
    const finalColumn = aboutFace(closedReversed);

    const distLabel = targetDistance === 'mass' ? 'in mass' : 'to half distance';
    return [
      {
        label: 'Column at full distance',
        description: 'The battalion stands in column of companies at full distance, facing its original direction of march.',
        caseyRef: '¶294',
        duration: 0,
        positions: full,
        annotations: [],
      },
      {
        label: 'Battalion about--FACE',
        description: 'On the preparatory command, the 8th company\'s captain cautions it to keep facing front; every other captain posts two paces outside his company on the directing flank and cautions his men they will face about. At the command, every company but the 8th faces about in place -- the guides remain in what is now the rear rank.',
        caseyRef: '¶316-320',
        duration: 1600,
        positions: aboutFaced,
        annotations: [],
      },
      {
        label: `Column forward -- Guide right -- MARCH${targetDistance === 'mass' ? ' (in mass)' : ''}`,
        description: `The 8th company stands fast and aligns by the left, file closers closing one pace. Every other company marches (now effectively rearward) and halts-and-fronts in succession as it reaches ${targetDistance === 'mass' ? 'six paces' : 'platoon distance'} from the company already fixed ahead of it; each halting company's rear-faced guide plants the line before facing about again once its captain has aligned it.`,
        caseyRef: targetDistance === 'mass' ? '¶321, 333' : '¶321',
        duration: 2200,
        positions: closing,
        annotations: ['marchArrow'],
      },
      {
        label: `Column closed ${distLabel} on the 8th company -- guides face about`,
        description: 'Once every company is closed and aligned, the colonel has the rear-faced guides face about, restoring the column\'s original forward orientation with its distance now closed toward the rear.',
        caseyRef: '¶323',
        duration: 1500,
        positions: finalColumn,
        annotations: [],
      },
    ];
  },
};
