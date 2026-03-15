import { lineOfBattle, columnOfFiles, doubleFiles } from '../../../engine/formations.js';
import { SCALE, CANVAS } from '../../constants.js';

const ORIGIN_X = 200;
const ORIGIN_Y = 300;

export default {
  id: 'form-by-company',
  title: 'To Form by Company into Line; Face by the Flank in Marching',
  lesson: 4,
  article: 5,
  caseyParagraphs: [108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122],
  commands: [
    { text: '1. By company, into line.', type: 'preparatory' },
    { text: '2. MARCH.', type: 'execution' },
  ],
  reenactorNotes:
    'This movement has two variants. In "form by company into line," all file groups simultaneously wheel to the left from a column of files, dressing on the rightmost file which continues straight. This is faster than forming by file (which is sequential). In "face by the flank in marching," the reverse occurs: the company transitions from line to column of files without halting.',

  buildKeyframes: (company, subMovement) => {
    if (subMovement === 'faceByFlank') {
      return buildFaceByFlank(company);
    }
    return buildFormByCompany(company);
  },
};

/**
 * Sub-movement A: Form by company into line (from column of files, while marching).
 * All files simultaneously wheel left, dressing on the rightmost file.
 */
function buildFormByCompany(company) {
  const inColumn = columnOfFiles(company, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 90 });
  const marchDist = 10 * SCALE.PACE_PX;
  const marching = inColumn.map((s) => ({ ...s, x: s.x + marchDist }));

  // All files wheel left simultaneously → form a line facing north
  // The rightmost file (lead, files 1-2) continues straight, becoming the right of the line.
  // All other files swing left into position on the left of the line.
  const captainPos = marching.find((s) => s.id === 'of-cpt');
  const lineOriginX = captainPos?.x ?? ORIGIN_X + marchDist;
  const lineOriginY = captainPos?.y ?? ORIGIN_Y;

  const inLine = lineOfBattle(company, {
    originX: lineOriginX,
    originY: lineOriginY,
    facing: 0,
  });

  // Midway: some files are mid-wheel (roughly 45° through the turn)
  // Approximate by placing files partway between column and line positions
  const midWheel = marching.map((s) => {
    const linePos = inLine.find((l) => l.id === s.id);
    if (!linePos) return s;
    return {
      ...s,
      x: (s.x + linePos.x) / 2,
      y: (s.y + linePos.y) / 2,
      facing: 45, // mid-turn
    };
  });

  // Continue marching in line (northward)
  const marchingInLine = inLine.map((s) => ({ ...s, y: s.y - 6 * SCALE.PACE_PX }));

  return [
    {
      label: 'Marching by the right flank',
      description: 'The company marches in column of files (4 abreast), heading east.',
      caseyRef: '¶108',
      duration: 1500,
      positions: marching,
      annotations: ['marchArrow'],
    },
    {
      label: 'By company, into line — MARCH',
      description:
        'All file groups simultaneously wheel to the left. The rightmost file (files 1–2) continues straight; all others swing left to dress on it, forming the line.',
      caseyRef: '¶109–112',
      duration: 2000,
      positions: midWheel,
      annotations: [],
    },
    {
      label: 'Company in line, marching',
      description:
        'The company is now in line of battle, marching north. All files are dressed on the right.',
      caseyRef: '¶113',
      duration: 1500,
      positions: inLine,
      annotations: ['marchArrow'],
    },
    {
      label: 'Continued march in line',
      description: 'The company continues its advance in line of battle.',
      caseyRef: '¶114',
      duration: 1500,
      positions: marchingInLine,
      annotations: ['marchArrow'],
    },
  ];
}

/**
 * Sub-movement B: Face by the flank in marching.
 * Without halting, each man faces right and the company transitions
 * from line to column of files on the march. Files double simultaneously.
 */
function buildFaceByFlank(company) {
  const ORIGIN_Y_LINE = 350;
  const lineOriginX = CANVAS.VIEW_W / 2 + (9 * SCALE.FILE_INTERVAL) / 2;

  // Start: company marching in line of battle (northward)
  const inLine = lineOfBattle(company, {
    originX: lineOriginX,
    originY: ORIGIN_Y_LINE,
    facing: 0,
  });
  const marchingLine = inLine.map((s) => ({ ...s, y: s.y - 4 * SCALE.PACE_PX }));

  // Face right on the march: all soldiers rotate 90° right, files double
  const rightFaced = marchingLine.map((s) => ({ ...s, facing: 90 }));
  const doubled = doubleFiles(rightFaced, company);

  // March in column (eastward)
  const marchDist = 10 * SCALE.PACE_PX;
  const marchingColumn = doubled.map((s) => ({ ...s, x: s.x + marchDist }));

  return [
    {
      label: 'Company marching in line',
      description: 'The company marches in line of battle, heading north.',
      caseyRef: '¶115',
      duration: 1500,
      positions: marchingLine,
      annotations: ['marchArrow'],
    },
    {
      label: 'By the right flank — MARCH',
      description:
        'Without halting, each man faces right. Files double simultaneously: even-numbered men step beside their odd-numbered neighbors within each rank. The company transitions to a column of files (4 abreast) on the march.',
      caseyRef: '¶116–119',
      duration: 1000,
      positions: doubled,
      annotations: [],
    },
    {
      label: 'Marching by the right flank',
      description: 'The company continues its march in column of files, heading east.',
      caseyRef: '¶120–122',
      duration: 1500,
      positions: marchingColumn,
      annotations: ['marchArrow'],
    },
  ];
}
