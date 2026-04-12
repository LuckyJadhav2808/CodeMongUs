import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';
import useGameStore from '../../store/gameStore';

export default function ChatBox() {
  const { chatMessages, sendChat, sendGhostChat, user, players } = useGameStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  // Determine if the local player is a ghost (eliminated or left)
  const myStatus = players?.find(p => p.uid === user?.uid)?.status;
  const amGhost = myStatus && myStatus !== 'alive';

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    // Ghosts use the ghost chat channel; alive players use normal chat
    if (amGhost) {
      sendGhostChat(input.trim());
    } else {
      sendChat(input.trim());
    }
    setInput('');
  };

  // Filter messages: alive players see only non-ghost messages; ghosts see everything
  const visibleMessages = chatMessages.filter(msg => {
    if (!msg.isGhost) return true;        // Normal messages are always visible
    return amGhost;                        // Ghost messages only visible to ghosts
  });

  return (
    <div className="flex flex-col h-full bg-surface-lowest border-3 border-on-surface rounded-2xl shadow-chunky overflow-hidden">
      <div className="px-4 py-3 border-b-3 border-on-surface bg-surface-high">
        <h3 className="font-display font-bold text-sm flex items-center gap-2">
          {amGhost ? (
            <><span>👻</span> GHOST CHAT</>
          ) : (
            <><span>💬</span> CREW CHAT</>
          )}
        </h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {visibleMessages.length === 0 && (
          <p className="text-center text-xs text-on-surface-variant font-body py-8 opacity-50">
            {amGhost ? 'No ghost messages yet. Say boo!' : 'No messages yet. Say hello!'}
          </p>
        )}
        {visibleMessages.map((msg, i) => (
          <motion.div
            key={msg.timestamp || i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className={`flex gap-3 items-start ${msg.isGhost ? 'opacity-75' : ''}`}
          >
            <div className={msg.isGhost ? 'drop-shadow-[0_0_6px_rgba(168,85,247,0.5)]' : ''}>
              <Avatar name={msg.username || msg.player} size={32} showBorder={false} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className={`font-display font-bold text-xs ${msg.isGhost ? 'text-purple-400' : 'text-on-surface'}`}>
                  {msg.isGhost && <span className="mr-1">👻</span>}
                  {msg.username || msg.player}
                </span>
              </div>
              <p className={`text-sm font-body leading-relaxed break-words ${msg.isGhost ? 'text-purple-300 italic' : 'text-on-surface'}`}>
                {msg.message}
              </p>
            </div>
          </motion.div>
        ))}
      </div>

      <form onSubmit={handleSend} className={`p-3 border-t-3 border-on-surface ${amGhost ? 'bg-purple-900/20' : 'bg-surface-container'}`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={amGhost ? 'Whisper from beyond...' : 'Type a message...'}
            className={`input-field text-sm !py-2 !rounded-full ${amGhost ? '!border-purple-500/50' : ''}`}
          />
          <motion.button whileTap={{ scale: 0.92 }} type="submit"
            className={`!px-4 !py-2 !text-xs !rounded-full ${amGhost ? 'btn-secondary !bg-purple-700 hover:!bg-purple-600' : 'btn-secondary'}`}
          >
            {amGhost ? '👻 Send' : 'Send'}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
