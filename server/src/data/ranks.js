/**
 * GitXP Ranks & Rewards — Server-side definitions.
 * Points currency: "GitXP" (Git Experience Points)
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
  { id: 'title_noob',        type: 'title', name: 'Noob Coder',      value: 'Noob Coder',      condition: { type: 'rank', level: 1 } },
  { id: 'title_squasher',    type: 'title', name: 'Bug Squasher',    value: 'Bug Squasher',    condition: { type: 'rank', level: 2 } },
  { id: 'frame_blue',        type: 'frame', name: 'Blue Frame',      value: '#3046e3',         condition: { type: 'rank', level: 2 } },
  { id: 'title_debugger',    type: 'title', name: 'Debugger',        value: 'Debugger',        condition: { type: 'rank', level: 3 } },
  { id: 'frame_purple',      type: 'frame', name: 'Purple Frame',    value: '#8b5cf6',         condition: { type: 'rank', level: 3 } },
  { id: 'title_reviewer',    type: 'title', name: 'The Reviewer',    value: 'The Reviewer',    condition: { type: 'rank', level: 4 } },
  { id: 'frame_gold',        type: 'frame', name: 'Gold Frame',      value: '#f59e0b',         condition: { type: 'rank', level: 4 } },
  { id: 'title_merge',       type: 'title', name: 'Merge Master',    value: 'Merge Master',    condition: { type: 'rank', level: 5 } },
  { id: 'frame_orange',      type: 'frame', name: 'Orange Frame',    value: '#ea580c',         condition: { type: 'rank', level: 5 } },
  { id: 'title_force',       type: 'title', name: 'Force Pusher',    value: 'Force Pusher',    condition: { type: 'rank', level: 6 } },
  { id: 'frame_red',         type: 'frame', name: 'Red Frame',       value: '#ba0209',         condition: { type: 'rank', level: 6 } },
  { id: 'title_principal',   type: 'title', name: 'Architect',       value: 'Architect',       condition: { type: 'rank', level: 7 } },
  { id: 'frame_diamond',     type: 'frame', name: 'Diamond Frame',   value: '#06b6d4',         condition: { type: 'rank', level: 7 } },
  { id: 'title_cto',         type: 'title', name: 'Git Overlord',    value: 'Git Overlord',    condition: { type: 'rank', level: 8 } },
  { id: 'frame_crown',       type: 'frame', name: 'Crown Frame',     value: '#fbbf24',         condition: { type: 'rank', level: 8 } },

  // Achievement-based rewards
  { id: 'title_serial',      type: 'title', name: 'Serial Killer',   value: 'Serial Killer',   condition: { type: 'achievement', id: 'impostor_main' } },
  { id: 'title_bughunter',   type: 'title', name: '🐛 Bug Hunter',  value: '🐛 Bug Hunter',  condition: { type: 'achievement', id: 'bug_reporter' } },
  { id: 'title_veteran',     type: 'title', name: 'Veteran',         value: 'Veteran',         condition: { type: 'achievement', id: 'veteran' } },
  { id: 'title_saboteur',    type: 'title', name: 'Master Saboteur', value: 'Master Saboteur', condition: { type: 'achievement', id: 'saboteur' } },
];

/**
 * XP awarded per action.
 */
export const XP_TABLE = {
  gameCompleted:  50,
  gameWon:        100,
  bugReported:    15,
  correctVote:    40,
  sabotageUsed:   10,
  survived:       25,
  testPassed:     5,
  hintUsed:       -5,
};

/**
 * Get the rank object for a given XP total.
 * @param {number} xp
 * @returns {{ level: number, title: string, badge: string, xpRequired: number }}
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
 * @param {number} xp
 * @returns {{ currentRank: object, nextRank: object|null, current: number, needed: number, percent: number }}
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
 * @param {number} xp
 * @param {string[]} achievements - array of unlocked achievement IDs
 * @returns {object[]}
 */
export function getUnlockedRewards(xp, achievements = []) {
  const rank = getRankForXp(xp);
  return REWARDS.filter(r => {
    if (r.condition.type === 'rank') return rank.level >= r.condition.level;
    if (r.condition.type === 'achievement') return achievements.includes(r.condition.id);
    return false;
  });
}

/**
 * Calculate XP earned for a single player after a game.
 * @param {object} params
 * @returns {{ total: number, breakdown: Array<{label: string, xp: number}> }}
 */
export function calculateXpEarned({ won, survived, bugsReported, correctVotes, sabotagesUsed, testsPassed, hintsUsed }) {
  const breakdown = [];

  breakdown.push({ label: 'Game Completed', xp: XP_TABLE.gameCompleted });

  if (won) {
    breakdown.push({ label: 'Victory!', xp: XP_TABLE.gameWon });
  }

  if (bugsReported > 0) {
    breakdown.push({ label: `Bug Reports (×${bugsReported})`, xp: bugsReported * XP_TABLE.bugReported });
  }

  if (correctVotes > 0) {
    breakdown.push({ label: `Correct Votes (×${correctVotes})`, xp: correctVotes * XP_TABLE.correctVote });
  }

  if (sabotagesUsed > 0) {
    breakdown.push({ label: `Sabotages (×${sabotagesUsed})`, xp: sabotagesUsed * XP_TABLE.sabotageUsed });
  }

  if (survived) {
    breakdown.push({ label: 'Survived to End', xp: XP_TABLE.survived });
  }

  if (won && testsPassed > 0) {
    breakdown.push({ label: `Tests Passed (×${testsPassed})`, xp: testsPassed * XP_TABLE.testPassed });
  }

  if (hintsUsed > 0) {
    breakdown.push({ label: `Hints Used (×${hintsUsed})`, xp: hintsUsed * XP_TABLE.hintUsed });
  }

  const total = Math.max(0, breakdown.reduce((sum, b) => sum + b.xp, 0));

  return { total, breakdown };
}
