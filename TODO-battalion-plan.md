# School of the Battalion — Implementation Plan

Source: `caseys-v2.pdf` (Casey's *Infantry Tactics*, Vol. II, 1862), extracted to
`casey_v2_full_extract.txt`. Title V, "School of the Battalion," continuous
paragraph numbering ¶1–1218+ (Article XVI runs past ¶1218 to the end of Title V).
Public domain (1862 U.S. Army manual).

Decisions below were confirmed with the user on 2026-07-10.

---

## Scope decision: Part First is split

**Article I (¶27–34, opening and closing ranks) IS in scope.** This is a real
battalion-wide formation change, not a static drill: the entire rear rank plus
file closers across all 8 companies step back four paces in unison, the
covering sergeants (1st sergeants) step out to mark the new alignment, and the
lieutenant colonel/major take supervisory posts to dress the line — the exact
review/inspection choreography reenactors know from practice (1st sergeants
called out to check readiness before taking the field). Casey's text (¶27–33)
gives the opening in full; closing (¶34) is deferred by cross-reference to
"S.C. No. 28" — but that reference is into School of the Company Lessons I–II,
which are **not present** in `casey_lessons_3to6.txt` (that extraction starts at
Lesson III, ¶84). Since ¶27–33 already fully describe the opening mechanics,
closing can be implemented as the documented mirror (rear rank returns to its
normal depth) with the gap flagged in code, rather than blocking on sourcing
Lessons I–II. **Do this drill early in Phase B1** — it's short, self-contained,
and a good first real drill to prove the company-block renderer against (whole
companies' rear ranks shifting depth together, not wheeling/marching).

**Articles II–III (¶35–41, manual of arms; loadings and firings) remain out of
scope** — these are a static nine-command list and individual musket/volley
mechanics with no formation geometry, functionally identical to the excluded
School of the Soldier content.

The intro material ¶1–26 (battalion formation ceremony, color escort, honors) is
administrative/ceremonial, not maneuver drill — likely a short reference note on
the About/overview page rather than an animated drill, not a priority.

## Architecture decisions

### Rendering: company blocks with rank/file toggle
A battalion (8 companies × 47 = 376 individuals) is too dense for the current
per-soldier rendering to stay legible. New rendering mode for battalion-scale
drills:
- **Block view (default)**: each company renders as a labeled rectangle showing
  two bands (front rank / rear rank), not 47 individual soldiers. This is what's
  visible during column marches, wheels, ployments, line formation — the moments
  where the *company* is the unit of maneuver.
- **Expanded/file view**: when a company is marching by the flank (doubled into
  files) or undoubling, that company's block expands to show its individual
  files (mirroring the existing `columnOfFiles`/`doubleFiles` per-soldier
  rendering), while other companies remain blocks. This directly serves Part
  Fifth's flank-march and change-of-front content, and any moment Casey singles
  out one company's file-level mechanics.
- Officers/guides/color-bearer are rendered as small marks on the block (already
  have officer/NCO/color-bearer color tokens in `constants.js`) rather than full
  individual figures at battalion scale.

This needs a new engine module (tentatively `BattalionRenderer.js`, parallel to
`SoldierRenderer.js`) and a new formation-function layer that operates on
company-blocks instead of individual soldiers (see Data model below). Company
zoom/detail views can reuse the existing per-soldier engine unmodified.

### Company count: 8
Casey's own worked examples in Vol. II most often use 8 companies (color company
+ 7 others) — the "even division" case the manual walks its wheeling/ploying math
through step by step. Default battalion model: 8 companies, each internally
identical to the existing 20-file/47-soldier company (reusing `company.js`'s
model unmodified per company).

### Data model
New `src/data/battalion.js`: an array of 8 company instances (reusing
`DEFAULT_COMPANY` per company, or a lighter per-company summary object for block
rendering — { id, colorCompany: bool, captainId, coveringSgtId, ... } — exact
shape TBD during Phase B1 spike). Need a company-level roster analog to
`company.js`'s soldier roster: colonel, lieutenant colonel, major(s), adjutant,
sergeant major, color-bearer + color guard, posted per Title V's own intro
material (¶2, ¶4, and field-officer posts referenced throughout Parts
Second–Fifth).

New `src/engine/battalionFormations.js` (parallel to `formations.js`): functions
operating on company-blocks —
- `battalionLine(companies, { origin, facing })` — analog of `lineOfBattle`
- `columnOfCompanies(companies, { origin, facing, distance })` — analog of
  `columnOfPlatoons`, generalized to N companies
- `ployColumn(...)` — closing a line into column (Part Second)
- `deployColumn(...)` — the reverse (Part Fourth)
- battalion-level `wheel()` likely reuses the existing soldier-level `wheel()`
  applied to block corner-points, extended with pivot/step-length distinctions
  already proven correct in Lesson V's wheel work
- Square formation geometry (Part Fifth Art. XIV) is new: four fronts, corner
  handling — deferred to Phase B3, will need its own design pass once we're
  there and have read all of ¶999–1211 closely.

### Navigation
New top-level nav branch "School of the Battalion" parallel to "School of the
Company," grouped by **Part** (mirroring how Lessons group Articles today).
`src/data/navigation.js` and the drill registry both need a battalion-scoped
extension (`src/data/drills/part-ii/`, etc., or `lesson-vii..xi`-style naming —
naming convention TBD, should probably say "Part" not "Lesson" to match Casey's
own structure and avoid confusion with School of Company's Lessons).

---

## Phased implementation (confirmed order: column mechanics first, squares last)

### Phase B1 — Column mechanics (Part First Art. I + Parts Second–Fourth, ¶27–34 + ¶77–647)
Direct battalion-scale analog of School of Company Lessons V–VI; reuses the most
existing engine concepts (wheel, column, chiefs/guides posting).
- Part First, Art. I (¶27–34): open/close ranks — do this one first, it's short,
  self-contained, and a good proving ground for the company-block renderer
  (whole-rank depth change, no wheeling) before tackling column mechanics
- Part Second (¶77–215): break line→column by company/division; ploy into close
  column
- Part Third (¶216–462): march in column (full/half distance/mass), route step,
  change direction (3 variants by distance), halt, close to half-distance/mass,
  countermarch, take distances, form divisions from column
- Part Fourth (¶463–647): column→line deployments — full distance, half
  distance, closed-in-mass, forward/rear-faced variants, successive formations

This phase is also where the company-block renderer and battalion formation
engine get built and proven out, since Parts Second–Fourth are the most
column/block-centric content (least likely to need per-soldier file detail).

### Phase B2 — Line of battle movements (Part Fifth Art. I–XI, ¶648–828)
Direct analog of School of Company Lessons III–IV, at battalion scale:
advance, oblique march, halt and align, change direction, march in retreat, halt
in retreat, change direction in retreat, passage of obstacles, passage of a
defile in retreat, march by the flank, form by file into line.
This is where the file-expanded block view gets exercised (Art. X march by the
flank, Art. XI form by file).

### Phase B3 — Advanced formations (Part Fifth Art. XII–XVI, ¶830–1218+)
Hardest, most novel content — no existing engine analog:
- Art. XII (¶830–872): change of front, perpendicular forward and to the rear
- Art. XIII (¶874–982): ploy into column doubled on the centre; division
  columns; double column; deployments of same
- Art. XIV (¶999–1211): square formations — many variants (from column at half/
  full distance, from line, in four ranks, oblique squares, against cavalry)
- Art. XV (¶1212–1217): the rally
- Art. XVI (¶1218–end): rules for maneuvering by the rear rank

---

## Immediate next steps (not yet started)
1. Read Parts Second–Fourth in full (audit-style, like the Company re-audit) to
   produce exact per-article keyframe specs before writing any code — same
   discipline as the Company work.
2. Spike the company-block rendering component + battalion data model shape
   against one simple drill (recommend: Part Second Art. I, "break by company to
   the right," since it's short and already partially read above) before
   committing the engine design.
3. Scaffold navigation/registry for the battalion branch.
