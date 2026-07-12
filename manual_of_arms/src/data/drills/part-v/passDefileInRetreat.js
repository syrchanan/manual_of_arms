import { columnOfFiles, columnOfPlatoons } from '../../../engine/formations.js';
import { battalionLine } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';
import { buildColorParty, buildFieldAndStaff } from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article IX (S.B. ¶788-804, incl. Remarks ¶802-804): "To pass a
// defile, in retreat, by the right or left flank."
//
// STRUCTURE (battalion-spec/part-fifth-b.md's complexity notes): every
// company, one after another -- starting always with the 1st company
// regardless of which flank the defile is on (¶790, ¶792) -- executes the
// same sequence: face toward the defile flank, march to a fixed pivot point,
// wheel onto the line of march, and queue up behind the company ahead of it,
// forming ONE continuous column converging on the defile-entry marker. Once
// near the marker, each company (in the same order) converts its flank
// column into a column of platoons and turns into the defile itself; once
// clear, it re-forms per S.C. No. 278 (breakPlatoons/formOnRightLeft,
// already implemented at company scale elsewhere in this project).
//
// GEOMETRY SIMPLIFICATION (documented, not a re-derivation of ¶790-791's
// literal path): the source text has the 1st company's captain execute a
// small reversing loop -- right-face, march to the rear past the file
// closers, wheel right again, THEN head toward the (in the worked example)
// LEFT flank where the defile actually is. The net effect of that loop is
// simply "the company ends up facing and marching toward the defile flank,
// queued behind whichever company is already in that column." This drill
// shows companies facing directly toward the defile flank and marching
// straight to the queue, using the same per-company doubleFiles()-based
// flank-column mechanic already built for marchByFlank.js (Article X) --
// the endpoint and company-to-company sequencing are preserved; the
// intermediate rearward loop is not individually traced.
//
// Company order is always 1, 2, ... 8 (never reversed), per ¶790/792's
// explicit "starting with the 1st company" -- unlike Article X, where the
// leading company depends on which flank is faced.
// ---------------------------------------------------------------------------

const { FILE_INTERVAL, PACE_PX } = SCALE;
const DEPTH_SPACING = 2 * FILE_INTERVAL; // 20px -- columnOfFiles' own depth pitch
const GROUPS_PER_COMPANY = 11;
const COMPANY_COLUMN_DEPTH = GROUPS_PER_COMPANY * DEPTH_SPACING; // 220px

const LINE_ORIGIN_X = CANVAS_BATTALION.VIEW_W - 60;
const LINE_ORIGIN_Y = 120;
const QUEUE_ORIGIN_Y = 380;
// 15-20 paces (¶789) compressed for on-screen legibility, mirroring
// advanceInLine.js's STAFF_SCALE precedent for large staged distances.
const MARKER_PACES_TRUE = 18;
const MARKER_PACES_SHOWN = 6;

function combine(soldiers, colorParty, fieldStaff) {
  return [...soldiers, ...colorParty, ...fieldStaff];
}

function localCompany(co) {
  const prefix = `c${co.index}-`;
  return co.soldiers.map((s) => ({ ...s, id: s.id.slice(prefix.length) }));
}
function reNamespace(positions, co) {
  const prefix = `c${co.index}-`;
  return positions.map((p) => ({ ...p, id: `${prefix}${p.id}` }));
}
function idsOfCompany(co) {
  return co.soldiers.map((s) => s.id);
}

/** The queue of companies already converged on the defile-entry marker,
 * facing the defile flank, chained head-to-tail exactly as in Article X's
 * marchByFlank.js. Company 1 (first to depart) sits closest to the marker;
 * company 8 furthest. */
function queueColumn(units, facing, markerX, originY) {
  const behindXSign = facing === 90 ? -1 : 1;
  const positions = [];
  units.forEach((co, i) => {
    const originX = markerX + i * COMPANY_COLUMN_DEPTH * behindXSign;
    const colPositions = columnOfFiles(localCompany(co), { originX, originY, facing });
    positions.push(...reNamespace(colPositions, co));
  });
  return positions;
}

/** Substitute the leading `arrivedCount` companies' positions with their
 * already-queued counterparts; the rest stay waiting in line. Same pattern
 * as part-iii/changeDirectionHalf.js's cascadeSnapshot(). */
function cascadeSnapshot(waiting, arrivedMap, units, arrivedCount) {
  const arrivedIds = new Set(units.slice(0, arrivedCount).flatMap(idsOfCompany));
  return waiting.map((p) => (arrivedIds.has(p.id) ? arrivedMap.get(p.id) ?? p : p));
}

export default {
  id: 'pass-defile-in-retreat',
  title: 'To Pass a Defile, in Retreat, by the Right or Left Flank',
  part: 5,
  article: 9,
  caseyParagraphs: [788, 789, 790, 791, 792, 793, 794, 795, 796, 797, 798, 799, 800, 801],
  subMovements: [
    { id: 'left', label: 'Defile in Rear of the Left Flank' },
    { id: 'right', label: 'Defile in Rear of the Right Flank (Inverse)' },
  ],
  commands: [
    { text: 'To the rear, by the right (or left) flank, pass the defile.', type: 'preparatory' },
    { text: '1. [Company], right (or left)—FACE.', type: 'execution' },
    { text: '2. MARCH (or double quick—MARCH).', type: 'execution' },
  ],
  reenactorNotes:
    'Every company, one after another -- always starting with the 1st company regardless of which flank the defile is on (¶790, ¶792) -- faces toward the defile flank, marches to a fixed pivot, and queues up behind the company ahead of it, chaining into one continuous column converging on the defile-entry marker, placed 15-20 paces behind the file-closer rank (¶789, shown compressed on screen -- see MARKER_PACES_TRUE/SHOWN). This drill simplifies ¶790-791\'s literal path: the source has the 1st company\'s captain execute a small reversing loop (right-face, march to the rear past the file closers, wheel right again, then head toward the defile flank) whose net effect is simply "face and march toward the defile flank, queued behind the column already forming" -- that endpoint and the strict company-to-company sequencing are preserved here; the intermediate rearward loop itself is not individually traced, reusing instead the same per-company doubleFiles()-based flank-column mechanic already built for Article X (marchByFlank.js). Once a company\'s whole body is on the same line and direction as the one ahead of it, it converts its flank column into a column of platoons (¶793, reusing S.C.\'s platoon-ploy mechanic -- columnOfPlatoons()), and the leading platoon turns into the defile at the marker (¶796); the battalion thus passes by platoon. If the defile were too narrow even for a platoon front, it passes by file instead (¶801) -- not separately animated, noted here only. Companies re-form as they clear the defile "by the means indicated, S.C. No. 278, and following" -- breakPlatoons()/formOnRightLeft(), already implemented at company scale in this project\'s Lesson VI -- shown here only as a final descriptive keyframe (battalion reassembled beyond the defile), not re-derived in full per-company detail. Color party and field-and-staff are not discussed by this article\'s text; both are held fixed at their halted line-of-battle posts through every keyframe, a documented simplification. The skirmisher-passage remarks (¶802-804) are out of scope -- no skirmisher companies are modeled in this project.',

  buildKeyframes: (_company, subMovement = 'left', battalion = DEFAULT_BATTALION) => {
    const defileFacing = subMovement === 'left' ? 270 : 90; // companies face/march toward this flank
    const units = [...battalion].sort((a, b) => a.index - b.index); // always company 1 first (¶790/792)

    const waiting = battalionLine(battalion, { originX: LINE_ORIGIN_X, originY: LINE_ORIGIN_Y, facing: 0 });
    const cp = buildColorParty(waiting, { forwardPaces: 0, atRest: true });
    const fs = buildFieldAndStaff(waiting, {});

    // Marker: 15-20 paces (compressed) behind the file-closer rank, at the
    // pivot point near the defile flank.
    const flankFile = subMovement === 'left'
      ? waiting.find((p) => p.id === `c${battalion.length}-fr-20`) // leftmost individual
      : waiting.find((p) => p.id === 'c1-of-cpt'); // rightmost individual
    const markerY = LINE_ORIGIN_Y + MARKER_PACES_SHOWN * PACE_PX;
    const markerX = flankFile ? flankFile.x : LINE_ORIGIN_X;
    const marker = { type: 'wheelingPoint', pivotX: markerX, pivotY: markerY };

    const arrivedColumn = queueColumn(units, defileFacing, markerX, QUEUE_ORIGIN_Y);
    const arrivedMap = new Map(arrivedColumn.map((p) => [p.id, p]));

    const snap1 = cascadeSnapshot(waiting, arrivedMap, units, 1);
    const snap4 = cascadeSnapshot(waiting, arrivedMap, units, 4);
    const snap7 = cascadeSnapshot(waiting, arrivedMap, units, 7);

    // Leading company converts to a column of platoons near the marker and
    // turns into the defile (¶793, ¶796) -- illustrative, company 1 only.
    const leadCo = units[0];
    const leadPlatoons = columnOfPlatoons(localCompany(leadCo), {
      originX: markerX,
      originY: QUEUE_ORIGIN_Y - 60,
      facing: defileFacing,
    });
    const leadPlatoonsNamespaced = reNamespace(leadPlatoons, leadCo);
    const leadIds = new Set(idsOfCompany(leadCo));
    const withLeadPlatoons = arrivedColumn.map((p) =>
      leadIds.has(p.id) ? leadPlatoonsNamespaced.find((lp) => lp.id === p.id) ?? p : p
    );

    // Beyond the defile: battalion reassembled in line, per S.C. No. 278 and
    // following (not re-derived in per-company detail here).
    const reformed = battalionLine(battalion, {
      originX: LINE_ORIGIN_X,
      originY: QUEUE_ORIGIN_Y + 160,
      facing: 0,
    });
    const cpReformed = buildColorParty(reformed, { forwardPaces: 0, atRest: true });
    const fsReformed = buildFieldAndStaff(reformed, {});

    return [
      {
        label: 'Battalion halted, faced front — defile discovered',
        description:
          `The battalion, retiring in line, halts and fronts on encountering a defile in rear of the ${subMovement === 'left' ? 'left' : 'right'} flank. The colonel places a marker 15-20 paces behind the file-closer rank at the defile's entry pivot.`,
        caseyRef: '¶788-789',
        duration: 0,
        positions: combine(waiting, cp, fs),
        annotations: [marker],
      },
      {
        label: '1st company faces and begins its passage',
        description:
          'The 1st company\'s captain commands right (or left)-FACE, MARCH. The company faces toward the defile flank and marches to the fixed pivot; every other file of the company wheels in succession at that same spot.',
        caseyRef: '¶790-791',
        duration: 1600,
        positions: combine(snap1, cp, fs),
        annotations: [marker],
      },
      {
        label: 'Companies continue passing, one after another',
        description:
          'Each subsequent company\'s captain times his own MARCH so his company\'s first file immediately follows the previous company\'s last file, without needing to match its exact step -- chaining into one continuous column converging on the marker.',
        caseyRef: '¶792',
        duration: 1800,
        positions: combine(snap4, cp, fs),
        annotations: [marker],
      },
      {
        label: 'Most of the battalion has passed into column',
        description:
          'As each company comes onto the same direction line as the one ahead of it, that leading company forms itself by platoon into column, and the guide of its 1st platoon directs himself on the entry marker.',
        caseyRef: '¶793-795',
        duration: 1800,
        positions: combine(snap7, cp, fs),
        annotations: [marker],
      },
      {
        label: 'Leading company forms by platoon and turns into the defile',
        description:
          'The leading company\'s two platoons, formed in column, turn left (or right) at the entry marker and pass into the defile; every following company\'s 1st platoon executes this same turn at the same point. Rearmost companies, not yet formed by platoon, leave room on the flank for this maneuver.',
        caseyRef: '¶796-797',
        duration: 1800,
        positions: combine(withLeadPlatoons, cp, fs),
        annotations: [marker],
      },
      {
        label: 'Battalion reassembled beyond the defile',
        description:
          'As the column head clears the defile and reaches the colonel\'s desired distance, companies re-form into line of battle by the means indicated, S.C. No. 278 and following (already implemented at company scale), either continuing the advance direction or facing to the rear, at the colonel\'s discretion.',
        caseyRef: '¶797-798',
        duration: 1600,
        positions: combine(reformed, cpReformed, fsReformed),
        annotations: [],
      },
    ];
  },
};
