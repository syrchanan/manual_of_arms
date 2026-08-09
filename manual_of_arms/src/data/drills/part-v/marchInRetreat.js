import { battalionLine } from '../../../engine/battalionFormations.js';
import { aboutFace, translate } from '../../../engine/formations.js';
import { DEFAULT_BATTALION, FIELD_AND_STAFF, COLOR_PARTY, COLOR_COMPANY_INDEX, NUM_COMPANIES } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Fifth, Article V (S.B. ¶730-743): "To march in retreat, in line of
// battle."
//
// Per battalion-spec/part-fifth-a.md: structurally this is a direct mirror
// of Article I (the advance in line), the same relationship company-scale
// lesson-iii/marchInRetreat.js already has to lesson-iii/marchInLine.js --
// scaled up from 2 repositioned individuals (captain, covering sergeant) to
// the full Article I cast (color-bearer, 3 color-guard corporals, 2 general
// guides, colonel, lieutenant-colonel, both majors) PLUS two pieces of
// genuinely new bookkeeping at the about-face instant itself (¶731, ¶736).
// No new geometric primitive is needed -- aboutFace() and translate(), both
// already used at company scale, remain sufficient; the complexity here is
// entirely in sequencing which individual moves to which post and when.
//
// Markers (¶734, ¶739 -- the marker-relay bookkeeping for a "directing"
// battalion) and Article I's mid-march "point of direction" correction
// sub-maneuver (¶742, incorporating ¶670-677) are flagged but NOT modeled,
// consistent with this spec's own scoping note that those are optional/
// conditional elaborations, not part of the base retreat sequence.
// ---------------------------------------------------------------------------

const { PACE_PX, RANK_GAP, FILE_CLOSER_GAP, FILE_INTERVAL } = SCALE;

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 80;
const ORIGIN_Y = 220;
const FACING = 0; // halted facing front ("north"/up-screen) before the retreat

const COLONEL_LTCOL_PACES = 40; // ¶733, mirrors ¶648-649
const SMAJ_FLANK_PACES = 7; // ¶657 baseline (6-8 paces on flank of color-rank), reused per ¶742's "same functions"
const JUNIOR_MAJ_HALTED_PACES = 4; // interpretive filler -- no post specified for the junior major in ¶730-743
// 12 paces of visible march distance, matching lesson-iii/marchInRetreat.js's
// own MARCH_DIST convention (a visual scale-up, not a second pace multiplier).
const MARCH_DIST_PACES = 12;

function fwdAxis(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return { x: Math.sin(rad), y: -Math.cos(rad) };
}
function acrossAxis(facingDeg) {
  const rad = (facingDeg * Math.PI) / 180;
  return { x: Math.cos(rad), y: Math.sin(rad) };
}
function addPx(p, axis, px) {
  return { x: p.x + axis.x * px, y: p.y + axis.y * px };
}
function addPaces(p, axis, paces) {
  return addPx(p, axis, paces * PACE_PX);
}
function midpoint(a, b) {
  return { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 };
}

const RIGHT_CAPTAIN_ID = 'c1-of-cpt';
const LEFT_FLANK_ID = `c${NUM_COMPANIES}-fr-20`;
const COLOR_CAPTAIN_ID = `c${COLOR_COMPANY_INDEX}-of-cpt`;
const COLOR_LEFT_ID = `c${COLOR_COMPANY_INDEX}-fr-20`;

/**
 * Build the color party (6) + field-and-staff (4) positions for the
 * "halted in line, facing front" starting state (¶730), given the 376
 * company positions already laid out by battalionLine().
 *
 * Unlike the marching-in-line state (Article I/IV), the color-bearer and
 * general guides are shown embedded IN the line here, not advanced -- ¶700
 * (Article III) establishes that the color-rank/guides only move out in
 * front once the battalion is set marching, and ¶731 explicitly assumes
 * they "take their places in line" at the opening of this article if they
 * had been left in advance. The color-bearer occupies the color-company's
 * own front-rank centreline; the corporal of his file (the centre corporal)
 * pairs directly behind him at rear-rank depth, mirroring the of-cpt/nc-cov
 * front/rear pairing an ordinary file uses -- this pairing is what makes
 * ¶731's about-face swap (see aboutFaceReposition below) legible as a
 * front/rear-rank exchange. Field-and-staff posts are generic halted/parade
 * placements (no article in this Part fixes them before the about-face);
 * documented as interpretive.
 */
function haltedPartyAndStaff(companyPositions, facing) {
  const byId = new Map(companyPositions.map((p) => [p.id, p]));
  const fwd = fwdAxis(facing);
  const behind = { x: -fwd.x, y: -fwd.y };
  const across = acrossAxis(facing);

  const rightCaptain = byId.get(RIGHT_CAPTAIN_ID);
  const leftFlank = byId.get(LEFT_FLANK_ID);
  const colorCaptain = byId.get(COLOR_CAPTAIN_ID);
  const colorLeft = byId.get(COLOR_LEFT_ID);

  const colorCenter = midpoint(colorCaptain, colorLeft);
  const battalionCenter = midpoint(rightCaptain, leftFlank);

  const colorBearer = colorCenter; // embedded at front-rank depth, guide posts in-line
  const centreCpl = addPx(colorBearer, behind, RANK_GAP); // rear-rank depth, mirrors nc-cov
  const rightCpl = addPx(colorBearer, across, FILE_INTERVAL);
  const leftCpl = addPx(colorBearer, across, -FILE_INTERVAL);
  // { x, y } only -- rightCaptain/leftFlank are battalionLine() soldier
  // records carrying their own `id`; spreading them wholesale here would
  // leak that id and silently overwrite 'guide-right'/'guide-left' below.
  const guideRight = { x: rightCaptain.x, y: rightCaptain.y };
  const guideLeft = { x: leftFlank.x, y: leftFlank.y };

  const colonel = addPaces(battalionCenter, behind, 15);
  const ltCol = addPaces(rightCaptain, behind, 4);
  const seniorMaj = addPaces(rightCaptain, behind, 8);
  const juniorMaj = addPaces(leftFlank, behind, JUNIOR_MAJ_HALTED_PACES);

  const posById = {
    'color-bearer': { ...colorBearer, facing },
    'color-cpl-right': { ...rightCpl, facing },
    'color-cpl-centre': { ...centreCpl, facing },
    'color-cpl-left': { ...leftCpl, facing },
    'guide-right': { ...guideRight, facing },
    'guide-left': { ...guideLeft, facing },
    'fs-col': { ...colonel, facing },
    'fs-ltc': { ...ltCol, facing },
    'fs-smaj': { ...seniorMaj, facing },
    'fs-jmaj': { ...juniorMaj, facing },
  };

  return [...COLOR_PARTY, ...FIELD_AND_STAFF].map((person) => ({ id: person.id, ...posById[person.id] }));
}

/**
 * ¶730-733: at "Battalion, about-FACE," every company soldier turns 180 in
 * place (aboutFace(), applied by the caller to the 376 company positions).
 * On top of that, this function reproduces ¶731's specific individual
 * bookkeeping for the color party and field-and-staff, all of it expressed
 * relative to the FIXED (pre-turn) halted layout -- about-face does not move
 * anyone's screen position except the individuals ¶731 explicitly names:
 *
 *  - color-bearer "passes into the rear rank (now leading)": swaps screen
 *    position with the centre corporal (the "corporal of his file").
 *  - the centre corporal "steps into the front rank (now rear) to re-form
 *    the color-file": takes the color-bearer's old position.
 *  - right/left corporals: interpretive -- kept flanking the color-bearer's
 *    NEW position (elbow-to-elbow per ¶662/¶738, "same principles" as the
 *    advance), rather than modeling ¶736's separately-worded "2 corporals of
 *    his guard from that rank" as a distinct third waypoint.
 *  - guides: not repositioned until ¶736 (the next command) -- face about
 *    in place only.
 *  - colonel: "places himself behind the front rank (now become the rear)"
 *    -- taken together with ¶733's explicit 40-pace figure (identical
 *    relationship to ¶648-649's advance), positioned 40 paces beyond the
 *    color-file on the OLD-forward side (the new tail of the formation).
 *  - lieutenant-colonel and senior major: "place themselves before the rear
 *    rank (now leading)" -- lieutenant-colonel takes the mirrored 40-pace
 *    post (¶733); senior major posts on the flank of that same line (¶657's
 *    6-8 pace figure, reused per ¶742's "same functions" clause).
 *  - junior major: no post specified for this article; keeps his halted
 *    position, facing flipped.
 */
function aboutFaceReposition(haltedCompanies, haltedParty, facing) {
  const newFacing = (facing + 180) % 360;
  const fwd = fwdAxis(facing);
  const across = acrossAxis(facing);

  const partyById = new Map(haltedParty.map((p) => [p.id, p]));
  const colorCaptain = haltedCompanies.find((p) => p.id === COLOR_CAPTAIN_ID);
  const colorLeft = haltedCompanies.find((p) => p.id === COLOR_LEFT_ID);
  const colorCenter = midpoint(colorCaptain, colorLeft);

  const bearerOld = partyById.get('color-bearer');
  const centreCplOld = partyById.get('color-cpl-centre');

  const bearerNew = { x: centreCplOld.x, y: centreCplOld.y };
  const centreCplNew = { x: bearerOld.x, y: bearerOld.y };
  const rightCplNew = addPx(bearerNew, across, FILE_INTERVAL);
  const leftCplNew = addPx(bearerNew, across, -FILE_INTERVAL);

  const colonel = addPaces(colorCenter, fwd, COLONEL_LTCOL_PACES);
  const ltCol = addPaces(colorCenter, fwd, -COLONEL_LTCOL_PACES);
  const seniorMaj = addPx(ltCol, across, SMAJ_FLANK_PACES * PACE_PX);

  const companies = aboutFace(haltedCompanies);

  const party = [
    { id: 'color-bearer', x: bearerNew.x, y: bearerNew.y, facing: newFacing },
    { id: 'color-cpl-right', x: rightCplNew.x, y: rightCplNew.y, facing: newFacing },
    { id: 'color-cpl-centre', x: centreCplNew.x, y: centreCplNew.y, facing: newFacing },
    { id: 'color-cpl-left', x: leftCplNew.x, y: leftCplNew.y, facing: newFacing },
    { ...partyById.get('guide-right'), facing: newFacing },
    { ...partyById.get('guide-left'), facing: newFacing },
    { id: 'fs-col', x: colonel.x, y: colonel.y, facing: newFacing },
    { id: 'fs-ltc', x: ltCol.x, y: ltCol.y, facing: newFacing },
    { id: 'fs-smaj', x: seniorMaj.x, y: seniorMaj.y, facing: newFacing },
    { ...partyById.get('fs-jmaj'), facing: newFacing },
  ];

  return { companies, party };
}

/**
 * ¶734-736: at "Battalion, forward" (preparatory, still halted), each
 * company's captain and covering sergeant reposition -- generalizing
 * lesson-iii/marchInRetreat.js's withRetreatReposition() (captain to the old
 * rear-rank slot, now leading; covering sergeant forward into the
 * file-closer line, opposite his own interval) to all 8 companies -- plus
 * the color-bearer advances 6 paces beyond the (now-leading) rank of file
 * closers, the corporals and general guides conform, per ¶736.
 *
 * NOT modeled (flagged, not chased): ¶736's left-wing-captains-shift-within-
 * their-own-company nuance ("shift to the left of their companies if not
 * already there") -- a lateral, WITHIN-company adjustment layered on top of
 * the front/rear-rank swap already modeled here; ¶736's "two file closers
 * nearest [the centre corporal] unite on him" -- naming two specific,
 * unidentified file closers among the 376 company soldiers is not fixed by
 * the source text at 8-company scale, so their normal file-closer positions
 * (already computed by battalionLine()/aboutFace()) are left unchanged
 * rather than guessed at.
 */
function forwardPrepReposition(aboutFacedCompanies, aboutFacedParty, facing) {
  const newFacing = (facing + 180) % 360;
  const newFwd = fwdAxis(newFacing); // the new direction of march
  const across = acrossAxis(facing);

  // Per-company captain / covering-sergeant swap, all 8 companies.
  const updates = new Map();
  for (let i = 1; i <= NUM_COMPANIES; i++) {
    const capId = `c${i}-of-cpt`;
    const covId = `c${i}-nc-cov`;
    const capOld = aboutFacedCompanies.find((p) => p.id === capId);
    const covOld = aboutFacedCompanies.find((p) => p.id === covId);
    if (!capOld || !covOld) continue;
    updates.set(capId, { ...capOld, x: covOld.x, y: covOld.y });
    const covNew = addPx(capOld, newFwd, RANK_GAP + FILE_CLOSER_GAP);
    updates.set(covId, { ...covOld, x: covNew.x, y: covNew.y });
  }
  const companies = aboutFacedCompanies.map((p) => updates.get(p.id) ?? p);

  // Color-bearer: 6 paces beyond the rank of file closers (¶736). His
  // about-face position already sits at rear-rank depth (RANK_GAP behind
  // the front-rank baseline); advancing beyond the file-closer rank adds
  // FILE_CLOSER_GAP, then 6 more paces beyond that.
  const partyById = new Map(aboutFacedParty.map((p) => [p.id, p]));
  const bearerAboutFaced = partyById.get('color-bearer');
  const bearerForward = addPx(bearerAboutFaced, newFwd, FILE_CLOSER_GAP + 6 * PACE_PX);
  const rightCplNew = addPx(bearerForward, across, FILE_INTERVAL);
  const leftCplNew = addPx(bearerForward, across, -FILE_INTERVAL);

  // General guides: abreast with the (now-advanced) color-rank, ¶736 --
  // same depth-offset applied to their own about-face positions (which sit
  // at the same front-rank baseline depth as the color-bearer's pre-advance
  // rear-rank pairing point, offset by the same RANK_GAP + FILE_CLOSER_GAP +
  // 6-pace magnitude along the new line of march).
  const guideRightOld = partyById.get('guide-right');
  const guideLeftOld = partyById.get('guide-left');
  const guideOffsetPx = RANK_GAP + FILE_CLOSER_GAP + 6 * PACE_PX;
  const guideRightNew = addPx(guideRightOld, newFwd, guideOffsetPx);
  const guideLeftNew = addPx(guideLeftOld, newFwd, guideOffsetPx);

  const party = [
    { id: 'color-bearer', x: bearerForward.x, y: bearerForward.y, facing: newFacing },
    { id: 'color-cpl-right', x: rightCplNew.x, y: rightCplNew.y, facing: newFacing },
    { ...partyById.get('color-cpl-centre') }, // ¶736: already replaced the color-bearer in the old-front (now-rear) rank at the about-face instant; no further move
    { id: 'color-cpl-left', x: leftCplNew.x, y: leftCplNew.y, facing: newFacing },
    { id: 'guide-right', x: guideRightNew.x, y: guideRightNew.y, facing: newFacing },
    { id: 'guide-left', x: guideLeftNew.x, y: guideLeftNew.y, facing: newFacing },
    { ...partyById.get('fs-col') }, // ¶742: same functions as the advance; no new figure introduced at this step
    { ...partyById.get('fs-ltc') },
    { ...partyById.get('fs-smaj') },
    { ...partyById.get('fs-jmaj') },
  ];

  return { companies, party };
}

export default {
  id: 'retreat-in-line-of-battle',
  title: 'To March in Retreat, in Line of Battle',
  part: 5,
  article: 5,
  caseyParagraphs: [730, 731, 732, 733, 734, 735, 736, 737, 738, 739, 740, 742, 743],
  commands: [
    { text: '1. Face to the rear.', type: 'preparatory' },
    { text: '2. Battalion, about—FACE.', type: 'execution' },
    { text: '3. Battalion, forward.', type: 'preparatory' },
    { text: '4. MARCH (or double quick—MARCH).', type: 'execution' },
  ],
  reenactorNotes:
    "Structurally this mirrors Article I (the advance in line) applied in reverse, the same relationship the company-scale march-in-retreat drill already has to march-in-line -- but scaled to the FULL Article I cast, not just captain and covering sergeant. The one point every drill-master must get right: at the about-face, the color-bearer and the corporal of his file (the centre corporal) swap positions -- the color-bearer passes into what was the rear rank (now the leading rank), and the centre corporal takes his old front-rank place to re-form the file (¶731). At 'Battalion, forward,' each company's captain and covering sergeant make the identical swap already used at company scale (captain to the old rear-rank slot, now leading; covering sergeant forward into the file-closer line), generalized across all 8 companies, while the color-bearer advances 6 paces beyond the now-leading rank of file closers, the general guides come abreast of him, and the covering sergeants take their post in the line of file closers (¶736). The colonel, lieutenant-colonel, and senior major take the mirror image of their Article I marching posts -- colonel 40 paces behind the color-file (now the tail of the formation), lieutenant-colonel the same distance in front, senior major on the flank of that line (¶733, ¶742's 'same functions' clause). NOT modeled here (flagged, not chased): the marker-relay bookkeeping for a directing battalion (¶734, ¶739) and Article I's mid-march 'point of direction' correction sub-maneuver (¶742, referencing ¶670-677) -- both are optional/conditional elaborations layered on top of this base sequence, not part of it. Also not modeled: ¶736's within-company lateral captain shift for the (now-reversed) left wing, and the naming of two specific file closers to flank the centre corporal -- Casey does not fix which individuals at 8-company scale, so their ordinary file-closer positions are left unchanged rather than guessed at.",

  buildKeyframes: (battalion = DEFAULT_BATTALION) => {
    const companiesHalted = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: FACING });
    const partyHalted = haltedPartyAndStaff(companiesHalted, FACING);

    const { companies: companiesAboutFaced, party: partyAboutFaced } =
      aboutFaceReposition(companiesHalted, partyHalted, FACING);

    const { companies: companiesForward, party: partyForward } =
      forwardPrepReposition(companiesAboutFaced, partyAboutFaced, FACING);

    const newFacing = (FACING + 180) % 360;
    const newFwd = fwdAxis(newFacing);
    const marchDx = newFwd.x * MARCH_DIST_PACES * PACE_PX;
    const marchDy = newFwd.y * MARCH_DIST_PACES * PACE_PX;
    const companiesMarching = translate(companiesForward, { dx: marchDx, dy: marchDy });
    const partyMarching = translate(partyForward, { dx: marchDx, dy: marchDy });

    return [
      {
        label: 'Halted in line, facing front',
        description:
          'The battalion stands halted and correctly aligned in line of battle, facing front. The color-bearer and general guides stand in their habitual posts within the line.',
        caseyRef: '¶730',
        duration: 0,
        positions: [...companiesHalted, ...partyHalted],
        annotations: [],
      },
      {
        label: 'Battalion, about—FACE',
        description:
          'Every man turns 180 degrees in place. The color-bearer passes into what was the rear rank, now leading; the corporal of his file steps aside to let him pass, then takes the color-bearer\'s old place to re-form the file. The colonel takes post 40 paces behind the color-file (now the tail of the formation); the lieutenant-colonel and senior major place themselves the same distance before the rank now leading.',
        caseyRef: '¶730-733',
        duration: 1400,
        positions: [...companiesAboutFaced, ...partyAboutFaced],
        annotations: [],
      },
      {
        label: 'Battalion, forward — captains, covering sergeants, and the color party reposition',
        description:
          'In every company, the captain moves into the rank now leading and the covering sergeant steps back into the line of file closers. The color-bearer advances 6 paces beyond that line, the two general guides come abreast of him, and the covering sergeants take their post in the line of file closers.',
        caseyRef: '¶734-736',
        duration: 1400,
        positions: [...companiesForward, ...partyForward],
        annotations: [],
      },
      {
        label: 'MARCH — battalion marches in retreat',
        description:
          'The battalion marches in retreat on the same principles that govern the advance in line of battle: the color-bearer sets the step and direction, and the centre corporal behind him marches exactly in his trace.',
        caseyRef: '¶737-738',
        duration: 2500,
        positions: [...companiesMarching, ...partyMarching],
        annotations: [],
      },
    ];
  },
};
