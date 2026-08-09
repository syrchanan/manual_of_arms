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
 * Part (mirroring how NAV_TREE groups by Lesson). Phase B1 (Parts
 * Second-Fourth) complete; Part Fifth (Phase B2/B3) not yet implemented.
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
  {
    id: 'part-ii',
    label: 'Part Second — Battle Line to Column',
    path: '/school-of-the-battalion/part-ii',
    articles: [
      {
        id: 'break-by-company',
        label: 'Break to the Right or Left into Column',
        path: '/school-of-the-battalion/part-ii/break-by-company',
        caseyRef: '¶77–107',
      },
      {
        id: 'break-to-rear',
        label: 'Break to the Rear into Column',
        path: '/school-of-the-battalion/part-ii/break-to-rear',
        caseyRef: '¶108–156',
      },
      {
        id: 'ploy-into-column',
        label: 'Ploy the Battalion into Close Column',
        path: '/school-of-the-battalion/part-ii/ploy-into-column',
        caseyRef: '¶157–215',
      },
    ],
  },
  {
    id: 'part-iii',
    label: 'Part Third — The March in Column',
    path: '/school-of-the-battalion/part-iii',
    articles: [
      {
        id: 'march-in-column-full-distance',
        label: 'March in Column at Full Distance',
        path: '/school-of-the-battalion/part-iii/march-in-column-full-distance',
        caseyRef: '¶216–235',
      },
      {
        id: 'column-in-route',
        label: 'Column in Route',
        path: '/school-of-the-battalion/part-iii/column-in-route',
        caseyRef: '¶239–272',
      },
      {
        id: 'change-direction-full-distance',
        label: 'Change Direction at Full Distance',
        path: '/school-of-the-battalion/part-iii/change-direction-full-distance',
        caseyRef: '¶273–285',
      },
      {
        id: 'halt-the-column-battalion',
        label: 'Halt the Column',
        path: '/school-of-the-battalion/part-iii/halt-the-column-battalion',
        caseyRef: '¶286–293',
      },
      {
        id: 'close-column-half-or-mass',
        label: 'Close to Half Distance or Mass',
        path: '/school-of-the-battalion/part-iii/close-column-half-or-mass',
        caseyRef: '¶294–334',
      },
      {
        id: 'march-column-half-or-mass',
        label: 'March at Half Distance or Mass',
        path: '/school-of-the-battalion/part-iii/march-column-half-or-mass',
        caseyRef: '¶335–342',
      },
      {
        id: 'change-direction-half-distance',
        label: 'Change Direction at Half Distance',
        path: '/school-of-the-battalion/part-iii/change-direction-half-distance',
        caseyRef: '¶343–344',
      },
      {
        id: 'change-direction-closed-in-mass',
        label: 'Change Direction Closed in Mass',
        path: '/school-of-the-battalion/part-iii/change-direction-closed-in-mass',
        caseyRef: '¶345–384',
      },
      {
        id: 'take-distances',
        label: 'Take Distances',
        path: '/school-of-the-battalion/part-iii/take-distances',
        caseyRef: '¶385–421',
      },
      {
        id: 'battalion-countermarch',
        label: 'Countermarch',
        path: '/school-of-the-battalion/part-iii/battalion-countermarch',
        caseyRef: '¶422–436',
      },
      {
        id: 'form-divisions',
        label: 'Form Divisions',
        path: '/school-of-the-battalion/part-iii/form-divisions',
        caseyRef: '¶437–461',
      },
    ],
  },
  {
    id: 'part-iv',
    label: 'Part Fourth — Column to Battle Line',
    path: '/school-of-the-battalion/part-iv',
    articles: [
      {
        id: 'determine-line-of-battle',
        label: 'Determine the Line of Battle',
        path: '/school-of-the-battalion/part-iv/determine-line-of-battle',
        caseyRef: '¶463',
      },
      {
        id: 'full-distance-into-line',
        label: 'Full Distance into Line of Battle',
        path: '/school-of-the-battalion/part-iv/full-distance-into-line',
        caseyRef: '¶464–491',
      },
      {
        id: 'half-distance-into-line',
        label: 'Half Distance into Line of Battle',
        path: '/school-of-the-battalion/part-iv/half-distance-into-line',
        caseyRef: '¶492–554',
      },
      {
        id: 'mass-deployment',
        label: 'Deployment of Columns Closed in Mass',
        path: '/school-of-the-battalion/part-iv/mass-deployment',
        caseyRef: '¶555–647',
      },
    ],
  },
  {
    id: 'part-v',
    label: 'Part Fifth — The Battle Line',
    path: '/school-of-the-battalion/part-v',
    articles: [
      {
        id: 'advance-in-line',
        label: 'Advance in Line of Battle',
        path: '/school-of-the-battalion/part-v/advance-in-line',
        caseyRef: '¶648–685',
      },
      {
        id: 'oblique-march-in-line',
        label: 'Oblique March in Line of Battle',
        path: '/school-of-the-battalion/part-v/oblique-march-in-line',
        caseyRef: '¶686–698',
      },
      {
        id: 'halt-and-align-line',
        label: 'Halt and Align the Line',
        path: '/school-of-the-battalion/part-v/halt-and-align-line',
        caseyRef: '¶699–716',
      },
      {
        id: 'change-direction-in-line',
        label: 'Change Direction in Line of Battle',
        path: '/school-of-the-battalion/part-v/change-direction-in-line',
        caseyRef: '¶717–729',
      },
      {
        id: 'retreat-in-line-of-battle',
        label: 'March in Retreat, in Line of Battle',
        path: '/school-of-the-battalion/part-v/retreat-in-line-of-battle',
        caseyRef: '¶730–743',
      },
      {
        id: 'halt-in-retreat-face-front',
        label: 'Halt in Retreat and Face to the Front',
        path: '/school-of-the-battalion/part-v/halt-in-retreat-face-front',
        caseyRef: '¶744–750',
      },
      {
        id: 'change-direction-in-retreat',
        label: 'Change Direction in Retreat',
        path: '/school-of-the-battalion/part-v/change-direction-in-retreat',
        caseyRef: '¶751–752',
      },
      {
        id: 'passage-of-obstacles',
        label: 'Passage of Obstacles',
        path: '/school-of-the-battalion/part-v/passage-of-obstacles',
        caseyRef: '¶753–787',
      },
      {
        id: 'pass-defile-in-retreat',
        label: 'Pass a Defile in Retreat',
        path: '/school-of-the-battalion/part-v/pass-defile-in-retreat',
        caseyRef: '¶788–804',
      },
      {
        id: 'march-by-flank-battalion',
        label: 'March by the Flank',
        path: '/school-of-the-battalion/part-v/march-by-flank-battalion',
        caseyRef: '¶805–819',
      },
      {
        id: 'form-by-file-into-line',
        label: 'Form by File into Line of Battle',
        path: '/school-of-the-battalion/part-v/form-by-file-into-line',
        caseyRef: '¶820–829',
      },
      {
        id: 'change-of-front',
        label: 'Changes of Front',
        path: '/school-of-the-battalion/part-v/change-of-front',
        caseyRef: '¶830–873',
      },
      {
        id: 'ploy-double-column',
        label: 'Ploy into Double Column',
        path: '/school-of-the-battalion/part-v/ploy-double-column',
        caseyRef: '¶874–902',
      },
      {
        id: 'ploy-division-columns',
        label: 'Ploy into Division Columns',
        path: '/school-of-the-battalion/part-v/ploy-division-columns',
        caseyRef: '¶903–921',
      },
      {
        id: 'double-column-movements',
        label: 'Double Column: March, Obstacles, Fold/Unfold',
        path: '/school-of-the-battalion/part-v/double-column-movements',
        caseyRef: '¶922–945',
      },
      {
        id: 'deploy-double-column',
        label: 'Deploy the Double Column into Line',
        path: '/school-of-the-battalion/part-v/deploy-double-column',
        caseyRef: '¶946–998',
      },
      {
        id: 'form-square',
        label: 'To Form Square, and to Reduce It',
        path: '/school-of-the-battalion/part-v/form-square',
        caseyRef: '¶999–1089',
      },
      {
        id: 'form-square-from-line',
        label: 'Form Square from Line of Battle',
        path: '/school-of-the-battalion/part-v/form-square-from-line',
        caseyRef: '¶1090–1125',
      },
      {
        id: 'form-square-four-ranks',
        label: 'Squares in Four Ranks',
        path: '/school-of-the-battalion/part-v/form-square-four-ranks',
        caseyRef: '¶1126–1166',
      },
      {
        id: 'form-square-oblique',
        label: 'Oblique Squares',
        path: '/school-of-the-battalion/part-v/form-square-oblique',
        caseyRef: '¶1167–1181',
      },
      {
        id: 'column-against-cavalry',
        label: 'Column Against Cavalry',
        path: '/school-of-the-battalion/part-v/column-against-cavalry',
        caseyRef: '¶1201–1211',
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
