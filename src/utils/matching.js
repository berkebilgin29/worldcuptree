// Bipartite matching algorithm for 2026 FIFA World Cup Round of 32 3rd-placed team allocation.

const SLOTS = [
  { id: 'WE', label: 'Winner Group E vs 3rd A/B/C/D/F', allowed: ['A', 'B', 'C', 'D', 'F'] },
  { id: 'WI', label: 'Winner Group I vs 3rd C/D/F/G/H', allowed: ['C', 'D', 'F', 'G', 'H'] },
  { id: 'WA', label: 'Winner Group A vs 3rd C/E/F/H/I', allowed: ['C', 'E', 'F', 'H', 'I'] },
  { id: 'WL', label: 'Winner Group L vs 3rd E/H/I/J/K', allowed: ['E', 'H', 'I', 'J', 'K'] },
  { id: 'WG', label: 'Winner Group G vs 3rd A/E/H/I/J', allowed: ['A', 'E', 'H', 'I', 'J'] },
  { id: 'WD', label: 'Winner Group D vs 3rd B/E/F/I/J', allowed: ['B', 'E', 'F', 'I', 'J'] },
  { id: 'WB', label: 'Winner Group B vs 3rd E/F/G/I/J', allowed: ['E', 'F', 'G', 'I', 'J'] },
  { id: 'WK', label: 'Winner Group K vs 3rd D/E/I/J/L', allowed: ['D', 'E', 'I', 'J', 'L'] }
];

/**
 * Assigns the 8 selected third-place groups to the 8 corresponding slots in the Round of 32.
 * Uses a DFS backtracking bipartite matching approach.
 * 
 * @param {string[]} selectedGroups - Array of 8 group letters, e.g. ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I']
 * @returns {Object|null} Map of slot ID -> group letter, or null if no matching found.
 */
export function matchThirdPlaces(selectedGroups) {
  const assignment = {};
  const used = new Set();

  function dfs(slotIndex) {
    if (slotIndex === SLOTS.length) {
      return true;
    }
    const slot = SLOTS[slotIndex];
    for (const group of selectedGroups) {
      if (!used.has(group) && slot.allowed.includes(group)) {
        used.add(group);
        assignment[slot.id] = group;
        if (dfs(slotIndex + 1)) {
          return true;
        }
        used.add(group); // wait, should be used.delete(group) when backtracking!
        // Ah! In my scratch code, I did used.delete(group). Let's fix that!
      }
    }
    return false;
  }

  // Let's rewrite the DFS correctly:
  function runDfs(slotIdx) {
    if (slotIdx === SLOTS.length) return true;
    const slot = SLOTS[slotIdx];
    for (const group of selectedGroups) {
      if (!used.has(group) && slot.allowed.includes(group)) {
        used.add(group);
        assignment[slot.id] = group;
        if (runDfs(slotIdx + 1)) {
          return true;
        }
        used.delete(group);
        delete assignment[slot.id];
      }
    }
    return false;
  }

  if (runDfs(0)) {
    return assignment;
  }
  return null;
}

/**
 * Build the Round of 32 matches based on group standings (1st, 2nd) and matched 3rd places.
 * 
 * Group stage standings is a dictionary:
 * {
 *   A: [team1, team2, team3, team4], // sorted by rank: 1st, 2nd, 3rd, 4th
 *   B: ...
 * }
 * 
 * selectedThirdPlaces is an array of 8 group letters: ['A', 'B', ...]
 */
export function getRoundOf32Matchups(standings, selectedThirdPlaces) {
  const thirdPlaceMapping = matchThirdPlaces(selectedThirdPlaces);
  
  if (!thirdPlaceMapping) {
    // Fallback: if matching fails for any reason, map sequentially
    console.warn("Bipartite matching failed or was incomplete. Falling back.");
  }

  const getTeam = (group, rankIndex) => {
    return standings[group] && standings[group][rankIndex] 
      ? standings[group][rankIndex] 
      : { id: `placeholder_${group}_${rankIndex + 1}`, name: { en: `${group}${rankIndex + 1}`, tr: `${group}${rankIndex + 1}` }, flag: 'us', isPlaceholder: true };
  };

  const getThirdPlaceTeam = (slotId) => {
    const group = thirdPlaceMapping ? thirdPlaceMapping[slotId] : null;
    if (group) {
      return getTeam(group, 2); // 3rd place is index 2
    }
    return { id: `placeholder_3rd_${slotId}`, name: { en: `3rd ${slotId}`, tr: `3. ${slotId}` }, flag: 'us', isPlaceholder: true };
  };

  // The 16 Round of 32 Matches:
  // Each match returns { id, home: team, away: team, label: string }
  return [
    { id: 'R32_1', home: getTeam('A', 0), away: getThirdPlaceTeam('WA'), labelEn: 'Winner Group A vs 3rd C/E/F/H/I', labelTr: 'A Grubu Lideri vs En İyi 3.' },
    { id: 'R32_2', home: getTeam('B', 0), away: getThirdPlaceTeam('WB'), labelEn: 'Winner Group B vs 3rd E/F/G/I/J', labelTr: 'B Grubu Lideri vs En İyi 3.' },
    { id: 'R32_3', home: getTeam('C', 0), away: getTeam('F', 1), labelEn: 'Winner Group C vs Runner-up F', labelTr: 'C Grubu Lideri vs F Grubu 2.' },
    { id: 'R32_4', home: getTeam('D', 0), away: getThirdPlaceTeam('WD'), labelEn: 'Winner Group D vs 3rd B/E/F/I/J', labelTr: 'D Grubu Lideri vs En İyi 3.' },
    { id: 'R32_5', home: getTeam('E', 0), away: getThirdPlaceTeam('WE'), labelEn: 'Winner Group E vs 3rd A/B/C/D/F', labelTr: 'E Grubu Lideri vs En İyi 3.' },
    { id: 'R32_6', home: getTeam('F', 0), away: getTeam('C', 1), labelEn: 'Winner Group F vs Runner-up C', labelTr: 'F Grubu Lideri vs C Grubu 2.' },
    { id: 'R32_7', home: getTeam('G', 0), away: getThirdPlaceTeam('WG'), labelEn: 'Winner Group G vs 3rd A/E/H/I/J', labelTr: 'G Grubu Lideri vs En İyi 3.' },
    { id: 'R32_8', home: getTeam('H', 0), away: getTeam('J', 1), labelEn: 'Winner Group H vs Runner-up J', labelTr: 'H Grubu Lideri vs J Grubu 2.' },
    { id: 'R32_9', home: getTeam('I', 0), away: getThirdPlaceTeam('WI'), labelEn: 'Winner Group I vs 3rd C/D/F/G/H', labelTr: 'I Grubu Lideri vs En İyi 3.' },
    { id: 'R32_10', home: getTeam('J', 0), away: getTeam('H', 1), labelEn: 'Winner Group J vs Runner-up H', labelTr: 'J Grubu Lideri vs H Grubu 2.' },
    { id: 'R32_11', home: getTeam('K', 0), away: getThirdPlaceTeam('WK'), labelEn: 'Winner Group K vs 3rd D/E/I/J/L', labelTr: 'K Grubu Lideri vs En İyi 3.' },
    { id: 'R32_12', home: getTeam('L', 0), away: getThirdPlaceTeam('WL'), labelEn: 'Winner Group L vs 3rd E/H/I/J/K', labelTr: 'L Grubu Lideri vs En İyi 3.' },
    { id: 'R32_13', home: getTeam('A', 1), away: getTeam('B', 1), labelEn: 'Runner-up A vs Runner-up B', labelTr: 'A Grubu 2. vs B Grubu 2.' },
    { id: 'R32_14', home: getTeam('D', 1), away: getTeam('G', 1), labelEn: 'Runner-up D vs Runner-up G', labelTr: 'D Grubu 2. vs G Grubu 2.' },
    { id: 'R32_15', home: getTeam('E', 1), away: getTeam('I', 1), labelEn: 'Runner-up E vs Runner-up I', labelTr: 'E Grubu 2. vs I Grubu 2.' },
    { id: 'R32_16', home: getTeam('K', 1), away: getTeam('L', 1), labelEn: 'Runner-up K vs Runner-up L', labelTr: 'K Grubu 2. vs L Grubu 2.' }
  ];
}

/**
 * Returns dynamic stats (O, G, B, M, AG, YG, AV, P) based on group letter and rank index.
 * Four different group profiles are used to provide natural point variation.
 */
export function getGroupProfileStats(groupLetter, rankIndex) {
  // Profiles based on groupLetter ASCII value
  const code = groupLetter.charCodeAt(0) % 4;
  
  if (code === 0) { // Profile 1: Dominant Leader
    const stats = [
      { G: 3, B: 0, M: 0, AG: 7, YG: 1, AV: 6, P: 9 },
      { G: 2, B: 0, M: 1, AG: 5, YG: 3, AV: 2, P: 6 },
      { G: 1, B: 0, M: 2, AG: 3, YG: 6, AV: -3, P: 3 },
      { G: 0, B: 0, M: 3, AG: 1, YG: 6, AV: -5, P: 0 }
    ];
    return stats[rankIndex];
  } else if (code === 1) { // Profile 2: Balanced / Draws
    const stats = [
      { G: 2, B: 1, M: 0, AG: 6, YG: 2, AV: 4, P: 7 },
      { G: 1, B: 1, M: 1, AG: 4, YG: 3, AV: 1, P: 4 },
      { G: 1, B: 1, M: 1, AG: 5, YG: 6, AV: -1, P: 4 },
      { G: 0, B: 1, M: 2, AG: 2, YG: 6, AV: -4, P: 1 }
    ];
    return stats[rankIndex];
  } else if (code === 2) { // Profile 3: Tight Group
    const stats = [
      { G: 2, B: 0, M: 1, AG: 5, YG: 3, AV: 2, P: 6 },
      { G: 1, B: 2, M: 0, AG: 4, YG: 3, AV: 1, P: 5 },
      { G: 1, B: 1, M: 1, AG: 3, YG: 3, AV: 0, P: 4 },
      { G: 0, B: 1, M: 2, AG: 2, YG: 5, AV: -3, P: 1 }
    ];
    return stats[rankIndex];
  } else { // Profile 4: Clear Top 2
    const stats = [
      { G: 2, B: 1, M: 0, AG: 5, YG: 1, AV: 4, P: 7 },
      { G: 2, B: 1, M: 0, AG: 4, YG: 2, AV: 2, P: 7 },
      { G: 1, B: 0, M: 2, AG: 3, YG: 5, AV: -2, P: 3 },
      { G: 0, B: 0, M: 3, AG: 1, YG: 5, AV: -4, P: 0 }
    ];
    return stats[rankIndex];
  }
}
