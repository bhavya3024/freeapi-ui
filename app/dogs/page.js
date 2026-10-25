'use client';
import { getDogs } from "../../src/apis/dogs";
import Collection from "../../src/components/Collection";
import { MediaCard } from "../../src/components/Cards";
import ShimmerImage from "../../src/components/ShimmerImage";
import { Badge } from "../../src/components/ui";

const columns = [
  {
    key: 'breed',
    label: 'Breed',
    skeleton: 'media',
    render: (dog) => (
      <div className="flex items-center gap-3">
        <ShimmerImage src={dog.image?.url} alt="" fallbackIcon="dog" className="h-10 w-10 shrink-0 rounded-lg" />
        <div className="min-w-0">
          <p className="truncate font-medium text-fg">{dog.name || 'Unknown breed'}</p>
          <p className="max-w-56 truncate text-xs text-subtle">{dog.bred_for || dog.origin || '—'}</p>
        </div>
      </div>
    ),
  },
  {
    key: 'group',
    label: 'Group',
    skeleton: 'badge',
    render: (dog) => (dog.breed_group ? <Badge tone="orange">{dog.breed_group}</Badge> : <span className="text-subtle">—</span>),
  },
  {
    key: 'temperament',
    label: 'Temperament',
    render: (dog) => <span className="block max-w-72 truncate text-muted">{dog.temperament || '—'}</span>,
  },
  {
    key: 'life',
    label: 'Life span',
    align: 'right',
    render: (dog) => <span className="whitespace-nowrap tabular-nums text-muted">{dog.life_span || '—'}</span>,
  },
  {
    key: 'weight',
    label: 'Weight',
    align: 'right',
    render: (dog) => <span className="whitespace-nowrap tabular-nums text-muted">{dog.weight?.metric ? `${dog.weight.metric} kg` : '—'}</span>,
  },
];

const renderCard = (dog) => (
  <MediaCard
    image={dog.image?.url}
    alt={dog.name}
    fallbackIcon="dog"
    title={dog.name || 'Unknown breed'}
    subtitle={dog.temperament || dog.bred_for || '—'}
    meta={
      <>
        {dog.breed_group ? <Badge tone="orange">{dog.breed_group}</Badge> : <Badge>Mixed</Badge>}
        {dog.life_span && <span className="truncate text-xs tabular-nums text-subtle">{dog.life_span}</span>}
      </>
    }
  />
);

export default function DogsPage() {
  return (
    <Collection
      slug="dogs"
      fetchPage={getDogs}
      getKey={(dog) => dog.id}
      getHref={(dog) => `/dogs/${dog.id}`}
      renderCard={renderCard}
      columns={columns}
    />
  );
}
