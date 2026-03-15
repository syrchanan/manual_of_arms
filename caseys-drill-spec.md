# Casey's Infantry Tactics — Interactive Drill Manual
## Project Specification v1.0

---

## 1. Project Overview

### 1.1 Purpose
An interactive, animated web reference for Casey's *Infantry Tactics* (1862), Vol. I — School of the Company. Each drill command is presented with precise SVG animations showing individual soldiers maneuvering through the prescribed movements. Intended for Civil War reenactors, living historians, and students of military history.

### 1.2 Hosting & Architecture
- **Static site** hosted on GitHub Pages
- **React** (Vite) with client-side routing (`react-router` with `HashRouter` for GH Pages compatibility)
- **D3.js** for soldier rendering and animation (d3-selection, d3-transition, d3-interpolate, d3-ease)
- **No backend** — all drill data is embedded as JSON/JS modules
- **Responsive** — desktop-first, usable on tablet, functional on mobile

### 1.3 Phasing
| Phase | Scope |
|-------|-------|
| **Phase 1** (this spec) | School of the Company, Lessons III–VI |
| Phase 2 | School of the Soldier (manual of arms, single-figure illustrations) |
| Phase 3 | School of the Battalion |

---

## 2. Visual Design

### 2.1 Aesthetic Direction: Clean, Modern, Readable
The priority is **clarity**. The drill content is inherently complex — formations, precise distances, simultaneous movements of 40+ individual soldiers. The UI must be minimal and calm so the user's attention goes entirely to understanding the drill. Think: a well-designed technical reference or interactive textbook.

**Guiding principles:**
- White space is generous; nothing feels cramped
- Navigation mirrors Casey's own structure (Title → Lesson → Article → specific drill)
- The animation canvas is the hero — large, central, uncluttered
- Text explanations sit alongside or below the animation, never competing with it
- Controls are simple and obvious: play, pause, step forward/back, speed

### 2.2 Color Palette
| Role | Token | Hex | Usage |
|------|-------|-----|-------|
| Background | `--bg` | `#FFFFFF` | Page background |
| Surface | `--surface` | `#F8F9FA` | Cards, sidebar, canvas surround |
| Border | `--border` | `#E2E4E8` | Dividers, card borders |
| Text primary | `--text-1` | `#1A1A1A` | Headings, body |
| Text secondary | `--text-2` | `#6B7280` | Captions, labels, secondary info |
| Accent | `--accent` | `#2563EB` | Links, active nav, play button, interactive elements |
| Accent hover | `--accent-hover` | `#1D4ED8` | Hover/focus states |
| Front rank | `--rank-front` | `#1E3A5F` | Front-rank soldier fill |
| Rear rank | `--rank-rear` | `#5A7DA8` | Rear-rank soldier fill (lighter, distinguishable) |
| Officer | `--officer` | `#B45309` | Captain, lieutenants |
| NCO | `--nco` | `#047857` | Sergeants (covering sgt, left guide, file closers) |
| Color bearer | `--colors` | `#DC2626` | Color-bearer and color guard |
| Field bg | `--field` | `#F1F5F0` | Animation canvas background (very subtle green-gray) |
| Grid | `--grid` | `#D6DBD4` | Pace markers, reference lines on field |

Dark mode is deferred but the CSS variable approach makes it trivial to add later.

### 2.3 Typography
- **Headings**: `"Source Serif 4"` (Google Fonts) — refined, highly legible serif with good weight range. Provides enough character to feel intentional without feeling antiquated.
- **Body / UI**: `"Inter"` (Google Fonts) — clean sans-serif, excellent for UI labels, controls, and explanatory text at small sizes.
- **Field labels / annotations**: `"JetBrains Mono"` (Google Fonts) — monospace for distance markers ("28 in.", "13 in.") and soldier ID labels on the canvas.

### 2.4 Layout Structure
```
┌─────────────────────────────────────────────────────┐
│  Top Nav Bar (sticky)                               │
│  [Logo/Title]  [School of Company ▾]  [About]       │
├──────────┬──────────────────────────────────────────┤
│ Sidebar  │  Main Content                            │
│          │                                          │
│ Lesson   │  ┌──────────────────────────────────┐    │
│ nav tree │  │                                  │    │
│          │  │     Animation Canvas (SVG)       │    │
│ L-III    │  │                                  │    │
│  ├ March │  │     ~700 x 500px viewBox         │    │
│  ├ Halt  │  │                                  │    │
│  ├ Obliq │  └──────────────────────────────────┘    │
│  └ Mark  │                                          │
│ L-IV     │  [|◀]  [▶ Play]  [▶|]   ●───○   [1x]   │
│  ├ Flank │                                          │
│  ├ Ch.Dir│  ── Casey's Text ─────────────────────   │
│  └ Form  │  Relevant paragraphs with active one     │
│ L-V      │  highlighted as animation progresses.    │
│  ├ Break │                                          │
│  ├ March │  ── Reenactor Notes ──────────────────   │
│  └ Form  │  Practical tips, common mistakes.        │
│ L-VI     │                                          │
│  ├ Break │                                          │
│  ├ Files │                                          │
│  └ Cntr  │                                          │
├──────────┴──────────────────────────────────────────┤
│  Footer: Source attribution, GitHub link             │
└─────────────────────────────────────────────────────┘
```

On tablet/mobile, the sidebar collapses to a hamburger menu or top dropdown.

---

## 3. The Company Model

### 3.1 Company Composition (Default: 20 Files)
Per Casey's Title I, a company in line of battle consists of:

**Personnel (47 individuals rendered):**

| Role | Count | Position per Casey | Visual marker |
|------|-------|--------------------|---------------|
| Captain | 1 | Right of company, front rank, touching with left elbow (¶20) | `--officer` fill, slightly larger |
| Covering Sergeant (1st Sgt) | 1 | Rear rank, covering the captain, right guide (¶21) | `--nco` fill |
| 1st Lieutenant | 1 | File closer, opposite centre of 4th section (¶23) | `--officer` fill |
| 2nd Lieutenant | 1 | File closer, opposite centre of 1st platoon (¶24) | `--officer` fill |
| 3rd Lieutenant | 1 | File closer, opposite centre of 2nd platoon (¶25) | `--officer` fill |
| 2nd Sergeant (Left Guide) | 1 | File closer, opposite 2nd file from left (¶26) | `--nco` fill |
| 3rd Sergeant | 1 | File closer, opposite 2nd file from right of 2nd platoon (¶27) | `--nco` fill |
| 4th Sergeant | 1 | File closer, opposite 2nd file from left of 1st platoon (¶28) | `--nco` fill |
| 5th Sergeant | 1 | File closer, opposite 2nd file from right of 1st platoon (¶29) | `--nco` fill |
| Front-rank privates | 19 | Left of captain to left of company (¶15) | `--rank-front` fill |
| Rear-rank privates | 20 | 13 inches behind front rank (¶17) | `--rank-rear` fill |

Total in ranks: 40 (20 front, 20 rear — captain counts as file 1 front, covering sgt as file 1 rear)
File closers: 7 (3 officers + 4 sergeants), 2 paces behind rear rank (¶22)
**Grand total: 47 rendered individuals**

### 3.2 Company Subdivisions
- **Platoons**: 1st platoon = files 1–10 (right half), 2nd platoon = files 11–20 (left half)
- **Sections**: Each platoon divided in half (4 sections of 5 files each)
- **Divisions**: Files 1–10 = 1st division (= 1st platoon in a 20-file company), files 11–20 = 2nd division
- **Comrades in battle**: Groups of 4 (odd + even file pairs), designated for mutual support (¶16)

### 3.3 Soldier Data Model
Each soldier is a JavaScript object:

```javascript
{
  id: "fr-07",              // Unique ID: rank-fileNumber
  role: "private",          // private | captain | lieutenant | sergeant | colorBearer
  rank: "front",            // front | rear | fileCloser
  file: 7,                  // File number (1-20, from right)
  platoon: 1,               // 1 or 2
  section: 2,               // 1-4
  x: 168,                   // Current x position (in SVG units)
  y: 100,                   // Current y position
  facing: 0,                // Rotation in degrees (0 = facing front/top of screen)
  label: "Pvt"              // Display label (optional, for legend mode)
}
```

### 3.4 Spatial Scale
Casey specifies distances in inches and paces (1 pace = 28 inches in common time, 33 inches in double quick).

For the SVG canvas, we need a consistent scale. Proposed mapping:

| Real-world | SVG units | Notes |
|------------|-----------|-------|
| 1 pace (28") | 14px | Balances readability with fitting a full company |
| Soldier width | 8px | Roughly shoulder-width at this scale |
| Soldier depth (front-to-back) | 6px | Rectangular, wider than tall viewed from above |
| Rank distance (13") | ~7px | Front-to-rear rank gap |
| File closer distance (2 paces) | 28px | Behind rear rank |
| Elbow-to-elbow interval | ~10px | Standard file interval in ranks |

These values will be defined as constants and can be tuned during development. The SVG viewBox will be large enough to show the full company plus room for maneuver — approximately `960 x 600` viewBox units.

A **scale bar** will be rendered on the canvas showing pace distances for reference.

---

## 4. Animation System

### 4.1 Architecture: State Snapshots + Transitions
Each drill movement is defined as an **ordered sequence of formation states** (keyframes). A formation state is a complete array of soldier positions:

```javascript
// A single keyframe
{
  label: "Company halted in line of battle",
  description: "The company is in line, guide right.",
  caseyRef: "S.C. ¶34–36",     // Casey's paragraph reference
  duration: 0,                   // ms to reach this state from previous (0 = initial)
  soldiers: [
    { id: "fr-01", x: 10, y: 100, facing: 0 },
    { id: "fr-02", x: 20, y: 100, facing: 0 },
    // ... all 47 soldiers
  ]
}

// A drill movement is a sequence of keyframes
{
  id: "sc-l3-march-line",
  title: "To March in Line of Battle",
  lesson: 3,
  article: 1,
  caseyParagraphs: [34, 35, 36, 37, 38],
  commands: [
    { text: "1. Company, forward.", type: "preparatory" },
    { text: "2. Guide right.", type: "preparatory" },
    { text: "3. MARCH.", type: "execution" }
  ],
  keyframes: [ /* ... */ ]
}
```

### 4.2 D3 Animation Engine
The animation engine is a React component wrapping a D3-managed SVG:

```
<DrillCanvas>
  ├── <svg> (D3-managed)
  │   ├── <g class="grid">          // Pace grid lines (optional toggle)
  │   ├── <g class="annotations">   // Direction arrows, distance labels
  │   ├── <g class="soldiers">      // The soldier rectangles
  │   │   ├── <rect id="fr-01" />
  │   │   ├── <rect id="fr-02" />
  │   │   └── ...
  │   └── <g class="labels">        // Role labels (toggle on/off)
  │
  └── Controls (React-managed, outside SVG)
      ├── Play / Pause
      ├── Step backward / forward (keyframe by keyframe)
      ├── Speed selector (0.5x, 1x, 2x)
      ├── Progress bar (scrub through keyframes)
      └── Toggles: labels, grid, file closers
```

**D3 binds soldier data to `<rect>` elements.** On keyframe change:
1. New positions are computed from the keyframe data
2. D3 `.transition()` tweens each soldier's `x`, `y`, and `transform: rotate()` to the new values
3. Transition duration is set by the keyframe's `duration` field × speed multiplier
4. Easing: `d3.easeCubicInOut` for most movements; `d3.easeLinear` for sustained marching

**Why D3 (not pure React/CSS or GSAP):**
- D3's data-join (`enter`/`update`/`exit`) naturally handles "here are 47 soldiers, update all their positions"
- `d3-transition` handles concurrent tweens on many elements efficiently
- `d3-interpolate` gives us smooth rotation interpolation (important for facings)
- The soldier array IS the data — this is exactly D3's sweet spot
- No additional dependency beyond what we'd already want for SVG manipulation

### 4.3 Animation Timing & Cadence
Casey defines specific cadences that the animations should reflect:

| Step type | Paces/min | Pace length | Animation feel |
|-----------|-----------|-------------|----------------|
| Common time | 90/min | 28 inches | Slow, deliberate (used only in early drill) |
| Quick time | 110/min | 28 inches | Standard marching pace — default for most animations |
| Double quick | 165/min | 33 inches | Noticeably faster, arms at trail or right shoulder shift |

At 1x speed, the animation should convey the *relative* feel of these cadences, not literal real-time. Suggested base rate: **1 animated pace ≈ 200ms at 1x in quick time**, scaled proportionally for other cadences.

### 4.4 Soldier Rendering
Each soldier is a small rectangle rendered top-down (bird's-eye view):

```
┌──┐   Front rank: filled --rank-front (#1E3A5F)
│  │   8px wide × 6px tall (at default scale)
└──┘   Rounded corners: 1px radius

┌──┐   Rear rank: filled --rank-rear (#5A7DA8)
│  │   Same dimensions, lighter shade
└──┘

┌──┐   Officers: filled --officer (#B45309)
│★ │   Small diamond or pip inside (optional, toggled with labels)
└──┘

┌──┐   NCOs: filled --nco (#047857)
│  │   Chevron mark (optional, toggled with labels)
└──┘
```

Facing direction is shown by rotating the rectangle. A subtle **direction indicator** — a small notch or line on the "front" edge — helps the viewer see which way each soldier faces. When facing front (toward top of screen), rotation = 0°. About-face = 180°. Right face = 90°.

### 4.5 Annotations & Visual Aids
The canvas supports optional annotation overlays that help explain what's happening:

- **Guide line**: A faint dashed line extending from the guide's position in the direction of march
- **Wheeling arc**: When a platoon or company wheels, draw the arc path (faint, curved line)
- **Wheeling point marker**: A small dot or cross at the point where files wheel during changes of direction by file
- **Distance markers**: Dimension-line style annotations showing key distances (rank interval, file closer distance, column distance between platoons)
- **Direction-of-march arrow**: Large subtle arrow on the canvas showing the overall direction of movement
- **Ghost trail**: For complex movements like the countermarch, show a faint trail of the path the lead file takes

---

## 5. Drill Content: School of the Company

### 5.1 Content Structure (Mirrors Casey Exactly)

```
School of the Company
├── Lesson III — The March
│   ├── Art. 1: To march in line of battle (¶34–38)
│   ├── Art. 2: To halt and align (¶39–49)
│   ├── Art. 3: Oblique march in line of battle (¶50–56)
│   ├── Art. 4: To mark time, double quick, back step (¶57–67)
│   └── Art. 5: To march in retreat (¶68–75)
│
├── Lesson IV — The Flank March
│   ├── Art. 1: To march by the flank (¶76–87)
│   ├── Art. 2: To change direction by file (¶88–92)
│   ├── Art. 3: To halt and face to front (¶93–96)
│   ├── Art. 4: To form on right/left by file into line (¶97–107)
│   └── Art. 5: To form by company/platoon into line; face R/L in marching (¶108–122)
│
├── Lesson V — Column of Platoons
│   ├── Art. 1: To break into column by platoon (halt & marching) (¶123–141)
│   ├── Art. 2: To march in column (¶142–157)
│   ├── Art. 3: To change direction (¶158–172)
│   ├── Art. 4: To halt the column (¶173–176)
│   └── Art. 5: To form right/left into line (halt & marching) (¶177–197)
│
└── Lesson VI — Advanced Movements
    ├── Art. 1: To break into platoons and re-form (¶198–208)
    ├── Art. 2: To break files to rear and re-enter line (¶209–221)
    ├── Art. 3: Route step and movements therein (¶222–244)
    ├── Art. 4: Countermarch (¶245–253)
    └── Art. 5: Column by platoon, form R/L into line (¶254–268)
```

### 5.2 Per-Movement Page Content
Each movement page contains:

1. **Title & breadcrumb** — e.g., "School of the Company > Lesson III > To March in Line of Battle"
2. **Commands block** — The exact command sequence, formatted per Casey's convention: preparatory commands in *italic*, commands of execution in **CAPS** (¶75)
3. **Animation canvas** — The animated drill (hero element, takes most of viewport)
4. **Controls** — Play/pause/step/speed/toggles
5. **Casey's text** — The relevant paragraphs from the manual in a scrollable panel. The currently-active paragraph (corresponding to the current keyframe) is highlighted with a subtle background color and scrolled into view as the animation progresses.
6. **Reenactor notes** — Expandable section. Practical tips, common errors, clarifications. Initially populated for the most important movements; can be expanded over time as a community resource.

### 5.3 Detailed Movement Breakdowns

Below is the keyframe-level breakdown for every movement in Phase 1. These define the exact animation sequences to implement.

---

#### LESSON III, Article 1: To March in Line of Battle (S.C. ¶34–38)

**Commands:** `1. Company, forward. 2. Guide right. 3. MARCH.`

**Initial state:** Company halted in line of battle. Two ranks. File closers 2 paces behind rear rank. Captain on right of front rank. Covering sergeant (right guide) in rear rank covering captain. 2nd Sergeant (left guide) posted as file closer opposite 2nd file from left.

**Keyframes:**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Halted in line | Starting formation. All stationary. Guide identified with highlight. | 0ms (initial) |
| 2 | Command given | Preparatory command highlight. Brief pause. | 800ms |
| 3 | Marching | Entire company advances toward top of screen at quick-time cadence. File closers maintain 2-pace interval behind rear rank. | 3000ms |
| 4 | Halt | At `HALT`, all soldiers stop. Foot in rear brought up. | 600ms |

**Annotations:**
- Faint guide line extending from covering sergeant's position straight forward
- Direction-of-march arrow

**Key principles to visualize:**
- The guide marches perfectly straight
- Soldiers maintain touch of elbows toward the guide side
- The whole formation moves as a unit
- File closers maintain interval behind rear rank

---

#### LESSON III, Article 2: To Halt and Align (S.C. ¶39–49)

**Commands:** `1. Company. 2. HALT.` then `Right—DRESS.` then `FRONT.`

**Keyframes:**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Company in march | Moving forward in line. | 2000ms |
| 2 | Halt | All stop. Slight natural misalignment shown (some soldiers a half-step ahead/behind). | 600ms |
| 3 | Right DRESS | Soldiers adjust: small head-turn indicators toward the right. Each man adjusts laterally and longitudinally to align with the base (right) file. Covering sergeant aligns rear rank. | 1500ms |
| 4 | FRONT | Heads snap to front. Formation is now perfectly dressed. | 400ms |

**Annotations:** Alignment reference line along the front rank.

---

#### LESSON III, Article 3: Oblique March (S.C. ¶50–56)

**Commands:** `1. Right oblique. 2. MARCH.` ... `1. Forward. 2. MARCH.`

**Keyframes:**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Company in march | Advancing in line, guide right. | 1500ms |
| 2 | Right oblique MARCH | Each soldier makes a half-face to the right (~45° rotation). | 600ms |
| 3 | Oblique march | All soldiers march diagonally (up and right) for 6–8 paces. They glance along shoulders toward the obliquing side. Elbows no longer touching. | 2500ms |
| 4 | Forward MARCH | Each soldier half-faces back to front (rotation → 0°). Direct march resumes, elbows re-established. | 600ms |
| 5 | Direct march resumed | Company continues straight ahead. | 1500ms |

**Annotations:** 45° angle line showing the oblique direction.

---

#### LESSON III, Article 4: Mark Time, Double Quick, Back Step (S.C. ¶57–67)

Three sub-animations on the same page, selectable via tabs or sequential:

**A) Mark Time:**
| # | Label | Duration |
|---|-------|----------|
| 1 | Company marching | 1500ms |
| 2 | Mark time MARCH | Soldiers stop advancing, bob slightly in place (subtle y-oscillation). | 2000ms |
| 3 | Forward MARCH | Resume direct march. | 1500ms |

**B) Double Quick:**
| # | Label | Duration |
|---|-------|----------|
| 1 | Company at quick time | 1500ms |
| 2 | Double quick MARCH | Pace visibly accelerates and lengthens. Movement speed increases ~50%. | 2000ms |
| 3 | Quick time MARCH | Return to normal cadence. | 1500ms |

**C) Back Step:**
| # | Label | Duration |
|---|-------|----------|
| 1 | Company halted | 0ms |
| 2 | Backward MARCH | Soldiers step backward (toward bottom of screen), 14-inch steps. | 2000ms |
| 3 | Halt | Stop. | 600ms |

---

#### LESSON III, Article 5: March in Retreat (S.C. ¶68–75)

**Commands:** `1. Company, right about. 2. HALT.` then `1. Company, forward. 2. Guide left. 3. MARCH.`

**Keyframes:**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Halted in line | Facing front (top). | 0ms |
| 2 | Right about HALT | All soldiers rotate 180°. Covering sergeant shifts to what is now the front (old rear rank). Guide changes from right to LEFT. File closers reposition to 2 paces behind new rear rank. | 1200ms |
| 3 | Forward MARCH (retreat) | Company marches in the new direction (downward on screen). Guide left. | 2500ms |
| 4 | Halt | Stop. | 600ms |
| 5 | About face (restore) | About-face to restore original facing. | 1200ms |

**Annotations:** Prominent label showing guide shift: "Guide shifts to LEFT when faced about."

**Reenactor note:** This is one of the most commonly confused points in reenacting — when you about-face, the guide switches flanks because right and left are relative to the direction of march. The animation should make this unmistakable.

---

#### LESSON IV, Article 1: To March by the Flank (S.C. ¶76–87)

**Commands:** `1. Company, right—FACE. 2. Forward. 3. MARCH.`

**Keyframes:**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Company in line | Standard two-rank formation. | 0ms |
| 2 | Right FACE | All soldiers rotate 90° right. | 600ms |
| 3 | Files double | Even-numbered men step to the right side of odd-numbered men (per S.S. ¶363). This creates files of two men abreast. Animate each even-number sliding laterally into position. | 1000ms |
| 4 | Forward MARCH | Column of files steps off. Former right of company is now head of column. Two men wide, 20 files deep. | 2500ms |
| 5 | Marching by flank | Several paces of the column advancing. File closers march alongside. | 2000ms |

**Annotations:**
- Number labels on files showing the doubling: "1" stays, "2" slides to pair with "1", etc.
- Brief highlight on even-number soldiers as they step to double

**This is one of the most important animations.** The transformation from line to column of files is fundamental. The doubling of files must be clearly animated step by step.

---

#### LESSON IV, Article 2: Change Direction by File (S.C. ¶88–92)

**Commands:** `1. By file left. 2. MARCH.`

**Keyframes:**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Marching by flank | Column of files moving right. | 1500ms |
| 2 | Lead file wheels left | First file (two men) describes a small arc to the left. Inner man shortens first 3–4 steps. | 1000ms |
| 3 | Successive files wheel | Each subsequent file wheels on the same point. Show 5–6 files completing the wheel in succession. | 2500ms |
| 4 | Column in new direction | Skip ahead: all files have wheeled. Column now marching in new direction. | 1000ms |

**Annotations:**
- **Wheeling point marker**: Small dot/cross where files wheel. Persists throughout.
- Curved arc path for the leading file.

**Key principle:** Each file wheels on the SAME POINT. This is critical — if files cut the corner, the column loses its shape.

---

#### LESSON IV, Article 3: Halt and Face to Front (S.C. ¶93–96)

**Commands:** `1. Company. 2. HALT. 3. FRONT.`

**Keyframes:**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Marching by right flank | Column of files. | 1500ms |
| 2 | HALT | All stop in place. No one adjusts even if distance is lost (¶370 S.S.). | 600ms |
| 3 | FRONT | Each man faces left (opposite of the flank faced). Even-numbered men undouble back to rear rank. Company re-forms in two-rank line. | 1000ms |

---

#### LESSON IV, Article 4: Form by File into Line (S.C. ¶97–107)

**Commands:** `1. On the right, by file into line. 2. MARCH.`

**Keyframes:**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Marching by right flank | Column of files. | 1500ms |
| 2 | Lead file halts & fronts | First file halts and faces left (to the front). They are now the rightmost file of the forming line. | 800ms |
| 3 | Files form successively | The 2nd file marches past the 1st, wheels left, takes position on the left of the 1st. Then the 3rd, and so on. Each file slots in. | 4000ms (this is a long, cascading animation) |
| 4 | Line formed | All 20 files are in line. | 500ms |
| 5 | Halt and dress | `HALT`, `Left—DRESS`, `FRONT`. | 1000ms |

**Annotations:** Highlight each file as it moves into position. Show the line building from right to left — this is a beautiful cascading animation.

---

#### LESSON IV, Article 5: Form by Company into Line; Face by the Flank in Marching (S.C. ¶108–122)

Two sub-movements:

**A) Form by company into line (from column of files, while marching):**

| # | Label | Duration |
|---|-------|----------|
| 1 | Marching by right flank | 1500ms |
| 2 | Company into line MARCH | All files simultaneously wheel to the left, dressing on the rightmost file. The rightmost file continues straight; all others swing left and form the line on the march. | 2000ms |
| 3 | Company in line, marching | 1500ms |

**B) Face by the flank in marching:**
| # | Label | Duration |
|---|-------|----------|
| 1 | Company marching in line | 1500ms |
| 2 | By the right flank MARCH | Without halting, each man faces right and the company transitions to a column of files on the march. Files double simultaneously. | 1000ms |
| 3 | Marching by flank | 1500ms |

---

#### LESSON V, Article 1: Break into Column by Platoon (S.C. ¶123–141)

**Commands (from halt):** `1. By platoon, right wheel. 2. MARCH.` ... `1. Forward. 2. MARCH.`

**Keyframes:**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Company in line, halted | Two ranks, 20 files. 1st platoon (right, files 1–10), 2nd platoon (left, files 11–20). | 0ms |
| 2 | By platoon, right wheel MARCH | Both platoons simultaneously begin wheeling to the right. Rightmost file of each platoon is the pivot (marks time, turns in place). Leftmost file of each platoon takes full 28" steps. | 3000ms |
| 3 | Wheel complete | Both platoons have wheeled 90°. They now face right, in column. 1st platoon in front, 2nd behind. | 500ms |
| 4 | Forward MARCH | Column steps off. 1st platoon leads, 2nd follows. Guide is on the left (toward the head in a right-in-front column). | 2000ms |

**Annotations:**
- Wheeling arcs for both platoons
- Pivot point markers on the rightmost files
- Distance annotation between platoons once column is formed

**This is a critical movement** — how a company transitions from battle line to marching column. The simultaneous wheel is visually dramatic.

---

#### LESSON V, Article 2: March in Column (S.C. ¶142–157)

**Keyframes:**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Column of platoons, marching | 1st platoon leading, 2nd following at correct distance. Guide left. | 3000ms |

**Annotations:**
- Distance dimension line between platoons (should equal platoon front)
- Guide line extending from the guide of each platoon
- Label: "The guide of the 2nd platoon maintains distance on the guide of the 1st."

This is more of an explanatory/reference animation than a dramatic maneuver. Could be implemented as a looping animation.

---

#### LESSON V, Article 3: Change Direction in Column (S.C. ¶158–172)

Two variants — show both:

**A) Change direction to the side of the guide (left turn):**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Column marching, guide left | 1500ms |
| 2 | Head of column to the left MARCH | Guide of 1st platoon turns 90° left at the turning point, marches straight in new direction. Rest of platoon swings around — men farthest from guide double-quick to reach new alignment. | 2000ms |
| 3 | 2nd platoon turns | 2nd platoon's guide turns at the same point. Same process. | 2000ms |
| 4 | Column in new direction | 1500ms |

**B) Change direction opposite the guide (right wheel):**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Column marching, guide left | 1500ms |
| 2 | Right wheel MARCH (1st plt) | 1st platoon wheels right. Rightmost file is pivot (9" steps). Left/guide side takes full steps. Platoon arcs through 90°. | 2500ms |
| 3 | Forward MARCH (1st plt) | 1st platoon marches in new direction. | 800ms |
| 4 | Right wheel MARCH (2nd plt) | On reaching the same point, 2nd platoon wheels. | 2500ms |
| 5 | Column in new direction | 1500ms |

**Annotations:**
- Wheeling point / turning point marker
- Arc paths for wheels
- Dimension showing the pivot man's 9" steps vs. the wheeling flank's full steps

---

#### LESSON V, Article 4: Halt the Column (S.C. ¶173–176)

**Commands:** `1. Company. 2. HALT.`

| # | Label | Duration |
|---|-------|----------|
| 1 | Column of platoons, marching | 1500ms |
| 2 | HALT | Both platoons halt simultaneously. Brief alignment. | 600ms |

---

#### LESSON V, Article 5: Form into Line of Battle (S.C. ¶177–197)

**Commands (left into line, from halt):** `1. Left into line, wheel. 2. MARCH.` ... `1. Company. 2. HALT.` `Right—DRESS.` `FRONT.`

**Keyframes:**
| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Column of platoons, halted | 1st platoon in front, 2nd behind. | 0ms |
| 2 | Left into line wheel MARCH | Both platoons wheel to the left simultaneously. Leftmost file of each is the pivot. Wheeling flank (right side) takes full steps. | 3000ms |
| 3 | Line formed | Platoons on line — 2nd platoon on the left of 1st. One continuous line. | 500ms |
| 4 | HALT | Company halts. | 600ms |
| 5 | Right DRESS, FRONT | Alignment. | 1000ms |

**Annotations:** Wheeling arcs, pivot markers.

**This is the reverse of breaking into column** — equally critical. The animation should make it clear that the platoons end up side by side in the correct order.

---

#### LESSON VI, Article 1: Break into Platoons and Re-form (S.C. ¶198–208)

**Break: Commands:** `1. Break into platoons. 2. MARCH.`

| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Company marching in line | Full company advancing. | 1500ms |
| 2 | Break into platoons MARCH | 1st platoon (right) continues marching. 2nd platoon (left) marks time briefly, then obliques right and falls in behind 1st platoon at column distance. | 3000ms |
| 3 | Column formed on the march | Two platoons in column, still moving. | 1500ms |

**Re-form: Commands:** `1. Re-form company. 2. MARCH.`

| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 4 | Re-form MARCH | 2nd platoon double-quicks forward and left to come up on the left of the 1st platoon. | 2500ms |
| 5 | Company re-formed | Back in line of battle, marching. | 1500ms |

---

#### LESSON VI, Article 2: Break Files to Rear (S.C. ¶209–221)

**Commands:** `1. Two files from left to rear. 2. MARCH.`

| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Company marching in line | 1500ms |
| 2 | Two files from left to rear MARCH | The 2 leftmost files face right, step out of the line, and march to the rear along the file-closer line. | 1500ms |
| 3 | Files in rear | Broken files wheel left and march behind the company, 2 paces behind file closers, keeping abreast of their original position. Remaining files close the gap (or maintain interval per the specific drill variant). | 2000ms |
| 4 | Files marching in rear | Show the broken files parallel to the company. | 1500ms |

**Re-enter: Commands:** `1. Two files from left into line. 2. MARCH.`

| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 5 | Files re-enter | Broken files wheel back into line at their original position. | 1500ms |
| 6 | Line restored | Company back at full strength in line. | 500ms |

**Annotations:** Highlight the breaking files throughout. Show their path.

---

#### LESSON VI, Article 3: Route Step (S.C. ¶222–244)

**Commands:** `1. Route step. 2. MARCH.`

| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Column of platoons, marching | Formal column with precise intervals. | 1500ms |
| 2 | Route step MARCH | Formation visibly relaxes. Add slight random offsets to soldier positions (±2–3px). Soldiers no longer in perfect alignment. Some slight variation in facing angles (±5°). Arms carried at will. | 1500ms |
| 3 | Route step sustained | Show the column marching with relaxed spacing. | 2000ms |
| 4 | Attention, Company | Formation snaps back to precise intervals. All random offsets removed, facings corrected. | 800ms |

---

#### LESSON VI, Article 4: Countermarch (S.C. ¶245–253)

**Commands:** `1. Countermarch. 2. Company, right—FACE. 3. By file left. 4. MARCH.`

| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Company in line, halted | Facing top of screen. | 0ms |
| 2 | Right FACE | All soldiers face right (rotate 90°). | 600ms |
| 3 | By file left MARCH | Covering sergeant leads the column. Files march forward, guided by the covering sergeant who leads the head to the left. Column marches across the front of the old line, then behind it. | 4000ms |
| 4 | Files form | Each file peels off and halts in line as it reaches the correct position, now facing the opposite direction. The line re-forms behind the old position, facing the opposite way. | 3000ms |
| 5 | Line re-formed | Company in line, facing the opposite direction. Relative positions preserved. | 500ms |

**Annotations:**
- **Ghost trail / path line** for the leading file — essential for understanding the countermarch path
- Direction arrows showing old front vs. new front

**This is conceptually the trickiest movement.** The path-of-march trace is critical for comprehension.

---

#### LESSON VI, Article 5: Form on Right/Left into Line from Column (S.C. ¶254–268)

**Commands (on the right):** `1. On the right into line. 2. MARCH.`

| # | Label | Description | Duration |
|---|-------|-------------|----------|
| 1 | Column of platoons, halted | 1st platoon in front, 2nd behind. | 0ms |
| 2 | 1st platoon stands fast | It's at the head; it stays. | 500ms |
| 3 | 2nd platoon forms | 2nd platoon marches forward, wheels right, and comes into line on the right of the 1st platoon. | 3000ms |
| 4 | Line formed | Company in line of battle. Dress and front. | 1000ms |

---

## 6. Navigation & Information Architecture

### 6.1 URL Structure
```
/#/                                              → Landing / overview
/#/school-of-the-company                         → Overview with lesson list
/#/school-of-the-company/lesson-iii              → Lesson overview
/#/school-of-the-company/lesson-iii/march-in-line   → Specific movement page
/#/school-of-the-company/lesson-iv/march-by-flank
... etc.
/#/about                                         → About, sources, credits
```

### 6.2 Sidebar Navigation
Persistent left sidebar (collapsible on mobile). Tree structure mirrors Casey:

```
School of the Company
  Lesson III — The March
    March in Line of Battle
    Halt and Align
    Oblique March
    Mark Time / Double Quick / Back Step
    March in Retreat
  Lesson IV — The Flank March
    March by the Flank
    Change Direction by File
    Halt and Face to Front
    Form by File into Line
    Form by Company into Line
  Lesson V — Column of Platoons
    Break into Column by Platoon
    March in Column
    Change Direction
    Halt the Column
    Form into Line of Battle
  Lesson VI — Advanced Movements
    Break into Platoons / Re-form
    Break Files to Rear
    Route Step
    Countermarch
    Form on Right/Left into Line
```

Active item highlighted with `--accent`. Lessons are collapsible/expandable. Current lesson auto-expands.

### 6.3 Breadcrumbs
Top of each movement page:
`School of the Company › Lesson III › March in Line of Battle`

### 6.4 Prev / Next
Bottom of each page: `← Halt and Align` | `Oblique March →`
Follows Casey's reading order.

### 6.5 Landing Page
Brief introduction:
- What this site is
- Who Casey was (one paragraph)
- How to use the animations (brief guide)
- Jump to Lesson III (the starting point for School of the Company)
- Link to the full PDF of Casey's manual

---

## 7. UI Components Spec

### 7.1 Animation Controls
Horizontal bar below canvas:

```
[|◀ Prev]  [▶ Play / ❚❚ Pause]  [Next ▶|]    ●────────────○    [0.5x] [1x] [2x]
                                                progress bar        speed
```

- **Play/Pause** — Toggle. Cycles through keyframes with timing.
- **Prev / Next** — Step to previous/next keyframe with a fast 200ms transition.
- **Progress bar** — Discrete stops at each keyframe. Draggable. Current keyframe label displayed above.
- **Speed** — Three radio-style buttons. Multiplies all transition durations.
- **Keyboard**: `Space` = play/pause, `←` / `→` = step, `1` / `2` / `3` = speed

### 7.2 Canvas Toggles
Small icon-buttons in top-right corner of canvas (with tooltips):

- **Labels** (tag icon) — Show/hide role labels on soldiers
- **Grid** (grid icon) — Show/hide pace grid overlay
- **File closers** (layers icon) — Show/hide file closers (simplifies view)
- **Annotations** (info icon) — Show/hide guide lines, distance markers, arcs

### 7.3 Legend
Compact, below canvas, always visible:

```
■ Front rank   ■ Rear rank   ■ Officers   ■ NCOs   ■ Color guard
```

Small colored squares with labels. Matches soldier fill colors.

### 7.4 Casey's Text Panel
Below controls. Scrollable container, max-height ~300px.

- Each paragraph numbered per Casey's original (e.g., "¶36.")
- Active paragraph gets a subtle left-border highlight (`--accent` color, 3px left border) and background (`--surface`)
- Auto-scrolls to active paragraph on keyframe change
- Paragraphs are plain text, preserving Casey's formatting (italics for preparatory commands, caps for execution commands)

### 7.5 Reenactor Notes
Expandable accordion below Casey's text. Header: "Reenactor Notes" with expand/collapse chevron.

Content format: plain prose, potentially with bullet points for common mistakes. Initially, prioritize notes for:
- March by the flank (the file-doubling)
- March in retreat (guide switching sides)
- Countermarch (path confusion)
- Break into column by platoon (wheeling mechanics)

---

## 8. Technical Architecture

### 8.1 Project Structure
```
caseys-drill/
├── public/
│   └── index.html
├── src/
│   ├── main.jsx                     # Entry point
│   ├── App.jsx                      # Router, top-level layout
│   │
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopNav.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Breadcrumbs.jsx
│   │   │   └── Footer.jsx
│   │   │
│   │   ├── drill/
│   │   │   ├── DrillPage.jsx        # Full movement page (canvas + controls + text)
│   │   │   ├── DrillCanvas.jsx      # SVG container, D3 bindpoint
│   │   │   ├── Controls.jsx         # Play/pause/step/speed
│   │   │   ├── CanvasToggles.jsx    # Labels/grid/file closers/annotations
│   │   │   ├── ProgressBar.jsx      # Keyframe scrubber
│   │   │   └── Legend.jsx
│   │   │
│   │   ├── text/
│   │   │   ├── CaseyText.jsx        # Renders paragraphs with active highlight
│   │   │   ├── CommandBlock.jsx     # Formatted drill commands
│   │   │   └── ReenactorNotes.jsx   # Expandable notes section
│   │   │
│   │   └── pages/
│   │       ├── Landing.jsx
│   │       ├── LessonOverview.jsx
│   │       └── About.jsx
│   │
│   ├── engine/
│   │   ├── AnimationEngine.js       # Core state machine: keyframe mgmt, playback, timing
│   │   ├── SoldierRenderer.js       # D3: data join, rect creation, transitions
│   │   ├── AnnotationRenderer.js    # D3: grid, arcs, guide lines, distance markers
│   │   └── formations.js            # Position calculators:
│   │                                #   lineOfBattle(), columnOfFiles(),
│   │                                #   columnOfPlatoons(), wheel(), oblique(),
│   │                                #   aboutFace(), doubleFiles(), etc.
│   │
│   ├── data/
│   │   ├── company.js               # Default 20-file company: all 47 soldiers
│   │   ├── constants.js             # Scale, dimensions, cadences, colors
│   │   ├── navigation.js            # Sidebar tree structure, route mappings
│   │   └── drills/
│   │       ├── index.js             # Registry of all drill modules
│   │       ├── lesson-iii/
│   │       │   ├── marchInLine.js
│   │       │   ├── haltAndAlign.js
│   │       │   ├── obliqueMarch.js
│   │       │   ├── markTime.js
│   │       │   └── marchInRetreat.js
│   │       ├── lesson-iv/
│   │       │   ├── marchByFlank.js
│   │       │   ├── changeDirectionByFile.js
│   │       │   ├── haltFaceFront.js
│   │       │   ├── formByFile.js
│   │       │   └── formByCompany.js
│   │       ├── lesson-v/
│   │       │   ├── breakIntoColumn.js
│   │       │   ├── marchInColumn.js
│   │       │   ├── changeDirection.js
│   │       │   ├── haltColumn.js
│   │       │   └── formIntoLine.js
│   │       └── lesson-vi/
│   │           ├── breakPlatoons.js
│   │           ├── breakFiles.js
│   │           ├── routeStep.js
│   │           ├── countermarch.js
│   │           └── formOnRightLeft.js
│   │
│   ├── hooks/
│   │   ├── useAnimationEngine.js    # React hook wrapping AnimationEngine
│   │   ├── useDrillData.js          # Loads drill data for current route
│   │   └── useKeyboardShortcuts.js  # Space, arrows, number keys
│   │
│   └── styles/
│       ├── globals.css              # CSS variables, reset, typography imports
│       ├── layout.css               # Page structure, sidebar, responsive
│       └── components.css           # Component styles (or use CSS modules)
│
├── package.json
├── vite.config.js
└── README.md
```

### 8.2 Formation Utility Functions
These are the computational heart of the system. Rather than manually specifying x/y for all 47 soldiers in every keyframe, we define high-level formation functions:

```javascript
// Generate positions for a company in line of battle
lineOfBattle(company, { origin, facing, guide })
// → [{ id, x, y, facing }, ...] for all 47 soldiers

// Generate positions for a column of files (after march by flank)
columnOfFiles(company, { origin, facing, headFile })
// → Files of 2 abreast, 20 deep

// Generate column of platoons
columnOfPlatoons(company, { origin, facing, guide, distance })
// → Two platoon blocks, one behind the other

// Compute positions after a wheel
wheel(currentPositions, { pivot, angle, pivotStepSize })
// → New positions after rotating through `angle` degrees

// Compute oblique march offset
oblique(currentPositions, { direction, distance })
// → Positions shifted diagonally

// About face
aboutFace(currentPositions)
// → All facings rotated 180°, file closers repositioned

// Double files (for march by flank)
doubleFiles(currentPositions, { direction })
// → Even files slide next to odd files

// Undouble files (for fronting after flank march)
undoubleFiles(currentPositions, { direction })
// → Even files return to rear rank positions
```

Keyframe definitions in drill files call these functions:

```javascript
// Example: marchByFlank.js (simplified)
export default {
  id: "march-by-flank",
  title: "To March by the Flank",
  lesson: 4,
  article: 1,
  caseyParagraphs: [76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87],
  commands: [
    { text: "1. Company, right—FACE.", type: "execution" },
    { text: "2. Forward.", type: "preparatory" },
    { text: "3. MARCH.", type: "execution" }
  ],
  buildKeyframes: (company, constants) => [
    {
      label: "Company in line",
      caseyRef: "¶76",
      positions: lineOfBattle(company, { origin: [480, 400], facing: 0, guide: "right" }),
      duration: 0
    },
    {
      label: "Right FACE — files double",
      caseyRef: "¶77–78",
      positions: doubleFiles(
        lineOfBattle(company, { origin: [480, 400], facing: 90, guide: "right" }),
        { direction: "right" }
      ),
      duration: 1200
    },
    {
      label: "Forward MARCH",
      caseyRef: "¶79",
      positions: translate(
        doubleFiles(lineOfBattle(company, { ... }), { direction: "right" }),
        { dx: 140, dy: 0 }
      ),
      duration: 3000
    }
  ]
};
```

### 8.3 React ↔ D3 Boundary
Clear separation of concerns:

**React owns:**
- Routing (which drill is displayed)
- UI state (playback status, speed, toggle states)
- Control rendering (buttons, progress bar, toggles)
- Text panel rendering (Casey's text, notes)

**D3 owns:**
- SVG element creation via data joins
- Soldier `<rect>` management (enter/update/exit)
- Transitions and animation tweening
- Annotation rendering (grid, arcs, labels on canvas)

**Bridge:** `DrillCanvas.jsx` renders an empty `<svg ref={svgRef}>`. The `useAnimationEngine` hook takes this ref and the current drill data, initializes D3 bindings, and exposes control methods:

```javascript
const { play, pause, stepForward, stepBack, seekTo, currentKeyframe, isPlaying } =
  useAnimationEngine(svgRef, drillData, { speed, showLabels, showGrid, showFileClosers, showAnnotations });
```

### 8.4 Build & Deploy
- **Vite** for build (fast HMR, good React/JSX support)
- **GitHub Actions** workflow: on push to `main`, run `vite build`, deploy `dist/` to `gh-pages` branch
- `vite.config.js`: set `base` to the repo name for GH Pages path
- Dependencies: `react`, `react-dom`, `react-router-dom`, `d3` (or cherry-picked: `d3-selection`, `d3-transition`, `d3-interpolate`, `d3-ease`, `d3-scale`)

---

## 9. Accessibility & Usability

### 9.1 Keyboard Navigation
- All controls operable by keyboard
- `Tab` navigates between controls
- `Space` / `Enter` activates buttons
- Arrow keys step through keyframes when canvas area is focused
- Sidebar navigable by keyboard

### 9.2 Screen Reader Support
- Each keyframe has a `label` and `description` announced via `aria-live` region when reached
- Casey's text panel provides a textual equivalent of the animation
- All controls have `aria-label` attributes
- SVG has a `<title>` and `<desc>` for the overall animation

### 9.3 Reduced Motion
- Respect `prefers-reduced-motion` media query: if set, transitions jump instantly between keyframes (duration → 0)
- Provide a manual "reduce motion" toggle in the canvas toggles

---

## 10. Content Accuracy Standards

This is a reference tool for reenactors. **Accuracy is paramount.**

- All movements must be traceable to specific Casey's paragraphs. Every keyframe cites its source.
- Distances and intervals must match Casey's specifications: 28-inch pace, 13-inch rank distance, 2-pace file closer interval, etc.
- Terminology must be Casey's: "covering sergeant" not "first sergeant acting as guide"; "guide right" not "dress right"; "file closers" not "NCOs in the rear."
- Paragraph numbering references Casey's 1862 original (New York: D. Van Nostrand edition).
- When Casey is ambiguous, note the ambiguity in the reenactor notes and present the most commonly accepted interpretation among experienced reenactors.
- The School of the Company paragraph numbers in this spec follow the S.C. numbering (starting from ¶1 at the beginning of Title III), which is how Casey organizes the text. If the PDF uses continuous numbering from the start of the volume, a mapping table should be maintained.

---

## 11. Implementation Priority

Recommended build order within Phase 1:

1. **Project scaffolding** — Vite, React, router, layout shell, sidebar, CSS variables, typography
2. **Company data model** — `company.js`, `constants.js`, formation functions (`lineOfBattle()` first)
3. **DrillCanvas + SoldierRenderer** — Get 47 rectangles on screen in line-of-battle formation
4. **AnimationEngine** — Keyframe state machine, play/pause/step, D3 transitions
5. **Controls** — Play/pause, step, speed, progress bar
6. **First drill: March in Line of Battle** — Simplest movement (whole company translates together)
7. **Second drill: Halt and Align** — Introduces misalignment + correction
8. **Third drill: March by the Flank** — The critical line-to-column transformation; stress-tests the formation functions
9. **Remaining Lesson III drills** — Oblique, mark time, retreat
10. **Remaining Lesson IV drills** — Change direction by file, form by file into line, etc.
11. **Lesson V drills** — Column of platoons (break, march, change direction, form line)
12. **Lesson VI drills** — Advanced movements
13. **Casey's text integration** — Paragraph display with keyframe-synced highlighting
14. **Reenactor notes** — Content authoring
15. **Polish** — Responsive layout, accessibility audit, performance, deploy pipeline

---

## 12. Future Considerations (Not in Phase 1)

- **School of the Soldier**: Manual of arms (single-figure, side-view musket illustrations)
- **School of the Battalion**: Multi-company formations, battalion maneuvers
- **Comparison mode**: Casey vs. Hardee vs. Scott for the same maneuver
- **Print view**: Static diagrams of each keyframe for printing and field reference
- **User-configurable company size**: Slider to adjust number of files (10–40)
- **Sound**: Drum cadence audio, spoken commands
- **Mobile gestures**: Swipe to step through keyframes
- **Dark mode**: Straightforward with CSS variable approach
- **Community contributions**: Reenactor notes as a crowdsourced layer (would require a backend)

---

## Appendix A: Casey's Paragraph Reference (School of the Company, Phase 1)

| Movement | S.C. ¶¶ |
|----------|---------|
| March in line of battle | 34–38 |
| Halt and align | 39–49 |
| Oblique march | 50–56 |
| Mark time, double quick, back step | 57–67 |
| March in retreat | 68–75 |
| March by the flank | 76–87 |
| Change direction by file | 88–92 |
| Halt and face to front | 93–96 |
| Form by file into line | 97–107 |
| Form by company/platoon into line | 108–122 |
| Break into column by platoon | 123–141 |
| March in column | 142–157 |
| Change direction in column | 158–172 |
| Halt the column | 173–176 |
| Form into line of battle | 177–197 |
| Break into platoons / re-form | 198–208 |
| Break files to rear | 209–221 |
| Route step | 222–244 |
| Countermarch | 245–253 |
| Form on right/left into line | 254–268 |

---

## Appendix B: Company Roster (20-File Default)

| ID | Role | Rank | File | Platoon | Section | Visual Color |
|----|------|------|------|---------|---------|-------------|
| `of-cpt` | Captain | front | 1 | 1 | 1 | `--officer` |
| `nc-cov` | Covering Sgt | rear | 1 | 1 | 1 | `--nco` |
| `fr-02` – `fr-20` | Private | front | 2–20 | 1–2 | 1–4 | `--rank-front` |
| `rr-02` – `rr-20` | Private | rear | 2–20 | 1–2 | 1–4 | `--rank-rear` |
| `fc-1lt` | 1st Lieutenant | fileCloser | ~18 | 2 | 4 | `--officer` |
| `fc-2lt` | 2nd Lieutenant | fileCloser | ~5 | 1 | 1–2 | `--officer` |
| `fc-3lt` | 3rd Lieutenant | fileCloser | ~15 | 2 | 3 | `--officer` |
| `fc-2sg` | 2nd Sgt (Left Guide) | fileCloser | 19 | 2 | 4 | `--nco` |
| `fc-3sg` | 3rd Sergeant | fileCloser | 12 | 2 | 3 | `--nco` |
| `fc-4sg` | 4th Sergeant | fileCloser | 9 | 1 | 2 | `--nco` |
| `fc-5sg` | 5th Sergeant | fileCloser | 2 | 1 | 1 | `--nco` |

**Total: 47 soldiers** (1 captain + 19 front-rank privates + 1 covering sgt + 19 rear-rank privates + 3 officers as file closers + 4 sergeants as file closers)

---

*Specification v1.0 — Ready for implementation*
