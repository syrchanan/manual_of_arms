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
import { lineOfBattle } from './formations.js';
import { SCALE } from '../data/constants.js';

const { FILE_INTERVAL } = SCALE;

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
