/**
 * Battalion-scale formation utility functions.
 *
 * Companies are numbered 1–8 from the RIGHT (matching each company's own
 * file-numbering convention). In line of battle the whole battalion is one
 * continuous line of files: company 1's file 20 (its leftmost file) sits
 * immediately beside company 2's file 1 (its rightmost file), same
 * FILE_INTERVAL spacing as within a company — no extra company gap. This
 * matches physical reality (one continuous rank of men) and lets these
 * functions reuse the already-verified per-soldier `lineOfBattle()` from
 * formations.js unmodified, just called once per company at an offset
 * origin, rather than re-deriving file geometry at battalion scale.
 */
import { lineOfBattle, rotatePoint } from './formations.js';
import { SCALE } from '../data/constants.js';

const { FILE_INTERVAL } = SCALE;

/** Unit vector for a facing's "across" axis (same convention used throughout
 * formations.js/BattalionRenderer.js: increasing across = toward file 1 /
 * the right guide's flank). */
function acrossAxis(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

// One company occupies 20 file-slots; consecutive company origins are
// spaced by that full stride so the battalion reads as one unbroken line.
const COMPANY_STRIDE = 20 * FILE_INTERVAL;

/**
 * battalionLine(companies, { originX, originY, facing })
 *
 * Places every soldier of every company in line of battle.
 * originX/Y = position of company 1's file-1 front-rank soldier (the
 * battalion's rightmost individual).
 * facing = direction the battalion faces (0 = north), same convention as
 * the company-level lineOfBattle().
 *
 * Returns a flat array of { id, x, y, facing } for all soldiers in all
 * companies (376 for an 8-company battalion) — the same shape SoldierRenderer
 * and BattalionRenderer both consume.
 */
export function battalionLine(companies, { originX = 480, originY = 300, facing = 0 } = {}) {
  const positions = [];
  companies.forEach((co) => {
    const stride = (co.index - 1) * COMPANY_STRIDE;
    // Company i's origin is stride px to the "left" of company 1's origin,
    // in the direction perpendicular to facing (same rotation convention
    // lineOfBattle uses internally for spreading files left of the anchor).
    const rad = (facing * Math.PI) / 180;
    const coOriginX = originX - stride * Math.cos(rad);
    const coOriginY = originY - stride * Math.sin(rad);
    const coPositions = lineOfBattle(co.soldiers, {
      originX: coOriginX,
      originY: coOriginY,
      facing,
    });
    positions.push(...coPositions);
  });
  return positions;
}

// ---------------------------------------------------------------------------
// COLUMN OF COMPANIES / DIVISIONS
// ---------------------------------------------------------------------------

const COMPANY_FRONT = 19 * FILE_INTERVAL; // one company's front-rank span, file 1 to file 20

/** Spread a unit's companies side by side at a given depth-slot origin,
 * same continuous-line convention as battalionLine(). A "unit" is either a
 * single company ({ soldiers }) or a division ({ companies: [co1, co2] }). */
function placeUnitLine(unit, originX, originY, facing) {
  const companies = unit.companies ?? [unit];
  const { x: ax, y: ay } = acrossAxis(facing);
  const positions = [];
  let stride = 0;
  companies.forEach((co) => {
    positions.push(...lineOfBattle(co.soldiers, {
      originX: originX - stride * ax,
      originY: originY - stride * ay,
      facing,
    }));
    stride += COMPANY_STRIDE;
  });
  return positions;
}

/**
 * columnOfCompanies(units, { originX, originY, facing, distanceMode })
 *
 * Places N units (companies, or divisions of 2 companies each) one behind
 * another in column, analogous to the existing company-scale
 * columnOfPlatoons() in formations.js. Per S.B. ¶117/294/298-299/333, the
 * "distance" between column subdivisions is one of three named intervals,
 * not a formation choice per se -- see battalion-spec/part-third-a.md's Key
 * Definitions:
 *   'full' -- interval = one subdivision's front (a company's full 19-file
 *             span; ¶294)
 *   'half' -- interval = one platoon's front, i.e. half a company's front
 *             (¶298-299)
 *   'mass' -- interval = 6 paces between guides (¶333)
 *
 * originX/Y = position of the LEADING unit's file-1 (rightmost) front-rank
 * soldier. facing = direction of march.
 */
export function columnOfCompanies(units, { originX = 480, originY = 300, facing = 0, distanceMode = 'full' } = {}) {
  let interval;
  if (distanceMode === 'full') interval = COMPANY_FRONT;
  else if (distanceMode === 'half') interval = COMPANY_FRONT / 2;
  else if (distanceMode === 'mass') interval = 6 * SCALE.PACE_PX;
  else throw new Error(`columnOfCompanies: unknown distanceMode "${distanceMode}"`);

  const rad = (facing * Math.PI) / 180;
  const behindX = -Math.sin(rad);
  const behindY = Math.cos(rad);

  const positions = [];
  units.forEach((unit, i) => {
    const depthOffset = i * interval;
    positions.push(...placeUnitLine(
      unit,
      originX + behindX * depthOffset,
      originY + behindY * depthOffset,
      facing
    ));
  });
  return positions;
}

// ---------------------------------------------------------------------------
// ALTERNATING-PIVOT WHEEL (countermarch of a column closed in mass, S.B.
// ¶424-436)
// ---------------------------------------------------------------------------

/**
 * alternatingPivotWheel(positions, subdivisions, { angleDeg })
 *
 * Per S.B. ¶427-428: countermarching a column closed in mass is NOT a
 * sequential relay and does NOT reverse the whole column as one rigid unit.
 * Instead every subdivision (division, i.e. a pair of companies, or a single
 * company in the by-company variant) wheels by file **independently and
 * simultaneously**, alternating pivot flank: odd subdivisions wheel to the
 * LEFT (counter-clockwise) around their own RIGHT guide; even subdivisions
 * wheel to the RIGHT (clockwise) around their own LEFT guide. Each ends up
 * behind its *opposite* guide, net effect a 180 degree in-place reversal.
 *
 * @param {Array} positions - flat { id, x, y, facing } array (e.g. from
 *   battalionLine()), BEFORE the "break two files to the rear" prep step --
 *   that spacing adjustment is drill-specific staging, not part of this
 *   primitive; apply it to `positions` before calling if needed.
 * @param {Array} subdivisions - [{ ids: [...], pivotSide: 'right'|'left' }],
 *   one entry per division/company doing its own wheel. `ids` are the
 *   soldier ids belonging to that subdivision (both companies of a division,
 *   or one company). `pivotSide` picks which of the subdivision's own
 *   current flanks (by across-axis extreme, not a hardcoded soldier id)
 *   serves as the fixed pivot for that subdivision's wheel.
 * @param {Object} opts - { angleDeg = 180 } magnitude of each wheel; sign is
 *   derived per-subdivision from pivotSide (right-pivot -> wheel left/CCW;
 *   left-pivot -> wheel right/CW), matching S.B. ¶428.
 * @returns {Array} new positions with each subdivision's members rotated
 *   independently about their own pivot.
 */
export function alternatingPivotWheel(positions, subdivisions, { angleDeg = 180 } = {}) {
  const posMap = new Map(positions.map((p) => [p.id, p]));
  const rotatedById = new Map();

  subdivisions.forEach(({ ids, pivotSide }) => {
    const members = ids.map((id) => posMap.get(id)).filter(Boolean);
    if (!members.length) return;

    const facing = members[0].facing;
    const { x: ax, y: ay } = acrossAxis(facing);
    const acrossVals = members.map((p) => p.x * ax + p.y * ay);
    const rightMember = members[acrossVals.indexOf(Math.max(...acrossVals))]; // largest across = right guide's flank
    const leftMember = members[acrossVals.indexOf(Math.min(...acrossVals))];
    const pivot = pivotSide === 'right' ? rightMember : leftMember;
    // Right-guide pivot -> wheel left (CCW, negative per this engine's
    // "positive = clockwise" convention, see formations.js's wheel()).
    const signedAngle = pivotSide === 'right' ? -angleDeg : angleDeg;

    ids.forEach((id) => {
      const p = posMap.get(id);
      if (!p) return;
      const rotated = rotatePoint(p.x, p.y, pivot.x, pivot.y, signedAngle);
      rotatedById.set(id, {
        ...p,
        x: rotated.x,
        y: rotated.y,
        facing: (p.facing + signedAngle + 360) % 360,
      });
    });
  });

  return positions.map((p) => rotatedById.get(p.id) ?? p);
}

// ---------------------------------------------------------------------------
// DIVISION LINE FROM ANCHOR (deployment of a column into line of battle,
// S.B. Part Fourth Art. IV, ¶555-647 -- front/rear/interior anchor cases)
// ---------------------------------------------------------------------------

/**
 * divisionLineFromAnchor(divisionsInFinalOrder, anchorIndex, opts)
 *
 * Places a battalion's divisions (or companies) side by side in line of
 * battle, anchored so the division at `anchorIndex` sits at a fixed point,
 * and every other division is placed relative to it by its position in
 * `divisionsInFinalOrder` (the FINAL line order, left-to-right by battalion
 * convention -- NOT the column marching order). This is the shared geometry
 * underlying all three deployment cases in S.B. Art. IV: front-division
 * anchor (¶558-579, all other divisions peel to one side), rear-division
 * anchor (¶591-610, the mirror), and interior-division anchor (¶621-631,
 * divisions split and peel to BOTH sides of the anchor simultaneously) --
 * the anchor's position within the order determines which of these it is;
 * the placement math is identical in all three cases.
 *
 * @param {Array} divisionsInFinalOrder - [{ companies: [...] }, ...] each
 *   entry a division (or single company) with its own `.soldiers` per
 *   company, in left-to-right FINAL line order.
 * @param {number} anchorIndex - index into divisionsInFinalOrder of the
 *   division that stays fixed at the given origin.
 * @param {Object} opts - { originX, originY, facing } position/facing of the
 *   anchor division's own file-1 (rightmost) front-rank soldier.
 * @returns {Array} flat { id, x, y, facing } for every soldier in every
 *   division, laid out as one continuous line.
 */
export function divisionLineFromAnchor(divisionsInFinalOrder, anchorIndex, { originX = 480, originY = 300, facing = 0 } = {}) {
  const positions = [];
  const { x: ax, y: ay } = acrossAxis(facing);

  // Companies within each division keep their own internal order (as given);
  // walk divisions left-to-right, accumulating each division's file-width so
  // consecutive divisions abut with no extra gap (mirrors battalionLine's
  // continuous-line convention).
  let strideFromAnchor = 0;
  for (let i = anchorIndex; i < divisionsInFinalOrder.length; i++) {
    const division = divisionsInFinalOrder[i];
    const companies = division.companies ?? [division];
    let localStride = strideFromAnchor;
    companies.forEach((co) => {
      const coOriginX = originX - localStride * ax;
      const coOriginY = originY - localStride * ay;
      positions.push(...lineOfBattle(co.soldiers, { originX: coOriginX, originY: coOriginY, facing }));
      localStride += COMPANY_STRIDE;
    });
    strideFromAnchor = localStride;
  }
  // Divisions to the left of the anchor (index < anchorIndex): walk backward
  // from the anchor's own origin, so they end up on the anchor's left flank.
  strideFromAnchor = 0;
  for (let i = anchorIndex - 1; i >= 0; i--) {
    const division = divisionsInFinalOrder[i];
    const companies = division.companies ?? [division];
    // This division's rightmost company is adjacent to the previous
    // division's leftmost company; walk its companies right-to-left so the
    // first one placed is the one nearest the anchor side.
    for (let c = companies.length - 1; c >= 0; c--) {
      strideFromAnchor += COMPANY_STRIDE;
      const co = companies[c];
      const coOriginX = originX + strideFromAnchor * ax;
      const coOriginY = originY + strideFromAnchor * ay;
      positions.push(...lineOfBattle(co.soldiers, { originX: coOriginX, originY: coOriginY, facing }));
    }
  }
  return positions;
}

/**
 * cascadeBlend(waitingPositions, finalPositions, progressByGroupId, groupOfId)
 *
 * General staged-reveal helper: blends each soldier's position between a
 * "waiting" state (e.g. still in column, not yet turned onto the line) and
 * its "final" settled state, using a per-GROUP progress value (0 = fully
 * waiting, 1 = fully arrived) rather than a single global progress -- so
 * groups on either side of an interior anchor (S.B. ¶621-631) can converge
 * at independent rates/timings within the same keyframe, which a single
 * global blend factor could not express. `groupOfId(id)` maps a soldier id
 * to whichever group key `progressByGroupId` is keyed on (e.g. division
 * index); soldiers whose group isn't in `progressByGroupId` default to
 * progress 1 (fully arrived) so callers only need to specify in-flight
 * groups.
 */
export function cascadeBlend(waitingPositions, finalPositions, progressByGroupId, groupOfId) {
  const waitingMap = new Map(waitingPositions.map((p) => [p.id, p]));
  return finalPositions.map((final) => {
    const groupKey = groupOfId(final.id);
    const t = progressByGroupId[groupKey] ?? 1;
    if (t >= 1) return final;
    const waiting = waitingMap.get(final.id) ?? final;
    if (t <= 0) return waiting;
    // Facing interpolates the short way, matching SoldierRenderer's own
    // rotation convention, so a group mid-turn doesn't visually spin the
    // long way around.
    const df = (((final.facing - waiting.facing + 540) % 360) - 180) * t;
    return {
      ...final,
      x: waiting.x + (final.x - waiting.x) * t,
      y: waiting.y + (final.y - waiting.y) * t,
      facing: (waiting.facing + df + 360) % 360,
    };
  });
}
