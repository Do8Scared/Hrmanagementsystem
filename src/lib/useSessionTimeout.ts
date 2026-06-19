import { useEffect, useRef, useCallback } from 'react';

const TIMEOUT_MS = 15 * 60 * 1000; // 15 minutes

export function useSessionTimeout(
  isAuthenticated: boolean,
  onExpire: () => void,
  timeoutMs: number = TIMEOUT_MS
) {
  const timeoutId = useRef<number | null>(null);

  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return;
    
    if (timeoutId.current) {
      window.clearTimeout(timeoutId.current);
    }
    
    timeoutId.current = window.setTimeout(() => {
      onExpire();
    }, timeoutMs);
  }, [isAuthenticated, onExpire, timeoutMs]);

  useEffect(() => {
    if (!isAuthenticated) {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
      return;
    }

    resetTimer();

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    const handleActivity = () => {
      resetTimer();
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      if (timeoutId.current) {
        window.clearTimeout(timeoutId.current);
      }
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isAuthenticated, resetTimer]);
}
