import { useRef, useEffect, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import Editor from '@monaco-editor/react';
import useGameStore from '../../store/gameStore';
import { useYjs } from '../../hooks/useYjs';

/**
 * Custom Y.Text ↔ Monaco binding (replaces y-monaco to avoid Vite import issues).
 * Listens for Y.Text observe events → applies edits to Monaco model,
 * and Monaco onDidChangeModelContent → applies edits to Y.Text.
 */
function bindYTextToMonaco(yText, yDoc, editor) {
  let isApplyingRemote = false;
  let isApplyingLocal = false;
  const model = editor.getModel();
  if (!model) return { destroy: () => {} };

  // Sync initial content
  const initialContent = yText.toString();
  if (model.getValue() !== initialContent) {
    isApplyingRemote = true;
    model.setValue(initialContent);
    isApplyingRemote = false;
  }

  // Y.Text → Monaco
  const yObserver = (event) => {
    if (isApplyingLocal) return;
    isApplyingRemote = true;

    const ops = [];
    let index = 0;
    for (const delta of event.delta) {
      if (delta.retain !== undefined) {
        index += delta.retain;
      } else if (delta.insert !== undefined) {
        const pos = model.getPositionAt(index);
        ops.push({
          range: {
            startLineNumber: pos.lineNumber,
            startColumn: pos.column,
            endLineNumber: pos.lineNumber,
            endColumn: pos.column,
          },
          text: delta.insert,
        });
        index += delta.insert.length;
      } else if (delta.delete !== undefined) {
        const startPos = model.getPositionAt(index);
        const endPos = model.getPositionAt(index + delta.delete);
        ops.push({
          range: {
            startLineNumber: startPos.lineNumber,
            startColumn: startPos.column,
            endLineNumber: endPos.lineNumber,
            endColumn: endPos.column,
          },
          text: '',
        });
      }
    }

    if (ops.length > 0) {
      model.pushEditOperations([], ops, () => null);
    }
    isApplyingRemote = false;
  };

  yText.observe(yObserver);

  // Monaco → Y.Text
  const monacoDisposable = model.onDidChangeModelContent((event) => {
    if (isApplyingRemote) return;
    isApplyingLocal = true;

    yDoc.transact(() => {
      // Process changes in reverse order so indices don't shift
      const sortedChanges = [...event.changes].sort(
        (a, b) => b.rangeOffset - a.rangeOffset
      );
      for (const change of sortedChanges) {
        if (change.rangeLength > 0) {
          yText.delete(change.rangeOffset, change.rangeLength);
        }
        if (change.text) {
          yText.insert(change.rangeOffset, change.text);
        }
      }
    });

    isApplyingLocal = false;
  });

  return {
    destroy: () => {
      yText.unobserve(yObserver);
      monacoDisposable.dispose();
    },
  };
}

export default function CodeEditor() {
  const { activeSabotage, prompt, players, roomCode, profile, user } = useGameStore();
  const displayName = profile?.displayName || user?.name || 'Player';
  const { yDoc, yText, isConnected, awareness, broadcastAwareness } = useYjs(roomCode, displayName);
  const [lang, setLang] = useState('javascript');
  const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const bindingRef = useRef(null);
  const decorationsRef = useRef([]);
  const [editorReady, setEditorReady] = useState(false);
  const [remoteUsers, setRemoteUsers] = useState([]);

  const connectedCount = players?.filter(p => p.status === 'alive').length || 0;

  // Listen for awareness changes and update remote cursor decorations
  useEffect(() => {
    if (!awareness) return;

    const onAwarenessChange = () => {
      const users = [];
      awareness.states.forEach((state, clientId) => {
        if (state && state.name) {
          users.push({ ...state, clientId });
        }
      });
      setRemoteUsers(users);
    };

    awareness.listeners.add(onAwarenessChange);
    return () => {
      awareness.listeners.delete(onAwarenessChange);
    };
  }, [awareness]);

  // Track local cursor position and broadcast via awareness
  useEffect(() => {
    if (!editorRef.current || !awareness) return;

    const editor = editorRef.current;
    const disposable = editor.onDidChangeCursorPosition((e) => {
      if (awareness.localState) {
        awareness.localState.cursor = {
          lineNumber: e.position.lineNumber,
          column: e.position.column,
        };
        broadcastAwareness();
      }
    });

    const selDisposable = editor.onDidChangeCursorSelection((e) => {
      if (awareness.localState) {
        awareness.localState.selection = {
          startLineNumber: e.selection.startLineNumber,
          startColumn: e.selection.startColumn,
          endLineNumber: e.selection.endLineNumber,
          endColumn: e.selection.endColumn,
        };
        broadcastAwareness();
      }
    });

    return () => {
      disposable.dispose();
      selDisposable.dispose();
    };
  }, [editorReady, awareness, broadcastAwareness]);

  // Render remote cursor decorations in Monaco
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current) return;

    const editor = editorRef.current;
    const monaco = monacoRef.current;
    const newDecorations = [];

    remoteUsers.forEach((u) => {
      if (!u.cursor) return;

      const { lineNumber, column } = u.cursor;
      const safeId = u.clientId?.replace(/[^a-zA-Z0-9]/g, '') || 'x';

      // Cursor line decoration
      newDecorations.push({
        range: new monaco.Range(lineNumber, column, lineNumber, column + 1),
        options: {
          className: `yjs-cursor-${safeId}`,
          stickiness: monaco.editor.TrackedRangeStickiness.NeverGrowsWhenTypingAtEdges,
        },
      });

      // Whole-line highlight
      newDecorations.push({
        range: new monaco.Range(lineNumber, 1, lineNumber, 1),
        options: {
          isWholeLine: true,
          className: `yjs-cursor-line-${safeId}`,
        },
      });
    });

    decorationsRef.current = editor.deltaDecorations(
      decorationsRef.current,
      newDecorations
    );
  }, [remoteUsers]);

  // Inject dynamic CSS for cursor colors
  useEffect(() => {
    const styleId = 'yjs-cursor-styles';
    let styleEl = document.getElementById(styleId);
    if (!styleEl) {
      styleEl = document.createElement('style');
      styleEl.id = styleId;
      document.head.appendChild(styleEl);
    }

    let css = '';
    remoteUsers.forEach((u) => {
      const safeId = u.clientId?.replace(/[^a-zA-Z0-9]/g, '') || 'x';
      const color = u.color || '#ff6b6b';
      const colorLight = u.colorLight || 'rgba(255,107,107,0.15)';

      css += `
        .yjs-cursor-${safeId} {
          border-left: 2px solid ${color} !important;
        }
        .yjs-cursor-line-${safeId} {
          background-color: ${colorLight} !important;
        }
      `;
    });

    styleEl.textContent = css;
  }, [remoteUsers]);

  // Bind Monaco to Yjs using our custom binding
  useEffect(() => {
    if (!editorRef.current || !yText || !yDoc) return;

    if (bindingRef.current) {
      bindingRef.current.destroy();
      bindingRef.current = null;
    }

    // If the Y.Text is empty and we have starter code, insert it
    if (yText.length === 0 && prompt?.starterCode) {
      yDoc.transact(() => {
        yText.insert(0, prompt.starterCode);
      });
    }

    const binding = bindYTextToMonaco(yText, yDoc, editorRef.current);
    bindingRef.current = binding;

    return () => {
      if (bindingRef.current) {
        bindingRef.current.destroy();
        bindingRef.current = null;
      }
    };
  }, [editorReady, yText, yDoc, prompt]);

  // Handle editor mount
  const handleEditorMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;
    setEditorReady(true);
  }, []);

  // Lag sabotage
  useEffect(() => {
    if (activeSabotage === 'lag' && editorRef.current) {
      editorRef.current.updateOptions({ readOnly: true });
      const timer = setTimeout(() => {
        if (editorRef.current) editorRef.current.updateOptions({ readOnly: false });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activeSabotage]);

  // Typo sabotage
  useEffect(() => {
    if (activeSabotage === 'typo' && yText && yDoc) {
      const content = yText.toString();
      const syntaxChars = [';', '{', '}', '(', ')', '[', ']'];
      const positions = [];
      for (let i = 0; i < content.length; i++) {
        if (syntaxChars.includes(content[i])) positions.push(i);
      }
      const toRemove = [];
      for (let i = 0; i < Math.min(3, positions.length); i++) {
        const idx = Math.floor(Math.random() * positions.length);
        toRemove.push(positions.splice(idx, 1)[0]);
      }
      toRemove.sort((a, b) => b - a);
      if (toRemove.length > 0) {
        yDoc.transact(() => {
          toRemove.forEach(pos => yText.delete(pos, 1));
        });
      }
    }
  }, [activeSabotage, yText, yDoc]);

  return (
    <div className="flex flex-col h-full">
      <div className="editor-container flex flex-col h-full">
        {/* Title Bar */}
        <div className="editor-header">
          <div className="flex gap-1.5">
            <div className="editor-dot bg-error" />
            <div className="editor-dot bg-tertiary-container" />
            <div className="editor-dot bg-green-400" />
          </div>
          <span className="font-mono text-xs text-on-surface-variant ml-2">
            {prompt?.title || 'mission'}.{lang === 'python' ? 'py' : 'js'}
          </span>
          <div className="ml-auto flex items-center gap-2">
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="text-[10px] bg-surface-highest border-2 border-outline-variant rounded-lg px-2 py-1 
                font-mono text-on-surface cursor-pointer"
            >
              <option value="javascript">JavaScript</option>
              <option value="python">Python</option>
            </select>
            <div className="flex items-center gap-1">
              <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`} />
              <span className="text-[10px] font-body text-on-surface-variant">
                {isConnected ? 'SYNCED' : 'OFFLINE'}
              </span>
            </div>
          </div>
        </div>

        {/* Monaco Editor */}
        <div className="flex-1 relative overflow-hidden" style={{ backgroundColor: '#1e1e2e' }}>
          {/* Flashbang Overlay */}
          {activeSabotage === 'flashbang' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.98, 0] }}
              transition={{ duration: 1.5 }}
              className="absolute inset-0 bg-white z-30 pointer-events-none"
            />
          )}

          {/* Ghost Cursor Overlay */}
          {activeSabotage === 'ghost' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.15 }}
              className="absolute inset-0 z-20 pointer-events-none"
              style={{ background: 'repeating-linear-gradient(0deg, transparent 0px, transparent 3px, rgba(100,100,200,0.1) 3px, rgba(100,100,200,0.1) 6px)' }}
            />
          )}

          <Editor
            height="100%"
            language={lang}
            theme="vs-dark"
            onMount={handleEditorMount}
            options={{
              fontSize: 14,
              fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
              minimap: { enabled: false },
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              formatOnPaste: true,
              formatOnType: true,
              wordWrap: 'on',
              automaticLayout: true,
              padding: { top: 12 },
              cursorBlinking: 'smooth',
              cursorSmoothCaretAnimation: 'on',
              smoothScrolling: true,
              renderLineHighlight: 'all',
              bracketPairColorization: { enabled: true },
              tabSize: 2,
            }}
          />

          {/* Remote Cursor Name Tags */}
          {remoteUsers.map((ru) => ru.cursor && (
            <div
              key={ru.clientId}
              className="absolute pointer-events-none z-50 transition-all duration-150"
              style={{
                top: `${(ru.cursor.lineNumber - 1) * 19 + 12 - 18}px`,
                left: `${60 + (ru.cursor.column - 1) * 7.8}px`,
              }}
            >
              <div
                className="text-[9px] font-bold px-1.5 py-0.5 rounded-t-sm rounded-br-sm whitespace-nowrap shadow-sm"
                style={{
                  backgroundColor: ru.color,
                  color: '#fff',
                  fontFamily: "'Inter', sans-serif",
                }}
              >
                {ru.name}
              </div>
            </div>
          ))}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between px-4 py-1.5 border-t border-gray-700" style={{ backgroundColor: '#181825' }}>
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-mono text-blue-300">{lang}</span>
            <span className="text-[10px] font-mono text-gray-500">UTF-8</span>
            <span className={`text-[10px] font-mono ${isConnected ? 'text-green-400' : 'text-red-400'}`}>
              {isConnected ? '● Yjs synced' : '○ Disconnected'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            {remoteUsers.length > 0 && (
              <div className="flex items-center gap-1">
                {remoteUsers.map((ru) => (
                  <div
                    key={ru.clientId}
                    title={ru.name}
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: ru.color }}
                  />
                ))}
              </div>
            )}
            <span className="text-[10px] font-mono text-green-400">
              ● {1 + remoteUsers.length} editing
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
