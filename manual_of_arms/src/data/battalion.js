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

/**
 * Color party — carries and escorts the battalion's color during the march
 * in line of battle. First load-bearing in Part Fifth (S.B. ¶648-743): the
 * color-bearer sets the battalion's step/direction (¶659, ¶738), the 3
 * color-guard corporals flank him in the front rank (¶662) with the centre
 * corporal serving as a secondary alignment reference for both wings
 * (¶664, ¶720, ¶728), and two general guides march abreast of the color-rank
 * (¶661, ¶736).
 *
 * Modeled as NEW personas (like FIELD_AND_STAFF), not pressed from an
 * existing company soldier's slot, unlike leftSergeantId()'s single-duty
 * convention above: the color party marches in its own dedicated position
 * ahead of/within the line for the whole movement, so reusing a private or
 * NCO already required in his own company's rank would create an impossible
 * double-duty. Casey does not fix which individuals fill these posts at
 * 8-company scale (battalion-spec/part-fifth-a.md's "Roster gap" note) —
 * positioned at the color company (COLOR_COMPANY_INDEX) for rendering.
 */
export const COLOR_PARTY = [
  { id: 'color-bearer', role: 'colorBearer', label: 'Clr' },
  { id: 'color-cpl-right', role: 'corporal', label: 'Cpl' },
  { id: 'color-cpl-centre', role: 'corporal', label: 'Cpl' }, // secondary alignment reference, ¶664/720/728
  { id: 'color-cpl-left', role: 'corporal', label: 'Cpl' },
  { id: 'guide-right', role: 'sergeant', label: 'Gd' },
  { id: 'guide-left', role: 'sergeant', label: 'Gd' },
];
