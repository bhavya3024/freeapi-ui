'use client';
import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { getCollection } from '../config/collections';
import { usePaginated } from '../hooks/useFetch';
import { useStoredValue, writeStored } from '../hooks/useStoredValue';
import { lastListKey } from './BackLink';
import { GRID_COLUMNS } from './Cards';
import Icon from './Icon';
import Pagination from './Pagination';
import { CardSkeleton, LoadingRegion, PaginationSkeleton, Shimmer } from './Shimmer';
import Table from './Table';
import { Badge, EmptyState, ErrorState, IconTile, buttonStyles, cardStyles, fillViewport, inputStyles } from './ui';

const PAGE_SIZE = 12;

// Header, toolbar and pagination stay put; only the data region between them scrolls.
const frameStyles = `flex flex-col gap-5 ${fillViewport}`;
// The negative margin + padding leaves room for card hover lift/shadow inside the scroll clip
const scrollRegionStyles = 'min-h-0 flex-1 overflow-y-auto overscroll-contain -mx-2 -mt-1 px-2 pt-1 pb-2';

function PageHeader({ meta, count }) {
  return (
    <div className="flex items-start gap-4">
      <IconTile icon={meta.icon} tone={meta.tone} size="lg" />
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <h1 className="text-2xl font-semibold tracking-tight text-fg">{meta.name}</h1>
          {count === null ? (
            <Shimmer className="h-5 w-24" />
          ) : (
            count !== undefined && <Badge>{count.toLocaleString()} records</Badge>
          )}
        </div>
        <p className="mt-1 text-sm text-muted">{meta.description}</p>
      </div>
    </div>
  );
}

const VIEWS = [
  { value: 'grid', icon: 'grid', label: 'Grid view' },
  { value: 'table', icon: 'rows', label: 'Table view' },
];

function Toolbar({ search = '', onSearch, view, onViewChange }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative min-w-0 flex-1 sm:max-w-72">
        <Icon name="search" className="pointer-events-none absolute left-3 top-1/2 w-4 h-4 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch?.(e.target.value)}
          readOnly={!onSearch}
          placeholder="Filter this page"
          aria-label="Filter results on this page"
          className={`${inputStyles} h-9 w-full pl-9 pr-3`}
        />
      </div>
      <div
        role="radiogroup"
        aria-label="Layout"
        className="ml-auto inline-flex h-9 shrink-0 items-center rounded-lg border border-line bg-surface p-0.5 shadow-xs"
      >
        {VIEWS.map((v) => (
          <button
            key={v.value}
            type="button"
            role="radio"
            aria-checked={view === v.value}
            aria-label={v.label}
            title={v.label}
            onClick={() => onViewChange?.(v.value)}
            className={`flex h-full w-9 cursor-pointer items-center justify-center rounded-md transition-colors ${
              view === v.value ? 'bg-surface-3 text-fg' : 'text-subtle hover:text-fg'
            }`}
          >
            <Icon name={v.icon} />
          </button>
        ))}
      </div>
    </div>
  );
}

function CardGridSkeleton({ meta }) {
  return (
    <LoadingRegion label={`Loading ${meta.name.toLowerCase()}`} className={`grid grid-cols-1 gap-4 ${GRID_COLUMNS[meta.card]}`}>
      {Array.from({ length: PAGE_SIZE }).map((_, i) => (
        <CardSkeleton key={i} variant={meta.card} aspect={meta.cardAspect} titleLines={meta.titleLines} />
      ))}
    </LoadingRegion>
  );
}

/** Route-level placeholder (loading.js / Suspense) that matches the grid view's first paint. */
export function CollectionSkeleton({ slug }) {
  const meta = getCollection(slug);
  return (
    <div className={frameStyles}>
      <div className="shrink-0 space-y-5">
        <PageHeader meta={meta} count={null} />
        <Toolbar view="grid" />
      </div>
      <div className={scrollRegionStyles}>
        <CardGridSkeleton meta={meta} />
      </div>
      <div className="shrink-0">
        <PaginationSkeleton />
      </div>
    </div>
  );
}

/**
 * Paginated collection page with a grid/table toggle.
 * - renderCard(item): card body (see Cards.js); wrapped in a link here
 * - columns: table columns (see Table.js)
 * The current page lives in ?page= so refresh, back/forward and "back to list" all keep it.
 */
export default function Collection(props) {
  return (
    <Suspense fallback={<CollectionSkeleton slug={props.slug} />}>
      <CollectionView {...props} />
    </Suspense>
  );
}

function CollectionView({ slug, fetchPage, getKey, getHref, renderCard, columns, defaultView = 'grid' }) {
  const meta = getCollection(slug);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const page = Math.max(1, Number.parseInt(searchParams.get('page'), 10) || 1);

  const [view, setView] = useStoredValue(`freeapi:view:${slug}`, defaultView);
  const [search, setSearch] = useState('');
  const rootRef = useRef(null);
  const { items, totalItems, totalPages, hasNext, hasLoaded, loading, error, reload } = usePaginated(fetchPage, {
    page,
    pageSize: PAGE_SIZE,
  });

  // Remember this page so the detail view's back link returns here
  useEffect(() => {
    writeStored(lastListKey(slug), page > 1 ? `${pathname}?page=${page}` : pathname, 'session');
  }, [slug, pathname, page]);

  const goToPage = (next) => {
    setSearch('');
    router.push(next > 1 ? `${pathname}?page=${next}` : pathname, { scroll: false });
    rootRef.current?.querySelector('[data-scroll-region]')?.scrollTo({ top: 0 });
  };

  const q = search.trim().toLowerCase();
  const visible = q ? items.filter((item) => JSON.stringify(item).toLowerCase().includes(q)) : items;

  const empty = q ? (
    <EmptyState
      title="No matches on this page"
      description={`Nothing on page ${page} matches “${search.trim()}”. The filter only searches the records currently shown.`}
      action={
        <button type="button" onClick={() => setSearch('')} className={buttonStyles()}>
          Clear filter
        </button>
      }
    />
  ) : (
    <EmptyState
      icon={meta.icon}
      title={`No ${meta.name.toLowerCase()} here`}
      description={page > 1 ? `Page ${page} is past the end of this collection.` : 'This collection is empty right now.'}
      action={
        page > 1 && (
          <button type="button" onClick={() => goToPage(1)} className={buttonStyles()}>
            Go to first page
          </button>
        )
      }
    />
  );

  let content;
  let tableView = false;
  if (error && !loading) {
    content = (
      <ErrorState
        title={`Couldn't load ${meta.name.toLowerCase()}`}
        description="The request to FreeAPI failed. Check your connection and try again."
        onRetry={reload}
      />
    );
  } else if (view === 'table') {
    tableView = true;
    content = (
      <Table
        columns={columns}
        items={visible}
        loading={loading}
        getKey={getKey}
        getHref={getHref}
        empty={empty}
        skeletonRows={PAGE_SIZE}
      />
    );
  } else if (loading) {
    content = <CardGridSkeleton meta={meta} />;
  } else if (visible.length === 0) {
    content = <div className={cardStyles}>{empty}</div>;
  } else {
    content = (
      <ul className={`grid grid-cols-1 gap-4 ${GRID_COLUMNS[meta.card]}`}>
        {visible.map((item, i) => (
          <li key={getKey(item)} className="animate-fade-in" style={{ animationDelay: `${i * 20}ms` }}>
            <Link
              href={getHref(item)}
              className="group block h-full overflow-hidden rounded-xl border border-line bg-surface transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lg hover:shadow-black/5"
            >
              {renderCard(item)}
            </Link>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div ref={rootRef} className={frameStyles}>
      <div className="shrink-0 space-y-5">
        <PageHeader meta={meta} count={hasLoaded ? totalItems ?? undefined : error ? undefined : null} />
        <Toolbar search={search} onSearch={setSearch} view={view} onViewChange={setView} />
      </div>
      {tableView ? (
        // The table scrolls inside its own card so the column headers can stick
        <div className="flex min-h-0 flex-1 flex-col">{content}</div>
      ) : (
        <div data-scroll-region className={scrollRegionStyles}>
          {content}
        </div>
      )}
      <div className="shrink-0">
        {hasLoaded ? (
          <Pagination
            page={page}
            totalPages={totalPages}
            totalItems={totalItems}
            pageSize={PAGE_SIZE}
            hasNext={hasNext}
            onChange={goToPage}
            disabled={loading}
          />
        ) : (
          !error && <PaginationSkeleton />
        )}
      </div>
    </div>
  );
}
