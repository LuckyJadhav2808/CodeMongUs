import { useEffect, useRef } from 'react';
import useGameStore from '../store/gameStore';

/**
 * useSoundManager — Centralized audio engine for CodeMongUs.
 * Reacts to Zustand game state changes and plays the appropriate sounds.
 *
 * Audio files expected in /public/audio/:
 *   flashbang.mpeg, heartbeat.mpeg, alarm.mpeg, clock tick.mpeg, lose.mpeg
 */
export default function useSoundManager() {
  const activeSabotage = useGameStore((s) => s.activeSabotage);
  const timerSeconds = useGameStore((s) => s.timerSeconds);
  const screen = useGameStore((s) => s.screen);
  const showVoting = useGameStore((s) => s.showVoting);
  const gameResult = useGameStore((s) => s.gameResult);
  const myRole = useGameStore((s) => s.myRole);

  // Persistent Audio refs so we don't recreate them on every render
  const flashbangRef = useRef(null);
  const alarmRef = useRef(null);
  const tickRef = useRef(null);
  const loseRef = useRef(null);

  // Lazily initialize Audio objects (browser won't load until first use)
  const getAudio = (ref, src, loop = false, volume = 1.0) => {
    if (!ref.current) {
      ref.current = new Audio(src);
      ref.current.loop = loop;
      ref.current.volume = volume;
    }
    return ref.current;
  };

  // ─── Effect 1: Sabotage Sounds ───
  useEffect(() => {
    const flashbang = getAudio(flashbangRef, '/audio/flashbang.mpeg', false, 0.7);
    const alarm = getAudio(alarmRef, '/audio/alarm.mpeg', false, 0.5);

    if (activeSabotage === 'flashbang') {
      flashbang.currentTime = 0;
      flashbang.play().catch(() => {});
    } else if (activeSabotage === 'lag' || activeSabotage === 'ghost' || activeSabotage === 'typo') {
      alarm.currentTime = 0;
      alarm.play().catch(() => {});
    }

    // Stop alarm when sabotage clears
    if (!activeSabotage) {
      alarm.pause();
      alarm.currentTime = 0;
    }
  }, [activeSabotage]);

  // ─── Effect 2: Clock tick during last 10s of voting ───
  useEffect(() => {
    const tick = getAudio(tickRef, '/audio/clock tick.mpeg', true, 0.15);

    if (showVoting && timerSeconds > 0 && timerSeconds <= 10) {
      if (tick.paused) {
        tick.play().catch(() => {});
      }
    } else {
      tick.pause();
      tick.currentTime = 0;
    }

    return () => {
      tick.pause();
      tick.currentTime = 0;
    };
  }, [showVoting, timerSeconds]);

  // ─── Effect 3: Lose sound when impostor wins ───
  useEffect(() => {
    if (!gameResult) return;

    const lose = getAudio(loseRef, '/audio/lose.mpeg', false, 0.8);

    const winner = typeof gameResult === 'string' ? gameResult : gameResult?.winner;

    if (winner === 'impostor') {
      lose.currentTime = 0;
      lose.play().catch(() => {});
    }
  }, [gameResult]);

  // ─── Cleanup all audio on unmount ───
  useEffect(() => {
    return () => {
      [flashbangRef, alarmRef, tickRef, loseRef].forEach((ref) => {
        if (ref.current) {
          ref.current.pause();
          ref.current.currentTime = 0;
        }
      });
    };
  }, []);
}
