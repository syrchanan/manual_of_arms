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
        caseyRef: '¶34–38',
      },
      {
        id: 'halt-and-align',
        label: 'Halt and Align',
        path: '/school-of-the-company/lesson-iii/halt-and-align',
        caseyRef: '¶39–49',
      },
      {
        id: 'oblique-march',
        label: 'Oblique March',
        path: '/school-of-the-company/lesson-iii/oblique-march',
        caseyRef: '¶50–56',
      },
      {
        id: 'mark-time',
        label: 'Mark Time / Double Quick / Back Step',
        path: '/school-of-the-company/lesson-iii/mark-time',
        caseyRef: '¶57–67',
      },
      {
        id: 'march-in-retreat',
        label: 'March in Retreat',
        path: '/school-of-the-company/lesson-iii/march-in-retreat',
        caseyRef: '¶68–75',
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
        caseyRef: '¶76–87',
      },
      {
        id: 'change-direction-by-file',
        label: 'Change Direction by File',
        path: '/school-of-the-company/lesson-iv/change-direction-by-file',
        caseyRef: '¶88–92',
      },
      {
        id: 'halt-face-front',
        label: 'Halt and Face to Front',
        path: '/school-of-the-company/lesson-iv/halt-face-front',
        caseyRef: '¶93–96',
      },
      {
        id: 'form-by-file',
        label: 'Form by File into Line',
        path: '/school-of-the-company/lesson-iv/form-by-file',
        caseyRef: '¶97–107',
      },
      {
        id: 'form-by-company',
        label: 'Form by Company into Line',
        path: '/school-of-the-company/lesson-iv/form-by-company',
        caseyRef: '¶108–122',
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
        caseyRef: '¶123–141',
      },
      {
        id: 'march-in-column',
        label: 'March in Column',
        path: '/school-of-the-company/lesson-v/march-in-column',
        caseyRef: '¶142–157',
      },
      {
        id: 'change-direction',
        label: 'Change Direction',
        path: '/school-of-the-company/lesson-v/change-direction',
        caseyRef: '¶158–172',
      },
      {
        id: 'halt-column',
        label: 'Halt the Column',
        path: '/school-of-the-company/lesson-v/halt-column',
        caseyRef: '¶173–176',
      },
      {
        id: 'form-into-line',
        label: 'Form into Line of Battle',
        path: '/school-of-the-company/lesson-v/form-into-line',
        caseyRef: '¶177–197',
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
        caseyRef: '¶198–208',
      },
      {
        id: 'break-files',
        label: 'Break Files to Rear',
        path: '/school-of-the-company/lesson-vi/break-files',
        caseyRef: '¶209–221',
      },
      {
        id: 'route-step',
        label: 'Route Step',
        path: '/school-of-the-company/lesson-vi/route-step',
        caseyRef: '¶222–244',
      },
      {
        id: 'countermarch',
        label: 'Countermarch',
        path: '/school-of-the-company/lesson-vi/countermarch',
        caseyRef: '¶245–253',
      },
      {
        id: 'form-on-right-left',
        label: 'Form on Right/Left into Line',
        path: '/school-of-the-company/lesson-vi/form-on-right-left',
        caseyRef: '¶254–268',
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
