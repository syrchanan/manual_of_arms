// Casey's Infantry Tactics (1862) text data layer.
// School of the Company (Vol. I, ¶84–393) is transcribed per-lesson; School of
// the Battalion (Vol. II / Title V) is auto-generated from the source extract.
// The two use SEPARATE, colliding paragraph-number spaces, so lookups MUST be
// namespaced by school -- a battalion drill's ¶286 is a different paragraph
// from the company's ¶286.

import lesson3 from './lesson3.js';
import lesson4 from './lesson4.js';
import lesson5 from './lesson5.js';
import lesson6 from './lesson6.js';
import battalionText from './battalion.js';

export const CASEY_TEXT = {
  ...lesson3,
  ...lesson4,
  ...lesson5,
  ...lesson6,
};

export const BATTALION_TEXT = battalionText;

/**
 * Look up the transcribed text for a Casey paragraph, in the correct school's
 * number space.
 * @param {number|string} num - paragraph number, e.g. 176
 * @param {'company'|'battalion'} [school='company'] - which manual's numbering
 * @returns {string|undefined} the cleaned paragraph text, or undefined if not found
 */
export function getParagraph(num, school = 'company') {
  return school === 'battalion' ? BATTALION_TEXT[num] : CASEY_TEXT[num];
}
