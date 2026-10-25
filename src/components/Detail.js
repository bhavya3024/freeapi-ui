// Layout primitives shared by the /[collection]/[id] pages. Their skeleton twins live in Shimmer.js;
// keep the two in sync so content doesn't shift when data arrives.
import Link from 'next/link';
import BackLink from './BackLink';
import Icon from './Icon';
import { ErrorState, IconTile, buttonStyles } from './ui';

export const heroStyles = 'rounded-2xl border border-line bg-surface p-4 sm:p-6';
export const panelStyles = 'rounded-xl border border-line bg-surface';

export function DetailLayout({ slug, label, width = 'max-w-5xl', children }) {
  return (
    <div className={`mx-auto ${width}`}>
      <BackLink slug={slug} label={label} />
      <div className="mt-4 space-y-6">{children}</div>
    </div>
  );
}

/**
 * Picks skeleton / error / content for a useResource() result.
 * `children` is a function of the loaded data.
 */
export function DetailBody({ resource, noun, skeleton, children }) {
  const { loading, error, data, reload } = resource;
  if (loading) return skeleton;
  if (!data) {
    const notFound = !error || error.response?.status === 404;
    return (
      <ErrorState
        title={notFound ? `This ${noun} doesn't exist` : `Couldn't load this ${noun}`}
        description={
          notFound ? `FreeAPI has no ${noun} with this ID.` : 'The request to FreeAPI failed. Check your connection and try again.'
        }
        onRetry={notFound ? undefined : reload}
      />
    );
  }
  return children(data);
}

export function Hero({ media, mediaClassName = 'w-full md:w-64', children }) {
  return (
    <section className={`${heroStyles} animate-fade-in`}>
      <div className="flex flex-col gap-6 md:flex-row">
        {media && <div className={`shrink-0 ${mediaClassName}`}>{media}</div>}
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </section>
  );
}

export function HeroTitle({ badges, title, subtitle }) {
  return (
    <>
      {badges && <div className="mb-3 flex flex-wrap items-center gap-1.5">{badges}</div>}
      <h1 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
    </>
  );
}

export function Panel({ title, icon, action, children, className = '', bodyClassName = 'p-5' }) {
  return (
    <section className={`${panelStyles} animate-fade-in ${className}`}>
      {title && (
        <header className="flex h-12 items-center gap-2 border-b border-line px-5">
          {icon && <Icon name={icon} className="w-4 h-4 text-subtle" />}
          <h2 className="text-sm font-semibold text-fg">{title}</h2>
          {action && <div className="ml-auto">{action}</div>}
        </header>
      )}
      <div className={bodyClassName}>{children}</div>
    </section>
  );
}

export function InfoList({ children }) {
  return <dl className="-my-2.5 divide-y divide-line">{children}</dl>;
}

const isBlank = (v) => v === undefined || v === null || v === '';

export function InfoRow({ label, children, mono = false }) {
  return (
    <div className="flex items-baseline justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-sm text-muted">{label}</dt>
      <dd
        className={`min-w-0 break-words text-right text-sm font-medium text-fg ${mono ? 'font-mono text-[13px]' : ''}`}
      >
        {isBlank(children) ? '—' : children}
      </dd>
    </div>
  );
}

const STAT_TONES = {
  positive: 'text-emerald-600 dark:text-emerald-400',
  negative: 'text-rose-600 dark:text-rose-400',
};

export function StatTile({ label, value, tone }) {
  return (
    <div className={`${panelStyles} p-4 animate-fade-in`}>
      <p className="truncate text-xs font-medium text-muted">{label}</p>
      <p className={`mt-1 truncate text-lg font-semibold tabular-nums ${STAT_TONES[tone] || 'text-fg'}`}>
        {isBlank(value) ? '—' : value}
      </p>
    </div>
  );
}

/** Centered reading layout for text-only records (jokes, quotes). Skeleton: TextFeatureSkeleton. */
export function TextFeature({ icon, tone, children, footer }) {
  return (
    <section className={`${heroStyles} animate-fade-in`}>
      <div className="mx-auto flex max-w-2xl flex-col items-center py-6 text-center sm:py-10">
        <IconTile icon={icon} tone={tone} size="lg" />
        <div className="mt-6 w-full text-xl leading-8 text-balance text-fg sm:text-2xl sm:leading-9">{children}</div>
        {footer}
      </div>
    </section>
  );
}

/** Previous / next record links for numeric IDs. */
export function SiblingNav({ slug, id, noun }) {
  const current = Number.parseInt(id, 10);
  if (!Number.isFinite(current)) return null;
  return (
    <nav aria-label={`Browse ${noun}s`} className="flex items-center justify-between gap-3">
      {current > 1 ? (
        <Link href={`/${slug}/${current - 1}`} className={buttonStyles({ className: 'pl-2.5' })}>
          <Icon name="chevronLeft" />
          Previous {noun}
        </Link>
      ) : (
        <span />
      )}
      <span className="font-mono text-xs text-subtle">#{current}</span>
      <Link href={`/${slug}/${current + 1}`} className={buttonStyles({ className: 'pr-2.5' })}>
        Next {noun}
        <Icon name="chevronRight" />
      </Link>
    </nav>
  );
}
