import Icon from './Icon';

// Static class maps so Tailwind can see every class at build time.
const TILE_TONES = {
  zinc: 'bg-zinc-500/10 text-zinc-600 dark:text-zinc-300',
  blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  violet: 'bg-violet-500/10 text-violet-600 dark:text-violet-400',
  rose: 'bg-rose-500/10 text-rose-600 dark:text-rose-400',
  amber: 'bg-amber-500/10 text-amber-600 dark:text-amber-400',
  indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400',
  pink: 'bg-pink-500/10 text-pink-600 dark:text-pink-400',
  orange: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  teal: 'bg-teal-500/10 text-teal-600 dark:text-teal-400',
  red: 'bg-red-500/10 text-red-600 dark:text-red-400',
  fuchsia: 'bg-fuchsia-500/10 text-fuchsia-600 dark:text-fuchsia-400',
};

const BADGE_TONES = {
  zinc: 'bg-surface-2 text-muted ring-line',
  blue: 'bg-blue-500/10 text-blue-700 ring-blue-500/20 dark:text-blue-300',
  emerald: 'bg-emerald-500/10 text-emerald-700 ring-emerald-500/20 dark:text-emerald-300',
  violet: 'bg-violet-500/10 text-violet-700 ring-violet-500/20 dark:text-violet-300',
  rose: 'bg-rose-500/10 text-rose-700 ring-rose-500/20 dark:text-rose-300',
  amber: 'bg-amber-500/10 text-amber-700 ring-amber-500/25 dark:text-amber-300',
  indigo: 'bg-indigo-500/10 text-indigo-700 ring-indigo-500/20 dark:text-indigo-300',
  pink: 'bg-pink-500/10 text-pink-700 ring-pink-500/20 dark:text-pink-300',
  orange: 'bg-orange-500/10 text-orange-700 ring-orange-500/20 dark:text-orange-300',
  teal: 'bg-teal-500/10 text-teal-700 ring-teal-500/20 dark:text-teal-300',
  red: 'bg-red-500/10 text-red-700 ring-red-500/20 dark:text-red-300',
  fuchsia: 'bg-fuchsia-500/10 text-fuchsia-700 ring-fuchsia-500/20 dark:text-fuchsia-300',
};

const TILE_SIZES = {
  sm: 'w-7 h-7 rounded-md [&>svg]:w-3.5 [&>svg]:h-3.5',
  md: 'w-9 h-9 rounded-lg [&>svg]:w-[18px] [&>svg]:h-[18px]',
  lg: 'w-11 h-11 rounded-xl [&>svg]:w-5 [&>svg]:h-5',
};

export function IconTile({ icon, tone = 'zinc', size = 'md', className = '' }) {
  return (
    <span className={`inline-flex items-center justify-center ${TILE_SIZES[size]} ${TILE_TONES[tone]} ${className}`}>
      <Icon name={icon} />
    </span>
  );
}

export function Badge({ tone = 'zinc', icon, children, className = '' }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset whitespace-nowrap ${BADGE_TONES[tone]} ${className}`}
    >
      {icon && <Icon name={icon} className="w-3 h-3" />}
      {children}
    </span>
  );
}

export function Spinner({ className = 'w-4 h-4' }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block animate-spin rounded-full border-2 border-current border-t-transparent ${className}`}
    />
  );
}

// Neutral pill for tags/traits (h-6; ChipsSkeleton mirrors it)
export function Chip({ children }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full border border-line bg-surface px-2.5 text-xs font-medium text-muted">
      {children}
    </span>
  );
}

const BUTTON_VARIANTS = {
  primary: 'bg-accent text-accent-fg hover:bg-accent-hover shadow-sm',
  secondary: 'bg-surface text-fg border border-line hover:bg-surface-2 shadow-xs',
  ghost: 'text-muted hover:text-fg hover:bg-surface-2',
  danger: 'text-red-600 dark:text-red-400 hover:bg-red-500/10',
};

const BUTTON_SIZES = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  md: 'h-9 px-4 text-sm gap-2',
  lg: 'h-11 px-5 text-sm gap-2',
  icon: 'h-9 w-9',
};

// Returns button classes so the same look can be applied to <button>, <Link> and <a>.
export function buttonStyles({ variant = 'secondary', size = 'md', className = '' } = {}) {
  return `inline-flex items-center justify-center whitespace-nowrap rounded-lg font-medium transition-colors disabled:opacity-50 disabled:pointer-events-none cursor-pointer ${BUTTON_VARIANTS[variant]} ${BUTTON_SIZES[size]} ${className}`;
}

export const cardStyles = 'rounded-xl border border-line bg-surface';

// For pages whose data region scrolls instead of the page: fills the viewport below the
// 3.5rem header minus <main>'s vertical padding (py-6 / lg:py-8, see AppShell). On very short
// screens the min height wins and <main> scrolls as a fallback.
export const fillViewport = 'h-[calc(100dvh-6.5rem)] min-h-[28rem] lg:h-[calc(100dvh-7.5rem)]';

// Width, height and horizontal padding are left to the call site.
export const inputStyles =
  'rounded-lg border border-line bg-surface text-sm text-fg placeholder:text-subtle shadow-xs transition-colors focus:outline-none focus:border-accent focus:ring-3 focus:ring-accent/15 disabled:opacity-60';

export function Avatar({ name, src, size = 'md', tone = 'indigo' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-12 h-12 text-base' };
  if (src) {
    return <img src={src} alt="" className={`${sizes[size]} rounded-full object-cover`} />;
  }
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${sizes[size]} ${TILE_TONES[tone]}`}
    >
      {name?.charAt(0).toUpperCase() || '?'}
    </span>
  );
}

export function EmptyState({ icon = 'search', title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <IconTile icon={icon} size="lg" />
      <p className="mt-4 text-sm font-semibold text-fg">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ title = 'Something went wrong', description, onRetry }) {
  return (
    <div className={`${cardStyles} flex flex-col items-center justify-center px-6 py-14 text-center`}>
      <IconTile icon="alert" tone="red" size="lg" />
      <p className="mt-4 text-sm font-semibold text-fg">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted">{description}</p>}
      {onRetry && (
        <button onClick={onRetry} className={buttonStyles({ className: 'mt-5' })}>
          <Icon name="refresh" />
          Try again
        </button>
      )}
    </div>
  );
}
