/**
 * Formation utility functions.
 * All return arrays of { id, x, y, facing } for every soldier.
 * Facing: 0 = toward top of screen (north), 90 = right (east),
 *         180 = down (south), 270 = left (west).
 *
 * Files are numbered 1–20 from the RIGHT (Casey's convention).
 * The rightmost file (1) is the guide-right anchor.
 * On screen, right of company = larger x values.
 */

import { SCALE } from '../data/constants.js';

const { FILE_INTERVAL, RANK_GAP, FILE_CLOSER_GAP, SOLDIER_W, SOLDIER_H } = SCALE;

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Convert facing degrees to radians */
export function deg2rad(deg) {
  return (deg * Math.PI) / 180;
}

/**
 * Rotate a point (px, py) around pivot (cx, cy) by angle degrees.
 */
export function rotatePoint(px, py, cx, cy, angleDeg) {
  const rad = deg2rad(angleDeg);
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const nx = cos * (px - cx) - sin * (py - cy) + cx;
  const ny = sin * (px - cx) + cos * (py - cy) + cy;
  return { x: nx, y: ny };
}

/**
 * Build a translate-only position map: shift all soldiers by (dx, dy).
 */
export function translate(positions, { dx = 0, dy = 0 }) {
  return positions.map((s) => ({ ...s, x: s.x + dx, y: s.y + dy }));
}

// ---------------------------------------------------------------------------
// LINE OF BATTLE
// ---------------------------------------------------------------------------

/**
 * lineOfBattle(company, { originX, originY, facing })
 *
 * Places 47 soldiers in line of battle.
 * originX/Y = position of the RIGHTMOST file, front rank soldier (captain).
 * facing = direction the company faces (0 = north).
 * The right flank (file 1) is always the anchor; a guide-left presentation
 * is a drill-level concern (annotations/keyframes), not a geometry change.
 *
 * On screen (facing = 0 / north):
 *   - Files spread LEFT (decreasing x) from the captain.
 *   - Rear rank is BELOW (+y) the front rank.
 *   - File closers are further below.
 */
export function lineOfBattle(company, { originX = 480, originY = 400, facing = 0 } = {}) {
  const positions = company.map((soldier) => {
    const fileIndex = soldier.file - 1; // 0-based from right

    // x: spread left from captain (file 0 = rightmost)
    const localX = -fileIndex * FILE_INTERVAL;

    // y: front rank at 0, rear rank below, file closers further below
    let localY;
    if (soldier.rank === 'front') {
      localY = 0;
    } else if (soldier.rank === 'rear') {
      localY = RANK_GAP;
    } else {
      // fileCloser
      localY = RANK_GAP + FILE_CLOSER_GAP;
    }

    // Rotate local offset by facing angle, then offset from origin
    const rotated = rotatePoint(localX, localY, 0, 0, facing);
    return {
      id: soldier.id,
      x: originX + rotated.x,
      y: originY + rotated.y,
      facing,
    };
  });

  return positions;
}

// ---------------------------------------------------------------------------
// COLUMN OF FILES
// ---------------------------------------------------------------------------

/**
 * columnOfFiles(company, { originX, originY, facing })
 *
 * Company marching by the flank (after right-face + file doubling).
 * Per Casey S.C. ¶138 + S.S. ¶363:
 *
 * Column layout (front to rear):
 *   Depth 0 (head): Captain (left/guide) + Covering Sergeant (right) — 2 abreast
 *   Depth 1: files 2,3 doubled — 4 abreast [fr-02, fr-03, rr-02, rr-03]
 *   Depth 2: files 4,5 doubled — 4 abreast
 *   ...
 *   Depth 9: files 18,19 doubled — 4 abreast
 *   Depth 10: file 20 alone — 2 abreast [fr-20, rr-20]
 *
 * Across-column order (perpendicular right from facing):
 *   [first-in-pair front, second-in-pair front, first rear, second rear]
 *
 * File closers: 2 paces (FILE_CLOSER_GAP) to the right of the rearmost rank,
 * at depths corresponding to their original file positions (¶139–140).
 *
 * facing = 90 means column marches rightward (east).
 */
export function columnOfFiles(company, { originX = 480, originY = 400, facing = 90 } = {}) {
  const positions = [];
  const DEPTH_SPACING = 2 * FILE_INTERVAL;

  company.forEach((soldier) => {
    if (soldier.rank === 'fileCloser') {
      // File closers: side-step right (¶139), 2 paces from rearmost rank.
      // March opposite their places in line of battle (¶140).
      const fcDepthIndex = _fileDepthIndex(soldier.file);
      const depthOffset = -fcDepthIndex * DEPTH_SPACING;
      const acrossOffset = 3 * FILE_INTERVAL + FILE_CLOSER_GAP;
      const rotated = rotateAlongAcross(depthOffset, acrossOffset, facing);
      positions.push({ id: soldier.id, x: originX + rotated.x, y: originY + rotated.y, facing });
      return;
    }

    const pos = _columnFilePosition(soldier, company);
    const rotated = rotateAlongAcross(pos.depthOffset, pos.acrossOffset, facing);
    positions.push({
      id: soldier.id,
      x: originX + rotated.x,
      y: originY + rotated.y,
      facing,
    });
  });

  return positions;
}

/**
 * Compute depth index for a given file number in the column of files.
 * Captain/CovSgt (file 1) → depth 0.
 * Files 2-3 → depth 1, files 4-5 → depth 2, ..., files 18-19 → depth 9, file 20 → depth 10.
 */
function _fileDepthIndex(file) {
  if (file <= 1) return 0;
  return Math.floor((file - 2) / 2) + 1;
}

/**
 * Compute depth and across offsets for a single soldier in column of files.
 * Returns { depthOffset, acrossOffset } in local units.
 */
function _columnFilePosition(soldier, company) {
  const DEPTH_SPACING = 2 * FILE_INTERVAL;
  const file = soldier.file;

  // Captain and Covering Sergeant: head of column (depth 0)
  if (soldier.id === 'nc-cov') {
    // Covering Sergeant at the guide (left/north) side = across 0
    return { depthOffset: 0, acrossOffset: 0 };
  }
  if (soldier.id === 'of-cpt') {
    // Captain steps LEFT of cov sgt, outside the company row = across -1
    return { depthOffset: 0, acrossOffset: -FILE_INTERVAL };
  }

  // Remaining files (2–20): pair sequentially (2,3), (4,5), ..., (18,19), 20 alone
  const depthIndex = _fileDepthIndex(file);
  const depthOffset = -depthIndex * DEPTH_SPACING;

  // Is this the second in a pair? Files 3,5,7,...,19 are second.
  const isSecondInPair = (file - 2) % 2 === 1;
  // Is this file alone (no pair partner)? Dress to guide side.
  const isAlone = !isSecondInPair && !company.find((c) => c.file === file + 1 && c.rank === 'front');

  let acrossIndex;
  if (soldier.rank === 'front') {
    acrossIndex = isSecondInPair ? 1 : 0;
  } else {
    // Lone rear-rank man closes up to acrossIndex 1 (guide-left dressing), not 2.
    acrossIndex = isSecondInPair ? 3 : (isAlone ? 1 : 2);
  }

  return { depthOffset, acrossOffset: acrossIndex * FILE_INTERVAL };
}

/**
 * Convert along/across offsets to x/y based on facing direction.
 * along = positive = toward the front of the column
 * across = positive = to the right of the direction of march
 */
function rotateAlongAcross(along, across, facingDeg) {
  // facing 0 (north): along = -y, across = +x
  // facing 90 (east): along = +x, across = +y
  // facing 180 (south): along = +y, across = -x
  // facing 270 (west): along = -x, across = -y
  const rad = deg2rad(facingDeg);
  const x = along * Math.sin(rad) + across * Math.cos(rad);
  const y = -along * Math.cos(rad) + across * Math.sin(rad);
  return { x, y };
}

// ---------------------------------------------------------------------------
// COLUMN OF PLATOONS
// ---------------------------------------------------------------------------

/**
 * columnOfPlatoons(company, { originX, originY, facing, platoonSpacing })
 *
 * Two-platoon column.  1st platoon leads, 2nd follows at platoonSpacing distance.
 * Each platoon is a mini line of 10 files, 2 ranks deep.
 *
 * platoonSpacing = distance (px) between the front ranks of the two platoons.
 * Default = 10 files × FILE_INTERVAL = column distance equal to platoon front.
 */
export function columnOfPlatoons(
  company,
  { originX = 480, originY = 400, facing = 0, platoonSpacing = null } = {}
) {
  const spacing = platoonSpacing ?? 10 * FILE_INTERVAL;
  const positions = [];

  const platoon1 = company.filter((s) => s.platoon === 1 && s.rank !== 'fileCloser');
  const platoon2 = company.filter((s) => s.platoon === 2 && s.rank !== 'fileCloser');
  const fileClosers = company.filter((s) => s.rank === 'fileCloser');

  // Place 1st platoon at origin
  // 1st platoon files 1–10: right anchor at originX
  const p1Positions = _platoonLine(platoon1, originX, originY, facing, 1);
  positions.push(...p1Positions);

  // 2nd platoon: behind (in direction opposite facing) by spacing
  const behindOffset = rotateAlongAcross(-spacing, 0, facing);
  const p2OriginX = originX + behindOffset.x;
  const p2OriginY = originY + behindOffset.y;
  const p2Positions = _platoonLine(platoon2, p2OriginX, p2OriginY, facing, 2);
  positions.push(...p2Positions);

  // File closers: 2 paces behind each platoon's rear rank
  fileClosers.forEach((fc) => {
    const pltOriginX = fc.platoon === 1 ? originX : p2OriginX;
    const pltOriginY = fc.platoon === 1 ? originY : p2OriginY;
    const fileIndex = fc.file - (fc.platoon === 1 ? 1 : 11);
    const localX = -fileIndex * FILE_INTERVAL;
    const localY = RANK_GAP + FILE_CLOSER_GAP;
    const rotated = rotatePoint(localX, localY, 0, 0, facing);
    positions.push({ id: fc.id, x: pltOriginX + rotated.x, y: pltOriginY + rotated.y, facing });
  });

  return positions;
}

/**
 * Internal: place a platoon (10 files, 2 ranks) in line at origin.
 * platoonNum = 1 or 2 (affects file numbering for x offset)
 */
function _platoonLine(platoonSoldiers, originX, originY, facing, platoonNum) {
  const baseFile = platoonNum === 1 ? 1 : 11;
  return platoonSoldiers.map((soldier) => {
    const fileIndex = soldier.file - baseFile;
    const localX = -fileIndex * FILE_INTERVAL;
    const localY = soldier.rank === 'rear' ? RANK_GAP : 0;
    const rotated = rotatePoint(localX, localY, 0, 0, facing);
    return {
      id: soldier.id,
      x: originX + rotated.x,
      y: originY + rotated.y,
      facing,
    };
  });
}

// ---------------------------------------------------------------------------
// WHEEL
// ---------------------------------------------------------------------------

/**
 * wheel(positions, { pivotX, pivotY, angleDeg })
 *
 * Rotate all soldiers around a pivot point by angleDeg.
 * Positive angleDeg = clockwise (right wheel).
 * Their facing also rotates by the same amount.
 */
export function wheel(positions, { pivotX, pivotY, angleDeg }) {
  return positions.map((s) => {
    const rotated = rotatePoint(s.x, s.y, pivotX, pivotY, angleDeg);
    return { ...s, x: rotated.x, y: rotated.y, facing: (s.facing + angleDeg + 360) % 360 };
  });
}

// ---------------------------------------------------------------------------
// ABOUT FACE
// ---------------------------------------------------------------------------

/**
 * aboutFace(positions)
 *
 * Each soldier rotates 180° IN PLACE — no position changes.
 * Per Casey, an about-face is a turn on the spot. Ranks do not physically
 * swap positions; they simply reverse facing. What was the rear rank is
 * now "in front" by definition because the direction of march reversed.
 * File closers, formerly behind the rear rank, are now physically ahead
 * (leading in the new direction).
 *
 * NOTE: Casey specifies additional repositioning for specific drills
 * (covering sergeant into file-closer line, captain to new front, directing
 * sergeant 6 paces ahead). Those are handled in individual drill keyframes,
 * not here.
 */
export function aboutFace(positions) {
  return positions.map((s) => ({
    ...s,
    facing: (s.facing + 180) % 360,
  }));
}

// ---------------------------------------------------------------------------
// OBLIQUE
// ---------------------------------------------------------------------------

/**
 * oblique(positions, { directionDeg, paces, rearRankShift, company })
 *
 * Move all soldiers in an oblique direction.
 * directionDeg relative to current facing: 45 = right oblique, -45 = left oblique.
 * paces = number of paces to move.
 *
 * rearRankShift (S.C. ¶102, backward-compatible opt-in; requires `company`):
 * "The rear-rank men will preserve their distances, and march in rear of the
 * man next on the right (or left) of their habitual file leaders." In
 * addition to the uniform diagonal displacement every soldier receives
 * above, each REAR-RANK soldier is offset one extra FILE_INTERVAL laterally
 * toward the obliquing side — using the standing line-of-battle orientation
 * (s.facing, the rank's own orientation, NOT facing+directionDeg) so the
 * shift is measured as "toward my right/left flank," not "toward the
 * diagonal march direction." Front-rank soldiers and file closers are
 * unaffected; ¶102 only speaks to the rear rank.
 *
 * Edge case (¶102): the covering sergeant (rear rank of file 1, id
 * 'nc-cov') has no file to his right — file 1 is the rightmost file in
 * Casey's numbering, so there is no "man next on the right of his habitual
 * file leader" to march behind. Casey's text does not address this extreme
 * file explicitly; the most defensible reading is that he simply keeps
 * covering his own file leader (the captain) unshifted. Symmetrically, on a
 * left oblique the leftmost file's rear-rank man has no file to his left and
 * is likewise left unshifted.
 */
export function oblique(positions, { directionDeg = 45, paces = 6, rearRankShift = false, company = null } = {}) {
  const dist = paces * SCALE.PACE_PX;
  const shiftSign = directionDeg >= 0 ? 1 : -1; // right oblique (+) shifts rear rank right; left oblique (-) shifts left
  const roster = company ? new Map(company.map((c) => [c.id, c])) : null;
  const maxFile = company ? Math.max(...company.map((c) => c.file)) : 20;

  // Shift facing for the oblique movement (each man half-faces directionDeg)
  return positions.map((s) => {
    const absoluteDir = (s.facing + directionDeg + 360) % 360;
    const rad = deg2rad(absoluteDir);
    let x = s.x + dist * Math.sin(rad);
    let y = s.y - dist * Math.cos(rad);

    if (rearRankShift && roster) {
      const soldier = roster.get(s.id);
      if (soldier && soldier.rank === 'rear') {
        const isRightEdge = shiftSign > 0 && soldier.file === 1; // ¶102 edge case: nc-cov
        const isLeftEdge = shiftSign < 0 && soldier.file === maxFile; // symmetric edge case
        if (!isRightEdge && !isLeftEdge) {
          const lineRad = deg2rad(s.facing); // standing line-of-battle orientation, not the oblique direction
          x += shiftSign * FILE_INTERVAL * Math.cos(lineRad);
          y += shiftSign * FILE_INTERVAL * Math.sin(lineRad);
        }
      }
    }

    return {
      ...s,
      x,
      y,
      facing: s.facing, // facing returns to original after oblique
    };
  });
}

// ---------------------------------------------------------------------------
// DOUBLE FILES (for march by flank)
// ---------------------------------------------------------------------------

/**
 * doubleFiles(positions, company)
 *
 * Per Casey S.S. ¶363 + S.C. ¶138:
 * After right-face, files double WITHIN EACH RANK:
 *   - Front rank: even-numbered men step to the right of their odd-numbered neighbor.
 *   - Rear rank: side-steps right one pace, then doubles the same way.
 *
 * Result: column **4 abreast, 11 depth positions** (head pair + 9 quads +
 * lone file 20), identical geometry to columnOfFiles() anchored at the
 * captain's current position.
 * Across-column order (perpendicular right from facing):
 *   [front-odd, front-even, rear-odd, rear-even]
 */
export function doubleFiles(positions, company) {
  // Build a lookup: soldier.id → position
  const posMap = Object.fromEntries(positions.map((p) => [p.id, p]));

  // The captain's position is the anchor for the head of the column.
  // After right-face, the captain is at the head (rightmost/frontmost).
  const captainPos = posMap['of-cpt'];
  const columnFacing = captainPos?.facing ?? 90;
  const facingRad = deg2rad(columnFacing);
  const perpX = Math.cos(facingRad);
  const perpY = Math.sin(facingRad);
  // "Behind" = opposite of facing direction
  const behindX = -Math.sin(facingRad);
  const behindY = Math.cos(facingRad);

  const DEPTH_SPACING = 2 * FILE_INTERVAL;

  return positions.map((s) => {
    const soldier = company.find((c) => c.id === s.id);
    if (!soldier) return s;

    // --- File closers: side-step right (¶139) ---
    // 2 paces from rearmost rank, opposite their places in line (¶140)
    if (soldier.rank === 'fileCloser') {
      const fcDepthIndex = _fileDepthIndex(soldier.file);
      const acrossOffset = 3 * FILE_INTERVAL + FILE_CLOSER_GAP;
      return {
        ...s,
        x: captainPos.x + behindX * (fcDepthIndex * DEPTH_SPACING) + perpX * acrossOffset,
        y: captainPos.y + behindY * (fcDepthIndex * DEPTH_SPACING) + perpY * acrossOffset,
        facing: columnFacing,
      };
    }

    // --- Covering Sergeant: steps to head of column, northernmost row (across=0) ---
    if (soldier.id === 'nc-cov') {
      return {
        ...s,
        x: captainPos.x,
        y: captainPos.y,
        facing: columnFacing,
      };
    }

    // --- Captain: steps LEFT of facing (outside the company row), one FILE_INTERVAL
    //     north of the covering sergeant ---
    if (soldier.id === 'of-cpt') {
      return {
        ...s,
        x: captainPos.x - perpX * FILE_INTERVAL,
        y: captainPos.y - perpY * FILE_INTERVAL,
        facing: columnFacing,
      };
    }

    // --- Remaining files (2–20): double by position ---
    // Pairs: (2,3), (4,5), ..., (18,19); file 20 alone.
    const file = soldier.file;
    const depthIndex = _fileDepthIndex(file);
    const isSecondInPair = (file - 2) % 2 === 1; // files 3,5,7,...,19

    // Is this file alone (no pair partner)? Last file when total is odd.
    const isAlone = !isSecondInPair && !company.find((c) => c.file === file + 1 && c.rank === 'front');

    let acrossIndex;
    if (soldier.rank === 'front') {
      acrossIndex = isSecondInPair ? 1 : 0;
    } else {
      // Dress to guide (left/north): lone rear-rank man closes up to acrossIndex 1
      // instead of leaving a gap at acrossIndex 2.
      acrossIndex = isSecondInPair ? 3 : (isAlone ? 1 : 2);
    }

    // Depth from the head at the canonical DEPTH_SPACING so this function and
    // columnOfFiles() describe the same physical column. (Previously quads
    // kept their pre-doubling line x, compressing the column one FILE_INTERVAL
    // toward the head and drifting 10px from the file closers, which already
    // used DEPTH_SPACING.)
    return {
      ...s,
      x: captainPos.x + behindX * (depthIndex * DEPTH_SPACING) + perpX * acrossIndex * FILE_INTERVAL,
      y: captainPos.y + behindY * (depthIndex * DEPTH_SPACING) + perpY * acrossIndex * FILE_INTERVAL,
      facing: columnFacing,
    };
  });
}

/**
 * undoubleFiles(positions, company)
 *
 * Reverse of doubleFiles: restores the two-rank line formation.
 * Captain returns to front-rank file 1, covering sergeant to rear-rank file 1.
 * Second-in-pair soldiers step back to their original file positions.
 * Rear-rank soldiers return to RANK_GAP behind their front-rank counterparts.
 * Used when halting and facing to front from a column of files.
 */
export function undoubleFiles(positions, company) {
  const posMap = Object.fromEntries(positions.map((p) => [p.id, p]));

  // Captain's current position is the file-1 anchor for the reformed line.
  const captainPos = posMap['of-cpt'];
  if (!captainPos) return positions;

  // Column marching at captainPos.facing (e.g. 90=east for right-flank march).
  // FRONT = face left (-90°) to restore original line facing.
  const newFacing = (captainPos.facing - 90 + 360) % 360;
  const newFacingRad = deg2rad(newFacing);

  // Direction files spread along the reformed line = opposite of column depth direction.
  // Column faces east (90°) → depth increases west → files spread west = (-1, 0).
  const colFacingRad = deg2rad(captainPos.facing);
  const fileSpreadX = -Math.sin(colFacingRad);
  const fileSpreadY = Math.cos(colFacingRad);

  // "Behind" direction in the new facing = from front rank toward rear rank.
  // newFacing=0 (north) → behind = south = (0, +1).
  // Formula: behindX = -sin(F), behindY = cos(F).
  const rankBehindX = -Math.sin(newFacingRad);
  const rankBehindY = Math.cos(newFacingRad);

  return positions.map((s) => {
    const soldier = company.find((c) => c.id === s.id);
    if (!soldier) return s;

    const file = soldier.file;
    const fileOffset = (file - 1) * FILE_INTERVAL;
    const baseX = captainPos.x + fileSpreadX * fileOffset;
    const baseY = captainPos.y + fileSpreadY * fileOffset;

    // Captain: anchor at file 1, front rank — stays in place, updates facing.
    if (soldier.id === 'of-cpt') {
      return { ...s, facing: newFacing };
    }

    // Covering sergeant: rear-rank file 1, one RANK_GAP behind captain.
    if (soldier.id === 'nc-cov') {
      return {
        ...s,
        x: captainPos.x + rankBehindX * RANK_GAP,
        y: captainPos.y + rankBehindY * RANK_GAP,
        facing: newFacing,
      };
    }

    // File closers: return to line-of-battle position two paces behind rear rank.
    if (soldier.rank === 'fileCloser') {
      return {
        ...s,
        x: baseX + rankBehindX * (RANK_GAP + FILE_CLOSER_GAP),
        y: baseY + rankBehindY * (RANK_GAP + FILE_CLOSER_GAP),
        facing: newFacing,
      };
    }

    // Front rank files 2–20: spread along the line from captain.
    if (soldier.rank === 'front') {
      return { ...s, x: baseX, y: baseY, facing: newFacing };
    }

    // Rear rank files 2–20: one RANK_GAP behind their front-rank file leader.
    return {
      ...s,
      x: baseX + rankBehindX * RANK_GAP,
      y: baseY + rankBehindY * RANK_GAP,
      facing: newFacing,
    };
  });
}

// ---------------------------------------------------------------------------
// APPLY FACING ONLY
// ---------------------------------------------------------------------------

/**
 * setFacing(positions, facingDeg)
 * Sets all soldiers to the given facing without moving them.
 */
export function setFacing(positions, facingDeg) {
  return positions.map((s) => ({ ...s, facing: facingDeg }));
}

/**
 * addRandomJitter(positions, { maxPx, maxDeg })
 * Adds small random offsets to simulate route step / informal spacing.
 */
export function addRandomJitter(positions, { maxPx = 3, maxDeg = 5 } = {}) {
  return positions.map((s) => ({
    ...s,
    x: s.x + (Math.random() - 0.5) * 2 * maxPx,
    y: s.y + (Math.random() - 0.5) * 2 * maxPx,
    facing: s.facing + (Math.random() - 0.5) * 2 * maxDeg,
  }));
}
