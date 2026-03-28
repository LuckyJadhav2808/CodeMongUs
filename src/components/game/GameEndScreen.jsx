import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';
import Button from '../common/Button';
import useGameStore from '../../store/gameStore';

export default function GameEndScreen() {
  const { gameResult, players, testResults, setScreen, myRole } = useGameStore();
  const isCrewmateWin = gameResult === 'crewmates';
  const didWin = (myRole === 'impostor' && gameResult === 'impostor') ||
                 (myRole === 'crewmate' && gameResult === 'crewmates');

  const handlePlayAgain = () => {
    useGameStore.setState({
      gameResult: null,
      myRole: null,
      prompt: null,
      testResults: null,
      showVoting: false,
      showImpostorPanel: false,
      chatMessages: [],
      roomCode: null,
      players: [],
      screen: 'lobby',
      gameStartTime: null,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen flex items-center justify-center p-6"
      style={{
        background: isCrewmateWin
          ? 'linear-gradient(160deg, #e9f1ff 0%, #caceff 100%)'
          : 'linear-gradient(160deg, #f3f6ff 0%, #ffefed 100%)',
      }}
    >
      <motion.div
        initial={{ scale: 0.8, y: 40 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="max-w-2xl w-full"
      >
        <div className="card !shadow-chunky-lg text-center">
          <motion.div
            initial={{ scale: 0, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.3, type: 'spring', damping: 10 }}
            className="text-8xl mb-6"
          >
            {isCrewmateWin ? '🏆' : '💀'}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className={`font-display font-extrabold text-4xl md:text-5xl mb-3
              ${isCrewmateWin ? 'text-secondary' : 'text-primary'}`}
            style={{
              textShadow: isCrewmateWin ? '3px 3px 0px #001aa4' : '3px 3px 0px #4f0001',
            }}
          >
            {isCrewmateWin ? 'CREWMATES WIN!' : 'IMPOSTOR WINS!'}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="font-body text-on-surface-variant text-lg mb-8"
          >
            {isCrewmateWin
              ? 'The code was protected. The ship sails on.'
              : 'The codebase has been compromised. Mission failed.'}
          </motion.p>

          {/* Test Results */}
          {testResults && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="mb-6 p-4 rounded-xl border-3 border-on-surface bg-surface-low"
            >
              <p className="font-display font-bold text-sm mb-2">
                Test Results: {testResults.passed}/{testResults.total} passed
              </p>
              {testResults.results?.filter(r => r.visible).map((r, i) => (
                <div key={i} className={`text-xs font-mono p-2 rounded mb-1 ${r.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {r.passed ? '✅' : '❌'} {r.input} → {r.actual}
                </div>
              ))}
            </motion.div>
          )}

          {/* Role Reveals */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}>
            <h3 className="font-display font-bold text-sm mb-4 uppercase tracking-wider text-on-surface-variant">
              Role Reveals
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {players.map((player, i) => (
                <motion.div
                  key={player.uid || i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border-3 
                    ${player.role === 'impostor' ? 'border-primary bg-primary-container/20' : 'border-on-surface bg-surface-lowest'}
                    ${player.status === 'eliminated' ? 'opacity-50' : ''}`}
                >
                  <Avatar name={player.username || player.name} size={44} />
                  <p className="font-display font-bold text-xs truncate w-full text-center">{player.username || player.name}</p>
                  <span className={`text-[10px] font-display font-bold px-2 py-0.5 rounded-full
                    ${player.role === 'impostor' ? 'bg-primary text-on-primary' : 'bg-secondary text-on-secondary'}`}>
                    {player.role === 'impostor' ? '🗡️ IMPOSTOR' : '🛡️ CREW'}
                  </span>
                  {player.status === 'eliminated' && (
                    <span className="text-[9px] text-error">ELIMINATED</span>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }} className="mt-8 flex flex-col items-center gap-3">
            <div className={`text-sm font-display font-bold px-4 py-2 rounded-full border-2 border-on-surface
              ${didWin ? 'bg-secondary-container text-secondary' : 'bg-primary-container text-primary'}`}>
              {didWin ? '🎉 Victory! Stats saved to your profile.' : '💀 Defeated. Better luck next time!'}
            </div>
            <Button variant="primary" size="lg" icon="🔄" onClick={handlePlayAgain}>
              Play Again
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}
