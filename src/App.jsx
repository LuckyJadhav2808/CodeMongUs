import { useEffect, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { onAuthStateChanged } from 'firebase/auth';
import { auth as firebaseAuth } from './config/firebase';
import { connectSocket, disconnectSocket } from './services/socket';
import { createUserDoc } from './services/firestoreService';
import useGameStore from './store/gameStore';
import LoginScreen from './components/auth/LoginScreen';
import LobbyScreen from './components/lobby/LobbyScreen';
import RoleReveal from './components/game/RoleReveal';
import GameScreen from './components/game/GameScreen';
import GameEndScreen from './components/game/GameEndScreen';
import './styles/globals.css';

export default function App() {
  const { screen, setScreen, setUser, user, showRoleReveal, toggleImpostorPanel, initSocketListeners, loadUserData } = useGameStore();
  const [authReady, setAuthReady] = useState(false);

  // Firebase auth state listener — also reconnects socket for returning users
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, async (firebaseUser) => {
      if (firebaseUser) {
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || 'Player',
          picture: firebaseUser.photoURL,
          isAnonymous: firebaseUser.isAnonymous,
        };
        setUser(userData);

        // Always ensure socket is connected (covers page refresh & link paste)
        try {
          const token = await firebaseUser.getIdToken();
          connectSocket(token);
          initSocketListeners();
        } catch (err) {
          console.error('Socket reconnect failed:', err);
        }

        // Load user data from Firestore
        await loadUserData(firebaseUser.uid);

        // If we're still on the login screen, move to lobby
        const currentScreen = useGameStore.getState().screen;
        if (currentScreen === 'login') {
          setScreen('lobby');
        }
      } else {
        setUser(null);
        disconnectSocket();
        setScreen('login');
      }
      setAuthReady(true);
    });
    return () => unsubscribe();
  }, [setUser, setScreen, loadUserData]); // eslint-disable-line react-hooks/exhaustive-deps

  // Handle login: get token → connect socket → register listeners
  const handleLogin = async (firebaseUser) => {
    try {
      const token = await firebaseUser.getIdToken();
      connectSocket(token);

      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || 'Player',
        picture: firebaseUser.photoURL,
        isAnonymous: firebaseUser.isAnonymous,
      });

      // Register all socket event listeners
      initSocketListeners();

      // Create/update user doc in Firestore
      createUserDoc(firebaseUser.uid, {
        displayName: firebaseUser.displayName || 'Player',
        email: firebaseUser.email || '',
      }).catch(() => {});

      // Load user data from Firestore
      loadUserData(firebaseUser.uid);

      // Sync profile with backend
      fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:3000'}/api/auth/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ username: firebaseUser.displayName || 'Player' }),
      }).catch(() => {});

      setScreen('lobby');
    } catch (err) {
      console.error('Login flow failed:', err);
    }
  };

  // Ctrl+I to toggle Impostor panel
  useEffect(() => {
    const handler = (e) => {
      if (e.ctrlKey && e.key === 'i') {
        e.preventDefault();
        toggleImpostorPanel();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleImpostorPanel]);

  // Cleanup socket on unmount
  useEffect(() => {
    return () => disconnectSocket();
  }, []);

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface">
        <div className="text-center">
          <span className="text-4xl block mb-3 animate-bounce">🎮</span>
          <p className="font-display font-bold text-on-surface-variant">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {screen === 'login' && <LoginScreen key="login" onLogin={handleLogin} />}
      {screen === 'lobby' && <LobbyScreen key="lobby" />}
      {screen === 'roleReveal' && <RoleReveal key="roleReveal" />}
      {screen === 'game' && <GameScreen key="game" />}
      {screen === 'gameEnd' && <GameEndScreen key="gameEnd" />}
    </AnimatePresence>
  );
}
