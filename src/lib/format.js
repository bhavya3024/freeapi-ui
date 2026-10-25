const compact = new Intl.NumberFormat('en', { notation: 'compact', maximumFractionDigits: 1 });

/** 1534 -> "1.5K" */
export function formatCompact(value) {
  const n = Number(value);
  return Number.isFinite(n) ? compact.format(n) : '—';
}

/** ISO 8601 duration ("PT1H2M5S") -> "1:02:05" */
export function formatDuration(iso) {
  const m = /^PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?$/.exec(iso || '');
  if (!m) return null;
  const [h, min, s] = [m[1], m[2], m[3]].map((v) => Number(v) || 0);
  const pad = (v) => String(v).padStart(2, '0');
  return h ? `${h}:${pad(min)}:${pad(s)}` : `${min}:${pad(s)}`;
}

/** Date-ish value -> "Jul 19, 2023" (or null when missing/invalid) */
export function formatDate(value) {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
}

/** Upstream ratio strings like "-3.2 %" are negative when they start with a minus. */
export function signTone(value) {
  if (!value) return undefined;
  return String(value).trim().startsWith('-') ? 'negative' : 'positive';
}

/** Google Books serves http:// thumbnails; upgrade them to avoid mixed-content blocks. */
export function httpsUrl(url) {
  return url ? url.replace(/^http:/, 'https:') : url;
}

/** Badge tone for a product's remaining stock. */
export function stockTone(stock) {
  if (stock > 10) return 'emerald';
  if (stock > 0) return 'amber';
  return 'red';
}

const startOfDay = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
const DAY = 24 * 60 * 60 * 1000;

/** Chat list timestamp: "14:05" today, "Yesterday", weekday within a week, else "Jul 19". */
export function formatChatTime(value) {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const days = Math.round((startOfDay(new Date()) - startOfDay(d)) / DAY);
  if (days === 0) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (days === 1) return 'Yesterday';
  if (days < 7) return d.toLocaleDateString('en-US', { weekday: 'short' });
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** Day separator in a message thread: "Today", "Yesterday" or "Wed, Jul 19, 2023". */
export function formatDayLabel(value) {
  const d = new Date(value);
  const days = Math.round((startOfDay(new Date()) - startOfDay(d)) / DAY);
  if (days === 0) return 'Today';
  if (days === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
}
