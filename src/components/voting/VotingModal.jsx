import { motion, AnimatePresence } from 'framer-motion';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import Timer from '../game/Timer';
import useGameStore from '../../store/gameStore';
import { useState, useRef, useEffect } from 'react';

export default function VotingModal({ isOpen, onClose }) {
  const { players, voteData, voteResult, castVote, skipVote, chatMessages, sendChat, user } = useGameStore();
  const alivePlayers = voteData?.alivePlayers || players.filter((p) => p.status === 'alive');
  const [myVote, setMyVote] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages]);

  // Reset vote state when modal opens
  useEffect(() => {
    if (isOpen) {
      setMyVote(null);
      setHasVoted(false);
    }
  }, [isOpen]);

  const handleCastVote = (targetUid) => {
    if (hasVoted) return;
    setMyVote(targetUid);
    setHasVoted(true);
    castVote(targetUid);
  };

  const handleSkip = () => {
    if (hasVoted) return;
    setMyVote('skip');
    setHasVoted(true);
    skipVote();
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    sendChat(chatInput.trim());
    setChatInput('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-on-surface/60 backdrop-blur-md z-40" />

          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 80, scale: 0.85 }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-surface-lowest border-3 border-on-surface rounded-3xl shadow-chunky-lg 
              max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col">
              
              {/* Header */}
              <div className="px-8 py-5 border-b-3 border-on-surface gradient-primary flex items-center justify-between">
                <div>
                  <h2 className="font-display font-extrabold text-2xl text-white flex items-center gap-3">
                    🚨 EMERGENCY MEETING
                  </h2>
                  <p className="font-body text-sm text-white/80 mt-1">Who is the impostor among us?</p>
                </div>
                <Timer initialSeconds={voteData?.duration || 60} autoStart={true} label="VOTE TIME" />
              </div>

              {/* Vote Result Banner */}
              {voteResult && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`px-8 py-4 text-center font-display font-bold text-lg
                    ${voteResult.eliminated ? 'bg-primary text-white' : 'bg-surface-high text-on-surface'}`}
                >
                  {voteResult.eliminated
                    ? `${voteResult.eliminated.username} was ejected. They were ${voteResult.eliminated.role === 'impostor' ? 'the IMPOSTOR!' : 'a Crewmate...'}`
                    : 'No one was ejected. (Tie or majority skipped)'}
                </motion.div>
              )}

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6 flex gap-6 min-h-0">
                {/* Vote Grid */}
                <div className="flex-1">
                  <h3 className="font-display font-bold text-sm mb-4 flex items-center gap-2">
                    <span>🗳️</span> CAST YOUR VOTE
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {alivePlayers.map((player) => {
                      const isMyVote = myVote === player.uid;
                      return (
                        <motion.button
                          key={player.uid}
                          whileHover={!hasVoted ? { scale: 1.03, y: -2 } : {}}
                          whileTap={!hasVoted ? { scale: 0.97 } : {}}
                          onClick={() => handleCastVote(player.uid)}
                          className={`player-card text-left relative
                            ${isMyVote ? '!bg-primary-container !border-primary shadow-chunky-red' : ''}
                            ${hasVoted && !isMyVote ? 'opacity-60' : ''}`}
                          disabled={hasVoted}
                        >
                          <Avatar name={player.username} size={42} showBorder={false} />
                          <div className="flex-1 min-w-0">
                            <p className="font-display font-bold text-sm truncate">{player.username}</p>
                          </div>
                          {isMyVote && (
                            <span className="text-xs font-display font-bold text-primary">YOUR VOTE</span>
                          )}
                        </motion.button>
                      );
                    })}
                  </div>

                  <div className="mt-4">
                    <Button variant="ghost" onClick={handleSkip} disabled={hasVoted} icon="⏭️" className="w-full">
                      Skip Vote
                    </Button>
                  </div>
                </div>

                {/* Discussion Chat */}
                <div className="w-[320px] shrink-0 flex flex-col bg-surface-low border-3 border-on-surface rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b-3 border-on-surface bg-surface-high">
                    <h3 className="font-display font-bold text-xs flex items-center gap-2">💬 DISCUSSION</h3>
                  </div>
                  <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0 max-h-[300px]">
                    {chatMessages.map((msg, i) => (
                      <div key={msg.timestamp || i} className="flex gap-2 items-start">
                        <Avatar name={msg.username || msg.player} size={24} showBorder={false} />
                        <div>
                          <span className="font-display font-bold text-[10px]">{msg.username || msg.player}</span>
                          <p className="text-xs font-body text-on-surface leading-relaxed">{msg.message}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <form onSubmit={handleSendChat} className="p-2 border-t-3 border-on-surface bg-surface-container">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Make your case..."
                        className="input-field !text-xs !py-1.5 !rounded-full"
                      />
                      <button type="submit" className="btn-secondary !px-3 !py-1.5 !text-[10px] !rounded-full">
                        Send
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
