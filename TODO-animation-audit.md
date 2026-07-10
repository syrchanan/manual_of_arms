# Animation Audit — Findings & Next Steps

Audit performed 2026-03-13 against Casey's Infantry Tactics Vol. I (1862, D. Van Nostrand edition), PDF at usvolunteers.org. All PDF paragraph references use the continuous S.C. numbering from the PDF (¶1 = start of School of the Company, Title III).

**STATUS (2026-07-10): School of the Company (Lessons III–VI, all 20 drills) is fully implemented and re-audited on branch `fix/animation-audit-2026-07`.** Every item below marked open as of the 2026-07-06 re-audit has been resolved; see that section for the fix list. Paragraph numbering is now uniformly the continuous PDF scheme throughout drills and `navigation.js`. Casey's full text (¶84–393) is transcribed into the app. Remaining scope: School of the Battalion (Vol. II source not yet in repo) and S.C. ¶367–393 appendix formations (single-rank/four-rank conversions) are out of current site scope.

---

## Paragraph Numbering Note

The spec (`caseys-drill-spec.md`) uses paragraph numbers that are offset from the PDF by approximately +50. For example, the spec's ¶34 (March in Line) corresponds to PDF ¶84. The `caseyParagraphs` arrays in drill files use the spec's numbering, which does NOT match the PDF. This needs a mapping decision — either update all paragraph refs to match the PDF, or document the offset clearly.

---

## CRITICAL Fixes

### 1. ~~`doubleFiles()` in `formations.js` — Wrong mechanism~~ ✅ FIXED 2026-03-14

Rewrote `doubleFiles()`, `undoubleFiles()`, and `columnOfFiles()` to produce 4-abreast columns per Casey S.S. ¶363 + S.C. ¶138. Captain and covering sergeant form a special 2-abreast head pair (cpt on left/guide side, cov sgt on right). Behind them, files pair as (2,3), (4,5), ..., (18,19) with file 20 alone — each 4 abreast. Column is 11 depth positions total. Across-column order within each group: [front-first, front-second, rear-first, rear-second]. File closers at FILE_CLOSER_GAP to the right, at depths matching their line-of-battle file positions. Updated marchByFlank.js descriptions and reenactor notes accordingly. Updated `buildCascadePositions()` in changeDirectionByFile.js and `buildFormByFilePositions()` in formByFile.js to use matching group/across indices.

### 2. ~~`marchInRetreat.js` — Wrong commands~~ ✅ FIXED 2026-03-14

Commands corrected to: `1. Company. 2. About—FACE. 3. Company, forward. 4. MARCH.` Removed erroneous "Guide left" command (implicit per Casey). Updated keyframe label/description.

### 3. ~~`aboutFace()` in `formations.js` — Contradictory file closer logic~~ ✅ FIXED 2026-03-14

Simplified `aboutFace()` to rotate facing 180° in place with NO position changes. A true about-face is a turn on the spot — file closers end up physically ahead, which is correct. The inline version in marchInRetreat.js was also simplified to match. Drill-specific repositioning (covering sergeant into file-closer line, captain to new front, etc.) deferred to individual drill keyframes as needed.

**Still TODO (for about-face):** Casey ¶122-123 specifies additional repositioning (covering sgt → file closer line, captain → new front rank, directing sgt 6 paces ahead). Not yet implemented in any drill.

---

## HIGH Priority Fixes

### 4. `obliqueMarch.js` — Rear-rank men not shifting (formations.js:302)

**Casey ¶102:** "The rear-rank men will preserve their distances, and march in rear of the man next on the right (or left) of their habitual file leaders."

During oblique march, rear-rank men shift behind the NEXT file leader toward the oblique side (not their own file leader). The current `oblique()` function translates all soldiers uniformly. Need to add rear-rank offset logic.

### 5. ~~`changeDirectionByFile.js` — Simultaneous wheel instead of successive~~ ✅ FIXED 2026-03-14

Rewrote with `buildCascadePositions()` helper that creates intermediate keyframes showing files wheeling progressively (1 group wheeled → 4 groups → all 11). Each group wheels at the same pivot point while remaining groups continue approaching from the east. Step count corrected to "5 or 6 paces". Updated grouping logic to match captain/cov sgt head pair + (2,3),(4,5)... pairing scheme.

### 6. ~~`marchByFlank.js` — Wrong descriptions and reenactor notes~~ ✅ FIXED 2026-03-14

Descriptions updated to reflect 4-abreast column with captain/covering sergeant head pair per ¶138. Reenactor notes rewritten to explain within-rank doubling per S.S. ¶363.

### 7. `caseyParagraphs` arrays wrong for Lesson IV drills

- `marchByFlank.js:12` — `[76..87]` is wrong. Per PDF, march by flank = ¶137-143.
- `changeDirectionByFile.js:12` — `[88..92]` is wrong. Per PDF, change direction = ¶144-146.
- Decision needed: use PDF paragraph numbers or spec paragraph numbers? Should be consistent.

---

## MEDIUM Priority Fixes

### 8. `marchInLine.js` — Missing directing sergeant

Casey ¶86-87: A sergeant is designated to march 6 paces in advance of the captain, on the prolongation of the directing file. This sergeant is the visual guide for the march. Not currently shown in the animation.

### 9. `marchInLine.js` — "Guide right" as separate command

Casey ¶85 gives only `"1. Company, forward."` then `"2. MARCH."` The "guide right" is not a separately stated command in this context (it's set by the position of the captain). The code lists it as command #2.

### 10. `haltAndAlign.js` — caseyParagraphs range

`caseyParagraphs: [39, 40, ..., 49]` — per PDF offset, this maps to ¶89-99. But halt/align is PDF ¶99-100 (just 2 paragraphs). The range includes paragraphs from the march article.

### 11. `constants.js` — RANK_GAP value

`RANK_GAP: 7` with comment "13 inches." Casey ¶135 specifies 16 inches between ranks at shoulder arms. At 14px per 28-inch pace: 16" = 8px, 13" = 6.5px. Current 7px (= 14") doesn't match either standard. Verify against School of the Soldier for the correct close-order interval.

---

## LOW Priority Fixes

### 12. `markTime.js` — Minor command wording
- Back step command should be `"Company backward"` not `"Backward"` (¶115).
- caseyRef values off by ~2 paragraphs.

### 13. `obliqueMarch.js` — Guide shift not indicated
Casey ¶105: guide shifts to the oblique side during oblique march, returns when direct march resumes. Not currently annotated.

### 14. ~~`marchInRetreat.js` — About-face y-shift~~ ✅ FIXED 2026-03-14
Fixed in the earlier aboutFace rewrite — now rotates in place without shifting positions.

---

## Re-Audit: Lesson IV (2026-03-14)

### 15. ~~Initial frames using wrong column generation~~ ✅ FIXED 2026-03-14

**Problem:** `changeDirectionByFile`, `haltFaceFront`, `formByFile`, and `formByCompany` (sub A) all used `doubleFiles(lineOfBattle(facing=90), company)` to generate the starting column. This produced a geometrically incorrect layout — column depth ran along the Y-axis instead of along the march direction. Only `marchByFlank` correctly showed the right-face → double transition (from a facing-0 line, which places files along -x).

**Fix:** Replaced with `columnOfFiles()` which uses `rotateAlongAcross()` to correctly orient column depth along the march direction and 4-abreast spread perpendicular to it.

### 16. ~~File closer positioning in doubled column~~ ✅ FIXED 2026-03-14

**Problem:** File closers had inconsistent spacing across the three places that generate column-of-files positions:
- `columnOfFiles()`: used `-FILE_INTERVAL` (10px) and `5*FILE_INTERVAL` (50px) — arbitrary
- `doubleFiles()`: didn't reposition file closers at all (left at line-of-battle positions)
- Cascade/formation helpers in drill files: left file closers at initial positions without updating

**Fix:** All three locations now use `FILE_CLOSER_GAP` (28px = 2 paces) consistently:
- `columnOfFiles()`: file closers at `3*FILE_INTERVAL + FILE_CLOSER_GAP` (right side), at depths matching their file's `_fileDepthIndex()`
- `doubleFiles()`: repositions file closers alongside the column using captain as reference, same spacing
- `buildCascadePositions()` and `buildFormByFilePositions()`: when formation is complete, file closers move to their correct final positions using `fileDepthIndex()` for depth staggering

### 17. ~~Cascade helpers using wrong grouping scheme~~ ✅ FIXED 2026-03-14

**Problem:** `buildCascadePositions()` in changeDirectionByFile.js and `buildFormByFilePositions()` in formByFile.js used `Math.floor((file-1)/2)` for groupIndex and old `isEven` logic for acrossIndex. This mapped file 2 to group 0 (should be group 1) and gave the covering sergeant acrossIndex=2 (should be 1).

**Fix:** Both helpers now use `fileDepthIndex()` for groupIndex and special-case captain (across=0) and covering sergeant (across=1) as the head pair. Remaining files use `(file-2)%2` for second-in-pair detection. `NUM_GROUPS` updated from 10 to 11. `formByFile` lineFileIndex simplified to `file - 1`.

---

## Stub Drills to Implement (Priority Order)

All are currently showing "Coming soon" placeholders.

### Lesson IV (complete the lesson) ✅ ALL IMPLEMENTED 2026-03-14
1. ~~**haltFaceFront.js**~~ ✅ — Halt, face front, undouble using `undoubleFiles()`.
2. ~~**formByFile.js**~~ ✅ — Cascading formation with `buildFormByFilePositions()` helper showing progressive line-building (1→4→7→all groups).
3. ~~**formByCompany.js**~~ ✅ — Both sub-movements implemented. Sub A (by-company) is correct. Sub B (by-platoon) starting formation has a known visual issue — `_buildColumnByPlatoon` geometry needs review. **OUTSTANDING: platoon-column starting positions appear wrong in browser; defer to next session.**

### Lesson V (column of platoons — critical drills) ✅ ALL IMPLEMENTED 2026-03-14
4. ~~**breakIntoColumn.js**~~ ✅ — Both platoons wheel simultaneously with mid-wheel (45°) and full-wheel (90°) keyframes. Uses `wheel()` on per-platoon ID sets.
5. ~~**marchInColumn.js**~~ ✅ — Reference animation showing sustained platoon column march with distance annotations.
6. ~~**changeDirection.js**~~ ✅ — Both variants: left turn (guide side, sequential platoon turns) and right wheel (opposite side, platoon wheels with pivot). Supports `subMovement` parameter.
7. ~~**haltColumn.js**~~ ✅ — Simple halt of column.
8. ~~**formIntoLine.js**~~ ✅ — Left into line wheel. Both platoons wheel left simultaneously, reverse of breakIntoColumn. Includes dress and front.

### Lesson VI (advanced movements)
9. **breakPlatoons.js** (¶248-258) — Break into platoons on the march + re-form.
10. **breakFiles.js** (¶259-271) — Break files to rear and re-enter.
11. **routeStep.js** (¶272-294) — Column relaxes, random jitter. Already have `addRandomJitter()`.
12. **countermarch.js** (¶295-303) — Trickiest conceptually. Needs ghost trail annotation.
13. **formOnRightLeft.js** (¶304-318) — Form on right/left into line from column.

---

## Recommended Fix Order

1. ~~**Fix `doubleFiles()`/`undoubleFiles()`**~~ ✅ Done 2026-03-14
2. ~~**Fix `aboutFace()` utility**~~ ✅ Done 2026-03-14
3. ~~**Fix `marchInRetreat.js` commands**~~ ✅ Done 2026-03-14
4. ~~**Fix `marchByFlank.js` descriptions/notes**~~ ✅ Done 2026-03-14
5. ~~**Fix `changeDirectionByFile.js`**~~ ✅ Done 2026-03-14
6. ~~**Implement Lesson IV stubs**~~ ✅ Done 2026-03-14
7. ~~**Implement Lesson V**~~ ✅ Done 2026-03-14
8. **Implement Lesson VI** (breakPlatoons through formOnRightLeft).
9. **Fix oblique march rear-rank shifting** — Medium priority, can be done alongside other work.
10. **Reconcile paragraph numbering** — Decide on one scheme, update all files.

---

## Re-Audit 2026-07-06 (multi-agent, full numeric traces)

Four parallel audits (Lessons III/IV/V + engine) against `casey_lessons_3to6.txt`. Lesson IV/V geometry was verified by executing `buildKeyframes()` in Node and tracing real coordinates. Findings tracked as session tasks; summary below.

### CRITICAL
- **C1. SoldierRenderer rotation breaks across 0°/360°** (`SoldierRenderer.js:82-89`): default string interpolation animates 350°→10° as −340° (near-full wrong-way spin). No attrTween anywhere. Latent until a wheel/countermarch crosses north — then guaranteed. Fix: shortest-path angle tween, rotate split from translate.
- **C2. markTime special effects are dead data** (`markTime.js:31,69`): `specialEffect`/`speedMultiplier` read by nothing — mark time renders motionless (indistinguishable from halt), double quick shows no speed change.
- **C3. formByCompany end-state contradicts ¶160-161/¶165-168** (both sub-movements): captain should finish 2 paces before the CENTRE facing front (east) — code snaps him back to file-1 slot via plain `lineOfBattle()`; 2nd sgt/per-platoon guides never move to their commanded front-rank/flank posts though descriptions claim they do. By-platoon starting state (`_buildColumnByPlatoon`) invents a pre-split two-column formation unsupported by ¶164 (confirms the old outstanding note).
- **C4. changeDirection buildRightWheel P2 pivot wrong** (`changeDirection.js:148-150`): platoon 2 wheels at its own trailing position, not "precisely at the point where the leading subdivision changed" (¶230). `buildLeftTurn` in the same file does it correctly.
- **C5. haltColumn teaches the opposite of ¶237-239**: notes/description say guides realign immediately after halt; Casey says guides stand fast even having lost distance (¶239 explicitly warns against recovering it).

### HIGH
- **H1. Paragraph refs wrong in 12 of 15 implemented drills.** Only breakIntoColumn (¶176-199), formByFile (¶150-154), formByCompany (¶155-172) use correct continuous PDF numbering. L3 files all use spec numbering (−50); L5's other four files point at unrelated Lesson IV articles. Corrected L5 ranges (fixes errors in the mapping table below): Art I ¶176-199, Art II ¶200-215, Art III ¶216-235, Art IV ¶236-239, Art V ¶240-269 → Lesson VI starts ~¶270, so the L6 ranges in this doc's table are also wrong.
- **H2. Command-text errors**: marchInLine has a fabricated "2. Guide right." (¶85/88: only Forward/MARCH); haltAndAlign shows invented "Right—DRESS."/"FRONT." instead of ¶99-100's "Captain, rectify the alignment" mechanism; haltColumn "Company. HALT." should be "Column. HALT." (¶236); formIntoLine halt should be per-platoon "Platoon. HALT." by each chief (¶245); changeDirection "Head of column to the left" appears nowhere in the source (¶229 turn / ¶217-218 wheel wording); marchInColumn `commands: []` missing "Column, forward. Guide left. MARCH." (¶202); markTime commands static across the 3 tabs (¶110/111/115 texts absent).
- **H3. doubleFiles vs columnOfFiles depth mismatch** (`formations.js`): doubleFiles compresses the column 10px/rank vs columnOfFiles' DEPTH_SPACING; marchByFlank's column differs from the other L4 drills; file closers drift 10px from their files within doubleFiles itself.
- **H4. useAnimationEngine stale closure**: speed/opts captured at engine creation; mid-playback speed changes desync transitions from the timer; toggles can revert on next auto-advance.
- **H5. Missing personnel choreography**: directing sergeant (¶86-89) absent from marchInLine; ¶122-123 captain/cov-sgt/directing-sgt repositioning absent from marchInRetreat; chiefs/guides not posted in marchInColumn/haltColumn/formIntoLine column states (discontinuous with breakIntoColumn's correct end state).

### MEDIUM
- **M1. Pace-scale inconsistency**: drills use `N*PACE_PX*2` for "N paces" while `oblique()` uses `paces*PACE_PX` — mixed within obliqueMarch; AnnotationRenderer grid/scale-bar labels 10 paces as "5 paces". One convention needed.
- **M2. oblique() rear-rank shift (¶102) still unimplemented** (old item #4 confirmed open); guide-shift annotation (¶105, old #13) too.
- **M3. fc-1lt post**: `{file:14, section:4}` but `sectionOf(14)=3`; spec wants centre of 4th section (~file 18).
- **M4. platoonDistance/platoonDivider annotations are silent no-ops** — used by four L5 drills, no case in AnnotationRenderer.
- **M5. RANK_GAP** (old #11) still open: 7px = 14", comment says 13", ¶135 says 16".

### AMBIGUOUS — RESOLVED 2026-07-06 via full Vol. I extraction (`casey_v1_full_extract.txt`)
- ~~formByFile odd/even order~~: S.S. ¶363 — even-numbered men step to the RIGHT side of odd-numbered men, who stand fast (left-flank mirror in ¶365). With count-off starting at file 2 (captain/cov-sgt head pair is S.C. ¶138's special case), the existing (2,3),(4,5)… first-in-pair-stands-fast implementation and formByFile's ascending placement are CORRECT as written. No code change.
- S.S. ¶340 (oblique step), ¶256 (14-inch back step — note: FOURTEEN inches, not 15; markTime.js comment should say 14"), ¶415 (turns) now available for citation.

### Verified correct (coverage)
lineOfBattle geometry & conventions; wheel() rotation math (radius-invariant, CW=right); aboutFace(); undoubleFiles() full trace; marchByFlank doubling per ¶138 incl. captain/cov-sgt head pair; changeDirectionByFile cascade (same-point wheeling, ¶145); formByFile south-facing line (forced by two right turns, ¶151); breakIntoColumn (pivot swap ¶177, gradual pivot facing ¶190, guide moves ¶191, P2 pivot fr-11 ¶199) — the PR #6 rework is solid; formIntoLine wheel geometry (exact 10px file-interval seam between platoons); AnimationEngine timer hygiene; prior fixes #1-#3/#5-#6/#14-#17 all genuinely landed.

---

## Reference: PDF Paragraph Mapping

| Movement | Spec ¶¶ | PDF ¶¶ | PDF Pages |
|----------|---------|--------|-----------|
| March in line | 34–38 | 84–98 | 75-77 |
| Halt and align | 39–49 | 99–100 | 77 |
| Oblique march | 50–56 | 101–108 | 77-78 |
| Mark time / dbl quick / back | 57–67 | 109–118 | 78-79 |
| March in retreat | 68–75 | 119–136 | 79-81 |
| March by flank | 76–87 | 137–143 | 82-83 |
| Change direction by file | 88–92 | 144–146 | 82-83 |
| Halt and face front | 93–96 | 147–149 | 83 |
| Form by file into line | 97–107 | 150–154 | 83-85 |
| Form by company into line | 108–122 | 155–172 | 85-87 |
| Break into column | 123–141 | 173–191 | 88-90 |
| March in column | 142–157 | 192–207 | 90-92 |
| Change direction | 158–172 | 208–222 | 92-94 |
| Halt column | 173–176 | 223–226 | 94 |
| Form into line | 177–197 | 227–247 | 94-97 |
| Break into platoons | 198–208 | 248–258 | 97-98 |
| Break files to rear | 209–221 | 259–271 | 98-100 |
| Route step | 222–244 | 272–294 | 100-102 |
| Countermarch | 245–253 | 295–303 | 102-103 |
| Form on right/left | 254–268 | 304–318 | 103-105 |
