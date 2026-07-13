# Part Fifth-E: Article XIV, "Dispositions against cavalry" (¶999 – ~¶1105)

Source: `casey_v2_full_extract.txt`, Article XIV, "SCHOOL OF THE BATTALION," begins at file line 5389 (page 128).
This spec covers the FIRST portion of Article XIV. A sibling spec (part-fifth-f or similar) covers the remainder
through ¶1211, where Article XV begins (file line 6397).

STATUS: COMPLETE for the assigned range ¶999–¶1105. Stopped at a clean boundary: ¶1106
begins a new named procedure ("To form square, forward on the centre companies") which is
the natural starting point for whichever agent covers ¶1106 onward.

## Overall square geometry (read this first)

For an 8-company battalion organized into 4 divisions of 2 companies each (matching this
project's existing `DEFAULT_BATTALION` / `columnOfCompanies()` structure), forming square
from a column by company produces a **hollow rectangle with 4 faces, each 2 companies wide**:

- **1st front** = the 1st division (2 companies), unchanged in facing — this is the face that
  was leading the column (¶1018: "the first division will always be the first front").
- **4th front** = the 4th division (2 companies), which closes up and faces about 180° to
  become the opposite (rear) wall (¶1018: "the last division, the fourth front").
- **2nd front** = the *right* company of the 2nd division plus the *right* company of the 3rd
  division (2 companies total), each wheeled 90° to face outward/right, forming the wall
  parallel to the original march axis on the right (¶1018).
- **3rd front** = the *left* company of the 2nd division plus the *left* company of the 3rd
  division (2 companies total), each wheeled 90° to face outward/left, forming the parallel
  wall on the left (¶1018).

So each division of the marching column contributes to exactly one face, EXCEPT divisions 2
and 3, which each split down the middle (one company to the right wall, one to the left wall).
The 1st and 4th fronts are literally the un-split 1st/4th divisions; the 2nd and 3rd fronts are
each a composite of two companies drawn from two different (adjacent) divisions.

**Corners are not reinforced or doubled with extra troops** in this portion of the text. The
only corner-specific treatment is individual **files** turning 90° in place: the outer
right/left files of the 1st division face right/left respectively (¶1009), and the outer files
on each flank of the 4th division face outward (¶1011) — a single file, not a company, pivots
to visually cap each of the four corners. Flag: it is worth checking Article XV/the "forward on
centre companies" and "four ranks" procedures (¶1106+, out of this agent's range) for whether
a different corner treatment (actual doubling) appears there — nothing in ¶999–1105 describes
doubling.

The interior of the square holds: skirmishers (as two platoon-columns that reposition near the
centre), the band/music, the color party, and the field & staff (colonel, lieutenant-colonel,
majors) — see per-section detail below.

---

## 1. Form square from column by company, half distance, at a halt (¶999–1018)

**Preconditions:** battalion in column by company, half distance, right in front, halted; colonel
must first cause divisions to be formed (pairing companies into 4 divisions) before giving the
square commands.

**Commands** (¶999, ¶1008 — note the execution command is *withheld* until preparatory
dispositions are complete, an unusual split):
> 1. Form square. 2. Right and left into line, wheel.
> [dispositions occur here, ¶1000–1007]
> 3. MARCH (or double quick — MARCH).

**Sequence of actions:**

*At command 1 ("Form square"):*
- ¶1000: File closers of each company of the **4th division** pass by the outer flanks of their
  companies and place themselves 2 paces before the front rank, opposite their respective
  places in line of battle, faced toward the head of the column. The music (2 ranks) places
  itself at platoon distance behind the inner platoons of the **2nd division**.
- ¶1001: The lieutenant-colonel faces the left guides; the senior major (placing himself on the
  right of the column, abreast with the 1st division) faces the right guides; both align the
  guides from the front onto the respective guides of the 4th division (who stand fast, holding
  their pieces inverted, perpendicularly). Right guides take exact distances when placing on the
  direction; guides of the 2nd division take their distance from the rear rank of the 1st.
- ¶1002 (skirmisher addendum, "0-"): platoon columns (of the skirmisher companies) face to the
  left; each chief and guide places himself as prescribed No. 879 (cross-ref, not chased).
  Columns take the double-quick step. 1st platoon column conducted to the rear, 2nd
  diagonally to the front; both take position in rear of the inner platoons of the division next
  to the last (i.e., the 3rd division); front rank of the leading platoons 4 paces from the rear
  rank of that division; 1st platoon column on the right of the 2nd.
- ¶1003 (0-): junior major places himself 4 paces in rear of the centre of the platoon columns.

*At command 2 ("Right and left into line, wheel"):*
- ¶1004: Chief of the 1st division cautions it to stand fast. Captains of the 2nd and 3rd
  divisions place themselves before the centres of their companies and caution them that the
  right companies will wheel to the right, and left companies to the left, into line of battle.
- ¶1005: Color-bearer steps back into the line of file closers (opposite his line-of-battle place),
  replaced by the corporal of his file (from the rear rank); that corporal's file-closer
  counterpart steps into the rear rank.
- ¶1006: Chief of the 4th division commands "1. Fourth division, forward. 2. Guide left," and
  places himself 2 paces outside its left flank.
- ¶1007: Simultaneously, the junior major commands "1. Skirmishers forward. 2. Guide centre."
- ¶1008: Colonel commands "3. MARCH (or double quick–MARCH)."

*At command 3 (MARCH):*
- ¶1009: 1st division **stands fast**, but its right file faces to the right and its left file faces
  to the left (these become the front two corner-capping files of the square).
- ¶1010: Companies of the 2nd and 3rd divisions **wheel to the right and left into line**
  respectively (right company of each wheels right, left company wheels left) — this is the
  90° pivot that turns them into the 2nd/3rd fronts. Music advances a space equal to the front
  of a company.
- ¶1011: 4th division closes up to close the square; when closed, its chief halts it, faces it
  about (180°), and aligns it by the rear rank on the division's guides (who remain faced to the
  front throughout). The junior captain passes into the rear rank (now become front); the
  covering sergeant of the left company places himself behind him in the front rank (now
  rear). File closers close up 1 pace on the front rank; the outer file on each flank of the
  division faces outward (rear corner caps).
- ¶1012 (0-): skirmishers advance a distance equal to a company front, their centre guide
  directing himself on the centre of the first front of the square.

**Guides posted / final interior state (¶1013–1018):**
- ¶1013: colonel commands "Guides — POSTS."
- ¶1014: chiefs of the 1st and 4th divisions, and the guides of all divisions, enter the square
  (move to the interior).
- ¶1015: captains whose companies wheeled to the right into line remain on the left of their
  companies; the left guide of each such company covers its captain in the rear rank; the
  covering sergeant of each places himself as a file closer behind the right file of his company.
- ¶1016: field and staff enter the square: lieutenant-colonel behind the left, senior major
  behind the right, of the 1st division; junior major in rear of the centre of the skirmishers.
- ¶1017: (doctrinal note, not geometry) a battalion should never present an odd company near
  enemy cavalry; an odd company should be consolidated with others.
- ¶1018: **the canonical front-naming rule** — quoted in full above ("Overall square geometry").

**Start/end state:** Start = column by company (4 divisions × 2 companies), half distance,
right in front, halted. End = hollow-rectangle square as described in the geometry overview
above, halted, with skirmishers/music/staff/colors positioned in the interior.

**Distances/measurements:** 2 paces (4th-division file closers ahead of front rank); platoon
distance (music behind 2nd division, initially); 4 paces (platoon-column front rank to
division's rear rank; junior major behind platoon columns); 2 paces (chief of 4th division
outside its left flank); 1 pace (file closers close up on front rank at 4th-division halt);
"a distance equal to a company front" (skirmisher advance); "a space equal to the front of a
company" (music advance).

**Cross-references (not chased):** No. 879 (platoon-column chief/guide placement, likely in
the skirmisher article).

**Complexity notes for a `formSquare()` engine primitive:**
- Needs a **90°-wheel-into-line** transform applied independently to the right and left
  companies of divisions 2 and 3 — this is different from the existing `wheel()` used for
  battalion-line wheels, because here two *different* companies wheel in *opposite* directions
  (right company clockwise, left company counterclockwise) while remaining anchored to their
  division's position along the column axis.
- Needs a **close-up-and-face-about** transform for the trailing division (4th), analogous to
  `aboutFace()` but combined with a forward-closing translation to eliminate the half-distance
  gap.
- Needs **file-level partial facing** (not company-level) for the four corner-capping files —
  the engine currently manipulates whole companies/platoons as rigid groups; this requires
  peeling a single file (2 soldiers, front+rear rank) out of a company and rotating it
  independently.
- Needs a way to place "virtual"/non-company actors (skirmisher platoon columns, music block,
  field & staff, color party) at computed interior offsets that are NOT expressed as
  company-formation primitives at all — likely a separate small set of point-placement rules
  layered on top of the four-face geometry.
- The whole choreography has TWO logical command points with dispositions happening
  in between (command 2 issued, several paragraphs of repositioning occur, THEN command 3
  "MARCH" is given) — an animation keyframe sequence should probably represent this as 3+
  keyframes (post-command-1 setup, post-command-2 setup, then the actual wheel/march motion),
  not a single tween.

---

## 2. Form square from column by company, half distance, in march (¶1019–1028)

**Preconditions:** battalion in column by company, half distance, right in front, **marching**
(not halted). Colonel first causes divisions to be formed.

**Commands** (¶1019 — issued as one continuous 3-part sequence, unlike Section 1's split,
because the battalion is already moving):
> 1. Form square. 2. Right and left into line, wheel. 3. MARCH (or double quick — MARCH).

**Sequence of actions:**
- ¶1020: At the first command, chief of the 1st division cautions it to remain faced to the
  front and commands "First division" (i.e., keep it marching straight). Captains of the 2nd
  and 3rd divisions rapidly place themselves before the centres of their companies and caution
  the wheel-right/wheel-left as in Section 1. Chief of the 4th division cautions it to continue
  its march and hastens to its left flank. File closers and music execute what is prescribed
  No. 1000 (same as the halted case).
- ¶1021: At the second command, the color-bearer and corporals execute No. 1005 (same swap
  as Section 1).
- ¶1022: At the third command (MARCH), briskly repeated, the chief of the 1st division
  commands "Halt" and aligns his division to the left; outer files face right and left. **The
  rest of the movement is executed as prescribed Nos. 1010 and following** — i.e., from this
  point on it is identical to the back half of Section 1 (2nd/3rd division wheel-into-line, 4th
  division close-and-face-about, guides posted, etc.).
- ¶1023: Lieutenant-colonel and senior major, at the command march, conform to No. 1001
  (facing/aligning the guides).
- ¶1024 (0-): platoon columns execute what has been prescribed for forming square from a
  halt, but move **on a run** to reach their places (gait difference only).
- ¶1025: **Addendum for double-column starting state** — "If the battalion, before the square
  is formed, be in double column, the two leading companies will form the first front, the two
  rear companies the fourth [front]; the other companies of the right half-battalion will form
  the second [front], and those of the left half-battalion the third front." This describes an
  alternate mapping when the pre-square formation is a *double column* (two companies
  abreast) rather than a single column-of-companies.
- ¶1026 (0-): if the square is formed from double column, at the first command the platoon
  columns face left and right (or by the left/right flanks) and proceed to the positions
  prescribed No. 1002.
- ¶1027: **General rule**: the 1st and 4th fronts are commanded by the chiefs of the 1st and
  4th divisions; each of the other two fronts is commanded by its senior captain.
- ¶1028: **General rule**: the commander of each front places himself 4 paces behind the
  centre of its present rear rank, and is replaced momentarily in command of his own company
  by the next officer in rank in that company.

**Start/end state:** Start = column by company, half distance, marching. End = same
hollow-rectangle square as Section 1 (front-naming per ¶1018 unaffected), reached while
in motion; the 1st division must be actively halted and aligned (¶1022) rather than simply
"standing fast" as when starting from a halt.

**Distances/measurements:** none new beyond Section 1's; ¶1024 only changes gait (a run
rather than double-quick).

**Cross-references (not chased):** Nos. 1000, 1001, 1002, 1005, 1010ff (all internal, already
covered in Section 1).

**Complexity notes:** Reinforces that the engine's square-forming primitive must accept both a
"from halt" and "from march" entry mode, differing only in the 1st division's initial
behavior (stand fast vs. halt-and-align) — the wheel/close-up geometry for divisions 2–4 is
identical either way. Also introduces a **double-column starting variant** (¶1025) with a
different front→company mapping that a general `formSquare()` primitive would need to branch
on depending on the pre-formation type (single column of companies vs. double column).

---

## 3. Form square if column is at full (not half) distance (¶1029–1038)

Two sub-cases, both reducing to "first close the column to half distance, then apply Section
1 or Section 2."

### 3a. Halted, full distance (¶1029–1034)

**Commands** (¶1029):
> 1. To form square. 2. To half distance, close column. 3. MARCH (or double quick — MARCH).

- ¶1030 (0-): at the first command, platoon columns are put in march and take the positions
  prescribed No. 1002 as soon as the division next to the last has its distance.
- ¶1031: at the command march, the column closes to company [half] distance; the 2nd
  division takes its distance from the rear rank of the 1st division.
- ¶1032: senior major places himself on the right of the column, abreast with the 1st
  division; music places itself as prescribed No. 1000.
- ¶1033: the moment the 4th division halts, its file closers place themselves as prescribed
  No. 1000.
- ¶1034: dispositions complete — colonel may now either march the column or form square;
  if forming square, it is executed **by the commands and means prescribed No. 999 and
  following** (i.e., Section 1's halted procedure, now that the column is at half distance).

### 3b. In march, full distance (¶1035–1038)

- ¶1035: "A battalion being in column by company, at full distance, right in front, and in
  march, when the colonel shall wish to form square, he will cause to be executed what is
  indicated Nos. 1029 and 1030" (the closing-to-half-distance maneuver, done on the move).
- ¶1036: at the command march, the column closes to company distance as prescribed No. 332
  (cross-ref, not chased); when the chief of the 4th division commands "Quick, march," the
  file closers of that division place themselves before the front rank.
- ¶1037: senior major and music conform to No. 1000.
- ¶1038: colonel then forms square **by the commands indicated No. 1019, and the means
  prescribed No. 1020 and following** (i.e., Section 2's marching procedure).

**Start/end state:** Start = column by company at *full* distance (halted or marching). Middle
= column closes to half distance (a distance-closing maneuver, not itself square-related).
End = same hollow-rectangle square as Sections 1/2 — full distance is purely a precondition
that gets normalized away before the actual square-forming wheel occurs.

**Distances/measurements:** "half distance" vs "full distance" are referenced but not
numerically defined in this range (defined elsewhere in the manual, e.g. around No. 386/394 —
cross-ref only).

**Cross-references (not chased):** Nos. 332, 386, 394, 999, 1000, 1002, 1019, 1020ff.

**Complexity notes:** No new square geometry — this is purely a "normalize distance, then
delegate to Section 1/2" case. An engine `formSquare()` should treat distance-closing as a
separate, prependable sub-step rather than a distinct square-forming mode.

---

## 4. Form square if column by division (mass) — halted or marching (¶1039–1048)

Two sub-cases: column-by-division in mass (companies of each division side-by-side, no gap
between divisions) either halted or marching. Both first take half distance between divisions,
then delegate to Section 1 or 2.

### 4a. Halted, in mass (¶1039–1042)

**Commands** (¶1039):
> 1. To form square. 2. By the head of column, take half distance.

- ¶1040: divisions take half distance by the means indicated No. 386 and following (cross-ref);
  what is prescribed No. 1032 (senior major position, music placement) executes as the 1st and
  2nd divisions are put in motion.
- ¶1041: colonel halts the column the instant the last division has its distance; dispositions
  indicated No. 1033 (4th-division file closers) then execute; once complete, colonel proceeds
  to form square (via Section 1's halted procedure, implicitly).
- ¶1042 (0-): at the first command, platoon columns march toward their places in column,
  taking the places prescribed No. 1002 as soon as the division next to the last has its
  distance.

### 4b. In march (¶1043–1048)

**Commands** (¶1043):
> 1. To form square. 2. By the head of column, take half distance. 3. MARCH.

- ¶1044: executed as prescribed No. 394 and following (cross-ref); No. 1032 executes as the
  1st and 2nd divisions are put in motion.
- ¶1045: colonel proceeds to form square the moment the last division has its distance, **by
  the commands indicated No. 1019, and the means prescribed No. 1020 and following**
  (Section 2's marching procedure).
- ¶1046 (0-): platoon columns execute what is prescribed No. 1024 (move on a run), taking
  their places in column as soon as the last division has its distance.
- ¶1047: **Important general rule**: "In a simple column, left in front, these several movements
  will be executed according to the same principles, and by inverse means; but the fronts of
  the square will have the same designations as if the right of the column were in front, that
  is, the first division will constitute the first front, and thus of the other subdivisions."
  I.e., front-naming (1st division = 1st front, etc.) is **invariant** to whether right or left
  is leading the column — only the mechanical left/right details of the wheels invert.
- ¶1048 (0-): if the left is in front, the platoon columns take their places in rear of the
  inner platoons of the **2nd** division (mirrors the right-in-front placement).

**Start/end state:** Start = column by division "in mass" (no gaps between divisions), halted
or marching. Middle = divisions open to half distance. End = same hollow-rectangle square,
same front-naming convention, regardless of right- or left-in-front.

**Distances/measurements:** "half distance" (target spacing) — numeric value not given here.

**Cross-references (not chased):** Nos. 386, 394, 1000, 1019, 1020ff, 1024, 1032, 1033.

**Complexity notes:** Confirms the front-naming rule (division 1 → front 1, division 4 →
front 4, right/left split of divisions 2/3 → fronts 2/3) holds regardless of march-column
orientation (right-in-front vs left-in-front), which simplifies the engine primitive — it can
always key faces off division index rather than off "which flank is leading."

---

## 5. Battalion in square, advance a distance less than 30 paces (¶1049–1055)

**Commands** (¶1049, colonel names the leading front):
> 1. By (such) front, forward. 2. MARCH.

**Sequence of actions** (example given: advance by the 1st front):
- ¶1050: chief of the 1st front commands "1. First division, forward. 2. Guide centre."
- ¶1051: chief of the 2nd front faces his front to the left; captains of that front place
  themselves outside and on the right of their left guides (who replace them in the front rank).
  Chief of the 3rd front faces his front to the right; captains place themselves outside and on
  the left of their covering sergeants. Chief of the 4th front faces his front **about** and
  commands "1. Fourth division, forward. 2. Guide centre." The captain in the centre of the
  1st front directs the march, regulating himself per School of the Company No. 89 (cross-ref).
- ¶1052: at the command march, the whole square moves; companies that are marching **by
  the flank** (i.e., the 2nd/3rd — side — fronts, which travel sideways relative to their own
  facing to keep pace with the front/rear faces) must be careful not to lose their distances.
  Chief of the 4th division keeps his division constantly closed on the flanks of the 2nd and
  3rd fronts.
- ¶1053: at the colonel's first command, junior major commands "1. Skirmishers forward. 2.
  Guide centre"; they move at the command march.
- ¶1054: this movement (advance under 30 paces) is executed **only in quick time** — never
  double quick.
- ¶1055: lieutenant-colonel places himself in rear of the file of direction to regulate the march.

**Start/end state:** the square as a rigid hollow rectangle translates forward (or in whichever
direction the named front leads); the front face marches straight ahead in its own facing, the
two side faces sidestep ("march by the flank") to remain attached at the corners, and the rear
face follows, faced about, i.e. marching backward relative to its own facing. The square's
shape and internal front-numbering (per ¶1018) do not change.

**Distances/measurements:** threshold is **30 paces** — this is the dividing line between this
"walk the box" procedure (Section 5/6) and the "collapse to column, then re-march" procedure
(Section 7).

**Cross-references (not chased):** S.C. No. 89.

**Complexity notes:** Requires a "translate whole square as rigid body" primitive where 2 of
the 4 faces move in their *own* line-of-march direction (front/rear faces) and the other 2
move perpendicular to their own facing ("by the flank" = sideways relative to each company's
own orientation). This is analogous to a group of soldiers doing a flank march while a
formation-level parent transform performs a plain translate — worth checking whether the
existing engine's per-soldier facing vs. movement-direction decoupling (if any) already
supports this, or whether it needs new support (soldier facing ≠ direction of travel).

---

## 6. Halt the square / advancing by other fronts (¶1056–1059)

**Commands** (¶1056):
> 1. Battalion. 2. HALT.

**Sequence of actions:**
- ¶1057: at the second command, the square halts; the 4th front faces about **immediately and
  without further command**; the 2nd and 3rd fronts face outward; captains of companies
  resume their places as in the static square.
- ¶1058: **general rule** — the same procedure (Section 5 + this halt behavior) applies "in
  moving the square forward by the second, third, or fourth fronts" — i.e., any of the 4 faces
  can be designated as the "leading" face for a given advance, not just the 1st.
- ¶1059 (0-): skirmisher reorientation depends on which front led the advance: if led by the
  4th front, skirmishers face about (at the colonel's first command); if by the 2nd front, they
  face right; if by the 3rd front, they face left.

**Start/end state:** square returns to (or remains in) its halted, fully-faced-outward
configuration — front/rear faces facing their respective original directions, side faces
facing outward (perpendicular) — regardless of which face most recently led a short advance.

**Distances/measurements:** none new.

**Complexity notes:** Confirms the square data model needs a "currently leading face" concept
distinct from the fixed 1st/2nd/3rd/4th division-based naming (¶1018/¶1074) — any of the 4
named fronts can temporarily become the line of march, and the halt behavior (¶1057) must
correctly re-derive "which face is now the rear (faces about)" and "which two faces are now
the sides (face outward)" from whichever front was leading, not always assume the 4th/2nd/3rd
roles literally.

---

## 7. Battalion in square, form column to advance a greater distance (>30 paces) (¶1060–1069)

**Commands** (¶1060, ¶1064 — again a withheld-execution-command pattern like Section 1):
> 1. Form column.
> [dispositions occur here, ¶1061–1063]
> 3. MARCH (or double quick — MARCH).

**Sequence of actions:**
- ¶1061: chief of the 1st front commands "1. First division, forward. 2. Guide left."
- ¶1062: commander of the 4th front cautions it to stand fast. Commander of the 2nd front
  faces it to the left, then commands "By company, by file left." Commander of the 3rd front
  faces it to the right, then commands "By company, by file right." At the moment the 2nd/3rd
  fronts face left/right, **each captain breaks to the rear the three leading files of his
  company** (a specific file-count detail — 3 files peel off first).
- ¶1063 (0-): skirmishers cautioned by the junior major to stand fast.
- ¶1064: colonel commands "3. MARCH (or double quick — MARCH)."
- ¶1065: at this command, the 1st front marches forward; its chief halts it once it has
  advanced **a space equal to half its front**, and aligns it by the left.
- ¶1066: the corresponding companies of the 2nd and 3rd fronts **wheel by file** to the left
  and right respectively, and march to meet each other **behind the centre of the 1st
  division**; the instant they unite, the captain of each company halts his company and faces
  it to the front. The (re-formed) division's chief then aligns it by the left. (This
  reconstitutes the original division-2/division-3 company pairings, undoing the front-2/front-3
  split from square-formation.)
- ¶1067: commander of the 4th front faces it about; its file closers remain before the front
  rank (they do NOT return to the rear yet).
- ¶1068: column thus re-formed; colonel may put it in march by the commands/means
  prescribed No. 219 and following (cross-ref); right guides preserve company distance exactly
  as the directing guides.
- ¶1069: to re-form square from here, colonel gives the commands indicated No. 1019 (Section
  2's marching form-square procedure).

**Start/end state:** Start = hollow-rectangle square, halted. End = an ordinary column by
company at half distance, right in front, headed by what was the 1st front — the square has
been "unfolded" back into a marching column via a **file-wheel** peel of the two side faces'
companies, which curl in behind the 1st division to re-form divisions 2 and 3, while the 4th
front becomes the new column tail (faced about).

**Distances/measurements:** "half its front" (1st front's advance-then-halt distance); "three
leading files" (broken to the rear at the moment 2nd/3rd fronts face left/right).

**Cross-references (not chased):** No. 219ff, No. 1019.

**Complexity notes:** This is the genuinely hardest new primitive: a **"wheel by file"** —
each side-face company breaks into a trailing single-file line led by its file leader, which
curls around a corner and marches to converge with its counterpart company behind the new
column head, then re-halts and re-faces as a rigid company. This is materially different from
the whole-company 90° wheel used to *form* the square (Section 1) — it is a per-file
"snake"/arc motion (more like a sequential file-following-file column wheel, similar in spirit
to existing wheel-based file movements elsewhere in the manual, but not currently modeled by
any existing engine primitive). An engine implementation would likely need a parametric path
(e.g. an L-shaped or quarter-circle path) that each file walks nose-to-tail, with timing offset
per file so they "peel" sequentially rather than move as one rigid block.

---

## 8. Marching the square/column in retreat or advance beyond 30 paces; reversing direction (¶1070–1085)

This cluster covers converting the "column formed from square" (Section 7's end state) between
forward-marching and retreat-marching, and reversing an already-marching column — logistics for
sustained movement, not additional square *geometry*.

**8a. Face the column by the rear rank, to march in retreat (¶1070–1074):**
> 1. To march in retreat. 2. Face by the rear rank. 3. Battalion about — FACE.

- ¶1071 (0-): at the first command, junior major commands "1. Skirmishers, outward face. 2.
  Double quick — MARCH." 1st platoon column faces right, 2nd faces left; at the command
  march, both platoon columns (led by their platoon chiefs) file around the flanks of the
  division, march to the front, file around the flanks of the 2nd division, face to the rear,
  and cover the inner platoons of that division.
- ¶1072: at the second command, file closers of the *interior* divisions pass by the outer
  flanks of their companies and place themselves behind the front rank, opposite their
  line-of-battle places; file closers of the other divisions stand fast.
- ¶1073: at the third command, the battalion faces about; each division chief places himself
  before its rear rank (now become front), passing through the interval between its two
  companies; guides step into the rear rank (now front).
- ¶1074: column thus disposed — colonel may march it, or form square as if it were faced by
  the front rank; **the square's fronts keep the same designations they had when faced by the
  front rank** (facing about does not relabel the four fronts).

**8b. In square by the rear rank, short vs. long moves (¶1075):**
- ¶1075: moving <30 paces conforms to Section 5/6 (No. 1049ff); for a greater distance,
  re-form the column per Section 7's principles (No. 1060), but by marching FORWARD the
  **4th front** (since it is now the lead face after the about-face).

**8c. Face the column by the front rank, to march in advance beyond 30 paces (¶1076–1078):**
> 1. To march in advance. 2. Face by the front rank. 3. Battalion about — FACE.

- ¶1077: executed as prescribed No. 1072 and following (mirror of 8a).
- ¶1078 (0-): at the first command, junior major gives the commands indicated No. 1071;
  platoon columns are faced outward and marched to positions in rear of the division next to
  the last, per No. 1071.

**8d. Reverse a forward-marching column to retreat (¶1079–1081):**
> 1. To march in retreat. 2. Battalion right about. 3. MARCH (or double quick — MARCH).

- ¶1080 (0-): junior major and skirmishers execute No. 1071; gait is double quick or a run
  depending on whether the colonel said "march" or "double quick march."
- ¶1081: at the second command, file closers of the 2nd and 3rd divisions place themselves
  rapidly before the front rank of their divisions. At the command march, the column faces
  about and moves off to the rear; division chiefs and guides conform to No. 1073.

**8e. Reverse a retreating column to advance (¶1082–1084):**
> 1. To march in advance. 2. Battalion right about. 3. MARCH (or double quick — MARCH).

- ¶1083 (0-): junior major and skirmishers execute No. 1078; gait per No. 1080.
- ¶1084: at the second command, file closers of the 2nd and 3rd divisions place themselves
  before the **rear** rank of their divisions (note: rear, not front — opposite of 8d/¶1081);
  at the third command, the column faces by the front rank.

**8f. General marching rule (¶1085):**
- While marching, in advance or retreat, the guide of the division next to the leading one is
  careful to estimate his distance from the rear rank of the division in front.

**Start/end state:** All of Section 8 operates on the *column* form (post Section-7 unfold),
not the hollow square itself — it is about which rank (front or rear) leads the column and
how file closers/skirmishers/guides relocate when the column reverses direction via
about-face. No new square-face geometry is introduced.

**Distances/measurements:** none new (see Section 7 for the "half front" advance distance that
gates when Section 7/8 applies vs. Section 5/6).

**Cross-references (not chased):** Nos. 1071, 1072, 1073, 1078, 1080.

**Complexity notes:** Mostly file-closer/skirmisher bookkeeping on top of an ordinary
column-marching and about-face primitive that likely already exists (`aboutFace()` per
project's engine). The one square-specific nuance worth encoding: fronts keep fixed identity
(1st/2nd/3rd/4th tied to division) independent of which rank is currently "front" for marching
purposes (¶1074) — i.e., "leading face" (Section 6's dynamic concept) and "fixed front
identity" (¶1018/1074) are two separate properties the data model must track simultaneously.

---

## 9. To reduce the square (¶1086–1088)

**Manual heading:** "To reduce the square."

**Commands** (¶1086):
> 1. Reduce square. 2. MARCH (or double quick — MARCH).

**Sequence of actions:**
- ¶1087: executed in the manner indicated No. 1060 and following (i.e., Section 7's
  "form column" file-wheel procedure) — **but** the file closers of the 4th front place
  themselves behind the rear rank the instant it faces about; and the field & staff, color-bearer,
  and music **return to their normal places in a marching column** (not the special square
  interior positions from ¶1013–1016).
- ¶1088 (0-): at the first command, skirmishers are faced to the right by the junior major;
  each platoon chief and guide places himself as prescribed No. 879. At the command march,
  the 1st platoon column (after clearing the flank of the division) is conducted diagonally to
  the front; the 2nd platoon column is conducted diagonally to the rear; both to their
  respective positions on the flanks of the battalion column.

**Start/end state:** Start = hollow-rectangle square, halted. End = the battalion in a fully
normal marching column by company (half distance), with field & staff, colors, and music
restored to their ordinary column posts — i.e., the complete inverse of Section 1, going one
step further than Section 7's "form column" (which left the formation still square-flavored/
interim) by also resetting all the non-company actors.

**Distances/measurements:** none new.

**Cross-references (not chased):** No. 1060ff, No. 879.

**Complexity notes:** "Reduce square" = Section 7's `formColumn()` primitive, PLUS a final
step that resets skirmisher platoon columns, music, field & staff, and colors to their default
column-march positions (essentially the inverse of the interior-placement rules noted in
Section 1's complexity notes). Worth implementing as `formColumn()` (Section 7) composed with
a `restoreColumnPositions()` step, rather than a wholly separate primitive.

---

## 10. Remarks on the rallying of skirmishers (¶1089)

**Manual heading:** "REMARKS ON THE RALLYING OF SKIRMISHERS."

- ¶1089 (0-): skirmishers are rallied on the battalion (which is in column, ready to form
  square) by the commands indicated No. 785 (cross-ref, not chased — likely in the skirmisher
  article). Skirmishers and reserves direct themselves **on a run**, around the flanks of the
  column, and take the position prescribed No. 1002 (the standard platoon-column position
  behind the inner platoons of the division next to the last).

**Start/end state:** Skirmishers, previously deployed/dispersed, reassemble into their two
platoon columns at the standard pre-square interior staging position, in preparation for a
subsequent "form square" command.

**Cross-references (not chased):** No. 785, No. 1002.

**Complexity notes:** A single-paragraph remark, not a maneuver requiring new geometry — it
just confirms skirmishers always target the same staging point (No. 1002's position) whether
arriving from a rally-on-the-run or from the routine square-forming choreography.

---

## 11. To form square from line of battle (¶1090–1105)

**Manual heading:** "To form square from line of battle."

This section covers converting a **deployed line** (not a column) into a column-by-division,
as *preparation* for forming square by the already-documented Section 1–4 procedures. It does
NOT itself describe new square-face geometry — the square that eventually results is the same
hollow rectangle from Sections 1–4. My assigned range stops at ¶1105; ¶1106 begins a new named
procedure ("To form square, forward on the centre companies" — the third option flagged at
¶1092) which is the natural starting point for continued coverage.

**¶1090 — overview:** "A battalion deployed may be formed into square, in a direction either
parallel or perpendicular to the line of battle." Two cases follow.

### 11a. Parallel case (¶1091)
- Colonel breaks the battalion by division to the rear, by the right or left, then closes the
  column to half distance, **as indicated No. 1029 and following** (Section 3's procedure).
  End state: an ordinary half-distance column-by-division, ready for Section 1/3's form-square
  commands.

### 11b. Perpendicular case — three options named (¶1092)
"He will ploy the battalion into simple column, by division at half distance in rear of the
right or left division, or into column doubled on the centre, or form square forward on the
two centre companies." Three sub-procedures follow for the first two options (¶1093–1105); the
third ("forward on the two centre companies") is deferred to ¶1106+ (out of range).

### 11c. Ploy into column on one flank division, from a halt (¶1093–1095)
**Commands** (¶1093):
> 1. To form square. 2. Column at half distance by division. 3. On the first (or fourth)
> division. 4. Battalion right (or left) — FACE. 5. MARCH (or double quick — MARCH).

- ¶1094: executed per the principles prescribed No. 159 and following (cross-ref); the
  division next to the leading one takes its distance from the rear rank of the one in front.
- ¶1095 (0-): at the 3rd/4th commands, skirmisher companies execute what is prescribed Nos.
  161 and 164 (cross-refs); each 2nd platoon plies in rear of its 1st. At the command march:
  if plying on the 1st division, the 1st platoon column marches straight forward a platoon
  distance, is then faced by the right flank by its chief, and on arriving opposite its place in
  the battalion column is faced again by the right flank, taking its position in rear of the
  division next to the last. The 2nd platoon column is marched diagonally to the rear and
  established on the left of the first.

**End state:** column by division at half distance, formed on (i.e., built out from) one flank
division — ready for the standard form-square commands (Section 1/2).

### 11d. Ploy into column on one flank division, while marching, perpendicular to the line (¶1096–1099)
**Commands** (¶1096):
> 1. To form square. 2. On the first (or fourth) division, form column. 3. Battalion by the
> right (or left) flank. 4. MARCH (or double quick — MARCH).

- ¶1097: executed per the principle prescribed for plying a column by division at half
  distance, No. 201 (cross-ref). Chief of the 1st division halts his division at the command
  march.
- ¶1098 (0-): skirmisher companies execute this as if from a halt: at the command march,
  companies face by the right flank, and each 2nd platoon takes double quick or a run
  (matching the battalion companies' gait) to ploy in rear of its 1st platoon.
- ¶1099: **tempo variant** — if the colonel commands "prepare for square" instead of "to form
  square," the chief of the leading subdivision commands quick time, and at the colonel's
  command march, the leading subdivision marches in quick time (rather than whatever gait was
  otherwise implied).

### 11e. Ploy into double column at half distance, from a halt (¶1100–1102)
**Commands** (¶1100):
> 1. To form square. 2. Double column at half distance. 3. Battalion inward — FACE. 4. MARCH
> (or double quick — MARCH).

- ¶1101: executed as prescribed No. 876 and following (cross-ref).
- ¶1102 (0-): at the 2nd/3rd commands, skirmisher companies execute what is prescribed Nos.
  877 and 879 (cross-refs). At the command march, the [platoon] columns are conducted to the
  positions prescribed No. 1002.

### 11f. Ploy into double column while marching (¶1103–1105)
**Commands** (¶1103):
> 1. To form square. 2. Form double column. 3. Battalion by the right and left flanks. 4.
> MARCH (or double quick — MARCH).

- ¶1104: executed as prescribed No. 890 (cross-ref); chief of the leading division halts his
  division at the command march, or commands quick time as indicated No. 1099 (the tempo
  variant from 11d).
- ¶1105 (0-): skirmisher companies execute this movement as if from a halt, observing what is
  prescribed No. 1098 (11d's skirmisher procedure). **[This is the last paragraph in this
  agent's assigned range.]**

**Start/end state (whole Section 11):** Start = battalion deployed in line of battle (or
marching in line). End = battalion in either a simple column by division (half distance, built
from one flank) or a double column (half distance) — in all cases a *precursor* state, not yet
a square; the colonel must still issue the Section 1–4 form-square commands from this column
state to actually produce the hollow-rectangle square.

**Distances/measurements:** "half distance," "platoon distance" (referenced, not newly
quantified here).

**Cross-references (not chased):** Nos. 159, 161, 164, 201, 785 (already listed §10), 876,
877, 879, 890, 1002.

**Complexity notes:** This section is entirely about **line-to-column plying** (deploy → column
transforms), which is a different — and likely already-partially-modeled — primitive category
from square-forming itself (the project's `columnOfCompanies()` and any existing line-to-column
ploy logic may already cover much of this). The only square-specific new content is the
**three-way branch at ¶1092** (parallel-break vs. flank-division ploy vs. double-column ploy vs.
[deferred] centre-companies ploy) that determines which precursor column shape feeds into the
Section 1–4 form-square procedures — worth modeling as an explicit "entry mode" enum on a
`formSquare()` primitive: `fromColumnOfCompanies`, `fromColumnOfDivisions`, `fromDoubleColumn`,
`fromLineParallel`, `fromLinePerpendicularFlank`, `fromLinePerpendicularDouble`, and (per ¶1106+,
out of range) `fromLineForwardOnCentre`.

---

## Summary for the next agent

Coverage confirmed complete and read word-for-word: **¶999 through ¶1105**, plus the Article
XIV heading and "Dispositions against cavalry" sub-heading at file line 5389–5392. Stopped at
the clean manual-internal boundary between ¶1105 (end of "To form square from line of
battle," 11f) and ¶1106 (start of "To form square, forward on the centre companies," a new
named procedure — the third option flagged but not detailed at ¶1092). **The sibling agent
covering the remainder of Article XIV should start reading at ¶1106** (file line ~5853) and
continue through ¶1211 where Article XV begins (file line 6397); that remaining span also
includes the "Squares in four ranks" sub-heading, confirmed to start at ¶1126 (file line
~5967-5974), so the sibling will need at least two more sub-topic sections beyond the
centre-companies procedure.

**Clearest one-paragraph description of the square's basic geometry:** Starting from an
8-company battalion in column by company (4 divisions of 2 companies each), forming square
produces a hollow rectangle 2 companies wide on each of its 4 sides: the leading division
becomes the front face unchanged; the trailing division closes up, faces about 180°, and
becomes the rear face; and the two middle divisions each split in half, with the right company
of each wheeling 90° to face outward-right (forming the right side wall, spanning front-to-rear)
and the left company of each wheeling 90° to face outward-left (forming the left side wall).
Corners are capped only by single files (not whole companies) turning 90° in place — there is
no company-level doubling/reinforcement of the corners described anywhere in ¶999–1105.
Skirmishers, music, colors, and field & staff all relocate to specific interior positions,
forming a hollow, fully-enclosed defensive box.

**Ambiguities/things flagged, not resolved:**
1. Whether corners get reinforced with extra troops anywhere later in Article XIV (¶1106+,
   "four ranks" square, or Article XV) — nothing in this agent's range describes doubling, but
   it's worth the sibling agent checking explicitly since square-corner reinforcement is a
   textbook cavalry-defense concern in period tactics generally.
2. "Company distance" is used at ¶1031/1036 seemingly as a synonym for "half distance" in
   context (closing a full-distance column down to half distance) — not 100% certain these are
   the same numeric value referenced elsewhere in the manual; flagged rather than assumed.
3. Several paragraphs (marked "0-" in the source, e.g. ¶1002, 1003, 1012, 1024...) appear to be
   sub-numbered/inserted addenda (likely skirmisher-specific asides) rather than the main
   numbered sequence — preserved and cited as such, but their exact editorial relationship to
   the main paragraph numbering (interpolated pages? a later edition's insertions?) is unclear
   from the plain-text extraction alone.


---

