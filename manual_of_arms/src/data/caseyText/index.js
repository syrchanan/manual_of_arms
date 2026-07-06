// Casey's Infantry Tactics (1862) — School of the Company text data layer
// Merges the per-lesson paragraph maps (¶84–393) into a single lookup.

import lesson3 from './lesson3.js';
import lesson4 from './lesson4.js';
import lesson5 from './lesson5.js';
import lesson6 from './lesson6.js';

export const CASEY_TEXT = {
  ...lesson3,
  ...lesson4,
  ...lesson5,
  ...lesson6,
};

/**
 * Look up the transcribed text for a Casey's School of the Company paragraph.
 * @param {number|string} num - paragraph number, e.g. 176
 * @returns {string|undefined} the cleaned paragraph text, or undefined if not found
 */
export function getParagraph(num) {
  return CASEY_TEXT[num];
}
