import { columnOfFiles } from '../../../engine/formations.js';
import { battalionLine, cascadeBlend } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION, COLOR_COMPANY_INDEX } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';
import { buildColorParty, buildFieldAndStaff } from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article XI (S.B. ¶820-829, incl. Remarks ¶828-829): "To form
// the battalion on the right or left, by file, into line of battle."
//
// SAME FILE-DOUBLING-SCALING ANSWER AS ARTICLE X (battalion-spec/
// part-fifth-b.md's complexity notes): ¶822 states the leading company forms
// itself into line "exactly as indicated in S.C. No. 151" -- the existing
// company-scale file-group cascade already implemented in
// lesson-iv/formByFile.js -- and "all the other companies follow the leading
// company's movement." There is no battalion-wide file-cascade renumbering;
// every company runs its own independent cascade.
//
// The genuinely new battalion-scale wrinkle is concatenation along the WIDTH
// axis, SERIALIZED IN TIME (¶822-823): the leading company's cascade
// completes first; only then does the next company back in the column begin
// its own cascade, sliding its finished line-segment in immediately beside
// the already-formed portion. This is the only article in this range where a
// company's own animation start time is gated by the PREVIOUS company's
// completion, rather than a fixed clock or spatial trigger.
//
// ENGINE APPROACH (per the spec's own recommendation): rather than re-deriving
// each company's internal per-file-group cascade at battalion scale (lesson-
// iv/formByFile.js's buildFormByFilePositions, generalized to 8 companies),
// this drill uses the simpler alternative the spec explicitly allows --
// discrete snapshots blending each company between its "waiting in column"
// position and its "formed in line" position (cascadeBlend(), already used
// this way by part-iv/fullDistanceIntoLine.js), with a per-company progress
// map that keeps completed companies at 1, the currently-forming company at a
// mid-cascade value, and not-yet-reached companies at 0. The FINAL formed
// state for every company is simply battalionLine() in normal company order
// (1 rightmost ... 8 leftmost) -- the same continuous, gapless line every
// other Part Fourth/Fifth line-of-battle drill in this project already
// produces -- since ¶822 confirms the assembled result is an ordinary line of
// battle, just built up company by company rather than by a single
// simultaneous wheel.
//
// FORMING-ORDER CHOICE: "on the right, by file, into line" (¶820-826) means
// the RIGHT of the eventual line is established first -- so company 1
// (rightmost) leads the marching column and forms first; companies 2-8 fall
// in successively to its left. "On the left" (¶827's mirror) reverses this:
// company 8 leads and forms first, companies 7-1 fall in successively to its
// right. This file is self-contained (its own marching-column setup, not
// imported from marchByFlank.js), so this choice does not need to reconcile
// with that file's own ¶809-derived left/right convention -- both are
// independently documented interpretive calls.
// ---------------------------------------------------------------------------

const { FILE_INTERVAL, PACE_PX } = SCALE;
const DEPTH_SPACING = 2 * FILE_INTERVAL; // 20px -- columnOfFiles' own depth pitch
const GROUPS_PER_COMPANY = 11; // head pair + 9 doubled pairs + lone file 20
const COMPANY_COLUMN_DEPTH = GROUPS_PER_COMPANY * DEPTH_SPACING; // 220px

const LINE_ORIGIN_X = CANVAS_BATTALION.VIEW_W - 60;
const LINE_ORIGIN_Y = 260;
const COLUMN_ORIGIN_Y = 90;

function combine(soldiers, colorParty, fieldStaff) {
  return [...soldiers, ...colorParty, ...fieldStaff];
}

/** Strip the battalion namespace ("c3-") from a company's soldier ids so the
 * company-scale columnOfFiles() (which keys off literal ids like
 * 'of-cpt'/'nc-cov') works unmodified per company. */
function localCompany(co) {
  const prefix = `c${co.index}-`;
  return co.soldiers.map((s) => ({ ...s, id: s.id.slice(prefix.length) }));
}
function reNamespace(positions, co) {
  const prefix = `c${co.index}-`;
  return positions.map((p) => ({ ...p, id: `${prefix}${p.id}` }));
}

function groupOfId(id) {
  const m = /^c(\d+)-/.exec(id);
  return m ? Number(m[1]) : null;
}

/** The doubled-file marching column the battalion arrives in (Article X's
 * outcome) -- one continuous column, `marchOrder[0]` at the head. */
function stackedColumn(marchOrder, facing, leadOriginX, originY) {
  const behindXSign = facing === 90 ? -1 : 1;
  const positions = [];
  marchOrder.forEach((co, i) => {
    const originX = leadOriginX + i * COMPANY_COLUMN_DEPTH * behindXSign;
    const colPositions = columnOfFiles(localCompany(co), { originX, originY, facing });
    positions.push(...reNamespace(colPositions, co));
  });
  return positions;
}

/** Build a { companyIndex: progress } map: every company before
 * `formingIndex` in `formingOrder` is fully formed (1); the company at
 * `formingIndex` is mid-cascade (`midProgress`); everything after is still
 * waiting in column (0). */
function serialProgress(formingOrder, formingIndex, midProgress = 0.5) {
  const progress = {};
  formingOrder.forEach((co, i) => {
    if (i < formingIndex) progress[co.index] = 1;
    else if (i === formingIndex) progress[co.index] = midProgress;
    else progress[co.index] = 0;
  });
  return progress;
}

export default {
  id: 'form-by-file-into-line',
  title: 'To Form the Battalion, on the Right or Left, by File, into Line of Battle',
  part: 5,
  article: 11,
  caseyParagraphs: [820, 821, 822, 823, 824, 825, 826, 827, 828],
  subMovements: [
    { id: 'right', label: 'On the Right, by File' },
    { id: 'left', label: 'On the Left, by File (Inverse)' },
  ],
  commands: (subMovement) => {
    const side = subMovement === 'left' ? 'left' : 'right';
    return [
      { text: `1. On the ${side}, by file, into line.`, type: 'preparatory' },
      { text: '2. MARCH (or double quick—MARCH).', type: 'execution' },
      { text: 'Guides—POSTS.', type: 'execution' },
    ];
  },
  reenactorNotes:
    '¶822 confirms the same pattern as Article X: each company forms by file into line using the exact existing company-scale formByFile() mechanic (S.C. ¶151, lesson-iv/formByFile.js) unmodified -- there is no battalion-wide file-cascade renumbering. The new battalion-scale wrinkle is concatenation along the width axis, but SERIALIZED IN TIME: "the other companies will follow the movement of the leading company" (¶822) means each company\'s own cascade begins only once the company ahead of it in the column has completed its own -- not a fixed clock, not a spatial trigger, but a company-to-company relay. The left guide of each company except the leading one marks that company\'s own forming boundary on the line the instant its own left file arrives there (¶823). Once the whole line is formed, guides return to their normal posts (¶824) while the colonel oversees the successive formation from the growing line\'s front (¶825) and the lieutenant-colonel assures each guide\'s direction and watches that front-rank men do not overstep the line (¶826). Marching by the left flank instead of the right executes on the same principles, inverse means (¶827) -- modeled here as company 8 (leftmost) leading and forming first, companies 7 down to 1 falling in successively to its right, rather than company 1 leading. ¶828\'s remark that a flank march "in the presence of the enemy is a very objectionable movement" is doctrinal color carried here in text only, not a geometry note. This drill uses discrete per-company progress snapshots (cascadeBlend, as in part-iv/fullDistanceIntoLine.js) rather than re-deriving each company\'s own internal file-group cascade at battalion scale -- the spec explicitly allows this simpler approach; intermediate companies 2-4 (or 5-7) are elided between the shown snapshots for keyframe economy, since every company follows the identical pattern. The color party and field-and-staff are not discussed by this article\'s text at all -- both are held fixed at their eventual line-of-battle posts (computed once, against the final formed line) through every keyframe, a documented simplification rather than a sourced position.',

  buildKeyframes: (_company, subMovement = 'right', battalion = DEFAULT_BATTALION) => {
    const marchFacing = subMovement === 'right' ? 90 : 270;
    const formingOrder =
      subMovement === 'right'
        ? [...battalion].sort((a, b) => a.index - b.index) // company 1 leads
        : [...battalion].sort((a, b) => b.index - a.index); // company 8 leads (¶827 mirror)
    const leadOriginX = subMovement === 'right' ? CANVAS_BATTALION.VIEW_W - 100 : 100;

    const waitingColumn = stackedColumn(formingOrder, marchFacing, leadOriginX, COLUMN_ORIGIN_Y);
    const finalLine = battalionLine(battalion, { originX: LINE_ORIGIN_X, originY: LINE_ORIGIN_Y, facing: 0 });

    // Color party / field-and-staff: fixed at their eventual line-of-battle
    // posts for every keyframe (see reenactorNotes -- not discussed by this
    // article's text).
    const cp = buildColorParty(finalLine, { forwardPaces: 0, atRest: true });
    const fs = buildFieldAndStaff(finalLine, {});

    // Marker points (¶820): the lieutenant-colonel places two markers on the
    // determined line, near the anchoring flank where the leading company
    // will form first.
    const anchorCo = formingOrder[0];
    const anchorCaptain = finalLine.find((p) => p.id === `c${anchorCo.index}-of-cpt`);
    const markerDx = subMovement === 'right' ? -1 : 1;
    const markers = anchorCaptain
      ? [
          { type: 'wheelingPoint', pivotX: anchorCaptain.x, pivotY: anchorCaptain.y - 40 },
          { type: 'wheelingPoint', pivotX: anchorCaptain.x + markerDx * 60, pivotY: anchorCaptain.y - 40 },
        ]
      : [];

    const snapshot = (formingIndex, midProgress) => {
      const progress = serialProgress(formingOrder, formingIndex, midProgress);
      return cascadeBlend(waitingColumn, finalLine, progress, groupOfId);
    };

    const kfMarching = combine(waitingColumn, cp, fs);
    const kfMarkers = kfMarching;
    const kfCo1Forming = combine(snapshot(0, 0.5), cp, fs);
    const kfCo1Done_Co2Forming = combine(snapshot(1, 0.5), cp, fs);
    const kfCo4Done_Co5Forming = combine(snapshot(4, 0.5), cp, fs);
    const kfAllFormed = combine(finalLine, cp, fs);

    const sideWord = subMovement === 'left' ? 'left' : 'right';

    return [
      {
        label: 'Battalion marching by the flank',
        description:
          'The battalion marches by the flank in one continuous doubled-file column (Article X), ready to form line of battle.',
        caseyRef: '¶820',
        duration: 0,
        positions: kfMarching,
        annotations: ['marchArrow'],
      },
      {
        label: 'Lieutenant-colonel places two markers on the line',
        description:
          'Once the colonel has determined the line of battle, the lieutenant-colonel places two markers on it, in conformity with the general line-determining principles (No. 501).',
        caseyRef: '¶820',
        duration: 1000,
        positions: kfMarkers,
        annotations: markers,
      },
      {
        label: `On the ${sideWord}, by file, into line — leading company forms`,
        description:
          `At MARCH, the leading company forms itself on the ${sideWord} by file into line of battle exactly as at company scale (S.C. No. 151): the front-rank man of its first file rests his breast against the marker, and successive file-groups peel off the column and slot in beside him. Its own captain places himself on the line the instant his company's first file arrives there, on that file's right.`,
        caseyRef: '¶821-822',
        duration: 1800,
        positions: kfCo1Forming,
        annotations: [],
      },
      {
        label: 'Leading company formed — next company follows',
        description:
          'The leading company stands fully formed on the line. All the other companies follow the leading company\'s movement, in succession: the next company back in the column now runs its own file-cascade, its resulting line-segment sliding in immediately adjoining the already-formed company. Its own left guide marks its forming boundary the instant its left file reaches the line (¶823).',
        caseyRef: '¶822-823',
        duration: 1800,
        positions: kfCo1Done_Co2Forming,
        annotations: [],
      },
      {
        label: 'Formation continues down the column',
        description:
          'Each company in turn repeats the identical pattern once the company ahead of it completes -- a company-to-company relay, not a fixed clock or spatial trigger. The colonel personally oversees the successive formation, moving along the growing line\'s front; the lieutenant-colonel assures each guide\'s direction in turn.',
        caseyRef: '¶822-826',
        duration: 1800,
        positions: kfCo4Done_Co5Forming,
        annotations: [],
      },
      {
        label: 'Battalion formed in line of battle — Guides, POSTS',
        description:
          'The last company completes its cascade; the battalion now stands in one continuous line of battle, formed company by company, right-to-left (or left-to-right, if by the left flank). Guides return to their normal posts.',
        caseyRef: '¶824, ¶827',
        duration: 1400,
        positions: kfAllFormed,
        annotations: [],
      },
    ];
  },
};
