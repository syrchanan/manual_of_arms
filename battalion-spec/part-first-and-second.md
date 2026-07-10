# School of the Battalion — Implementation Spec: Part First Art. I, and Part Second Art. I–III

Source: `casey_v2_full_extract.txt` (Casey's Infantry Tactics, Vol. II, 1862, Title V,
"School of the Battalion"). Continuous paragraph numbering within this file.

Coverage of this spec document:
- **Part First, Article I** (¶27–34): "To open and to close ranks"
- **Part Second, Article I** (¶77–107): "To break to the right or the left into column"
- **Part Second, Article II** (¶108–156): "To break to the rear, by the right or left,
  into column, and to advance or retire by the right or left of companies"
- **Part Second, Article III** (¶157–215): "To ploy the battalion into close column"

**NOTE on article boundaries**: the source text's "ARTICLE III." heading (line 880 of
the extract) appears immediately before ¶157–158, which are general framing paragraphs
for ploying into column. The task's assumed boundary of "Article II = ¶108–158" is
therefore off by two paragraphs against the printed heading placement — ¶157 and ¶158
are printed under the ARTICLE III heading, not II. This spec treats Article II as
¶108–156 and Article III as ¶157–215 to match the printed heading positions exactly;
flagged here in case this is a pagination/extraction artifact worth double-checking
against the original PDF.

Status: COMPLETE for the four articles listed above (all read in full against the
source, word by word). Not yet reviewed by a second pass; treat pace/distance figures
as verbatim transcriptions but flag any that read as internally inconsistent (see
Article III's six-pace/four-pace note) for follow-up against the original PDF.

---

## PART FIRST — Opening and Closing Ranks, and the Execution of the Different Fires

## Article I — To open and to close ranks (¶27–34)

### 1. Article title & range
"OPENING AND CLOSING RANKS, AND THE EXECUTION OF THE DIFFERENT FIRES" (Part First
title, ¶22); Article I heading: "To open and to close ranks." ¶27–34. (Article II,
"Manual of arms," and firings begin at ¶35 — explicitly OUT OF SCOPE per
TODO-battalion-plan.md.)

### 2. Exact commands (verbatim)
Opening ranks — two-part command sequence, given as separate commands at separate
moments:
- First (preparatory, given alone, dispositions follow before the next command):
  > 1. Prepare to open ranks.
- Second (given after lieutenant colonel/major have taken post per ¶28):
  > 2. To the rear, open order. 3. MARCH.
- Third (given once ranks are aligned, per ¶33):
  > 4. FRONT.

Closing ranks (¶34): no new command text given in this article — Casey defers entirely
to "the commands prescribed for the instructor in the S. C., No. 28" (School of the
Company reference — NOT present in this project's source extraction; see Cross-references
below).

### 3. Sequence of actions (paragraph-cited)
1. **¶27** — Colonel commands "1. Prepare to open ranks."
2. **¶28** — At that command: the **lieutenant colonel** places himself on the right of
   the battalion, on the flank of the file closers; the **major** places himself also on
   the right of the battalion, four paces from the front rank of the battalion. (Both
   are positioning themselves in preparation, on the right flank specifically.)
3. **¶29** — "These dispositions being made" (i.e., after ¶28 posting is complete), the
   colonel commands "2. To the rear, open order. 3. MARCH."
4. **¶30** — At the second command (i.e., at "To the rear, open order," before MARCH):
   the **covering sergeants** (one per company — the 1st sergeants who normally stand in
   the front rank covering their captains) and **the sergeant on the left of the
   battalion** place themselves four paces in rear of the front rank, opposite their
   normal places in line of battle, to mark the new alignment of the rear rank. They are
   aligned by the **major**, who dresses them on the **left sergeant of the battalion**;
   that left sergeant must place himself exactly four paces in rear of the front rank and
   hold his piece vertically between his eyes (inverted) as a visual marker for the major.
5. **¶31** — At the command "MARCH": the **rear rank** and the **file closers** (as a
   whole, all companies simultaneously) step to the rear without counting steps — pass a
   little in rear of the traced line for the rank, halt, and dress forward on the covering
   sergeants (who correctly align the men of their respective companies).
6. **¶32** — The **file closers** fall back to preserve a distance of **two paces** from
   the rear rank, glancing eyes to the right. The **lieutenant colonel**, from the right,
   aligns them on the file closer of the left, who has placed himself precisely two paces
   from the rear rank and inverts his piece, holding it erect between his eyes as a marker
   for the lieutenant colonel (mirrors the sergeant's marker role in ¶30 for the rear
   rank itself).
7. **¶33** — Colonel, seeing the ranks aligned, commands "4. FRONT." At this command the
   **lieutenant colonel, major, and the left sergeant** retake their normal places in line
   of battle (i.e., the supervisory/marker posts are stood down).
8. **¶34** — Closing ranks: performed "by the commands prescribed for the instructor in
   the S. C., No. 28" — no independent battalion-level mechanics given in this article.

### 4. Start state / end state
- **Start state**: Battalion in normal line of battle (close order) — front rank, rear
  rank at normal (in this manual's terms, "closed") depth, file closers in their close-
  order post directly behind the rear rank, all 8 companies dressed on the line.
- **End state (after FRONT, ¶33)**: Battalion in "open order" — rear rank displaced 4
  paces to the rear of the front rank (front rank has not moved), file closers displaced
  a further 2 paces behind the (now-relocated) rear rank, i.e. 6 paces total from the
  front rank. Lieutenant colonel, major, and left sergeant have resumed normal posts
  (they were only in the special marker/dressing posts transiently, between ¶28 and
  ¶33).
- **Closing (¶34)**: reverses this — rear rank and file closers return to normal
  close-order depth directly behind the front rank. Per TODO-battalion-plan.md, since
  the S.C. No. 28 cross-reference is unavailable, this project implements closing as the
  documented mirror of the opening mechanics (rear rank/file closers return to original
  depth), flagging the gap rather than blocking on it.

### 5. Distances/measurements (exact)
- Major's post at start: **four paces** from the front rank of the battalion (¶28).
- Covering sergeants / left sergeant new mark position: **four paces** in rear of the
  front rank (¶30) — this becomes the new rear-rank line.
- Left sergeant's precise position: "exactly four paces in rear of the front rank" (¶30).
- File closers' distance from the (displaced) rear rank: **two paces** (¶32), i.e. six
  paces total from the front rank.
- Left file closer's precise position: "exactly two paces from the rear rank" (¶32,
  echoing the sergeant's "exactly four paces" language in ¶30).

### 6. Cross-references
- **¶34 → "S. C., No. 28"**: School of the Company reference for the commands governing
  ranks closing. Per TODO-battalion-plan.md this is in School of the Company Lessons I–II,
  which are NOT present in `casey_lessons_3to6.txt` (that extraction begins at Lesson
  III, ¶84 of the Vol. I numbering). Flagged, not chased.

### 7. Notes on complexity
- This is a **single synchronized battalion-wide action**, not staged per-company: at
  the command MARCH (¶31), the rear rank and file closers of *all 8 companies
  simultaneously* step back to the new alignment. Each company's covering sergeant
  independently dresses their own company's men once at the new line, but the step-back
  itself is one unified motion across the battalion, not a sequential company-by-company
  drill.
- Distinct from wheeling/marching drills: this is purely a **depth change** — no lateral
  motion, no pivoting, no per-company independent timing. This matches
  TODO-battalion-plan.md's framing of it as a good first proving ground for the
  company-block renderer (whole rank/file-closer band shifting depth together).
- **New roster roles exercised, not currently in the 47-soldier company model**:
  - **Lieutenant colonel** and **major** — battalion-level field officers, each taking a
    specific transient post (lieutenant colonel: right flank, at the file-closer line;
    major: right flank, four paces in front of/abreast the new rear-rank line) and
    performing an active dressing/aligning function (major aligns the sergeants;
    lieutenant colonel aligns the file closers), not merely decorative posts.
  - **"Left sergeant of the battalion"** — a specific individual (distinct from each
    company's own covering sergeant) posted at the extreme left of the line, given a
    marker role (inverted piece held between the eyes) analogous to the left file
    closer's marker role. This is a single soldier drawn from (presumably) the left
    company but acting in a battalion-wide capacity — needs a defined roster slot.
  - **Left file closer** (of the battalion, i.e., of the left company) — same marker
    role, but for the file-closer line rather than the rear-rank line.
  - Each company's **covering sergeant** (already analogous to the 1st sergeant /
    covering-sergeant role in the School of the Company model) performs an active
    aligning function here, not just standing in ranks — should already map to an
    existing NCO role per company, but confirm the existing company model exposes a
    "covering sergeant" as a distinct, addressable individual (not just "front-rank
    file-closer NCO").
  - This drill needs the lieutenant colonel, major, and "left sergeant of the battalion"
    as animated actors with their own transient waypoints (post at ¶28/¶30, hold through
    ¶31–32, return to line at ¶33) — the first drill in this project's scope requiring
    battalion-level field-officer choreography rather than company-internal NCO/officer
    moves.

---

## PART SECOND — Different Modes of Passing from the Order in Battle to the Order in Column

## Article I — To break to the right or the left into column (¶77–107)

### 1. Article title & range
"DIFFERENT MODES OF PASSING FROM THE ORDER IN BATTLE TO THE ORDER IN COLUMN" (Part
Second title). Article I heading: "To break to the right or the left into column."
¶77–107. (Paragraphs prefixed "0-" — e.g. ¶0-80, ¶0-84 — are skirmisher-specific
addenda interleaved with the main numbering; skirmisher content is noted but not the
focus of this project's battalion model, flagged below.)

### 2. Exact commands (verbatim)
Break by company, right wheel (¶78):
> 1. By company, right wheel. 2. MARCH (or double quick — MARCH).

Within-wheel halt command, given individually by each captain (¶81):
> 1. Such company. 2. HALT.

Breaking by division (¶87) or by platoon (¶88): same command form as above but
substitute "division" or "platoon" for "company."

Moving the column forward from a halt without re-halting (¶97, repeats the ¶78 form,
then continues with additional commands per ¶99–100):
> 1. By company, right wheel. 2. MARCH (or double quick — MARCH).
> 3. Forward. 4. MARCH. 5. Guide left.

Special command when breaking one way but marching the other (¶106):
> Break to the right to march to the left, [or] break to the left to march to the right
before giving "by company, right (or left) wheel."

### 3. Sequence of actions (paragraph-cited)
1. **¶77** — General principle: lines of battle habitually break into column **by
   company**; may also break **by division** or **by platoon**.
2. **¶78** — Colonel commands "1. By company, right wheel. 2. MARCH."
3. **¶79** — At the first command: **each captain** places himself rapidly before the
   centre of his own company and cautions it to wheel right; **each covering sergeant**
   replaces the captain in the front rank (i.e., steps into the captain's vacated front-
   rank spot).
4. **¶81** — At "MARCH": each company breaks to the right (per S.C. No. 178, cross-ref
   below); the **left guide**, as soon as he can pass, places himself on the left of the
   front rank to conduct the marching flank; as the company nears the perpendicular
   (90° from original line), the captain commands "Such company. HALT."
5. **¶82** — At the HALT command (timed so the left guide is three paces from the
   perpendicular when given): company halts; the **left guide** advances and places his
   left arm against the captain's breast; the **captain** establishes him on the
   alignment of the man who faced right; the **covering sergeant** places himself
   correctly on alignment to the right of that man; captain then aligns the company by
   the left, commands FRONT, and takes post two paces before its centre.
6. **¶83** — After FRONT is commanded company by company, guides stand fast even if
   slightly out of line with adjacent companies' guides (to avoid propagating one
   company's wheel error into others); misaligned guides self-correct once the column
   is put in march.
7. **¶85** — Breaking to the **left** instead: same principles, inverse means; **each
   company's covering sergeant** (not the left guide) conducts the marching flank; the
   **left guide** places himself on the left of the front rank at the moment the
   company halts (mirrored roles vs. the right-break case).
8. **¶87** — Breaking **by division**: substitute "division" in the command. The chief
   of each division (**the senior captain** of the two companies forming it) acts as
   chief-of-company analog, posting two paces before the division's centre; the
   **junior captain** (if not already there) moves into the interval between the two
   companies in the front rank, covered by the **covering sergeant of the left company**
   in the rear rank. The division's right guide = right guide of its right company; left
   guide = left guide of its left company.
9. **¶88** — Breaking by platoon (right or left): each **first lieutenant** passes
   around the left of his company to post in front of the second platoon; each
   **covering sergeant** (except the right company's) steps momentarily behind the right
   file of his company to let this happen.
10. **¶89** — Odd-company handling when breaking by division: **to the right** with an
    odd company — that (left, odd) company's captain, after wheeling into column,
    obliques it left, halts it at company distance behind the preceding division,
    places his left guide on the column's line of direction, aligns by the left.
    **To the left** with an odd company — the odd company is in front; its captain
    wheels it into column, obliques right, halts at division distance ahead of the next
    division, places his right guide on line with the other guides, aligns by the
    right.
11. **¶93** — Once the battalion is in column: **lieutenant colonel** and **major** post
    on the directing flank — lieutenant colonel abreast the leading subdivision, major
    abreast the last subdivision — both six paces from the flank. The **adjutant** posts
    near the lieutenant colonel; the **sergeant major** posts near the major.
12. **¶96** — The colonel has no fixed instructor's post in column generally, but (in
    larger columns of multiple battalions) will post on the directing flank, 15–20 paces
    from the guides, abreast the centre of his own battalion.
13. **¶97–100** — Moving a halted column forward without re-halting: colonel cautions
    the battalion, gives the same "By company, right wheel. MARCH" command (¶97); at
    first command captains execute the from-a-halt breaking procedure (¶98); at second
    command captains stay in front of their companies supervising as companies wheel on
    fixed pivots (¶99, cross-ref S.C. No. 190); as companies near the perpendicular,
    colonel commands "3. Forward. 4. MARCH. 5. Guide left." At the third command
    (¶100), each **covering sergeant** posts by the right side of the man on the right
    of the front rank of his company; at the fourth (given the instant the wheel
    completes), companies stop wheeling and march straight forward; at the fifth, men
    take touch of elbows to the left, the leading guide marches per the lieutenant
    colonel's indicated direction, and guides conform to march-in-column principles
    (cross-ref S.C. No. 205 ff.).
14. **¶103** — If the battalion is already marching in line of battle (not halted), the
    colonel wheels it into column by the same commands/means, having previously
    cautioned the battalion that the march is to continue.
15. **¶104** — Breaking into column **by company to the left** while in line of battle:
    same principles, inverse means; each company's covering sergeant conducts the
    marching flank; left guides post on the left of their companies at the command
    "forward."
16. **¶106** — Prolonging the column toward the right/left, or marching perpendicular/
    diagonal to a flank: colonel breaks by company right or left as above; but if
    breaking right in order to march left (or vice versa), colonel first commands "Break
    to the right to march to the left" (or the reverse) before the wheel command. Once
    broken, the **lieutenant colonel** places a marker abreast the right guide of the
    leading company. The instant the column moves, the **leading company** wheels to the
    left (or right), marches **ten paces** to the front without changing the guide, and
    wheels again to the left (or right); once the second wheel completes, its captain
    commands "guide left" (or right); that company's guide marches parallel to the
    column's other guides. The lieutenant colonel places a **second marker** at the point
    where the leading company changes direction the second time.

### 4. Start state / end state
- **Start state**: Battalion in line of battle (all 8 companies abreast, dressed on one
  line), either halted or already marching.
- **End state**: Battalion in column of companies (or divisions, or platoons), each
  subdivision's front now facing the original right (or left) flank direction, arranged
  one behind the other at the interval dictated by the wheel, each subdivision dressed
  and aligned on its own guide, guides progressively self-correcting into the column's
  line of march. Lieutenant colonel/major/adjutant/sergeant major posted per ¶93 flanking
  the head/tail of the column.

### 5. Distances/measurements (exact)
- Guide's trigger distance for the halt command during the wheel: **three paces** from
  the perpendicular (¶82).
- Lieutenant colonel and major post: **six paces** from the (directing) flank, one
  abreast the leading subdivision, one abreast the last (¶93).
- Colonel's post in multi-battalion columns: **fifteen or twenty paces** from the guides
  (¶96).
- Odd company (breaking by division to the right): halts at **company distance** from
  the preceding division (¶89).
- Odd company (breaking by division to the left): halts at **division distance** from
  the division next in the rear (¶89).
- Double-wheel maneuver (¶106): leading company marches **ten paces** to the front
  between its two wheels.
- Captain's post after FRONT: **two paces** before the company's centre (¶82).

### 6. Cross-references (flagged, not chased)
- **¶79, ¶81, ¶82** → School of the Company, "S. C., No. 178" and "S. C., No. 190" —
  wheeling-to-the-right / breaking-from-a-halt mechanics at the single-company level.
  These ARE presumably already implemented in this project's School-of-the-Company
  content (Lesson V/VI wheel work per MEMORY) — worth checking `src/engine/formations.js`
  `wheel()` for direct reuse.
- **¶100** → "S. C., No. 205 and following" — march-in-column guide principles.
- **¶0-80, ¶0-84, ¶0-86, ¶0-90 through ¶0-92, ¶0-94, ¶0-95, ¶0-101, ¶0-102, ¶0-105,
  ¶0-107** — skirmisher-company-specific addenda (chief of platoon posting, platoon
  wheeling per S.C. No. 177/178/190/191, skirmisher recall signals, etc.). Not chased in
  detail; flagged as likely out of scope for the initial 8-line-company battalion model
  (no skirmisher company modeled per TODO-battalion-plan.md).

### 7. Notes on complexity
- **Staged, not fully synchronized**: unlike Part First Art. I (one unison motion), this
  article is fundamentally **per-company sequential-but-parallel**: all 8 (or however
  many) companies wheel at the same MARCH command, but each company's captain
  independently times and commands its own HALT (¶81) based on its own guide's position
  — i.e., 8 independently-triggered halts clustered around the same moment, not one
  synchronized halt. The animation needs each company-block to run its own wheel/halt
  sub-timeline rather than a single battalion-wide keyframe.
  - This directly matches the existing `wheel()` function's pivot logic in
    `formations.js` — likely reusable per-company, invoked 8 times with the same wheel
    angle but independent per-company origins.
- **Divisions and platoons are alternate groupings** of the same underlying maneuver —
  same spec, different subdivision size (2 companies per division, half a company per
  platoon). Odd-company handling (¶89) is a special case only relevant if the battalion
  has an odd number of companies; with this project's fixed 8-company model, division-
  breaking always pairs evenly (4 divisions of 2) — the odd-company branch of ¶89 is
  likely moot for the default battalion but should be flagged as untested/unused rather
  than silently dropped, in case the battalion size becomes configurable later.
- **New roster roles/choreography needed**:
  - **Lieutenant colonel, major, adjutant, sergeant major** all take defined flanking
    posts once the column is formed (¶93) — four battalion-staff roles with specific
    relative positions (6 paces from flank, abreast lead/tail subdivision; adjutant/
    sergeant major "near" their respective field officer, distance unspecified).
  - **Colonel** has a post-in-column rule too (¶96), though it's for multi-battalion
    columns — probably not needed for this single-battalion model, but flag it.
  - **Division chief = senior captain**, **division "second" = junior captain** — an
    ad hoc battalion-level rank ordering among the 8 captains (which captain is senior)
    is implied and would need to be encoded if division-breaking is modeled.
  - **First lieutenant** of each company has an active repositioning role when breaking
    by platoon (¶88) — this project's existing company model may already have a "first
    lieutenant" role from School of the Company; confirm it can be independently
    animated moving around the company's flank.
  - The **¶106 double-wheel-and-marker maneuver** (breaking one way to march the other)
    is the most novel/complex single case in this article: it requires the lieutenant
    colonel to place two invisible "markers" on the field (not soldiers, but reference
    points) and the leading company to execute two wheels separated by a fixed 10-pace
    march — this needs its own keyframe sequence distinct from the plain break-into-
    column case, and a way to render field markers distinct from personnel.

---

## Article II — To break to the rear, by the right or left, into column, and to advance or retire by the right or left of companies (¶108–156)

(See boundary note near the top of this document: this project treats Article II as
ending at ¶156, with ¶157–158 belonging to Article III per the printed heading
position.)

### 1. Article title & range
"To break to the rear, by the right or left, into column, and to advance or retire by
the right or left of companies." ¶108–156.

### 2. Exact commands (verbatim)
Break to the rear by the right into column, battalion halted (¶108):
> 1. By the right of companies to the rear into column. 2. Battalion right — FACE.
> 3. MARCH (or double quick — MARCH).

Mid-wheel per-company halt/dress sequence, given by each captain (¶112):
> 1. Such company. 2. HALT. 3. FRONT. 4. Left — DRESS.

Break to the rear by the right into column, battalion already marching in line (¶118):
> 1. By the right of companies to the rear into column. 2. Battalion, by the right
> flank. 3. MARCH (or double quick — MARCH).

Continuation once broken (given by the colonel, ¶121):
> 4. Battalion, by the left flank — MARCH. 5. Guide left.

Break to the rear by the left (¶125): same commands as ¶108/¶118, substituting "left"
for "right."

Advance or retire by the right of companies, battalion halted (¶135):
> 1. By the right of companies to the front (or rear). 2. Battalion, right — FACE.
> 3. MARCH (or double quick — MARCH). 4. Guide right (left) or (centre).

Advance or retire by the right of companies, battalion already marching (¶145):
> 1. By the right of companies to the front (or rear). 2. Battalion, by the right
> flank. 3. MARCH (or double quick — MARCH). 4. Guide right (left) or (centre).

Advance/retire by the left of companies (¶143, ¶148): same commands, "left" substituted
for "right."

Forming line to the front while advancing/retiring by right or left of companies
(¶150):
> 1. By companies into line. 2. MARCH (or double quick — MARCH). 3. Guide centre.

Halting a retiring, faced-about battalion instead of advancing after facing about
(¶154):
> right about — HALT.

### 3. Sequence of actions (paragraph-cited)
**Breaking to the rear by the right, battalion at a halt (¶108–117):**
1. **¶108** — Colonel commands "1. By the right of companies to the rear into column.
   2. Battalion right — FACE. 3. MARCH."
2. **¶109** — At the first command: each **captain** posts before his company's centre,
   cautions it to face right; **covering sergeants** step into the front rank.
3. **¶111** — At the second command (right-FACE executes): battalion faces right; each
   **captain** hastens to the right of his company and breaks two files to the rear —
   the first file breaks the whole depth of both ranks, the second file breaks less;
   captain then places himself so his breast lightly touches the left arm of the front-
   rank man of the last file of the company next on his right (the right company's
   captain aligns as if a company were notionally to his right). Each **covering
   sergeant** breaks to the rear with the right files and posts before the front rank of
   the first file to conduct it. Guides face toward the point the subdivision is to
   march (stated as a general rule).
4. **¶112** — At MARCH: the first file of each company wheels right, conducted
   perpendicularly to the rear by its covering sergeant (posted before it); remaining
   files wheel successively at the same spot. Captains stand fast, watch their companies
   file past; the instant the last file has wheeled, each captain commands "Such
   company. HALT. FRONT. Left-DRESS."
5. **¶113** — As the company faces to the front: its **left guide** places himself so his
   left arm lightly touches the captain's breast.
6. **¶114** — At "Left-DRESS": company aligns on its left guide; captain ensures the new
   alignment is perpendicular to the original line-of-battle alignment, stepping back two
   paces from the flank to judge this.
7. **¶115** — Once aligned, captain commands FRONT and takes post before the company's
   centre.

**Breaking to the rear by the right, battalion already marching (¶118–124):**
8. **¶118** — Colonel commands "1. By the right of companies to the rear into column.
   2. Battalion, by the right flank. 3. MARCH."
9. **¶119** — At first command: captains step briskly in front of their companies'
   centres, caution to face by the right flank.
10. **¶121** — At MARCH: battalion faces right; captains move to the right of their
    companies, break them right (same file-wheel mechanics as ¶111–112, covering
    sergeants conducting the first file). Captains watch companies file past; once all
    last files have wheeled, colonel commands "4. Battalion, by the left flank — MARCH.
    5. Guide left."
11. **¶123** — At the fourth command: companies face left and march in column in the new
    direction; captains post before their companies' centres. At the fifth: guides
    conform to march-in-column principles; the leading guide follows direction indicated
    by the **lieutenant colonel**; men take touch of elbows to the left.

**Breaking to the rear by the left (¶125–129):** mirrors the right-break case by inverse
means — captain hastens to the **left**, breaks the first two files to the rear, places
his breast against the right file of the company next on his left; **left guide** (not
covering sergeant) conducts the headmost file; on facing front, the **right guide**
places himself touching the captain's breast (mirrored roles vs. ¶111/113).

**Breaking by division to the rear (¶130, ¶132):**
12. **¶130** — Battalion may break by division to the rear, right or left, same manner,
    "division" substituted for "company" in the first command; **division chiefs**
    conform to what's prescribed for company captains; the **junior captain** in each
    division posts, when the division faces to a flank, by the side of the **covering
    sergeant of the left company**, who steps into the front rank.
13. **¶132** — Odd company handling when breaking by division to the rear (right or
    left): the **left company's captain** conforms to what was prescribed at ¶89
    (Article I's odd-company handling).
14. **¶134** — Breaking to the rear (this whole method) is "the most prompt and regular"
    and will be preferred on actual service unless there's a particular reason to break
    to the front.

**Advancing or retiring by the right of companies, battalion at a halt (¶135–142):**
15. **¶135** — Colonel commands "1. By the right of companies to the front (or rear).
    2. Battalion, right — FACE. 3. MARCH. 4. Guide right (left) or (centre)."
16. **¶136** — At first command: each **captain** moves two paces in front of his
    company's centre, cautions face-right; **covering sergeants** replace captains in
    front rank.
17. **¶138** — At second command: battalion faces right; each captain moves quickly to
    his company's right, causing files to break to the **front** (per ¶111's principles,
    but front instead of rear).
18. **¶140** — At MARCH: each captain, posting on the left of his leading guide, conducts
    his company perpendicular to the original line. At the fourth command (guide
    right/left/centre): each company's guide dresses to the indicated point, preserving
    distance accurately.

**Advancing/retiring, battalion already marching (¶145–149):**
19. **¶145** — Colonel commands "1. By the right of companies to the front (or rear).
    2. Battalion, by the right flank. 3. MARCH. 4. Guide right (left) or (centre)."
20. **¶146** — Executed per the principles of ¶119ff and ¶136ff; at the first command,
    the **color** and **general guides** take their places as in column.

**Left-side variants (¶143, ¶148):** advancing/retiring by the left of companies —
identical means/commands, "left" substituted for "right."

**Forming line from the advance/retire (¶150–155):**
21. **¶150** — Colonel commands "1. By companies into line. 2. MARCH. 3. Guide centre."
22. **¶151** — At MARCH (briskly repeated by captains): each company forms into line per
    S.C. No. 155 (cross-ref).
23. **¶152** — At the third command: the **color** and **general guides** move rapidly to
    their places in line (forward cross-ref to ¶480 of this same manual).
24. **¶154** — If retiring and the colonel wants to form line facing the enemy: first
    face the companies about while marching, then form line by ¶150's commands/means and
    S.C. No. 159 (cross-ref). If the colonel does not want to advance after facing about,
    he commands "right about — HALT" (per S.C. Nos. 132–133, cross-ref).

### 4. Start state / end state
- **Break to the rear (¶108–134)**: Start = line of battle (halted or marching).
  End = column of companies (or divisions) each faced to the rear relative to the
  original line, i.e. the column's direction of march is perpendicular to the original
  front, with the column literally built by each company individually wheeling its own
  files to the rear in place — distinct geometry from Article I's "wheel the whole
  company as a block" (there, the company wheels as a unit on a pivot; here, individual
  files peel off and wheel in succession at a fixed spot, "breaking" the company into
  column file-by-file, marching-band style).
- **Advance/retire by company (¶135–149)**: Start = line of battle (halted or marching).
  End = column of companies marching perpendicular to the original line, in the front
  or rear direction (as opposed to the rearward-only break of ¶108–134); mechanically
  the same file-break-and-wheel-in-place technique as above but files break to the
  front instead of the rear when advancing.
- **Form line from column (¶150–155)**: Start = column (from either break-to-rear or
  advance/retire-by-company state), marching. End = line of battle, either facing the
  original front (¶150–153) or, if the battalion had been retiring, facing about toward
  the enemy (¶154), or halted facing about without re-advancing (¶154, "right about —
  HALT").

### 5. Distances/measurements (exact)
- File-break depth: "the first file will break the whole depth of the two ranks; the
  second file less" (¶111) — no exact pace figure given, described relatively.
- Captain's dressing check-back distance: **two paces** from the flank, to judge
  perpendicularity of new alignment (¶114).
- Captain's pre-command post distance (advance/retire variant): **two paces** in front
  of the company's centre (¶136) — note this differs from the "before the centre"
  (unspecified distance) phrasing used for the break-to-rear variant at ¶109/¶119.
- Skirmisher platoon lead-off distance when breaking by division to the rear: "a
  distance equal to once and a half a company front" (¶0-131 — skirmisher-specific,
  flagged not in scope).
- General guide distance reference (skirmisher cross-context, ¶0-142): about
  **thirty-three paces**, less the platoon's front (skirmisher-specific, flagged).

### 6. Cross-references (flagged, not chased)
- **¶89** (this same manual, Article I) — odd-company handling, reused at ¶132.
- **S. C., No. 155** (¶151) — forming company into line.
- **¶480** of this manual (¶152, forward reference) — color and general guides' places
  in line; not yet read (falls in Part Fourth or later, out of this spec's range).
- **S. C., No. 159** (¶154) — forming line facing about.
- **S. C., Nos. 132–133** (¶154) — halting after facing about.
- Numerous **"0-" prefixed skirmisher paragraphs** (¶0-110, ¶0-116, ¶0-117, ¶0-120,
  ¶0-122, ¶0-124, ¶0-129, ¶0-131, ¶0-133, ¶0-137, ¶0-139, ¶0-141, ¶0-142, ¶0-144,
  ¶0-147, ¶0-149, ¶0-153, ¶0-155, ¶0-156) — parallel skirmisher-company mechanics for
  every maneuver in this article. Flagged as out of scope per TODO-battalion-plan.md
  (no skirmisher company in the current battalion model).
- A short unnumbered subsection heading, "REMARKS ON THE DEPLOYMENT OF SKIRMISHERS, IN
  RETIRING BY THE RIGHT OR LEFT OF COMPANIES" (before ¶0-156), is skirmisher-only
  content and not summarized above.

### 7. Notes on complexity
- **Per-company sequential-but-parallel**, similar to Article I, but the underlying
  per-company mechanic is different and more intricate: instead of a whole-company pivot
  wheel, each company here **breaks into its constituent files**, and those files wheel
  in succession "at the same place" (i.e., each file peels off and turns the corner at a
  fixed point, like cars merging one at a time) — this is a genuinely different geometry
  primitive from `wheel()` as used in Article I and School-of-Company Lesson V/VI. It
  will likely need a new formation function (something like `breakToColumnByFile()`)
  that walks each file of a company through a 90° turn at a shared corner-point, in file
  order, rather than rotating the whole company rigid-body as `wheel()` does.
- Two closely related but distinct command families exist in this article and must not
  be conflated: **(a)** "break to the rear into column" (¶108–134, marches away from
  original line) vs. **(b)** "advance or retire by company" (¶135–149, can go to the
  front too) — same file-wheel-in-place footwork, mirrored front/rear. Both must be
  modeled, likely sharing the same low-level per-file-wheel primitive with a direction
  flag.
- **Left/right mirroring** is extensive and explicit throughout (¶125 "substituting left
  for right," ¶143, ¶148) — engine functions should take a direction parameter rather
  than being hand-authored twice.
- **New roster roles / choreography**:
  - **Lieutenant colonel** again gets an active directional role (¶123, indicating march
    direction to the leading guide) — consistent with the field-officer choreography
    already flagged in Article I and Article I of Part Second.
  - **Color** and **general guides** (¶146, ¶152) — the color-bearer/color-guard and a
    battalion-level "general guide" role (distinct from each company's own guides) take
    specific formation posts "as in column" / "in line." The color guard is already
    planned per TODO-battalion-plan.md; "general guide(s)" (plural: right/left/centre
    general guides implied by ¶142's skirmisher cross-context) is a new, not-yet-modeled
    role — likely a designated soldier who serves as the battalion's own directional
    reference point, distinct from each company's internal guides. Needs a roster slot.
  - **Division chief = senior captain**, **junior captain** posted beside the covering
    sergeant of the left company (¶130) — same ad hoc captain-seniority ordering
    flagged in Article I.
  - The forming-line-facing-about case (¶154) introduces a full about-face of the
    battalion while retiring — combined with the existing about-face mechanics (if any)
    from School of the Company, this is a compound maneuver (face about + form line)
    that should be spec'd as its own keyframe sequence rather than reusing the plain
    ¶150 form-line sequence unmodified.

---

## Article III — To ploy the battalion into close column (¶157–215)

(See boundary note near the top of this document: this project treats Article III as
beginning at ¶157, per the printed heading position, rather than ¶159.)

### 1. Article title & range
"To ploy the battalion into close column." ¶157–215. This is the longest and most
variant-rich article in this spec's range: it covers ploying (closing line into a
column of divisions) in rear of the first division, in front of the first division, in
rear/front of the fourth (last) division, on an interior division, and while the
battalion is already marching (vs. halted) — plus a "REMARKS" coda (¶213–215) on full/
half-distance ployment and a general subdivision-support-arms rule.

### 2. Exact commands (verbatim)
General principle, no command (¶157–158): ploying may be executed by company or by
division, on the right or left subdivision, or any other subdivision, right or left in
front; the article's worked examples assume **four divisions**, with directions given
for an odd company, but the four-division principles serve equally for two or three
divisions.

**Ploy in rear of the first division, battalion halted (¶159):**
> 1. Close column by division. 2. On the first division, right in front. 3. Battalion,
> right — FACE. 4. MARCH (or double quick — MARCH).

**Per-division halt/dress sequence, given by each division chief (¶167):**
> 1. Such division. 2. HALT. 3. FRONT. 4. Left — DRESS.

**Ploy in front of the first division (¶177):** same commands as ¶159, substituting
"left" for the "right in front" indication (i.e., "On the first division, left in
front").

**End-of-movement command (¶188), used after the front-ployment case:**
> Guides, about — FACE.

**Ploy in rear or front of the fourth (last) division (¶190):**
> 1. Close column by division. 2. On the fourth division left (or right) in front.
> 3. Battalion left — FACE. 4. MARCH (or double quick — MARCH).

**Ploy on an interior division (¶193):**
> 1. Close column by division. 2. On such division right (or left) in front. 3.
> Battalion inwards — FACE. 4. MARCH (or double quick — MARCH).

**Ploy in rear of the first division, battalion already marching (¶200):**
> 1. Close column by division. 2. On the first division. 3. Battalion — by the right
> flank. 4. MARCH (or double quick — MARCH).

Chief-of-first-division caution while marching (¶202): "Quick time." Chief-of-second-
division commands, once closed to distance (¶206–207):
> 1. Second division, by the left flank — MARCH. 2. Guide left. [...] Quick time —
> MARCH.

**Full or half distance ployment (¶213):** same principles/commands, substituting for
the first command: "Column at full (or half) distance by division."

### 3. Sequence of actions (paragraph-cited)

**General principle (¶157–158):** Ploying may be done by company or division, on any
subdivision, right or left in front; worked examples assume four divisions (2 companies
each), with odd-company handling noted; four-division principles apply equally to two
or three divisions.

**Ploy in rear of the first division, halted, right in front (¶159–176):**
1. **¶159** — Colonel commands "1. Close column by division. 2. On the first division,
   right in front. 3. Battalion, right — FACE. 4. MARCH."
2. **¶160** — At the second command: all **chiefs of division** post before their
   divisions' centres; the chief of the **first** division cautions it to stand fast
   (it is the directing/stationary division); chiefs of the other three remind their
   divisions they must face right; the **covering sergeant of the right company of each
   division** replaces its captain in the front rank as the captain steps out.
3. **¶162** — At the third command: the **last three divisions** face right; each
   chief hastens to his division's right, causing files to break to the rear (per ¶111
   mechanics, cross-ref); the **right guide** breaks at the same time, posting before the
   front-rank man of the first file to conduct him; each chief posts by the side of this
   guide.
4. **¶163** — The moment these divisions face right: the **junior captain** in each
   posts on the left of the **covering sergeant of the left company**, who posts in the
   front rank. States explicitly: "This rule is general for all the ployments by
   division."
5. **¶165** — At MARCH: chief of the first division adds "guide left"; its **left
   guide** posts on its left as soon as the second division's movement permits; the
   **file closers** advance one pace upon the rear rank.
6. **¶166** — The other three divisions, each conducted by its chief, step off together
   to take their places in the column: the **second** division gains, in wheeling by
   file to the rear, a space of **six paces** to separate its guide from the first
   division's guide, and directs its march to enter the column on a line parallel to the
   first division; the **third and fourth** divisions direct themselves diagonally
   toward, but a little in rear of, their respective entry points; at **six paces** from
   the column's left flank, the head of each of these divisions inclines a little left to
   enter the column (as just prescribed for the second), leaving **six paces** between
   its guide and the guide of the preceding division. At the moment each division
   marches to enter the column, its **file closers** incline left to bring themselves to
   a distance of **one pace** from the rear rank.
7. **¶167** — Each chief of these three divisions conducts his division until up with
   the directing division's guide; the chief then halts himself, watches his division
   file past, and halts it the instant the last file has passed, commanding "Such
   division. HALT. FRONT. Left-DRESS."
8. **¶168** — At the second command (HALT): the division halts; its **left guide** posts
   promptly on the direction, **six paces** from the guide which precedes him, so that
   once the column is formed, the divisions are separated by a distance of **four
   paces**.
9. **¶169** — At the third command (FRONT): division faces front. At the fourth
   (Left-DRESS): division aligns on its chief, who posts **two paces** outside his guide
   and directs the alignment so his division is parallel to the one preceding it; he then
   commands FRONT and posts before his division's centre.
10. **¶170** — If, after FRONT, any division is not at its proper distance (which can
    only occur through its chief's negligence), that division stays in place rather than
    propagating the error.
11. **¶174** — The **colonel** superintends execution of the movement and ensures the
    prescribed principles are observed.
12. **¶175** — The **lieutenant colonel**, posting in succession in rear of the left
    guides, assures them on the direction as they arrive (acting as "a mere observer"
    unless a guide fails to cover exactly), then moves to his post outside the column's
    left flank, **six paces** from and abreast with the first division. States: "This
    rule is general."
13. **¶176** — The **senior major** follows the movement abreast the left of the fourth
    division, then takes position outside the column's left flank, **six paces** from
    and abreast with that division. The **junior major** follows the movement and then
    takes post per ¶94 (cross-ref — skirmisher-context posting), abreast the division
    next to the last.

**Ploy in front of the first division (¶177–189):**
14. **¶177** — Colonel gives the same commands as ¶159, substituting "left" for "right
    in front."
15. **¶178** — At the second/third commands: division chiefs and junior captains
    conform to ¶160, ¶162, ¶163, EXCEPT the chiefs of the last three divisions cause
    their files to break to the **front** instead of the rear.
16. **¶181** — At the fourth command: the chief of the first division adds "Guide
    right" (mirrored from "guide left" in the rear-ployment case).
17. **¶182** — The three other divisions step off together to take their places in the
    column **in front of** the directing division; each directs itself per ¶166's
    principles, entering such that when halted its guide is **six paces** from the guide
    of the division previously established in the column.
18. **¶183** — Each chief conducts his division until its **right guide** is nearly up
    with the directing division's guide; halts the division, faces it front; at the
    instant it halts, its right guide faces to the rear, posts **six paces** from the
    preceding guide (covering him exactly); the chief then aligns his division by the
    right.
19. **¶186** — The **lieutenant colonel**, placed in front of the right guide of the
    first division, assures the guides on direction as they successively arrive, then
    moves outside the column's right flank to a point **six paces** from, and abreast
    with, the fourth division (now in front).
20. **¶187** — The **senior major** conforms to ¶176's principle, then moves outside the
    column's right flank, **six paces** from and abreast with the first division (now in
    the rear). The **junior major** conforms to the column's movements, then takes post
    per ¶176.
21. **¶188** — Movement ended, colonel commands "Guides, about — FACE."
22. **¶189** — At this, guides who are faced to the rear face to the front.

**Ploy in rear/front of the fourth division (¶190–191):**
23. **¶190** — Colonel commands "1. Close column by division. 2. On the fourth division
    left (or right) in front. 3. Battalion left — FACE. 4. MARCH."
24. **¶191** — Executed per the principles above, by inverse means; the **fourth
    division** (the directing division here) stands fast; the instant the movement
    commences, its chief commands "guide right (or left)."

**Ploy on an interior division (¶193–198):**
25. **¶193** — Colonel commands "1. Close column by division. 2. On such division right
    (or left) in front. 3. Battalion inwards — FACE. 4. MARCH."
26. **¶194** — The instant the movement commences, the chief of the **directing
    division** commands "guide left (or right)."
27. **¶195** — Divisions to the right of the directing division (in the original order
    of battle) face left; those to the left face right.
28. **¶196** — If the right is to be in front: right-hand divisions ploy in front of the
    directing division, left-hand divisions ploy in its rear (reverse if left is to be in
    front). In all these cases, the division(s) contiguous to the directing one, in
    wheeling by file to the front or rear, gain a space of **six paces** to separate their
    guides from the directing division's guide.
29. **¶198** — In all ployments on an interior division: the **lieutenant colonel**
    assures the guide positions **in front** of the directing division; the **senior
    major** assures those **in rear** of it.

**Ployment while the battalion is marching (¶199–212):**
30. **¶199** — If the battalion is marching (not halted), the movement is executed by
    combining quick and double-quick time, and is always performed in rear of one of the
    flank divisions.
31. **¶200** — Colonel commands "1. Close column by division. 2. On the first division.
    3. Battalion — by the right flank. 4. MARCH."
32. **¶201** — At the second command: each **chief of division** moves rapidly before
    his division's centre, cautioning it to face right.
33. **¶202** — The chief of the **first** division cautions it to continue marching to
    the front, commanding "Quick time."
34. **¶204** — At MARCH: the first division marches in quick time; its chief commands
    "Guide left"; the left guide moves to the division's left flank and directs himself
    on the indicated point.
35. **¶205** — The other three divisions face right and move off in **double quick
    time**, breaking right to take their places in column; each chief moves rapidly to
    the right of his division to conduct it; files take care to preserve distances and
    march with a uniform, decided step. The **color-bearer** and **general guides**
    retake their places in the ranks.
36. **¶206** — The second division enters the column immediately, marching parallel to
    the first; its chief lets it file past him; when the last file is abreast of him, he
    commands "1. Second division, by the left flank — MARCH. 2. Guide left," and posts
    before his division's centre.
37. **¶207** — At MARCH: the division faces left; at the second command, the left guide
    marches in the trace of the first division's left guide; men take touch of elbows to
    the left. When the second division has closed to its proper distance, its chief
    commands "Quick time — MARCH," and the division changes its step to quick time.
38. **¶208** — Chiefs of the third and fourth divisions execute per the same principles,
    taking care to gain as much ground as possible toward the head of the column.
39. **¶211** — If the battalion had previously been marching in line at double quick
    time, once the fourth division has gained its distance, the colonel (if wishing to
    resume that gait) commands "Double quick — MARCH."
40. **¶212** — The **lieutenant colonel** moves rapidly to the side of the leading guide,
    gives him a point of direction, then follows the movements of the first division. The
    **senior major** follows the movement abreast the left of the fourth division.

**REMARKS ON PLOYING THE BATTALION INTO COLUMN (¶213–215):**
41. **¶213** — The battalion may be ployed into column at **full** or **half distance**,
    same principles and commands, substituting "Column at full (or half) distance by
    division" for the first command. Full-distance ployment is used only with a view to
    the **route step**.
42. **¶214** — In ployments/movements in column where subdivisions execute movements
    successively (e.g., taking or closing distances; changing direction by the flank of
    subdivisions), each **chief of subdivision** causes his men to support arms after
    aligning the subdivision and commanding FRONT.

### 4. Start state / end state
- **Start state**: Battalion in line of battle (all 8 companies / 4 divisions abreast),
  either halted or already marching, in the original order of battle (right-to-left
  company order fixed).
- **End state**: Battalion in **close column of divisions** — one division (the
  "directing" division: first, fourth, or an interior one, per which variant is
  commanded) stands fast/marches straight while the other divisions face to a flank,
  break into files, wheel, and re-enter behind (or in front of, or straddling) the
  directing division, each stacked at a fixed division-to-division distance, aligned and
  dressed, guides self-correcting into the column line. "Right in front" vs. "left in
  front" determines which flank of each division leads once re-formed into column; "in
  rear" vs. "in front of the first/fourth division" determines whether the moving
  divisions stack behind or ahead of the stationary one.
- Six distinct commanded variants share this same underlying geometry: **(a)** rear of
  first division, right in front (¶159); **(b)** front of first division, left in front
  (¶177); **(c)** rear/front of fourth division (¶190); **(d)** on an interior division,
  "inwards-FACE" (¶193); **(e)** any of the above while the battalion is marching rather
  than halted (¶199–212, always executed in rear of a flank division); **(f)** at full or
  half distance instead of "close" (¶213).

### 5. Distances/measurements (exact)
- Guide-to-guide separation while entering the column (multiple paragraphs: ¶166, ¶168,
  ¶182, ¶183, ¶196): **six paces**, stated repeatedly as the interval that must separate
  each division's guide from the guide of the adjacent (preceding/directing) division.
- Resulting division-to-division distance once the column is fully formed: **four
  paces** (¶168) — note this is distinct from the six-pace guide-separation figure used
  during the maneuver; six paces of guide offset apparently yields four paces of clear
  division interval once squared up (both figures given verbatim, not reconciled
  arithmetically in the text — flagged for the animation to get right, since naively
  using six paces as the final resting distance would be wrong per ¶168's own wording).
- File closers' distance from the rear rank once inclining into column: **one pace**
  (¶166) — this is a closer distance than Article I's/normal file-closer spacing,
  consistent with this being a "close column."
- Division chief's alignment check-back distance: **two paces** outside his guide (¶169).
- Lieutenant colonel's and senior major's post once the column is formed: **six paces**
  from, and abreast with, the relevant flank division (¶175, ¶176, ¶186, ¶187) —
  consistently six paces in every variant.
- Skirmisher-context distance reused from Article I: "about thirty-three paces" (¶0-185,
  skirmisher-specific, flagged).

### 6. Cross-references (flagged, not chased)
- **¶111** (this manual, Part Second Art. II) — file-breaking-to-the-rear mechanics,
  reused at ¶162 for the division-facing mechanics here.
- **¶94** (this manual, Part Second Art. I) — junior major's post, reused at ¶176 and
  ¶187 ("takes post as indicated No. 94").
- **¶102** (this manual, Part Second Art. I, skirmisher-context) — distance reference
  reused in skirmisher paragraphs ¶0-172, ¶0-185.
- **¶480** — not referenced directly in this article, but the color-bearer/general-guide
  "retake their places in the ranks" language at ¶205 likely connects forward to the same
  ¶480 material flagged in Article II.
- No "S. C." (School of the Company) cross-references appear in this article — unlike
  Articles I and II, Article III's mechanics are self-contained within Part Second /
  reference only earlier paragraphs of this same Part Second.
- Numerous **"0-" prefixed skirmisher paragraphs** (¶0-161, ¶0-164, ¶0-171 through
  ¶0-173, ¶0-179, ¶0-180, ¶0-184, ¶0-185, ¶0-192, ¶0-197, ¶0-203, ¶0-209, ¶0-210,
  ¶0-215) — parallel skirmisher-company ployment mechanics. Flagged as out of scope per
  TODO-battalion-plan.md.

### 7. Notes on complexity
- **This is the most complex article in this spec's range.** It is not one maneuver but
  a family of six variants (see Start/end state section) sharing a common underlying
  geometric primitive — "one division stands fast/marches straight while the others
  face-break-wheel-and-reenter around it at a fixed guide offset" — but differing in:
  which division is the anchor (first / fourth / interior), which side leads ("right in
  front" vs. "left in front"), whether the moving divisions land in front of or behind
  the anchor, and whether the whole thing happens from a halt or while already marching.
  A robust implementation should factor out the shared primitive (something like
  `ployIntoColumn(divisions, { anchorIndex, frontDivision, distance })`) rather than
  hand-coding each variant.
- **Sequential-staged, not simultaneous**: divisions enter the column one at a time in a
  defined order (e.g., ¶166: second division first, then third, then fourth, each
  waiting on/keying off the guide of the division ahead of it) — this is explicitly a
  relay, not a parallel wheel like Article I. The marching-battalion variant (¶199–212)
  makes this most explicit: each division's chief times its own flank-face-and-merge off
  the division ahead reaching its guide, essentially a "leapfrog" choreography.
- **Six-pace vs. four-pace distance discrepancy** (see Measurements section, ¶166/¶168)
  is worth flagging explicitly to whoever implements this — the text uses six paces for
  the guide-to-guide offset used *during* entry, but four paces for the settled division-
  to-division distance after FRONT/DRESS. These are not the same measurement and the
  implementation must not conflate them.
- **New roster roles / choreography, building on Articles I–II**:
  - **Lieutenant colonel, senior major, junior major** each have fully-specified,
    variant-dependent posts and active guide-assurance duties throughout every ployment
    variant (¶175–176, ¶186–187, ¶198, ¶212) — this article is the richest use yet of
    battalion field-officer choreography, with the lieutenant colonel and senior major
    swapping which flank they assure (front vs. rear of the directing division) depending
    on the variant. This strongly suggests these three roles need first-class, reusable
    "assure guides" behavior in the animation engine, not just static end-of-drill posts.
  - **"Senior major" vs. "junior major"** — this article is the first to consistently
    distinguish two major roles by seniority (Article I of Part Second used "major"
    singular at ¶93; here ¶176 etc. explicitly split into senior/junior). The battalion
    roster needs both major slots with a defined seniority ordering, matching the
    existing captain-seniority note flagged in Articles I–II.
  - **Division chiefs** (senior captain of the pair) again drive the maneuver
    per-division, as in Article I/II, but here with much more elaborate individual
    choreography (each chief personally halts himself, watches his division file past,
    then re-halts it — a "step outside and supervise" pattern distinct from a captain
    just commanding from a fixed relative post).
  - **Color-bearer and "general guides"** retaking ranks positions (¶205) — same
    not-yet-modeled "general guide" role flagged in Article II, now confirmed to be
    plural and to have a specific "in the ranks" post during this maneuver, distinct from
    their in-column post referenced in Article II.
  - The **support-arms rule** at ¶214 is a small but universal coda applying to ALL
    successive-subdivision-movement cases (ploying, taking/closing distances, changing
    direction by flank) — likely worth modeling as a generic "after align+FRONT, support
    arms" post-step attached to the chief-of-subdivision action rather than one-off per
    drill.

---
