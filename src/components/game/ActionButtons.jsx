import Button from '../common/Button';
import useGameStore from '../../store/gameStore';

export default function ActionButtons() {
  const {
    reportBug, myRole, toggleImpostorPanel,
    proposeCommit, leaveGame, requestHint, unlockedHints,
  } = useGameStore();

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
      <Button variant="secondary" icon="📤" onClick={proposeCommit}>
        Commit Code
      </Button>
      {myRole === 'crewmate' && (
        <Button variant="outline" icon="💡" onClick={requestHint}>
          Hint ({unlockedHints?.length || 0}/3)
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
