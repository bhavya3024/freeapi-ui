'use client';
import { getBooks } from "../../src/apis/books";
import Collection from "../../src/components/Collection";
import { HorizontalCard } from "../../src/components/Cards";
import ShimmerImage from "../../src/components/ShimmerImage";
import { Badge } from "../../src/components/ui";
import { httpsUrl } from "../../src/lib/format";

const authorsOf = (info) => {
  const authors = info?.authors || [];
  if (authors.length === 0) return 'Unknown author';
  return authors.length > 2 ? `${authors.slice(0, 2).join(', ')} +${authors.length - 2}` : authors.join(', ');
};

const columns = [
  {
    key: 'book',
    label: 'Book',
    skeleton: 'media',
    render: (book) => (
      <div className="flex items-center gap-3">
        <ShimmerImage
          src={httpsUrl(book.volumeInfo?.imageLinks?.thumbnail)}
          fallbackIcon="book"
          className="h-10 w-7 shrink-0 rounded border border-line"
        />
        <div className="min-w-0">
          <p className="max-w-72 truncate font-medium text-fg">{book.volumeInfo?.title || 'Untitled'}</p>
          {book.volumeInfo?.subtitle && (
            <p className="max-w-72 truncate text-xs text-subtle">{book.volumeInfo.subtitle}</p>
          )}
        </div>
      </div>
    ),
  },
  {
    key: 'authors',
    label: 'Authors',
    render: (book) => <span className="block max-w-56 truncate text-muted">{authorsOf(book.volumeInfo)}</span>,
  },
  {
    key: 'publisher',
    label: 'Publisher',
    render: (book) => <span className="block max-w-48 truncate text-muted">{book.volumeInfo?.publisher || '—'}</span>,
  },
  {
    key: 'year',
    label: 'Year',
    render: (book) => <span className="tabular-nums text-muted">{book.volumeInfo?.publishedDate?.slice(0, 4) || '—'}</span>,
  },
  {
    key: 'category',
    label: 'Category',
    skeleton: 'badge',
    render: (book) =>
      book.volumeInfo?.categories?.[0] ? <Badge tone="violet">{book.volumeInfo.categories[0]}</Badge> : <span className="text-subtle">—</span>,
  },
];

const renderCard = (book) => {
  const info = book.volumeInfo || {};
  return (
    <HorizontalCard
      image={httpsUrl(info.imageLinks?.thumbnail)}
      alt={info.title}
      fallbackIcon="book"
      title={info.title || 'Untitled'}
      subtitle={authorsOf(info)}
      caption={[info.publisher, info.publishedDate?.slice(0, 4)].filter(Boolean).join(' · ') || '—'}
      meta={info.categories?.slice(0, 2).map((c) => (
        <Badge key={c} tone="violet">
          {c}
        </Badge>
      ))}
    />
  );
};

export default function BooksPage() {
  return (
    <Collection
      slug="books"
      fetchPage={getBooks}
      getKey={(book) => book.id}
      getHref={(book) => `/books/${book.id}`}
      renderCard={renderCard}
      columns={columns}
    />
  );
}
