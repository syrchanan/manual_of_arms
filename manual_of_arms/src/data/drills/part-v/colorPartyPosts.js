/**
 * Shared geometry helpers for Part Fifth's color-party / field-and-staff
 * choreography (S.B. ¶648-716, Articles I-III).
 *
 * This is the first Part where COLOR_PARTY and FIELD_AND_STAFF (both defined
 * in ../../battalion.js) become load-bearing -- see that file's "Color
 * party" doc comment and battalion-spec/part-fifth-a.md's "Roster gap"
 * section for the design rationale. Casey does not fix the exact geometric
 * layout of the color-guard's little rank or the color file's location
 * within an 8-company battalion; the choices documented below are this
 * project's interpretive judgment calls, used consistently across all three
 * Article I-III drill files so the color party reads as one coherent cast
 * rather than being re-invented per file.
 *
 * INTERPRETIVE CHOICES (documented once, here, applied everywhere in Part V):
 * 1. Color file = the boundary between files 10 and 11 of the color company
 *    (COLOR_COMPANY_INDEX), i.e. the mathematical centre of that company's
 *    20-file front -- a defensible stand-in for Casey's undefined "color
 *    file" position.
 * 2. Color-guard rank layout: the color-bearer leads; the centre corporal
 *    ("follows exactly in the color-bearer's trace", ¶662) is placed
 *    directly behind him at RANK_GAP depth, same across-position; the right
 *    and left corporals flank the centre corporal at the same depth, one
 *    FILE_INTERVAL to either side ("march elbow to elbow", ¶662).
 * 3. General guides march abreast of the color-rank (¶661): guide-right
 *    takes the across-position of company 1's captain ("opposite the
 *    captain of the right company", ¶653); guide-left takes the
 *    across-position of the leftmost company's own left-guide sergeant
 *    (fc-2sg, "opposite the sergeant closing the left of the battalion").
 *    Both sit at the color-bearer's own forward depth.
 * 4. Field-and-staff posts not fixed by this Part's text (the junior
 *    major's "No. 35, Title I" cross-reference is explicitly not chased,
 *    per the spec) are given a generic, documented placement rather than
 *    left undefined, so every keyframe still carries all 382 ids.
 */
import { SCALE } from '../../constants.js';
import { COLOR_PARTY, FIELD_AND_STAFF, COLOR_COMPANY_INDEX, NUM_COMPANIES } from '../../battalion.js';

const { PACE_PX, FILE_INTERVAL, RANK_GAP } = SCALE;

/** Unit vector, "forward" along a given facing (toward where the battalion
 * marches) -- matches formations.js's oblique()/rotateAlongAcross convention
 * (facing 0 = north = -y). */
export function forwardVec(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return { x: Math.sin(rad), y: -Math.cos(rad) };
}

/** Unit vector, "toward file 1 / the right flank" along a given facing --
 * matches battalionFormations.js's acrossAxis() convention. */
export function rightFlankVec(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

/** Offset a ground point by forwardPaces/rightPaces (paces, may be
 * negative) along the given facing's own forward/right-flank axes. */
export function offsetPaces(point, facingDeg, { forward = 0, right = 0 } = {}) {
  const f = forwardVec(facingDeg);
  const r = rightFlankVec(facingDeg);
  const df = forward * PACE_PX;
  const dr = right * PACE_PX;
  return { x: point.x + f.x * df + r.x * dr, y: point.y + f.y * df + r.y * dr };
}

export function posOf(positions, id) {
  return positions.find((p) => p.id === id);
}

/** The color file's ground point: midpoint of files 10/11, front rank, of
 * the color company -- see interpretive choice #1 above. */
export function colorFileAnchor(positions, companyIndex = COLOR_COMPANY_INDEX) {
  const a = posOf(positions, `c${companyIndex}-fr-10`);
  const b = posOf(positions, `c${companyIndex}-fr-11`);
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, facing: a.facing };
}

export function captainPos(positions, companyIndex) {
  return posOf(positions, `c${companyIndex}-of-cpt`);
}

/** "The sergeant closing the left of the battalion" -- the leftmost
 * company's own left-guide sergeant (fc-2sg), per the same convention
 * battalion.js's leftSergeantId() already uses for Part First. */
export function leftClosingSergeantPos(positions, numCompanies = NUM_COMPANIES) {
  return posOf(positions, `c${numCompanies}-fc-2sg`);
}

/**
 * buildColorParty(positions, { companyIndex, forwardPaces, atRest })
 *
 * Returns the 6 COLOR_PARTY { id, x, y, facing } entries.
 * - forwardPaces: how far ahead of the color file the color-bearer stands
 *   (0 = still in the ranks at halt; 6 = advanced per ¶653; more once
 *   marching).
 * - atRest: if true, the general guides are NOT advanced abreast of the
 *   color-rank but instead held at the file-closer depth (their halted
 *   post before the preparatory command advances them, ¶653/661).
 */
export function buildColorParty(positions, { companyIndex = COLOR_COMPANY_INDEX, forwardPaces = 0, atRest = false } = {}) {
  const anchor = colorFileAnchor(positions, companyIndex);
  const facing = anchor.facing;
  const bearer = offsetPaces(anchor, facing, { forward: forwardPaces });
  const cplDepth = forwardPaces - RANK_GAP / PACE_PX; // "follows exactly in his trace"
  const centre = offsetPaces(anchor, facing, { forward: cplDepth });
  const right = offsetPaces(anchor, facing, { forward: cplDepth, right: 1 * (FILE_INTERVAL / PACE_PX) });
  const left = offsetPaces(anchor, facing, { forward: cplDepth, right: -1 * (FILE_INTERVAL / PACE_PX) });

  const rightGuideAcross = captainPos(positions, 1);
  const leftGuideAcross = leftClosingSergeantPos(positions);
  const guideForward = atRest ? 0 : forwardPaces;
  const guideRight = offsetPaces(rightGuideAcross, facing, { forward: guideForward });
  const guideLeft = offsetPaces(leftGuideAcross, facing, { forward: guideForward });

  const out = {
    'color-bearer': { ...bearer, facing },
    'color-cpl-centre': { ...centre, facing },
    'color-cpl-right': { ...right, facing },
    'color-cpl-left': { ...left, facing },
    'guide-right': { ...guideRight, facing },
    'guide-left': { ...guideLeft, facing },
  };
  return COLOR_PARTY.map((p) => ({ id: p.id, ...out[p.id] }));
}

/**
 * battalionCentreFront(positions) -- midpoint of the whole battalion's
 * front-rank extremes (company 1's right-flank captain, company N's
 * left-flank front-rank man), used as the "centre of the battalion" ground
 * reference for the colonel's marching post (¶670) and similar.
 */
export function battalionCentreFront(positions, numCompanies = NUM_COMPANIES) {
  const right = captainPos(positions, 1);
  const left = posOf(positions, `c${numCompanies}-fr-20`);
  return { x: (right.x + left.x) / 2, y: (right.y + left.y) / 2, facing: right.facing };
}

/**
 * buildFieldAndStaff(positions, postsById) -- given an explicit map of
 * { [fs-id]: {x,y,facing} } for whichever posts a keyframe wants to fix,
 * fills in any missing FIELD_AND_STAFF id with a generic fallback (held
 * just behind the battalion's centre) so every keyframe still carries all 4
 * ids, even for posts this Part's text does not specify (e.g. the junior
 * major outside an Article I marching keyframe).
 */
export function buildFieldAndStaff(positions, postsById = {}) {
  const fallback = offsetPaces(battalionCentreFront(positions), battalionCentreFront(positions).facing, { forward: -20 });
  const fallbackFacing = battalionCentreFront(positions).facing;
  return FIELD_AND_STAFF.map((p) => {
    const post = postsById[p.id];
    if (post) return { id: p.id, x: post.x, y: post.y, facing: post.facing ?? fallbackFacing };
    return { id: p.id, x: fallback.x, y: fallback.y, facing: fallbackFacing };
  });
}
