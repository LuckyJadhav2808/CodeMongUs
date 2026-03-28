import { motion } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { auth } from '../../config/firebase';
import Avatar from '../common/Avatar';
import useGameStore from '../../store/gameStore';

const TABS = [
  { id: 'lobby', label: 'Lobby', icon: '⚡' },
  { id: 'profile', label: 'Profile', icon: '👤' },
  { id: 'stats', label: 'Stats', icon: '📊' },
];

export default function NavBar() {
  const { lobbyTab, setLobbyTab, user, profile, setScreen } = useGameStore();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setScreen('login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  const displayName = profile.displayName || user?.name || 'Player';
  const avatarStyle = profile.avatarStyle || 'bottts-neutral';

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-nav border-3 border-on-surface rounded-2xl shadow-chunky mb-6 px-4 py-2
        flex items-center justify-between gap-4"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 mr-4">
        <span className="text-2xl">🎮</span>
        <h1 className="font-display font-extrabold text-lg hidden sm:block">
          <span className="text-primary">{'<'}</span>Code<span className="text-secondary">M👾ng</span>Us<span className="text-primary">{'/>'}</span>
        </h1>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-surface-container rounded-full border-2 border-outline-variant p-1">
        {TABS.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => setLobbyTab(tab.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full font-display font-bold text-sm
              transition-all duration-200
              ${lobbyTab === tab.id
                ? 'bg-secondary text-on-secondary shadow-chunky-sm'
                : 'text-on-surface-variant hover:text-on-surface'}`}
          >
            <span>{tab.icon}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </motion.button>
        ))}
      </div>

      {/* User Info + Logout */}
      <div className="flex items-center gap-3 ml-auto">
        <div className="flex items-center gap-2">
          <Avatar name={displayName} size={36} />
          <span className="font-display font-bold text-sm text-on-surface hidden md:block truncate max-w-[120px]">
            {displayName}
          </span>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex items-center gap-1 px-3 py-1.5 rounded-full border-2 border-outline-variant
            text-on-surface-variant hover:text-error hover:border-error font-display font-bold text-xs
            transition-colors duration-200"
          title="Log out"
        >
          <span>🚪</span>
          <span className="hidden sm:inline">Logout</span>
        </motion.button>
      </div>
    </motion.nav>
  );
}
