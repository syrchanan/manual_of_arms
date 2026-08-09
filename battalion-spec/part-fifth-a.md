# Part Fifth (a) — Articles I–V: Marching and Aligning in Line of Battle

Source: `casey_v2_full_extract.txt`, lines 3487–3989, ¶648–743 (continuous Vol. II
paragraph numbering). `PART FIFTH` heading at line 3487; `ARTICLE VI` heading
(a different topic, out of this spec's range) at line 3989.

**Article boundary correction:** the task's estimated range was ¶648–751
(Article V ending ¶751). The text does not support that — Article V ("To
march in retreat, in line of battle") runs **¶730–743** only; ¶744 begins
Article VI ("To halt the battalion, marching in retreat, and to face it to
the front"), a distinct topic not covered by this spec. Confirmed by grep for
`ARTICLE` headings: `ARTICLE V.` at line 3919, `ARTICLE VI.` at line 3989.

| Article | Title | Lines | Paragraphs |
|---|---|---|---|
| I | To advance in line of battle (+ Remarks) | 3491–3702 | ¶648–678, Remarks ¶679–685 |
| II | Oblique march in line of battle (+ Remarks) | 3704–3761 | ¶686–695, Remarks ¶696–698 |
| III | To halt the battalion marching in line of battle, and to align it | 3762–3856 | ¶699–716 |
| IV | Change of direction in marching in line of battle | 3857–3918 | ¶717–729 |
| V | To march in retreat, in line of battle | 3919–3988 | ¶730–743 |

Skirmisher-specific paragraphs (prefixed `0-` in the source extraction:
0-654, 0-660, 0-716, 0-729, 0-741) describe how attached companies of
skirmishers conform to each maneuver. Noted under each article but **out of
scope for animation** per project convention — flagged, not chased.

---

## Roster gap — applies to ALL five articles below (read this first)

Every article in this Part is built around a cast of individuals that
**does not yet exist in `src/data/battalion.js`**:

- **Color-bearer** — carries the color-lance; sets step/direction for the
  whole battalion during the advance (¶659) and retreat (¶738).
- **Color-guard, 3 corporals** — flank the color-bearer in the front rank
  during the march (¶662); one of them ("centre corporal") is himself a
  secondary alignment reference for both wings (¶664, ¶720, ¶728).
- **Two general guides** (right and left) — march abreast of the color-rank
  during the advance/retreat (¶661, ¶736) and are individually staked/dressed
  during Article III's general-alignment sequence (¶704–715).
- **Covering sergeants (battalion-level use)** — already exist per-company in
  `company.js` (`nc-cov`), but Article V's retreat choreography (¶736) gives
  them a specific new battalion-wide post: "the line of file closers."

`battalion.js` currently only models `FIELD_AND_STAFF` (colonel, lt-col,
senior/junior major) plus the 8 companies' own per-company rosters. None of
Part First–Fourth's implemented drills needed a color-bearer/color-guard/
general-guide concept (those Parts are column/deployment mechanics; Part
Fifth is the first place the color-guard becomes load-bearing). **This must
be designed and added to the data model before any Article I–V drill can be
built** — likely as new `FIELD_AND_STAFF`-style entries, or a dedicated
`COLOR_GUARD` export, pressed from the color-company's own roster (mirroring
the existing "press an existing NCO into a named duty" convention already
used for `leftSergeantId()` in Part First Art. I, and for the company-scale
"directing sergeant" convention in `marchInLine.js`). Casey does not fix
which of the color-company's own soldiers become the 3 color-guard corporals
or which company's NCOs become the 2 general guides — this is an
implementation judgment call for whoever builds Article I, not specified by
the source text within this range.

Also note: "directing" in this Part modifies the **battalion**, not a
company or division. ¶648 — "the battalion being correctly aligned, and
**supposed to be the directing one**" — means this battalion is the
reference/base unit for a larger line (e.g. a brigade of several
battalions), which is why markers get planted behind it (¶650) and why
¶678/¶740 both carve out a simpler "subordinate battalion" case (no markers,
color-bearer just steers by his own ground points). This is a different
"directing" concept from Part Fourth's "directing division/company" (the
anchor company/division that stands fast during a deployment) — don't
conflate the two uses of the word when reading further into Part Fifth.

---

## Article I — To advance in line of battle (¶648–685)

### Commands (¶652, ¶658)

> 1. Battalion, forward.
> 2. MARCH (or double quick—MARCH).

Mid-march correction command (¶670):

> Point of direction to the right (or left).

Recall-to-step command (¶684):

> To the — STEP.

### Sequence of actions

**Before the command is given — staking the line (¶648–651):**
- ¶648: battalion is halted, correctly aligned, and *supposed to be the
  directing (reference) battalion*. Colonel gives the lieutenant-colonel an
  intimation of his purpose, then places himself **about 40 paces in rear of
  the color-file**, facing front.
- ¶649: lieutenant-colonel places himself the **same distance (40 paces) in
  front** of the same file, faces the colonel, who establishes him
  **perpendicular to the line of battle, opposite the color-bearer**, by
  sword signal. Colonel then sights a point of direction beyond, in the
  prolongation of those two points (color-bearer and lieutenant-colonel), if
  a distinct landmark is visible.
- ¶650: colonel moves **20 paces farther to the rear** (of his original
  40-pace post) and establishes **two markers** on the prolongation of the
  line through the color-bearer and lieutenant-colonel. Markers face to the
  rear; first placed **about 25 paces behind the rear rank**, second **the
  same distance (25 paces) behind the first**.
- ¶651: the color-bearer, the moment the lieutenant-colonel is established on
  the perpendicular, takes **two points on the ground** in the straight line
  running from himself between the lieutenant-colonel's heels; the first
  point is **15–20 paces** from the color-bearer.

**Preparatory command — "Battalion, forward" (¶652–657):**
- ¶653: front rank of the color-guard advances **6 paces to the front**;
  corporals in the rear rank move into the front rank, replaced in turn by
  corporals from the file-closer rank; the two general guides move forward,
  abreast with the color-bearer — right guide opposite the captain of the
  right company, left guide opposite the sergeant closing the left of the
  battalion.
- 0-654 (skirmishers, out of scope): captain and covering sergeant of each
  skirmisher company post per ¶482; each commands "Such company of
  skirmishers, forward."
- ¶655: captains of the **left wing** shift, passing before the front rank,
  to the **left** of their respective companies; the sergeant on the left of
  the battalion steps back into the rear rank; the covering sergeant of the
  company next left of the color-company steps into the front rank.
- ¶656: lieutenant-colonel, having assured the color-bearer on the line
  between himself and the corporal of the color-file (now in the front
  rank), goes to the position given at ¶665 (12–15 paces right of the
  captain of the color-company).
- ¶657: senior major places himself **6–8 paces** on either flank of the
  color-rank. Junior major holds the position prescribed at "No. 35, Title
  I" — an internal Vol. II cross-reference (Title I = field-officer posts on
  parade), not chased in this spec.

**Execution command — "MARCH" (¶658–668):**
- ¶659: battalion steps off with life. Color-bearer, charged with step and
  direction, marches on the prolongation of his two points, taking new ones
  by the same means as in School of the Company; the corporals on his right
  and left match his step without turning head or shoulders; color-bearer
  supports the color-lance against his hip.
- 0-660 (skirmishers, out of scope): skirmisher companies slip off, taking
  guides per ¶482.
- ¶661: the two general guides march in the same step as the color-rank,
  each staying abreast (or nearly so) with it, not concerning themselves
  with the other guide's movement.
- ¶662: the 3 color-guard corporals (now in the front rank) march elbow to
  elbow, heads direct to front; the **centre corporal** follows exactly in
  the color-bearer's trace, holding his step regardless of exact distance
  from the color-rank, unless the colonel or lieutenant-colonel intimates a
  correction.
- ¶663: the covering sergeant in the front rank (between the color-company
  and the company next left) marches elbow to elbow and on line with the 3
  centre corporals.
- ¶664: **the captains of the color-company and the company next left,
  together with the 3 centre corporals, form the alignment basis for BOTH
  wings of the battalion** — same step as the color-bearer, shoulders square,
  heads front, only occasionally glancing at the centre corporals; if
  ahead/behind, shorten/lengthen step almost insensibly to regain alignment
  over several paces, without giving abrupt checks to the wings beyond.
- ¶665: **lieutenant-colonel, placed 12–15 paces on the right of the captain
  of the color-company**, keeps that captain and the next one beyond abreast
  with the 3 centre corporals, cautioning them to lengthen/shorten step.
- ¶666: all other captains hold themselves on the prolongation of this
  basis, glancing toward the centre with minimal neck turn.
- ¶667: captains watch their own companies, keep men from getting ahead of
  the captains' line; avoid over-correcting small faults (risks worse
  faults — loss of calm, silence, equal step).
- ¶668: men keep heads front, feel the elbow lightly toward the centre,
  resist flank pressure, keep shoulders square, stay very slightly behind
  the captains' line (so as never to block the captains' view of the
  alignment basis); glance periodically at the color-rank or their wing's
  general guide to match step.

**During the march — the marker relay and mid-march correction (¶669–678):**
- ¶669: the marker line is continuously extended as the battalion advances —
  a **third marker** is placed behind the first; the second marker then
  leapfrogs to the same distance behind the third; the first, in turn,
  leapfrogs behind the second; and so on for as long as the battalion
  advances. Each marker faces to the rear when shifting and covers the two
  already-established markers. A staff officer or quartermaster-sergeant
  designated for the purpose holds himself **15–20 paces** facing the marker
  farthest from the battalion, cautions each marker when to shift, and
  assures him on the direction.
- ¶670: colonel habitually holds himself **about 30 paces in rear of the
  centre** of the battalion — NOT on the line of markers. If he perceives
  (by the battalion's slant, or by the indications of ¶680ff.) that the
  color-bearer's march is not perpendicular, he commands "Point of direction
  to the right (or left)."
- ¶671: at this, the senior major hastens **30–40 paces in advance** of the
  color-rank, halts, faces the colonel, and takes the direction the colonel
  indicates by sword signal. The centre corporal, on the colonel's caution,
  directs himself upon the senior major by advancing the opposite shoulder;
  the corporals on his right and left conform.
- ¶672: the color-bearer also directs himself upon the senior major
  (advancing the opposite shoulder); the senior major causes him to incline
  right or left until he exactly covers the centre corporal's file; the
  color-bearer then takes new points on the ground.
- ¶673: the two general guides conform to the new direction of the
  color-rank.
- ¶674: the officer in charge of the markers re-establishes them promptly on
  the new direction, using the color-bearer and the centre corporal as the
  new basis; the colonel verifies the new marker direction.
- ¶675: lieutenant-colonel (from his ¶665 post) ensures the two centre
  companies, then successively all the others, conform to the new centre
  direction without haste or disorder, maintaining the alignment basis
  perpendicular to the color-bearer's new line.
- ¶676: lieutenant-colonel frequently checks both wings; if captains neglect
  the alignment basis, he recalls them: "Captain of (such) company," or
  "captains of (such) companies, on the line" — without over-correcting
  small faults.
- ¶677: the senior major, on the flank of the color-rank, periodically
  places himself **20 paces in front** of that rank, faces to the rear, and
  positions himself on the prolongation of the markers behind the centre, to
  verify the color-bearer's exact march on that line; he rectifies the
  color-bearer's direction if necessary, and the color-bearer immediately
  takes two new points between himself and the major.
- ¶678: all these principles apply equally whether this battalion is
  directing or subordinate — **except that a subordinate battalion has no
  markers placed behind its centre** (it has no line to maintain for others;
  see also ¶740 for the mirrored retreat case).

### Remarks on the advance in line of battle (¶679–685)

- ¶679: if officers/sergeants/corporals/men were not well drilled in
  position-under-arms and step length/cadence beforehand, the march in line
  will be "floating, unsteady, and disunited."
- ¶680: if the color-bearer marches obliquely instead of perpendicularly,
  the battalion "will slant" — crowding in one wing, openings in the other,
  worsening toward the centre in proportion to the deviation.
- ¶681: it is therefore of the greatest importance that the color-bearer
  direct himself perpendicularly, and that the alignment basis always stay
  perpendicular to his line.
- ¶682: openings, crowding, or disorder should be corrected as promptly as
  possible, but calmly, with few words and little noise.
- ¶683: the general guides' purpose is to show the flank companies the
  centre's step, and to ease re-establishing the wings on the centre's
  direction if they fall behind — hence guides must match the color-rank's
  step and stay abreast of it, glancing at it periodically.
- ¶684: if the battalion loses the step, the colonel recalls it: "To the —
  STEP"; captains and companies glance at the color-rank or a general guide
  and conform.
- ¶685: it is of the utmost importance to habituate the battalion to execute
  the ¶670ff. direction-rectifying movements with both order and
  promptness; battalion commanders must train their own eye ("coup d'œil")
  to judge precise direction for their battalions.

### Start/end state

**Start:** battalion halted, correctly aligned in line of battle, supposed
to be the directing (reference) battalion. **End:** battalion continuously
marching in a straight line (with optional mid-march direction correction
loop). Article I contains **no halt** — halting is Article III's subject.

### Distances/measurements

- 40 paces — colonel behind color-file (¶648) / lieutenant-colonel in front
  of it (¶649).
- 20 paces — colonel moves farther to the rear before placing markers
  (¶650), i.e. ~60 paces total behind the color-file at that moment (a
  one-time staking position, not his marching post).
- 25 paces — first marker behind the rear rank; 25 paces — second marker
  behind the first (¶650).
- 15–20 paces — color-bearer's first ground point (¶651).
- 6 paces — color-guard front rank's advance at the preparatory command
  (¶653).
- 6–8 paces — senior major's flank position by the color-rank (¶657).
- 12–15 paces — lieutenant-colonel's post, right of the color-company
  captain (¶665).
- 15–20 paces — staff officer/QM sergeant's post relative to the rearmost
  marker (¶669).
- ~30 paces — colonel's habitual marching post, rear of the centre (¶670).
- 30–40 paces — senior major's advance position when rectifying direction
  (¶671).
- 20 paces — senior major's periodic check-position in front of the
  color-rank (¶677).

### Cross-references noted but not chased

- ¶482 (skirmisher company posting) — out of scope.
- "No. 35, Title I" — junior major's parade post; internal Vol. II Title I
  reference, not School-of-Company; not chased.
- ¶665, ¶650, ¶670 — self-references within this same article.
- Forward references from later articles: ¶704 (Art. III), ¶722 (Art. IV).

### Complexity notes — FLAG: substantial new choreography, not a simple generalization

This is **not** a straightforward scale-up of `lesson-iii/marchInLine.js`
(where a single "directing sergeant" 6 paces ahead sets the pace). At
battalion scale, Article I introduces several mechanics with no
company-scale analog at all:

1. **Two-tier alignment basis.** The color-bearer + 3 centre corporals are
   the primary basis for *both* wings; the color-company captain + next
   captain are a secondary basis the lieutenant-colonel personally
   supervises; every other captain dresses off that secondary basis. This is
   a chained, multi-level dressing structure, not a single reference point.
2. **The marker relay (¶669).** A continuously-advancing 3-marker leapfrog
   chain behind the battalion, supervised by a dedicated staff
   officer/QM-sergeant, is unlike anything in Parts First–Fourth (which use
   markers as one-time staking, not a moving reference during the march
   itself).
3. **Mid-march direction correction (¶670–677).** An entire secondary
   command-and-response sequence ("Point of direction to the right/left")
   that repositions the senior major, re-references the centre corporal and
   color-bearer, and re-stakes the markers — effectively a nested
   sub-maneuver that can occur at any point during the march. This is
   optional/conditional and probably belongs as an alternate keyframe branch
   or a second sub-drill, not baked into the base march sequence.
4. **Data model dependency.** All of the above requires the color-bearer,
   3-corporal color-guard, and 2 general-guide roles to exist in
   `battalion.js` first (see "Roster gap" above) — currently they do not.

Recommend splitting Article I into (a) a core "advance in line" drill
covering ¶648–668 (staking, forward, march, steady-state alignment basis)
and (b) an optional "rectify direction on the march" drill covering
¶669–677 (marker relay + point-of-direction correction), rather than one
drill trying to depict everything.

---

## Article II — Oblique march in line of battle (¶686–698)

### Commands

Oblique (¶686):
> 1. Right (or left) oblique.
> 2. MARCH (or double quick—MARCH).

Resume direct march (¶693):
> 1. Forward.
> 2. MARCH.

### Sequence of actions

- ¶686: battalion marching in line; colonel wishes to oblique; commands as
  above.
- ¶687: at the **first** command, the senior major places himself **in
  front of, and faced to, the color-bearer**.
- ¶688: at MARCH, the whole battalion takes the oblique step; companies and
  captains strictly follow the principles already established in the
  **School of the Company** (cross-reference, not re-derived here — reuses
  the per-company oblique mechanics already implemented as
  `lesson-iii/obliqueMarch.js`).
- ¶689: the first command is briskly repeated by the captains of the
  skirmisher companies (out of scope); at MARCH they step off per the
  same School-of-Company principles.
- ¶690: the senior major (in front of the color-bearer) keeps him in line
  with the centre corporal, so the color-bearer obliques neither more nor
  less than that corporal; he watches that both follow parallel directions
  and the same step length.
- ¶691: the lieutenant-colonel ensures the captains and the 3 centre
  corporals stay exactly on a line, following parallel directions.
- ¶692: the colonel ensures the battalion preserves its parallelism,
  preventing files from opening or crowding; if crowding, he causes the
  files on the flank the battalion obliques toward to open out.
- ¶693: colonel, wishing the direct march resumed, commands "1. Forward. 2.
  MARCH."
- ¶694: at MARCH, the battalion resumes direct march. The senior major
  places himself **30 paces in front** of the color-bearer, faces the
  colonel, who establishes him by sword signal on the direction the
  color-bearer should pursue; the color-bearer immediately takes **two new
  points** on the ground between himself and the senior major.
- ¶695: in resuming direct march, care is taken that the men do not close
  the intervals between files all at once — it is done "almost
  insensibly."

### Remarks on the oblique march (¶696–698)

- ¶696: the object of the oblique step is to gain ground right or left while
  preserving the original direction of the line of battle.
- ¶697: essential that the centre corporals and captains follow parallel
  directions and maintain the same relative height/alignment, or they give
  the battalion a false direction.
- ¶698: colonel and lieutenant-colonel must prevent files from crowding —
  without this precaution the oblique march cannot be executed with
  facility.

### Start/end state

**Start:** battalion already marching in line (continues Article I's
steady-state march). **End:** direct march resumed on laterally-shifted
ground, same original direction as before the oblique.

### Distances/measurements

- 30 paces — senior major's position in front of the color-bearer when
  resuming direct march (¶694). No fixed pace count is given for the
  oblique leg itself — its geometry (angle, step) is delegated wholesale to
  the School of the Company's oblique-march principles (¶688).

### Cross-references noted but not chased

- "School of the company" oblique-march principles (¶688, ¶689) — already
  implemented at company scale as `lesson-iii/obliqueMarch.js`, using the
  `oblique()` formation primitive.

### Complexity notes

**Mostly a straightforward generalization.** The actual oblique mechanic —
each soldier half-facing and marching diagonally — is delegated by the
source text itself to the already-implemented School-of-Company oblique
principles; at battalion scale this becomes "run the existing per-company
oblique on all 8 companies simultaneously" (analogous to how `battalionLine`
calls per-company `lineOfBattle` at a stride offset). The **only new**
battalion-level element is the senior major's supervisory position: in
front of/facing the color-bearer during the oblique (¶687, ¶690), and again
30 paces in front when direct march resumes (¶694) — a single extra
annotation point layered on top of the reused per-company oblique, not a new
geometric primitive. Depends on the color-bearer/centre-corporal roster
additions flagged under Article I.

---

## Article III — To halt the battalion marching in line of battle, and to align it (¶699–716)

### Commands (in sequence of use)

Simple halt (¶699):
> 1. Battalion. 2. HALT.

Restore color/guides to line posts (¶700):
> Color and general guides—POSTS.

Simple rectify (¶702):
> Captains, rectify the alignment.

General alignment sequence (¶705, ¶708, ¶711):
> 1. Guides—ON THE LINE.
> 2. On the centre—DRESS.
> 3. Color and guides—POSTS.

Bring color/general guides onto the line first, if not already there
(¶714):
> 1. Color and general guides—ON THE LINE.

### Sequence of actions

- ¶699: battalion marching in line; colonel wishes to halt; commands "1.
  Battalion. 2. HALT."
- ¶700: at the second command the battalion halts; the color-rank and
  general guides **remain in front** (not automatically restored). If the
  colonel does not intend to immediately resume the advance or give a
  general alignment, he commands "Color and general guides—POSTS."
- ¶701: at that command, the color-rank and general guides retake their
  places in the line of battle; captains in the left wing shift back to the
  **right** of their companies (restoring habitual halted posts).
- ¶702: if the colonel judges the alignment needs rectifying (not a full
  realignment), he commands "Captains, rectify the alignment."
- ¶703: captains cast an eye toward the centre, align themselves accurately
  on the alignment basis (which the lieutenant-colonel ensures is well
  directed), then promptly dress their own companies. The lieutenant-colonel
  admonishes any captain not accurately aligned: "Captains of (such)
  company," or "captains of (such) companies, move up or fall back."
- ¶704: **but** if the colonel instead wants to give the battalion a general
  alignment (parallel or oblique) rather than a simple rectify, he moves
  some paces outside one of the general guides (text supposes the right),
  cautions the right general guide and the color-bearer to face him, and
  establishes them by sword signal on the desired direction. Once correctly
  set, the left general guide places himself on their direction, assured by
  the senior major. The color-bearer carries the color-lance perpendicular
  between his eyes; the two corporals of his rank return to their front-rank
  places the moment he faces the colonel.
- ¶705: dispositions made, colonel commands "1. Guides—ON THE LINE."
- ¶706: at this, the **right guide of each company in the right wing**, and
  the **left guide of each company in the left wing**, each places himself
  on the direction of the color-bearer and the two general guides, faces the
  color-bearer, positions himself in rear of the guide next before him at a
  distance equal to **the front of his own company**, and aligns himself on
  the color-bearer and the general guide beyond — a chained guide-placement
  across all 8 companies.
- ¶707: captains in the right wing shift to the **left** of their companies
  (except the color-company captain, who stays on its right but steps into
  the rear rank); captains in the left wing shift to the **right** of their
  companies.
- ¶708: lieutenant-colonel rectifies the right wing's guide positions if
  needed; senior major does the same for the left wing's. Then colonel
  commands "2. On the centre—DRESS."
- ¶709: at this, the companies move up in quick time against their guides;
  on arrival, each captain aligns his own company by prescribed principles;
  the lieutenant-colonel aligns the color-company.
- ¶710: if the alignment is oblique, captains take care to conform their
  companies to it while conducting them toward the line.
- ¶711: battalion aligned; colonel commands "3. Color and guides—POSTS."
- ¶712: at this, the color-bearer, general and company guides, and the
  right-wing captains take their places in the line of battle; the
  color-bearer replaces the color-lance's heel against his right hip.
- ¶713: if the new line direction leaves one or more companies **in advance**
  of it, the colonel — before establishing the general guides on the line —
  causes such companies to move to the rear, either by the back step or by
  facing about first, whichever requires less ground to be re-crossed.
- ¶714: when the colonel wants a general alignment but the color and general
  guides are **not already on the line**, he first commands "1. Color and
  general guides—ON THE LINE."
- ¶715: at this, the color-bearer and general guides place themselves on the
  line, per ¶704's principles.
- 0-716 (skirmishers, out of scope): skirmisher companies conform their
  movements to the first and last battalion companies during alignments,
  preserving their relative positions.

### Start/end state

**Start:** battalion marching in line (continues Article I/II). **End:**
battalion halted and aligned — either simply rectified (¶702–703), or given
a full new general/oblique alignment (¶704–715) — with color-rank and
guides restored to their line-of-battle posts.

### Distances/measurements

No new fixed pace counts beyond ¶706's structural rule (guide spacing =
"the front of his company," a proportional distance, not a fixed figure).

### Cross-references noted but not chased

None external — ¶704's alignment procedure is referenced forward from
Article IV (¶728) and is itself self-contained.

### Complexity notes — FLAG: significantly more elaborate than the company-scale halt/align

The simple halt-and-rectify path (¶699–703) **is** a straightforward
generalization of `lesson-iii/haltAndAlign.js`: each of the 8 captains
independently eyeballs and corrects his own company, lieutenant-colonel
supervises. Build this first — it's low-risk.

The **general-alignment path (¶704–715)** is a materially bigger piece of
work: it is effectively a full battalion-wide "form on a staked line"
operation — two general guides plus 16 company guides (one per company, on
the wing-appropriate flank) chain-position themselves along a projected
line, then all 8 companies march up in quick time and dress against their
own guide, each captain aligning independently. This has real structural
kinship to the guide-posting/chained-dress choreography already built for
Part Fourth's deployments (see `battalion-spec/part-fourth.md`'s
`postColumnChiefsAndGuides`-style patterns) and likely can reuse some of
that machinery, but it is not a trivial application of `battalionLine()` —
a new "dress companies up to a pre-marked line of individual guides"
primitive is probably needed if Part Fourth's existing helpers don't already
cover it exactly. ¶713's "move to rear by back step, or about-face+march,
whichever is shorter" conditional is a small new branch not seen elsewhere
in this Part.

---

## Article IV — Change of direction in marching in line of battle (¶717–729)

### Commands

Change direction (¶717):
> 1. Change direction to the right. 2. MARCH (or double quick—MARCH).

Resume direct march (¶726):
> 1. Forward. 2. MARCH.

### Sequence of actions

- ¶717: battalion marching in line; colonel wishes to change direction
  right; commands as above.
- ¶718: at MARCH, movement begins; the color-rank shortens its step to
  **14–17 inches** and directs itself circularly to the right, insensibly
  advancing the left shoulder. The senior major places himself **before the
  color-bearer, facing him**, and directs his march so he describes an arc
  neither too large nor too small; also ensures the color-bearer takes
  14–17 inch steps per the current gait.
- ¶719: the **right general guide wheels on the right captain of the
  battalion as his pivot** (i.e., the right-flank captain is the fixed
  pivot point); the **left general guide** marches circularly at a
  **28 or 33 inch step** (per gait) and aligns himself on the color-bearer
  and the right general guide.
- ¶720: the corporal placed in the **centre** of the battalion takes 14–17
  inch steps and wheels right by insensibly advancing his left shoulder; the
  battalion conforms to the centre's movement. The color-company captain
  and the next-left captain attentively regulate their march and shoulder
  direction on the 3 centre corporals — the same alignment-basis mechanic
  as Article I's ¶664. All other captains regulate their shoulder direction
  and step length on this same basis.
- ¶721: men redouble their attention not to pass the line of captains.
- ¶722: in the **left wing**, the pace **lengthens** in proportion to each
  file's distance from the centre; the captain of the 8th (leftmost) company
  takes 28 or 33 inch steps per gait.
- ¶723: in the **right wing**, the pace **shortens** in proportion to
  distance from the centre; the captain closing the right flank only slowly
  turns in his person, yielding ground a little if pushed. (Right wing is
  the near-stationary pivot side; left wing sweeps the widest arc, since the
  change of direction is to the right.)
- ¶724: colonel takes great care that the centre of the battalion does not
  describe too great or too small an arc, so the wings can conform; ensures
  captains keep their companies aligned on the centre (no opening/crowding);
  corrects faults quietly.
- ¶725: lieutenant-colonel, placed **before the battalion**, attends to the
  same objects.
- ¶726: when the colonel wants the direct march resumed, he commands "1.
  Forward. 2. MARCH."
- ¶727: at MARCH, color-rank, general guides, and battalion resume direct
  march. The senior major immediately places himself **30–40 paces in
  front**, faces the colonel (placed in rear of the centre), who establishes
  him by sword signal on the perpendicular direction the **centre corporal**
  should pursue; the senior major causes the color-bearer to incline
  right/left as needed to be exactly opposite his file; the color-bearer
  takes two new ground points between himself and the major.
- ¶728: the lieutenant-colonel gives the color-company and next-left company
  a direction perpendicular to the centre corporal's line; all other
  companies conform to that basis without haste.
- 0-729 (skirmishers, out of scope): skirmisher companies execute ¶722's
  pace-lengthening principle during the change of direction.

### Start/end state

**Start:** battalion marching in line, straight direction (continues
Article I/II/III). **End:** battalion marching in the new (rotated)
direction — this is a wheeling pivot executed *while marching*, not a
halt-then-turn; it is not necessarily a full 90° turn (angle is whatever
the colonel's terrain/tactical need dictates; the mechanics describe the
wheel process itself, not a fixed target angle).

### Distances/measurements

- 14–17 inches — shortened step for the color-rank / centre corporal /
  pivot-side troops (gait-dependent: this matches the standard
  quick-time/double-quick-time short-step convention already used
  elsewhere in the project).
- 28 or 33 inches — lengthened step for the left general guide and the 8th
  company's captain (standard full quick-time/double-quick-time pace —
  matches `SCALE.PACE_PX`'s 28-inch quick-time pace convention already in
  the engine).
- 30–40 paces — senior major's position in front when resuming direct march
  (¶727).

### Cross-references noted but not chased

None external within this range.

### Complexity notes

This is the battalion-scale generalization of School of the Company's
"change direction while marching" (not itself in this spec's range, but
the company-scale precedent implies the same graduated-step wheel
mechanic). The core geometry — pivot-side shortens step, sweep-side
lengthens step in proportion to distance from centre, describing an arc —
is the same wheel-while-marching principle the battalion engine already
has some form of (per `TODO-battalion-plan.md`'s note that
`wheel()` is reused at the block level). **Likely buildable as:** existing
`wheel()`-style geometry applied per company at graduated radii from the
centre, **plus** Article I's color-guard/centre-corporal alignment-basis
machinery layered on top (¶720 explicitly re-invokes the exact ¶664
mechanic). Not a wholly new primitive, but it **does depend on** Article
I's color-guard/general-guide roster additions being designed first — this
article cannot be built independently of Article I's data-model work.

---

## Article V — To march in retreat, in line of battle (¶730–743)

### Commands (single numbered sequence, spread across the article)

> 1. Face to the rear. 2. Battalion, about—FACE.
> 3. Battalion, forward.
> 4. MARCH (or double quick—MARCH).

### Sequence of actions

- ¶730: battalion halted; colonel wishes to march in retreat; commands "1.
  Face to the rear. 2. Battalion, about—FACE."
- ¶731: at the **first** command, the color-rank and general guides, if in
  advance, take their places in line. At the **second** command the
  battalion faces about: the color-bearer passes into the **rear rank (now
  leading)**; the corporal of his file steps behind the corporal next on his
  own right to let the color-bearer pass, then steps into the **front rank
  (now rear)** to re-form the color-file; the colonel places himself behind
  the front rank (now become the rear); the lieutenant-colonel and senior
  major place themselves before the rear rank (now leading).
- ¶732: at the second command, skirmisher companies face about with the
  battalion (out of scope).
- ¶733: colonel takes post **40 paces behind** the color-file, to assure the
  lieutenant-colonel on the perpendicular; the lieutenant-colonel places
  himself the **same distance (40 paces) in front**, exactly as prescribed
  for the advance in line (mirrors ¶648–649).
- ¶734: if this is the **directing** battalion, the colonel establishes
  markers exactly per ¶650's manner, **except they face toward the
  battalion** (not away, since the direction of march has reversed). If
  markers are already established (from before the about-face), the officer
  in charge causes them to face about the moment the battalion faces about,
  and the marker **nearest the battalion** hastens to the rear of the two
  others (re-establishing the leapfrog chain in the new direction of
  travel).
- ¶735: dispositions made, colonel commands "3. Battalion, forward."
  (continuing the numbered command sequence begun at ¶730).
- ¶736: at this (preparatory), the color-bearer advances **6 paces beyond
  the rank of file closers**, accompanied by the 2 corporals of his guard
  from that rank (the centre corporal steps back to let him pass); the
  corporal of the color-file, in the front rank (now rear), **replaces the
  color-bearer** in that rank the instant he steps out; the two file closers
  nearest this centre corporal unite on him, behind the color-guard, to
  serve as the alignment basis for the line of file closers; the two general
  guides place themselves abreast with the color-rank; the covering
  sergeants place themselves in the line of file closers; the captains move
  into the rear rank (now leading); captains in the left wing (now become
  the right) shift to the **left** of their companies if not already there.
- ¶737: colonel commands "4. MARCH (or double quick—MARCH)."
- ¶738: the battalion marches in retreat on the **same principles** that
  govern the advance in line; the centre corporal behind the color-bearer
  marches exactly in his trace.
- ¶739: if the directing battalion, the color-bearer directs himself on the
  markers, which of their own accord each place themselves in succession
  behind the marker most distant as the battalion approaches (the leapfrog
  relay continues); the officer in charge of the markers carefully assures
  them on the direction.
- ¶740: if this is a **subordinate** battalion, the color-bearer maintains
  himself on the perpendicular by ground points alone (mirrors ¶678).
- 0-741 (skirmishers, out of scope): at the 4th command, skirmisher
  companies march to the rear, retaining their relative positions to the
  first/last battalion companies.
- ¶742: the colonel, lieutenant-colonel, senior major, and junior major each
  discharge the **same functions as in the advance in line** — i.e., all of
  Article I's officer choreography (¶656–657, ¶665, ¶670–677) applies here
  too, mirrored for the retreat direction.
- ¶743: the lieutenant-colonel, placed **outside the file closers of the
  color-company**, also maintains the 3 file closers of the alignment basis
  square with the line of direction; the other file closers keep themselves
  aligned on this basis.

### Start/end state

**Start:** battalion halted in line of battle, facing front. **End:**
battalion marching in retreat (i.e., toward what was its rear), with the
color-bearer, corporals, captains, and guides all repositioned into their
reversed roles — front rank/rear rank and captain/covering-sergeant swap
places, matching the swap pattern already implemented at company scale in
`lesson-iii/marchInRetreat.js`, but applied to the full Article I cast
(color-bearer, 3 corporals, 2 general guides, lieutenant-colonel, both
majors, marker relay) rather than just 2 roles (captain/covering sergeant).

### Distances/measurements

- 40 paces — colonel behind the color-file / lieutenant-colonel in front of
  it (¶733) — identical to Article I's ¶648–649 figures.
- 6 paces — color-bearer's advance beyond the rank of file closers (¶736).
  Note this is a **different** role/figure than company-scale
  `marchInRetreat.js`'s `SERGEANT_ADVANCE_PX` (a directing sergeant, not the
  color-bearer) — do not reuse that constant's semantics directly.
- All other distances (guide/marker spacing, senior major's positions, etc.)
  are inherited unchanged from Article I via ¶738 ("same principles") and
  ¶742 ("same functions") — no new figures are introduced for those roles.

### Cross-references noted but not chased

- ¶648–649 (mirrored explicitly at ¶733).
- ¶650 (mirrored explicitly at ¶734, "except that they will face to the
  battalion").
- ¶656–657, ¶665, ¶670–677 (Article I's full officer/marker choreography,
  incorporated wholesale by ¶742's "same functions" clause).
- ¶678 (mirrored at ¶740, subordinate-battalion no-markers case).

### Complexity notes

**Structurally a direct mirror of Article I**, the same relationship
`marchInRetreat.js` already has to `marchInLine.js` at company scale — but
scaled up to the *entire* Article I cast rather than just 2 roles. This
means Article V inherits every complexity flag raised for Article I (color-
guard/general-guide roster gap, the marker relay, the point-of-direction
mid-march correction) with no reduction, **plus** two pieces of genuinely
new bookkeeping unique to the about-face transition itself:
1. ¶731's rank-swap choreography (color-bearer passes to the rear rank now
   leading; his file's corporal re-forms the color-file) — a specific,
   ordered sequence of individual repositions at the about-face instant, not
   a simple `aboutFace()` in-place rotation of the whole formation.
2. ¶736's "who becomes the alignment basis for the file-closer line" logic
   (color-guard corporal + 2 nearest file closers) — a retreat-specific
   basis-designation not present in Article I at all.

Geometrically, no new wheel/peel primitive is needed — `aboutFace()` and
`translate()` (both already used in `marchInRetreat.js`) remain sufficient
building blocks. The complexity here is entirely in correctly sequencing
which individual moves to which post and when, for a much larger cast than
the company-scale version, not in new geometry. **Should be built after**
Article I is implemented and its color-guard/general-guide data model
exists, since Article V reuses that model wholesale rather than defining
its own.

---

## Cross-references noted but not chased (summary, all articles)

- ¶482 (skirmisher company posting mechanics) — out of scope, recurs at
  0-654/0-660/0-716/0-729/0-741.
- "No. 35, Title I" (junior major's parade post) — internal Vol. II Title I
  reference, not School-of-Company; not chased.
- Forward/backward references are almost entirely self-contained within
  this Part (¶704↔¶728, ¶648–650↔¶733–734, ¶664↔¶720/¶728, ¶670↔¶680).

## Complexity summary for engine design

1. **Color-guard/general-guide data model** — must be designed and added to
   `battalion.js` (or a new module) before *any* drill in this Part can be
   built; every article depends on it. Casey does not fix which soldiers
   fill these roles at 8-company scale — an implementation judgment call.
2. **Article I's marker relay + mid-march direction correction** (¶669–677)
   — a genuinely new mechanic (continuously-moving marker chain; a nested
   "point of direction" sub-maneuver) with no analog in Parts First–Fourth
   or at company scale. Recommend splitting into a base drill (¶648–668)
   plus an optional correction drill (¶669–677).
3. **Article II (oblique)** and **Article IV (change of direction)** — both
   are largely straightforward generalizations of existing per-company/
   per-block mechanics (`oblique()`, `wheel()`) plus one or two additional
   supervisory-officer annotation points; both depend on the color-guard
   model from #1 but need no new geometric primitive.
4. **Article III's general-alignment sequence** (¶704–715) — a full
   "chain-post individual company guides on a staked line, then dress every
   company up to its own guide" operation; likely partially reusable from
   Part Fourth's deployment guide-posting patterns, but probably needs a new
   "dress to pre-marked line" primitive of its own. The simple
   halt-and-rectify path (¶699–703) is a trivial per-company generalization
   and should be built/shipped independently and first.
5. **Article V** — structurally inherits all of Article I's complexity
   (same cast, same marker relay, same mid-march correction option) via the
   source text's own "same principles"/"same functions" clauses, plus two
   small pieces of retreat-specific individual-repositioning bookkeeping at
   the about-face instant (¶731, ¶736). No new geometric primitive beyond
   `aboutFace()`/`translate()`, already proven at company scale.
