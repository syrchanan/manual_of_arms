// Regenerate src/data/caseyText/battalion.js from casey_v2_full_extract.txt
// (Casey's Infantry Tactics, Vol. II, School of the Battalion / Title V).
//
//   node tools/gen_battalion_text.mjs
//
// Parses the pdftotext extract into a { paragraphNumber: prose } map. Command
// sub-numbers (1./2./3. inside a paragraph) and skirmisher (0-N) paragraphs are
// excluded; page furniture (running heads, bare page numbers) is dropped. A
// forward-jump bound rejects stray OCR fragments (e.g. a duplicate "335." that
// lands near 269 in the extract). The battalion and School-of-Company text use
// separate, colliding number spaces, so the panel lookup is namespaced by
// school (see src/data/caseyText/index.js).

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const REPO_ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC = join(REPO_ROOT, 'casey_v2_full_extract.txt');
const OUT = join(REPO_ROOT, 'manual_of_arms/src/data/caseyText/battalion.js');
const MAX_FORWARD_JUMP = 10;

const lines = readFileSync(SRC, 'utf8').split(/\r?\n/);
const headerRe = /^\s*(SCHOOL OF THE BATTALION|TITLE\b|ARTICLE\b|PART\b)/i;
const pageNumRe = /^\s*\d+\s*$/;
const markerRe = /^\s*(0-)?(\d+)\.\s+(\S.*)$/;

const paras = {};
let cur = null;
let last = 0;

for (const raw of lines) {
  if (headerRe.test(raw) || pageNumRe.test(raw)) continue;
  if (!raw.trim()) { cur = null; continue; } // blank line ends a paragraph/command block
  const m = raw.match(markerRe);
  if (m) {
    const skirmisher = !!m[1];
    const n = Number(m[2]);
    if (!skirmisher && n > last && n <= last + MAX_FORWARD_JUMP) {
      cur = n;
      last = n;
      paras[n] = m[3].trim();
      continue;
    }
    // skirmisher paragraph, command sub-number, or stray fragment -> drop
    cur = null;
    continue;
  }
  if (cur != null) paras[cur] += ' ' + raw.trim();
}

for (const k of Object.keys(paras)) {
  paras[k] = paras[k].replace(/\s+/g, ' ').replace(/\s+([.,;:])/g, '$1').trim();
}

const keys = Object.keys(paras).map(Number).sort((a, b) => a - b);
const body = keys.map((k) => `  ${k}: ${JSON.stringify(paras[k])},`).join('\n');
const out = `// AUTO-GENERATED from casey_v2_full_extract.txt (Casey's Infantry Tactics,
// Vol. II, School of the Battalion / Title V). Do not edit by hand -- regenerate
// with \`node tools/gen_battalion_text.mjs\` if the extract changes. Command
// sub-numbers and skirmisher (0-N) paragraphs are excluded; only mainline
// battalion paragraph prose is included, keyed by paragraph number.
const BATTALION_TEXT = {
${body}
};

export default BATTALION_TEXT;
`;
writeFileSync(OUT, out, 'utf8');
console.log(`wrote ${OUT} - ${keys.length} paragraphs, range ${keys[0]}-${keys[keys.length - 1]}`);
