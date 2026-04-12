/**
 * GitXP Ranks & Rewards — Client-side utilities.
 * Pure functions — no server dependency.
 */

export const RANKS = [
  { level: 1, title: 'Intern',          badge: '🟢', xpRequired: 0 },
  { level: 2, title: 'Junior Dev',      badge: '🔵', xpRequired: 500 },
  { level: 3, title: 'Mid-Level',       badge: '🟣', xpRequired: 1500 },
  { level: 4, title: 'Senior Dev',      badge: '🟡', xpRequired: 4000 },
  { level: 5, title: 'Tech Lead',       badge: '🟠', xpRequired: 8000 },
  { level: 6, title: 'Staff Engineer',  badge: '🔴', xpRequired: 15000 },
  { level: 7, title: 'Principal',       badge: '💎', xpRequired: 30000 },
  { level: 8, title: 'CTO',             badge: '👑', xpRequired: 60000 },
];

export const REWARDS = [
  // Rank-based rewards
  { id: 'title_noob',        type: 'title', name: 'Noob Coder',      value: 'Noob Coder',      condition: { type: 'rank', level: 1 }, icon: '🏷️' },
  { id: 'title_squasher',    type: 'title', name: 'Bug Squasher',    value: 'Bug Squasher',    condition: { type: 'rank', level: 2 }, icon: '🐛' },
  { id: 'frame_blue',        type: 'frame', name: 'Blue Frame',      value: '#3046e3',         condition: { type: 'rank', level: 2 }, icon: '🔵' },
  { id: 'title_debugger',    type: 'title', name: 'Debugger',        value: 'Debugger',        condition: { type: 'rank', level: 3 }, icon: '🔍' },
  { id: 'frame_purple',      type: 'frame', name: 'Purple Frame',    value: '#8b5cf6',         condition: { type: 'rank', level: 3 }, icon: '🟣' },
  { id: 'title_reviewer',    type: 'title', name: 'The Reviewer',    value: 'The Reviewer',    condition: { type: 'rank', level: 4 }, icon: '📝' },
  { id: 'frame_gold',        type: 'frame', name: 'Gold Frame',      value: '#f59e0b',         condition: { type: 'rank', level: 4 }, icon: '🟡' },
  { id: 'title_merge',       type: 'title', name: 'Merge Master',    value: 'Merge Master',    condition: { type: 'rank', level: 5 }, icon: '🔀' },
  { id: 'frame_orange',      type: 'frame', name: 'Orange Frame',    value: '#ea580c',         condition: { type: 'rank', level: 5 }, icon: '🟠' },
  { id: 'title_force',       type: 'title', name: 'Force Pusher',    value: 'Force Pusher',    condition: { type: 'rank', level: 6 }, icon: '💪' },
  { id: 'frame_red',         type: 'frame', name: 'Red Frame',       value: '#ba0209',         condition: { type: 'rank', level: 6 }, icon: '🔴' },
  { id: 'title_principal',   type: 'title', name: 'Architect',       value: 'Architect',       condition: { type: 'rank', level: 7 }, icon: '🏛️' },
  { id: 'frame_diamond',     type: 'frame', name: 'Diamond Frame',   value: '#06b6d4',         condition: { type: 'rank', level: 7 }, icon: '💎' },
  { id: 'title_cto',         type: 'title', name: 'Git Overlord',    value: 'Git Overlord',    condition: { type: 'rank', level: 8 }, icon: '👑' },
  { id: 'frame_crown',       type: 'frame', name: 'Crown Frame',     value: '#fbbf24',         condition: { type: 'rank', level: 8 }, icon: '👑' },

  // Achievement-based rewards
  { id: 'title_serial',      type: 'title', name: 'Serial Killer',   value: 'Serial Killer',   condition: { type: 'achievement', id: 'impostor_main' }, icon: '🗡️' },
  { id: 'title_bughunter',   type: 'title', name: '🐛 Bug Hunter',  value: '🐛 Bug Hunter',  condition: { type: 'achievement', id: 'bug_reporter' }, icon: '🐛' },
  { id: 'title_veteran',     type: 'title', name: 'Veteran',         value: 'Veteran',         condition: { type: 'achievement', id: 'veteran' }, icon: '⭐' },
  { id: 'title_saboteur',    type: 'title', name: 'Master Saboteur', value: 'Master Saboteur', condition: { type: 'achievement', id: 'saboteur' }, icon: '💣' },
];

/**
 * Get the rank object for a given XP total.
 */
export function getRankForXp(xp) {
  let rank = RANKS[0];
  for (const r of RANKS) {
    if (xp >= r.xpRequired) rank = r;
    else break;
  }
  return rank;
}

/**
 * Get XP progress towards next rank.
 */
export function getXpProgress(xp) {
  const currentRank = getRankForXp(xp);
  const nextRank = RANKS.find(r => r.xpRequired > xp) || null;

  if (!nextRank) {
    return { currentRank, nextRank: null, current: 0, needed: 0, percent: 100 };
  }

  const current = xp - currentRank.xpRequired;
  const needed = nextRank.xpRequired - currentRank.xpRequired;
  const percent = Math.min(100, Math.round((current / needed) * 100));

  return { currentRank, nextRank, current, needed, percent };
}

/**
 * Get all rewards unlocked by this player.
 */
export function getUnlockedRewards(xp, achievements = []) {
  const rank = getRankForXp(xp);
  return REWARDS.filter(r => {
    if (r.condition.type === 'rank') return rank.level >= r.condition.level;
    if (r.condition.type === 'achievement') return achievements.includes(r.condition.id);
    return false;
  });
}
