import { useState, useCallback } from 'react';

export function useVoting(players) {
  const [votes, setVotes] = useState({});
  const [hasVoted, setHasVoted] = useState(false);
  const [myVote, setMyVote] = useState(null);

  const castVote = useCallback((voterId, targetId) => {
    if (hasVoted) return;
    setVotes((prev) => ({ ...prev, [voterId]: targetId }));
    setMyVote(targetId);
    setHasVoted(true);
    console.log(`🗳️ Player ${voterId} voted for Player ${targetId}`);
  }, [hasVoted]);

  const skipVote = useCallback((voterId) => {
    if (hasVoted) return;
    setVotes((prev) => ({ ...prev, [voterId]: 'skip' }));
    setMyVote('skip');
    setHasVoted(true);
    console.log(`⏭️ Player ${voterId} skipped vote`);
  }, [hasVoted]);

  const resetVotes = useCallback(() => {
    setVotes({});
    setHasVoted(false);
    setMyVote(null);
  }, []);

  const getVoteCount = useCallback((targetId) => {
    return Object.values(votes).filter((v) => v === targetId).length;
  }, [votes]);

  const getResults = useCallback(() => {
    const alivePlayers = players.filter((p) => p.status === 'alive');
    const counts = {};
    alivePlayers.forEach((p) => { counts[p.id] = 0; });
    counts['skip'] = 0;
    Object.values(votes).forEach((targetId) => {
      if (counts[targetId] !== undefined) counts[targetId]++;
    });
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    return sorted;
  }, [votes, players]);

  return { votes, hasVoted, myVote, castVote, skipVote, resetVotes, getVoteCount, getResults };
}
