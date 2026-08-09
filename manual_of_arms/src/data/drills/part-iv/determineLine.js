import { columnOfCompanies } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Fourth, Article I (S.B. ¶463): "Manner of determining the line of
// battle."
//
// Per the spec (battalion-spec/part-fourth.md, Article I): this is NOT a
// maneuver. It is a surveying/staking procedure the colonel and
// lieutenant-colonel carry out BEFORE any of Articles II-IV's deployments --
// no commands are given to the battalion, and no soldier moves. Casey
// describes three interchangeable ways to mark the desired line:
//   1. Two markers, 80-100 paces apart, set directly on the line's direction.
//   2. One marker at the flank the line is to rest on, then a second toward
//      the opposite flank, a little less than a subdivision's front away.
//   3. Direction points chosen for both flanks first, then intermediate
//      points found between them (used when the flank points can't see each
//      other).
//
// INTERPRETIVE CHOICE: rather than fold this into another file's
// reenactorNotes (the task's other permitted option), it is implemented here
// as its own short, static drill: the battalion is shown halted in column,
// about to be deployed by Article II/III, while two annotation markers (and
// a dashed sight-line between them) illustrate whichever of the three
// staking methods the reader selects via subMovement. Soldier positions do
// NOT change between keyframes -- only the markers do -- which is the
// faithful rendering of "no troop movement." The marker separation shown on
// screen is compressed well below the real 80-100 pace figure (which would
// run off the 500px-tall canvas); the true distance is called out in the
// text instead of being drawn to scale.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 120;
const ORIGIN_Y = 260;
const FACING = 90; // column halted, marching east when it arrives to deploy

// Illustrative (not-to-scale) marker geometry, expressed as offsets from the
// column's own halted position, one per staking method.
const MARKER_LAYOUTS = {
  'two-points': {
    label: 'Two direction points, 80-100 paces apart',
    // Both markers set directly on the line's own direction (perpendicular
    // to the column's eventual facing), out ahead of the column.
    markers: [
      { dx: 90, dy: -60 },
      { dx: 90, dy: 160 },
    ],
  },
  'flank-then-length': {
    label: "One flank marker, then a point toward the opposite flank",
    // First marker at the flank the line will rest on; second a little less
    // than a subdivision's front further along, toward the opposite flank.
    markers: [
      { dx: 90, dy: -40 },
      { dx: 90, dy: 130 },
    ],
  },
  'both-flanks': {
    label: 'Both flank points first, intermediate points between them',
    // Both flanks marked first (wider apart, standing for the far flank
    // possibly being out of sight), with a third intermediate point.
    markers: [
      { dx: 90, dy: -80 },
      { dx: 90, dy: 100 },
      { dx: 90, dy: 210 },
    ],
  },
};

export default {
  id: 'determine-line-of-battle',
  title: 'Manner of Determining the Line of Battle',
  part: 4,
  article: 1,
  caseyParagraphs: [463],
  subMovements: [
    { id: 'two-points', label: '1. Two Direction Points' },
    { id: 'flank-then-length', label: '2. Flank Point, then Length' },
    { id: 'both-flanks', label: '3. Both Flanks First' },
  ],
  commands: [],
  reenactorNotes:
    "¶463 is staging, not a maneuver -- Casey gives no commands and no soldier moves; the colonel and lieutenant-colonel do this work alone, before the column is ever ordered into line by Article II or III. The battalion is shown here halted in column, in the state it will be in immediately before an Article II/III deployment; only the annotation markers change as the three methods are switched via the sub-movement selector, since positions do not change across keyframes. Method 1 sets two markers 80-100 paces apart directly on the line's own direction. Method 2 sets one marker at the flank the line is to rest on, then a second toward the opposite flank, a little less than a subdivision's front away -- useful for a shorter/faster stake-out. Method 3 sets direction points for both flanks first, then finds intermediate points between them by sighting -- used when the two flank points cannot see each other directly. The marker spacing drawn here is compressed for legibility; the true figures (80-100 paces for Method 1, 'a little less than the front of the subdivision' for Method 2) are per ¶463's own text, not to scale on screen.",

  buildKeyframes: (_company, subMovement = 'two-points', battalion = DEFAULT_BATTALION) => {
    const column = columnOfCompanies(battalion, {
      originX: ORIGIN_X,
      originY: ORIGIN_Y,
      facing: FACING,
      distanceMode: 'full',
    });

    const layout = MARKER_LAYOUTS[subMovement] ?? MARKER_LAYOUTS['two-points'];
    const markerAnnotations = layout.markers.map((m) => ({
      type: 'wheelingPoint',
      pivotX: ORIGIN_X + m.dx,
      pivotY: ORIGIN_Y + m.dy,
    }));

    return [
      {
        label: 'Column halted, awaiting the line to be staked',
        description:
          'The battalion stands halted in column, before any deployment is ordered. No command has yet been given -- this is the state Articles II-IV assume once the line of battle has been determined.',
        caseyRef: '¶463',
        duration: 0,
        positions: column,
        annotations: [],
      },
      {
        label: layout.label,
        description:
          'The colonel and lieutenant-colonel mark the desired line of battle on the ground before commanding any deployment. No soldier moves during this step; the markers shown are the ground points the battalion will later be dressed upon.',
        caseyRef: '¶463',
        duration: 1200,
        positions: column,
        annotations: markerAnnotations,
      },
    ];
  },
};
