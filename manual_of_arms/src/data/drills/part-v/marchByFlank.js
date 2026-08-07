import { columnOfFiles, undoubleFiles } from '../../../engine/formations.js';
import { battalionLine } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION, COLOR_COMPANY_INDEX } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';
import { buildColorParty, buildFieldAndStaff } from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article X (S.B. ¶805-819): "To march by the flank."
//
// THE FILE-DOUBLING-SCALING QUESTION (battalion-spec/part-fifth-b.md, Article
// X complexity notes): Casey does NOT re-number files across the battalion.
// ¶806 states generically, once, that "the captains and covering sergeants"
// (plural -- all 8 companies) place themselves per S.C. Nos. 138/143 -- i.e.
// each company independently doubles its own files using the exact existing
// company-scale mechanic (this project's `doubleFiles()`/`columnOfFiles()`,
// already implemented at lesson-iv/marchByFlank.js). The only genuinely new
// battalion-scale wrinkle is CONCATENATION (¶809): the 8 companies' doubled
// columns chain head-to-tail into ONE continuous depth-stacked column, not 8
// side-by-side columns -- captains mark the seam beside "the covering
// sergeant of the company preceding [theirs]."
//
// MARCH-ORDER INTERPRETIVE CHOICE: ¶808-809 state explicitly, for a LEFT
// face: the sergeant on the LEFT of the battalion (leftmost company's own
// left-guide NCO) marks the TAIL of the whole column, while the RIGHTMOST
// company's (company 1's) covering sergeant marks the HEAD/leading edge. So
// for a left-flank face/march, company 1 (rightmost) leads and company 8
// (leftmost) trails. Per ¶800's general inversion rule used throughout this
// range ("same principles, inverse means"), a RIGHT-flank face/march is
// taken as the mirror: company 8 (leftmost) leads, company 1 (rightmost)
// trails. This is stated directly, not re-derived from raw source.
//
// STACKING GEOMETRY: each company's own doubled-file column spans 11 depth
// groups (head pair + 9 doubled pairs + lone file 20) at DEPTH_SPACING (2 x
// FILE_INTERVAL = 20px) apart, i.e. 220px deep -- see columnOfFiles() in
// engine/formations.js. Companies are stacked at that same 220px pitch, so
// company N+1's head (depth 0, its own captain/sergeant pair) sits exactly
// one DEPTH_SPACING behind company N's last group (file 20, at depth index
// 10) -- a seamless, gapless, non-overlapping continuous column, matching
// ¶809's "captain marks the seam" language.
//
// COLOR PARTY / FIELD-AND-STAFF: Casey's text in this article only speaks to
// the lieutenant-colonel and senior major's marching posts (¶812, abreast
// the leading file / color-file, ~6 paces off) -- the color party itself is
// not discussed at all for a flank march. Per this project's judgment call:
// the color party and colonel/junior major are held at their halted Article-
// I-style posts for every keyframe (a documented simplification, not a
// sourced position), while the lieutenant-colonel and senior major are
// repositioned once the column has closed up, per ¶812.
// ---------------------------------------------------------------------------

const { FILE_INTERVAL, PACE_PX } = SCALE;
const DEPTH_SPACING = 2 * FILE_INTERVAL; // 20px -- columnOfFiles' own depth pitch
const GROUPS_PER_COMPANY = 11; // head pair + 9 doubled pairs + lone file 20
const COMPANY_COLUMN_DEPTH = GROUPS_PER_COMPANY * DEPTH_SPACING; // 220px

const LINE_ORIGIN_X = CANVAS_BATTALION.VIEW_W - 60;
const LINE_ORIGIN_Y = 90;
const COLUMN_ORIGIN_Y = 260;
const STEP_OFF_PACES = 10;

function combine(soldiers, colorParty, fieldStaff) {
  return [...soldiers, ...colorParty, ...fieldStaff];
}

/** Strip the battalion namespace ("c3-") from a company's soldier ids so the
 * company-scale formations.js helpers (which key off literal ids like
 * 'of-cpt'/'nc-cov') work unmodified per company -- the reuse this article's
 * spec calls for. */
function localCompany(co) {
  const prefix = `c${co.index}-`;
  return co.soldiers.map((s) => ({ ...s, id: s.id.slice(prefix.length) }));
}
function reNamespace(positions, co) {
  const prefix = `c${co.index}-`;
  return positions.map((p) => ({ ...p, id: `${prefix}${p.id}` }));
}

function acrossAxis(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

/** ¶809: LEFT face -> company 1 (rightmost) leads, company 8 trails.
 * RIGHT face (mirror, ¶800's general inversion rule) -> company 8 leads,
 * company 1 trails. */
function marchOrderFor(subMovement, battalion) {
  const byIndex = [...battalion].sort((a, b) => a.index - b.index);
  return subMovement === 'left' ? byIndex : [...byIndex].reverse();
}

/** Build the one continuous, depth-stacked battalion column. `leadOriginX`
 * is the leading company's own head-pair anchor; each subsequent company in
 * `marchOrder` is offset one COMPANY_COLUMN_DEPTH further "behind" (opposite
 * the direction of march). */
function stackedColumn(marchOrder, facing, leadOriginX, originY) {
  const behindXSign = facing === 90 ? -1 : 1; // east march trails west (-x); west march trails east (+x)
  const positions = [];
  marchOrder.forEach((co, i) => {
    const originX = leadOriginX + i * COMPANY_COLUMN_DEPTH * behindXSign;
    const colPositions = columnOfFiles(localCompany(co), { originX, originY, facing });
    positions.push(...reNamespace(colPositions, co));
  });
  return positions;
}

function translateAll(positions, dx, dy) {
  return positions.map((p) => ({ ...p, x: p.x + dx, y: p.y + dy }));
}

/** Lieutenant-colonel / senior major posts once the column is closed (¶812):
 * abreast the leading file, and abreast the color-file, both ~6 paces off on
 * the front-rank side (the negative-across direction, away from the
 * file-closer offset already used by doubleFiles()/columnOfFiles()). */
function marchingStaffOverrides(columnPositions, marchOrder, facing) {
  const { x: ax, y: ay } = acrossAxis(facing);
  const sixPaces = 6 * PACE_PX;
  const offX = -ax * sixPaces;
  const offY = -ay * sixPaces;

  const leadCo = marchOrder[0];
  const leadHead = columnPositions.find((p) => p.id === `c${leadCo.index}-nc-cov`);
  const colorHead = columnPositions.find((p) => p.id === `c${COLOR_COMPANY_INDEX}-nc-cov`);

  const overrides = {};
  if (leadHead) overrides['fs-ltc'] = { x: leadHead.x + offX, y: leadHead.y + offY, facing };
  if (colorHead) overrides['fs-smaj'] = { x: colorHead.x + offX, y: colorHead.y + offY, facing };
  return overrides;
}

export default {
  id: 'march-by-flank',
  title: 'To March by the Flank',
  part: 5,
  article: 10,
  caseyParagraphs: [805, 806, 807, 808, 809, 810, 811, 812, 813, 814, 815, 816, 817, 818, 819],
  subMovements: [
    { id: 'left', label: 'By the Left Flank' },
    { id: 'right', label: 'By the Right Flank (Inverse)' },
  ],
  commands: (subMovement) => {
    const side = subMovement === 'right' ? 'Right' : 'Left';
    return [
      { text: '1. Battalion.', type: 'preparatory' },
      { text: `2. ${side}—FACE.`, type: 'execution' },
      { text: '3. Forward.', type: 'preparatory' },
      { text: '4. MARCH (or double quick—MARCH).', type: 'execution' },
      { text: `5. By file ${side.toLowerCase()} (or ${side === 'Left' ? 'right' : 'left'}). MARCH.`, type: 'execution' },
      { text: '6. Battalion. HALT. FRONT.', type: 'execution' },
    ];
  },
  reenactorNotes:
    'Casey never renumbers files across the battalion for a flank march (¶806): every company independently doubles its own files, reusing the exact company-scale mechanic already built for lesson-iv/marchByFlank.js (S.C. ¶138/143, S.S. ¶363), unmodified. The only battalion-scale novelty is concatenation (¶809): the 8 companies chain head-to-tail into one continuous column, each captain marking the seam beside the covering sergeant of the company preceding his own. For a LEFT face, company 1 (rightmost) leads and company 8 (leftmost) trails -- marked, per ¶808, by "the sergeant on the left of the battalion" at the very tail; a RIGHT face is the mirror (company 8 leads). At MARCH (¶810) the leading sergeant sets cadence and direction by ground points. Lieutenant-colonel takes post abreast the leading file, senior major abreast the color-file (company 5 here, per COLOR_COMPANY_INDEX), both about 6 paces off on the front-rank side (¶812); the junior major\'s post (¶812, "No. 94") and the adjutant/sergeant-major\'s posts between them (¶813) are out of this paragraph range and not modeled -- this project has no adjutant/sergeant-major roster ids yet (see battalion.js), and the junior major is left at his Article-I-style halted post rather than invented a new one. The color party is likewise not repositioned by this article\'s text at all; it is held fixed at its halted post through every keyframe -- a documented simplification, not a Casey-sourced position. Captains and file closers continually watch that files neither open nor close and regain lost distances (¶814). "By file right (or left), MARCH" (¶815-816) wheels the column in succession at a single fixed point, "conforming to the principles of the school of the company" -- shown here as an illustrative snapshot of the leading company\'s head pair turning, not a fully traced per-file relay. Halting (¶817-818) and forming back into line (¶819) reuse School-of-Company mechanics wholesale (S.C. No. 148 and the by-file-into-line family) -- shown as each company undoubling in place, which reproduces the original line-of-battle orientation faithfully but leaves ~30px seams between companies (220px column pitch vs. each company\'s own 190px reformed width) rather than the perfectly continuous line of the opening keyframe; a documented simplification, not a new geometry primitive.',

  buildKeyframes: (_company, subMovement = 'left', battalion = DEFAULT_BATTALION) => {
    const marchFacing = subMovement === 'left' ? 270 : 90;
    const marchOrder = marchOrderFor(subMovement, battalion);
    const leadOriginX = subMovement === 'left' ? 100 : CANVAS_BATTALION.VIEW_W - 100;

    // 1. Battalion in line of battle, halted, facing front.
    const inLine = battalionLine(battalion, { originX: LINE_ORIGIN_X, originY: LINE_ORIGIN_Y, facing: 0 });
    const cpAtRest = buildColorParty(inLine, { forwardPaces: 0, atRest: true });
    const fsAtRest = buildFieldAndStaff(inLine, {});

    // 2. Right (or left)-FACE: every soldier turns in place, no displacement.
    const faced = inLine.map((s) => ({ ...s, facing: marchFacing }));
    const cpFaced = cpAtRest.map((s) => ({ ...s, facing: marchFacing }));
    const fsFaced = fsAtRest.map((s) => ({ ...s, facing: marchFacing }));

    // 3. Captains/covering sergeants place themselves; files double and the
    //    battalion closes into one continuous column (¶806-809).
    const closedColumn = stackedColumn(marchOrder, marchFacing, leadOriginX, COLUMN_ORIGIN_Y);
    const closedOverrides = marchingStaffOverrides(closedColumn, marchOrder, marchFacing);
    const fsClosed = buildFieldAndStaff(closedColumn, closedOverrides);

    // 4. Forward, MARCH -- the whole column steps off together.
    const marchDist = STEP_OFF_PACES * PACE_PX;
    const dxStep = marchFacing === 90 ? marchDist : -marchDist;
    const marching = translateAll(closedColumn, dxStep, 0);
    const marchingOverrides = marchingStaffOverrides(marching, marchOrder, marchFacing);
    const fsMarching = buildFieldAndStaff(marching, marchingOverrides);

    // 5. "By file right (or left), MARCH" -- illustrative: the leading
    //    company's own head pair, having reached a fixed wheeling point,
    //    turns onto the new line of march while the rest of the column is
    //    still approaching it (¶815-816, S.C. by-file-wheel principle).
    const leadCo = marchOrder[0];
    const leadIds = new Set(leadCo.soldiers.map((s) => s.id));
    const wheelAngle = subMovement === 'left' ? -90 : 90;
    const wheelPivot = marching.find((p) => p.id === `c${leadCo.index}-nc-cov`);
    const wheeling = marching.map((p) => {
      if (!leadIds.has(p.id) || !wheelPivot) return p;
      const rad = (wheelAngle * Math.PI) / 180;
      const cos = Math.cos(rad);
      const sin = Math.sin(rad);
      const dx = p.x - wheelPivot.x;
      const dy = p.y - wheelPivot.y;
      return {
        ...p,
        x: wheelPivot.x + dx * cos - dy * sin,
        y: wheelPivot.y + dx * sin + dy * cos,
        facing: (p.facing + wheelAngle + 360) % 360,
      };
    });

    // 6. Battalion, HALT, FRONT -- each company undoubles in place,
    //    reproducing the original line-of-battle orientation (¶817-819).
    const halted = [];
    marchOrder.forEach((co) => {
      const local = localCompany(co);
      const localMarching = local.map((soldier) => {
        const p = marching.find((mp) => mp.id === `c${co.index}-${soldier.id}`);
        return { id: soldier.id, x: p.x, y: p.y, facing: p.facing };
      });
      const undoubled = undoubleFiles(localMarching, local);
      halted.push(...reNamespace(undoubled, co));
    });

    return [
      {
        label: 'Battalion in line of battle, halted',
        description:
          'The battalion stands in line of battle, halted and faced to the front, ready for the colonel\'s command.',
        caseyRef: '¶805',
        duration: 0,
        positions: combine(inLine, cpAtRest, fsAtRest),
        annotations: [],
      },
      {
        label: `Battalion — ${subMovement === 'right' ? 'Right' : 'Left'}-FACE`,
        description:
          'At the command of execution, every soldier faces by the flank in place. Every company\'s own captain and covering sergeant place themselves exactly per S.C. Nos. 138 and 143, as if forming their own company column.',
        caseyRef: '¶806',
        duration: 700,
        positions: combine(faced, cpFaced, fsFaced),
        annotations: [],
      },
      {
        label: 'Files double — the battalion closes into one continuous column',
        description:
          'Each company independently doubles its own files (S.C. ¶138/143, S.S. ¶363). The genuinely new wrinkle at battalion scale: the 8 doubled-file blocks chain head to tail into a single unbroken column, each captain marking the seam beside the covering sergeant of the company preceding his own.',
        caseyRef: '¶806-809',
        duration: 1600,
        positions: combine(closedColumn, cpFaced, fsClosed),
        annotations: ['fileNumbers'],
      },
      {
        label: 'Forward — MARCH',
        description:
          'The column steps off as one body. The leading sergeant sets the cadence and holds a straight line of march by ground points; the lieutenant-colonel marches abreast the leading file, the senior major abreast the color-file, both about 6 paces off.',
        caseyRef: '¶810, ¶812',
        duration: 2200,
        positions: combine(marching, cpFaced, fsMarching),
        annotations: ['marchArrow'],
      },
      {
        label: `By file ${subMovement === 'right' ? 'right' : 'left'} — MARCH`,
        description:
          'To change the head of the column\'s direction, files wheel in succession, all at the spot where the first file wheeled, "conforming to the principles prescribed in the school of the company."',
        caseyRef: '¶815-816',
        duration: 1800,
        positions: combine(wheeling, cpFaced, fsMarching),
        annotations: ['wheelingArc'],
      },
      {
        label: 'Battalion — HALT, FRONT',
        description:
          'Halting is executed exactly as School of Company No. 148. To resume line of battle, each company undoubles its files and fronts, per the by-file-into-line family of commands already covered at company scale.',
        caseyRef: '¶817-819',
        duration: 1400,
        positions: combine(halted, cpFaced, fsMarching),
        annotations: [],
      },
    ];
  },
};
