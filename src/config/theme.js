// Kept out of ThemeToggle.js ('use client') so the server layout can inline the script as a string.
export const THEME_KEY = 'freeapi:theme';

// Runs before first paint so the page never flashes the wrong theme.
export const themeBootstrapScript = `(function(){try{var t=localStorage.getItem('${THEME_KEY}');var d=t?t==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;document.documentElement.dataset.theme=d?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}})();`;
