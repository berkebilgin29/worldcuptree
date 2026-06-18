import { getGroupProfileStats } from '../utils/matching';
import teamsData from './teams.json';

export const REAL_CURRENT_STANDINGS = {
  A: {
    mexico: { O: 1, G: 1, B: 0, M: 0, AG: 2, YG: 0, AV: 2, P: 3 },
    south_korea: { O: 1, G: 1, B: 0, M: 0, AG: 2, YG: 1, AV: 1, P: 3 },
    czech_republic: { O: 1, G: 0, B: 0, M: 1, AG: 1, YG: 2, AV: -1, P: 0 },
    south_africa: { O: 1, G: 0, B: 0, M: 1, AG: 0, YG: 2, AV: -2, P: 0 }
  },
  B: {
    bosnia_herzegovina: { O: 1, G: 0, B: 1, M: 0, AG: 1, YG: 1, AV: 0, P: 1 },
    canada: { O: 1, G: 0, B: 1, M: 0, AG: 1, YG: 1, AV: 0, P: 1 },
    qatar: { O: 0, G: 0, B: 0, M: 0, AG: 0, YG: 0, AV: 0, P: 0 },
    switzerland: { O: 0, G: 0, B: 0, M: 0, AG: 0, YG: 0, AV: 0, P: 0 }
  },
  D: {
    united_states: { O: 1, G: 1, B: 0, M: 0, AG: 4, YG: 1, AV: 3, P: 3 },
    australia: { O: 0, G: 0, B: 0, M: 0, AG: 0, YG: 0, AV: 0, P: 0 },
    turkey: { O: 0, G: 0, B: 0, M: 0, AG: 0, YG: 0, AV: 0, P: 0 },
    paraguay: { O: 1, G: 0, B: 0, M: 1, AG: 1, YG: 4, AV: -3, P: 0 }
  }
};

/**
 * Returns initial groups from teams.json sorted by real current standings.
 */
export function getSortedInitialGroups() {
  const initialGroups = { ...teamsData.groups };
  
  Object.keys(initialGroups).forEach(groupLetter => {
    const groupReal = REAL_CURRENT_STANDINGS[groupLetter];
    if (groupReal) {
      initialGroups[groupLetter] = [...initialGroups[groupLetter]].sort((a, b) => {
        const statA = groupReal[a.id] || { P: 0, AV: 0, AG: 0 };
        const statB = groupReal[b.id] || { P: 0, AV: 0, AG: 0 };
        
        if (statB.P !== statA.P) return statB.P - statA.P;
        if (statB.AV !== statA.AV) return statB.AV - statA.AV;
        return statB.AG - statA.AG;
      });
    }
  });
  
  return initialGroups;
}

/**
 * Returns either real-life current stats or simulated predicted final stats.
 * 
 * @param {string} groupLetter - The group letter (A-L)
 * @param {string} teamId - The team identifier
 * @param {number} rankIndex - The current index in the group standings array
 * @param {boolean} isModified - True if the user has rearranged this group
 */
export function getTeamLiveStats(groupLetter, teamId, rankIndex, isModified) {
  if (!isModified) {
    // Show official current standings from the 2026 World Cup
    const groupReal = REAL_CURRENT_STANDINGS[groupLetter];
    if (groupReal && groupReal[teamId]) {
      const stats = groupReal[teamId];
      return {
        O: stats.O,
        G: stats.G,
        B: stats.B,
        M: stats.M,
        AG: stats.AG,
        YG: stats.YG,
        AV: stats.AV,
        P: stats.P
      };
    }
    // Teams that haven't played yet
    return { O: 0, G: 0, B: 0, M: 0, AG: 0, YG: 0, AV: 0, P: 0 };
  } else {
    // Show predicted final standings based on user's manual ordering
    const profile = getGroupProfileStats(groupLetter, rankIndex);
    return {
      O: 3,
      G: profile.G,
      B: profile.B,
      M: profile.M,
      AG: profile.AG,
      YG: profile.YG,
      AV: profile.AV,
      P: profile.P
    };
  }
}
