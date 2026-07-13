# Part Fifth, Articles VI–XI — Retreat, Obstacles, Defile, Flank March, Form by File

Source: `casey_v2_full_extract.txt`. Part Fifth begins at line 3487 (heading)
/ line 3491 (real Article I, ¶648 by TOC estimate). Article boundaries in
this range confirmed by grepping `ARTICLE` and reading straight through
lines 3989–4428 (Article VI heading through Article XII heading, exclusive).

| Article | Title | Lines | Paragraphs |
|---|---|---|---|
| VI | To halt the battalion, marching in retreat, and to face it to the front | 3989–4020 | ¶744–750 |
| VII | Change of direction in marching in retreat | 4021–4037 | ¶751–752 |
| VIII | Passage of obstacles, advancing and retreating (+ Remarks on skirmisher disposition) | 4038–4224 | ¶753–787 |
| IX | To pass a defile, in retreat, by the right or left flank (+ Remarks on skirmishers) | 4225–4321 | ¶788–804 |
| X | To march by the flank | 4322–4383 | ¶805–819 |
| XI | To form the battalion on the right or left, by file, into line of battle (+ Remarks) | 4384–4428 | ¶820–829 |

Article XII ("To ploy the battalion into column doubled on the centre") begins
at line 4428/¶830 — out of range, not covered here.

Skirmisher-specific paragraphs are prefixed `0-` in the source extraction
(e.g. `0-746`, `0-829`). Per project convention they are noted but out of
animation scope (no skirmisher companies in the current 8-company model).

---

## Article VI — To halt the battalion, marching in retreat, and to face it to the front (¶744–750)

### Commands
Facing to the front while halted, retreat → front-facing:
> 1. Face to the front. 2. Battalion, about—FACE. (¶744)

Marching in line (by front rank) → about into retreat, without halting:
> 1. Battalion, right about. 2. MARCH. (¶747)

### Sequence of actions
- ¶744: colonel halts the battalion (already marching in retreat) and commands the about-face.
- ¶745: at the second command, the color-rank, general guides, captains, and covering sergeants all **retake their habitual line-of-battle places**; the color-bearer repasses into the front rank. This is the exact inverse of the retreat-facing choreography from Article V (¶730–743, out of range but cross-referenced) — colonel/lt-col/majors swap front/rear roles back.
- ¶0-746: skirmisher companies face about with the battalion (out of scope).
- ¶747–748: if instead the battalion is marching **forward** in line by the front rank and the colonel wants it to switch to retreat without halting, the command is simply "Battalion, right about. MARCH" — battalion faces to the rear and continues moving at the same gait, now led by the rear rank. Explicitly directs: "The principles prescribed Nos. 736 and following will be carefully observed" (¶748) — i.e., reuses the full ¶736+ choreography from Article V's initial retreat-facing sequence (color-bearer steps out 6 paces beyond file closers, general guides realign, covering sergeants to file-closer line, captains to what's now the leading rank, etc.) — that mechanic is assumed already implemented for Article V and simply re-triggered here.
- ¶749: to resume marching by the front, same commands are reissued (symmetric/reversible).
- ¶0-750: skirmishers come to right-about with the battalion, preserving relative position (out of scope).

### Start/end state
Start: battalion halted and marching-in-retreat-faced (rear rank leading), OR battalion marching forward in line. End: battalion faced to the front in place (first case) or marching in retreat at the same gait without a halt (second case).

### Distances/measurements
None new — inherits Article V's figures (6 paces color-bearer advance, etc., all out of this range).

### Cross-references
¶736 and following (Article V, out of range but implemented dependency — the retreat-facing role-swap choreography).

### Complexity notes
No new geometry. This is a role/facing toggle applied to the whole battalion-in-line formation, reusing whatever state machine Article V's retreat-facing drill already establishes (about-face + role reassignment for color guard/captains/guides). Should be modeled as two thin drills: (a) halted about-face (pure facing flip + role reassignment, no marching), (b) marching right-about (facing flip + gait continuation, re-invoking Article V's post-about choreography). Needs Article V's implementation as a dependency/reference — flag if Article V isn't yet built.

---

## Article VII — Change of direction in marching in retreat (¶751–752)

### Commands
None new — executed "by the commands and means indicated No. 717 and following" (¶751), i.e., the forward-marching change-of-direction commands/mechanics from earlier in Part Fifth (out of this range, presumably already covered in a prior Phase B2 read of Art. I–IV or will be by whoever reads ¶648–743).

### Sequence of actions
- ¶751: a battalion retiring in line changes direction using the same commands/means as the forward case (¶717+). New wrinkle specific to retreat: the **three file closers united behind the color-rank** (established during the retreat-facing choreography, cf. Article V/¶736) must conform to the color-rank's movement and wheel with it — specifically the **centre file closer** of the three takes 14" or 17" steps (matching quick/double-quick gait) and holds a steady distance from the color-bearer; the rest of the file-closer line conforms to that centre file closer's movement; the **lieutenant-colonel maintains the file-closer line on that basis**.
- ¶0-752: skirmisher companies conform to the movements of the first and last battalion companies (out of scope).

### Start/end state
Start: battalion marching in retreat, in line, straight. End: battalion marching in retreat, in line, on a new direction (wheeled), file-closer trio still square behind the color-rank.

### Distances/measurements
Step lengths 14 or 17 inches (quick/double-quick) for the centre file closer, matching standard Casey pace figures already in `constants.js` (PACE_PX etc. — confirm 14"/17" map to existing SCALE constants used elsewhere, e.g. S.S. ¶256 14-inch back step cited in project memory).

### Cross-references
No. 717 and following (Part Fifth, forward change-of-direction mechanics — out of range for this spec, needed as a dependency). No. 736 and following (Article V, file-closer trio setup, also out of range/dependency).

### Complexity notes
No new geometry primitive — this is the existing battalion wheel-in-retreat mechanic (dependent on ¶717's change-of-direction drill) with one added constraint: the 3-file-closer trio (already established as a fixed group during the retreat-facing transition) must wheel in lockstep with the color-rank as a satellite group, pivoting on the centre file closer's steady offset from the color-bearer. Likely a small addition to whatever wheel/change-of-direction function handles Article-IV-range content, not a new primitive.

---

## Article VIII — Passage of obstacles, advancing and retreating (¶753–787, incl. Remarks ¶785–787)

### Commands

Single company passing an obstacle (obstacle covers the 3rd company, example given):
> Third company, obstacle. (¶753, colonel)

Then captain of the obstructed company:
> 1. Third company, by the left flank, to the rear into column. 2. Double quick. 3. MARCH. (¶754)

Rejoining column behind the next company, captain again:
> 1. Third company. 2. By the right flank. 3. MARCH. 4. Guide right. (¶755)

Then, once at the prescribed distance:
> 1. Quick time. 2. MARCH. (¶756)

Returning the company to line once obstacle passed, colonel:
> Third company into line. (¶759)

Captain, on that command:
> 1. Company, by the right flank. 2. Double quick. 3. MARCH. (¶760)

Then, when left file abreast of the halted captain:
> 1. By the left flank. 2. MARCH. 3. Guide left. (¶761)

Multiple contiguous companies (three right companies, example given), colonel:
> 1. Three right companies, obstacle. 2. By the left flank, to the rear, into column. 3. Double quick—MARCH. (¶763)

Returning them to line, colonel:
> 1. Three right companies into line. (¶768)
Then, after each captain commands his own company "by the right flank":
> 1. Double quick. 2. MARCH. (¶769)

### Sequence of actions (single-company case, ¶753–762)
- ¶753: colonel identifies the obstructed company by name + "obstacle" and decides it will ploy into column **closed in mass, in rear of the next company toward the color** (i.e., toward the centre/color company side).
- ¶754: captain of obstructed company steps to its front to turn it, issues the flank-to-rear-into-column command, then hastens to the **left** of his company (in the example, a left-flank movement).
- ¶755: on MARCH, company faces left in marching; **the two left files disengage to the rear in double quick**; the **left guide** places himself at the head of the front rank and conducts the column behind the next company (4th, in the example), directing himself parallel to that company; the captain halts opposite the 4th company's captain and watches his own company file past; when its right file is nearly up with him, captain commands the right-flank-forward sequence and takes post before the centre of his company.
- ¶756: on that MARCH, company faces right preserving gait, then captain drops it to quick time once at the prescribed distance (i.e., matching the column's marching interval).
- ¶757: company now follows in column behind whichever company it finds itself behind, in close order, its **right guide** marching exactly in the trace of the company ahead's captain.
- ¶758: as soon as the 3rd company faces left (start of the maneuver), the **left guide of the 2nd company** (the company now exposed on the flank) places himself on the left of his own company's front rank and holds the gap needed for the 3rd company's eventual return to line.
- ¶759–762 (rejoining line): colonel orders "[company] into line"; captain adds right-flank-double-quick-MARCH, hastens to the right of his company and halts there in person; company (led by its guide) files past him parallel to the line; when the left file reaches him, captain commands left-flank-MARCH-guide left; company marches straight toward the line of battle and retakes its position there **"according to the principles prescribed for deploying into line of battle while marching"** (cross-reference to earlier Part Fifth/Fourth deployment-while-marching content, out of range).

### Sequence of actions (multi-company case, ¶763–771)
- ¶763–764: colonel names the block of contiguous companies (e.g., "three right companies") + obstacle + by-the-left-flank-to-rear-into-column command; each named captain places himself before his company's centre and cautions it.
- ¶0-765: first skirmisher company cautioned to face left flank (out of scope).
- ¶766: on MARCH, all named companies face left and take double quick; each captain disengages his company's head to the rear, left guide to head of front rank; the **3rd company's captain follows ¶755's procedure exactly**; captains of the other companies conduct their companies by the flank in rear of the 3rd, **inclining toward the head of the column**; as each company's head reaches opposite the right of the company already in column ahead of it, its captain halts, watches it file past, and faces it to the front in marching per ¶755.
- ¶0-767: first skirmisher company follows the first battalion company's movement, preserving distance/relative position (out of scope).
- ¶768–770: colonel commands the block "into line"; **each captain individually** commands his own company "by the right flank"; colonel then adds the double-quick-MARCH; every company conforms to ¶761's procedure; **the captains of the 2nd and 1st companies in the block halt in their own persons** when the 3rd and 2nd (respectively) face by the left flank — i.e., a staggered/cascading re-entry timed off the neighboring company ahead.
- ¶0-771: first skirmisher company faces right flank, double quick, follows first battalion company (out of scope).

### General rules (¶772–784)
- ¶772: examples given assume right-wing companies; left-wing companies execute by inverse means (mirror).
- ¶773: when **flank companies** (not interior ones) break off, the general guide on that flank places himself 6 paces in front of the outer file of the nearest company remaining in line.
- ¶774–776: gait-management rules — if battalion is in double quick and colonel wants several contiguous companies to break off, he first drops the whole battalion to quick time, executes the break per ¶763, then may resume double quick (¶775); single/non-contiguous company breaks do NOT require dropping the battalion's gait — instead the moving company itself increases its own gait to catch up (¶776).
- ¶777: if colonel wants to charge bayonet while advancing in line, he first sends color and general guides to their posts (procedural note, not new geometry).
- ¶778: in retreat, all of the above execute on the same principles as if marching by the front rank.
- ¶0-779: skirmisher-specific disposition when flank companies pass an obstacle (out of scope).
- ¶780: if a line-of-battle-advancing battalion must right-about into retreat while it has companies already in column behind the rear rank (e.g., mid-obstacle-pass), those companies also right-about and move out simultaneously with the battalion, preceding it in the retreat.
- ¶781: if marching in retreat at double quick and the colonel wants to bring forward-of-rear-rank companies back into line, he drops the whole battalion to quick time, has those companies take full distance by the head of the column, then brings them into line successively as ground permits, regardless of the battalion's current gait.
- ¶782–783: **color-company special case** — when the color company itself must pass an obstacle: color-rank returns into line the instant the company faces to break off; **senior major** takes post 6 paces before the extremity of the company the color-company is marching behind, to give step/direction (taking the step from the battalion himself first); once color-company is back in line, color-guard front rank moves out 6 paces again taking the step from the senior major, who then goes 20–30 paces in front of the color-bearer and faces the colonel (posted behind battalion centre) to be established on the perpendicular; color-bearer then takes two ground-points between himself and the senior major.
- ¶784: general rule — right-wing companies pass obstacles by the left flank, left-wing by the right flank (inverse); if the obstacle covers several **centre** companies at once, each files into column behind the still-in-line company of the *same wing* nearest to it.

### Remarks on skirmisher disposition (¶785–787)
Out of scope (no skirmisher companies modeled) — noted only: rally-on-the-battalion command/bugle call, skirmishers reform in close column by platoon behind the first/last battalion companies or available shelter, cover the battalion in retreat unless colonel wants to open line fire.

### Start/end state
Start: battalion (or wing) advancing or retreating in line of battle, with one or more companies (contiguous or not) obstructed. End: obstructed company/companies rejoin the line in their original position, battalion continues its original line march.

### Distances/measurements
6 paces (general guide's stand-off when flank companies break off, ¶773; senior major's stand-off from color-company's neighbor, ¶782); 20–30 paces (senior major's post in front of color-bearer once re-established, ¶783); two files disengage to the rear at the start of each break (¶755, ¶766) — matches the existing company-scale "break to the rear" 2-file mechanic already used in Lesson VI (`breakFiles`/`breakPlatoons`, per project memory).

### Cross-references
"Principles prescribed for deploying into line of battle while marching" (¶762) — earlier Part Fourth/Fifth content, out of range, needed as dependency. Article V's retreat-facing setup (¶736+) for the retreat-gait variant (¶778).

### Complexity notes
This is the single densest article in the range. Core mechanic (company breaks off via flank-to-rear-into-column, tucks in behind the neighboring company, later peels back into line) is structurally the same "peel into column / peel back into line" primitive the project already built for interior-division deployment in Phase B1 (`divisionLineFromAnchor` + `cascadeBlend`, per `TODO-battalion-plan.md`) — but applied to **individual companies breaking off from a still-marching, still-advancing line**, not a static column. New wrinkles vs. the existing primitive:
1. The obstructed company keeps marching (in double quick) throughout the break — it's not a discrete halted keyframe transition, it's continuous motion relative to the rest of the still-marching line.
2. The multi-company case (¶763–771) is a **cascading, staggered** break where each successive company times its own break off the company ahead of it reaching a specific relative position ("as the head of each company arrives opposite the right of the one next before it") — this is closer to a queued/dependent-timing animation than a single synchronized keyframe.
3. The color-company special case (¶782–783) layers extra senior-major choreography (re-establishing the color-bearer's perpendicular reference points) on top of the base break/rejoin mechanic.
Recommend implementing the single-company case first as the core reusable primitive, then the multi-company case as a cascade of staggered single-company instances (mirroring how Lesson VI's file-cascade formations were built), and treating the color-company variant as a documented special-case overlay rather than a fully separate drill.

---

## Article IX — To pass a defile, in retreat, by the right or left flank (¶788–804, incl. Remarks ¶802–804)

### Commands
Colonel, once the battalion (retiring in line) is halted and faced to the front, with a marker placed 15–20 paces in rear of the file closers at the defile-entry pivot point:
> To the rear, by the right flank, pass the defile. (¶789)

Each company's captain in turn (starting with the 1st company):
> 1. First company, right—FACE. 2. MARCH (or double quick—MARCH). (¶790)

### Sequence of actions
- ¶788: colonel halts and fronts the battalion on encountering a defile it must pass while retiring.
- ¶789: example assumes defile is in rear of the **left flank**, wide enough for a column by platoon; colonel places a marker 15–20 paces behind the file-closer rank at the pivot point, then gives the pass-defile command.
- ¶790–791: **1st company's captain** commands right-face + march; on march, the company's **first file** wheels right, marches to the rear until 4 paces beyond the file closers, wheels right again, then heads straight toward the left flank; every other file of the company wheels in succession **at that same spot** where the first file wheeled (i.e., a fixed pivot point, not each file wheeling in place).
- ¶792: **2nd company** executes the identical movement in its own turn, its captain timing his MARCH so the 2nd company's first file immediately follows the 1st company's last file (without needing to match its exact step); each subsequent company does likewise, one after another.
- ¶793: once the whole 2nd company is on the same line/direction as the 1st, the **1st company's captain** forms it **by platoon into line** (i.e., converts the flank-march file column into a platoon-front column); as soon as it's in column, the **guide of the 1st platoon** directs himself on the entry marker to change direction into the defile.
- ¶794: 2nd company continues marching by the flank parallel to the line of battle, and itself forms by platoon into line when the 3rd company reaches its own direction line.
- ¶795: subsequent companies repeat this pattern successively — each forms by platoon when the next company behind it comes onto the same direction.
- ¶796: leading company's 1st platoon, on reaching the entry marker, turns left; all following platoons execute this same turn at that same point; because the rearmost companies won't have had time to form platoons before reaching the defile, they direct themselves to leave room on the left for this maneuver.
- ¶797: battalion thus passes the defile by platoon; as each company's two platoons clear the defile, companies re-form using "the means indicated, S.C. No. 278, and following" (cross-reference to School of Company Lesson VI content — `breakPlatoons`/`formOnRightLeft`, per project memory, already implemented at company scale).
- ¶798: once the column head has cleared the defile and reached the colonel's desired reform distance, colonel either (a) turns the leading company left to prolong the column, then forms left into line, or (b) halts the column and forms into line facing the rear, direct or by inversion.
- ¶799: if colonel wants fire to open before the whole column clears the defile, he can turn the leading company right (then form right into line) or left (then form left into line by inversion).
- ¶800: if the defile is instead in rear of the **right** flank, everything executes by the left, on the same principles, inverse means.
- ¶801: if the defile is too narrow even for a platoon front, it's passed **by file** instead of by platoon; captains/file closers watch that files don't lose distance; companies/platoons form into line as defile width allows or as they successively clear it.

### Remarks on skirmisher disposition passing a defile (¶802–804)
Out of scope — noted only: skirmishers pass first (nearest company first) under junior major's direction, either by platoon or file per width, positioning to protect the battalion companies' passage.

### Start/end state
Start: battalion halted, faced front, having been retiring in line and now blocked by a defile. End: battalion has filed through the defile by platoon (or by file, if too narrow), reforming into line either continuing the advance-direction turn or facing the rear, at the colonel's discretion.

### Distances/measurements
15–20 paces (marker placement behind file closers, ¶789); 4 paces (distance beyond file closers before the first wheel, ¶791).

### Cross-references
S.C. No. 278 and following (Lesson VI company re-forming after platoon break — already implemented per project memory as `breakPlatoons`/`formOnRightLeft`). "Principles prescribed for the advance in line of battle" markers (No. 650, referenced in Article V, out of range).

### Complexity notes
Structurally similar to Article VIII (a peel/reform sequence) but organized **serially down the whole battalion** rather than per-obstacle: every company, one after another, executes the same right(or left)-face → flank march → form-by-platoon → wheel-at-marker sequence, each timed off the company ahead of it. This is close to the multi-company cascading break-off in Article VIII but simpler in one respect (uniform direction/uniform trigger — "when the next company reaches the same direction line" — no color-company special case) and more complex in another (the platoon-forming step, ¶793, requires the existing company-scale "form by platoon" mechanic, likely `formByCompany`/platoon-ploy logic from Lesson VI, chained onto the flank-march-then-form-by-file mechanics from Lesson IV). Recommend building as a single reusable "company defile-pass" primitive (flank face → march → wheel-at-fixed-point → form-by-platoon-in-column → wheel-into-defile) invoked in a cascade, company by company, similar to Article VIII's recommended cascade approach.

---

## Article X — To march by the flank (¶805–819)

### Commands
> 1. Battalion. 2. Right (or left)—FACE. 3. Forward. 4. MARCH (or double quick—MARCH). (¶805)

To wheel the marching column by file:
> 1. By file right (or left). 2. MARCH. (¶815)

To halt:
> 1. Battalion. 2. HALT. 3. FRONT. (¶817)

### Sequence of actions
- ¶805: colonel gives the full four-part command to the whole battalion (in line of battle) at once.
- ¶806: at the FACE command, **every company's own captain and covering sergeant** place themselves exactly as prescribed in **S.C. Nos. 138 and 143** — i.e., each company independently executes the company-scale march-by-flank head-of-column choreography (covering sergeant to the head of the front rank/column, captain beside him) from `lesson-iv/marchByFlank.js`'s source paragraphs. This is stated once, generically, for "the captains and covering sergeants" (plural, all companies), not just the lead company.
- ¶0-807: skirmisher chiefs place themselves similarly (out of scope).
- ¶808: the **sergeant on the left of the battalion** (the battalion's leftmost company's own left-flank NCO, acting in a battalion-level marking role — matches the project's existing "directing sergeant" convention per the engine-spike notes in `TODO-battalion-plan.md`) places himself at the very tail of the whole column, beside the last file, covering the captains in file — i.e., marking the far (trailing) end of the entire battalion-length column.
- ¶809: for a **left**-flank face specifically: each captain (except the leftmost company's) shifts to the left of his own company and places himself **beside the covering sergeant of the company preceding his own** — i.e., each captain marks the seam between his company and the one ahead of it in the now-continuous column; the leftmost company's captain instead pairs with the "sergeant on the left of the battalion" from ¶808; the **rightmost company's** covering sergeant places himself at the head of the whole column (front-rank man of the rearmost file of his company — the column's leading edge), covering the captains in file. Read together, ¶806–809 describe **one continuous battalion-length column** made of the 8 companies' doubled-file blocks concatenated in line-of-battle order, with each company's captain+sergeant pair marking that company's leading edge/seam within the unbroken column — not 8 separate parallel columns.
- ¶810: at MARCH, the whole column steps off; the leading sergeant (whichever flank is in front) is responsible for exact step length/cadence and straight-ahead direction, using ground points.
- ¶811: skirmisher companies step off abreast the first/last battalion companies' captains, marching parallel (out of scope detail, but confirms skirmisher companies flank the battalion column rather than joining it).
- ¶812: regardless of flank direction, **lieutenant-colonel** takes post abreast the leading file, and **senior major** abreast the color-file, both on the front-rank side, ~6 paces off; **junior major** holds his post "as prescribed No. 94" (out-of-range cross-reference).
- ¶813: **adjutant** marches between lt-col and the front rank, matching the head of the battalion's step; **sergeant major** marches between senior major and the color-bearer, matching the adjutant's step.
- ¶814: captains and file closers continuously watch that files neither open nor close excessively and regain lost distances.
- ¶815–816: to wheel the column, "by file right (or left), MARCH" — files wheel in succession, all at the spot where the first file wheeled, "conforming to the principles prescribed in the school of the company" (direct reuse of the existing company-scale by-file-wheel mechanic).
- ¶817–818: halting executed exactly as School of Company No. 148 (cross-reference, already implemented per project memory as part of Lesson IV's march-by-flank halt).
- ¶819: transitioning from flank march back into line (front or rear) uses School of Company commands/means directly (cross-reference, out of range — presumably `formByFile`/similar already covers the by-file case at company scale; the "form in line to the front or rear while marching by the flank" general case is a Lesson IV/company-level mechanic reused wholesale).

### Start/end state
Start: battalion in line of battle, halted or about to move. End: battalion marching as one continuous doubled-file column perpendicular to its original front, OR halted and re-fronted, OR wheeled onto a new line of march.

### Distances/measurements
~6 paces (lt-col's and senior major's stand-off from the front rank, ¶812). File-doubling geometry itself (4-abreast blocks, captain+sergeant head pairs) inherits the existing company-scale constants (FILE_INTERVAL, RANK_GAP) unmodified per company — no new distance figures introduced at battalion scale.

### Cross-references
S.C. Nos. 138, 143 (company march-by-flank head-of-column choreography — implemented, `lesson-iv/marchByFlank.js`). S.C. No. 148 (halt from flank march — implemented). S.C. No. 94 (junior major's post — out of range, Part Fifth Art. I–IV territory). "School of the company" generic reference for by-file wheeling and forming into line while flank-marching (¶816, ¶819).

### Complexity notes — THE FILE-DOUBLING-SCALING QUESTION

**Direct textual answer: each company independently doubles its own files, reusing the existing company-scale mechanic (S.C. ¶138/¶363, i.e. the project's existing `doubleFiles()`) completely unmodified per company.** ¶806 states this explicitly and generically ("the captains and covering sergeants" — plural, one instance of the S.C. ¶138/143 choreography per company). There is **no battalion-wide file renumbering scheme** — Casey never re-numbers files 1–160 across the battalion; each company's files stay numbered 1–20 within that company, exactly as at company scale.

The genuinely new battalion-scale wrinkle (not present in the company-scale drill) is **concatenation**: the battalion's flank march is **one continuous column**, not 8 side-by-side columns. This is evident from ¶809: captains mark the seam with "the covering sergeant of the company **preceding** his own" — i.e., the 8 independently-doubled 4-abreast company blocks are chained head-to-tail in line-of-battle order (rightmost or leftmost company leads, depending on face direction) into a single long column, the same way `battalionLine()` already concatenates 8 companies' `lineOfBattle()` outputs at stride offsets (per the engine-spike notes in `TODO-battalion-plan.md`) — except here the offset axis is **depth** (marching direction) rather than **width**, and the per-company unit being stacked is a **doubled-file column** (`doubleFiles()`/`columnOfFiles()` output) rather than a line-of-battle block.

**Recommended new primitive**: a battalion-scale `columnOfFiles`-analog — call each company's existing `doubleFiles()` once per company, then stack the 8 results at sequential depth-offsets (each offset = the depth/length of the preceding company's doubled-file block, i.e. captain+sergeant head pair + remaining doubled-file ranks + file-closer gap), producing one seamless 8-company-long column. Field-officer posts (lt-col, majors, adjutant, sgt-major — ¶812–813) are then placed relative to the *whole* column's leading file and color-file, not per company. This is a straightforward analog of the existing `battalionLine()` pattern, just on the depth axis with per-company doubled-file geometry instead of per-company line-of-battle geometry — should NOT require inventing new file-numbering logic, only a new stacking/offset function.

---

## Article XI — To form the battalion on the right or left, by file, into line of battle (¶820–829, incl. Remarks ¶828–829)

### Commands
> 1. On the right, by file, into line. 2. MARCH (or double quick—MARCH). (¶821)

### Sequence of actions
- ¶820: battalion marching by the right flank (per Article X); colonel determines the line of battle and the **lieutenant-colonel** places two markers on it, "in conformity with what is prescribed No. 501" (out-of-range cross-reference, likely Article I of Part Fifth's line-determination procedure, analogous to the already-implemented company-scale marker-placement).
- ¶821: once the head of the battalion is nearly up with the first marker, colonel gives the form-on-the-right-by-file command.
- ¶822: at MARCH, the **leading company** forms itself on the right by file into line of battle exactly as indicated in **S.C. No. 151** (direct reuse of the existing company-scale mechanic — `lesson-iv/formByFile.js`'s source paragraph, the file-group cascade where the front-rank man of the first file rests his breast against the marker and successive file-groups peel off and slot in to the left); **all the other companies follow the leading company's movement**; each captain places himself on the line at the same moment as his own company's first file's front-rank man, on that man's right.
- ¶823: the **left guide of each company except the leading one** places himself on the marker-direction line, opposite his own company's left file, the instant that file's front-rank man reaches the line — i.e., each company's own left guide marks that company's own forming-boundary, analogous to how each company already uses its own left guide in the company-scale drill, just repeated per company as the battalion-length line builds up company by company.
- ¶824: once formation is complete, colonel commands "Guides—POSTS" (guides return to normal post).
- ¶825: colonel personally oversees the successive formation, moving along the forming line's front as it builds.
- ¶826: lieutenant-colonel, in succession, assures the guides' direction and watches that front-rank men don't overstep the line as they place themselves.
- ¶827: if the battalion instead marched by the **left** flank, everything executes by the same principles, inverse means (mirrored).

### Remarks (¶828–829)
- ¶828: marching by the flank in the presence of the enemy is "a very objectionable movement" — only used for short lateral repositioning or when terrain is too narrow for a company front. (Doctrinal/tactical color, not a geometry note — worth carrying into `reenactorNotes` but not a drill mechanic.)
- ¶0-829: skirmisher-specific pre-positioning before a flank march or form-by-file (out of scope).

### Start/end state
Start: battalion marching by the flank (Article X's continuous doubled-file column). End: battalion in line of battle, formed right-to-left (or left-to-right, if by the left flank) as each company's file-cascade completes in sequence down the column, one company at a time, joining seamlessly onto the previously-formed portion of the line.

### Distances/measurements
None new — inherits company-scale `formByFile()` figures (file-group cascade geometry, breast-against-marker positioning) unmodified per company; no new battalion-scale distance figures given in this article.

### Cross-references
S.C. No. 151 (company-scale form-by-file — implemented, `lesson-iv/formByFile.js`). No. 501 (line-of-battle marker placement — out of range, Part Fifth Art. I territory). ¶478 or similar deploying-while-marching principles implicitly reused (not explicitly cross-referenced here, but structurally identical to how Article VIII's rejoin-into-line, ¶762, cites the same family of "deploy into line while marching" principles).

### Complexity notes — SAME FILE-DOUBLING-SCALING ANSWER APPLIES

**¶822 confirms the same pattern as Article X: each company forms by file into line using the exact existing company-scale `formByFile()` mechanic (S.C. ¶151) unmodified.** There is no battalion-wide file-cascade renumbering — every company runs its own independent file-group cascade (captain+sergeant/first-file pair onto the marker line, then successive file-pairs peeling off the column and sliding in to the left, exactly as `lesson-iv/formByFile.js` already implements).

The new battalion-scale wrinkle is again **concatenation**, but this time along the width axis and **serialized in time**: "the other companies will follow the movement of the leading company" (¶822) — i.e., companies form **successively**, not simultaneously. The leading company runs its full file-cascade onto the markers first; the next company back in the column then runs its own file-cascade, sliding its resulting line-segment in immediately to the left of (adjoining) the already-formed leading company's segment; and so on down the column. This is structurally the mirror image of Article X's answer: where Article X concatenates 8 independently-doubled company columns along the **depth** axis, Article XI concatenates 8 independently-formed company line-segments along the **width** axis, **one company's cascade completing before the next begins** (a serial/cascading trigger, not a simultaneous one — note ¶823's "at the instant that the front-rank man of this file arrives on the line" language, timed per company).

**Recommended new primitive**: a battalion-scale `formByFile`-analog that (a) reuses the existing per-company `formByFile()`/`buildFormByFilePositions()` cascade logic unmodified per company, (b) computes each company's line-segment origin as the previously-formed segment's trailing edge (mirroring `battalionLine()`'s width-axis stride-offset stacking), and (c) sequences the 8 companies' cascades one after another in time (company N's cascade keyframes don't begin until company N−1's is complete), rather than running all 8 cascades in parallel. This is the most novel timing requirement in the whole Art. VI–XI range — every other article's per-company choreography is either fully simultaneous (Art. X) or triggered off a fixed spatial marker (Art. IX's defile turn point) — Art. XI is the only one where each company's animation start time is gated by the *previous company's completion*, not a fixed clock or spatial trigger.

---

## Summary: engine capability gaps found in this range

1. **New primitive — battalion-scale doubled-file column concatenation** (Article X): stack 8 independently-`doubleFiles()`-processed companies along the depth axis into one continuous flank-march column, analogous to `battalionLine()`'s existing width-axis stacking but on the marching axis with doubled-file geometry.
2. **New primitive — serialized battalion-scale form-by-file** (Article XI): stack 8 independently-`formByFile()`-processed companies along the width axis, but with each company's cascade *sequenced in time* after the previous company's completes, not run in parallel. This is the only genuinely novel *timing* pattern (vs. the existing simultaneous or fixed-marker-triggered patterns already used elsewhere).
3. **Cascading/staggered company break-off from a moving line** (Article VIII, multi-company case, ¶763–771): each company's break-off timing is gated by the company ahead of it reaching a relative position, while the whole formation continues advancing/retreating — a moving-reference-frame cascade, structurally related to but more dynamic than the existing `divisionLineFromAnchor`/`cascadeBlend` primitives built in Phase B1.
4. **Serial company-by-company defile passage** (Article IX): each company runs face → flank-march → fixed-pivot-wheel → form-by-platoon → wheel-into-defile, one after another, each triggered by the company ahead reaching the same directional line — recommend a single reusable "company defile-pass" primitive invoked in a per-company cascade.
5. No new geometry needed for Articles VI–VII — both are thin variations (facing toggle; wheel-with-satellite-file-closer-trio) on already-established Article V/¶717 mechanics (dependencies, not gaps, but confirm those paragraphs are covered by whoever specs ¶648–743).

All four gaps build on **existing per-company primitives** (`doubleFiles`, `columnOfFiles`, `formByFile`) rather than requiring new individual-soldier geometry — the battalion-scale work throughout this range is entirely about **stacking/sequencing already-correct company-scale outputs**, confirming the file-doubling mechanic itself never changes shape between company and battalion scale.
