import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PlayerSlot from './PlayerSlot';
import ChatBox from './ChatBox';
import NavBar from './NavBar';
import ProfilePanel from './ProfilePanel';
import StatsPanel from './StatsPanel';
import GameSettings from './GameSettings';
import Button from '../common/Button';
import useGameStore from '../../store/gameStore';

export default function LobbyScreen() {
  const { players, roomCode, hostUid, user, createRoom, joinRoom, startGame, leaveRoom, lobbyTab } = useGameStore();
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState('');
  const maxSlots = 8;
  const emptySlots = maxSlots - players.length;
  const isHost = user?.uid === hostUid;
  const isInRoom = !!roomCode;

  // Auto-join from URL ?room= parameter
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlRoom = params.get('room');
    if (urlRoom && !isInRoom && user?.uid) {
      joinRoom(urlRoom.toUpperCase(), user?.name || 'Player');
    }
  }, [user?.uid]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update URL when room changes
  useEffect(() => {
    if (roomCode) {
      const url = new URL(window.location.href);
      url.searchParams.set('room', roomCode);
      window.history.replaceState({}, '', url.toString());
    } else {
      const url = new URL(window.location.href);
      url.searchParams.delete('room');
      window.history.replaceState({}, '', url.toString());
    }
  }, [roomCode]);

  const getShareLink = () => {
    const url = new URL(window.location.origin);
    url.searchParams.set('room', roomCode);
    return url.toString();
  };

  const copyCode = () => {
    navigator.clipboard?.writeText(roomCode);
    setCopied('code');
    setTimeout(() => setCopied(''), 2000);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(getShareLink());
    setCopied('link');
    setTimeout(() => setCopied(''), 2000);
  };

  const handleCreateRoom = () => {
    createRoom(user?.name || 'Player');
  };

  const handleJoinRoom = () => {
    if (!joinCode.trim()) return;
    joinRoom(joinCode.trim().toUpperCase(), user?.name || 'Player');
  };

  const handleStartGame = () => {
    startGame();
  };

  return (
    <div className="min-h-screen bg-surface p-4 lg:p-8">
      {/* Navigation Bar */}
      <div className="max-w-7xl mx-auto">
        <NavBar />
      </div>

      {/* Tab Content */}
      {lobbyTab === 'profile' ? (
        <div className="max-w-7xl mx-auto">
          <ProfilePanel />
        </div>
      ) : lobbyTab === 'stats' ? (
        <div className="max-w-7xl mx-auto">
          <StatsPanel />
        </div>
      ) : (
        <>
          {/* ──── NOT IN A ROOM YET ──── */}
          {!isInRoom ? (
            <div className="flex items-center justify-center" style={{ minHeight: 'calc(100vh - 140px)' }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-lg w-full"
              >
                <div className="card !shadow-chunky-lg text-center">
                  <span className="text-5xl block mb-4">⚡</span>
                  <h1 className="font-display font-extrabold text-3xl text-on-surface mb-2">
                    <span className="text-primary">{'<'}</span>Code<span className="text-secondary">M👾ng</span>Us<span className="text-primary">{'/>'}</span>
                  </h1>
                  <p className="font-body text-on-surface-variant text-sm mb-8">
                    Create a new room or join an existing one.
                  </p>

                  <div className="space-y-4">
                    <Button variant="primary" size="lg" icon="🚀" onClick={handleCreateRoom} className="w-full">
                      Create Room
                    </Button>

                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-[2px] bg-outline-variant" />
                      <span className="text-xs font-display text-on-surface-variant">OR JOIN</span>
                      <div className="flex-1 h-[2px] bg-outline-variant" />
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={joinCode}
                        onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                        placeholder="Enter room code..."
                        className="input-field !text-center !font-display !font-bold !tracking-widest !text-lg"
                        onKeyDown={(e) => e.key === 'Enter' && handleJoinRoom()}
                      />
                      <Button variant="secondary" icon="🔗" onClick={handleJoinRoom}>
                        Join
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          ) : (
            /* ──── IN A ROOM ──── */
            <>
              {/* Header */}
              <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
                <h1 className="font-display font-extrabold text-4xl lg:text-5xl text-on-surface text-outline-black mb-2">
                  ⚡ CREW ASSEMBLY
                </h1>
                <p className="font-body text-on-surface-variant text-lg">Waiting for players to join the mission...</p>
              </motion.div>

              {/* Room Code Banner */}
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="max-w-md mx-auto mb-10">
                <div className="card-container !bg-secondary-container flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs font-display font-bold uppercase tracking-wider" style={{ color: '#0e2bcf' }}>Room Code</p>
                    <p className="font-display font-extrabold text-2xl text-secondary tracking-widest">{roomCode}</p>
                  </div>
                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={copyCode} className="btn-ghost !px-4 !py-2 !text-xs !rounded-xl">
                      {copied === 'code' ? '✅ Copied!' : '📋 Copy Code'}
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={copyLink} className="btn-ghost !px-4 !py-2 !text-xs !rounded-xl">
                      {copied === 'link' ? '✅ Copied!' : '🔗 Copy Link'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Main Content */}
              <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Player Grid */}
                <div className="lg:col-span-2">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="font-display font-bold text-xl flex items-center gap-2">
                      <span>👥</span> Crew Members
                      <span className="badge-blue">{players.length}/{maxSlots}</span>
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {players.map((player, i) => (
                      <PlayerSlot key={player.uid} player={player} index={i} isHost={player.uid === hostUid} />
                    ))}
                    {Array.from({ length: emptySlots }).map((_, i) => (
                      <PlayerSlot key={`empty-${i}`} isEmpty index={players.length + i} />
                    ))}
                  </div>

                  {/* Game Settings Panel */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="mt-6">
                    <GameSettings isHost={isHost} />
                  </motion.div>

                  {/* Buttons */}
                  <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="mt-8 flex justify-center gap-4">
                    {isHost && (
                      <Button variant="primary" size="lg" icon="🚀" onClick={handleStartGame}
                        disabled={players.length < 2}>
                        {players.length < 2 ? `NEED ${2 - players.length} MORE` : 'START MISSION'}
                      </Button>
                    )}
                    <Button variant="ghost" size="lg" icon="🚪" onClick={leaveRoom}>
                      Leave Room
                    </Button>
                  </motion.div>
                </div>

                {/* Chat */}
                <div className="lg:col-span-1 h-[500px] lg:h-auto">
                  <ChatBox />
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
