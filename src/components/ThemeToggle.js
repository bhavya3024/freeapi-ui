'use client';
import { useEffect, useSyncExternalStore } from 'react';
import Icon from './Icon';
import { buttonStyles } from './ui';
import { readStored, writeStored } from '../hooks/useStoredValue';
import { THEME_KEY } from '../config/theme';

function subscribe(callback) {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  return () => observer.disconnect();
}

const getTheme = () => document.documentElement.dataset.theme || 'light';

export default function ThemeToggle() {
  const theme = useSyncExternalStore(subscribe, getTheme, () => 'light');

  // Follow OS changes until the user picks a theme explicitly
  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = (e) => {
      if (!readStored(THEME_KEY)) document.documentElement.dataset.theme = e.matches ? 'dark' : 'light';
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, []);

  const next = theme === 'dark' ? 'light' : 'dark';

  return (
    <button
      type="button"
      onClick={() => {
        writeStored(THEME_KEY, next);
        document.documentElement.dataset.theme = next;
      }}
      className={buttonStyles({ variant: 'ghost', size: 'icon' })}
      aria-label={`Switch to ${next} theme`}
      title={`Switch to ${next} theme`}
    >
      <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
    </button>
  );
}
