// Card bodies for collection grids. Collection wraps each in a link with the card chrome.
// Every layout has a skeleton twin in Shimmer.js (CardSkeleton) with the same box sizes.
import ShimmerImage from './ShimmerImage';

// Columns per layout; all divide the 12-item page evenly.
export const GRID_COLUMNS = {
  media: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  profile: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  stat: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  horizontal: 'md:grid-cols-2 xl:grid-cols-3',
  text: 'md:grid-cols-2 xl:grid-cols-3',
};

export function MediaCard({ image, alt, aspect = 'aspect-[4/3]', fit, fallbackIcon, checkStatus, overlay, title, titleLines = 1, subtitle, meta }) {
  return (
    <>
      <div className="relative">
        <ShimmerImage
          src={image}
          alt={alt}
          fit={fit}
          fallbackIcon={fallbackIcon}
          checkStatus={checkStatus}
          className={`${aspect} w-full`}
        />
        {overlay}
      </div>
      <div className="p-4">
        <h3
          className={`text-sm font-semibold text-fg transition-colors group-hover:text-accent-text ${
            titleLines === 2 ? 'line-clamp-2 min-h-10' : 'truncate'
          }`}
        >
          {title}
        </h3>
        <p className="mt-0.5 truncate text-sm text-muted">{subtitle}</p>
        {meta && <div className="mt-3 flex h-5 items-center justify-between gap-2">{meta}</div>}
      </div>
    </>
  );
}

export function ProfileCard({ image, title, subtitle, meta }) {
  return (
    <div className="flex flex-col items-center p-5 text-center">
      <ShimmerImage src={image} alt="" fallbackIcon="users" className="h-16 w-16 rounded-full" />
      <h3 className="mt-3 w-full truncate text-sm font-semibold text-fg transition-colors group-hover:text-accent-text">
        {title}
      </h3>
      <p className="mt-0.5 w-full truncate text-sm text-muted">{subtitle}</p>
      <div className="mt-3 flex h-5 flex-wrap justify-center gap-1.5 overflow-hidden">{meta}</div>
    </div>
  );
}

export function HorizontalCard({ image, alt, fallbackIcon, title, subtitle, caption, meta }) {
  return (
    <div className="flex gap-4 p-4">
      <ShimmerImage
        src={image}
        alt={alt}
        fallbackIcon={fallbackIcon}
        className="aspect-[2/3] w-20 shrink-0 rounded-md border border-line"
      />
      <div className="min-w-0 flex-1">
        <h3 className="line-clamp-2 text-sm font-semibold text-fg transition-colors group-hover:text-accent-text">
          {title}
        </h3>
        <p className="mt-1 truncate text-sm text-muted">{subtitle}</p>
        <p className="mt-0.5 truncate text-xs text-subtle">{caption}</p>
        {meta && <div className="mt-3 flex h-5 gap-1.5 overflow-hidden">{meta}</div>}
      </div>
    </div>
  );
}

export function TextCard({ eyebrow, children, footer }) {
  return (
    <div className="flex h-full flex-col p-5">
      {eyebrow && <div className="mb-3 flex h-5 items-center gap-2">{eyebrow}</div>}
      <div className="text-[15px] leading-6 text-fg">{children}</div>
      {footer && <div className="mt-auto flex h-5 items-center justify-between gap-2 pt-4 box-content">{footer}</div>}
    </div>
  );
}

export function StatCard({ badge, caption, title, value, stats }) {
  return (
    <div className="p-4">
      <div className="flex h-5 items-center justify-between gap-2">
        {badge}
        <span className="truncate text-xs text-subtle">{caption}</span>
      </div>
      <h3 className="mt-3 truncate text-sm font-semibold text-fg transition-colors group-hover:text-accent-text">
        {title}
      </h3>
      <p className="mt-1 truncate text-xl font-semibold tabular-nums text-fg">{value}</p>
      <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-line pt-3">
        {stats.map((s) => (
          <div key={s.label} className="min-w-0">
            <dt className="truncate text-xs text-subtle">{s.label}</dt>
            <dd className={`mt-0.5 truncate text-sm font-medium tabular-nums ${s.className || 'text-fg'}`}>
              {s.value || '—'}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
