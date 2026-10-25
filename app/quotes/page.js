'use client';
import { getQuotes } from "../../src/apis/quotes";
import Collection from "../../src/components/Collection";
import { TextCard } from "../../src/components/Cards";
import Icon from "../../src/components/Icon";
import { Badge } from "../../src/components/ui";

const columns = [
  {
    key: 'quote',
    label: 'Quote',
    skeleton: 'lines',
    render: (q) => <p className="line-clamp-2 max-w-2xl text-fg">“{q.content}”</p>,
  },
  { key: 'author', label: 'Author', render: (q) => <span className="whitespace-nowrap font-medium text-muted">{q.author || 'Anonymous'}</span> },
  {
    key: 'tag',
    label: 'Tag',
    skeleton: 'badge',
    render: (q) => (q.tags?.[0] ? <Badge tone="indigo">{q.tags[0]}</Badge> : <span className="text-subtle">—</span>),
  },
  {
    key: 'length',
    label: 'Length',
    align: 'right',
    render: (q) => <span className="tabular-nums text-muted">{q.length ?? q.content?.length ?? '—'}</span>,
  },
];

const renderCard = (q) => (
  <TextCard
    eyebrow={<Icon name="quote" className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />}
    footer={
      <>
        <span className="truncate text-sm font-medium text-muted">— {q.author || 'Anonymous'}</span>
        {q.tags?.[0] && <Badge tone="indigo">{q.tags[0]}</Badge>}
      </>
    }
  >
    <p className="line-clamp-4">{q.content}</p>
  </TextCard>
);

export default function QuotesPage() {
  return (
    <Collection
      slug="quotes"
      fetchPage={getQuotes}
      getKey={(q) => q.id}
      getHref={(q) => `/quotes/${q.id}`}
      renderCard={renderCard}
      columns={columns}
    />
  );
}
