import { battalionLine } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION, FIELD_AND_STAFF, COLOR_PARTY, COLOR_COMPANY_INDEX } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article VI (S.B. ¶744-750): "To halt the battalion, marching in
// retreat, and to face it to the front" -- plus the symmetric case of a line
// switching INTO retreat without halting (¶747-749).
//
// Geometry approach: the physical layout of every soldier is computed ONCE
// at the battalion's "habitual" facing (FRONT_FACING = 0); the retreat state
// re-uses the identical x/y layout and only flips each soldier's `.facing`
// field to RETREAT_FACING (180) -- this mirrors the project's existing
// aboutFace() semantics exactly (see formations.js: "no position changes...
// what was the rear rank is now 'in front' by definition because the
// direction of march reversed"). Depths for the front/rear/file-closer ranks
// are therefore always measured along the SAME fixed axis (the FRONT_FACING
// depth axis), regardless of which facing is being rendered in a given
// keyframe -- only the color-party/captain/covering-sergeant DEPTH overrides
// differ between the two states, per ¶745's role-swap.
// ---------------------------------------------------------------------------

const { PACE_PX, RANK_GAP, FILE_CLOSER_GAP, FILE_INTERVAL } = SCALE;

const FRONT_FACING = 0;
const RETREAT_FACING = 180;

const DEPTH = {
  front: 0,
  rear: RANK_GAP,
  fileCloser: RANK_GAP + FILE_CLOSER_GAP,
};
// ¶736 cross-ref (Article V, dependency): color-bearer steps 6 paces beyond
// the file-closer line once the battalion is faced/marching in retreat.
const RETREAT_COLOR_DEPTH = DEPTH.fileCloser + 6 * PACE_PX;

const ORIGIN_X = CANVAS_BATTALION.VIEW_W / 2;
const ORIGIN_Y = 120;

const rankById = new Map(
  DEFAULT_BATTALION.flatMap((co) => co.soldiers.map((s) => [s.id, s.rank]))
);

/** Move a single soldier (by id) to a new depth along the fixed FRONT_FACING
 * depth axis, with an optional lateral (across-axis) nudge in px so
 * overlapping roles (captain/covering sergeant sharing the file-closer
 * line, ¶745) remain visually distinguishable. Only valid because `positions`
 * was built at FRONT_FACING -- see file header. */
function moveToDepth(positions, id, depthPx, acrossNudgePx = 0) {
  return positions.map((p) => {
    if (p.id !== id) return p;
    const curDepth = DEPTH[rankById.get(id)] ?? 0;
    return { ...p, y: p.y - curDepth + depthPx, x: p.x + acrossNudgePx };
  });
}

/** Midpoint of the color company's own file-1 and file-20 front-rank
 * soldiers -- the centre of that company's front-rank line, used as the
 * across-axis anchor for the color party regardless of which depth it is
 * placed at. */
function colorRankAnchor(positions) {
  const right = positions.find((p) => p.id === `c${COLOR_COMPANY_INDEX}-of-cpt`);
  const left = positions.find((p) => p.id === `c${COLOR_COMPANY_INDEX}-fr-20`);
  return { x: (right.x + left.x) / 2, y: (right.y + left.y) / 2 - DEPTH.front };
}

/** Battalion centre (across-axis midpoint of the whole line's front rank),
 * used to anchor the field-and-staff figures. */
function battalionCentre(positions) {
  const right = positions.find((p) => p.id === 'c1-of-cpt');
  const left = positions.find((p) => p.id === `c${DEFAULT_BATTALION.length}-fr-20`);
  return { x: (right.x + left.x) / 2, y: (right.y + left.y) / 2 - DEPTH.front, halfWidth: Math.abs(right.x - left.x) / 2 };
}

function colorPartyAt(anchor, depthPx, facing) {
  return [
    { id: 'color-bearer', x: anchor.x, y: anchor.y + depthPx, facing },
    { id: 'color-cpl-centre', x: anchor.x, y: anchor.y + depthPx + 6, facing },
    { id: 'color-cpl-right', x: anchor.x + FILE_INTERVAL, y: anchor.y + depthPx, facing },
    { id: 'color-cpl-left', x: anchor.x - FILE_INTERVAL, y: anchor.y + depthPx, facing },
    { id: 'guide-right', x: anchor.x + 3 * FILE_INTERVAL, y: anchor.y + depthPx, facing },
    { id: 'guide-left', x: anchor.x - 3 * FILE_INTERVAL, y: anchor.y + depthPx, facing },
  ];
}

/** Field-and-staff render as schematic markers -- Casey's own detailed posts
 * for these figures are Article V's (¶736 and following, out of this
 * article's paragraph range); they are shown here holding simple, stable
 * posts (colonel behind centre, lt-col/majors toward the flanks) so all
 * FIELD_AND_STAFF ids are always present and valid, without inventing
 * Article-V-specific choreography this drill does not source. */
function fieldAndStaffAt(centre, depthPx, facing) {
  return [
    { id: 'fs-col', x: centre.x, y: centre.y + depthPx + 6 * PACE_PX, facing },
    { id: 'fs-ltc', x: centre.x + centre.halfWidth * 0.5, y: centre.y + depthPx, facing },
    { id: 'fs-smaj', x: centre.x - centre.halfWidth * 0.5, y: centre.y + depthPx, facing },
    { id: 'fs-jmaj', x: centre.x, y: centre.y + depthPx - 3 * PACE_PX, facing },
  ];
}

/** Build the full 382-soldier battalion state for either the "front faced,
 * habitual" state or the "retreat faced, marching" state. */
function buildState(base, { retreat }) {
  const facing = retreat ? RETREAT_FACING : FRONT_FACING;
  let companies = base.map((p) => ({ ...p, facing }));

  // ¶745: captains and covering sergeants swap between their habitual
  // line-of-battle depths (front rank / rear rank, already the default
  // battalionLine() layout) and the retreat-marching posts ("covering
  // sergeants to the file-closer line... captains to what's now the leading
  // rank") -- both land near the file-closer depth in retreat, nudged apart
  // laterally so they remain visually distinct.
  if (retreat) {
    DEFAULT_BATTALION.forEach((co) => {
      companies = moveToDepth(companies, `c${co.index}-of-cpt`, DEPTH.fileCloser, 0);
      companies = moveToDepth(companies, `c${co.index}-nc-cov`, DEPTH.fileCloser, FILE_INTERVAL);
    });
  }

  const anchor = colorRankAnchor(base);
  const centre = battalionCentre(base);
  const colorDepth = retreat ? RETREAT_COLOR_DEPTH : DEPTH.front;
  const staffDepth = retreat ? DEPTH.fileCloser : DEPTH.front;

  return [
    ...companies,
    ...colorPartyAt(anchor, colorDepth, facing),
    ...fieldAndStaffAt(centre, staffDepth, facing),
  ];
}

export default {
  id: 'halt-in-retreat-face-front',
  title: 'To Halt the Battalion, Marching in Retreat, and to Face It to the Front',
  part: 5,
  article: 6,
  caseyParagraphs: [744, 745, 747, 748, 749],
  subMovements: [
    { id: 'haltAndFront', label: 'Halt and Face to the Front' },
    { id: 'aboutIntoRetreat', label: 'Face About into Retreat (Marching)' },
  ],
  commands: (subMovement) => {
    if (subMovement === 'aboutIntoRetreat') {
      return [
        { text: '1. Battalion, right about.', type: 'preparatory' },
        { text: '2. MARCH.', type: 'execution' },
      ];
    }
    return [
      { text: '1. Face to the front.', type: 'preparatory' },
      { text: '2. Battalion, about—FACE.', type: 'execution' },
    ];
  },
  reenactorNotes:
    "Two thin, symmetric drills sharing one geometry: the battalion's physical layout never changes shape, only which way every soldier faces and where the color party / captains / covering sergeants stand relative to the two ranks. 'Halt and Face to the Front' (¶744-745) starts with the battalion halted, marching-in-retreat-faced (rear rank functionally leading, color-bearer 6 paces beyond the file-closer line per Article V's ¶736 dependency) and, on 'about-FACE,' has the color-rank, general guides, captains, and covering sergeants retake their habitual line-of-battle places as the whole body faces to the front. 'Face About into Retreat' (¶747-749) is the inverse, triggered from a battalion marching forward in line: 'Battalion, right about. MARCH' faces the whole body to the rear without halting, and re-invokes the same ¶736 role-swap (captains to the new leading rank, covering sergeants to the file-closer line, color-bearer stepping out 6 paces beyond it, guides realigning) so the battalion continues marching at the same gait, now led by what was the rear rank. Field-and-staff (colonel/lt-col/majors) posts are shown schematically here, since their specific Article-V choreography falls outside this article's paragraph range (¶744-750) and is not reproduced. Skirmisher paragraphs ¶0-746 and ¶0-750 are out of scope (no skirmisher companies in this project's 8-company model).",

  buildKeyframes: (_company, subMovement, battalion = DEFAULT_BATTALION) => {
    const base = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FRONT_FACING });
    const frontFaced = buildState(base, { retreat: false });
    const retreatFaced = buildState(base, { retreat: true });

    if (subMovement === 'aboutIntoRetreat') {
      return [
        {
          label: 'Battalion marching forward in line',
          description:
            'The battalion advances in line of battle, front rank leading, faced and marching toward the enemy.',
          caseyRef: '¶747',
          duration: 0,
          positions: frontFaced,
          annotations: ['marchArrow'],
        },
        {
          label: 'Battalion, right about',
          description: 'The colonel gives the preparatory command; the battalion continues marching, awaiting MARCH.',
          caseyRef: '¶747',
          duration: 600,
          positions: frontFaced,
          annotations: ['marchArrow'],
        },
        {
          label: 'MARCH — faced to the rear, continuing in retreat',
          description:
            'At the command, the battalion faces to the rear and continues moving at the same gait, now led by the rear rank. The principles of ¶736 and following are observed: the color-bearer steps out 6 paces beyond the file-closer line, the general guides realign abreast him, the covering sergeants move to the file-closer line, and the captains take post at what is now the leading rank.',
          caseyRef: '¶747–748',
          duration: 1800,
          positions: retreatFaced,
          annotations: ['marchArrow'],
        },
      ];
    }

    return [
      {
        label: 'Battalion halted, faced and marching in retreat',
        description:
          'The battalion stands halted, still faced to the rear as when retiring: color-bearer 6 paces beyond the file-closer line, general guides abreast him, captains at the leading rank, covering sergeants at the file-closer line.',
        caseyRef: '¶744',
        duration: 0,
        positions: retreatFaced,
        annotations: [],
      },
      {
        label: 'Face to the front',
        description: 'The colonel gives the preparatory caution; the battalion remains faced in retreat, awaiting the command.',
        caseyRef: '¶744',
        duration: 600,
        positions: retreatFaced,
        annotations: [],
      },
      {
        label: 'Battalion, about—FACE',
        description:
          'At the command, the whole battalion faces about. The color-rank, general guides, captains, and covering sergeants all retake their habitual line-of-battle places, and the color-bearer repasses into the front rank.',
        caseyRef: '¶744–745',
        duration: 1400,
        positions: frontFaced,
        annotations: [],
      },
    ];
  },
};
