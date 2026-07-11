import { battalionLine, columnOfCompanies } from '../../../engine/battalionFormations.js';
import { DEFAULT_BATTALION } from '../../battalion.js';
import { SCALE, CANVAS_BATTALION } from '../../constants.js';

// ---------------------------------------------------------------------------
// Part Second, Article III (S.B. ¶157-215): "To ploy the battalion into
// close column."
//
// Six distinct commanded variants share one underlying geometry: one
// division (the "directing"/anchor division -- first, fourth, or an
// interior one) stands fast, while the other three divisions face a flank,
// break into files (per ¶111's mechanics, cross-referenced at ¶162), and
// re-enter the column at a fixed guide-to-guide interval, landing in front
// of, or behind, the anchor. Distinct from Articles I/II: the settled
// divisions still face the ORIGINAL front (they are stacked in DEPTH, not
// rotated 90 degrees to march perpendicular) -- a close column is a stack,
// not a marching-flank column. This file models three of the six named
// variants (see reenactorNotes for the other three, not modeled here):
//   - 'rear-first'  (¶159-176): ploy in rear of the first division, right in front
//   - 'front-first' (¶177-189): ploy in front of the first division, left in front
//   - 'rear-fourth' (¶190-191): ploy in rear/front of the fourth division
//
// ¶166/¶168 give two DIFFERENT figures for what looks like the same
// interval -- six paces of guide-to-guide separation while a division is
// entering the column, but four paces as the division-to-division distance
// once the column is settled and dressed -- and the text does not
// reconcile them arithmetically. This animation uses the engine's existing
// 'mass' distanceMode (six paces guide-to-guide, S.B. ¶333) consistently for
// both the entering and the settled state, rather than inventing an
// unverified four-pace settled variant; see reenactorNotes.
// ---------------------------------------------------------------------------

const ORIGIN_X = CANVAS_BATTALION.VIEW_W - 100;
const ORIGIN_Y = 220;
const MASS_INTERVAL = 6 * SCALE.PACE_PX; // ¶166/¶168/¶333

function divisionUnits(battalion) {
  const units = [];
  for (let d = 0; d < 4; d++) {
    units.push({ companies: [battalion[2 * d], battalion[2 * d + 1]] });
  }
  return units;
}

function divisionIds(unit) {
  return unit.companies.flatMap((co) => co.soldiers.map((s) => s.id));
}

export default {
  id: 'ploy-into-column',
  title: 'To Ploy the Battalion into Close Column',
  part: 2,
  article: 3,
  caseyParagraphs: [
    157, 158, 159, 160, 162, 163, 165, 166, 167, 168, 169, 174, 175, 176, 177, 181, 182,
    183, 186, 187, 188, 190, 191, 213,
  ],
  subMovements: [
    { id: 'rear-first', label: 'On the First Division, Right in Front' },
    { id: 'front-first', label: 'On the First Division, Left in Front' },
    { id: 'rear-fourth', label: 'On the Fourth Division, Left in Front' },
  ],
  commands: (subMovement = 'rear-first') => {
    if (subMovement === 'front-first') {
      return [
        { text: '1. Close column by division.', type: 'preparatory' },
        { text: '2. On the first division, left in front.', type: 'preparatory' },
        { text: '3. Battalion, right — FACE.', type: 'preparatory' },
        { text: '4. MARCH (or double quick — MARCH).', type: 'execution' },
        { text: 'Guides, about — FACE.', type: 'execution' },
      ];
    }
    if (subMovement === 'rear-fourth') {
      return [
        { text: '1. Close column by division.', type: 'preparatory' },
        { text: '2. On the fourth division, left (or right) in front.', type: 'preparatory' },
        { text: '3. Battalion left — FACE.', type: 'preparatory' },
        { text: '4. MARCH (or double quick — MARCH).', type: 'execution' },
      ];
    }
    return [
      { text: '1. Close column by division.', type: 'preparatory' },
      { text: '2. On the first division, right in front.', type: 'preparatory' },
      { text: '3. Battalion, right — FACE.', type: 'preparatory' },
      { text: '4. MARCH (or double quick — MARCH).', type: 'execution' },
    ];
  },
  reenactorNotes:
    'Ploying may be executed by company or by division, on the right or left subdivision, or any other subdivision, right or left in front (¶157-158); the worked examples in Casey\'s text assume four divisions, whose principles apply equally to two or three. At the second command all chiefs of division post before their divisions\' centres; the anchor ("directing") division is cautioned to stand fast (or, in the front-ployment case, to continue marching straight), while the other three face the named flank, break into files (per ¶111\'s mechanics, cross-referenced at ¶162), and re-enter the column, each division\'s guide gaining six paces of separation from the guide of the division it follows (¶166, ¶168, ¶182-183) -- described in the text as producing a four-pace division-to-division distance once settled and dressed, a figure Casey does not reconcile arithmetically against the six-pace guide offset; this animation uses six paces throughout (S.B. ¶333\'s standard "close column" mass distance) rather than guess at the unreconciled four-pace figure. Each chief conducts his division until up with the guide of the division ahead, then halts it, faces it front, and commands Left-DRESS (¶167-169); a division not at its proper distance after FRONT stays in place rather than propagate the error (¶170). The lieutenant colonel and senior/junior majors take flanking posts, six paces from and abreast the lead/tail divisions, swapping which flank they assure depending on whether the ployment lands divisions in front of or behind the anchor (¶175-176, ¶186-187, ¶198). This drill models three of Casey\'s six named variants -- ploy in rear of the first division (¶159-176), in front of the first division (¶177-189), and in rear/front of the fourth division (¶190-191) -- and omits, as out of scope for this pass: ploying on an interior division (¶193-198, divisions split and peel to both sides at once), ploying while the battalion is already marching (¶199-212, a "leapfrog" relay combining quick and double-quick time), and ploying at full or half distance instead of close column (¶213). The universal support-arms rule for successive-subdivision movements (¶214) is likewise not modeled.',

  buildKeyframes: (_company, subMovement = 'rear-first', battalion = DEFAULT_BATTALION) => {
    const units = divisionUnits(battalion);
    const inLine = battalionLine(battalion, { originX: ORIGIN_X, originY: ORIGIN_Y, facing: 0 });
    const posMap = new Map(inLine.map((p) => [p.id, p]));
    const inLineIds = inLine.map((p) => p.id);

    const divisionOfId = new Map();
    units.forEach((u, d) => divisionIds(u).forEach((id) => divisionOfId.set(id, d)));

    function divisionOriginPos(d) {
      const rightCo = units[d].companies[0];
      return posMap.get(`c${rightCo.index}-of-cpt`);
    }

    let anchorIdx;
    let finalOrder; // division indices, front-to-back
    let entryOrder; // non-anchor division indices, in time sequence they enter
    let facedFacing;
    let origin;

    if (subMovement === 'front-first') {
      anchorIdx = 0;
      finalOrder = [3, 2, 1, 0];
      entryOrder = [1, 2, 3];
      facedFacing = 90;
      const anchorPos = divisionOriginPos(0);
      origin = { x: anchorPos.x, y: anchorPos.y - 3 * MASS_INTERVAL };
    } else if (subMovement === 'rear-fourth') {
      anchorIdx = 3;
      finalOrder = [3, 2, 1, 0];
      entryOrder = [2, 1, 0];
      facedFacing = 270;
      origin = divisionOriginPos(3);
    } else {
      anchorIdx = 0;
      finalOrder = [0, 1, 2, 3];
      entryOrder = [1, 2, 3];
      facedFacing = 90;
      origin = divisionOriginPos(0);
    }

    const unitsInFinalOrder = finalOrder.map((d) => units[d]);
    const arrived = columnOfCompanies(unitsInFinalOrder, {
      originX: origin.x,
      originY: origin.y,
      facing: 0,
      distanceMode: 'mass',
    });
    const arrivedMap = new Map(arrived.map((p) => [p.id, p]));

    // "Faced" transient: non-anchor divisions turn in place toward the named
    // flank (¶160-163); anchor division and its own position are unaffected.
    const faced = inLine.map((p) => {
      const d = divisionOfId.get(p.id);
      return d !== anchorIdx ? { ...p, facing: facedFacing } : p;
    });
    const facedMap = new Map(faced.map((p) => [p.id, p]));

    function cascadeSnapshot(enteredCount) {
      const entered = new Set(entryOrder.slice(0, enteredCount));
      return inLineIds.map((id) => {
        const d = divisionOfId.get(id);
        if (d === anchorIdx || entered.has(d)) return arrivedMap.get(id);
        return facedMap.get(id);
      });
    }

    const enter1 = cascadeSnapshot(1);
    const enter2 = cascadeSnapshot(2);

    const frontOrRear = subMovement === 'front-first' ? 'front' : 'rear';
    const anchorLabel =
      anchorIdx === 3 ? 'fourth division' : 'first division';

    return [
      {
        label: 'Battalion in line of battle',
        description:
          'The battalion stands in line of battle, 4 divisions (2 companies each) abreast on one continuous line.',
        caseyRef: '¶157-158',
        duration: 0,
        positions: inLine,
        annotations: [],
      },
      {
        label: `Chiefs post; ${anchorLabel} stands fast`,
        description: `At the second command, all chiefs of division post before their divisions' centres. The chief of the ${anchorLabel} cautions it to stand fast; the chiefs of the other three divisions caution them to face ${facedFacing === 90 ? 'right' : 'left'}. In each of the moving divisions, the covering sergeant of the right company replaces its captain in the front rank.`,
        caseyRef: '¶160',
        duration: 900,
        positions: inLine,
        annotations: [],
      },
      {
        label: `Battalion, ${facedFacing === 90 ? 'right' : 'left'} — FACE`,
        description:
          'The three moving divisions face the named flank in place; the anchor division does not move. Each chief hastens to his division\'s flank as the files begin to break, per ¶111\'s mechanics.',
        caseyRef: '¶162-163',
        duration: 1000,
        positions: faced,
        annotations: [],
      },
      {
        label: 'First division enters the column',
        description: `The nearest moving division files into the column, its guide gaining six paces of separation from the guide it follows, entering the column ${frontOrRear === 'front' ? 'in front of' : 'in rear of'} the ${anchorLabel}. Its chief halts it the instant its last file has passed, commands FRONT, then Left-DRESS.`,
        caseyRef: '¶165-169',
        duration: 1500,
        positions: enter1,
        annotations: ['wheelingPoint'],
      },
      {
        label: 'Second division enters the column',
        description:
          'The next division in the relay conducts itself to the guide of the division just established, and is likewise halted, faced front, and dressed.',
        caseyRef: '¶166-169',
        duration: 1500,
        positions: enter2,
        annotations: ['wheelingPoint'],
      },
      {
        label: 'Close column of divisions formed',
        description:
          `All divisions have closed into column, each dressed and aligned parallel to the one preceding it. The lieutenant colonel and senior major post six paces from, and abreast with, the lead and tail divisions.${subMovement === 'front-first' ? ' Guides that faced to the rear during the movement now face to the front, "Guides, about — FACE."' : ''}`,
        caseyRef: subMovement === 'front-first' ? '¶174-176, ¶186-189' : '¶174-176',
        duration: 1200,
        positions: arrived,
        annotations: [],
      },
    ];
  },
};
