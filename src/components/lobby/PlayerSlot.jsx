import { motion } from 'framer-motion';
import Avatar from '../common/Avatar';

export default function PlayerSlot({ player, index, isHost = false, isEmpty = false }) {
  if (isEmpty) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: index * 0.1 }}
        className="flex flex-col items-center justify-center gap-2 p-6 rounded-2xl 
          border-3 border-dashed border-outline-variant bg-surface-container/40 min-h-[160px]"
      >
        <div className="w-14 h-14 rounded-full border-3 border-dashed border-outline-variant 
          flex items-center justify-center text-outline text-2xl">?</div>
        <span className="font-body text-sm text-on-surface-variant">Waiting...</span>
      </motion.div>
    );
  }

  const name = player.username || player.name || 'Player';
  const status = player.status || 'alive';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, type: 'spring', stiffness: 300 }}
      whileHover={{ y: -4, boxShadow: '5px 5px 0px 0px #262f3b' }}
      className="relative flex flex-col items-center gap-3 p-5 rounded-2xl 
        border-3 border-on-surface bg-surface-lowest shadow-chunky cursor-pointer
        transition-colors duration-200"
    >
      {isHost && (
        <div className="absolute -top-3 -right-2 bg-tertiary-container border-2 border-on-surface 
          rounded-full px-2 py-0.5 text-xs font-display font-bold" style={{ color: '#4e4e00' }}>
          👑 HOST
        </div>
      )}
      <div className="relative">
        <Avatar name={name} size={56} />
        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
          style={{ backgroundColor: status === 'alive' ? '#1B9638' : '#b41340' }} />
      </div>
      <span className="font-display font-bold text-sm text-on-surface text-center truncate w-full">
        {name}
      </span>
      <div className="flex items-center gap-1">
        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: status === 'alive' ? '#1B9638' : '#b41340' }} />
        <span className="text-xs font-body text-on-surface-variant capitalize">{status}</span>
      </div>
    </motion.div>
  );
}
