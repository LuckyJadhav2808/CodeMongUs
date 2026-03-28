import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';
import useGameStore from '../../store/gameStore';

export default function ChatBox() {
  const { chatMessages, sendChat, user } = useGameStore();
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [chatMessages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    sendChat(input.trim());
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-surface-lowest border-3 border-on-surface rounded-2xl shadow-chunky overflow-hidden">
      <div className="px-4 py-3 border-b-3 border-on-surface bg-surface-high">
        <h3 className="font-display font-bold text-sm flex items-center gap-2">
          <span>💬</span> CREW CHAT
        </h3>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 min-h-0">
        {chatMessages.length === 0 && (
          <p className="text-center text-xs text-on-surface-variant font-body py-8 opacity-50">
            No messages yet. Say hello!
          </p>
        )}
        {chatMessages.map((msg, i) => (
          <motion.div
            key={msg.timestamp || i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3 items-start"
          >
            <Avatar name={msg.username || msg.player} size={32} showBorder={false} />
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2">
                <span className="font-display font-bold text-xs text-on-surface">{msg.username || msg.player}</span>
              </div>
              <p className="text-sm font-body text-on-surface leading-relaxed break-words">{msg.message}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <form onSubmit={handleSend} className="p-3 border-t-3 border-on-surface bg-surface-container">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="input-field text-sm !py-2 !rounded-full"
          />
          <motion.button whileTap={{ scale: 0.92 }} type="submit" className="btn-secondary !px-4 !py-2 !text-xs !rounded-full">
            Send
          </motion.button>
        </div>
      </form>
    </div>
  );
}
