import Button from '../common/Button';
import useGameStore from '../../store/gameStore';

export default function ActionButtons() {
  const {
    reportBug, myRole, toggleImpostorPanel,
    proposeCommit, leaveGame, requestHint, unlockedHints,
    commitChancesRemaining,
  } = useGameStore();

  const chances = commitChancesRemaining ?? 2;

  return (
    <div className="flex items-center gap-3 flex-wrap">
      {myRole === 'impostor' && (
        <Button variant="danger" icon="🔧" onClick={toggleImpostorPanel}>
          Sabotage
        </Button>
      )}
      <Button variant="danger" icon="🐛" onClick={reportBug}>
        Report Bug
      </Button>
      {myRole !== 'impostor' && (
        <Button
          variant="secondary"
          icon="📤"
          disabled={chances <= 0}
          onClick={() => {
            try { new Audio('/audio/clock tick.mpeg').play(); } catch {}
            proposeCommit();
          }}
        >
          Commit Code ({chances}/2)
        </Button>
      )}
      {myRole === 'crewmate' && (
        <Button variant="outline" icon="🔮" onClick={requestHint} disabled={unlockedHints?.length >= 3}>
          Mystery Hint ({unlockedHints?.length || 0}/3, -15s)
        </Button>
      )}
      <Button
        variant="outline"
        icon="🚪"
        onClick={() => {
          if (window.confirm('Are you sure you want to leave this match?')) {
            leaveGame();
          }
        }}
      >
        Leave
      </Button>
    </div>
  );
}
