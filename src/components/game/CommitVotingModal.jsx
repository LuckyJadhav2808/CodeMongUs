import { motion, AnimatePresence } from 'framer-motion';
import useGameStore from '../../store/gameStore';

export default function CommitVotingModal() {
  const { commitProposal, respondToCommitProposal, user } = useGameStore();

  if (!commitProposal) return null;

  const isProposer = user?.uid === commitProposal.proposerUid;
  const hasResult = commitProposal.result !== undefined;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[180] flex items-center justify-center"
        style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
      >
        <motion.div
          initial={{ scale: 0.8, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 30 }}
          className="bg-surface border-3 border-primary rounded-2xl shadow-glow-primary w-[400px] max-w-[90vw] overflow-hidden"
        >
          {/* Header */}
          <div className="px-5 py-4 gradient-primary">
            <h3 className="font-display font-extrabold text-lg text-white flex items-center gap-2">
              <span>📤</span> COMMIT PROPOSAL
            </h3>
            <p className="text-white/80 text-xs font-body mt-1">
              {commitProposal.proposerName} wants to submit the code
            </p>
          </div>

          {/* Vote Progress */}
          <div className="px-5 py-4 space-y-4">
            {/* Progress bars */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-display font-bold text-green-400 flex items-center gap-1">
                  ✅ Approve
                </span>
                <span className="font-mono text-xs text-on-surface-variant">
                  {commitProposal.approvals || 0} / {commitProposal.needed || 1} needed
                </span>
              </div>
              <div className="h-3 bg-surface-low rounded-full overflow-hidden border border-outline-variant">
                <motion.div
                  className="h-full bg-green-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((commitProposal.approvals || 0) / (commitProposal.needed || 1)) * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 200 }}
                />
              </div>

              <div className="flex items-center justify-between text-sm mt-2">
                <span className="font-display font-bold text-red-400 flex items-center gap-1">
                  ❌ Reject
                </span>
                <span className="font-mono text-xs text-on-surface-variant">
                  {commitProposal.rejections || 0}
                </span>
              </div>
              <div className="h-3 bg-surface-low rounded-full overflow-hidden border border-outline-variant">
                <motion.div
                  className="h-full bg-red-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, ((commitProposal.rejections || 0) / Math.max(commitProposal.total || 1, 1)) * 100)}%` }}
                  transition={{ type: 'spring', stiffness: 200 }}
                />
              </div>
            </div>

            {/* Timer hint */}
            <p className="text-[10px] text-on-surface-variant font-mono text-center">
              ⏱️ Auto-expires in 15 seconds
            </p>

            {/* Action Buttons — only for non-proposer crewmates */}
            {isProposer ? (
              <div className="text-center py-2">
                <motion.div
                  animate={{ opacity: [0.5, 1, 0.5] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-sm font-body text-on-surface-variant"
                >
                  Waiting for crew to vote...
                </motion.div>
              </div>
            ) : (
              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => respondToCommitProposal(true)}
                  className="flex-1 py-3 rounded-xl font-display font-bold text-sm border-3 
                    border-green-500 bg-green-500/10 text-green-400 hover:bg-green-500/20 
                    transition-colors cursor-pointer"
                >
                  ✅ Approve
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => respondToCommitProposal(false)}
                  className="flex-1 py-3 rounded-xl font-display font-bold text-sm border-3 
                    border-red-500 bg-red-500/10 text-red-400 hover:bg-red-500/20 
                    transition-colors cursor-pointer"
                >
                  ❌ Reject
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
