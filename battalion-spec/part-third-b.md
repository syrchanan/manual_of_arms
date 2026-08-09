# Part Third, Articles VII–XI (¶343–462)

Source: `casey_v2_full_extract.txt`, Casey's *Infantry Tactics* Vol. II (1862),
Title V "School of the Battalion," Part Third ("Of the manoeuvres of the
battalion in column of route or in march"). Continuous paragraph numbering
confirmed by `grep -n "ARTICLE"`: Part Third opens at ¶216 (line 1172–1174,
"PART THIRD." / "ARTICLE I."), and this range runs from Article VII (¶343,
line 1857) through the end of Article XI's closing remarks (¶461, line 2480),
with Part Fourth beginning cleanly at ¶463 (line 2489, "PART FOURTH."). No
paragraph gaps or renumbering surprises inside this range — it is contiguous
343→462, one paragraph number per unit, including the "0-###" numbered
skirmisher-supplement paragraphs interleaved throughout (e.g. 0-344, 0-363,
0-396, 0-462), which are cross-references to the skirmisher school and are
noted but out of scope for the battalion-of-companies engine.

**Definition of "division" (load-bearing for this whole range):** confirmed
at ¶887 (¶158, Part Second Art. III context) — "The examples in this school
will suppose the presence of **four divisions**... but what will be
prescribed for four, will serve equally for two or three divisions." A
division = **two companies paired together**. For the project's 8-company
default battalion, this means **4 divisions** (companies 1–2, 3–4, 5–6, 7–8
paired front-to-rear in column order). This is also explicit at ¶425 ("column
... formed by division, right in front") and ¶4751/¶4753 (division = "the two
companies," senior captain of the two companies commands the division).
Several drills in this range are written generically for "column by
division" and separately (nearly verbatim) for "column by company" — i.e.
Casey gives the same maneuver twice at two different subdivision granularities.
The engine should treat "subdivision" as a parameter (company vs. division)
rather than hardcoding one.

---

## Article VII — To change direction in column at half distance
**¶343–344 (lines 1857–1870)**

### Commands
No new commands — this article states that a half-distance column changes
direction "by the same commands and according to the same principles as a
column at full distance" (¶343), i.e. it reuses the Article VI (full
distance) commands (not in this agent's range, but referenced, presumably
`Battalion, right (left) wheel. MARCH.` per the Article VIII pattern below).

### Sequence of actions
- ¶343: Column at half distance, in march, changes direction using the
  full-distance mechanics, but because subdivisions are packed closer
  (half distance instead of full), the **pivot man in each subdivision takes
  a shorter step**: 14 inches instead of 9 (quick time), 17 inches instead of
  11 (double quick) — *this is the inverse of what one might expect*: the
  pivot steps are *longer* at half distance than at full distance, "in order
  to clear, in time, the wheeling point," and "the marching flank will
  describe the arc of a larger circle" to compensate.
- ¶0-344: skirmisher platoon columns change direction per ¶279ff (out of
  range) at the colonel's `march` command.

### Start/end state
Start: column at half distance, in march, straight line of march.
End: column at half distance, in march, new line of march (direction
changed by wheel of each subdivision in succession, same as full-distance
wheel-in-march mechanic already built for School-of-Company Lesson V/VI).

### Distances/measurements
- Pivot step at half distance: **14 in. (quick time) / 17 in. (double
  quick)** — vs. full distance's 9 in./11 in. (from School of Company,
  referenced not reproduced here).

### Cross-references (not chased)
- Commands and full-distance principles: implied Article VI (¶ before 343,
  outside this range — likely near ¶3xx, this agent's predecessor's range).
- ¶279 and following (skirmisher platoon-column direction change).

### Complexity notes
Minimal new engine work — this is a step-length parameter change on the
existing wheel-in-march mechanic (already proven at company scale in Lesson
V/VI). At battalion scale, "subdivision" here likely means company (half
distance is company-interval spacing per the Phase B naming), each company
wheeling in succession as the wheeling point is reached, same relay logic as
existing wheel engine, generalized to N subdivisions instead of 2 platoons.

---

## Article VIII — To change direction in column closed in mass
**¶345–384 (lines 1871–2063)**

Two sub-articles: marching (¶345–364) and from a halt (¶365–384).

### 1st. To change direction in marching (¶345–364)

#### Commands
- Right change: `1. Battalion, right wheel. 2. MARCH.` (¶347)
- Left change: `1. Battalion, left wheel. 2. MARCH.` (¶357)
- Resuming direct march after wheel: `1. Forward. 2. MARCH.` (¶355)

#### Sequence of actions
- ¶345: A column by division, closed in mass, changes direction "by the
  front of subdivisions" (i.e., each division wheels as a whole unit, not
  by flank-facing/filing).
- ¶346: Change is executed "on the principle of wheeling in marching" —
  first the colonel causes the battalion to take the guide on the flank
  **opposite** the intended turn, if not already there.
- ¶347–348: Colonel places a marker at the wheel-start point, commands the
  wheel; at `MARCH`, the **leading division wheels as if part of a column at
  half distance** (i.e., using the Article VII step-length rule above).
- ¶349: The instant the leading division starts its wheel, **all other
  divisions conform at once**: each division's outside (left, for a right
  wheel) guide advances the outside shoulder slightly, lengthens step
  slightly, inclines toward the pivot flank, gaining ground to close up so
  that a constant **4-pace interval** is maintained between it and the
  division ahead; once it covers the preceding guide, it stops inclining and
  marches straight in the leader's trace.
- ¶350: Each division conforms to its own guide; files nearer the pivot gain
  less ground than files nearer the marching flank (standard wheel
  mechanics); the right (pivot-side) guide gains only enough ground to
  maintain the division-to-division distance along the marching flank.
- ¶351: Each **chief of division** (the senior of the two captains, per
  ¶4751 elsewhere) regulates his division's march, keeps it between its
  guides, keeps its alignment nearly parallel to the preceding division, and
  allows only slight rearward bowing at the centre.
- ¶352: The **colonel** superintends, and has the leading division's pivot
  lengthen/shorten step per the S.C. principle (No. 232, out of range) if
  needed to help other divisions.
- ¶353: The **lieutenant-colonel** places himself near the leading
  division's outside guide, regulates its march, and is careful not to
  intrude within the arc it describes.
- ¶354: The **senior major**, placed in rear of the guides, ensures the last
  three guides conform by slight degrees to the guide ahead of them, without
  over-inclining; corrects serious faults.
- ¶355–356: Colonel commands `Forward. MARCH` the instant the leading
  division completes its wheel; it resumes the straight march; the other
  divisions conform, with any guide not covering its leader correcting by
  slight degrees (advancing the right shoulder).
- ¶357–359: Left change of direction is the mirror — colonel first takes the
  guide to the right, then `Battalion, left wheel. MARCH.`; guide is
  switched back to the left once the battalion has resumed the straight
  march and the last three guides are nearly aligned with the front one.
- ¶360: Same principles apply to a column with the **left in front**.
- ¶361: A **column by company**, closed in mass, changes direction "in
  marching" using the same commands/means prescribed for column by
  division — i.e. this entire mechanic is explicitly generalized from
  division-granularity to company-granularity.
- ¶362: The guide who is the pivot of a particular wheel must hold his usual
  **6-pace distance** from the guide preceding him, or the divisions/
  companies will become confounded.
- ¶0-363: skirmisher platoon columns change direction per the battalion
  column's principles, leading platoons preserving alignment with the first
  and last divisions.
- ¶0-364 (Remarks): recall of deployed skirmisher platoons when battalion is
  closed in mass, per ¶342 (out of range).

#### Start/end state
Start: column by division (or company) closed in mass, in march, straight
line. End: same column, in march, new line of direction; guide flank
restored to its habitual side once straightened out.

#### Distances/measurements
- **4-pace interval** maintained between each conforming division and the
  one ahead of it, along the marching flank, throughout the wheel (¶349).
- **6-pace distance** the pivot-guide of a wheeling subdivision must hold
  from the guide preceding it (¶362) — this is the standing closed-in-mass
  division-to-division gap (distinct from the 4-pace *wheel-transient* gap
  in ¶349; worth flagging, see Complexity notes).

#### Cross-references (not chased)
- S.C. No. 232 (step lengthening/shortening principle, School of Company).
- Article VII step-length rule (this same range, ¶343) reused for leading
  division's wheel.

#### Complexity notes
This is the hardest geometry problem in the whole range. A **closed-in-mass
column of 4 divisions (8 companies)** changing direction is not simply "the
lead unit wheels, others follow the same path" (which is how the existing
company-scale countermarch/column-of-platoons wheel works) — here every
division wheels **simultaneously**, each along its own arc, staggered in
time only by when each one reaches the wheel point, and they must *actively
close the gap* to a constant 4 paces while doing so (since a mass column has
essentially zero gap between divisions when marching, unlike a
half/full-distance column). This requires:
- A wheel function that operates on a **corner/block abstraction**
  (division-as-rectangle) rather than a soldier or platoon line, consistent
  with the planned `BattalionRenderer`/company-block model.
- A **staggered-start, staggered-arc** animation: division N begins wheeling
  only once it reaches the fixed wheel-point marker (not a fixed time delay
  from division N-1), and while wheeling, closes from "touching" distance to
  a 4-pace transient gap, snapping back to standing mass-column spacing once
  the whole battalion has resumed straight march (¶356).
- This is meaningfully different from the ¶362 steady-state 6-pace
  interior-gap figure quoted for the *general* pivot-guide distance —
  reconcile whether ¶349's 4-pace figure is a *wheeling-only* transient
  distance layered on top of the mass column's normal (near-zero) closed
  spacing, or whether it's describing the standing closed-mass gap itself;
  the text's phrasing ("constantly...an interval of four paces between his
  division and that which precedes it") reads as the wheel's own transient
  spacing rule, worth flagging to the architecture agent.

### 2nd. To change direction from a halt (¶365–384)

#### Commands
Right flank change:
```
1. Change direction by the right flank. 2. Battalion, right--FACE.
3. MARCH (or double quick--MARCH).
```
(¶366)

Left flank change: same commands, substituting "left" for "right" (¶374).

Per-subdivision halt/dress (called out by each chief of subdivision as his
unit clears):
```
1. First company (or first division). 2. HALT. 3. FRONT. 4. Left--DRESS.
```
(¶369)

#### Sequence of actions
- ¶365: A column by company or division, closed in mass, **at a halt**,
  changes to a new permanent direction via flank-facing-and-filing (not
  wheeling).
- ¶366: For a right-in-front battalion changing by the right flank, the
  colonel indicates the new direction to the **lieutenant-colonel**, who
  plants **two markers** on the new line, spaced a bit less than one
  subdivision's front, the first marker in front of the right file of the
  first subdivision.
- ¶367: At command 2 (`right--FACE`), the whole column faces right; **each
  chief of subdivision places himself beside his right guide**.
- ¶0-368: skirmisher platoon columns face right simultaneously; guides go to
  the right of their platoons; chiefs of platoon post beside their guides.
- ¶369: At `MARCH`, **all subdivisions step off together** (this is filing,
  not sequential wheeling); the leading subdivision's right guide directs
  himself parallel to the markers from the first step; the chief does *not*
  follow the march but watches his subdivision file past, and once the left
  guide has passed, commands the halt/front/dress sequence above.
- ¶370: At the 4th command (`Left-DRESS`), the subdivision aligns itself
  against the two markers under its chief's direction.
- ¶371: Each following subdivision's right guide conforms to the guide of
  the subdivision ahead of it in the column, entering the new direction
  parallel to it, at **4 paces** from its rear rank.
- ¶372: Each chief of subdivision halts personally upon reaching the already
  -placed left guides on the new direction, watches his subdivision file
  past, and repeats the halt/align procedure of ¶369.
- ¶0-373: skirmisher platoon columns step off together at `MARCH`, each
  chief conducting his platoon to its new position on the battalion
  column's principles; relative positions preserved after the movement.
- ¶374–378: Left-flank version is the mirror (substitute "left" for
  "right" throughout; markers placed in front of the left file of the
  leading subdivision).
- ¶380: The **colonel** holds himself on the designated (turning) flank to
  ensure each subdivision enters parallel to the leader and at the
  prescribed distance.
- ¶381: The **lieutenant-colonel** stands in front of, facing, the leading
  subdivision's guide, and assures the positions of following guides as
  they arrive.
- ¶382: The **senior major** follows abreast with the last subdivision; the
  junior major occupies the post prescribed at ¶336 (out of range).
- ¶383: Critically, the **leading subdivision must fully unmask the
  column** before halting — its trailing (left, for a right-flank turn)
  guide must at least reach where its own leading guide started, so every
  following subdivision (each of which must cross a space at least equal to
  its own front) ends up square with the leader when it in turn halts.
- ¶384: "By this method there is no direction that may not be given to a
  column in mass."

#### Start/end state
Start: column (company or division granularity) closed in mass, **halted**,
facing original direction of march. End: same column, halted, faced back to
original facing but now aligned along an entirely new line of march —
achieved by each subdivision individually facing the turn-flank, filing
forward/across, then halting, fronting, and dress-aligning on markers/the
subdivision ahead, in leader-to-rear sequence (not simultaneous wheeling).

#### Distances/measurements
- Markers spaced "a little less than the front of the first subdivision"
  apart (¶366).
- **4 paces** from a following subdivision's guide to the preceding
  subdivision's rear rank, once aligned on the new direction (¶371).
- Skirmisher-specific: markers otherwise unmeasured beyond "company
  distance" analog implied.

#### Cross-references (not chased)
- ¶336 (junior major's post) — outside this range.

#### Complexity notes
This is a genuinely different mechanic from the "marching" wheel above: it's
a **file-and-realign** maneuver (face the flank as a body, march forward-
and-across as a block, then individually halt/front/dress against fixed
ground markers), executed **in column order, leader first**, each
subsequent subdivision timing its own halt off the one ahead rather than off
a clock or a wheel arc. This needs:
- A "face-flank, translate-block, halt-and-square" primitive distinct from
  `wheel()` — closer to a rigid-body translate + 90°-facing-change + a
  positional convergence onto markers, applied once per subdivision with a
  strict ordering dependency (subdivision N cannot square up until it can
  see subdivision N-1's already-placed guide).
- Marker objects that persist through the maneuver (two fixed points on the
  new line) — the engine doesn't yet have a "planted ground marker"
  annotation type that other formations reference for alignment; this
  parallels annotation needs already flagged for Lesson-scale dressing but
  at battalion block scale.
- The "unmask before halting" rule (¶383) is a hard geometric constraint
  (each division's trailing edge must clear the leading division's
  starting position by a full division-front) that should be validated
  procedurally, not just visually approximated.

---

## Article IX — Being in column at half distance or closed in mass, to take distances
**¶385–421 (lines 2065–2269)**

Three sub-procedures: by the head of the column (¶386–396), on the rear of
the column (¶397–407), on the head of the column [i.e., about-faced, taking
distance while facing to the rear] (¶408–420), plus a closing remark
(¶0-421).

### 1st. To take distances by the head of the column (¶386–396)

#### Commands
```
By the head of column, take wheeling distance.
```
(¶386, given at a halt) — followed by each captain in turn commanding his
own company forward, e.g.:
```
1. First company, forward. 2. Guide left. 3. MARCH (or double quick--MARCH).
```
(¶387), repeated per company as each attains wheeling distance (¶388–389).

If already in march, colonel adds `MARCH` after the same first command
(¶393).

#### Sequence of actions
- ¶385: A half-distance column takes full distance by the head when it must
  prolong itself into a route column, or for instructional purposes
  (breaking into platoons, forming divisions, etc.). If it must form line of
  battle on the ground it occupies, distances are taken on whichever end
  (lead or rear) coincides with where the battalion's line-of-battle flank
  should rest.
- ¶386: At a halt, colonel gives `By the head of column, take wheeling
  distance`; **captain of the leading company** puts it in march per ¶387.
- ¶388–389: Each following captain, in turn, commands his own company
  forward the instant it has (nearly) gained its wheeling distance behind
  the one ahead, taking the step from the preceding company.
- ¶390: **Colonel** verifies each company starts exactly when it has its
  distance.
- ¶391: **Lieutenant-colonel** holds at the head of column, directing the
  leading guide's march.
- ¶392: **Senior major** stays abreast of the rearmost guide; junior major
  posts per ¶94/¶259 depending on cadence vs. route step (out of range).
- ¶393–395: If already marching (quick or double-quick), the colonel adds
  `MARCH`; leading company may need to shift gait (double-quick to gain
  distance faster, then resume prior gait) per the captains' own commands.
- ¶0-396 (Remarks): if skirmisher platoons are present but not marching in
  column, they take distance by the same means, the leading platoon
  marching abreast the leading battalion company, the last platoon column's
  leading platoon marching abreast the last battalion company.

#### Start/end state
Start: column at half distance (or closed in mass, per ¶419), each company
"nested" close behind the one ahead. End: column at full distance
(wheeling distance) — a full company-interval gap between each company and
the one ahead, achieved by successively releasing companies front-to-rear.

#### Distances/measurements
- "Wheeling distance" = the standard full company-distance interval used
  throughout Casey (defined elsewhere, not re-derived here) — each company
  starts marching the instant it has opened this gap behind its leader.

### 2nd. To take distances on the rear of the column (¶397–407)

#### Commands
```
1. On the eighth company, take wheeling distance. 2. Column forward.
3. Guide left. 4. MARCH (or double quick--MARCH).
```
(¶397, explicitly named for an 8-company battalion — direct confirmation of
the 8-company default)

#### Sequence of actions
- ¶397: Colonel plants **two markers** on the intended line-of-battle
  direction: first opposite the rearmost (8th) company, second at
  **company distance** toward the head, both facing to the rear; the
  **right general guide**, on the lieutenant-colonel's cue, dashes ahead of
  where the column's head will extend to and stands correctly on the
  markers' prolongation.
- ¶398: At command 1, the **8th company's captain** cautions it to stand
  fast; at command 3, all captains (except 8th) post two paces outside the
  directing flank.
- ¶0-399: parallel skirmisher-platoon posting detail.
- ¶400: At `MARCH`, all companies except the 8th march; the 8th's chief
  aligns it by the left on the first marker (left guide steps behind the
  left file to let this happen), then commands `FRONT`; marker retires,
  left guide resumes post.
- ¶401: All other companies march, the leading company's guide directing
  himself slightly inside the right general guide; the **7th company**
  halts and aligns on the second marker when it arrives there.
- ¶402: The **6th company**'s captain halts his company once he judges
  there is a full wheeling gap between his company and the 7th; guide faces
  rear to mark the line, captain aligns by the left, posts two paces ahead
  of centre. Remaining companies (5th, 4th... up to 1st) repeat this in
  succession.
- ¶0-403/¶0-404: parallel skirmisher-platoon detail.
- ¶405: **Colonel** follows, verifying each company halts at the prescribed
  distance and correcting faults; once all aligned, has the rear-facing
  guides face about again.
- ¶406: **Lieutenant-colonel** successively confirms each left guide on the
  direction, standing in their rear as they arrive.
- ¶407: **Senior major** stays at the head of column, directing the leading
  guide's march; junior major per ¶94 (out of range).

#### Start/end state
Start: half-distance/mass column, halted, 8th (rearmost) company as the
fixed anchor. End: full-distance column, the 8th company unmoved, all
others (7th down to 1st) having marched forward in succession and halted at
proper wheeling-distance gaps, each aligned to the two ground markers'
prolongation via its own captain.

#### Distances/measurements
- Marker spacing: **company distance** apart (¶397).
- Standard wheeling-distance gaps opened company-by-company thereafter,
  judged by eye by each captain (¶402) rather than by markers beyond the
  first two.

### 3rd. To take distances on the head of the column (¶408–420)

#### Commands
```
1. On the first company, take wheeling distance. 2. Battalion, about--FACE.
3. Column, forward. 4. Guide right. 5. MARCH (or double quick--MARCH).
```
(¶408)

#### Sequence of actions
- ¶408: Colonel plants two markers: one abreast the leading company, one at
  **company distance** behind it, both **facing front** (opposite orientation
  from the rear-taking version); **left general guide**, on cue, dashes to
  the rear, beyond where the column's rear will extend, and stands on the
  markers' prolongation.
- ¶409: At command 1, 1st company's captain cautions it to remain facing
  front. At command 2 (`about-FACE`), all *other* companies face about
  (guides remain in what is now the rear, formerly front, rank).
- ¶0-410: parallel skirmisher detail.
- ¶411/¶0-412: at command 4 (`Guide right`), captains post outside their
  guides; skirmisher chiefs of second platoons post two paces outside
  their guides.
- ¶413: At `MARCH`, the designated (1st) company's captain aligns it on its
  marker per the ¶400 method.
- ¶414: Remaining (now-rear-facing) companies march, rearmost company's
  guide directing slightly inside the left general guide; **2nd company**
  halts, faces about (per ¶321, out of range), aligns by the left, once
  opposite the second marker.
- ¶415: **3rd company** halts the instant it has wheeling distance, faces
  about, aligns by the left; remaining companies (4th...8th) repeat this
  in succession.
- ¶0-416: parallel skirmisher-platoon detail.
- ¶417: **Colonel** follows per ¶405; lieutenant-colonel/senior major per
  ¶406–407; **junior major** holds abreast the color company on the
  reverse flank.
- ¶418: Same principles apply to a column with the left in front.
- ¶419: Same for a **column closed in mass** — substitute "half" for
  "wheeling distance" in the commands if opening only to half distance
  instead of full.
- ¶420: Same principles for a **column by division** (paired-company
  granularity) as for column by company.
- ¶0-421 (Remark): platoon columns retain close order when the battalion
  column opens from closed-mass to half distance.

#### Start/end state
Start: half-distance/mass column, halted, 1st (leading) company as the
fixed anchor, facing front. End: full-distance column, 1st company
unmoved/facing-front, all others (2nd through 8th) having about-faced,
marched to the rear in succession, halted and re-fronted at proper
wheeling-distance gaps.

#### Distances/measurements
- Same **company-distance** marker spacing as the rear-anchored version
  (¶408).
- Generalizes to closed-mass → half-distance (not just → full distance) via
  substituting "half" for "wheeling distance" in the command (¶419).
- Generalizes to division-granularity (¶420).

#### Cross-references (not chased)
- ¶94, ¶259 (junior major posts, cadence vs. route step) — out of range.
- ¶321 (facing-about technique while marching) — out of range.
- ¶400, ¶405–407 (self-referenced within this article for the mirrored
  procedures).

#### Complexity notes
Three distinct anchor/direction combinations (head-anchored, rear-anchored,
head-anchored-facing-rear) that are really one algorithm parameterized by
"which end is fixed" and "which way does the rest of the column face to
close/open the gaps." Engine implication: a single `takeDistances(companies,
{ anchor: 'head'|'rear', fromDistance: 'half'|'mass', toDistance:
'full'|'half', granularity: 'company'|'division' })` function, where the
non-anchor companies release in strict front-to-rear or rear-to-front order,
each judged by eye (not by a fixed timer) to reach a full wheeling-distance
gap from its neighbor before halting and aligning to the shared marker
prolongation line. This is more of a sequencing/timing design problem than a
new geometry primitive — the underlying motion (companies marching straight
forward or to the rear, then halting) is simple; the challenge is modeling
the "each company's captain judges by eye" cadence as a deterministic
keyframe sequence with believable stagger.

---

## Article X — Countermarch of a column at full or half distance / closed in mass
**¶422–436 (lines 2271–2347)**

This is the battalion-scale countermarch and the single most important
"how does this scale from 2 platoons to 8 companies" question flagged in the
task brief. Two variants: full/half-distance column (¶422–423, by reference
to School of Company), and closed-in-mass column (¶424–436, spelled out in
full — this is new mechanics not reducible to the company-scale countermarch).

### Countermarch of a column at full or half distance (¶422–423)

#### Commands
```
1. Countermarch. 2. Battalion right (or left)--FACE. 3. By file left (or right).
4. MARCH (or double quick--MARCH).
```
(¶422)

#### Sequence of actions
- ¶422: Executed "by the means indicated, school of the company" — i.e.
  this is explicitly the **same mechanic already implemented** for the
  School-of-Company countermarch, just applied with N companies as the
  marching subdivisions instead of 2 platoons. No new description given;
  full delegation to the already-built S.C. mechanic.
- ¶0-423: For platoon columns (skirmishers) present alongside a full-
  distance battalion column, they countermarch by the same commands/means
  as S.C. No. 350 (out of range), with a wrinkle: at command 2, before
  facing about, platoon guides advance along the line's prolongation a
  distance equal to **one platoon's front**; at `MARCH`, each platoon files
  to the front a **platoon-front distance** before filing to the left/right,
  in order to dress on its guide.

#### Start/end state
Start: column at full or half distance, halted, facing one direction. End:
same column, halted, facing the opposite (reversed) direction, subdivision
order reversed front-to-back along the line of march (the countermarch's
defining property — same as the already-implemented company-scale version).

#### Distances/measurements
- Skirmisher platoon-front distance for the guide's advance-and-file
  maneuver (¶0-423) — exact figure not given here (depends on platoon
  front, computed elsewhere).

#### Complexity notes
**This variant needs no new mechanic** — it explicitly reuses the School of
Company countermarch (`by file left/right, march`, wheel-around-standing-
guide mechanic already built and audited for Lesson V/VI). The only change
at battalion scale is N=8 companies (or N subdivisions at half distance)
instead of N=2 platoons — i.e., this is a **direct generalization of the
existing engine's countermarch to more subdivisions**, not new design work.

### Countermarch of a column closed in mass (¶424–436)

#### Commands
```
1. Countermarch. 2. Battalion, right and left--FACE. 3. By file left and right.
4. MARCH (or double quick--MARCH).
```
(¶425) — note the command itself differs from the full/half-distance
version: "right **and** left--FACE" / "by file left **and** right" (plural,
because odd and even divisions face opposite ways simultaneously).

#### Sequence of actions — this is the genuinely new mechanic
- ¶425: Column formed **by division** (pairs of companies), right in front.
- ¶426: At command 1, chiefs of **odd-numbered divisions** caution their
  division to face right; chiefs of **even-numbered divisions** caution
  theirs to face left.
- ¶427: At command 2, **odd divisions face right, even divisions face
  left** — opposite facings, simultaneously, within the same column. The
  right and left guides of *all* divisions face about. Chiefs of odd
  divisions hasten to their own right and cause **two files to break to the
  rear**, each odd chief posting on the left of his leading front-rank man;
  chiefs of even divisions hasten to their own left and likewise break two
  files to the rear, posting on the right of their leading front-rank man.
- ¶428: At `MARCH`, **every division countermarches independently and
  simultaneously**, each conducted by its own chief, guides standing fast:
  each **odd division wheels by file to the left around its right guide**;
  each **even division wheels by file to the right around its left guide**;
  each division aims to arrive behind its *opposite* guide (the one it
  wasn't originally pivoting on), halting and fronting once its head is up
  with that guide.
- ¶429: Once fronted, each division aligns by the right, chiefs of even
  divisions moving rapidly to the right of their own division to conduct
  this.
- ¶430: Once aligned, each chief commands `FRONT`; guides shift back to
  their proper (habitual) flanks.
- ¶431: Left-in-front column: same commands/means, but alignment is by the
  left instead, with odd-division chiefs relocating to the left of their
  divisions once fronted.
- ¶432: **Colonel**, on the directing flank, superintends the whole
  movement.
- ¶433: Once done, **lieutenant-colonel** posts abreast the leading
  division, **senior major** abreast the rearmost, **junior major** abreast
  the color company.
- ¶434: **Column by company** (not division) closed in mass: identical
  commands/means, "applying to companies what is prescribed for divisions"
  — i.e., in a company-granularity mass column, *companies* (not division-
  pairs) alternate odd/even facing and independently countermarch by file.
- ¶435: The countermarch **always** occurs from a halt, whether the column
  is closed in mass or at full/half distance.
- ¶0-436: If the column is at half distance or closed in mass, the
  skirmisher platoon columns' first platoon of each faces right, second
  faces left; guides advance **6 paces** along the prolongation before
  facing about (in place of the platoon-front figure used at full
  distance); each platoon then files forward **6 paces** before filing to
  the left/right to dress on its guide.

#### Start/end state
Start: column closed in mass (by division or by company), halted, facing
one direction, subdivisions in original front-to-rear order. End: same
column closed in mass, halted, facing the reversed direction, subdivision
order reversed (division/company that was rearmost is now leading) — same
net effect as the full/half-distance countermarch, but achieved by an
entirely different **choreographed simultaneous file-wheel** rather than a
sequential "each unit does what the leader did" relay.

#### Distances/measurements
- **Two files** break to the rear from each division/company at the start
  (¶427), presumably to create room for the in-place file-wheel-around-a-
  standing-guide without collision — this is the key spatial trick that
  makes an in-mass (near-zero-gap) countermarch possible at all.
- Skirmisher platoons: guides advance **6 paces** before facing about; each
  platoon files **6 paces** forward before turning to dress (¶0-436) —
  note this 6-pace figure is explicitly *not* the "platoon front" figure
  used in the full-distance variant (¶0-423); it's a fixed distance
  specific to the closed-mass case.

#### Cross-references (not chased)
- School of Company countermarch mechanics (¶422's "by the means indicated,
  school of the company" — this project's own already-built and audited
  Lesson V/VI countermarch).
- S.C. No. 350 (out of range, skirmisher countermarch means).

#### Complexity notes — the central "how does this scale" answer
**Each division (or company, in the by-company variant) countermarches
independently and simultaneously — the whole column does NOT reverse as one
rigid unit, and it is NOT a sequential relay where the lead unit does it
first and others copy in turn.** Instead:
1. All divisions face at once, but **alternating direction** (odd right,
   even left) — this is a genuinely different starting condition from the
   company-scale countermarch (where the file-facing in the existing 2-
   platoon mechanic is presumably uniform).
2. Two files peel off to the rear from each division to create wheeling
   room in tight (mass) spacing.
3. Every division performs its own **file-wheel around its own standing
   guide** (a small in-place rotation, alternating pivot side: odd=own
   right guide, even=own left guide), independently and in parallel —
   this is a small-radius pivot wheel, not a translate.
4. Each division specifically re-converges on its **opposite guide** (the
   one on the flank it did NOT pivot around) — meaning each division's
   footprint essentially flips in place, front-to-back and reversed in
   facing, while staying almost exactly where it was on the ground (unlike
   the full/half-distance countermarch, which visibly relocates the whole
   column's silhouette along the line of march as ranks lap past each
   other).
5. Alignment and re-fronting (¶429–430) then re-squares the whole battalion
   as a straight column again.

This needs a **new engine primitive**: a per-subdivision, alternating-pivot,
small-radius in-place file-wheel, run in parallel across all N/2 divisions
(or N companies) with staggered pivot sides — distinct from both (a) the
existing company-scale wheel-around-a-standing-flank countermarch and (b)
the Article VIII "wheel while marching" block-wheel above. Recommend
modeling it as: for each division/company, compute local pivot point (own
left or right guide depending on odd/even), rotate that subdivision's block
180° about that pivot over the animation duration, with the "break two
files to the rear" step modeled as a brief lateral offset/gap-opening
sub-keyframe before the rotation to avoid visual collision with the
neighboring subdivision. Because odd/even divisions pivot on opposite
flanks, adjacent divisions' rotation arcs curve toward each other but around
different points — worth an explicit collision/spacing check in the design
review before animating, especially given the file-front is being reduced
by two files during the maneuver.

---

## Article XI — Being in column by company closed in mass, to form divisions
**¶437–461 (lines 2349–2480)**

From a halt (¶437–448), from a march (¶449–452), from full/half distance
instead of mass (¶453–456), and REMARKS on forming divisions from a halt
(¶457–461).

### From a halt (¶437–448)

#### Commands
```
1. Form divisions. 2. Left company, left--FACE. 3. MARCH (or double quick--MARCH).
```
(¶437)

Per-company halt as it clears:
```
1. Such company. 2. HALT. 3. FRONT.
```
(¶441)

Dress command:
```
Right--DRESS.
```
(¶444)

Guides return:
```
Guides--POSTS.
```
(¶446)

#### Sequence of actions
- ¶437: Column closed in mass, by company, right in front, halted. Colonel
  commands `Form divisions`.
- ¶438–439: At command 1, captains of **left companies** (the odd-position
  companies that will become the left half of each new division pair)
  caution a left face; at command 2, they face left and post beside their
  own left guides.
- ¶440: **Right companies** (and their captains) stand fast; each right
  company's right and left guides post in front of their company's right
  and left files respectively, both facing right, each resting his right
  arm gently on the breast of the front-rank man of that file, to mark
  direction for the incoming left company.
- ¶441: At `MARCH`, only the **left companies** march (their own captains
  standing fast, watching); as each left company nearly clears the (now
  static) right company beside it, its own captain commands the halt/front
  sequence.
- ¶442: Timing: the halt caution is given with **4 paces** still to march;
  `HALT` the instant it clears its right company; `FRONT` immediately
  after.
- ¶443: Once fronted, files (if gapped) incline right to close up; the
  captain posts on the left of the right company of the newly formed
  division, aligning himself on that company's front rank.
- ¶444: The left company's left guide posts before one of its own three
  left files, faces right, and covers the guides of the right company;
  once the captain sees him properly placed, commands `Right--DRESS`.
- ¶445: Left company dresses forward onto the right company's alignment;
  the front-rank man opposite the left guide rests lightly against the
  guide's right arm (contact-based alignment cue); captain aligns on this
  man, then commands `FRONT` without leaving his post.
- ¶446–447: Once all divisions are formed, colonel commands `Guides--
  POSTS`; the marking guides return to their normal column posts, the left
  guide of each right company passing through the interval at the centre of
  the division (captains and covering sergeants stepping out to let this
  happen, per ¶470, out of range); captains resume their prescribed posts
  (¶87, out of range).
- ¶448: **Colonel**, from the directing flank, superintends the whole
  movement.

#### Start/end state
Start: column closed in mass, **by company** (8 discrete company units,
right in front), halted. End: column closed in mass, **by division** (4
paired units), halted — each division formed by its left company
sidestepping (facing left, marching a few paces laterally/forward, then
facing front and dressing) into line abreast its partner right company.

#### Distances/measurements
- Halt-caution timing: **4 paces** remaining before the left company would
  fully clear (¶442) — i.e., commands are anticipatory, not reactive.
- No explicit lateral-distance figure given beyond "as each shall see that
  his company, filing past, has nearly cleared the column" (¶441) — judged
  by eye, same style as Article IX's distance-taking.

### From a march (¶449–452)

#### Commands
```
1. Form divisions. 2. Left companies, by the left flank. 3. MARCH (or double
quick--MARCH).
```
(¶449)

Per-company:
```
Such company, by the right flank--MARCH.
```
(¶451)

Resume:
```
4. Forward. 5. MARCH.
```
(¶451, continued — note these are given as commands 4–5 of the *same*
overall command sequence, not a separate colonel's command)

#### Sequence of actions
- ¶450: At command 1, **right companies'** captains command `Mark time`;
  **left companies'** captains caution a left-flank face.
- ¶451: At command 3, right companies mark time in place; left companies
  face left (i.e., turn to march directly sideways toward their partner);
  each left company's captain watches it file past and, once clear of the
  column, commands it back to the right flank (`Such company, by the right
  flank--MARCH`) to rejoin the marching line abreast its partner. Once all
  divisions are formed, colonel commands `Forward. MARCH` (commands 4–5).
- ¶452: At command 5, the column resumes its pre-maneuver gait. Guides
  remain on the right/left of their own companies; the right company's left
  guide passes into the file-closer line before the two companies unite;
  the left company's right guide steps into the rear rank. Captains resume
  posts per ¶87 (out of range).

#### Start/end state
Start: column by company closed in mass, **in march**. End: column by
division closed in mass, still in march at the same resumed gait — formed
without ever fully halting (right companies mark-time briefly instead of
stopping outright).

### From full or half distance instead of mass (¶453–456)

#### Commands
Quick time, halted, full/half distance:
```
1. Such company, forward. 2. Guide right. 3. MARCH.
```
(¶453)

Double-quick time:
```
1. Such company, by the right flank. 2. MARCH.
```
(¶453)

#### Sequence of actions
- ¶453: At a halt, at full or half distance (not mass), divisions form the
  same way, but after fronting, quick-time left-company captains post
  before their own company's centre and give the forward/guide-right/march
  command above; double-quick-time captains instead give the by-the-right-
  flank command as soon as their company clears the column.
- ¶454: The left company's right guide directs his march to arrive beside
  the right company's left-most man; once nearly up with the right
  company's rear rank, the captain halts it, finishing per ¶444 onward.
- ¶455: **Left in front**: mirror image — right companies now do what was
  prescribed for left companies above; the two marking guides (before each
  left company's right/left files) face left instead of right; at `Guides,
  posts`, guides and captains retake column posts.
- ¶456: If marching at full distance, divisions form per ¶236 (out of
  range, presumably the analogous Part Second procedure); if at half
  distance, per ¶449 (this article, marching-from-mass procedure above); if
  in double-quick, mark-time companies switch to quick time by their
  captains' command instead.

#### Start/end state
Start: column by company at full or half distance (not closed in mass),
halted or marching. End: column by division at the same distance
convention, formed via the same lateral-join mechanic, gait/halt state
preserved from before the maneuver.

### Remarks on forming divisions from a halt (¶457–461)

- ¶457: This movement is "the element of deployments" and must be executed
  with utmost accuracy.
- ¶458: If flank-marching companies don't preserve exact distances, gaps
  will open between files at the front-facing instant.
- ¶459: Halting too early leaves the joining company short of room, so
  files that haven't cleared the standing company's flank can't dress into
  line without laterally shoving ranks.
- ¶460: Halting too late forces an oblique incline to dress, which — like
  the too-early fault — propagates alignment error into later companies in
  a deployment.
- ¶461: Whenever a guide must step out to mark a subdivision's direction,
  he must place himself opposite one of the **three outer files** of that
  subdivision once aligned; too much offset from those files leaves the
  chiefs with no assured alignment point.

#### Cross-references (not chased)
- ¶470 (captains/covering sergeants stepping out for guides to pass) —
  out of range but referenced twice in this article.
- ¶87 (captains' habitual column posts) — out of range.
- ¶236 (Part Second division-forming while marching at full distance) —
  out of range.
- ¶321 (facing-about while marching) — already flagged under Article IX.

#### Complexity notes
Three parallel variants (halt+mass, march+mass, halt-or-march+full/half
distance) of essentially the **same lateral pairing-up maneuver**: one
company of each pair sidesteps (via a brief flank-face-and-march, not a
wheel) into line abreast its partner, using contact/dress-based alignment
(guide's arm against the front-rank man's breast, ¶445) rather than a
measured distance. Engine implications:
- A `formDivisions(companies, { fromHalt: bool, distance:
  'mass'|'half'|'full', frontInDirection: 'right'|'left' })` function that
  pairs adjacent companies (1-2, 3-4, 5-6, 7-8) and, for the "left" company
  of each pair, executes: face-flank -> lateral march -> halt (timed 4 paces
  early) -> front -> dress-onto-partner. The "right" company of each pair is
  either fully static (halt case) or mark-times (march case) — a genuinely
  different treatment of the two halves of a pair, not a symmetric ployment.
- This is the direct inverse of what will presumably appear later
  (deconstructing divisions back into companies, likely Part Fourth/Fifth
  territory, out of this range) — worth flagging to whoever specs that
  so the two share a primitive.
- The guide-marks-direction-by-touch alignment technique (¶440, ¶444–445)
  is a recurring Casey idiom (also seen in Article IX's distance-taking
  and Article VIII's halt-based direction change) — likely worth one
  shared "guide posts and captain dresses onto contact point" animation
  primitive reused across several battalion drills, not reinvented per
  drill.

---

## Summary of new engine capability needed (this range only)

1. **Parameterized subdivision granularity** (company vs. division-pair) —
   nearly every article in this range gives the same maneuver twice, once
   per granularity; a single implementation parameterized by subdivision
   size covers both.
2. **Block-wheel with staggered start and dynamic gap-closing** (Article
   VIII, marching-change-of-direction) — divisions/companies wheel
   simultaneously (not sequentially), staggered by arrival-at-wheel-point,
   actively closing to a 4-pace transient gap during the turn.
3. **Face-flank/translate/halt-and-square block primitive** (Article VIII,
   halt-based change of direction) — distinct from wheeling; leader-first
   strict-order dependency; needs persistent ground-marker objects.
4. **Distance-taking sequencer** (Article IX, all three sub-variants) — one
   fixed anchor subdivision, others release front-to-rear or rear-to-front
   in judged (not clocked) succession, converging on a marker-defined
   prolongation line. Parameterize by anchor end and target distance.
5. **Alternating-pivot, small-radius, in-place file-wheel countermarch**
   (Article X, closed-in-mass variant) — the single newest and most complex
   mechanic in this range: N/2 divisions (or N companies) each perform an
   independent 180° pivot wheel in parallel, alternating pivot flank
   (odd=right guide, even=left guide), with a "break two files to the rear"
   spacing step first. This does NOT reuse the existing company-scale
   countermarch and needs its own design.
6. **Lateral pairing-up / division-forming primitive** (Article XI) — one
   company of a pair flank-marches a short lateral distance to join its
   static (or mark-timing) partner, aligning by guide-contact rather than
   measured distance; three flavors (halt+mass, march+mass, full/half
   distance) share one shape.
7. A reusable **"guide posts by contact, captain dresses onto him"**
   alignment/annotation primitive recurs across Articles VIII, IX, and XI
   and should be built once and shared.

All commands, distances, and paragraph citations above are transcribed
directly from `casey_v2_full_extract.txt` ¶343–462; skirmisher-supplement
paragraphs (0-###) are cited but their content is out of engine scope per
the project's current focus on the battalion-of-companies model.
