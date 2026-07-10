/**
 * Default 8-company battalion roster, per Casey's S.B. Title V.
 *
 * Companies are numbered 1–8 from the RIGHT (consistent with each company's
 * own file-numbering convention) — company 1 is the rightmost, company 8 the
 * leftmost, forming one continuous line of 160 files when in line of battle.
 *
 * Each company reuses the existing 47-soldier School-of-the-Company roster
 * (`DEFAULT_COMPANY`), with soldier ids namespaced per company (e.g. `c3-of-cpt`)
 * so all 376 individuals have unique ids within the battalion.
 *
 * Color company: Casey (¶2) says "the color-company will generally be
 * designated as the directing company" but does not fix which numbered
 * company that is for an 8-company example. Defaulted here to company 5 (a
 * central position) — configurable, not yet load-bearing for any drill in
 * this project; revisit if a specific article fixes the post.
 */
import { DEFAULT_COMPANY } from './company.js';

export const NUM_COMPANIES = 8;
export const COLOR_COMPANY_INDEX = 5; // 1-based; TBD/configurable, see note above

/**
 * Build the battalion's 8 companies. Each company is
 * { index, isColorCompany, soldiers: [...] } where soldiers mirror
 * DEFAULT_COMPANY's shape with a company-namespaced id.
 */
export function buildBattalionCompanies(numCompanies = NUM_COMPANIES) {
  const companies = [];
  for (let index = 1; index <= numCompanies; index++) {
    const soldiers = DEFAULT_COMPANY.map((s) => ({
      ...s,
      id: `c${index}-${s.id}`,
      companyIndex: index,
    }));
    companies.push({
      index,
      isColorCompany: index === COLOR_COMPANY_INDEX,
      soldiers,
    });
  }
  return companies;
}

export const DEFAULT_BATTALION = buildBattalionCompanies();

/**
 * Field and staff — battalion-level officers/NCOs, not attached to any
 * single company. Roles confirmed in use across battalion-spec/*.md:
 * lieutenant colonel and (senior/junior) major both take active posts in
 * Part First Art. I and Part Second Art. III. Colonel is the battalion
 * commander throughout. Adjutant/sergeant major are NOT yet added — no
 * article read so far calls on them; add when a drill actually needs them
 * (per this project's no-invention discipline).
 */
export const FIELD_AND_STAFF = [
  { id: 'fs-col', role: 'colonel', label: 'Col' },
  { id: 'fs-ltc', role: 'lieutenantColonel', label: 'LtCol' },
  { id: 'fs-smaj', role: 'seniorMajor', label: 'Maj' },
  { id: 'fs-jmaj', role: 'juniorMajor', label: 'Maj' },
];

/**
 * Battalion-level marker duties in Part First Art. I (¶30, ¶32) are performed
 * by existing company NCOs pressed into a battalion-wide role, not new
 * soldiers — mirrors the School-of-Company convention (e.g. fc-5sg as
 * "directing sergeant" in marchInLine.js). "Left sergeant of the battalion"
 * and "left file closer" both refer to the leftmost company's own left-guide
 * NCO (fc-2sg, already "2nd Sergeant / Left Guide" per company.js), since
 * that is the individual nearest the battalion's left flank in either rank.
 */
export function leftSergeantId(numCompanies = NUM_COMPANIES) {
  return `c${numCompanies}-fc-2sg`;
}
