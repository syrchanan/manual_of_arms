// Drill registry — maps route path segments to drill data modules

import marchInLine from './lesson-iii/marchInLine.js';
import haltAndAlign from './lesson-iii/haltAndAlign.js';
import obliqueMarch from './lesson-iii/obliqueMarch.js';
import markTime from './lesson-iii/markTime.js';
import marchInRetreat from './lesson-iii/marchInRetreat.js';

import marchByFlank from './lesson-iv/marchByFlank.js';
import changeDirectionByFile from './lesson-iv/changeDirectionByFile.js';
import haltFaceFront from './lesson-iv/haltFaceFront.js';
import formByFile from './lesson-iv/formByFile.js';
import formByCompany from './lesson-iv/formByCompany.js';

import breakIntoColumn from './lesson-v/breakIntoColumn.js';
import marchInColumn from './lesson-v/marchInColumn.js';
import changeDirection from './lesson-v/changeDirection.js';
import haltColumn from './lesson-v/haltColumn.js';
import formIntoLine from './lesson-v/formIntoLine.js';

import breakPlatoons from './lesson-vi/breakPlatoons.js';
import breakFiles from './lesson-vi/breakFiles.js';
import routeStep from './lesson-vi/routeStep.js';
import countermarch from './lesson-vi/countermarch.js';
import formOnRightLeft from './lesson-vi/formOnRightLeft.js';

import openCloseRanks from './part-i/openCloseRanks.js';

import breakByCompany from './part-ii/breakByCompany.js';
import breakToRear from './part-ii/breakToRear.js';
import ployIntoColumn from './part-ii/ployIntoColumn.js';

import marchInColumnFull from './part-iii/marchInColumnFull.js';
import columnInRoute from './part-iii/columnInRoute.js';
import changeDirectionFull from './part-iii/changeDirectionFull.js';
import haltTheColumn from './part-iii/haltColumn.js';
import closeToHalfOrMass from './part-iii/closeToHalfOrMass.js';
import marchAtHalfOrMass from './part-iii/marchAtHalfOrMass.js';
import changeDirectionHalf from './part-iii/changeDirectionHalf.js';
import changeDirectionMass from './part-iii/changeDirectionMass.js';
import takeDistances from './part-iii/takeDistances.js';
import battalionCountermarch from './part-iii/countermarch.js';
import formDivisions from './part-iii/formDivisions.js';

import determineLine from './part-iv/determineLine.js';
import fullDistanceIntoLine from './part-iv/fullDistanceIntoLine.js';
import halfDistanceIntoLine from './part-iv/halfDistanceIntoLine.js';
import massDeployment from './part-iv/massDeployment.js';

import advanceInLine from './part-v/advanceInLine.js';
import battalionObliqueMarch from './part-v/obliqueMarch.js';
import battalionHaltAndAlign from './part-v/haltAndAlign.js';
import changeDirectionInLine from './part-v/changeDirectionInLine.js';
import battalionMarchInRetreat from './part-v/marchInRetreat.js';
import haltInRetreatFaceFront from './part-v/haltInRetreatFaceFront.js';
import changeDirectionInRetreat from './part-v/changeDirectionInRetreat.js';
import passageOfObstacles from './part-v/passageOfObstacles.js';
import passDefileInRetreat from './part-v/passDefileInRetreat.js';
import battalionMarchByFlank from './part-v/marchByFlank.js';
import formByFileIntoLine from './part-v/formByFileIntoLine.js';

import changeOfFront from './part-v/changeOfFront.js';
import ployDoubleColumn from './part-v/ployDoubleColumn.js';
import ployDivisionColumns from './part-v/ployDivisionColumns.js';
import doubleColumnMovements from './part-v/doubleColumnMovements.js';
import deployDoubleColumn from './part-v/deployDoubleColumn.js';
import formSquareBaseline from './part-v/formSquareBaseline.js';
import formSquareFromLine from './part-v/formSquareFromLine.js';
import formSquareFourRanks from './part-v/formSquareFourRanks.js';
import formSquareOblique from './part-v/formSquareOblique.js';
import columnAgainstCavalry from './part-v/columnAgainstCavalry.js';

export const DRILL_REGISTRY = {
  'march-in-line': marchInLine,
  'halt-and-align': haltAndAlign,
  'oblique-march': obliqueMarch,
  'mark-time': markTime,
  'march-in-retreat': marchInRetreat,

  'march-by-flank': marchByFlank,
  'change-direction-by-file': changeDirectionByFile,
  'halt-face-front': haltFaceFront,
  'form-by-file': formByFile,
  'form-by-company': formByCompany,

  'break-into-column': breakIntoColumn,
  'march-in-column': marchInColumn,
  'change-direction': changeDirection,
  'halt-column': haltColumn,
  'form-into-line': formIntoLine,

  'break-platoons': breakPlatoons,
  'break-files': breakFiles,
  'route-step': routeStep,
  'countermarch': countermarch,
  'form-on-right-left': formOnRightLeft,
};

export function getDrill(id) {
  return DRILL_REGISTRY[id] ?? null;
}

export const BATTALION_DRILL_REGISTRY = {
  'open-close-ranks': openCloseRanks,

  'break-by-company': breakByCompany,
  'break-to-rear': breakToRear,
  'ploy-into-column': ployIntoColumn,

  'march-in-column-full-distance': marchInColumnFull,
  'column-in-route': columnInRoute,
  'change-direction-full-distance': changeDirectionFull,
  'halt-the-column-battalion': haltTheColumn,
  'close-column-half-or-mass': closeToHalfOrMass,
  'march-column-half-or-mass': marchAtHalfOrMass,
  'change-direction-half-distance': changeDirectionHalf,
  'change-direction-closed-in-mass': changeDirectionMass,
  'take-distances': takeDistances,
  'battalion-countermarch': battalionCountermarch,
  'form-divisions': formDivisions,

  'determine-line-of-battle': determineLine,
  'full-distance-into-line': fullDistanceIntoLine,
  'half-distance-into-line': halfDistanceIntoLine,
  'mass-deployment': massDeployment,

  'advance-in-line': advanceInLine,
  'oblique-march-in-line': battalionObliqueMarch,
  'halt-and-align-line': battalionHaltAndAlign,
  'change-direction-in-line': changeDirectionInLine,
  'retreat-in-line-of-battle': battalionMarchInRetreat,
  'halt-in-retreat-face-front': haltInRetreatFaceFront,
  'change-direction-in-retreat': changeDirectionInRetreat,
  'passage-of-obstacles': passageOfObstacles,
  'pass-defile-in-retreat': passDefileInRetreat,
  'march-by-flank-battalion': battalionMarchByFlank,
  'form-by-file-into-line': formByFileIntoLine,

  'change-of-front': changeOfFront,
  'ploy-double-column': ployDoubleColumn,
  'ploy-division-columns': ployDivisionColumns,
  'double-column-movements': doubleColumnMovements,
  'deploy-double-column': deployDoubleColumn,
  'form-square': formSquareBaseline,
  'form-square-from-line': formSquareFromLine,
  'form-square-four-ranks': formSquareFourRanks,
  'form-square-oblique': formSquareOblique,
  'column-against-cavalry': columnAgainstCavalry,
};

export function getBattalionDrill(id) {
  return BATTALION_DRILL_REGISTRY[id] ?? null;
}
