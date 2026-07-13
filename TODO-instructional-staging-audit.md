# Instructional-Staging vs. Field-Practice Audit

Survey only — no fixes applied. Requested by the user after all planned drill
content (School of Company + School of Battalion) was complete, to check for
places where a drill's animation stages a SCHOOLROOM TEACHING DEVICE from
Casey's text as if it were literal field/parade execution by a trained unit.

The seed example: `lesson-iii/marchInLine.js` throws a sergeant 6 paces out
front of the company as a walking alignment marker, with Casey's own text
saying "the instructor aligns him there" (¶86–87). An outside "instructor"
correcting/aligning troops is a schoolroom-only role — real field drill has a
captain and NCOs executing the maneuver themselves, no external teacher.

Conducted via 3 parallel agent sweeps (School of Company, Battalion Parts
I–IV, Battalion Part V), each reading every `buildKeyframes`/`reenactorNotes`/
`caseyParagraphs`/inline comment in scope and searching for "instructor",
"recruit", "class", "chalk", "schoolroom", "teaching", and similar tells,
distinguishing real 19th-century field-and-staff roles (colonel/majors/
captains/adjutant/general guides/color guard — legitimate, not flagged) from
an outside training figure (flagged).

## Result summary

- **School of the Battalion (all 40 drills, Parts I–V): clean.** Zero flags.
  Every marker/guide/alignment-supervision role found is a named field-and-
  staff billet (colonel, lieutenant-colonel, senior/junior major, general
  guides, color guard, covering sergeants) executing its own real duty during
  the maneuver, not an outside instructor. The "instructor aligns him there"
  pattern does not appear to have propagated from School of Company into any
  battalion-scale drill.
- **School of the Company: 9 of 21 drills flagged**, 12 clean. See below.

## Flagged — School of the Company

### HIGH confidence (explicit outside-instructor staging, dedicated keyframe)

- **`lesson-iii/marchInLine.js`** (`march-in-line`) — the seed example. A
  keyframe stages the directing sergeant (pressed from `fc-5sg`, no such post
  exists on the roster) 6 paces out front; description says "The instructor
  aligns him there" (¶86–87). Code comment already admits Casey "does not
  name a fixed post for this role."
- **`lesson-iv/formByFile.js`** (`form-by-file`) — dedicated keyframe titled
  "Instructor aligns the company" (¶154): "The instructor, having placed
  himself on the line of battle outside the right-flank rest point... aligns
  the company."

### MEDIUM confidence (plausible legitimate field practice, but instructor-voiced)

- **`lesson-iii/haltAndAlign.js`** (`halt-and-align`) — "if the instructor
  chooses to rectify... he commands 'Captain, rectify the alignment'"
  (¶99–100). Partially self-flagged already (code comments admit the
  captain/sergeant sighting motion is "an interpretive choice, not text from
  the manual").
- **`lesson-vi/formOnRightLeft.js`** (`form-on-right-left`) — repeated
  "the instructor commands..." framing (¶352–354, ¶364–365) for marking the
  point d'appui to form line from column. The underlying technique is
  legitimate field drill; the "instructor" narration voice is the concern.

### LOW–MEDIUM (narrative text only, no staged figure/keyframe)

- **`lesson-iv/formByCompany.js`** (`form-by-company`, by-platoon
  submovement) — "the instructor orders the captain to form by platoon"
  (¶164), text-only aside.
- **`lesson-iii/marchInRetreat.js`** (`march-in-retreat`) — "The instructor
  takes position in front of the directing file, as at ¶84" and "The
  instructor causes the company to face to the front" (¶119) — reuses
  march-in-line's vocabulary in narration only, no separate rendered figure.

### LOW (narration only, describes routine command-giving, not correction)

- **`lesson-v/formIntoLine.js`** (`form-into-line`) — "the instructor
  commands Guides—POSTS" (¶250–251).
- **`lesson-vi/countermarch.js`** (`countermarch`) — "The instructor wishes
  to cause it to countermarch" (¶343), scenario-setup framing only.
- **`lesson-iii/obliqueMarch.js`** (`oblique-march`) — "the instructor at
  first causes the oblique..." / "The instructor watches that the men follow
  parallel directions" (¶106–108), narration only; the guide behavior itself
  described is standard field conduct.

## Clean (School of Company)

`markTime.js`, `changeDirectionByFile.js`, `haltFaceFront.js`,
`marchByFlank.js`, `breakIntoColumn.js`, `changeDirection.js`,
`haltColumn.js`, `marchInColumn.js`, `breakFiles.js`, `breakPlatoons.js`,
`routeStep.js`, `openCloseRanks.js`.

## Pattern observed

Casey's text uses "the instructor" as its generic stand-in for whoever is
conducting the exercise — School of the Company drill has no real
"instructor" role (that would be the captain, or a superior at battalion
drill), so every occurrence carries some schoolroom flavor. The two HIGH
cases go further than narration: they stage a dedicated keyframe/entity
built specifically around an outside figure marking ground or aligning the
line from outside the ranks. The battalion-scale drills never inherited this
pattern — likely because Phase B1–B3 implementation deliberately reframed
every marker/guide role around Casey's actual field-and-staff billets rather
than a generic "instructor."

## Next step

Awaiting user decision on whether/how to fix the flagged drills — e.g.
whether HIGH-confidence cases should drop the outside-instructor framing
entirely (guide right established by posture/chain-of-command alone, as
already correctly done in Battalion's `open-close-ranks`) or be reframed as
a captain/NCO's own action rather than an external instructor's.
