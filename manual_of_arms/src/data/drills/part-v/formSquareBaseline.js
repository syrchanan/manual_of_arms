import { columnOfCompanies, formSquare, cascadeBlend } from '../../../engine/battalionFormations.js';
import { translate } from '../../../engine/formations.js';
import { DEFAULT_BATTALION, COLOR_PARTY, FIELD_AND_STAFF } from '../../battalion.js';
import { CANVAS_BATTALION, SCALE } from '../../constants.js';
import { buildColorParty, buildFieldAndStaff } from './colorPartyPosts.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article XIV baseline case (S.B. ¶999-1089): "To form square"
// from column by company (half or full distance, halted or marching),
// maneuvering while in square, forming column to advance further, and
// reducing the square.
//
// SCOPE: this file covers the geometry that resolves to the SAME
// hollow-rectangle square described in battalionFormations.js's formSquare()
// doc comment -- ¶999-1048 (four ways to arrive at the square: half
// distance/halted, half distance/marching, full distance, column by
// division in mass), ¶1049-1059 (advance <30 paces and halt while in
// square), ¶1060-1088 (form column to advance further / reduce the square).
// ¶1089 (rallying skirmishers) and ¶1090-1105 (forming square FROM LINE OF
// BATTLE, a precursor-column-plying topic, not new square geometry) are
// documented in reenactorNotes only, not separately animated -- ¶1090-1105
// is squarely a different drill's job (it produces one of several possible
// PRE-square column states, all of which this file's 'from-half-distance'
// sub-movement already knows how to turn into a square).
//
// FOUR SUB-MOVEMENTS (this file's own split of the source's 9 numbered
// sections -- see the spec's own section numbering, part-fifth-e.md):
//   'from-half-distance' -- Sections 1-2 (¶999-1028): the baseline halted
//     case is animated in full choreographic detail (command 1 dispositions,
//     command 2 caution, command 3 wheel/close, guides-posts); the marching
//     case (Section 2) differs only in officer choreography (¶1019-1028
//     -- the geometry is identical per the spec's own complexity note) and
//     is documented, not separately animated, matching this project's
//     existing precedent (e.g. part-iv/halfDistanceIntoLine.js animates only
//     one of two geometrically-identical entry variants).
//   'from-full-distance' -- Sections 3-4 (¶1029-1048): normalizes a
//     full-distance (or mass-column-by-division) start down to half
//     distance, then delegates to the SAME wheel/close geometry as
//     'from-half-distance' -- per the spec's own complexity note, "no new
//     square geometry." Section 4's column-by-division-in-mass variant is
//     documented only (identical distance-closing pattern, different
//     starting distanceMode).
//   'maneuver-in-square' -- Sections 5-6 (¶1049-1059): the formed square
//     advances a short distance (<30 paces) as one rigid body and halts.
//     Casey's own text describes this as a plain translation -- the front
//     face marches in its own facing, the rear face (already faced about)
//     marches backward in its own facing, and the two side faces (already
//     faced outward) march "by the flank," i.e. sideways relative to their
//     own facing -- which is exactly what a position-only translate() (no
//     facing change) already produces, with no new primitive needed.
//   'reduce-square' -- Sections 7 + 9 (¶1060-1088): "form column to advance
//     further" (Section 7) and "reduce the square" (Section 9) are the same
//     underlying unfold, per the spec's own recommendation ("Reduce square
//     = Section 7's formColumn() primitive, PLUS a final step" resetting
//     colour/staff/music) -- built here as one continuous sequence rather
//     than two separate sub-movements.
//
// KNOWN SIMPLIFICATIONS (all flagged by battalionFormations.js's formSquare()
// doc comment or the spec's own "Complexity notes" and carried forward here):
//   - CORNER FILES (¶1009, ¶1011): Casey caps each of the square's four
//     corners with a single FILE (2 soldiers) turning 90 degrees in place,
//     not a whole company. formSquare() does not model file-level partial
//     facing (only whole-company rigid transforms) -- corners in this
//     animation read as sharp geometric joins with no separately-turned
//     capping file. Documented, not implemented, per the primitive's own
//     header note.
//   - SKIRMISHERS AND MUSIC (¶1002-1003, 1012, 1024, 1042, 1046, 1071,
//     1078, 1088-1089): Casey stations two skirmisher platoon-columns and a
//     music block inside the forming square. This project has no separate
//     skirmisher/music roster at battalion scale -- all 8 companies are
//     already fully consumed by the four square faces (376 soldiers total,
//     matching DEFAULT_BATTALION) -- so these actors are not separately
//     rendered, the same convention already used by part-v/passDefileInRetreat.js
//     and part-v/haltInRetreatFaceFront.js for skirmisher cross-references.
//   - INTERIOR PLACEMENT of the colour party and field & staff (¶1013-1016,
//     ¶1086-1088): Casey says these actors "enter the square" but does not
//     fix an exact interior point for an 8-company example. Per this task's
//     direction, they are clustered at the square's geometric interior
//     centre (squareInteriorCenter() below) -- a documented interpretive
//     choice, not a sourced position.
//   - THE "WHEEL BY FILE" UNFOLD (Section 7, ¶1065-1067): the spec calls
//     this "the genuinely hardest new primitive" -- each side-face company
//     peeling into a single file and curling around a corner to rejoin its
//     partner behind the new column head. No such per-file arc-path
//     primitive exists yet; 'reduce-square' approximates the unfold with
//     cascadeBlend's straight-line position/shortest-facing interpolation,
//     the same illustrative-cascade technique already used throughout
//     part-iv/massDeployment.js for comparably complex peel/converge
//     maneuvers -- the START and END states are geometrically exact; only
//     the in-between motion is stylized.
// ---------------------------------------------------------------------------

const { FILE_INTERVAL, PACE_PX } = SCALE;

const FACING = 90; // battalion marches/faces east throughout this file,
  // matching the existing convention for deep half/full-distance columns
  // (part-iv/halfDistanceIntoLine.js, part-iv/determineLine.js) -- depth
  // reads better spread along CANVAS_BATTALION's wide x-axis than its
  // shorter y-axis.

// Mirrors battalionFormations.js's own private COMPANY_STRIDE/COMPANY_FRONT
// constants (20*FILE_INTERVAL / 19*FILE_INTERVAL respectively) -- neither is
// exported by that module, so both are re-derived here from the same
// SCALE.FILE_INTERVAL and then passed explicitly into every formSquare()
// call as `faceDistance`, rather than relying on formSquare()'s own
// (opaque-to-callers) default, so this file's interior-actor math is
// guaranteed to agree with the box it is placing actors inside of.
const COMPANY_FRONT = 19 * FILE_INTERVAL;
const COMPANY_STRIDE = 20 * FILE_INTERVAL;
const BOX_WIDTH = 2 * COMPANY_STRIDE;
const SQUARE_FACE_DISTANCE = 2 * COMPANY_FRONT;

// Per-sub-movement origins (front face's own file-1 anchor), chosen so each
// sub-movement's full extent -- including the deepest column state it needs
// and, for 'maneuver-in-square', its post-advance position -- fits inside
// CANVAS_BATTALION (1700x500) without overlap between unrelated sub-movements
// (each sub-movement's keyframes are only ever viewed on their own).
const ORIGIN_X_HALF = CANVAS_BATTALION.VIEW_W - 200; // half-distance column's
  // deepest division sits ORIGIN_X_HALF - 3*(COMPANY_FRONT/2) =~ 1215, well
  // clear of the canvas edge. Shared by 'from-half-distance' and
  // 'reduce-square' (its exact geometric inverse).
const ORIGIN_Y_HALF = 450; // box width (400px) then spans y:[50,450].
const ORIGIN_X_FULL = CANVAS_BATTALION.VIEW_W - 50; // full-distance column's
  // deepest division sits ORIGIN_X_FULL - 3*COMPANY_FRONT =~ 1080.
const ORIGIN_Y_FULL = 450;
const ORIGIN_X_MAN = 700; // leaves ~1000px of clearance to advance into.
const ORIGIN_Y_MAN = 450;

function forwardVecPx(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return { x: Math.sin(rad), y: -Math.cos(rad) };
}
function acrossVecPx(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}

/** Group an 8-company battalion into the 4 standard divisions (1,2)(3,4)
 * (5,6)(7,8), the pairing formSquare() and columnOfCompanies() both expect. */
function buildDivisions(battalion) {
  const divisions = [];
  for (let d = 0; d < battalion.length / 2; d++) {
    divisions.push({ companies: [battalion[d * 2], battalion[d * 2 + 1]] });
  }
  return divisions;
}

/** Maps a soldier id ("c3-of-cpt", "c7-fr-9", ...) to its DIVISION index
 * (0-3), for cascadeBlend's per-division progress grouping. */
function groupOfId(id) {
  const m = /^c(\d+)-/.exec(id);
  if (!m) return null;
  return Math.floor((Number(m[1]) - 1) / 2);
}

/** Interior centre point of the hollow square, given the same origin/facing
 * passed to formSquare(). See "INTERIOR PLACEMENT" note above. */
function squareInteriorCenter(originX, originY, facing) {
  // NOTE: forwardVecPx() points in the direction of MARCH (out through the
  // front face, per colorPartyPosts.js's own convention) -- the box's
  // interior lies the OTHER way, toward the rear face, i.e. along -forward
  // (matching formSquare()'s own "behind" vector (bx,by) = (-sin, cos)).
  const fwd = forwardVecPx(facing);
  const acr = acrossVecPx(facing);
  return {
    x: originX - fwd.x * (SQUARE_FACE_DISTANCE / 2) - acr.x * (BOX_WIDTH / 2),
    y: originY - fwd.y * (SQUARE_FACE_DISTANCE / 2) - acr.y * (BOX_WIDTH / 2),
  };
}

/** Fan a small group of ids out in a simple grid around a centre point, all
 * sharing `facing`. Generic placement for the non-company actors (colour
 * party, field & staff) once inside the square, no longer anchored to any
 * one company's line-of-battle geometry. */
function gridCluster(ids, centerX, centerY, facing, { forwardOffsetPx = 0, cols = 2, gapPx = 14 } = {}) {
  const fwd = forwardVecPx(facing);
  const acr = acrossVecPx(facing);
  const baseX = centerX + fwd.x * forwardOffsetPx;
  const baseY = centerY + fwd.y * forwardOffsetPx;
  return ids.map((id, i) => {
    const row = Math.floor(i / cols);
    const col = i % cols;
    const acrossOffset = (col - (cols - 1) / 2) * gapPx;
    const rowOffset = row * gapPx;
    return {
      id,
      x: baseX + acr.x * acrossOffset - fwd.x * rowOffset,
      y: baseY + acr.y * acrossOffset - fwd.y * rowOffset,
      facing,
    };
  });
}

function interiorColorParty(originX, originY, facing) {
  const c = squareInteriorCenter(originX, originY, facing);
  const ids = COLOR_PARTY.map((p) => p.id);
  return gridCluster(ids, c.x, c.y, facing, { forwardOffsetPx: 16, cols: 3, gapPx: 12 });
}
function interiorFieldAndStaff(originX, originY, facing) {
  const c = squareInteriorCenter(originX, originY, facing);
  const ids = FIELD_AND_STAFF.map((p) => p.id);
  return gridCluster(ids, c.x, c.y, facing, { forwardOffsetPx: -16, cols: 2, gapPx: 12 });
}

/** Colour party + field & staff at their normal MARCHING COLUMN posts
 * (reusing part-v/colorPartyPosts.js's shared helpers), for any keyframe
 * where the square has not yet formed (or has already been reduced). */
function columnColorAndStaff(positions) {
  return [...buildColorParty(positions, { forwardPaces: 0 }), ...buildFieldAndStaff(positions, {})];
}

/** Assemble one keyframe's full 386-id positions array: company soldiers +
 * colour party (6) + field & staff (4). */
function withActors(companyPositions, colorAndStaff) {
  return [...companyPositions, ...colorAndStaff];
}

// ---------------------------------------------------------------------------
// 'from-half-distance' -- Sections 1-2 (¶999-1028)
// ---------------------------------------------------------------------------
function buildFromHalfDistanceKeyframes(battalion) {
  const originX = ORIGIN_X_HALF, originY = ORIGIN_Y_HALF, facing = FACING;
  const divisions = buildDivisions(battalion);

  const columnPositions = columnOfCompanies(divisions, { originX, originY, facing, distanceMode: 'half' });
  const columnFrame = withActors(columnPositions, columnColorAndStaff(columnPositions));

  const squarePositions = formSquare(battalion, { originX, originY, facing, faceDistance: SQUARE_FACE_DISTANCE });
  // Divisions 2 & 3 (companies 3-6) split by company and wheel 90 degrees
  // into the side walls; division 4 (companies 7-8) closes up and faces
  // about. Division 1 (companies 1-2) is the front face and, per ¶1009,
  // "stands fast" -- its column position and square position are
  // mathematically identical by construction (both anchor company 1's file
  // 1 at (originX, originY, facing)), so no interpolation is needed for it.
  const midWheel = withActors(
    cascadeBlend(columnPositions, squarePositions, { 0: 1, 1: 0.5, 2: 0.5, 3: 0.35 }, groupOfId),
    columnColorAndStaff(columnPositions),
  );
  // Square closed, but the colour party/field & staff have not yet "entered
  // the square" (¶1013-1016 is a separate, later command) -- they remain at
  // their column posts.
  const squareNotPosted = withActors(squarePositions, columnColorAndStaff(columnPositions));
  const posted = withActors(squarePositions, [
    ...interiorColorParty(originX, originY, facing),
    ...interiorFieldAndStaff(originX, originY, facing),
  ]);

  return [
    {
      label: 'Column by company, half distance, right in front, halted',
      description:
        'The battalion stands in column by company at half distance, right in front, halted, divisions already formed. The colonel is about to form square.',
      caseyRef: '¶999',
      duration: 0,
      positions: columnFrame,
      annotations: [],
    },
    {
      label: '1. Form square — dispositions begin',
      description:
        'File closers of the 4th division pass by the outer flanks of their companies and place themselves 2 paces before the front rank, faced toward the head of the column. The music places itself at platoon distance behind the inner platoons of the 2nd division. The lieutenant-colonel and senior major face the guides and align them on the 4th division\'s guides, who stand fast, pieces inverted.',
      caseyRef: '¶1000-1003',
      duration: 1200,
      positions: columnFrame,
      annotations: [],
    },
    {
      label: '2. Right and left into line, wheel — captains caution their companies',
      description:
        'The chief of the 1st division cautions it to stand fast. Captains of the 2nd and 3rd divisions place themselves before the centres of their companies and caution that the right companies will wheel to the right, the left companies to the left. The colour-bearer steps back into the file closers, replaced by the corporal of his file. The chief of the 4th division commands "Fourth division, forward — guide left" and posts himself outside its left flank; the junior major commands "Skirmishers forward — guide centre."',
      caseyRef: '¶1004-1008',
      duration: 1200,
      positions: columnFrame,
      annotations: [],
    },
    {
      label: '3. MARCH — divisions wheel and close',
      description:
        'The 1st division stands fast (its outer files facing to their own flanks to cap the front corners, not separately modeled). The right companies of the 2nd and 3rd divisions (3 and 5) wheel to the right into line; the left companies (4 and 6) wheel to the left. The music advances a company front. The 4th division closes up, halts, faces about, and aligns by the rear rank on its guides.',
      caseyRef: '¶1009-1011',
      duration: 2200,
      positions: midWheel,
      annotations: [],
    },
    {
      label: 'Square closed',
      description:
        'The hollow rectangle is complete: the 1st division is the unchanged front face, the 4th division (faced about) is the rear face, and the split companies of the 2nd and 3rd divisions form the right and left walls. The colour party and field & staff have not yet entered the square.',
      caseyRef: '¶1012',
      duration: 900,
      positions: squareNotPosted,
      annotations: [],
    },
    {
      label: 'Guides — POSTS: square formed, interior manned',
      description:
        'The chiefs of the 1st and 4th divisions, and the guides of all divisions, enter the square. The lieutenant-colonel posts behind the left of the 1st division, the senior major behind its right, the junior major in rear of the skirmishers\' centre. Per ¶1018: "the first division will always be the first front... the last division, the fourth front" -- the front-naming rule this whole geometry follows.',
      caseyRef: '¶1013-1018',
      duration: 1200,
      positions: posted,
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// 'from-full-distance' -- Sections 3-4 (¶1029-1048): normalize distance,
// then delegate to the same wheel/close geometry as 'from-half-distance'.
// ---------------------------------------------------------------------------
function buildFromFullDistanceKeyframes(battalion) {
  const originX = ORIGIN_X_FULL, originY = ORIGIN_Y_FULL, facing = FACING;
  const divisions = buildDivisions(battalion);

  const fullColumn = columnOfCompanies(divisions, { originX, originY, facing, distanceMode: 'full' });
  const fullFrame = withActors(fullColumn, columnColorAndStaff(fullColumn));

  const halfColumn = columnOfCompanies(divisions, { originX, originY, facing, distanceMode: 'half' });
  // Division 1 never moves (its full- and half-distance positions are both
  // anchored at (originX, originY, facing)); divisions 2-4 close toward it.
  const closingMid = withActors(
    cascadeBlend(fullColumn, halfColumn, { 1: 0.5, 2: 0.5, 3: 0.5 }, groupOfId),
    columnColorAndStaff(fullColumn),
  );
  const halfFrame = withActors(halfColumn, columnColorAndStaff(halfColumn));

  const squarePositions = formSquare(battalion, { originX, originY, facing, faceDistance: SQUARE_FACE_DISTANCE });
  const midWheel = withActors(
    cascadeBlend(halfColumn, squarePositions, { 0: 1, 1: 0.5, 2: 0.5, 3: 0.35 }, groupOfId),
    columnColorAndStaff(halfColumn),
  );
  const posted = withActors(squarePositions, [
    ...interiorColorParty(originX, originY, facing),
    ...interiorFieldAndStaff(originX, originY, facing),
  ]);

  return [
    {
      label: 'Column by company, full distance, right in front, halted',
      description:
        'The battalion stands in column by company at full distance, right in front, halted. The colonel commands "To form square."',
      caseyRef: '¶1029',
      duration: 0,
      positions: fullFrame,
      annotations: [],
    },
    {
      label: '2. To half distance, close column — MARCH',
      description:
        'The column closes from full to company (half) distance; the 2nd division takes its distance from the rear rank of the 1st. The senior major places himself on the right of the column, abreast the 1st division; the music takes its position as prescribed for the halted half-distance case.',
      caseyRef: '¶1031-1033',
      duration: 2000,
      positions: closingMid,
      annotations: [],
    },
    {
      label: 'Half distance reached',
      description:
        'The moment the 4th division halts at half distance, its file closers place themselves before the front rank. Dispositions are complete: the colonel now forms square by the same commands and means used from a halted half-distance start.',
      caseyRef: '¶1034',
      duration: 900,
      positions: halfFrame,
      annotations: [],
    },
    {
      label: 'Form square — divisions wheel and close',
      description:
        'Executed exactly as the halted half-distance case (¶999 and following): the 1st division stands fast as the front face; the right/left companies of the 2nd and 3rd divisions wheel into the side walls; the 4th division closes, faces about, and becomes the rear face.',
      caseyRef: '¶999-1012 (delegated per ¶1034)',
      duration: 2200,
      positions: midWheel,
      annotations: [],
    },
    {
      label: 'Guides — POSTS: square formed, interior manned',
      description:
        'The square is complete and the colour party, field & staff, and guides take their interior posts, exactly as the half-distance case.',
      caseyRef: '¶1013-1018',
      duration: 1200,
      positions: posted,
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// 'maneuver-in-square' -- Sections 5-6 (¶1049-1059): advance <30 paces as a
// rigid body, then halt. No wheel or reshape -- the front face marches in
// its own facing, the rear face (already about-faced) marches backward in
// its own facing, and the side faces (already faced outward) march "by the
// flank" (sideways relative to their own facing) -- exactly what a plain,
// facing-preserving translate() already produces.
// ---------------------------------------------------------------------------
function buildManeuverInSquareKeyframes(battalion) {
  const originX = ORIGIN_X_MAN, originY = ORIGIN_Y_MAN, facing = FACING;
  const squarePositions = formSquare(battalion, { originX, originY, facing, faceDistance: SQUARE_FACE_DISTANCE });
  const colorAtRest = interiorColorParty(originX, originY, facing);
  const staffAtRest = interiorFieldAndStaff(originX, originY, facing);
  const posted = withActors(squarePositions, [...colorAtRest, ...staffAtRest]);

  const ADVANCE_PACES = 20; // < 30-pace threshold that gates this "walk the
    // box" procedure vs. Section 7's "form column" procedure (¶1054/¶1060).
  const fwd = forwardVecPx(facing);
  const dx = fwd.x * ADVANCE_PACES * PACE_PX;
  const dy = fwd.y * ADVANCE_PACES * PACE_PX;
  const advanced = withActors(
    translate(squarePositions, { dx, dy }),
    [...translate(colorAtRest, { dx, dy }), ...translate(staffAtRest, { dx, dy })],
  );

  return [
    {
      label: 'Square formed and halted, 1st front leading',
      description:
        'The square stands halted, fully faced outward: front and rear faces facing their original directions, the two side faces faced outward.',
      caseyRef: '¶1018',
      duration: 0,
      positions: posted,
      annotations: [],
    },
    {
      label: '1. By the first front, forward — captains reposition',
      description:
        'The chief of the 1st front commands "First division, forward — guide centre." The chief of the 2nd front faces it to the left and posts himself outside his left guide; the chief of the 3rd front faces it to the right and posts outside his covering sergeant; the chief of the 4th front faces it about and commands "Fourth division, forward — guide centre." The junior major commands "Skirmishers forward — guide centre."',
      caseyRef: '¶1050-1053',
      duration: 1200,
      positions: posted,
      annotations: [],
    },
    {
      label: '2. MARCH — the square advances as one body',
      description:
        `The whole square moves forward ${ADVANCE_PACES} paces (under the 30-pace threshold, in quick time only): the front face marches straight ahead, the rear face (faced about) marches backward in its own facing, and the two side faces march by the flank -- sideways relative to their own facing -- to keep their distances and stay attached at the corners. The lieutenant-colonel regulates the march from behind the file of direction.`,
      caseyRef: '¶1052-1055',
      duration: 2000,
      positions: advanced,
      annotations: [],
    },
    {
      label: 'Battalion — HALT',
      description:
        'The square halts at its new position. The 4th front (already faced about) and the 2nd/3rd fronts (already faced outward) require no further facing change; captains resume their places as in the static square. This same procedure applies advancing by any of the four fronts (¶1058) -- only the direction of travel differs.',
      caseyRef: '¶1056-1058',
      duration: 700,
      positions: advanced,
      annotations: [],
    },
  ];
}

// ---------------------------------------------------------------------------
// 'reduce-square' -- Sections 7 + 9 (¶1060-1088): "form column to advance
// further" and "reduce the square" are the same underlying unfold; Section 9
// adds one final step (restoring colour/staff/music to normal column posts).
// ---------------------------------------------------------------------------
function buildReduceSquareKeyframes(battalion) {
  const originX = ORIGIN_X_HALF, originY = ORIGIN_Y_HALF, facing = FACING; // exact geometric inverse of 'from-half-distance'
  const divisions = buildDivisions(battalion);

  const squarePositions = formSquare(battalion, { originX, originY, facing, faceDistance: SQUARE_FACE_DISTANCE });
  const squareColorStaff = [
    ...interiorColorParty(originX, originY, facing),
    ...interiorFieldAndStaff(originX, originY, facing),
  ];
  const squareFrame = withActors(squarePositions, squareColorStaff);

  const columnPositions = columnOfCompanies(divisions, { originX, originY, facing, distanceMode: 'half' });

  const midUnfold = withActors(
    cascadeBlend(squarePositions, columnPositions, { 0: 1, 1: 0.5, 2: 0.5, 3: 0.4 }, groupOfId),
    squareColorStaff, // actors have not been restored yet -- still at their square-interior posts
  );
  // Section 7's own end state (¶1068-1069): companies re-formed into column,
  // but colour/staff/music are "still square-flavored" -- not yet reset.
  const columnReformedInterim = withActors(columnPositions, squareColorStaff);
  // Section 9 (¶1086-1088): field & staff, colour-bearer, and music return
  // to their normal marching-column places.
  const reduced = withActors(columnPositions, columnColorAndStaff(columnPositions));

  return [
    {
      label: 'Square formed and halted',
      description: 'The battalion stands in square, halted. The colonel wishes to advance (or retreat) more than 30 paces, and so must first form column.',
      caseyRef: '¶1018 / ¶1060',
      duration: 0,
      positions: squareFrame,
      annotations: [],
    },
    {
      label: '1. Form column — dispositions begin',
      description:
        'The chief of the 1st front commands "First division, forward — guide left." The commander of the 4th front cautions it to stand fast. The commander of the 2nd front faces it to the left and commands "By company, by file left"; the commander of the 3rd front faces it to the right and commands "By company, by file right" -- each captain breaking the three leading files of his company to the rear as his front faces. Skirmishers are cautioned to stand fast.',
      caseyRef: '¶1061-1064',
      duration: 1200,
      positions: squareFrame,
      annotations: [],
    },
    {
      label: '3. MARCH — the side fronts wheel by file and rejoin behind the 1st front',
      description:
        'The 1st front marches forward half its own front, then halts and aligns by the left. The corresponding companies of the 2nd and 3rd fronts wheel by file left and right respectively and march to meet each other behind the centre of the 1st division, reconstituting the original 2nd/3rd divisions; the 4th front faces about, its file closers remaining before the front rank. (This per-file "wheel by file" curl is approximated here as a straight-line cascade -- see the file-header note on this known simplification.)',
      caseyRef: '¶1065-1067',
      duration: 2400,
      positions: midUnfold,
      annotations: [],
    },
    {
      label: 'Column re-formed',
      description:
        'The battalion stands once more in an ordinary column by company at half distance, right in front, headed by what was the 1st front. Right guides now preserve company distance as the directing guides. To reform square from here, the colonel gives the marching-case commands (¶1019).',
      caseyRef: '¶1068-1069',
      duration: 900,
      positions: columnReformedInterim,
      annotations: [],
    },
    {
      label: 'Reduce square: field & staff, colour, and music return to their normal column posts',
      description:
        'Executed as Section 7 above, but the file closers of the 4th front place themselves behind the rear rank the instant it faces about, and the field & staff, colour-bearer, and music return to their normal places in a marching column -- not the special square-interior positions.',
      caseyRef: '¶1086-1088',
      duration: 1200,
      positions: reduced,
      annotations: [],
    },
  ];
}

function rangeArr(from, to) {
  const out = [];
  for (let n = from; n <= to; n++) out.push(n);
  return out;
}

export default {
  id: 'form-square',
  title: 'To Form Square, and to Reduce It',
  part: 5,
  article: 14,
  caseyParagraphs: rangeArr(999, 1089),
  subMovements: [
    { id: 'from-half-distance', label: 'Form Square from Half Distance (Halted)' },
    { id: 'from-full-distance', label: 'Form Square from Full Distance' },
    { id: 'maneuver-in-square', label: 'Advance and Halt While in Square' },
    { id: 'reduce-square', label: 'Form Column to Advance Further / Reduce the Square' },
  ],
  commands: (subMovement) => {
    if (subMovement === 'from-full-distance') {
      return [
        { text: '1. To form square.', type: 'preparatory' },
        { text: '2. To half distance, close column.', type: 'preparatory' },
        { text: '3. MARCH (or double quick — MARCH).', type: 'execution' },
        { text: '1. Form square. 2. Right and left into line, wheel.', type: 'preparatory' },
        { text: '3. MARCH (or double quick — MARCH).', type: 'execution' },
        { text: 'Guides — POSTS.', type: 'execution' },
      ];
    }
    if (subMovement === 'maneuver-in-square') {
      return [
        { text: '1. By the first front, forward.', type: 'preparatory' },
        { text: '2. MARCH.', type: 'execution' },
        { text: '1. Battalion.', type: 'preparatory' },
        { text: '2. HALT.', type: 'execution' },
      ];
    }
    if (subMovement === 'reduce-square') {
      return [
        { text: '1. Form column.', type: 'preparatory' },
        { text: '3. MARCH (or double quick — MARCH).', type: 'execution' },
        { text: '1. Reduce square.', type: 'preparatory' },
        { text: '2. MARCH (or double quick — MARCH).', type: 'execution' },
      ];
    }
    return [
      { text: '1. Form square.', type: 'preparatory' },
      { text: '2. Right and left into line, wheel.', type: 'preparatory' },
      { text: '3. MARCH (or double quick — MARCH).', type: 'execution' },
      { text: 'Guides — POSTS.', type: 'execution' },
    ];
  },
  reenactorNotes:
    'This baseline case (¶999-1018) is the source of the 4-front hollow-rectangle geometry every later square-forming procedure in Article XIV reuses: the 1st division becomes the front face unchanged; the 4th division closes up, faces about, and becomes the rear face; the 2nd and 3rd divisions each split by company, the right company of each (3 and 5) wheeling to form the right wall, the left company of each (4 and 6) wheeling to form the left wall (¶1018). Casey gives FOUR ways to arrive at this same square (half distance halted, half distance marching, full distance, column by division in mass) -- this file animates the halted half-distance case (Section 1) in full choreographic detail and the full-distance case (Section 3) as a distance-closing step that delegates to the same wheel/close geometry (Section 3\'s own text: "executed by the commands and means prescribed No. 999 and following"); the marching-entry variant (Section 2, ¶1019-1028) and the column-by-division-in-mass variant (Section 4, ¶1039-1048) are geometrically identical to their halted counterparts per the spec\'s own complexity notes -- they differ only in officer choreography (guides detaching earlier, the anchor division halting itself in stride rather than already standing halted) that this project\'s engine has no distinct primitive for, so they are documented here rather than separately animated, matching the precedent set by part-iv/halfDistanceIntoLine.js and part-iv/massDeployment.js for comparable geometrically-identical entry variants. ' +
    'CORNER FILES (¶1009, ¶1011): Casey caps each of the four corners with a single FILE (2 soldiers) turning 90 degrees in place, not a whole company -- battalionFormations.js\'s formSquare() only models whole-company rigid transforms, so this file-level detail is not rendered; corners read as clean geometric joins instead. SKIRMISHERS AND MUSIC (¶1002-1003, 1012, 1024, 1042, 1046, 1071, 1078, 1088-1089): Casey stations two skirmisher platoon-columns and a music block inside the forming square, but this project has no separate skirmisher/music roster at battalion scale (all 8 companies are already fully consumed building the four square faces) -- consistent with the existing part-v/passDefileInRetreat.js and part-v/haltInRetreatFaceFront.js precedent, these actors are not separately rendered. COLOUR PARTY AND FIELD & STAFF interior placement (¶1013-1016, ¶1086-1088): Casey says these actors "enter the square" but never fixes an exact interior point for an 8-company battalion, so they are clustered at the square\'s geometric interior centre -- a documented interpretive choice, not a sourced position. ' +
    '"MANEUVER-IN-SQUARE" (¶1049-1059) is a straightforward rigid translation: a formed square advancing under 30 paces needs no wheel or reshape at all, because the front/rear faces already face along the line of march and the two side faces are already faced outward (so moving "by the flank" is just their own ordinary sideways translation) -- this project\'s existing translate() primitive (position-only, no facing change) reproduces it exactly. The 30-pace threshold (¶1054) is the dividing line against "REDUCE-SQUARE" (¶1060-1088, combining Section 7 "form column to advance further" and Section 9 "reduce the square" into one sequence, per the spec\'s own suggestion that Section 9 is just Section 7 plus a final colour/staff/music reset): a longer move requires first unfolding the square back into an ordinary column via a per-file "wheel by file" curl that the spec itself flags as "the genuinely hardest new primitive" in this whole article -- no such per-file arc-path primitive exists yet, so the unfold is approximated with cascadeBlend\'s straight-line position/shortest-facing interpolation (the same illustrative-cascade technique already used throughout part-iv/massDeployment.js for comparably complex peel/converge maneuvers); the START (square) and END (column) states are geometrically exact, only the in-between motion is stylized. ' +
    'OUT OF SCOPE: ¶1089 (rallying skirmishers on the battalion) and ¶1090-1105 ("to form square from line of battle") are documented here but not animated -- the latter is a precursor-column-PLOYING topic (deployed line -> column by division, or double column), a different mechanic from this file\'s square-forming geometry; whichever column shape it produces feeds directly into this file\'s own \'from-half-distance\' or \'from-full-distance\' sub-movements, so it belongs in a separate drill file, not duplicated here.',

  buildKeyframes: (_company, subMovement = 'from-half-distance', battalion = DEFAULT_BATTALION) => {
    if (subMovement === 'from-full-distance') return buildFromFullDistanceKeyframes(battalion);
    if (subMovement === 'maneuver-in-square') return buildManeuverInSquareKeyframes(battalion);
    if (subMovement === 'reduce-square') return buildReduceSquareKeyframes(battalion);
    return buildFromHalfDistanceKeyframes(battalion);
  },
};
