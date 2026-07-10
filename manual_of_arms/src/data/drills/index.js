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
};

export function getBattalionDrill(id) {
  return BATTALION_DRILL_REGISTRY[id] ?? null;
}
