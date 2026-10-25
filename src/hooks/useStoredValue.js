'use client';
import { useCallback, useSyncExternalStore } from 'react';

const listeners = new Set();

function subscribe(callback) {
  listeners.add(callback);
  window.addEventListener('storage', callback);
  return () => {
    listeners.delete(callback);
    window.removeEventListener('storage', callback);
  };
}

function getStore(kind) {
  try {
    return kind === 'session' ? window.sessionStorage : window.localStorage;
  } catch {
    return null; // storage can be blocked (private mode, sandboxed iframes)
  }
}

export function readStored(key, kind = 'local') {
  try {
    return getStore(kind)?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

export function writeStored(key, value, kind = 'local') {
  try {
    const store = getStore(kind);
    if (value === null) store?.removeItem(key);
    else store?.setItem(key, value);
  } catch {
    // Non-essential preference; ignore write failures
  }
  listeners.forEach((l) => l());
}

/**
 * A string preference persisted in web storage. Renders `fallback` on the server
 * and during hydration, then switches to the stored value.
 */
export function useStoredValue(key, fallback, kind = 'local') {
  const value = useSyncExternalStore(
    subscribe,
    () => readStored(key, kind) ?? fallback,
    () => fallback,
  );
  const setValue = useCallback((next) => writeStored(key, next, kind), [key, kind]);
  return [value, setValue];
}
