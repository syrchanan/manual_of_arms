import { lineOfBattle, columnOfFiles } from '../../../engine/formations.js';
import { SCALE } from '../../constants.js';

// ORIGIN_Y=400 keeps the forming line (extending north to y≈210) and the column
// (extending south to y≈458 for file closers) both fully visible in the 600px canvas.
const ORIGIN_X = 200;
const ORIGIN_Y = 400;

export default {
  id: 'form-by-company',
  title: 'To Form by Company into Line; By Platoon into Line',
  lesson: 4,
  article: 5,
  caseyParagraphs: [155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170],
  // Wording varies by sub-movement (¶155 vs ¶164) — see DrillPage.jsx, which
  // calls drill.commands(subMovement) when commands is a function.
  commands: (subMovement = 'by-company') =>
    subMovement === 'by-platoon'
      ? [
          { text: '1. By platoon, into line.', type: 'preparatory' },
          { text: '2. MARCH.', type: 'execution' },
        ]
      : [
          { text: '1. By company, into line.', type: 'preparatory' },
          { text: '2. MARCH.', type: 'execution' },
        ],
  subMovements: [
    { id: 'by-company', label: 'A) By Company' },
    { id: 'by-platoon', label: 'B) By Platoon' },
  ],
  reenactorNotes:
    'A) By Company (¶155–163): at MARCH, the covering sergeant continues marching straight east — he is the anchor of the forming line, and because the captain is out of the ranks, the covering sergeant is considered to occupy the FRONT rank (not his usual rear rank) at file 1 (¶156–157, ¶163). All other men advance the right shoulder, take the double-quick step, and hustle north into their east-facing line positions, one after the other, closest files first (¶156). The captain does not move to the centre yet — at the instant the movement begins he merely "faces to his company in order to follow up the execution" (¶160), remaining at his march position at the head of the column and turning to watch the line grow. Only once the whole company has formed does he command "guide left," step out to two paces before the centre, and face to the front — the direction of march (¶160). At that same moment the second sergeant leaves the file closers and places himself in the front rank on the left to serve as guide, while the covering sergeant remains on the right (¶161). Since the twenty ordinary files already fill the line, the second sergeant\'s "left" post is treated as a supernumerary position one interval beyond file 20 — mirroring how the covering sergeant fills the captain\'s now-vacant file-1 slot on the right. ' +
    'B) By Platoon (¶164–169): both platoons start from the same single column of files used in By Company (¶164: "the company being in march by the flank") and execute simultaneously, each "according to the above principles" (¶165) — i.e. each platoon\'s captain/lieutenant watches from his march position until his own platoon is formed, then steps two paces before that platoon\'s centre and faces front. The right guide of the company (covering sergeant) becomes the guide of the 1st platoon, and the left guide (second sergeant) becomes the guide of the 2nd platoon (¶167); since the right is in front, each guide posts on his own platoon\'s LEFT flank (¶168). The second sergeant\'s post (2nd platoon\'s left flank) coincides with the company\'s true left flank, so it needs only the same supernumerary "file 21" treatment as in By Company. The covering sergeant\'s post (1st platoon\'s left flank), however, is the interior seam between the platoons, where every file slot is already occupied — so he "passes rapidly" (¶166) into a one-interval gap opened at the seam for exactly this purpose.',

  buildKeyframes: (company, subMovement = 'by-company') => {
    if (subMovement === 'by-platoon') return buildFormByPlatoon(company);
    return buildFormByCompany(company);
  },
};

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

/** Map file number → column depth index. File 1→0; files 2–3→1; …; file 20→10. */
function _fileDepthIndex(file) {
  if (file <= 1) return 0;
  return Math.floor((file - 2) / 2) + 1;
}

/**
 * Shift the column-of-files east by `paces` paces.
 * Shared by both sub-movements: by-company AND by-platoon start from the
 * IDENTICAL single 20-file column ("the company being in march by the [right]
 * flank," ¶155 and ¶164 alike) — the split into platoons is something that
 * happens as part of the forming movement itself, not a pre-existing state.
 * Each successive keyframe passes a larger pace count to show on-the-march execution.
 */
function _march(company, paces) {
  const dx = paces * SCALE.PACE_PX;
  const inColumn = columnOfFiles(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 90 });
  return inColumn.map((s) => ({ ...s, x: s.x + dx }));
}

/**
 * Compute line origin from the covering sergeant's march position.
 * In lineOfBattle(facing=90): rear rank is RANK_GAP px west of front rank.
 * lineOriginX = covSgt.x + RANK_GAP → cov sgt lands exactly at his march pos.
 * lineOriginY = covSgt.y (unchanged — he marches straight east).
 */
function _lineOrigin(marchPositions) {
  const cov = marchPositions.find((s) => s.id === 'nc-cov');
  return {
    ox: (cov?.x ?? ORIGIN_X) + SCALE.RANK_GAP,
    oy: cov?.y ?? ORIGIN_Y,
  };
}

/**
 * Build a partial-formation state: depth groups 1..(formedDepthCount−1) have
 * swung north into their east-facing line positions while the rest remain in column.
 *
 * Captain (¶160): "At the instant the movement begins, the captain will face
 * to his company in order to follow up the execution" — nothing in ¶156–159
 * (which describe only the covering sergeant, the front-rank men, and the
 * rear rank) mentions the captain moving anywhere at this stage. He remains
 * at his march position — the head of the column, one FILE_INTERVAL north of
 * the covering sergeant (see columnOfFiles) — and simply turns to observe.
 * INTERPRETATION: the engine only models 4 cardinal facings. The forming
 * line grows northward from the covering sergeant's anchor (file 1) out to
 * file 20, so "facing to his company" is rendered as due north (0°) — the
 * direction in which the files are visibly falling into line ahead of him.
 * He only moves to the centre and faces front once the company is fully
 * formed (see _finalCompanyLine, ¶160's "as soon as the company is formed").
 *
 * Covering sergeant (¶156): continues straight east — his march position IS his
 * line position (front rank, file 1, per ¶157/¶163) — no movement needed.
 */
function _buildPartialLine(marchPositions, company, ox, oy, formedDepthCount) {
  const allLine = lineOfBattle(company, { originX: ox, originY: oy, facing: 90 });
  const linePosMap = Object.fromEntries(allLine.map((p) => [p.id, p]));

  return marchPositions.map((s) => {
    const soldier = company.find((c) => c.id === s.id);
    if (!soldier) return s;

    // Captain: stays at his march position, turns to watch the company form (¶160).
    if (soldier.id === 'of-cpt') {
      return { ...s, facing: 0 };
    }

    // Covering sergeant: captain is out of line — promotes to front rank of file 1 (ox, oy).
    if (soldier.id === 'nc-cov') {
      return { ...s, x: ox, y: oy, facing: 90 };
    }

    const depth = _fileDepthIndex(soldier.file);

    // File closers: follow their depth group progressively (¶169).
    if (soldier.rank === 'fileCloser') {
      if (depth > 0 && depth < formedDepthCount) {
        return { ...(linePosMap[s.id] ?? s), facing: 90 };
      }
      return s;
    }

    // Front/rear rank: take line position when their depth group has formed.
    if (depth > 0 && depth < formedDepthCount) {
      return { ...(linePosMap[s.id] ?? s), facing: 90 };
    }

    return s; // still double-quicking north from column position
  });
}

/**
 * Build the fully-formed company line (¶160–163).
 *   - Captain: two paces before the centre of the company, facing the front
 *     (the direction of march), per ¶160.
 *   - Covering sergeant: REMAINS in the front rank at file 1 (the right) —
 *     ¶161 says he "remains there" rather than yielding the slot back to the
 *     captain, who is now out front at the centre instead of in the line.
 *   - Second sergeant: front rank, on the left, to serve as guide (¶161).
 *     INTERPRETATION: files 1–20 already have their full complement of
 *     privates at file 20 (fr-20/rr-20) — unlike file 1, whose front-rank
 *     slot is genuinely vacant because the captain stepped out of it. The
 *     second sergeant's post is therefore modeled as a supernumerary
 *     position one FILE_INTERVAL beyond file 20 ("file 21"), mirroring how
 *     the covering sergeant anchors the right at file 1.
 */
function _finalCompanyLine(company, ox, oy) {
  const FI = SCALE.FILE_INTERVAL;
  const base = lineOfBattle(company, { originX: ox, originY: oy, facing: 90 });

  return base.map((p) => {
    if (p.id === 'of-cpt') {
      return { ...p, x: ox + 2 * SCALE.PACE_PX, y: oy - 9.5 * FI, facing: 90 };
    }
    if (p.id === 'nc-cov') {
      return { ...p, x: ox, y: oy, facing: 90 };
    }
    if (p.id === 'fc-2sg') {
      return { ...p, x: ox, y: oy - 20 * FI, facing: 90 };
    }
    return p;
  });
}

// ---------------------------------------------------------------------------
// Sub-movement A: Form by company into line (¶155–163)
// ---------------------------------------------------------------------------

/**
 * Geometry (ORIGIN_X=200, ORIGIN_Y=400):
 *
 *   columnOfFiles(facing=90): cov sgt at (ORIGIN_X, 400); captain at (ORIGIN_X, 390).
 *   After N paces east, cov sgt at (ORIGIN_X + N×PACE_PX, 400).
 *
 *   Line anchor: lineOriginX = covSgt.x + RANK_GAP; lineOriginY = 400.
 *   lineOfBattle(facing=90): files spread NORTH (−y); rear rank RANK_GAP west (−x) of front.
 *     cov sgt (rear, file 1) → covSgt.x ✓; file 20 front → (lineOriginX, 210) ✓.
 *
 *   Six frames advance the company progressively further east:
 *     Frame 1 (col. march)  — 10 paces: cov sgt at x=340, lineOriginX=347
 *     Frame 2 (mid-form)    — 12 paces: cov sgt at x=368, lineOriginX=375
 *     Frame 3 (mid-form)    — 14 paces: cov sgt at x=396, lineOriginX=403
 *     Frame 4 (mid-form)    — 16 paces: cov sgt at x=424, lineOriginX=431
 *     Frame 5 (formed)      — 18 paces: cov sgt at x=452, lineOriginX=459
 *     Frame 6 (march in ln) — 22 paces: cov sgt at x=508, lineOriginX=515
 *
 *   All positions within 960×600 canvas ✓.
 *
 *   Formed-frame captain: x = lineOriginX + 28, y = lineOriginY − 95 (centre of the
 *   20-file line, 2 paces ahead), facing 90 (¶160).
 *   Formed-frame 2nd sergeant ("file 21"): x = lineOriginX, y = lineOriginY − 200 (¶161).
 */
function buildFormByCompany(company) {
  // Six frames, each advancing 2–4 paces east to show the maneuver on the march.
  // formedDepthCount drives how many depth groups have swung north into line:
  //   3 → files 2–5 (4 files)   6 → files 2–11 (10 files)   9 → files 2–17 (16 files)
  const m1 = _march(company, 10); // column marching
  const m2 = _march(company, 12); // command given — first files forming
  const m3 = _march(company, 14); // halfway through
  const m4 = _march(company, 16); // most files formed
  const m5 = _march(company, 18); // fully formed
  const m6 = _march(company, 22); // continued march

  const { ox: ox2, oy: oy2 } = _lineOrigin(m2);
  const { ox: ox3, oy: oy3 } = _lineOrigin(m3);
  const { ox: ox4, oy: oy4 } = _lineOrigin(m4);
  const { ox: ox5, oy: oy5 } = _lineOrigin(m5);
  const { ox: ox6, oy: oy6 } = _lineOrigin(m6);

  return [
    {
      label: 'Marching by the right flank',
      description:
        'The company marches in column of files (4 abreast, 10 deep), heading east. The captain marches at the head of the column, one file-interval north of the covering sergeant, who leads at the guide position.',
      caseyRef: '¶155',
      duration: 1500,
      positions: m1,
      annotations: ['marchArrow'],
    },
    {
      label: 'MARCH — covering sergeant anchors, first files swing out',
      description:
        'At the command, the covering sergeant continues straight east as right-flank anchor and is considered to occupy the front rank of file 1. The captain stays at the head of the column and turns to face his company, watching the execution (¶160) — he does not move to the centre yet. The nearest files (2–5) advance the right shoulder and double-quick north into line.',
      caseyRef: '¶156–160',
      duration: 1200,
      positions: _buildPartialLine(m2, company, ox2, oy2, 3),
      annotations: [],
    },
    {
      label: 'Formation continues — files 2–11 on line',
      description:
        'Each succeeding depth group swings north into line as it reaches the pivot. The rear rank follows its file leader without rushing to arrive at the same time (¶158). The captain still watches from the head of the column; the whole company continues advancing east.',
      caseyRef: '¶156–158',
      duration: 1200,
      positions: _buildPartialLine(m3, company, ox3, oy3, 6),
      annotations: [],
    },
    {
      label: 'Formation continues — files 2–17 on line',
      description:
        'The cascade continues: files 12–17 swing north into their line positions. Only the two rearmost depth groups remain in column.',
      caseyRef: '¶156–158',
      duration: 1200,
      positions: _buildPartialLine(m4, company, ox4, oy4, 9),
      annotations: [],
    },
    {
      label: 'Company formed — guide left',
      description:
        'All files have taken their east-facing line positions. The captain now commands "guide left," steps out to two paces before the centre of the company, and faces to the front (¶160). The covering sergeant remains in the front rank at file 1 as right guide; the second sergeant leaves the file closers to post at the left, one interval beyond file 20, as left guide (¶161).',
      caseyRef: '¶160–161',
      duration: 1500,
      positions: _finalCompanyLine(company, ox5, oy5),
      annotations: ['marchArrow'],
    },
    {
      label: 'Continued march in line',
      description:
        'The company advances in line of battle facing east, the captain leading two paces before the centre and taking the step of the company. The covering sergeant and second sergeant serve as right and left guides at the flanks of the front rank (¶163).',
      caseyRef: '¶162–163',
      duration: 1500,
      positions: _finalCompanyLine(company, ox6, oy6),
      annotations: ['marchArrow'],
    },
  ];
}

// ---------------------------------------------------------------------------
// Sub-movement B: Form by platoon into line (¶164–169)
// ---------------------------------------------------------------------------

/**
 * Build a partial-formation state for form-by-platoon.
 *
 * Both platoons form simultaneously, "according to the above principles"
 * (¶165) — i.e. the same ¶156–160 timing applies independently to each:
 * the captain (1st platoon) and the 1st lieutenant (2nd platoon) do not
 * move to their platoon's centre until that platoon is fully formed.
 *
 * The 1st lieutenant has no special mid-formation treatment here: unlike
 * the captain, he is not normally posted at the head of a column — in the
 * marching company he is an ordinary file closer (opposite the centre of
 * the 4th section, file 18) — so during formation he is simply carried
 * along by the generic file-closer handling below, like any other file
 * closer, until the final frames move him to 2nd platoon's centre.
 *
 * Platoon depth logic:
 *   Plt 1 local depth = global depth (file 1 = depth 0, files 2–3 = depth 1, …)
 *   Plt 2 local depth = global depth − PLT2_BASE_DEPTH (file 11 = depth 5 = local 0)
 *   formedLocalDepthCount=3 → plt 1 local depths 1–2 (files 2–7) +
 *                               plt 2 local depths 1–2 (files 12–15) formed.
 */
function _buildPartialLinePlatoon(marchPositions, company, ox, oy, formedLocalDepthCount) {
  const allLine = lineOfBattle(company, { originX: ox, originY: oy, facing: 90 });
  const linePosMap = Object.fromEntries(allLine.map((p) => [p.id, p]));

  const PLT2_BASE_DEPTH = 5;

  return marchPositions.map((s) => {
    const soldier = company.find((c) => c.id === s.id);
    if (!soldier) return s;

    // Captain: stays at his march position (head of column), turns to watch
    // 1st platoon form (¶160, imported by ¶165). Moves to centre only once formed.
    if (soldier.id === 'of-cpt') {
      return { ...s, facing: 0 };
    }

    // Covering sergeant: captain is out of plt 1 — promotes to front rank of file 1 (ox, oy).
    if (soldier.id === 'nc-cov') {
      return { ...s, x: ox, y: oy, facing: 90 };
    }

    const depth = _fileDepthIndex(soldier.file);

    if (soldier.rank === 'fileCloser') {
      if (soldier.platoon === 1 && depth > 0 && depth < formedLocalDepthCount) {
        return { ...(linePosMap[s.id] ?? s), facing: 90 };
      }
      if (soldier.platoon === 2) {
        const localDepth = depth - PLT2_BASE_DEPTH;
        if (localDepth > 0 && localDepth < formedLocalDepthCount) {
          return { ...(linePosMap[s.id] ?? s), facing: 90 };
        }
      }
      return s;
    }

    // Platoon 1: formed local depths take line positions.
    if (soldier.platoon === 1 && depth > 0 && depth < formedLocalDepthCount) {
      return { ...(linePosMap[s.id] ?? s), facing: 90 };
    }

    // Platoon 2: formed local depths take line positions.
    if (soldier.platoon === 2) {
      const localDepth = depth - PLT2_BASE_DEPTH;
      if (localDepth > 0 && localDepth < formedLocalDepthCount) {
        return { ...(linePosMap[s.id] ?? s), facing: 90 };
      }
    }

    return s;
  });
}

/**
 * Build the fully-formed by-platoon line (¶165–169).
 *
 * Both platoons form onto the same continuous line used in By Company, but
 * each has its own chief two paces before its own centre, facing front
 * (¶165), and each has exactly one guide, posted on its LEFT flank since the
 * right is in front (¶168):
 *   - 1st platoon's guide = covering sergeant, the company's right guide
 *     (¶167). His post is 1st platoon's LEFT flank — the interior seam
 *     between the platoons — so he "passes rapidly" there (¶166).
 *   - 2nd platoon's guide = second sergeant, the company's left guide
 *     (¶167). His post (2nd platoon's left flank) coincides with the
 *     company's own true left flank, so he needs the same "file 21"
 *     treatment used in By Company.
 *
 * INTERPRETATION: the interior seam (between files 10 and 11) has no spare
 * room the way the true flanks do — both neighboring files are ordinary,
 * fully-occupied privates. We open a one-FILE_INTERVAL gap at the seam
 * (shifting 2nd platoon and its file closers one interval further along the
 * line) so the covering sergeant has an actual slot to occupy without
 * displacing anyone. This shift is applied only in these final, formed
 * frames — modeling ¶166's "pass rapidly" as a distinct snap into position
 * at the guide-left command, rather than a gradual cascade.
 */
function _finalPlatoonLine(company, ox, oy) {
  const FI = SCALE.FILE_INTERVAL;
  const SEAM = FI; // one-file gap opened at the interior seam for the 1st platoon's guide
  const base = lineOfBattle(company, { originX: ox, originY: oy, facing: 90 });

  return base.map((p) => {
    const soldier = company.find((c) => c.id === p.id);
    if (!soldier) return p;

    if (soldier.id === 'of-cpt') {
      // Two paces before the centre of 1st platoon (files 1–10), facing front.
      return { ...p, x: ox + 2 * SCALE.PACE_PX, y: oy - 4.5 * FI, facing: 90 };
    }
    if (soldier.id === 'nc-cov') {
      // Guide of 1st platoon: passes to 1st platoon's left flank, the seam (¶166–168).
      return { ...p, x: ox, y: oy - 10 * FI, facing: 90 };
    }
    if (soldier.id === 'fc-1lt') {
      // Two paces before the centre of 2nd platoon (files 11–20, seam-shifted), facing front.
      return { ...p, x: ox + 2 * SCALE.PACE_PX, y: oy - 15.5 * FI, facing: 90 };
    }
    if (soldier.id === 'fc-2sg') {
      // Guide of 2nd platoon: 2nd platoon's left flank = the company's true
      // left flank (seam-shifted) — the "file 21" treatment, as in By Company.
      return { ...p, x: ox, y: oy - 21 * FI, facing: 90 };
    }
    // All other 2nd-platoon members (front/rear rank + file closers) shift
    // one interval further along the line to open the seam.
    if (soldier.platoon === 2) {
      return { ...p, y: p.y - SEAM };
    }
    return p;
  });
}

/**
 * Starting formation: the SAME single column of files used by By Company
 * (¶164: "the company being in march by the flank"). There is no pre-existing
 * split into two platoon columns — the split into 1st and 2nd platoon lines
 * happens progressively, as part of the forming movement itself, via the
 * per-platoon depth cascade in _buildPartialLinePlatoon.
 *
 * Frame 2 numeric trace (12 paces, m2 = _march(company, 12)):
 *   nc-cov (file 1, head of column): x = ORIGIN_X + 168 = 368, y = 400
 *     → lineOriginX = 376, lineOriginY = 400
 *   Captain: stays at his march position (x=368, y=390), faces north (0°).
 *   1st platoon local depths 1 (files 2–3) formed at x=376, y=390/380.
 *   2nd platoon local depths 1 (files 12–13) formed at x=376, y=290/280.
 *   Remaining files still double-quicking north from column position.
 */
function buildFormByPlatoon(company) {
  // Six frames, each advancing 2–4 paces east.
  // formedLocalDepthCount drives how many local depth groups have formed per platoon:
  //   2 → local depth 1 (files 2–3 plt1, 12–13 plt2)
  //   3 → local depths 1–2 (files 2–7 plt1, 12–15 plt2)
  //   5 → local depths 1–4 (files 2–9 plt1, 12–19 plt2)
  const m1 = _march(company, 10);
  const m2 = _march(company, 12);
  const m3 = _march(company, 14);
  const m4 = _march(company, 16);
  const m5 = _march(company, 18);
  const m6 = _march(company, 22);

  const { ox: ox2, oy: oy2 } = _lineOrigin(m2);
  const { ox: ox3, oy: oy3 } = _lineOrigin(m3);
  const { ox: ox4, oy: oy4 } = _lineOrigin(m4);
  const { ox: ox5, oy: oy5 } = _lineOrigin(m5);
  const { ox: ox6, oy: oy6 } = _lineOrigin(m6);

  return [
    {
      label: 'Marching by the right flank',
      description:
        'The company marches in a single column of files (4 abreast, 10 deep) by the right flank — the identical column used when forming by company. The split into two platoon fronts happens only after the instructor orders the captain to form by platoon (¶164).',
      caseyRef: '¶164',
      duration: 1500,
      positions: m1,
      annotations: ['marchArrow'],
    },
    {
      label: 'MARCH — chiefs watch, first files of each platoon swing out',
      description:
        'Both platoons execute simultaneously, each according to the same principles as forming by company (¶165). The captain stays at the head of the column and turns to watch 1st platoon form; the covering sergeant continues straight east, occupying 1st platoon\'s front rank at file 1. The 1st lieutenant, an ordinary file closer during the march, is carried along with the file closers for now. The nearest files of each platoon (2–3 and 12–13) begin swinging north into line.',
      caseyRef: '¶165',
      duration: 1200,
      positions: _buildPartialLinePlatoon(m2, company, ox2, oy2, 2),
      annotations: [],
    },
    {
      label: 'Formation continues — files 2–7 and 12–15 on line',
      description:
        'Both platoon clusters grow simultaneously. Each successive depth group swings north as it reaches its position. The rear rank follows its file leader (¶158).',
      caseyRef: '¶165–166',
      duration: 1200,
      positions: _buildPartialLinePlatoon(m3, company, ox3, oy3, 3),
      annotations: [],
    },
    {
      label: 'Formation continues — files 2–9 and 12–19 on line',
      description:
        'Nearly complete. Only the rearmost depth group of each platoon remains in column. Both platoon clusters are almost fully formed.',
      caseyRef: '¶165–166',
      duration: 1200,
      positions: _buildPartialLinePlatoon(m4, company, ox4, oy4, 5),
      annotations: [],
    },
    {
      label: 'Both platoons formed — guide left',
      description:
        'Both platoons are in east-facing line. The captain and the 1st lieutenant, without waiting for each other, each command "guide left" as their own platoon completes, then step out two paces before their platoon\'s centre, facing front (¶165). The covering sergeant, 1st platoon\'s guide, passes rapidly into a one-file gap opened at the seam between the platoons (¶166–168); the second sergeant, 2nd platoon\'s guide, posts at the company\'s true left flank.',
      caseyRef: '¶165–168',
      duration: 1500,
      positions: _finalPlatoonLine(company, ox5, oy5),
      annotations: ['marchArrow'],
    },
    {
      label: 'Continued march in line',
      description:
        'The company advances in line of battle facing east, organized as two platoons, each led by its own chief and guide. File closers have followed their respective platoons throughout (¶169).',
      caseyRef: '¶168–169',
      duration: 1500,
      positions: _finalPlatoonLine(company, ox6, oy6),
      annotations: ['marchArrow'],
    },
  ];
}
