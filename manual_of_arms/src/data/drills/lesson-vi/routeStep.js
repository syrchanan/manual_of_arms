import { columnOfPlatoons, translate, addRandomJitter, rotatePoint } from '../../../engine/formations.js';
import { postColumnChiefsAndGuides } from '../../../engine/columnPosts.js';
import { SCALE, CANVAS } from '../../constants.js';

// ---------------------------------------------------------------------------
// Lesson Sixth, Article III (¶311-342): "To march the column in route and to
// execute the movements incident thereto."
//
// This drill picks up where Lesson V's "column of platoons" end-state (and
// Lesson VI Article I/II) leaves off: the company already broken into a
// column of platoons, right in front, halted. It animates the CORE sequence
// -- route step -> sustained route march -> cadenced step -> route step
// resumed -- covering ¶311-318. The many incidents Casey describes for a
// column already in route step (facing by the flank, ¶319-320; diminishing/
// increasing front by platoon or section, ¶321-329; undoubling/doubling
// files, ¶331-339; double-quick route marching, ¶340; halting/carrying
// arms, ¶341-342) are NOT animated -- they are separate movements layered on
// top of the route step, not the route step itself -- and are covered only
// in reenactorNotes below.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS.VIEW_W / 2;
const ORIGIN_Y = 200;
const PACE = SCALE.PACE_PX;
const FACING = 90; // column marches east, matching lesson-v/marchInColumn.js

// Rank-to-rank distance (front-rank knapsack to rear-rank breast):
//   - cadenced step, closed ranks: 16" = SCALE.RANK_GAP px (¶135, ¶316).
//   - route step: 1 pace = 28" = SCALE.PACE_PX px (¶313, ¶318).
const CADENCED_GAP = SCALE.RANK_GAP;
const ROUTE_GAP = PACE;

/**
 * columnOfPlatoons()/postColumnChiefsAndGuides() hard-code the cadenced-step
 * RANK_GAP between front and rear rank and don't expose it as a parameter,
 * so this drill re-spaces the rear rank (and, riding on it, the file
 * closers, to preserve their habitual 2-pace distance behind the rear rank
 * per ¶91) after the fact. The front rank -- and therefore the platoon
 * corners (of-cpt / fr-11) that postColumnChiefsAndGuides() reads chiefs'
 * and guides' posts from -- is untouched, so chiefs/guides remain correctly
 * posted regardless of rankGapPx.
 */
function adjustRankGap(positions, company, rankGapPx, facing) {
  const delta = rankGapPx - SCALE.RANK_GAP;
  if (delta === 0) return positions;
  const rosterById = new Map(company.map((c) => [c.id, c]));
  const offset = rotatePoint(0, delta, 0, 0, facing);
  return positions.map((s) => {
    const soldier = rosterById.get(s.id);
    if (soldier && (soldier.rank === 'rear' || soldier.rank === 'fileCloser')) {
      return { ...s, x: s.x + offset.x, y: s.y + offset.y };
    }
    return s;
  });
}

/** Build one full column-of-platoons frame (47 soldiers) at a given rank gap. */
function buildColumn(company, { originX, originY, rankGapPx }) {
  const raw = columnOfPlatoons(company, { originX, originY, facing: FACING });
  const spaced = adjustRankGap(raw, company, rankGapPx, FACING);
  return postColumnChiefsAndGuides(spaced);
}

export default {
  id: 'route-step',
  title: 'To March the Column in Route Step',
  lesson: 6,
  article: 3,
  caseyParagraphs: [
    311, 312, 313, 314, 315, 316, 317, 318, 319, 320, 321, 322, 323, 324, 325, 326, 327, 328, 329, 330, 331, 332,
    333, 334, 335, 336, 337, 338, 339, 340, 341, 342,
  ],
  commands: [
    { text: '1. Column, forward.', type: 'preparatory' }, // ¶312
    { text: '2. Guide, left (or right).', type: 'preparatory' }, // ¶312
    { text: '3. Route step.', type: 'preparatory' }, // ¶312
    { text: '4. MARCH.', type: 'execution' }, // ¶312-313
    { text: '1. Quick time.', type: 'preparatory' }, // ¶315
    { text: '2. MARCH.', type: 'execution' }, // ¶315-316
    { text: '1. Route step.', type: 'preparatory' }, // ¶317
    { text: '2. MARCH.', type: 'execution' }, // ¶317-318
  ],
  reenactorNotes:
    'Route step (¶311) was the habitual gait for columns on the road: 110 steps/minute, the same cadence as quick time, but with none of quick time\'s formality. At MARCH (¶312-313), the rear rank shortens its first few steps to open a full pace (28") of distance from the front rank -- measured breast-to-knapsack -- and the men come, without further command, to carry arms at will (or sling them muzzle-up); they are no longer required to keep the step, use the same foot, or stay silent, though the ranks must not intermix and the rear rank must not straggle. Changes of direction in route step are given by a simple caution from the captain, no formal commands (¶314), with the pivot man taking 14" steps instead of 9" to clear the wheeling point. To resume the cadenced step (¶315-316), pieces are first brought to the right shoulder, then "Quick time, MARCH": ranks close back to the standard 16" distance. To leave the cadenced step again (¶317-318), "Route step, MARCH": the front rank holds its 28" step while the rear rank gradually reopens to 28" distance; arms return to "at will." ' +
    'Incidents Casey describes for a column already marching in route step, NOT animated in this drill (each is a distinct movement layered on top of the route step, not a phase of it): marching by the flank in the same direction, by simple caution (¶319-320); diminishing and increasing front by platoon (¶321) or, if platoons are 12+ files wide, by section (¶322-329) -- sections are only ever formed in route, never in the manoeuvres (¶326); undoubling files to one or two ranks and re-doubling to two or four, each by the captain\'s command once the cadenced step is resumed (¶331-339); the same movements executed in double-quick time, about 1100 yards in 7 minutes (¶340); and, on halting, the rear rank closing up and the whole company shouldering arms (¶341), with pieces otherwise carried however the men find convenient so long as the muzzle stays up (¶342). ' +
    'Interpretive choices: (1) the drill opens from a HALTED column of platoons already formed (continuous with Lesson V\'s and Lesson VI\'s other column-of-platoons drills), rather than re-deriving the break-into-column from line of battle -- ¶312\'s own commands ("Column, forward... Route step... MARCH") presuppose exactly this starting condition. (2) ¶317-318\'s "back to route step" is included in the animated core (not treated as an unanimated incident) because it is explicitly cited alongside ¶311-316 as part of this movement\'s basic cadence/character/reversion cycle, giving the drill a natural, symmetric close.',

  buildKeyframes: (company) => {
    // --- KF1: halted column of platoons, ranks at their standing (cadenced, 16") distance. ---
    const halted = buildColumn(company, { originX: ORIGIN_X, originY: ORIGIN_Y, rankGapPx: CADENCED_GAP });

    // --- KF2: "Route step, MARCH" (¶312-313) -- the instant of stepping off. The
    // rear rank has already opened to the full 28" route-step distance; a short
    // step-off distance models "the two ranks will step off together."
    const stepOff = buildColumn(company, {
      originX: ORIGIN_X + 3 * PACE,
      originY: ORIGIN_Y,
      rankGapPx: ROUTE_GAP,
    });

    // --- KF3/KF4: sustained route-step march (¶311, ¶313 -- "the files will
    // march at ease"). Per the informal, non-cadenced character of the route
    // step, addRandomJitter() is applied ONCE to a single base state below;
    // the SAME jittered array is then reused/translated (not re-jittered) for
    // both frames, so each soldier's per-frame delta between KF3 and KF4 is
    // exactly the uniform march translation -- soldiers hold their individual
    // "at ease" offsets instead of visually teleporting between frames.
    const sustainedOriginX = ORIGIN_X + 3 * PACE + 10 * PACE;
    const sustainedBase = buildColumn(company, {
      originX: sustainedOriginX,
      originY: ORIGIN_Y,
      rankGapPx: ROUTE_GAP,
    });
    const sustainedJittered = addRandomJitter(sustainedBase, { maxPx: 4, maxDeg: 6 }); // called ONCE
    const sustained1 = sustainedJittered;
    const legDist = 10 * PACE;
    const sustained2 = translate(sustainedJittered, { dx: legDist, dy: 0 });

    // --- KF5: "Quick time, MARCH" (¶315-316) -- pieces to the right shoulder,
    // cadenced step resumed, ranks close back to the standard 16" distance.
    // Formal alignment returns, so this frame is a fresh (unjittered) build.
    const cadencedOriginX = sustainedOriginX + legDist + 6 * PACE;
    const cadenced = buildColumn(company, {
      originX: cadencedOriginX,
      originY: ORIGIN_Y,
      rankGapPx: CADENCED_GAP,
    });

    // --- KF6: "Route step, MARCH" resumed (¶317-318) -- front rank keeps its
    // 28" step; rear rank gradually reopens to 28" distance; arms return to
    // "at will." This is a separate occasion of informal marching from KF3/
    // KF4's, so it gets its own fresh addRandomJitter() call (there is no
    // following frame it must stay pixel-consistent with).
    const resumedOriginX = cadencedOriginX + 8 * PACE;
    const resumedBase = buildColumn(company, {
      originX: resumedOriginX,
      originY: ORIGIN_Y,
      rankGapPx: ROUTE_GAP,
    });
    const resumed = addRandomJitter(resumedBase, { maxPx: 4, maxDeg: 6 });

    return [
      {
        label: 'Column of platoons, halted',
        description:
          'The company, a subdivision of a column, right in front, stands halted in column of platoons, ranks closed to their standing 16-inch distance.',
        caseyRef: '¶312',
        duration: 1200,
        positions: halted,
        annotations: ['platoonDistance', 'guideLine'],
      },
      {
        label: 'Route step, MARCH',
        description:
          'At the commands "Column, forward. Guide, left (or right). Route step. MARCH," the two ranks step off together. The rear rank shortens its first steps to open a full pace (28 inches) of distance from the front rank, measured from the breasts of the rear-rank men to the knapsacks of the front. Arms come, without further command, to a carry at will (or are slung muzzle up); the step, foot, and silence of the cadenced march are no longer required.',
        caseyRef: '¶312-313',
        duration: 1400,
        positions: stepOff,
        annotations: ['marchArrow', 'guideLine'],
      },
      {
        label: 'Sustained route-step march',
        description:
          'The column continues in route step: the files march at ease, taking whatever step is comfortable, so long as the ranks do not intermix, the front rank does not get ahead of the guide, and the rear rank does not open too great a distance.',
        caseyRef: '¶311, ¶313',
        duration: 1600,
        positions: sustained1,
        annotations: ['marchArrow'],
      },
      {
        label: 'Sustained route-step march continues',
        description:
          'The informal, route-step march continues at the swiftness of 110 steps a minute -- the same cadence as quick time, but without its formality.',
        caseyRef: '¶311',
        duration: 1600,
        positions: sustained2,
        annotations: ['marchArrow'],
      },
      {
        label: 'Quick time, MARCH -- cadenced step resumed',
        description:
          'Pieces are first brought to the right shoulder; at "Quick time, MARCH," the men resume the cadenced step and close the ranks back to the standard 16-inch distance.',
        caseyRef: '¶315-316',
        duration: 1400,
        positions: cadenced,
        annotations: ['marchArrow', 'guideLine'],
      },
      {
        label: 'Route step, MARCH -- resumed',
        description:
          'At "Route step, MARCH," the front rank continues its 28-inch step while the rear rank gradually shortens its step to reopen the full pace of distance; arms return to a carry at will.',
        caseyRef: '¶317-318',
        duration: 1400,
        positions: resumed,
        annotations: ['marchArrow'],
      },
    ];
  },
};
