'use client';
import { getJokes } from "../../src/apis/jokes";
import Collection from "../../src/components/Collection";
import { TextCard } from "../../src/components/Cards";
import { Badge } from "../../src/components/ui";

const Categories = ({ joke }) =>
  joke.categories?.length ? (
    joke.categories.map((c) => (
      <Badge key={c} tone="amber" className="capitalize">
        {c}
      </Badge>
    ))
  ) : (
    <Badge>general</Badge>
  );

const columns = [
  { key: 'id', label: 'ID', render: (j) => <span className="font-mono text-xs text-subtle">#{j.id}</span> },
  {
    key: 'joke',
    label: 'Joke',
    skeleton: 'lines',
    render: (j) => <p className="line-clamp-2 max-w-2xl text-fg">{j.content}</p>,
  },
  {
    key: 'categories',
    label: 'Category',
    align: 'right',
    skeleton: 'badge',
    render: (j) => (
      <div className="flex justify-end gap-1">
        <Categories joke={j} />
      </div>
    ),
  },
];

const renderCard = (j) => (
  <TextCard
    eyebrow={<span className="font-mono text-xs text-subtle">#{j.id}</span>}
    footer={
      <>
        <span className="text-xs font-medium text-accent-text opacity-0 transition-opacity group-hover:opacity-100">
          Read joke →
        </span>
        <span className="flex gap-1">
          <Categories joke={j} />
        </span>
      </>
    }
  >
    <p className="line-clamp-4">{j.content}</p>
  </TextCard>
);

export default function JokesPage() {
  return (
    <Collection
      slug="jokes"
      fetchPage={getJokes}
      getKey={(j) => j.id}
      getHref={(j) => `/jokes/${j.id}`}
      renderCard={renderCard}
      columns={columns}
    />
  );
}
