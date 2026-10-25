// Skeleton building blocks. Each composite mirrors a real component's box model
// (noted in its comment) so content lands in the same place when data arrives.
import { cardStyles } from './ui';
import { heroStyles, panelStyles } from './Detail';

export function Shimmer({ className = '', style }) {
  // Default radius only when the caller doesn't set one (two rounded-* classes would conflict)
  const radius = /(^|\s)rounded/.test(className) ? '' : 'rounded-md';
  return <div aria-hidden="true" className={`shimmer ${radius} ${className}`} style={style} />;
}

// [line-box height, bar height] per text size, so a skeleton line occupies the same
// vertical space as one line of real text at that size.
const LINE_SIZES = {
  xs: ['h-4', 'h-2.5'],
  sm: ['h-5', 'h-3'],
  'sm-relaxed': ['h-6', 'h-3'],
  base: ['h-6', 'h-3.5'],
  lg: ['h-7', 'h-4'],
  xl: ['h-7', 'h-5'],
  '3xl': ['h-9', 'h-7'],
  title: ['h-8 sm:h-9', 'h-6 sm:h-7'],
  heading: ['h-7 sm:h-8', 'h-5 sm:h-6'],
};

export function Line({ size = 'sm', className = 'w-full', center = false }) {
  const [box, bar] = LINE_SIZES[size];
  return (
    <div aria-hidden="true" className={`flex items-center ${box} ${center ? 'justify-center' : ''}`}>
      <div className={`shimmer rounded ${bar} ${className}`} />
    </div>
  );
}

/** Announces a loading region once to screen readers. */
export function LoadingRegion({ label = 'Loading', className = '', children }) {
  return (
    <div role="status" aria-busy="true" className={className}>
      <span className="sr-only">{label}…</span>
      {children}
    </div>
  );
}

const TEXT_WIDTHS = ['w-full', 'w-11/12', 'w-full', 'w-4/5', 'w-2/3', 'w-5/6'];

/* ---------------------------------------------------------------- Cards (Cards.js) */

export function CardSkeleton({ variant = 'media', aspect = 'aspect-[4/3]', titleLines = 1 }) {
  if (variant === 'profile') {
    return (
      <div className={cardStyles}>
        <div className="flex flex-col items-center p-5">
          <Shimmer className="h-16 w-16 rounded-full" />
          <div className="mt-3 w-full">
            <Line className="w-28" center />
          </div>
          <div className="mt-0.5 w-full">
            <Line className="w-40" center />
          </div>
          <div className="mt-3 flex h-5 gap-1.5">
            <Shimmer className="h-5 w-24" />
            <Shimmer className="h-5 w-12" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'horizontal') {
    return (
      <div className={cardStyles}>
        <div className="flex gap-4 p-4">
          <Shimmer className="aspect-[2/3] w-20 shrink-0" />
          <div className="min-w-0 flex-1">
            <Line className="w-full" />
            <Line className="w-3/5" />
            <div className="mt-1">
              <Line className="w-1/2" />
            </div>
            <div className="mt-0.5">
              <Line size="xs" className="w-1/3" />
            </div>
            <div className="mt-3 flex h-5 gap-1.5">
              <Shimmer className="h-5 w-24" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'text') {
    return (
      <div className={cardStyles}>
        <div className="flex h-full flex-col p-5">
          <div className="mb-3 flex h-5 items-center gap-2">
            <Shimmer className="h-5 w-12" />
          </div>
          {['w-full', 'w-11/12', 'w-3/4'].map((w) => (
            <Line key={w} size="base" className={w} />
          ))}
          <div className="mt-auto box-content flex h-5 items-center justify-between gap-2 pt-4">
            <Shimmer className="h-3 w-24" />
            <Shimmer className="h-5 w-16" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className={cardStyles}>
        <div className="p-4">
          <div className="flex h-5 items-center justify-between">
            <Shimmer className="h-5 w-20" />
            <Shimmer className="h-2.5 w-14" />
          </div>
          <div className="mt-3">
            <Line className="w-3/4" />
          </div>
          <div className="mt-1">
            <Line size="xl" className="w-24" />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3">
            {[0, 1, 2].map((i) => (
              <div key={i}>
                <Line size="xs" className="w-10" />
                <div className="mt-0.5">
                  <Line className="w-14" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`${cardStyles} overflow-hidden`}>
      <Shimmer className={`${aspect} w-full rounded-none`} />
      <div className="p-4">
        {titleLines === 2 ? (
          <>
            <Line className="w-full" />
            <Line className="w-2/3" />
          </>
        ) : (
          <Line className="w-3/4" />
        )}
        <div className="mt-0.5">
          <Line className="w-1/2" />
        </div>
        <div className="mt-3 flex h-5 items-center justify-between gap-2">
          <Shimmer className="h-5 w-16" />
          <Shimmer className="h-3 w-10" />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Table rows (Table.js) */

function CellSkeleton({ kind, index }) {
  switch (kind) {
    case 'media':
    case 'avatar':
      return (
        <div className="flex items-center gap-3">
          <Shimmer className={`h-10 w-10 shrink-0 ${kind === 'avatar' ? 'rounded-full' : 'rounded-lg'}`} />
          <div className="min-w-0 flex-1">
            <Line className="w-28" />
            <Line size="xs" className="w-16" />
          </div>
        </div>
      );
    case 'video':
      return <Shimmer className="h-10 w-16" />;
    case 'badge':
      return <Shimmer className="h-5 w-16" />;
    case 'lines':
      return (
        <>
          <Line className="w-full" />
          <Line className="w-2/3" />
        </>
      );
    default:
      return <Line className={['w-24', 'w-16', 'w-20', 'w-28'][index % 4]} />;
  }
}

export function TableSkeletonRows({ columns, rows = 8 }) {
  return Array.from({ length: rows }).map((_, r) => (
    <tr key={r}>
      {columns.map((col, c) => (
        <td key={col.key} className="px-4 py-3 align-middle">
          <div className={col.align === 'center' ? 'flex justify-center' : col.align === 'right' ? 'flex justify-end' : ''}>
            <CellSkeleton kind={col.skeleton} index={r + c} />
          </div>
        </td>
      ))}
    </tr>
  ));
}

/* ---------------------------------------------------------------- Pagination (Pagination.js) */

export function PaginationSkeleton() {
  return (
    <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
      <Line className="w-44" />
      <div className="flex items-center gap-1">
        <Shimmer className="h-9 w-24 rounded-lg" />
        <Shimmer className="hidden h-9 w-44 rounded-lg sm:block" />
        <Shimmer className="h-9 w-20 rounded-lg" />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------- Detail pages (Detail.js) */

const HERO_MEDIA = {
  square: 'aspect-square w-full rounded-xl',
  landscape: 'aspect-[4/3] w-full rounded-xl',
  portrait: 'aspect-[2/3] w-full rounded-xl',
  avatar: 'h-28 w-28 rounded-full',
};

/** Mirrors <Hero> + <HeroTitle>. Pass extra body skeleton lines as children. */
export function HeroSkeleton({ media = 'square', mediaClassName = 'w-full md:w-64', badges = 2, subtitle = true, children }) {
  return (
    <section className={heroStyles}>
      <div className="flex flex-col gap-6 md:flex-row">
        {media && (
          <div className={`shrink-0 ${mediaClassName}`}>
            <Shimmer className={HERO_MEDIA[media]} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {badges > 0 && (
            <div className="mb-3 flex gap-1.5">
              {Array.from({ length: badges }).map((_, i) => (
                <Shimmer key={i} className={`h-5 ${i % 2 ? 'w-14' : 'w-20'}`} />
              ))}
            </div>
          )}
          <Line size="title" className="w-2/3" />
          {subtitle && (
            <div className="mt-1.5">
              <Line className="w-1/3" />
            </div>
          )}
          {children}
        </div>
      </div>
    </section>
  );
}

/** Mirrors <Panel>. kind: rows (InfoRow list) | text (paragraph) | bars (score bars) */
export function PanelSkeleton({ rows = 4, kind = 'rows', className = '' }) {
  return (
    <section className={`${panelStyles} ${className}`}>
      <header className="flex h-12 items-center gap-2 border-b border-line px-5">
        <Shimmer className="h-4 w-4 rounded" />
        <Shimmer className="h-3 w-32" />
      </header>
      <div className="p-5">
        {kind === 'rows' && (
          <div className="-my-2.5 divide-y divide-line">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex items-center justify-between gap-4 py-2.5">
                <Line className={i % 2 ? 'w-20' : 'w-24'} />
                <Line className={['w-32', 'w-24', 'w-28', 'w-20'][i % 4]} />
              </div>
            ))}
          </div>
        )}
        {kind === 'text' &&
          Array.from({ length: rows }).map((_, i) => (
            <Line key={i} size="sm-relaxed" className={TEXT_WIDTHS[i % TEXT_WIDTHS.length]} />
          ))}
        {kind === 'bars' && (
          <div className="space-y-3">
            {Array.from({ length: rows }).map((_, i) => (
              <div key={i} className="flex h-5 items-center gap-3">
                <Shimmer className="h-3 w-28 shrink-0" />
                <Shimmer className="h-2 flex-1 rounded-full" />
                <Shimmer className="h-3 w-7 shrink-0" />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

/** Mirrors <StatTile>. */
export function StatTileSkeleton() {
  return (
    <div className={`${panelStyles} p-4`}>
      <Line size="xs" className="w-16" />
      <div className="mt-1">
        <Line size="lg" className="w-20" />
      </div>
    </div>
  );
}

/** Mirrors a row of outline buttons (h-9) under a hero. */
export function ActionsSkeleton({ count = 2 }) {
  return (
    <div className="mt-5 flex flex-wrap gap-2">
      {Array.from({ length: count }).map((_, i) => (
        <Shimmer key={i} className={`h-9 rounded-lg ${i ? 'w-28' : 'w-36'}`} />
      ))}
    </div>
  );
}

/** Mirrors a wrapping row of h-6 chips. */
export function ChipsSkeleton({ count = 4, className = 'mt-4' }) {
  return (
    <div className={`flex flex-wrap gap-1.5 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <Shimmer key={i} className={`h-6 rounded-full ${['w-16', 'w-20', 'w-24', 'w-14'][i % 4]}`} />
      ))}
    </div>
  );
}

/** Mirrors <TextFeature> with chips and one action button. */
export function TextFeatureSkeleton({ lines = 3, label = 'Loading' }) {
  return (
    <LoadingRegion label={label}>
      <section className={heroStyles}>
        <div className="mx-auto flex max-w-2xl flex-col items-center py-6 sm:py-10">
          <Shimmer className="h-11 w-11 rounded-xl" />
          <div className="mt-6 w-full">
            {Array.from({ length: lines }).map((_, i) => (
              <div key={i} className="flex h-8 items-center justify-center sm:h-9">
                <div className={`shimmer h-5 rounded sm:h-6 ${['w-full', 'w-11/12', 'w-2/3'][i % 3]}`} />
              </div>
            ))}
          </div>
          <Shimmer className="mt-6 h-5 w-32" />
          <Shimmer className="mt-8 h-9 w-32 rounded-lg" />
        </div>
      </section>
    </LoadingRegion>
  );
}

/* ---------------------------------------------------------------- Chat */

/** Mirrors a conversation row on /chat. */
export function ChatRowSkeleton() {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <Shimmer className="h-10 w-10 shrink-0 rounded-full" />
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between gap-3">
          <Line className="w-32" />
          <Line size="xs" className="w-10" />
        </div>
        <Line className="w-56 max-w-full" />
      </div>
    </div>
  );
}

/** Mirrors the message thread on /chat/[id]. */
export function ChatMessagesSkeleton() {
  const bubbles = [
    { own: false, w: 'w-56', h: 'h-10' },
    { own: true, w: 'w-44', h: 'h-10' },
    { own: false, w: 'w-72', h: 'h-16' },
    { own: true, w: 'w-60', h: 'h-10' },
    { own: false, w: 'w-40', h: 'h-10' },
  ];
  return (
    <div className="space-y-4">
      {bubbles.map((b, i) => (
        <div key={i} className={`flex ${b.own ? 'justify-end' : 'justify-start'}`}>
          <div className={`flex max-w-[75%] flex-col gap-1 ${b.own ? 'items-end' : 'items-start'}`}>
            <Shimmer className={`${b.h} ${b.w} max-w-full rounded-2xl`} />
            <Shimmer className="h-2.5 w-10" />
          </div>
        </div>
      ))}
    </div>
  );
}
