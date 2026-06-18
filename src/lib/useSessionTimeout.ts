import { useEffect, useCallback, useRef } from 'react';

// Default timeout: 15 minutes
const DEFAULT_TIMEOUT = 15 * 60 * 1000;
const STORAGE_KEY = 'hrms_last_activity';

export function useSessionTimeout(
  onTimeout: () => void,
  isAuthenticated: boolean,
  timeoutMs: number = DEFAULT_TIMEOUT
) {
  const onTimeoutRef = useRef(onTimeout);

  // Update the ref so we always call the latest onTimeout function
  useEffect(() => {
    onTimeoutRef.current = onTimeout;
  }, [onTimeout]);

  const updateLastActivity = useCallback(() => {
    if (isAuthenticated) {
      localStorage.setItem(STORAGE_KEY, Date.now().toString());
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated) return;

    // Set initial activity time when logging in
    if (!localStorage.getItem(STORAGE_KEY)) {
      updateLastActivity();
    }

    const events = ['mousemove', 'keydown', 'click', 'scroll', 'touchstart'];
    
    // Throttle the activity updates to avoid hammering localStorage
    let throttleTimer: ReturnType<typeof setTimeout> | null = null;
    const handleActivity = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        updateLastActivity();
        throttleTimer = null;
      }, 1000);
    };

    events.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    const interval = setInterval(() => {
      const lastActivityStr = localStorage.getItem(STORAGE_KEY);
      if (lastActivityStr) {
        const lastActivity = parseInt(lastActivityStr, 10);
        if (Date.now() - lastActivity >= timeoutMs) {
          // Timeout reached
          localStorage.removeItem(STORAGE_KEY);
          onTimeoutRef.current();
        }
      }
    }, 1000); // Check every second

    // Cross-tab synchronization check
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue === null) {
        // Another tab triggered the timeout
        onTimeoutRef.current();
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
      if (throttleTimer) clearTimeout(throttleTimer);
      clearInterval(interval);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, timeoutMs, updateLastActivity]);
}
