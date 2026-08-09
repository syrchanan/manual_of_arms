# Source-Fidelity Audit — Remediation Plan

Consolidated, severity-ordered plan to address every finding from the source-fidelity
audit (`review-tmp/*.md`, 45 drills reviewed). Written 2026-08-07 on branch
`feat/school-of-the-battalion`.

**Audit tallies:** 12 HIGH · 34 MEDIUM · ~26 LOW across 45 drills. (The audit's own
per-batch tables double-count one HIGH in batch B6 — the substantive inline findings, on
which this plan is built, total **11 HIGH**; see B6 note below.)

**Nature of the findings:** The overwhelming majority are *text/citation* defects —
captions or `caseyRef` tags that disagree with the (correct) rendered geometry, or
skirmisher paragraph numbers swept into metadata arrays. Only **5 findings are genuine
geometry/logic bugs a viewer would see as a wrong maneuver.** Those 5 are the real
priority; everything else is prose/metadata hygiene.

Legend for effort: **S** = one-line/one-string fix · **M** = localized logic change ·
**L** = new geometry/keyframe work.

---

## STATUS — 2026-08-09

**All 11 HIGH and all 34 MEDIUM findings are resolved and committed** on
`feat/school-of-the-battalion` (not pushed). Every geometry change was verified
in-browser with Playwright. The contested `halt-and-align` item is deliberately
left as-is (see below).

Commit map: #1-4/#7/#10 `a647ba8`+`94d3f15`; #6/M1 `6f44880`; M2 `58765bc`;
#5 `6a15dd2`; #11 `0aea257`; #8 `f8a51d3`; #9 `075c6e5`; battalion MEDIUM
`67cecab`+`de9a608`; company MEDIUM `5f54b20`+`9b8b805`+`e56a1f4`; halt-the-column
`dd3db83`; form-square command sets `a7d94fe`; close-column rear-front `041ec84`.

**Phase 3 LOW is now also resolved** (commits `0870221`, `75bfdb5`, `8c344b1`):
- **3A** skirmisher `0-N` pollution — cleaned from every drill's `caseyParagraphs`
  (computed ranges replaced with explicit mainline-only arrays), verified with a
  checker script against `casey_v2_full_extract.txt`.
- **3B** the lone `1.` on `change-direction-full-distance`'s single unnumbered
  command — dropped.
- **3C** citation precision — `advance-in-line` (+¶665, dropped orphan "To the—STEP"),
  `column-against-cavalry` (→¶1205), `lesson-iv march-by-flank` (→¶138-139),
  `lesson-iv form-by-company` (→¶163), `close-column` (+¶303-305). `form-square`
  baseline (¶1033-1034) was already correct.
- **3E** `open-close-ranks` major post read as 4 paces in rear per ¶30.

**Accepted / no-action** (documented, deliberately not changed):
- **3D** "instructor vs captain" prose (`form-into-line`, `form-on-right-left`,
  `oblique-march`) — intentionally captain-attributed per the 2026-07-13
  instructional-staging audit (Casey's generic "instructor" → the captain for a
  lone company in the field). The source-fidelity audit flagged these against raw
  Casey without accounting for that prior decision.
- **3C** `form-by-file-into-line` ¶824/¶827 — ¶827 licenses the mirror order the
  keyframe shows; the reenactor notes already explain it.
- **3E** `break-by-company` ¶81 compound-command bundling (verbatim text, cosmetic
  structural), `advance-in-line` "Point of direction**s**" (likely OCR; singular
  matches project convention), `double-column-movements` unfold code-comment naming
  (geometry correct), `full-/half-distance-into-line` `cascadeBlend` glide (disclosed
  simplification, end state exact).

**The audit is fully remediated, and the one out-of-scope item found during
verification is also now fixed:**

> **Battalion "Casey's Text" panel — RESOLVED (commit `2cbb4b1`).** The panel had
> looked up ¶ numbers in a single map holding only Vol. I (School of Company)
> text, so battalion drills (Vol. II / Title V numbering) showed unrelated
> School-of-Company paragraphs where the numbers collided (e.g. `halt-the-column`
> showed ¶286-293 about *breaking into platoons*). Fixed by generating
> `src/data/caseyText/battalion.js` (1013 mainline paragraphs, auto-parsed from
> `casey_v2_full_extract.txt` via `tools/gen_battalion_text.mjs`) and namespacing
> the lookup by school (`getParagraph(num, school)`; `CaseyText`/`DrillPage` pass
> it). Verified in-browser: battalion drills now show the real Vol. II text,
> company drills unchanged. The generated text carries the source extract's minor
> OCR imperfections (e.g. an occasional split word) — acceptable, and improvable
> by cleaning the extract and re-running the generator.

**Nothing outstanding.** Remaining known-issues are pre-existing and unrelated to
this audit (merge/push of the branch, deploy workflow) — see the memory index.

---

## Standing rule for every fix: re-reference the source (and spec) — don't fix from the audit alone

The audit findings are a **map to the problem, not the authority for the fix.** Before
changing any file, re-read the primary source paragraph(s) yourself and, where one exists,
the pre-written spec — then make the correction match the source, not merely satisfy the
audit's phrasing. If the source is genuinely ambiguous, prefer a disclosed interpretive
note over inventing geometry, per the project's established OK-interpretive convention.

Where to look, by area:
- **School of the Company (Lessons III-VI):** `casey_lessons_3to6.txt` (continuous ¶
  numbering); School-of-the-Soldier cross-refs (`S.S. No. N`) in `casey_v1_full_extract.txt`.
  No separate spec docs — the source text is the authority.
- **School of the Battalion (Title V, Parts I-V):** `casey_v2_full_extract.txt` (continuous
  ¶1-1218; battalion ¶s are indented, skirmisher asides are `0-N`). Specs:
  `battalion-spec/*.md` — but note the audit found at least one spec (`part-third-b.md`) that
  carries the **same** stale caption as the drill (`change-direction-closed-in-mass`), so
  treat the spec as corroboration, **the source ¶ as the tiebreaker.**
- **Method / conventions reminder:** `review-tmp/_battalion_method.md` restates the geometry
  conventions (paces→px, facings, division pairing, personas) if a fix depends on a primitive.
- `pdftotext` is at `C:\Program Files\Git\mingw64\bin` if a range needs re-extraction from the
  PDFs (`caseys-v1.pdf`, `caseys-v2.pdf`).

When a finding and the source disagree with each other (as with the contested
`halt-and-align` item), stop and surface it rather than applying blindly.

---

## Canvas fit (added 2026-08-07) — RESOLVED

Not a source-fidelity finding, but discovered during visual verification: 30 of ~40
battalion drills had keyframes extending outside the fixed 1700×500 viewBox and were
silently clipped (resting lines cut off at a flank, deep columns off the bottom, wheel
arcs past the edge). Fixed by a **zoom-to-fit group transform** in `useAnimationEngine.js`:
the drawing layers live in a `.fit` group scaled/translated per drill to fit the union
bbox of all keyframes into the unchanged viewBox (scale capped at 1; battalion only;
company unaffected). One uniform viewBox is kept deliberately for responsive/mobile
consistency. Verified in-browser across buckets A/B/C + a company regression. Commit
`4cb9477`. Tradeoff: big-wheel drills render smaller to fit their swept arc.

---

## ⚠️ Contested item — DO NOT auto-apply

**`lesson-iii/haltAndAlign.js` — "Captain, rectify the alignment" (audit: C-III, HIGH).**
The audit says to *add back* the "Captain, rectify the alignment" command and correct the
"no command is needed" note, citing ¶100's literal command text. But commit `8bdd1a0`
(Jul 13, 20:34) **deliberately removed** that command as "not a field command," and the
audit was written ~40 min later against that exact post-commit state. This is an editorial
disagreement you already ruled on, not a bug. **Leave as-is unless you want to reopen the
decision.** If reopened, the question is purely: does Casey's printed "he will command:
Captain, rectify the alignment" count as a field command for our purposes? Excluded from
all phase counts below.

---

## Phase 1 — HIGH: genuine visible errors (fix first)

These are the findings where the animation or command panel shows something a
knowledgeable viewer would flag as wrong. 11 findings across 8 drills.

### 1A. Pure geometry/logic bugs (wrong thing on screen) — 5 findings

| # | Drill / file | Bug | Fix | Effort |
|---|---|---|---|---|
| 1 | **battalion `halt-in-retreat-face-front`** `part-v/haltInRetreatFaceFront.js` | Captain moved to `DEPTH.fileCloser`, clustering him with the covering sergeant; ¶736 puts him one rank shallower (`DEPTH.rear`). Sibling `marchInRetreat.js` does it correctly. | Change captain's `moveToDepth(...)` call from `DEPTH.fileCloser` to `DEPTH.rear`. | **S** |
| 2 | **battalion `change-direction-in-retreat`** `part-v/changeDirectionInRetreat.js` | Wheel pivot is backwards. After the about-face to retreat, the geographic marching-right flank is company 8, not company 1 (¶736); code pivots on company 1 for a right wheel. | Swap pivot: `pivotId = isLeft ? company1 : company8`. | **S** |
| 3 | **battalion `march-by-flank`** `part-v/marchByFlank.js` | Command 5 renders `"By file left (or left). MARCH."` on the default sub-movement — repeated word, obviously wrong. Parenthetical must be the opposite side (¶815). | ``5. By file ${side.toLowerCase()} (or ${side==='Left'?'right':'left'}). MARCH.`` | **S** |
| 4 | **company `form-by-file`** `lesson-iv/formByFile.js` | Final keyframe description says company faces **north**; it actually renders **south** (¶151 "turn to the right"; `facing:180` is correct). Caption is simply wrong. | Change "facing north" → "facing south" in the line-164 description string. | **S** |
| 5 | **company `change-direction` (left-turn)** `lesson-v/changeDirection.js` | `left-turn` sub-movement reuses the rigid `wheel()` arc identical to `right-wheel`, defeating the whole turn-vs-wheel contrast (S.S. ¶415). A "turn" = guide marches straight through at unbroken cadence, files peel/converge onto the new line successively — not a rigid rotation about a fixed pivot man. | New transform for `buildLeftTurn`: advance the guide (`nc-cov`) straight through from the turning point; interior files re-converge diagonally onto his new line. Not a `wheel()` call. | **L** |

Items 1–4 are trivial and should be batched into one commit. Item 5 is the only HIGH that
needs real engine work — decide whether to build the proper "turn" transform or, as a
lesser fix, at minimum stop annotating it as an arc and disclose the simplification (it is
currently *asserted* as a genuine turn, which is the problem).

### 1B. Wrong command text / wrong-maneuver descriptions — 6 findings

| # | Drill / file | Bug | Fix | Effort |
|---|---|---|---|---|
| 6 | **battalion `break-to-rear`** `part-ii/breakToRear.js` | `breakToward` ternary makes the `retire` sub-movement break **to the rear**; ¶138 says the whole advance/retire family breaks **to the front**. Contradicts the drill's own reenactorNotes. | `breakToward` = `'front'` for both `advance` and `retire`; only `kind==='rear'` breaks rear. Also branch the "Such company. HALT. FRONT. Left-DRESS" keyframe (¶112, rear-only) vs ¶140 dress-by-guide for advance/retire (this is the related B1 MEDIUM #M1). | **M** |
| 7 | **battalion `change-direction-in-retreat`** (commands) | Invents a 4-part `Battalion,{side} wheel / MARCH / Forward / MARCH` sequence; ¶717/¶751 give only `1. Change direction to the {side}. 2. MARCH (or double quick—MARCH).` | Render the real 2-part command. | **S** |
| 8 | **battalion `deploy-double-column`** `part-v/deployDoubleColumn.js` | `faced-right`/`faced-left` reuse the **faced-front** mass-deployment keyframe descriptions ("markers placed, general guides spring out, Division 1 stands fast while wings peel") — but ¶958-978 is a *right-into-line wheel*, a categorically different maneuver. Viewer sees identical choreography for two different maneuvers. | Best: build a distinct wheel-based sequence for right/left (reuse `wheel()` per division). Minimum: rewrite the shared keyframe descriptions so right/left don't claim markers/peel/spring-out. | **L** (full) / **M** (text-only) |
| 9 | **battalion `form-square` (maneuver-in-square)** `part-v/formSquareBaseline.js` | The square marches with **no facing change** on any front, yet ¶1051/¶1057 reorient the 2nd/3rd/4th fronts to face the march direction during the advance and revert at halt. reenactorNotes falsely claims `translate()` "reproduces it exactly." | Best: add facing-change steps (2nd front→march dir, 3rd→mirror, 4th→about) with reversion at HALT. Minimum: soften the "reproduces it exactly" claim to a disclosed simplification. | **M** (full) / **S** (text-only) |
| 10 | **company `march-in-retreat`** `lesson-iii/marchInRetreat.js` | About-FACE keyframe says "the directing sergeant takes his advanced post…as at ¶84" — wrong actor (¶120 = the *instructor*) and wrong timing (sergeant's advance is ¶122, a keyframe later; geometry correctly doesn't move him here). | Remove the sergeant-advance sentence from the About-FACE keyframe; leave that narration on the "Company, forward" keyframe where the geometry shows it. Fix the ¶119-120 citation (related C-III MEDIUM). | **S** |
| 11 | **battalion `march-by-flank`** (geometry) `part-v/marchByFlank.js` | `marchOrderFor()`'s `'right'` branch (unsourced mirror: company 8 leads) conflicts with ¶820-822 and with `formByFileIntoLine.js`'s sourced `'right'` case (company 1 leads). Article X feeds Article XI as one maneuver; they must agree. *Inline-labeled MEDIUM but visibly inconsistent across two chained drills — treat as HIGH-adjacent.* | Re-examine ¶808-809 vs ¶820-822; change the `'right'` branch to keep company 1 leading, matching `formByFileIntoLine.js` and `columnOfFiles()` convention. | **M** |

> **B6 count note:** the audit's B6 table lists `march-by-flank` as 2 HIGH, but its inline
> text has 1 HIGH (the command bug, #3) + 1 MEDIUM (this geometry item, #11). This plan
> treats #11 as its own line here because of the cross-drill visual inconsistency, which is
> why "11 HIGH findings" reconciles the table's 12 with the inline 11.

---

## Phase 2 — MEDIUM: misleading text & wrong citations (34 findings)

None of these change what's rendered (geometry is correct); they mislead a viewer reading
captions or anyone checking sources. Grouped by fix type.

### 2A. Caption text contradicts the correct rendered geometry — fix the string
- **`change-direction-closed-in-mass`** `part-iii/changeDirectionMass.js`: final keyframe description says the column ends "faced back to its original facing"; geometry (correctly) faces `newFacing` per ¶365 "in which it is to remain." Fix the description to say new facing. *(carried from the spec's own stale summary — check `battalion-spec/part-third-b.md` too.)*
- **`change-direction-in-line`** `part-v/changeDirectionInLine.js`: (a) "Forward. MARCH" numbered `3./4.`; ¶726 restarts at `1./2.` — fix numbering. (b) caption says colonel "placed before the battalion"; ¶725 puts only the LTC there and the file's own `COLONEL_REAR_PACES` puts the colonel to the rear — fix caption.
- **`halt-and-align-line`** `part-v/haltAndAlign.js`: "Guides—ON THE LINE" keyframe cites ¶705-708 but ¶707's captain wing-shift is neither shown nor mentioned. Narrow the caseyRef to ¶705-706+708, or model/disclose the ¶707 shift.
- **`close-column-half-or-mass`** `part-iii/closeToHalfOrMass.js`: rear-company case keeps *whole companies* rear-faced through the closing keyframe; ¶321 has only the lone guide stay rear-faced while each company re-fronts as it halts. Caption asserts the guide-only nuance the geometry doesn't show. Either re-front companies as they halt, or disclose the simplification instead of asserting it.
- **`halt-the-column`** `part-iii/haltColumn.js`: `dress` sub-movement stages ¶290 (name individual guides) and ¶291-293 (general realignment) as sequential steps; Casey frames them as mutually-exclusive colonel choices ("If…not necessary" vs "If, on the contrary"). Third keyframe is also a geometric no-op. Split into two sub-movements, or restructure so captions read as alternatives and drop/repurpose the no-op frame.

### 2B. Missing command lines in the panel
- **`form-divisions`** `part-iii/formDivisions.js`: `from-march` narration mentions right companies' "Mark time" (¶450) but the `commands` array omits it. Add a `Mark time` line.
- **`countermarch`** `lesson-vi/countermarch.js`: ¶349's post-dress `FRONT` is staged as its own keyframe but missing from `commands` (sibling `form-on-right-left.js` lists the analogous FRONT). Add a second unnumbered `FRONT.` after `4. Right—DRESS.`
- **`pass-defile-in-retreat`** `part-v/passDefileInRetreat.js`: `commands` is a static hedge (`[Company], right (or left)—FACE`) that never resolves per sub-movement; geometry is scenario-correct. Make `commands` a function of `subMovement` (like `changeDirectionInRetreat.js`), hardcode "First company" (never varies, ¶790/792).
- **`form-square-from-line`**, **`form-square-four-ranks`**, **`form-square-oblique`** (3 files, 2 MED each = 6): each ends at a "Form square" keyframe but omits the trailing baseline `Form square / Right and left into line, wheel / MARCH / Guides—POSTS` command set that produces it (¶1171/¶1132/¶1177; `formSquareBaseline.js`'s `from-full-distance` does this right). Append the delegated command set to each affected sub-movement's `commands`. *(The `forward-on-centre` sub-movements are self-contained — leave them.)*

### 2C. Wrong / unsupported `caseyRef` on a keyframe
- **`change-direction-half-distance`** `part-iii/changeDirectionHalf.js`: ¶344 is skirmisher-only (`0-344`); three keyframes + notes cite `¶343-344`. Change to `¶343`; drop 344 from `caseyParagraphs`.
- **`mass-deployment`** `part-iv/massDeployment.js`: interior-division final keyframe cites ¶625 for "Guides—POSTS," but ¶625 is officer-duty text with no such command; and the interior article never states Guides—POSTS at all. Cite "¶625 (by analogy with ¶578/¶607)" or soften the claim. *(same root as the COMMANDS flag below)*
- **`deploy-double-column`** `part-v/deployDoubleColumn.js`: faced-right/left final keyframe cites ¶958 (the opening command paragraph) for "Guides—POSTS"; no such beat exists for this case. Cite ¶966-972 generally or disclose it's an extension of the faced-front convention.
- **`form-square`** `part-v/formSquareBaseline.js`: "Square closed" keyframe cites ¶1012 (skirmisher-only `0-1012`); should cite the ¶1009-1011 end state.
- **`change-direction-in-retreat`** `part-v/changeDirectionInRetreat.js`: cites ¶752 (skirmisher `0-752`) for a general battalion claim. Drop ¶752 from caseyRef/caseyParagraphs or scope it to a skirmisher note.
- **company `march-in-line`** `lesson-iii/marchInLine.js`: (a) "covering sergeant covers the captain (¶89-90)" — ¶89/90 don't mention the covering sergeant; cite the actual formation paragraph or mark as standing convention. (b) "sergeant returns to post" cites ¶98 (about the *instructor* halting to observe); change to ¶100/¶127.
- **company `mark-time`** `lesson-iii/markTime.js`: (a) double-quick keyframe attributes the 33"/165-per-min/arms details to S.C. ¶111-112; real sources are S.S. No. 111 (step/cadence), S.C. ¶117 (cadence), S.S. No. 360 (arms). Re-cite. (b) back-step comment says "15-inch"; S.S. No. 256 says **14 inches**; `backDist = 6*8` should be `6*7` (7px/step). Fix comment + distance.
- **company `march-in-retreat`** citation — folded into HIGH #10.
- **company `break-platoons`** `lesson-vi/breakPlatoons.js`: KF3 "2nd platoon marks time" cites ¶272-273; the mark-time fact is ¶274. Extend to `¶272-274`.

### 2D. Description doesn't match what's actually modeled
- **`form-divisions`** `part-iii/formDivisions.js`: `full-or-half-distance` hardcodes `distanceMode='full'`; the "half" case is never rendered despite the label/¶453. Either render half distance (param or 4th sub-movement) or rename the label to "At Full Distance" and document half as a stated generalization.
- **`mass-deployment`** (commands) — interior-division "Guides—POSTS" isn't sourced in ¶621-631; note it's inferred by the general pattern (pairs with the 2C citation fix above).
- **company `form-by-file`** `lesson-iv/formByFile.js`: KF3 claims the rear rank marks time until 4 front-rank men are established (¶151), but `buildFormByFilePositions()` forms front/rear of a depth group simultaneously with no stagger. Either implement the stagger or soften the description.
- **company `break-files`** `lesson-vi/breakFiles.js`: reenactorNotes says broken files are disposed "as though the company had faced by the flank on **their** side (¶306)"; ¶306 says the **opposite** side. Prose-only inversion (coded across-order is correctly taken from ¶295). Reword to "opposite side."
- **company `form-on-right-left`** `lesson-vi/formOnRightLeft.js`: code comment claims S.S. Vol. I turning-mechanics text is unavailable to justify modeling the "turn" as a rigid rotation; that text (S.S. ¶413-415) **is** in-repo and describes the guide-marches-straight/rest-catches-up mechanic. Correct the comment's false claim; ideally model the true turn (shared with HIGH #5's `changeDirection.js` — same S.S. 415 mechanic, do together).

### 2E. Break-to-rear front/rear geometry & quote (B1)
- **`break-to-rear`** `part-ii/breakToRear.js` (M1, M2): (M1) the ¶112 "Such company. HALT. FRONT. Left-DRESS" quote is applied to all four sub-movements but is rear-only; advance/retire use ¶140's dress-by-guide. Branch by `v.kind`. (M2) `angleDeg`/`pivotOf` depend only on `side`, so rear-right / advance-right / retire-right compute *identical* positions, erasing the source-documented front-vs-rear distinction (¶112 rear vs ¶138 front). Differentiate the two families geometrically. **Fix M1/M2 together with HIGH #6.**

---

## Phase 3 — LOW: metadata & nitpick cleanup (~26 findings)

Low-risk, mostly mechanical. Two dominant patterns plus a handful of one-offs.

### 3A. Skirmisher `0-N` paragraph pollution in `caseyParagraphs` arrays (biggest cluster)
Several drills build `caseyParagraphs` from a raw integer range that sweeps in skirmisher-only
paragraph numbers (which exist only as `0-N` in the source, not as mainline `N.`). No content
is misattributed — pure metadata. Audit-off if you prefer; otherwise strip the non-existent
numbers from each array:
- `change-direction-closed-in-mass` (0-363, 0-364, 0-368, 0-373, 0-376, 0-379)
- `take-distances` (0-396, 0-399, 0-403, 0-404, 0-410, 0-412, 0-416, 0-421)
- `countermarch` battalion (0-423, 0-436)
- `half-distance-into-line` (495, 499, 504, 517, 518, 533, 535, 543, 550)
- `mass-deployment` (561, 564, 577, 594, 597, 606, 624, 629)
- `change-direction-half-distance` (344 — also a keyframe fix, see 2C)
> Consider a one-off validator script: for each `caseyParagraphs` entry, assert a `^\s*N\.`
> match exists in the relevant extract; report the misses. Cheaper than eyeballing.

### 3B. "1." prefix on single, unnumbered source commands
- `change-direction-full-distance` `part-iii/changeDirectionFull.js`: ¶273 is one unnumbered line; drill prints `1. Head of column to the {side}.` Drop the lone "1." (site convention question — decide once, apply to any single-command cases).

### 3C. Incomplete-but-not-wrong keyframe citations (extend the range)
- `close-column-half-or-mass`: `caseyParagraphs` omits ¶303-305 though cited inline. Add them.
- `advance-in-line` `part-v/advanceInLine.js`: LTC 12-15 pace figure is ¶665, not in the keyframe's cited ¶652-657 (¶665 is in `caseyParagraphs`). Extend the keyframe caseyRef.
- `form-by-file-into-line` `part-v/formByFileIntoLine.js`: final keyframe cites ¶824+¶827; ¶827 is the inverse-means rule, imprecise for "Guides—POSTS." Narrow or note.
- `column-against-cavalry` `part-v/columnAgainstCavalry.js`: "formed" keyframe cites ¶1205-1206; ¶1206 is the marching variant. Narrow to ¶1205.
- `form-square` (from-full-distance): "Half distance reached" cites ¶1034; the file-closer fact is ¶1033. Cite ¶1033-1034.
- company `march-by-flank` `lesson-iv/marchByFlank.js`: KF3 file-closer fact is ¶139, tagged ¶138. Tag ¶138-139.
- company `form-by-company` `lesson-iv/formByCompany.js`: final by-company keyframe cites ¶162 (left-flank mirror); content is ¶163. Drop 162.

### 3D. "instructor" vs "captain" command attribution in prose (School of Company)
Casey attributes "Guides—POSTS" (and some oversight) to the *instructor*; a few drills' prose
give it to the captain. Narrative-only, no functional impact. (Note: the broader
instructor→captain reframing was already done in the 2026-07-13 staging audit; these are
residual prose spots.)
- `form-into-line` `lesson-v/formIntoLine.js`: Guides—POSTS is the instructor's (¶250), prose says captain.
- `form-on-right-left` `lesson-vi/formOnRightLeft.js`: same, ¶364.
- `oblique-march` `lesson-iii/obliqueMarch.js`: "captain watches files don't crowd" — ¶108 attributes to instructor (OK-interpretive per audit; lowest priority).

### 3E. Other one-offs
- `open-close-ranks` `part-i/openCloseRanks.js`: major's "4 paces in front" vs ¶28's ambiguous "four paces from the front rank" (arguably in rear per ¶30). Disclose as interpretive; major isn't individually rendered so cosmetic.
- `break-by-company` `part-ii/breakByCompany.js`: ¶81 compound preparatory+execution command bundled as one `execution` entry. Structural nitpick.
- `advance-in-line`: (a) "Point of direction**s**" (¶670 plural, likely OCR) rendered singular — cosmetic, matches existing convention; (b) orphan `To the—STEP` command in the array, never demonstrated — drop it or add a keyframe.
- `full-distance-into-line` `part-iv/fullDistanceIntoLine.js` & `half-distance-into-line` faced-to-rear: `cascadeBlend()` glide instead of true wheel/loop arc — already disclosed simplifications, final state exact. No action unless upgrading the engine.
- `double-column-movements` `part-v/doubleColumnMovements.js`: unfold naming — comments say "2nd/3rd division columns" where ¶932 says "first and second divisions" (double-column naming). Geometry correct; clarify comment only.

---

## Recommended execution order

1. **Phase 1A items 1-4** (4 one-line fixes) → one commit. Highest value/effort ratio;
   these are outright-wrong things on screen fixable in minutes.
2. **Phase 1B text-only fixes** (#7, #10, and the text-only options of #8/#9) → one commit.
3. **Phase 1A item 5 + Phase 1B #11 + #6** (the real geometry/logic work: the company
   "turn" transform, the march-by-flank/form-by-file lead-company reconciliation, and
   break-to-rear front/rear) → decide scope per item; these need in-browser verification
   via the Playwright plugin, not just lint/trace.
4. **Phase 2** in batches by file, verifying captions against the live animation.
5. **Phase 3A** via a validator script (one pass), then the remaining 3B-3E prose nits.
6. Re-run the relevant audit batch (or a spot re-verification) after each phase; delete
   `review-tmp/` or commit it into the repo once findings are triaged.

**Verification note:** per project practice, the geometry fixes (Phase 1A #5, 1B #6/#11,
and any Phase 2 items that touch positions) must be re-verified in-browser with the
Playwright plugin, not trusted from a trace alone — the HashRouter cross-school render bug
is precisely the class of thing lint/trace missed.

**Decision needed before Phase 1B/3:** the contested `halt-and-align` item (top of doc);
whether `deploy-double-column` #8 and `form-square` #9 get full geometry rebuilds or
text-only disclosures; and the single-command "1." prefix convention (3B).
