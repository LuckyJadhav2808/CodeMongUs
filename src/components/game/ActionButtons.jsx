import Button from '../common/Button';
import useGameStore from '../../store/gameStore';

export default function ActionButtons() {
  const { reportBug, myRole, toggleImpostorPanel, proposeCommit } = useGameStore();

  return (
    <div className="flex items-center gap-3">
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
    </div>
  );
}
