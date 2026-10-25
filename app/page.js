'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBooks } from '../src/apis/books';
import { getCats } from '../src/apis/cats';
import { getDogs } from '../src/apis/dogs';
import { getJokes } from '../src/apis/jokes';
import { getMeals } from '../src/apis/meals';
import { getProducts } from '../src/apis/products';
import { getQuotes } from '../src/apis/quotes';
import { getStocks } from '../src/apis/stocks';
import { getUsers } from '../src/apis/users';
import { getVideos } from '../src/apis/videos';
import Icon from '../src/components/Icon';
import { Line, Shimmer } from '../src/components/Shimmer';
import ShimmerImage from '../src/components/ShimmerImage';
import { Badge, IconTile, buttonStyles, cardStyles } from '../src/components/ui';
import { COLLECTIONS, CHAT_APP } from '../src/config/collections';
import { useAuth } from '../src/context/AuthContext';
import { toPagePayload } from '../src/hooks/useFetch';
import { readStored, writeStored } from '../src/hooks/useStoredValue';

const FETCHERS = {
  users: getUsers,
  products: getProducts,
  books: getBooks,
  stocks: getStocks,
  jokes: getJokes,
  quotes: getQuotes,
  cats: getCats,
  dogs: getDogs,
  meals: getMeals,
  videos: getVideos,
};

const COUNTS_KEY = 'freeapi:collection-counts';

const fetchOne = (fetchPage, page) => fetchPage({ page, results: 1, limit: 1 }).then(toPagePayload);

/** Total records per collection, filled in as each request lands. Values: number | 'error'. */
function useCollectionCounts() {
  const [counts, setCounts] = useState({});

  useEffect(() => {
    let cached = null;
    try {
      cached = JSON.parse(readStored(COUNTS_KEY, 'session'));
    } catch {
      // ignore a corrupt cache entry
    }
    if (cached) {
      setCounts(cached);
      return;
    }

    let cancelled = false;
    const results = {};
    Object.entries(FETCHERS).forEach(([slug, fetchPage]) => {
      fetchOne(fetchPage, 1)
        .then((p) => p?.totalItems ?? 'error', () => 'error')
        .then((value) => {
          results[slug] = value;
          const done = Object.keys(results).length === COLLECTIONS.length;
          if (done && !Object.values(results).includes('error')) {
            writeStored(COUNTS_KEY, JSON.stringify(results), 'session');
          }
          if (!cancelled) setCounts((prev) => ({ ...prev, [slug]: value }));
        });
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return counts;
}

/** One random record: picks a random page of size 1 once the collection total is known. */
function useRandomRecord(fetchPage, total) {
  const [state, setState] = useState({ status: 'loading', item: null });
  const [round, setRound] = useState(0);

  useEffect(() => {
    if (total === undefined) return; // still counting
    if (total === 'error' || !total) {
      setState({ status: 'error', item: null });
      return;
    }
    let cancelled = false;
    setState((s) => ({ ...s, status: 'loading' }));
    const page = 1 + Math.floor(Math.random() * total);
    fetchOne(fetchPage, page).then(
      (p) => !cancelled && setState({ status: p?.data?.[0] ? 'ready' : 'error', item: p?.data?.[0] ?? null }),
      () => !cancelled && setState({ status: 'error', item: null }),
    );
    return () => {
      cancelled = true;
    };
  }, [fetchPage, total, round]);

  return { ...state, loading: state.status === 'loading', shuffle: () => setRound((n) => n + 1) };
}

function Hero({ counts }) {
  const { isAuthenticated } = useAuth();
  const values = COLLECTIONS.map((c) => counts[c.slug]);
  const allLoaded = values.every((v) => typeof v === 'number');
  const anyFailed = values.includes('error');
  const total = values.reduce((sum, v) => sum + (typeof v === 'number' ? v : 0), 0);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-line bg-surface px-6 py-10 sm:px-10 sm:py-14">
      {/* Decorative glow */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-accent/15 blur-3xl"
      />
      <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-fuchsia-500/10 blur-3xl" />

      <div className="relative max-w-2xl">
        <div className="flex h-6 items-center">
          {allLoaded ? (
            <Badge tone="indigo" icon="zap" className="animate-fade-in">
              {total.toLocaleString()} records across {COLLECTIONS.length} collections
            </Badge>
          ) : anyFailed ? (
            <Badge tone="indigo" icon="zap">
              {COLLECTIONS.length} public collections
            </Badge>
          ) : (
            <Shimmer className="h-5 w-64" />
          )}
        </div>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight text-fg sm:text-4xl">
          Browse FreeAPI&apos;s public datasets
        </h1>
        <p className="mt-3 text-base leading-7 text-muted">
          Page through users, products, books, stocks and more in a grid or a table, open any record for the full
          details, and sign in to try the real-time chat app.
        </p>
        <div className="mt-7 flex flex-wrap gap-2">
          <Link href="/users" className={buttonStyles({ variant: 'primary', size: 'lg' })}>
            Start exploring
            <Icon name="arrowRight" />
          </Link>
          <Link href={isAuthenticated ? '/chat' : '/login'} className={buttonStyles({ size: 'lg' })}>
            <Icon name="chat" />
            Open chat
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ title, description, action }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight text-fg">{title}</h2>
        <p className="mt-0.5 text-sm text-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

function CollectionCard({ meta, count }) {
  return (
    <Link
      href={`/${meta.slug}`}
      className="group flex flex-col rounded-xl border border-line bg-surface p-5 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:shadow-lg hover:shadow-black/5"
    >
      <div className="flex items-start justify-between gap-3">
        <IconTile icon={meta.icon} tone={meta.tone} size="lg" />
        {count === undefined ? (
          <Shimmer className="h-5 w-24" />
        ) : (
          typeof count === 'number' && <Badge className="animate-fade-in">{count.toLocaleString()} records</Badge>
        )}
      </div>
      <h3 className="mt-4 text-sm font-semibold text-fg transition-colors group-hover:text-accent-text">{meta.name}</h3>
      <p className="mb-4 mt-1 line-clamp-2 text-sm text-muted">{meta.description}</p>
      <div className="mt-auto flex items-center justify-between border-t border-line pt-3 text-xs">
        <code className="font-mono text-subtle">GET /api/{meta.slug}</code>
        <span className="inline-flex items-center gap-1 font-medium text-accent-text">
          Browse
          <Icon name="arrowRight" className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </span>
      </div>
    </Link>
  );
}

function SampleCard({ icon, tone, title, sample, skeleton, children }) {
  return (
    <section className={`${cardStyles} flex flex-col`}>
      <header className="flex h-12 items-center gap-2 border-b border-line pl-4 pr-2">
        <IconTile icon={icon} tone={tone} size="sm" />
        <h3 className="text-sm font-semibold text-fg">{title}</h3>
        <button
          type="button"
          onClick={sample.shuffle}
          disabled={sample.loading}
          className={buttonStyles({ variant: 'ghost', size: 'sm', className: 'ml-auto' })}
        >
          <Icon name="shuffle" className="w-3.5 h-3.5" />
          Shuffle
        </button>
      </header>
      <div className="min-h-48 flex-1 p-5" aria-busy={sample.loading || undefined}>
        {sample.loading ? (
          skeleton
        ) : sample.status === 'error' ? (
          <p className="text-sm text-subtle">Couldn&apos;t load a sample right now.</p>
        ) : (
          <div className="animate-fade-in">{children(sample.item)}</div>
        )}
      </div>
    </section>
  );
}

const textSkeleton = (
  <>
    {['w-full', 'w-11/12', 'w-full', 'w-2/3'].map((w, i) => (
      <Line key={i} size="base" className={w} />
    ))}
    <div className="mt-3">
      <Line className="w-32" />
    </div>
  </>
);

function LiveSamples({ counts }) {
  const quote = useRandomRecord(getQuotes, counts.quotes);
  const joke = useRandomRecord(getJokes, counts.jokes);
  const cat = useRandomRecord(getCats, counts.cats);

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <SampleCard icon="quote" tone="indigo" title="Random quote" sample={quote} skeleton={textSkeleton}>
        {(q) => (
          <Link href={`/quotes/${q.id}`} className="group block">
            <p className="line-clamp-4 text-[15px] leading-6 text-fg">“{q.content}”</p>
            <p className="mt-3 text-sm font-medium text-muted group-hover:text-accent-text">— {q.author || 'Anonymous'}</p>
          </Link>
        )}
      </SampleCard>
      <SampleCard icon="smile" tone="amber" title="Random joke" sample={joke} skeleton={textSkeleton}>
        {(j) => (
          <Link href={`/jokes/${j.id}`} className="group block">
            <p className="line-clamp-4 text-[15px] leading-6 text-fg">{j.content}</p>
            <p className="mt-3 text-sm font-medium text-muted group-hover:text-accent-text">Joke #{j.id} →</p>
          </Link>
        )}
      </SampleCard>
      <SampleCard
        icon="cat"
        tone="pink"
        title="Random cat breed"
        sample={cat}
        skeleton={
          <div className="flex gap-4">
            <Shimmer className="h-24 w-24 shrink-0 rounded-lg" />
            <div className="min-w-0 flex-1">
              <Line className="w-2/3" />
              <Line className="w-1/2" />
              <div className="mt-3">
                <Line size="xs" className="w-full" />
                <Line size="xs" className="w-4/5" />
              </div>
            </div>
          </div>
        }
      >
        {(c) => (
          <Link href={`/cats/${c.id}`} className="group flex gap-4">
            <ShimmerImage src={c.image} alt={c.name} fallbackIcon="cat" className="h-24 w-24 shrink-0 rounded-lg" />
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-fg group-hover:text-accent-text">{c.name}</p>
              <p className="truncate text-sm text-muted">{c.origin}</p>
              <p className="mt-3 line-clamp-2 text-xs text-subtle">{c.temperament}</p>
            </div>
          </Link>
        )}
      </SampleCard>
    </div>
  );
}

function ChatCallout() {
  const { isAuthenticated, loading } = useAuth();
  return (
    <section className="flex flex-col gap-4 rounded-xl border border-line bg-surface p-5 sm:flex-row sm:items-center">
      <IconTile icon={CHAT_APP.icon} tone={CHAT_APP.tone} size="lg" />
      <div className="flex-1">
        <h3 className="text-sm font-semibold text-fg">Real-time chat</h3>
        <p className="mt-0.5 text-sm text-muted">
          Create an account, or fill in generated test credentials on the sign-in page, then message other users.
        </p>
      </div>
      {loading ? (
        <Shimmer className="h-9 w-32 rounded-lg" />
      ) : (
        <Link href={isAuthenticated ? '/chat' : '/login'} className={buttonStyles({ variant: 'primary' })}>
          {isAuthenticated ? 'Open chat' : 'Sign in to chat'}
          <Icon name="arrowRight" />
        </Link>
      )}
    </section>
  );
}

export default function Home() {
  const counts = useCollectionCounts();

  return (
    <div className="space-y-10">
      <Hero counts={counts} />

      <section>
        <SectionHeader
          title="Collections"
          description="Each one has pagination, a grid and table view, and a detail page per record."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {COLLECTIONS.map((c) => (
            <CollectionCard key={c.slug} meta={c} count={counts[c.slug]} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeader title="Live samples" description="Random records fetched from the API. Shuffle for another one." />
        <LiveSamples counts={counts} />
      </section>

      <ChatCallout />
    </div>
  );
}
