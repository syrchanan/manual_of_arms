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
  commands: [
    { text: '1. By company, into line.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],
  subMovements: [
    { id: 'by-company', label: 'A) By Company' },
    { id: 'by-platoon', label: 'B) By Platoon' },
  ],
  reenactorNotes:
    'A) By Company (¶155–163): at MARCH, the covering sergeant continues marching straight east — he is the anchor of the forming line. Because the captain is out of line, the covering sergeant is considered to be in the FRONT RANK (not rear rank) until the captain resumes his place. The captain runs north to what he estimates will be the centre of the company once formed, places himself a step ahead (east) of the front rank, and faces west to supervise. All other men advance the right shoulder, take the double-quick step, and hustle north into their east-facing line positions, one after the other, closest files first (¶156). Once the company is formed, the captain resumes his place at front rank file 1 and commands "guide left" (¶160–161). ' +
    'B) By Platoon (¶164–169): both platoons execute simultaneously. The same rule applies: when the captain is out of plt 1, the covering sergeant takes the front rank. When the 1st lt is out of plt 2, the rightmost file of plt 2 (file 11) takes the front-rank guide position for that platoon. Both officers run to their estimated platoon centres and face west to supervise. Each commands "guide left" independently once formed.',

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
 * Shift the column-of-files east by `paces` paces (used by by-company).
 * Each successive keyframe passes a larger pace count to show on-the-march execution.
 */
function _march(company, paces) {
  const dx = paces * SCALE.PACE_PX;
  const inColumn = columnOfFiles(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 90 });
  return inColumn.map((s) => ({ ...s, x: s.x + dx }));
}

/**
 * Build the by-platoon starting formation: two mini columns-of-files, one per
 * platoon, stacked east–west (plt 1 leads, plt 2 follows).
 *
 * Each platoon column mirrors the full columnOfFiles layout for that half:
 *   Depth 0 : officer (left/north, across=−FILE_INTERVAL) + guide (across=0)
 *   Depth 1 : files 2–3 / 12–13  (4 abreast, across 0,10,20,30)
 *   Depth 2 : files 4–5 / 14–15
 *   Depth 3 : files 6–7 / 16–17
 *   Depth 4 : files 8–9 / 18–19
 *   Depth 5 : file 10 / 20  (2 abreast)
 *   Closers : same depths, across = 3×FILE_INTERVAL + FILE_CLOSER_GAP (south side)
 *
 * Plt 1: officer = captain (of-cpt), guide = nc-cov.
 * Plt 2: officer = 1st lt (fc-1lt), guide = fr-11 (front rank of rightmost plt-2 file).
 *   rr-11 (rear rank of plt-2 guide file) sits at across=+FILE_INTERVAL beside fr-11.
 *
 * PLT_OFFSET = 7 × DEPTH_SPACING (140 px): leaves a 40 px gap between plt 1's
 * deepest rank and plt 2's head, matching the platoon-spacing visual convention.
 */
function _buildColumnByPlatoon(company, paces) {
  const dx = paces * SCALE.PACE_PX;
  const DEPTH_SPACING = 2 * SCALE.FILE_INTERVAL; // 20 px per depth
  const PLT_OFFSET = 7 * DEPTH_SPACING;           // 140 px between platoon heads

  const p1x = ORIGIN_X + dx;
  const p1y = ORIGIN_Y;
  const p2x = p1x - PLT_OFFSET;
  const p2y = ORIGIN_Y;

  return company.map((soldier) => {
    // ── Platoon 1 head ────────────────────────────────────────────────────
    if (soldier.id === 'of-cpt')
      return { id: soldier.id, x: p1x, y: p1y - SCALE.FILE_INTERVAL, facing: 90 };
    if (soldier.id === 'nc-cov')
      return { id: soldier.id, x: p1x, y: p1y, facing: 90 };

    // ── Platoon 2 head ────────────────────────────────────────────────────
    if (soldier.id === 'fc-1lt')
      return { id: soldier.id, x: p2x, y: p2y - SCALE.FILE_INTERVAL, facing: 90 };
    if (soldier.id === 'fr-11')
      return { id: soldier.id, x: p2x, y: p2y, facing: 90 };
    if (soldier.id === 'rr-11')
      // Rear rank of plt-2 guide file — sits just south of fr-11.
      return { id: soldier.id, x: p2x, y: p2y + SCALE.FILE_INTERVAL, facing: 90 };

    // ── Platoon 1 files and closers ───────────────────────────────────────
    if (soldier.platoon === 1)
      return _pltFilePos(soldier, 1, p1x, p1y, DEPTH_SPACING);

    // ── Platoon 2 files and closers (file ≥ 12; fc-1lt already handled above) ──
    if (soldier.platoon === 2)
      return _pltFilePos(soldier, 2, p2x, p2y, DEPTH_SPACING);

    return { id: soldier.id, x: p1x, y: p1y, facing: 90 }; // fallback
  });
}

/**
 * Compute one soldier's position within a platoon column (facing east = 90°).
 * Handles regular front/rear rank files and file closers.
 * Guide file (relFile ≤ 0) is handled by _buildColumnByPlatoon above.
 */
function _pltFilePos(soldier, platoonNum, originX, originY, DEPTH_SPACING) {
  const baseFile = platoonNum === 1 ? 1 : 11;
  const relFile = soldier.file - baseFile; // guide file = 0; file 2/12 = 1; …

  if (relFile <= 0) {
    // Guide file's rear rank slot — shouldn't reach here for plt 1 (nc-cov handled
    // above) but may for plt 2 rr-11 (also handled above). Safety fallback.
    return { id: soldier.id, x: originX, y: originY, facing: 90 };
  }

  const localDepth = Math.floor((relFile - 1) / 2) + 1;
  const isSecondInPair = (relFile - 1) % 2 === 1;
  const lastFile = platoonNum === 1 ? 10 : 20;
  const isAlone = !isSecondInPair && soldier.file === lastFile;

  if (soldier.rank === 'fileCloser') {
    return {
      id: soldier.id,
      x: originX - localDepth * DEPTH_SPACING,
      y: originY + 3 * SCALE.FILE_INTERVAL + SCALE.FILE_CLOSER_GAP,
      facing: 90,
    };
  }

  let acrossIndex;
  if (soldier.rank === 'front') {
    acrossIndex = isSecondInPair ? 1 : 0;
  } else {
    acrossIndex = isSecondInPair ? 3 : (isAlone ? 1 : 2);
  }

  return {
    id: soldier.id,
    x: originX - localDepth * DEPTH_SPACING,
    y: originY + acrossIndex * SCALE.FILE_INTERVAL,
    facing: 90,
  };
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
 * Captain behaviour (¶160): runs north to the estimated centre of the company
 * (midpoint of the 20-file line), placing himself 2 paces east of the front rank,
 * facing west to supervise.
 *
 * Covering sergeant (¶156): continues straight east — his march position IS his
 * line position (rear rank, file 1) — no movement needed.
 */
function _buildPartialLine(marchPositions, company, ox, oy, formedDepthCount) {
  const allLine = lineOfBattle(company, { originX: ox, originY: oy, facing: 90 });
  const linePosMap = Object.fromEntries(allLine.map((p) => [p.id, p]));

  // Captain runs to the estimated centre of the 20-file line, 2 paces ahead.
  const captainX = ox + 2 * SCALE.PACE_PX;
  const captainY = oy - 9.5 * SCALE.FILE_INTERVAL; // midpoint between file 1 (y=oy) and file 20

  return marchPositions.map((s) => {
    const soldier = company.find((c) => c.id === s.id);
    if (!soldier) return s;

    // Captain: at estimated company centre, 2 paces east, facing west (¶160).
    if (soldier.id === 'of-cpt') {
      return { ...s, x: captainX, y: captainY, facing: 270 };
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
 *   Four frames each advance the company 4 more paces east:
 *     Frame 1 (col. march)  — 10 paces: cov sgt at x=340, lineOriginX=347
 *     Frame 2 (mid-form)    — 14 paces: cov sgt at x=396, lineOriginX=403
 *     Frame 3 (fully formed)— 18 paces: cov sgt at x=452, lineOriginX=459
 *     Frame 4 (march in ln) — 22 paces: cov sgt at x=508, lineOriginX=515
 *
 *   All positions within 960×600 canvas ✓.
 *
 *   Mid-frame captain: x=431, y=305 (centre of 20-file line, 2 paces east).
 *   Captain in formed frame resumes front-rank file-1: (lineOriginX3, 400).
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
        'The company marches in column of files (4 abreast, 10 deep), heading east. The captain leads on the north edge of the column; the covering sergeant marches at the guide position.',
      caseyRef: '¶155',
      duration: 1500,
      positions: m1,
      annotations: ['marchArrow'],
    },
    {
      label: 'MARCH — officers move, first files swing out',
      description:
        'At the command, the covering sergeant continues straight east as right-flank anchor and promotes to the front rank. The captain runs north to the estimated centre of the company, 2 paces ahead of the front rank, facing west to supervise (¶160). The nearest files (2–5) advance the right shoulder and double-quick north into line.',
      caseyRef: '¶156–160',
      duration: 1200,
      positions: _buildPartialLine(m2, company, ox2, oy2, 3),
      annotations: [],
    },
    {
      label: 'Formation continues — files 2–11 on line',
      description:
        'Each succeeding depth group swings north into line as it reaches the pivot. The rear rank follows its file leader without rushing to arrive at the same time (¶158). The whole company continues advancing east.',
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
        'All files have taken their east-facing line positions. The captain resumes his place at front rank file 1 and commands "guide left." The covering sergeant remains as right guide; the second sergeant passes to the left flank (¶160–161).',
      caseyRef: '¶160–161',
      duration: 1500,
      positions: lineOfBattle(company, { originX: ox5, originY: oy5, facing: 90 }),
      annotations: ['marchArrow'],
    },
    {
      label: 'Continued march in line',
      description:
        'The company advances in line of battle facing east. The covering sergeant and second sergeant serve as right and left guides at the flanks of the front rank (¶163).',
      caseyRef: '¶162–163',
      duration: 1500,
      positions: lineOfBattle(company, { originX: ox6, originY: oy6, facing: 90 }),
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
 * Both platoons form simultaneously. Captain runs to estimated centre of platoon 1
 * (files 1–10); lieutenant runs to estimated centre of platoon 2 (files 11–20).
 * Both officers place themselves 2 paces east of the front rank, facing west.
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
  const AHEAD = 2 * SCALE.PACE_PX; // 2 paces east of front rank

  // Officer destinations: estimated platoon centres, 2 paces east of front rank.
  // Plt 1 (files 1–10): centre between files 5–6 → y = oy − 4.5×FILE_INTERVAL.
  // Plt 2 (files 11–20): centre between files 15–16 → y = oy − 14.5×FILE_INTERVAL.
  const captainX = ox + AHEAD;
  const captainY = oy - 4.5 * SCALE.FILE_INTERVAL;
  const ltX = ox + AHEAD;
  const ltY = oy - 14.5 * SCALE.FILE_INTERVAL;

  return marchPositions.map((s) => {
    const soldier = company.find((c) => c.id === s.id);
    if (!soldier) return s;

    // Captain: runs to estimated plt-1 centre, 2 paces east, facing west (¶165).
    if (soldier.id === 'of-cpt') {
      return { ...s, x: captainX, y: captainY, facing: 270 };
    }

    // Covering sergeant: captain is out of plt 1 — promotes to front rank of file 1 (ox, oy).
    if (soldier.id === 'nc-cov') {
      return { ...s, x: ox, y: oy, facing: 90 };
    }

    // 1st Lieutenant: runs to estimated plt-2 centre, 2 paces east, facing west (¶165).
    if (soldier.id === 'fc-1lt') {
      return { ...s, x: ltX, y: ltY, facing: 270 };
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
 * Starting formation: column of platoons by the right flank (facing=90, east).
 *   columnOfPlatoons(facing=90): plt 1 leads east (front rank at x=ORIGIN_X),
 *   plt 2 follows 100 px behind (x=ORIGIN_X−100). Each platoon is a 2-rank ×
 *   10-file column; files spread NORTH (−y) within each platoon column.
 *
 * Frame 2 numeric trace (14 paces, _marchPlatoon):
 *   nc-cov (plt 1 rear rank, file 1): x=389, y=400 → lineOriginX=396, lineOriginY=400
 *   Captain promotes out to plt-1 centre: x=424, y=355 ✓
 *   1st Lt promotes out to plt-2 centre: x=424, y=255 ✓
 *   nc-cov promotes to front rank: x=396, y=400 ✓
 *   Plt 1 formed (local depths 1–2, files 2–7): y=390–340 at x=396 ✓
 *   Plt 2 formed (local depths 1–2, files 12–15): y=280–250 at x=396 ✓
 *   Plt 2 unformed files still in trailing column at x≈196–296 ✓
 */
function buildFormByPlatoon(company) {
  // Six frames, each advancing 2–4 paces east.
  // formedLocalDepthCount drives how many local depth groups have formed per platoon:
  //   2 → local depth 1 (files 2–3 plt1, 12–13 plt2)
  //   3 → local depths 1–2 (files 2–7 plt1, 12–15 plt2)
  //   5 → local depths 1–4 (files 2–9 plt1, 12–19 plt2)
  const m1 = _buildColumnByPlatoon(company, 10);
  const m2 = _buildColumnByPlatoon(company, 12);
  const m3 = _buildColumnByPlatoon(company, 14);
  const m4 = _buildColumnByPlatoon(company, 16);
  const m5 = _buildColumnByPlatoon(company, 18);
  const m6 = _buildColumnByPlatoon(company, 22);

  const { ox: ox2, oy: oy2 } = _lineOrigin(m2);
  const { ox: ox3, oy: oy3 } = _lineOrigin(m3);
  const { ox: ox4, oy: oy4 } = _lineOrigin(m4);
  const { ox: ox5, oy: oy5 } = _lineOrigin(m5);
  const { ox: ox6, oy: oy6 } = _lineOrigin(m6);

  return [
    {
      label: 'Marching by the right flank — two platoon columns',
      description:
        'The company marches in two platoon columns by the right flank, heading east. Each platoon is doubled 4-abreast: the officer (captain / 1st lt) marches left of the covering guide who leads the column; files pair up behind; file closers march on the south (right) side. Platoon 1 leads; platoon 2 follows. The instructor orders the captain to form by platoon.',
      caseyRef: '¶164',
      duration: 1500,
      positions: m1,
      annotations: ['marchArrow'],
    },
    {
      label: 'MARCH — officers move, first files swing out',
      description:
        'Both platoons execute simultaneously. The captain runs north to the estimated centre of platoon 1, 2 paces east of the front rank, facing west. The lieutenant does the same for platoon 2. The covering sergeant promotes to front rank of file 1. The nearest files of each platoon (files 2–3 and 12–13) begin swinging north into line (¶165).',
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
        'Both platoons are in east-facing line. The captain and lieutenant each command "guide left" independently. The covering sergeant anchors the right flank of platoon 1; the second sergeant anchors the platoon 2 left flank (¶165–167).',
      caseyRef: '¶165–168',
      duration: 1500,
      positions: lineOfBattle(company, { originX: ox5, originY: oy5, facing: 90 }),
      annotations: ['marchArrow'],
    },
    {
      label: 'Continued march in line',
      description:
        'The company advances in line of battle facing east. Each platoon has its own guide. File closers have followed their respective platoons throughout (¶168–169).',
      caseyRef: '¶168–169',
      duration: 1500,
      positions: lineOfBattle(company, { originX: ox6, originY: oy6, facing: 90 }),
      annotations: ['marchArrow'],
    },
  ];
}
