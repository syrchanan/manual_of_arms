/**
 * Default 20-file company roster — 47 individuals per Casey's S.C. §15–29
 *
 * Roles: captain | lieutenant | sergeant | private
 * Ranks: front | rear | fileCloser
 * Files: 1–20, numbered from the RIGHT (per Casey)
 * Platoons: 1 = files 1–10 (right), 2 = files 11–20 (left)
 * Sections: 1–4 (each platoon split in half)
 */

function platoonOf(file) {
  return file <= 10 ? 1 : 2;
}

function sectionOf(file) {
  if (file <= 5) return 1;
  if (file <= 10) return 2;
  if (file <= 15) return 3;
  return 4;
}

// Build the 40 soldiers in the two ranks (files 1–20, front & rear)
const ranks = [];

// File 1 front rank = Captain
ranks.push({
  id: 'of-cpt',
  role: 'captain',
  rank: 'front',
  file: 1,
  platoon: 1,
  section: 1,
  label: 'Cpt',
});

// File 1 rear rank = Covering Sergeant
ranks.push({
  id: 'nc-cov',
  role: 'sergeant',
  rank: 'rear',
  file: 1,
  platoon: 1,
  section: 1,
  label: '1Sgt',
});

// Files 2–20: privates in front and rear ranks
for (let file = 2; file <= 20; file++) {
  ranks.push({
    id: `fr-${String(file).padStart(2, '0')}`,
    role: 'private',
    rank: 'front',
    file,
    platoon: platoonOf(file),
    section: sectionOf(file),
    label: 'Pvt',
  });
  ranks.push({
    id: `rr-${String(file).padStart(2, '0')}`,
    role: 'private',
    rank: 'rear',
    file,
    platoon: platoonOf(file),
    section: sectionOf(file),
    label: 'Pvt',
  });
}

// File closers (3 officers + 4 NCOs), 7 total
// Positioned 2 paces behind rear rank as file closers
// file positions are approximate per Casey ¶23–29
const fileClosers = [
  // 1st Lieutenant: opposite centre of 4th section (files ~13–15 area) ¶23
  { id: 'fc-1lt', role: 'lieutenant', rank: 'fileCloser', file: 14, platoon: 2, section: 4, label: '1Lt' },
  // 2nd Lieutenant: opposite centre of 1st platoon (files ~5–6) ¶24
  { id: 'fc-2lt', role: 'lieutenant', rank: 'fileCloser', file: 5,  platoon: 1, section: 1, label: '2Lt' },
  // 3rd Lieutenant: opposite centre of 2nd platoon (files ~15) ¶25
  { id: 'fc-3lt', role: 'lieutenant', rank: 'fileCloser', file: 15, platoon: 2, section: 3, label: '3Lt' },
  // 2nd Sergeant (Left Guide): opposite 2nd file from left = file 19 ¶26
  { id: 'fc-2sg', role: 'sergeant', rank: 'fileCloser', file: 19, platoon: 2, section: 4, label: '2Sgt' },
  // 3rd Sergeant: opposite 2nd file from right of 2nd platoon = file 12 ¶27
  { id: 'fc-3sg', role: 'sergeant', rank: 'fileCloser', file: 12, platoon: 2, section: 3, label: '3Sgt' },
  // 4th Sergeant: opposite 2nd file from left of 1st platoon = file 9 ¶28
  { id: 'fc-4sg', role: 'sergeant', rank: 'fileCloser', file: 9,  platoon: 1, section: 2, label: '4Sgt' },
  // 5th Sergeant: opposite 2nd file from right of 1st platoon = file 2 ¶29
  { id: 'fc-5sg', role: 'sergeant', rank: 'fileCloser', file: 2,  platoon: 1, section: 1, label: '5Sgt' },
];

export const DEFAULT_COMPANY = [...ranks, ...fileClosers];

// Convenience: total should be 47
// ranks: 1(cpt) + 1(cov-sgt) + 19(fr privates) + 19(rr privates) = 40
// fileClosers: 7
// Total: 47 ✓
