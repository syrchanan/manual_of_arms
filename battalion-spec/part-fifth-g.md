# Part Fifth-G: Article XV "The rally" (¶1212–1217) and Article XVI "Rules for manoeuvring by the rear rank" (¶1218–1230)

Source: `casey_v2_full_extract.txt`, Article XV heading at file line 6397 (page 153); Article XVI heading at
file line 6424 (page 153–154). Text ends at file line 6477 ("END OF SCHOOL OF THE BATTALION."), followed
immediately by the Table of Contents (file line 6478+). This is the FINAL article range of Title V, School of
the Battalion — no further drill content follows in this file.

This spec also captures the tail end of the preceding paragraph run (¶1207–1211, "To form column," continuation
of Article XIV / "Column against cavalry") only for reference/continuity — that material belongs to a prior
spec file (part-fifth-f or similar) and is NOT re-specified here in detail.

STATUS: COMPLETE.

---

## Article XV — The rally (¶1212–1217)

### Paragraph range
¶1212–1217 (file lines 6401–6423). Note ¶1217 is printed as "0-1217" in the source — the "0-" prefix is this
manual's convention (per `TODO-battalion-plan.md`) for skirmisher-specific paragraphs, confirmed out of scope
for this project (no skirmisher companies in the animation model).

### Exact commands
No formal preparatory/execution word-of-command pairs are printed for this article. Instead, the article
describes bugle-signal-triggered actions:
- "the disperse [signal]" (¶1212) — sounded to break up the battalion.
- "the color [signal]" (¶1213) — sounded to begin rallying in line.
- "the assembly [signal]" (¶1216) — sounded to begin rallying in column.

These are bugle/trumpet signals, not spoken commands, and are not quoted as command text in the source (no
"1. ___ 2. MARCH" formatting appears anywhere in ¶1212–1217).

### Sequence of actions
- ¶1212: The battalion, in line of battle, is signaled to disperse ("the disperse" sounded); "the battalion
  will break and disperse." This is a deliberate, ordered dissolution of the formation — not a rout — used
  presumably for skirmish/foraging/cover purposes.
- ¶1213: To re-form, the colonel sounds "the color," and simultaneously places two markers and the
  color-bearer "in the direction he may wish to give the battalion" — i.e., markers define the new line's
  position/orientation.
- ¶1214: Each captain independently rallies (reassembles) his company "about six paces in rear of the place it
  is to occupy in line of battle" — companies re-form behind their eventual line position, not directly on it.
- ¶1215: The colonel has the color-company established against the markers first; every other company then
  aligns itself on the color-company "by the command of its captain... according to the principles heretofore
  prescribed" (i.e., standard company-alignment-on-a-base-company procedure, cross-referenced but not
  restated).
- ¶1216: Alternative — rallying into COLUMN instead of line. Colonel sounds "the assembly," places two markers
  ahead of where the first company should be. First captain rallies his company behind the two markers; each
  subsequent captain rallies his company "at platoon distance" behind the company that precedes it in column
  order.
- ¶1217 ("0-1217," skirmisher paragraph, out of scope): skirmisher companies retake proper position at the
  signal, in either the line or column rally.

### Start/end state
- Start (line rally, ¶1213–1215): battalion in a dispersed/broken state (no formation) → end: battalion
  reformed in line of battle, aligned on the color-company at the marker position.
- Start (column rally, ¶1216): dispersed battalion → end: battalion reformed in column by company, at platoon
  distance, led by the first company positioned at the markers.
- The dispersal itself (¶1212) has no defined end state other than "broken and dispersed" — an unstructured,
  non-animatable scatter.

### Distances/measurements
- Company rally point: "about six paces in rear" of its eventual line-of-battle place (¶1214). "About" signals
  approximate/informal distance, consistent with this being a rough, real-world regrouping maneuver rather than
  a precision drill movement.
- Column rally: companies form "at platoon distance" behind the preceding company (¶1216) — same platoon
  distance unit used throughout School of the Battalion column formations (already modeled elsewhere in the
  engine).

### Cross-references
- ¶1215: "according to the principles heretofore prescribed" — refers back to standard company-alignment-on-
  base-company procedure covered earlier in Title V (not chased here).
- ¶1217 references skirmisher paragraph "No. 61" is NOT present here — that cross-ref appears in Art. XVI
  (¶1221) instead; ¶1217 itself has no explicit outbound numeric cross-reference beyond its own skirmisher
  content.

### Complexity notes / recommendation
**Recommend documentation-only; do not build as an animated drill.**
Reasoning:
1. The triggering events are bugle signals, not formation-drill commands — there is no "1. ___ 2. MARCH"
   structure to animate a call-and-response keyframe sequence from.
2. The starting state ("broken and dispersed," ¶1212) is explicitly unstructured — Casey gives no soldier
   positions, paths, or ordering for the scatter, so there is no source geometry to drive an accurate
   dispersal animation. Any dispersal animation would be invented, not source-derived, which conflicts with
   this project's practice of numerically trace-verifying drills against the text.
3. The re-formation ("rally," ¶1214–1216) reduces to two already-implemented primitives: (a) individual
   companies re-forming near their line-of-battle posts and aligning on a base/color company (a variant of
   existing line-formation/alignment logic), and (b) companies forming a column at platoon distance behind a
   lead company (already implemented via `columnOfCompanies()`). Nothing new geometrically.
4. Real-world "rally" also implies each soldier individually running from a scattered position to a rally
   point — an individual, chaotic, non-drill-formation movement outside the scope of the parade-ground
   formation animations this project builds.
5. Best treatment: a short reenactorNotes/documentation entry (perhaps attached to the existing line-of-battle
   or column-of-companies drill, or a standalone "context" note in the battalion overview) explaining the
   rally concept, its two variants (line vs. column), and the six-pace / platoon-distance figures, without a
   dedicated `buildKeyframes()` drill.

---

## Article XVI — Rules for manoeuvring by the rear rank (¶1218–1230)

### Paragraph range
¶1218–1230 (file lines 6428–6476), immediately followed by "END OF SCHOOL OF THE BATTALION." (line 6477).
Confirmed this is the last article of Title V; nothing further in-scope follows in the source file.

### Exact commands
One formal command triggers this mode, quoted verbatim from ¶1219:

> 1. Face by the rear rank. 2. Battalion. 3. About—FACE.

No other spoken commands are given in this article; the remainder (¶1220–1230) is entirely rules/principles
text describing how personnel and existing commands behave once the battalion is in this state — it explicitly
states existing maneuvre commands continue to apply unchanged (¶1227, see below).

### Sequence of actions
- ¶1218: Framing — battalions sometimes must maneuver "by the rear rank"; when this is needed, ¶1219–1230
  rules apply.
- ¶1219: The colonel commands "Face by the rear rank. Battalion. About—FACE," causing the battalion (front
  rank formation) to face about, so the former rear rank becomes the new front-facing rank.
- ¶1220: If deployed (in line), this is executed exactly as previously described for "fire by the rear rank"
  (cross-reference to earlier fire-by-rank material, not restated here).
- ¶1221 ("0-1221," skirmisher paragraph, out of scope): skirmisher companies execute per skirmisher rule
  "No. 61" — an internal cross-reference number, not chased.
- ¶1222: If in column by company or by platoon (right or left in front): chiefs of subdivision pass by the LEFT
  flank of their subdivision to reach their new column places; file closers pass by the RIGHT flank; guides
  relocate to the rear rank (which is now the front-facing rank).
- ¶1223: If the column is formed by division: chiefs of division pass through the interval at the CENTER of
  their division; file closers pass by the OUTER flanks of their companies; the junior captain in each division
  steps into the rear rank and is "covered" (aligned front-to-back) by the covering sergeant of the left
  company.
- ¶1224: Personnel repositioning — lieutenant-colonel places himself abreast of the leading subdivision; the
  senior major abreast of the rearmost subdivision.
- ¶1225 ("0-1225," skirmisher/platoon-column paragraph — note: despite the "0-" prefix normally denoting
  skirmisher content, this paragraph is actually about PLATOON COLUMNS marching around the flanks of the
  battalion column to swap position order (first platoon column takes the position the second occupied before
  facing, and vice versa). This reads as battalion-level (not skirmisher) content mislabeled/co-numbered with
  the "0-" skirmisher series in this source transcription — flagging as ambiguous. If genuinely battalion-
  level, it describes an actual repositioning MARCH (platoon columns marching around the flanks) that is more
  concretely animatable than the rest of this article, which is largely descriptive/relabeling.
- ¶1226: Companies, divisions, and wings KEEP their prior names/numbering even though the battalion is now
  faced by the rear rank (no renumbering occurs).
- ¶1227: **Key general principle** — maneuvers by the rear rank use the SAME commands and same principles as
  front-rank maneuvers, but executed such that when the battalion is eventually brought back to its proper
  front, all subdivisions end up in their regular right-to-left order. This is the core "rule" the article
  title refers to: existing drill commands are reused; only the execution mapping (who does what physically)
  changes to preserve eventual correct order.
- ¶1228: Corollary for deployment — when a column faced by the rear rank is deployed, subdivisions that would
  normally end up right of the deployment-base subdivision instead face LEFT, and those that would end up on
  its left instead face RIGHT (i.e., the deployment facing directions invert relative to normal deployment).
- ¶1229: Corollary for ploying line-into-column while faced by the rear rank — colonel still announces "left in
  front" or "right in front" per normal, but because the battalion is faced by the rear rank, the first
  subdivision is physically on the LEFT and the last is physically on the RIGHT (reversed from normal), so the
  column takes its guide to the right if the first subdivision leads, and to the left in the reverse case
  (i.e., the guide-side rule inverts relative to the front-rank case).
- ¶1230: To restore proper front, the column faced by the rear rank is brought about by previously prescribed
  means; if by company or platoon, chiefs of subdivision now pass by the (former-)left of subdivisions — now
  labeled right — and file closers by the (former-)right — now labeled left. This is essentially the mirror
  image of ¶1222, undoing the rear-rank state.

### Start/end state
- Start: battalion in normal front-rank-forward state (line or column, by company/platoon/division).
- Trigger: "Face by the rear rank. Battalion. About—FACE" (¶1219) — battalion about-faces; former rear rank
  becomes the operative front.
- Mid-state: battalion (or column) continues to execute ALL standard maneuvers/commands (¶1227) while in this
  inverted-rank state, with personnel (chiefs, file closers, guides, lieutenant-colonel, major) repositioning
  per ¶1222–1225 to make the inverted state function correctly.
- End: eventually the battalion/column is "brought to its proper front" (¶1230) by standard means, restoring
  normal front-rank orientation; subdivisions return to regular right-to-left order (guaranteed by the ¶1227
  principle having been followed throughout).

### Distances/measurements
None given — this article contains no paces, distances, or intervals. It is purely about facing, rank
inversion, personnel repositioning routes (flank vs. center-interval passing), and naming/order preservation.

### Cross-references
- ¶1220: "as has been indicated for the fire by the rear rank" — refers to earlier fire-by-rear-rank material
  in Title V (not chased).
- ¶1221 ("0-1221"): skirmisher rule "No. 61" — internal cross-reference, skirmisher scope, not chased.
- ¶1222/1223/1230: reference "heretofore prescribed" means for column-facing/subdivision-place-taking — refers
  to standard column mechanics already implemented elsewhere (e.g., column-of-companies/platoons/divisions
  logic in `battalionFormations.js`).

### Complexity notes / recommendation
**Recommend documentation-only; do NOT build as a distinct animated drill**, with one caveat noted below.
Reasoning:
1. The article's stated purpose (¶1218, ¶1227) is explicitly a RULE/PRINCIPLE — "the manoeuvres by the rear
   rank will be executed by the same commands and on the same principles as if the battalion faced by the
   front rank." It is not introducing a new formation or movement; it's declaring that ALL existing commands
   (already implemented: line, column, deployment, ploy-into-column, etc.) remain valid when the battalion has
   been about-faced, with an internal bookkeeping correction (who passes on which flank, which side the guide
   is on) so the final result comes out in correct order.
2. Animating this as its own "drill" would essentially require re-running every existing battalion formation
   drill in a mirrored/rear-rank mode — not a new geometry, but a modifier/flag on existing ones. That is a
   significant undertaking disproportionate to the source material, which devotes no distances, no new command
   sequences beyond the single about-face trigger, and no worked numeric example.
3. The one concrete, novel PHYSICAL action in the article is the About-Face command itself (¶1219, already a
   generic primitive — `aboutFace()`/`setFacing()` likely already exist per the engine) plus the personnel
   flank-passing choreography in ¶1222–1225 (chiefs/file-closers swapping which flank they pass by, guides
   moving to the new rear). This personnel-level choreography (individual named-role soldiers, not massed
   companies) is finer-grained than this project's existing drill scope (which models file/rank soldier blocks
   moving as formations, not individually routed staff/NCO repositioning) — consistent with prior exclusions
   of similarly staff-level detail elsewhere in the project.
4. ¶1225 is flagged above as ambiguous (possibly mislabeled "0-" skirmisher paragraph that is actually about
   platoon-column repositioning) — worth a source-image/page double-check if this article is ever revisited,
   but even taken as battalion-level, it describes a position-relabeling march with no distances or command
   text, i.e., still not a strong standalone-drill candidate.
5. Best treatment: a short reenactorNotes/"principle" callout — e.g., attached to the About-Face primitive or
   to the battalion overview page — stating that any existing battalion maneuver can be executed "by the rear
   rank" via this command, that the outcome preserves correct final left-to-right order, and that guide-side /
   flank-passing conventions invert accordingly. No new `buildKeyframes()` drill file is warranted.

---

## Overall conclusion for this range

Article XV (rally) and Article XVI (rear-rank maneuvering) both conclude Title V, School of the Battalion, at
file line 6477 ("END OF SCHOOL OF THE BATTALION."). Neither article introduces new formation geometry beyond
primitives already implemented in this project (line alignment, column-of-companies at platoon distance,
about-face). Both are recommended as documentation/reenactorNotes additions rather than new animated drills.
This closes out Title V; no further battalion-drill source material remains in `casey_v2_full_extract.txt`
after this point (the file continues into "TABLE OF CONTENTS" at line 6478, confirming no additional Part or
Article follows Article XVI).
