'use client';
import { getCats } from "../../src/apis/cats";
import Collection from "../../src/components/Collection";
import { MediaCard } from "../../src/components/Cards";
import ShimmerImage from "../../src/components/ShimmerImage";
import { Badge } from "../../src/components/ui";

const columns = [
  {
    key: 'breed',
    label: 'Breed',
    skeleton: 'media',
    render: (cat) => (
      <div className="flex items-center gap-3">
        <ShimmerImage src={cat.image} alt="" fallbackIcon="cat" className="h-10 w-10 shrink-0 rounded-lg" />
        <div className="min-w-0">
          <p className="truncate font-medium text-fg">{cat.name || 'Unknown breed'}</p>
          <p className="truncate text-xs text-subtle">{cat.origin || 'Unknown origin'}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'temperament',
    label: 'Temperament',
    render: (cat) => <span className="block max-w-80 truncate text-muted">{cat.temperament || '—'}</span>,
  },
  {
    key: 'life',
    label: 'Life span',
    align: 'right',
    render: (cat) => <span className="whitespace-nowrap tabular-nums text-muted">{cat.life_span ? `${cat.life_span} yrs` : '—'}</span>,
  },
  {
    key: 'weight',
    label: 'Weight',
    align: 'right',
    render: (cat) => <span className="whitespace-nowrap tabular-nums text-muted">{cat.weight?.metric ? `${cat.weight.metric} kg` : '—'}</span>,
  },
];

const renderCard = (cat) => (
  <MediaCard
    image={cat.image}
    alt={cat.name}
    fallbackIcon="cat"
    title={cat.name || 'Unknown breed'}
    subtitle={cat.temperament || '—'}
    meta={
      <>
        <Badge icon="pin">{cat.origin || 'Unknown'}</Badge>
        {cat.life_span && <span className="text-xs tabular-nums text-subtle">{cat.life_span} yrs</span>}
      </>
    }
  />
);

export default function CatsPage() {
  return (
    <Collection
      slug="cats"
      fetchPage={getCats}
      getKey={(cat) => cat.id}
      getHref={(cat) => `/cats/${cat.id}`}
      renderCard={renderCard}
      columns={columns}
    />
  );
}
