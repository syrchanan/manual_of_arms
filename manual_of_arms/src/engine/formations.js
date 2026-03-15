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
 * lineOfBattle(company, { originX, originY, facing, guide })
 *
 * Places 47 soldiers in line of battle.
 * originX/Y = position of the RIGHTMOST file, front rank soldier (captain).
 * facing = direction the company faces (0 = north).
 * guide = 'right' | 'left' (which flank is the anchor; right is default).
 *
 * On screen (facing = 0 / north):
 *   - Files spread LEFT (decreasing x) from the captain.
 *   - Rear rank is BELOW (+y) the front rank.
 *   - File closers are further below.
 */
export function lineOfBattle(company, { originX = 480, originY = 400, facing = 0, guide = 'right' } = {}) {
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

    const pos = _columnFilePosition(soldier, facing);
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
function _columnFilePosition(soldier) {
  const DEPTH_SPACING = 2 * FILE_INTERVAL;
  const file = soldier.file;

  // Captain and Covering Sergeant: head of column (depth 0)
  if (soldier.id === 'of-cpt') {
    // Captain on the LEFT (guide side) = across index 0
    return { depthOffset: 0, acrossOffset: 0 };
  }
  if (soldier.id === 'nc-cov') {
    // Covering Sergeant on the RIGHT = across index 1
    return { depthOffset: 0, acrossOffset: FILE_INTERVAL };
  }

  // Remaining files (2–20): pair sequentially (2,3), (4,5), ..., (18,19), 20 alone
  const depthIndex = _fileDepthIndex(file);
  const depthOffset = -depthIndex * DEPTH_SPACING;

  // Is this the second in a pair? Files 3,5,7,...,19 are second.
  const isSecondInPair = (file - 2) % 2 === 1;
  // File 20 is alone (no partner) — treated as first.

  let acrossIndex;
  if (soldier.rank === 'front') {
    acrossIndex = isSecondInPair ? 1 : 0;
  } else {
    acrossIndex = isSecondInPair ? 3 : 2;
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
 * columnOfPlatoons(company, { originX, originY, facing, guide, platoonSpacing })
 *
 * Two-platoon column.  1st platoon leads, 2nd follows at platoonSpacing distance.
 * Each platoon is a mini line of 10 files, 2 ranks deep.
 *
 * platoonSpacing = distance (px) between the front ranks of the two platoons.
 * Default = 10 files × FILE_INTERVAL = column distance equal to platoon front.
 */
export function columnOfPlatoons(
  company,
  { originX = 480, originY = 400, facing = 0, guide = 'left', platoonSpacing = null } = {}
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
 * oblique(positions, { directionDeg, paces })
 *
 * Move all soldiers in an oblique direction.
 * directionDeg relative to current facing: 45 = right oblique, -45 = left oblique.
 * paces = number of paces to move.
 */
export function oblique(positions, { directionDeg = 45, paces = 6 } = {}) {
  const dist = paces * SCALE.PACE_PX;
  // Shift facing for the oblique movement (each man half-faces directionDeg)
  return positions.map((s) => {
    const absoluteDir = (s.facing + directionDeg + 360) % 360;
    const rad = deg2rad(absoluteDir);
    return {
      ...s,
      x: s.x + dist * Math.sin(rad),
      y: s.y - dist * Math.cos(rad),
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
 * Result: column **4 abreast, 10 deep** (for 20 files).
 * Across-column order (perpendicular right from facing):
 *   [front-odd, front-even, rear-odd, rear-even]
 *
 * The odd front-rank soldier of each pair stays in place as the anchor.
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
        x: captainPos.x + behindX * (-fcDepthIndex * DEPTH_SPACING) + perpX * acrossOffset,
        y: captainPos.y + behindY * (-fcDepthIndex * DEPTH_SPACING) + perpY * acrossOffset,
        facing: columnFacing,
      };
    }

    // --- Captain: stays at head, left/guide side (across=0) ---
    if (soldier.id === 'of-cpt') {
      return { ...s, facing: columnFacing };
    }

    // --- Covering Sergeant: steps to head, right side (across=1) ---
    if (soldier.id === 'nc-cov') {
      return {
        ...s,
        x: captainPos.x + perpX * FILE_INTERVAL,
        y: captainPos.y + perpY * FILE_INTERVAL,
        facing: columnFacing,
      };
    }

    // --- Remaining files (2–20): double by position ---
    // Pairs: (2,3), (4,5), ..., (18,19); file 20 alone.
    const file = soldier.file;
    const depthIndex = _fileDepthIndex(file);
    const isSecondInPair = (file - 2) % 2 === 1; // files 3,5,7,...,19

    let acrossIndex;
    if (soldier.rank === 'front') {
      acrossIndex = isSecondInPair ? 1 : 0;
    } else {
      acrossIndex = isSecondInPair ? 3 : 2;
    }

    // Anchor: the first-in-pair front-rank soldier at this depth
    // For depth 1 (files 2,3): anchor = fr-02
    // For depth 2 (files 4,5): anchor = fr-04
    const firstFile = (depthIndex - 1) * 2 + 2; // file number of first-in-pair
    const anchorId = `fr-${String(firstFile).padStart(2, '0')}`;
    const anchor = posMap[anchorId];
    if (!anchor) return s;

    if (acrossIndex === 0) {
      // First-in-pair, front rank: stays in place
      return { ...s, facing: columnFacing };
    }

    return {
      ...s,
      x: anchor.x + perpX * acrossIndex * FILE_INTERVAL,
      y: anchor.y + perpY * acrossIndex * FILE_INTERVAL,
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

  // Use the captain's current position as reference for the new line
  const captainPos = posMap['of-cpt'];
  if (!captainPos) return positions;

  const newFacing = (captainPos.facing - 90 + 360) % 360; // face left = undo right-face
  const facingRad = deg2rad(newFacing);
  // In the restored line: "behind" = rear rank direction
  const perpX = Math.cos(facingRad); // perpendicular right (not used for rear rank)
  const perpY = Math.sin(facingRad);
  const behindFacingRad = deg2rad(captainPos.facing);
  const behindX = -Math.sin(behindFacingRad); // "behind" in column direction = depth
  const behindY = Math.cos(behindFacingRad);

  return positions.map((s) => {
    const soldier = company.find((c) => c.id === s.id);
    if (!soldier || soldier.rank === 'fileCloser') return s;

    const file = soldier.file;

    // Captain: stays at current position, faces front
    if (soldier.id === 'of-cpt') {
      return { ...s, facing: newFacing };
    }

    // Covering sergeant: returns to rear-rank file 1 (behind captain)
    if (soldier.id === 'nc-cov') {
      return {
        ...s,
        x: captainPos.x + perpX * RANK_GAP,
        y: captainPos.y + perpY * RANK_GAP,
        facing: newFacing,
      };
    }

    // Remaining files: each returns to its original file position
    // In the line, file f is at (f-1) * FILE_INTERVAL behind the captain (in column direction)
    const fileOffset = (file - 1) * FILE_INTERVAL;
    const baseX = captainPos.x + behindX * fileOffset;
    const baseY = captainPos.y + behindY * fileOffset;

    if (soldier.rank === 'front') {
      return { ...s, x: baseX, y: baseY, facing: newFacing };
    } else {
      // Rear rank: RANK_GAP behind front rank (perpendicular right in new facing)
      return {
        ...s,
        x: baseX + perpX * RANK_GAP,
        y: baseY + perpY * RANK_GAP,
        facing: newFacing,
      };
    }
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
