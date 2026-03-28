import Button from '../common/Button';
import useGameStore from '../../store/gameStore';

export default function ActionButtons() {
  const { reportBug, submitCode } = useGameStore();

  return (
    <div className="flex items-center gap-3">
      <Button variant="danger" icon="🐛" onClick={reportBug}>
        Report Bug
      </Button>
      <Button variant="secondary" icon="📤" onClick={() => {
        // In a real flow, we'd grab the code from the Yjs doc
        // For now, we trigger submitCode with whatever is in the shared editor
        submitCode(document.querySelector('.code-editor-textarea')?.value || '');
      }}>
        Commit Code
      </Button>
    </div>
  );
}
