import { useState, useEffect, useRef, useCallback } from 'react';

export function useTimer(initialSeconds = 240) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef(null);

  const start = useCallback(() => setIsRunning(true), []);
  const pause = useCallback(() => setIsRunning(false), []);
  const reset = useCallback((newTime) => {
    setSeconds(newTime ?? initialSeconds);
    setIsRunning(false);
  }, [initialSeconds]);

  useEffect(() => {
    if (isRunning && seconds > 0) {
      intervalRef.current = setInterval(() => {
        setSeconds((s) => s - 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning, seconds]);

  useEffect(() => {
    if (seconds <= 0) {
      setIsRunning(false);
      clearInterval(intervalRef.current);
    }
  }, [seconds]);

  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const display = `${minutes}:${secs.toString().padStart(2, '0')}`;
  const isWarning = seconds <= 30 && seconds > 10;
  const isCritical = seconds <= 10;
  const isExpired = seconds <= 0;

  return { seconds, display, isRunning, isWarning, isCritical, isExpired, start, pause, reset };
}
