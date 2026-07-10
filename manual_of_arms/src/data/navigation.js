/**
 * Navigation tree — mirrors Casey's structure.
 * Used by Sidebar and for prev/next traversal.
 */

export const NAV_TREE = [
  {
    id: 'lesson-iii',
    label: 'Lesson III — The March',
    path: '/school-of-the-company/lesson-iii',
    articles: [
      {
        id: 'march-in-line',
        label: 'March in Line of Battle',
        path: '/school-of-the-company/lesson-iii/march-in-line',
        caseyRef: '¶84–98',
      },
      {
        id: 'halt-and-align',
        label: 'Halt and Align',
        path: '/school-of-the-company/lesson-iii/halt-and-align',
        caseyRef: '¶99–100',
      },
      {
        id: 'oblique-march',
        label: 'Oblique March',
        path: '/school-of-the-company/lesson-iii/oblique-march',
        caseyRef: '¶101–108',
      },
      {
        id: 'mark-time',
        label: 'Mark Time / Double Quick / Back Step',
        path: '/school-of-the-company/lesson-iii/mark-time',
        caseyRef: '¶109–118',
      },
      {
        id: 'march-in-retreat',
        label: 'March in Retreat',
        path: '/school-of-the-company/lesson-iii/march-in-retreat',
        caseyRef: '¶119–136',
      },
    ],
  },
  {
    id: 'lesson-iv',
    label: 'Lesson IV — The Flank March',
    path: '/school-of-the-company/lesson-iv',
    articles: [
      {
        id: 'march-by-flank',
        label: 'March by the Flank',
        path: '/school-of-the-company/lesson-iv/march-by-flank',
        caseyRef: '¶137–143',
      },
      {
        id: 'change-direction-by-file',
        label: 'Change Direction by File',
        path: '/school-of-the-company/lesson-iv/change-direction-by-file',
        caseyRef: '¶144–146',
      },
      {
        id: 'halt-face-front',
        label: 'Halt and Face to Front',
        path: '/school-of-the-company/lesson-iv/halt-face-front',
        caseyRef: '¶147–149',
      },
      {
        id: 'form-by-file',
        label: 'Form by File into Line',
        path: '/school-of-the-company/lesson-iv/form-by-file',
        caseyRef: '¶150–154',
      },
      {
        id: 'form-by-company',
        label: 'Form by Company into Line',
        path: '/school-of-the-company/lesson-iv/form-by-company',
        caseyRef: '¶155–172',
      },
    ],
  },
  {
    id: 'lesson-v',
    label: 'Lesson V — Column of Platoons',
    path: '/school-of-the-company/lesson-v',
    articles: [
      {
        id: 'break-into-column',
        label: 'Break into Column by Platoon',
        path: '/school-of-the-company/lesson-v/break-into-column',
        caseyRef: '¶176–199',
      },
      {
        id: 'march-in-column',
        label: 'March in Column',
        path: '/school-of-the-company/lesson-v/march-in-column',
        caseyRef: '¶200–215',
      },
      {
        id: 'change-direction',
        label: 'Change Direction',
        path: '/school-of-the-company/lesson-v/change-direction',
        caseyRef: '¶216–235',
      },
      {
        id: 'halt-column',
        label: 'Halt the Column',
        path: '/school-of-the-company/lesson-v/halt-column',
        caseyRef: '¶236–239',
      },
      {
        id: 'form-into-line',
        label: 'Form into Line of Battle',
        path: '/school-of-the-company/lesson-v/form-into-line',
        caseyRef: '¶240–269',
      },
    ],
  },
  {
    id: 'lesson-vi',
    label: 'Lesson VI — Advanced Movements',
    path: '/school-of-the-company/lesson-vi',
    articles: [
      {
        id: 'break-platoons',
        label: 'Break into Platoons / Re-form',
        path: '/school-of-the-company/lesson-vi/break-platoons',
        caseyRef: '¶270–293',
      },
      {
        id: 'break-files',
        label: 'Break Files to Rear',
        path: '/school-of-the-company/lesson-vi/break-files',
        caseyRef: '¶294–310',
      },
      {
        id: 'route-step',
        label: 'Route Step',
        path: '/school-of-the-company/lesson-vi/route-step',
        caseyRef: '¶311–342',
      },
      {
        id: 'countermarch',
        label: 'Countermarch',
        path: '/school-of-the-company/lesson-vi/countermarch',
        caseyRef: '¶343–351',
      },
      {
        id: 'form-on-right-left',
        label: 'Form on Right/Left into Line',
        path: '/school-of-the-company/lesson-vi/form-on-right-left',
        caseyRef: '¶352–366',
      },
    ],
  },
];

// Flat list of all articles in reading order (for prev/next)
export const ALL_ARTICLES = NAV_TREE.flatMap((lesson) =>
  lesson.articles.map((art) => ({ ...art, lessonId: lesson.id, lessonLabel: lesson.label }))
);

export function getPrevNext(currentPath) {
  const idx = ALL_ARTICLES.findIndex((a) => a.path === currentPath);
  return {
    prev: idx > 0 ? ALL_ARTICLES[idx - 1] : null,
    next: idx < ALL_ARTICLES.length - 1 ? ALL_ARTICLES[idx + 1] : null,
  };
}

/**
 * School of the Battalion nav tree — same shape as NAV_TREE, grouped by
 * Part (mirroring how NAV_TREE groups by Lesson). Only Part First Art. I
 * (open/close ranks) is implemented so far; Parts Second-Fourth entries are
 * added as their drills land (Phase B1, task #28).
 */
export const BATTALION_NAV_TREE = [
  {
    id: 'part-i',
    label: 'Part First — Ranks',
    path: '/school-of-the-battalion/part-i',
    articles: [
      {
        id: 'open-close-ranks',
        label: 'To Open and to Close Ranks',
        path: '/school-of-the-battalion/part-i/open-close-ranks',
        caseyRef: '¶27–34',
      },
    ],
  },
];

export const BATTALION_ALL_ARTICLES = BATTALION_NAV_TREE.flatMap((part) =>
  part.articles.map((art) => ({ ...art, lessonId: part.id, lessonLabel: part.label }))
);

export function getBattalionPrevNext(currentPath) {
  const idx = BATTALION_ALL_ARTICLES.findIndex((a) => a.path === currentPath);
  return {
    prev: idx > 0 ? BATTALION_ALL_ARTICLES[idx - 1] : null,
    next: idx < BATTALION_ALL_ARTICLES.length - 1 ? BATTALION_ALL_ARTICLES[idx + 1] : null,
  };
}
