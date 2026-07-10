# Part Fourth — Different Modes of Passing from the Order in Column to the Order in Battle

Source: `casey_v2_full_extract.txt`, lines 2489–3487, ¶463–647 (continuous Vol. II
paragraph numbering). Boundary confirmed by grep: `PART FOURTH` at line 2489,
`PART FIFTH` at line 3487.

This Part has **4 Articles**, confirmed by grep for `ARTICLE` within the line
range and cross-checked against paragraph continuity:

| Article | Title | Lines | Paragraphs |
|---|---|---|---|
| I | Manner of determining the line of battle | 2494–2505 | ¶463 |
| II | Mode of passing from column at full distance into line of battle | 2507–2684 | ¶464–491 |
| III | Different modes of passing from column at half distance, into line of battle | 2685–3026 | ¶492–554 |
| IV | Deployment of columns closed in mass | 3027–3486 | ¶555–647 |

Skirmisher-specific paragraphs (prefixed `0-` in the source extraction, e.g.
`0-477`, `0-481`) describe how the attached companies of skirmishers /
platoon columns conform to each maneuver. They are noted under each sub-case
but are **out of scope for animation** per project convention (skirmisher
content not yet in site scope) — flagged, not chased in detail.

---

## Article I — Manner of determining the line of battle (¶463)

Not a maneuver; a surveying/staking procedure the colonel and lieutenant-colonel
use before any deployment. No commands, no troop movement — this is
scene-setting for Articles II–IV, likely represented as a static annotation
(marker points) rather than an animated drill.

**¶463** — Three ways to mark the line of battle:
1. Two markers placed 80–100 paces apart on the desired line direction.
2. One marker at the point where a flank is to rest, then a second marker
   toward the opposite flank, "a little less than the front of the
   subdivision" from the first.
3. Choose direction points for both flanks first, then determine the straight
   line between them by intermediate points (useful when the flank points
   themselves are out of sight of each other).

**Complexity note:** none — purely a staking convention. Could be rendered as
a one-frame annotation (two marker dots + a dashed alignment line) preceding
any Article II–IV drill, rather than its own drill.

---

## Article II — Column at full distance, right in front, to the left into line of battle

### Sub-case: "To the left (or right) into line of battle" (¶464–474)

**Commands** (¶464):
> 1. Left into line, wheel. 2. MARCH (or double quick—MARCH).

**Start state:** Column at full distance (each company/subdivision spaced a
full subdivision-front behind the one in front, per Part Third), right in
front, halted.

**Sequence of actions:**
- Before commanding, the colonel "assures the positions of the guides by the
  means previously indicated" (¶464) — i.e., Article I's staking.
- At the **first command** (¶465): the right guide of the **leading company**
  hastens to the direction line of the left guides of the column (the
  perpendicular reference line the whole column will wheel onto), facing them,
  positioning himself opposite one of the three right files of his own
  company as it will stand when in line. The lieutenant-colonel assures this
  position.
- At the **command march** (¶466), briskly repeated by each captain: the left
  front-rank man of **each company** faces left and rests his breast against
  his guide's right arm (i.e., every company wheels simultaneously — this is
  the battalion-scale analog of the Company's "form into line" wheel). Each
  company wheels left "on the principle of wheeling from a halt" (cross-ref:
  S.C. No. 244 — the Company-level wheel-from-halt already implemented as
  `formIntoLine.js`). Each captain watches his own company and, when its right
  arrives at 3 paces from the line, commands: `1. Such company. 2. HALT.`
  (¶466).
- Company halts (¶467): captain places himself on the line beside the left
  front-rank man of the company **next on the right**, aligns himself, commands
  `3. Right—DRESS.`
- Dress (¶468): company dresses up between the captain and the front-rank man
  on its left — captain directs alignment on that man. The front-rank man on
  the right of the **right company** (first company, no company to its right)
  rests his breast against his own right guide instead (¶468) — special case
  for the anchor/pivot company.
- Each captain commands `FRONT`; colonel adds `Guides—POSTS` (¶469).
- Guides return to line, passing through the nearest captain's interval; captain
  steps before the first file momentarily to let him pass, covering sergeant
  likewise (¶470) — **general rule for all line-of-battle formations**.
- File closers place themselves exactly 2 paces from the rear rank (¶471) —
  general rule.
- Colonel, lieutenant-colonel, majors, adjutant, sergeant-major return to their
  line-of-battle posts (¶472) — general rule; in elementary instruction the
  colonel may instead go wherever needed.

**Directing/pivot logic:** Unlike the Company's 2-platoon case (where both
platoons wheel onto ONE shared line simultaneously and no company is
"anchor"), here **the FIRST (right) company is implicitly the anchor**: ¶465
has only the right guide of the leading company pre-positioned on the
direction line, and ¶468 explicitly gives the right company's right
front-rank man a different reference (his own guide) than every other
company (which dresses on the company to its right). Every company wheels
independently and simultaneously (all at ¶466's "MARCH"), each on its own
pivot file, but they align successively right-to-left via the "dress on the
man to your right" rule — a chain, not a single simultaneous dress.

**Left-in-front mirror (¶473–474):** Column with left in front forms right into
line by the same principles; the **left guide of the left company** takes the
role ¶465 gave the right guide of the right company. At `Guides—POSTS`,
captains take their line-of-battle places aligned by the **left** (¶474) —
general rule for all left-aligned formations.

**Column by division variant (¶475):** Same commands/means, with a wrinkle:
at halt, the **left guide of each right-hand company** (not just the lead
company) places himself on the alignment opposite one of the three files on
the left of his company; only the first company's left guide is assured
directly by the lieutenant-colonel — the left guides of other right-hand
companies align themselves off the **division guides**, who invert their
pieces (hold muskets vertically before the body) as a marking signal at the
command `left into line, wheel`. Left-in-front column-by-division: mirror
roles (right guides of left companies).

**On the march, without halting (¶476, ¶478–480):** Same commands; guides halt
in their places and lieutenant-colonel rectifies. If colonel wants forward
movement without halting entirely:
> 1. By companies left wheel. 2. MARCH (or double quick—MARCH).
Each company wheels left on a **fixed pivot** (cross-ref S.C. No. 266); left
guides step back into file-closer rank before wheel completes; when company
fronts near the line, colonel commands `3. Forward. 4. MARCH. 5. Guide
centre.` At 4th command, companies march straight to front; at 5th, color and
general guides move rapidly 6 paces to front, colonel assures color's
direction, captains/men conform to line-of-battle march principles
(forward cross-ref to ¶648 in Part Fifth Art. I).

### Sub-case: "By inversion to the right (or left) into line of battle" (¶484–489)

**Commands** (¶484):
> 1. By inversion, right into line, wheel. 2. Battalion guide right.
> 3. MARCH (or double quick—MARCH).

Used when a right-in-front column must form line faced to the **reverse**
flank (i.e., form to the right instead of the natural left) by the shortest
movement — this flips which flank is "directing."

**Sequence:**
- First command (¶485): lieutenant-colonel places himself in front, facing the
  right guide of the **leading subdivision**. At second command, he rectifies
  the right guides' direction; if column is by division and there's an odd
  company, its captain brings his company's right onto direction and to
  company distance from the division ahead. The left guide of the leading
  subdivision places on the direction of the right guides (assured by
  lieutenant-colonel).
- Third command MARCH (¶486): right front-rank man of **each subdivision**
  faces right, rests breast on guide's left arm; battalion forms right into
  line "according to the principles prescribed" (i.e., Art II's base
  mechanics, but mirrored). Colonel then commands `Guides—POSTS`.
- Left-in-front mirror at ¶487 (forms left into line by inversion).
- Forward-continuation variant (¶488): combine with ¶478's forward-march
  technique, prefixing the wheel command with "by inversion."
- Skirmisher note ¶489 (out of scope, noted only): first platoon column faced
  right/filed left, second platoon column faced left/filed right around the
  flanks — relevant later if inversion needs revisiting for skirmisher-scope
  work, not now.

**Complexity note:** "By inversion" is a *labeling/handedness* flip, not a new
geometric mechanic — same wheel-into-line geometry as the base case, mirrored
left-right. Should be implementable as a parameter (`invert: true`) on the
same deploy function rather than a separate engine path.

### Successive Formations (¶490–491) — transition note only

Defines the term used throughout Article III: "successive formations" =
formations where subdivisions arrive on the line **one after another**
(as opposed to Article II's simultaneous-wheel case). Includes: forming on
the right/left into line (Art III §2), faced-to-rear formations, and
deployments of columns in mass (Art IV). When the column is marching and
continues marching, successive formations combine quick and double-quick time
across subdivisions (¶491) — i.e., different companies may be in different
gaits at the same moment, which the animation needs to support (staggered
per-company timing, not a single global tween).

---

## Article III — Column at half distance, into line of battle

Four numbered sub-cases per the article's own outline (¶689 table in source):
1. To the left (or right) into line of battle (¶492–499)
2. On the right (or left) into line of battle (¶500–529, includes Remarks)
3. Forward, by deployment (¶530)
4. Faced to the rear (¶531–554)

### 1st. Column at half distance, to the left (or right) into line of battle (¶492–499)

**¶492 (halted case):** Colonel first has the column **take distances** (cross-ref
Article IX, Part Third — converts half-distance to full-distance spacing),
then forms into line exactly as Article II ¶464 ff. **No new mechanic** — this
is a compose-then-reuse case: `takeDistances()` + Article II's deploy.

**¶493 (marching case) — "by the rear of column":**
> 1. By the rear of column left (or right) into line, wheel.
> 2. MARCH (or double quick—MARCH).

This is a genuinely different mechanic from ¶492: instead of first opening
distances, the column deploys company-by-company **while still at half
distance**, starting from the **rear** (8th/last company) and working forward,
each company timing its own wheel to fit into the gap.

**Sequence (right-in-front, 8-company column):**
- First command (¶494): right general guide moves rapidly to front, positions
  himself just beyond where the column head will rest, on the guide-line.
  **Captain of the 8th (rearmost) company** commands `Left into line, wheel`;
  other captains caution their companies to keep marching straight ahead.
- Command MARCH, repeated by 8th company's captain (¶496): 8th company's guide
  halts short; company wheels left (wheeling-from-halt principles); captain
  halts it near the line and aligns by the left. **Other companies press
  briskly onward** along the column's flank. When the **7th company's**
  captain judges there's enough gap between his company and the 8th to fit,
  HE commands `Left into line, wheel—MARCH` for his own company — same
  wheel/halt/align-left mechanic. Remaining companies conform successively,
  each judging its own gap and self-triggering.
- Alignment rule (¶497): each captain aligns his company on the **left
  front-rank man of the company next on his right** — i.e., deployment
  proceeds rear-to-front but each new company dresses onto the one already in
  line to its right, same chaining logic as Article II.
- Officer supervision (¶498): lieutenant-colonel watches the leading (i.e.,
  first-deploying = rearmost/8th) guide track the line accurately, directing
  off the right general guide. **Senior major**, initially posted behind the
  8th company's left guide, moves down the line assuring each subsequent
  guide as the previous one is established. **Junior major** stays abreast of
  the color company.

**Complexity note:** This is the battalion's first "successive formation" —
each company's wheel-timing is a decision made by that company's own
captain reacting to the gap ahead of him, not a single synchronized command.
For animation, this means a company-by-company staggered keyframe sequence
(company 8 wheels first and settles, then company 7 triggers off the visible
gap, etc.) rather than the simultaneous-wheel pattern of Article II. Directing
company here is the **rearmost** (8th), the reverse of Article II's directing
**first** company — worth flagging since "which company anchors" flips
between sub-cases and needs to be a per-drill parameter, not a hardcoded
assumption.

### 2nd. Column at half distance, on the right (or on the left), into line of battle (¶500–529)

**Commands** (¶502): first the lieutenant-colonel plants two markers (¶500–501:
point d'appui for the right front-rank man of the leading company, and a
second marking where one of the three left files of that company will rest —
both set so the leading company "presents the right shoulder to the
battalion when formed," i.e., this is a 90°-turn deployment, not a wheel).
Then colonel commands:
> 1. On the right into line. 2. Battalion, guide right.

This is fundamentally different geometry from ¶464/¶493: companies do NOT
wheel into line — they **turn 90° (right turn) individually** and march up to
snap into place one at a time, like peeling cars off a train onto parallel
tracks.

**Sequence:**
- Second command (¶503): right becomes directing flank; leading company's
  right guide marches straight forward to the turning point; each following
  guide marches in the trace of the one ahead (i.e., queued single-file
  tracking, not simultaneous).
- Leading company (¶505–508): captain commands `1. Right turn` as company
  nears first marker, then `2. MARCH` exactly at the marker. Company turns
  right (a 90° facing turn, not a wheel); when 3 paces from final position,
  captain commands `1. First company. 2. HALT.`; files not yet in line form
  promptly; left guide retires as file closer; captain commands
  `3. Right—DRESS`; company aligns on the two markers (front-rank man opposite
  each marker rests breast on its right arm). **"These rules are general for
  all successive formations"** (¶508).
- Second company (¶509–513): continues straight forward; upon reaching the
  left flank of the now-placed first company, turns right the same way, marches
  to 3 paces from the line, is halted by its captain beside the left man of
  the company ahead, left guide places itself off the two markers used by the
  **previous** company (not the original markers — each company's guide
  references the company immediately to its left-already-in-line), then
  `Right—DRESS`.
- Chain continues company by company (¶514) until all placed; colonel then
  commands `Guides—POSTS` (markers before the right company retire) (¶515).
- Double-quick variant (¶516): colonel may add `Double quick—MARCH` if column
  was marching in quick time.
- Left-in-front mirror (¶521–522): same principles, captains initially align
  from the left then shift to proper flank per ¶474.

**Officer choreography (¶519–520):** Colonel follows the formation along the
front, always opposite the company currently turning, to correct
early/late-turn errors in real time. Lieutenant-colonel establishes himself
beyond where each next company's turning point will be, in succession,
assuring each guide's direction before falling back to assure the next —
described as "general rule for all successive formations."

**Remarks on right/left-into-line (¶523–529):**
- ¶523: the line of battle must be staked so each company's guide has **at
  least 10 steps** after turning to reach the line — a minimum-clearance
  constraint worth encoding as a validation note even if not rendered.
  Complexity/geometry constraint, not just narrative.
- ¶524: early drills use a line parallel to the column's line of march; later,
  oblique lines are used to train the battalion to form in any direction.
  (Oblique-angle deployment — flagged as a later-priority variant, not core.)
  ¶525 covers the oblique-angle procedure in detail: colonel gives the leading
  company's guide a new point of direction so its march is parallel to the
  final line before it reaches the turning point, and each following company
  repeats on the same ground — ensuring every guide has roughly the same
  number of paces to the line after turning.
- ¶526: captain must not command DRESS until the lieutenant-colonel has
  assured his guide's direction — general rule.
- ¶527: each captain orders `support arms` the instant the captain ahead of
  him commands FRONT — general rule, cosmetic (weapon carry), not core to
  geometry, but flag for completeness in commands metadata.
- ¶528–529: fire-by-file mechanics triggered during successive formation
  (each company opens fire once established and the next company fronts) —
  **out of scope** (manual-of-arms/firing mechanics, matches project's
  existing "manual of arms out of scope" decision), noted only.

### 3rd. Column at half distance, forward, into line of battle (¶530)

One paragraph: colonel first closes the column in mass, then deploys it on the
leading subdivision. This is purely a cross-reference forward to **Article
IV's** deployment-from-mass mechanic — no independent mechanic of its own.
Not a separate drill; should be modeled as "close to mass" (Part Third) +
Article IV's forward deployment.

### 4th. Column at half distance, faced to the rear, into line of battle (¶531–554)

**Commands** (¶531, halted case):
> 1. Into line, faced to the rear. 2. Battalion, right—FACE.
> 3. MARCH (or double quick—MARCH).

Forms a line facing the **opposite** direction from the column's march,
placing the column's rear-facing line where the head of the column stood.

**Sequence (halted, right-in-front):**
- First command (¶532): leading company's captain faces it right, marches it,
  wheeling **by file to the left** (a file-wheel/column turn, not a
  company-front wheel), directing it to **pass in rear of the left marker**
  of the line; once the first file is 3 paces past the line, the company
  wheels by file left again to place itself in rear of the two markers;
  captain halts, faces front, aligns by the right against the markers. This
  is a "loop around and drop into place facing backward" maneuver — distinct
  geometry from every prior sub-case (double file-wheel, not a company wheel
  or 90° turn).
- Second command (¶534): all other companies face right, captains beside their
  right guides.
- March command (¶536–537): companies move; the **left guide of the (2nd)
  company nearest the line** hastens ahead to mark the line per the
  successive-formation convention, showing his captain where to cross the
  line by 3 paces before file-wheeling left and running parallel to it.
  Captain commands `1. Second company. 2. HALT. 3. FRONT. 4. Right—DRESS.`
  (first command given 4 paces out; ¶538–541); files close right if gaps
  open on FRONT (¶540).
- Chain continues (¶542) for remaining companies, left guides detaching 12–15
  paces early to precede their company onto the line (or, in double-quick,
  ALL left guides detach simultaneously at the start and run to their
  positions — ¶542 last sentence, a notable exception to the strictly
  sequential rule elsewhere).
- Colonel commands `Guides—POSTS` when done (¶544).
- Left-in-front mirror (¶546): same principles, inverse means.

**Marching-column variant (¶547–554):** If the column is already in march and
arrives near the line:
> 1. Into line, faced to the rear. 2. Battalion, by the right flank.
> 3. MARCH (or double quick—MARCH).
First command triggers companies (and skirmisher platoon columns, ¶550,
out of scope) to caution facing right; march command has companies face
right, then first company file-wheels left twice (around the marker, past the
line, back to it) exactly as the halted case; rest of movement as previously
explained (¶551). Applies equally to left-in-front and to column-by-division
(¶553). ¶554 stresses each subdivision's chief must cross the line **a little
in rear of his own guide** (who's already faced to the formation's basis) —
timing nuance for the animation's per-subdivision offset.

**Complexity note:** The faced-to-rear sub-case introduces a **double
file-wheel loop** (wheel by file left, pass the line, wheel by file left
again) not present anywhere in Articles II or III's first two sub-cases —
this is closer to a "countermarch"-style maneuver than a simple line-forming
wheel and will likely need its own geometry primitive (or reuse of a Part
Third countermarch primitive, if one exists — cross-check when Part Third is
speced).

---

## Article IV — Deployment of columns closed in mass (¶555–647)

**Overview (¶555):** A column in mass may form line of battle three ways:
1. Faced to the front, by the deployment.
2. Faced to the rear, by the countermarch and the deployment.
3. Faced to the right/left, by a flank change of direction and the
   deployment.

This Article is built around **divisions** (pairs of companies) as the unit of
deployment, not single companies — Casey's own worked example uses a
4-division (8-company) column, matching the project's default 8-company
battalion model exactly.

### Common staging (¶556–557)

Lieutenant-colonel plants two markers on the target line: first at the
colonel's indicated point, second "a little less than the front of a
division" from the first. Deployments always occur on lines **parallel** and
**perpendicular** to the line of battle: if the column's head is near the
line, colonel first squares the column's direction perpendicular to the line
(cross-ref ¶291 ff., ¶366 ff. — Part Third change-of-direction mechanics, not
chased here); if marching, directs it to arrive exactly behind the markers
perpendicular to the line, halted at 3 paces off.

### Deploy on the FIRST division, halted (¶558–579)

**Commands** (¶559):
> 1. On the first division, deploy column. 2. Battalion, left—FACE.
> 3. MARCH (or double quick—MARCH).

Before commanding: colonel sends the **left general guide** to a point beyond
where the left of the deployed battalion will rest, on the prolongation of
the markers set before the first division (¶558).

**Sequence:**
- First command (¶560): chief of 1st division cautions it to stand fast; the
  other three division chiefs remind their divisions they'll face left.
- Second command (¶562): the **three rearward divisions face left**; each
  chief posts himself by his division's left guide; the junior captain posts
  by the covering sergeant of the left company (who steps into the front
  rank). Simultaneously (¶563) lieutenant-colonel places a **third marker** on
  the alignment of the first two, opposite one of the three left files of the
  1st division's right company, then moves to a point beyond where the 2nd
  division's left will rest.
- March command (¶565–567): 1st division's chief goes to its right and
  commands `Right—DRESS`; division dresses against the markers (chief and
  junior captain each align on the left); then `FRONT`.
- The three faced-left divisions march off in a column-by-the-flank motion,
  parallel to the line, division 2's left guide directing the pace, guides of
  divisions 3 & 4 keeping abreast of division 2's guide, each preserving its
  prescribed column interval (¶568).
- **2nd division** (¶569–572): its chief does NOT march with it — he lets it
  file past him, and when its right guide draws abreast, commands
  `1. Second division. 2. HALT. 3. FRONT.` (first command ~7-8 paces out).
  On FRONT, files close right if gapped; left guides of both companies in the
  division step onto the line, face right, align on the markers set before
  the 1st division. Chief then places himself on the line left of the 1st
  division and, once guides are assured, commands `Right—DRESS` — division
  aligns by the right exactly as division 1.
- **3rd & 4th divisions** (¶573–576): continue marching past the halted 2nd;
  3rd division's chief halts in his own person opposite the 2nd's guide (once
  2nd has fronted/closed), watches his own division file past, then at
  `1. Third division. 2. HALT. 3. FRONT.` As soon as fronted, chief moves 2
  paces before its centre and commands `1. Third division, forward. 2. Guide
  right. 3. MARCH.` — division marches toward the line, guide tracking the
  left man of division 2, halted and aligned right at 3 paces off. 4th
  division's chief conforms identically, one division-length further back.
- Colonel commands `Guides—POSTS` when deployment complete (¶578); guides
  resume line-of-battle posts, markers retire (¶579).

**Directing division:** the **1st division is the anchor/pivot** here — it
alone stands fast (does not face or march) while divisions 2–4 peel off to
its left successively, each aligning off the division already placed to its
right. This matches Article II's "first company is anchor" pattern, scaled to
divisions.

### Deploy on the first division, MARCHING column, no halt (¶580–590)

**Commands** (¶580):
> 1. On the first division, deploy column. 2. Battalion, by the left flank.
> 3. MARCH (or double quick—MARCH).

Same roles as the halted case but the 1st division, instead of standing fast,
is itself halted-and-aligned exactly when it reaches 3 paces from the markers
(¶583) rather than starting already stopped; divisions 2–4 face left instead
of "will have to face left" and use `by the right flank—MARCH. Guide—RIGHT`
to re-enter line (¶583, ¶584). Officers: lieutenant-colonel assures guides per
¶520; senior major follows abreast of the 4th division; junior major abreast
of the 3rd (¶585).

**Continuing march without halting at all (¶586–590):** No markers posted.
1st division's chief commands `1. Guide right. 2. Quick time`; at colonel's
MARCH, 1st division marches in quick time taking the touch of elbows right,
captain on the battalion's right takes ground points to assure direction
(dead reckoning without staked markers). 2nd division files past its chief,
who then commands `1. Second division by the right flank. 2. MARCH. 3. Guide
right`, and once aligned with division 1, resumes quick time. Divisions 3–4
follow the same pattern as division 2 (¶587). Colonel finally commands `Guide
centre` — color-bearer and right general guide move rapidly 6 paces ahead of
the line, colonel assures the color's direction; officers and right companies
conform to line-of-battle march principles (forward cross-ref ¶648, Part
Fifth Art. I) as they arrive on line; if in double-quick, colonel may resume
double-quick once the last company is up (¶589). **General supervisory rule**
(¶590, marked general for ALL deployments): colonel watches throughout that
divisions aren't halted too soon or late, correcting faults promptly to
prevent them propagating down the chain.

### Deploy on the REARMOST (e.g., 4th) division (¶591–610)

Mirror image of the first-division case, with **right** and **left** swapped
throughout, and the sense of travel reversed (rear division stands fast /
gets aligned near the target position; the front divisions march past and
peel off).

**Commands, halted** (¶592):
> 1. On the fourth (or such) division, deploy column. 2. Battalion, right—FACE.

Right general guide (not left) marks the point beyond where the **right** of
the deployed battalion rests (¶591). First three divisions face **right**
(¶595); third marker placed between the first two, opposite one of the three
right files of the division's left company (¶596, mirrors ¶563). At MARCH
(¶599), first three divisions march, first division's guide passing 3 paces
within the marked line; **3rd division's chief lets it file past**, halts it
level with himself, fronts it, closes gaps left (mirrors division-2 handling
in the first-division case, but here it's the division ADJACENT to the
anchor that gets this special "let it pass me" treatment since deployment
proceeds away from the anchor).
**4th division (the anchor)**: chief, once he sees it "nearly unmasked" by the
other three peeling away, commands `1. Fourth division, forward. 2. Guide
left. 3. MARCH.`; approaches to 3 paces off the line, chief halts it and
commands `Left—DRESS` (dressing direction mirrored: left instead of right)
(¶600–602).
**3rd division**, once unmasked, approaches and halts the same way (¶603);
its right guide + left company's covering sergeant step onto the line to mark
off the 4th division's markers (¶604). **2nd and 1st divisions**, having kept
marching, are halted and aligned by the **left** in turn, same chaining
pattern (¶605). Colonel `Guides—POSTS` to close (¶607–608); lieutenant-colonel
assures guides per ¶520; senior major abreast of 4th, junior major abreast of
3rd (¶609).

**Marching variant, deploy on rearmost, no halt** (¶610–620): commands:
> 1. On the fourth division, deploy column. 2. Battalion, by the right flank.
> 3. MARCH (or double quick—MARCH).
Same role assignments; 4th division's chief commands HALT while first three
face right and track parallel to the line (¶613); 3rd division's chief lets
it file past then halts/fronts it; 4th division moves forward on `Guide left`
once nearly unmasked, halted and aligned left at 3 paces (¶613–614); 1st/2nd
divisions conform to ¶605's pattern (¶615).
**Continuous-march sub-variant** (¶617–618): no markers; 4th division moves
forward in quick time and **keeps marching** (not halted) taking touch of
elbows left; 3rd division, once unmasked, moves in double-quick until level
with 4th then drops to quick time and dresses left until `Guide centre` is
given; 1st/2nd conform likewise. **¶620, general rule:** the movement need not
be entirely complete before the colonel halts the battalion — once the
already-formed part reaches the line, colonel halts the battalion and the
still-marching divisions simply complete their own approach. (Important for
animation: keyframes for different divisions can complete on different
"beats"; the drill's "final" state isn't a single simultaneous halt.)

### Deploy on an INTERIOR division (¶621–631) — flagged as novel geometry

**Commands** (¶621, halted):
> 1. On such division, deploy column. 2. Battalion outward—FACE.
> 3. MARCH (or double quick—MARCH).

**This is the genuinely new case for the engine.** Unlike deploying on the
front or rear division (where every non-anchor division faces the SAME way
and travels the SAME direction along the column), deploying on an interior
division splits the column: divisions on one side of the anchor face and
travel one way, divisions on the other side face and travel the opposite way,
**simultaneously**, both peeling outward from the anchor in the middle.

**Sequence (¶622–630):**
- Whether right or left is in front, divisions that (in the eventual line)
  belong to the **right of the directing division** face right; the rest
  (except the directing division itself) face left. So the split is
  determined by each division's *destination* side of the anchor in the final
  line, not by front/rear position in the column per se — need to map
  column-order to final-line-order to know which way each division faces (this
  mapping is itself a small piece of logic the engine needs, likely already
  solved by whatever function tracks "company order in column" vs "company
  order in line" from Part Second's break-into-column work).
- Divisions **in front of** the directing division deploy using the
  rearmost-division mechanics (¶593 ff. — face right, peel/halt/dress left);
  divisions **in rear of** it deploy using the first-division mechanics (¶560
  ff. — face left, peel/halt/dress right). **Both groups execute
  concurrently**, converging on the anchor from both directions.
- The **directing (interior) division itself**: the instant it's unmasked
  (i.e., once at least the immediately adjacent divisions have started
  peeling away), it approaches the line taking the guide **left or right**
  according to whether right or left is in front of the whole column (¶623) —
  note this guide-side choice is about the COLUMN's lead flank, an independent
  variable from the two-way split above. Its chief aligns it by the directing
  flank, then steps back to give room for the next chief to align the next
  division — same "step back and yield" chaining seen in the front/rear
  cases, but now happening in **two directions from the middle** rather than
  one direction from an end.
- Officers (¶625): lieutenant-colonel assures guides of divisions that (in the
  final line) fall to the right of the directing division; senior major
  assures the other (left-side) guides; junior major stays abreast of the 3rd
  division (a fixed reference post regardless of which division is
  "directing" — worth double-checking this doesn't silently break if the 3rd
  division itself is the directing one).
- Marching variant (¶626–630):
  > 1. On such division, deploy column. 2. Battalion, by the right and left flanks.
  > 3. MARCH (or double quick—MARCH).
  Divisions ahead of the anchor deploy per ¶611 ff. (rearmost-division
  marching mechanics); divisions behind it per ¶581 ff. (first-division
  marching mechanics) — again concurrently, from both directions. The
  directing division, once unmasked, conforms to the 4th-division marching
  procedure at ¶613.
- ¶631: left-in-front columns deploy on an interior division by the same
  principles, inverse means (mirror the whole left/right assignment).

**Complexity flag (explicit, per task instructions):** this bidirectional,
simultaneous, anchor-in-the-middle deployment has **no analog anywhere in the
existing Company-scale engine** (`formations.js`'s `wheel`/`columnOfPlatoons`
functions all operate on a single pivot with one direction of travel). It also
has no analog even within Article IV's own front/rear-division cases, both of
which are unidirectional peels from one end. Implementing this will need:
1. A way to classify each division as "ahead of anchor" or "behind anchor" in
   final-line order (not column order) and assign facing direction
   accordingly.
2. Two concurrent peel sequences (mirrored L/R versions of the existing
   front-division and rear-division deploy functions) running in the same
   keyframe set, timed so both sides "unmask" and converge on the anchor
   division without the animation implying one side waits for the other
   (¶622's "the divisions... will deploy" reads as simultaneous, not
   sequential-then-sequential).
3. The anchor/directing division's own placement logic, which is a third,
   independent behavior (guide left-or-right per column's lead flank) layered
   on top of the two peel directions.
Recommend prototyping this as its own small helper (e.g.
`deployInteriorDivision()`) built by composing two calls to
mirror-parameterized front/rear deploy helpers, rather than a bespoke
implementation — but the composition itself (running both concurrently,
resolving anchor placement) is new work, not a trivial reuse.

### Remarks on the deployment of columns closed in mass (¶632–638)

General principles, likely encoded as engine invariants/validation rather than
their own keyframes:
- ¶632: all divisions deploy **rectangularly** (i.e., 90°, marching straight
  and then facing/dressing — no oblique wheeling), march off abreast of each
  other, and preserve their column distances toward the line until they peel.
- ¶633: each division, once unmasked, marches toward the line and aligns on
  the flank **next to the directing division**; the directing division itself
  aligns on the flank next to the point d'appui (front/rear cases) or on
  whichever flank was the column's direction-flank (interior case).
- ¶634: chiefs ensure marching-by-the-flank principles are followed; any file
  gaps (expected only on broken ground) are closed **toward the directing
  flank** once fronted.
- ¶635: a chief giving HALT or the by-flank command too early/late forces his
  division to oblique to correct — and propagates error to the next
  subdivision. (Failure-mode note, not a nominal-path animation need.)
- ¶636: divisions deploying by the left flank are marked by each company's
  **left** guide; those deploying by the right flank, by the **right** guide.

**¶637–638 — mass-column shortcuts:** A column by company closed in mass can
be formed left/right into line the same way as a half-distance column
(¶494 ff. — the "by the rear of column" successive mechanic) — i.e., re-use,
not a new mechanic. It can also be formed on the right/left into line as a
half-distance column (¶500 ff.), with the added care that guides must not
shorten their step when turning (since there's no half-distance gap to
absorb a slowdown when closed in mass) — a step-timing nuance, not new
geometry. Rear-faced-line formation from mass is possible too, but the guide
must move at double-quick or a run (again, timing-only difference).

### Remarks on inversions (¶639–647)

Ties back to Article II's "by inversion" mechanic (¶484 ff.) and generalizes
it:
- ¶639–640: inversions give the promptest means of forming line of battle;
  applicable to right/left-into-line direct formations (already covered) and
  to successive formations too.
- ¶641: inverted formations follow the same principles as direct-order ones,
  but the colonel's **first command word is always "by inversion."** (Pure
  command-text/metadata concern — the underlying geometry function is shared
  with the non-inverted case, parameterized by a boolean.)
- ¶642–646: covers the REVERSE transition — ploying an inverted line back into
  column (breaking/ploying by company or division). If the column is to have
  a particular company/division in front, colonel's second command must say
  "left in front" when the line was formed by inversion (because inversion
  put that subdivision physically on the left) (¶644). Chiefs whose
  subdivisions land in front of the directing one conduct it to a halt; those
  landing behind halt in person and let their subdivision file past, aligning
  by the right (¶645); mirror numbering/guide-side logic if the LAST
  subdivision is to be in front instead (¶646). This is **Part Second**
  territory (breaking line into column) revisited through the inversion lens
  — cross-reference only, not implemented here.
- ¶647 (skirmisher note, out of scope): companies of skirmishers occupy
  positions in rear of the first/last battalion companies per ¶489 when line
  is formed by inversion; platoon columns re-established on the proper
  reverse flank when column re-forms from an inverted line.

---

## Cross-references noted but not chased

- S.C. No. 244, No. 262, No. 265, No. 266 (Company-level wheel-from-halt /
  platoon-column wheeling — already implemented in `formIntoLine.js` and
  related Lesson V drills; Article II explicitly builds on these).
- Article IX, Part Third (taking distances) — needed for ¶492's half-distance
  case; Part Third spec should define `takeDistances()`.
- ¶291 ff., ¶366 ff. (Part Third, changing column direction) — needed to
  square a marching column perpendicular to the line before deploying
  (¶557).
- ¶489 (Article II's skirmisher-inversion paragraph) — re-cited at ¶647.
- Forward cross-ref to ¶648 ff. (Part Fifth, Art. I, "march in line of
  battle") — several sub-cases here (¶480, ¶488, ¶589, ¶619) hand off to
  Part Fifth's line-marching principles once the line is formed and moving;
  Part Fifth spec should read back to confirm exactly what's expected here.
- Part Second (breaking line into column by company/division/ploying) —
  needed for ¶642–646's reverse-transition-by-inversion material.

---

## Complexity summary for engine design

1. **Simultaneous wheel-into-line** (Article II, full-distance): every
   company wheels at once, on its own pivot, chained alignment right-to-left
   (or left-to-right if left-in-front) — direct scale-up of the existing
   Company `formIntoLine` pattern to N companies, each an independent pivot.
2. **"By the rear of column" successive wheel** (Article III §1, marching):
   companies wheel one at a time, **starting from the rear**, each triggered
   by its own captain judging the gap ahead — needs staggered,
   captain-self-triggered keyframe timing, directing company is the LAST, not
   first.
3. **90°-turn peel formation** (Article III §2): companies don't wheel at all
   — they turn 90° and march up individually to snap into a queued position,
   chained off the company immediately to their inside. Minimum-clearance
   constraint (10 steps after turning, ¶523).
4. **Faced-to-rear double file-wheel** (Article III §4): a loop-around
   maneuver (file-wheel left, pass the line, file-wheel left again) not seen
   elsewhere in Parts II–III — may need a new primitive or reuse of a Part
   Third countermarch primitive (check when speccing Part Third).
5. **Division-based deploy from mass, front or rear anchor** (Article IV):
   same peel-and-chain logic as #2/#3 but at division (2-company) granularity,
   with a distinct "stand fast" vs. "let it pass me" role split between the
   anchor and its immediate neighbor.
6. **Division-based deploy from mass, INTERIOR anchor** (Article IV, ¶621–631)
   — flagged as the hardest case in this entire Part: two concurrent,
   mirror-image peel sequences running in opposite directions from a
   middle anchor division, plus the anchor's own independent guide-side
   placement rule. No existing engine function (Company-scale or elsewhere in
   this Part) does simultaneous bidirectional peeling — this needs new design
   work, not just parameterization of an existing function, though it can
   likely be built by composing two mirrored copies of the front/rear-anchor
   deploy helpers (#5) running concurrently.
7. **Per-company/division gait variation** (¶491, ¶587, ¶617–620): successive
   formations may have different subdivisions in quick vs. double-quick time
   at the same moment, and the battalion can be halted before every
   subdivision has finished forming (¶620) — the animation's keyframe model
   needs to tolerate per-subdivision completion times within one drill "step,"
   not just one global duration per keyframe.
