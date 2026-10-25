'use client';
import { useParams } from 'next/navigation';
import { getDogById } from "../../../src/apis/dogs";
import { DetailBody, DetailLayout, Hero, HeroTitle, InfoList, InfoRow, Panel } from "../../../src/components/Detail";
import ShimmerImage from "../../../src/components/ShimmerImage";
import { Badge, Chip } from "../../../src/components/ui";
import { useResource } from "../../../src/hooks/useFetch";
import DogSkeleton from "./skeleton";

const withUnit = (value, unit) => (value ? `${value} ${unit}` : null);

function DogDetail({ dog }) {
  return (
    <>
      <Hero
        mediaClassName="w-full md:w-80"
        media={<ShimmerImage src={dog.image?.url} alt={dog.name} fallbackIcon="dog" className="aspect-[4/3] w-full rounded-xl" />}
      >
        <HeroTitle
          badges={
            <>
              {dog.breed_group && <Badge tone="orange">{dog.breed_group}</Badge>}
              {dog.origin && <Badge icon="pin">{dog.origin}</Badge>}
            </>
          }
          title={dog.name}
          subtitle={dog.bred_for && `Bred for ${dog.bred_for.charAt(0).toLowerCase()}${dog.bred_for.slice(1)}`}
        />
        {dog.temperament && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {dog.temperament.split(',').map((t) => (
              <Chip key={t}>{t.trim()}</Chip>
            ))}
          </div>
        )}
        {dog.history && <p className="mt-4 text-sm leading-6 text-muted">{dog.history}</p>}
      </Hero>

      <div className="grid items-start gap-6 md:grid-cols-2">
        <Panel title="Size" icon="dog">
          <InfoList>
            <InfoRow label="Height">{withUnit(dog.height?.metric, 'cm')}</InfoRow>
            <InfoRow label="Height (imperial)">{withUnit(dog.height?.imperial, 'in')}</InfoRow>
            <InfoRow label="Weight">{withUnit(dog.weight?.metric, 'kg')}</InfoRow>
            <InfoRow label="Weight (imperial)">{withUnit(dog.weight?.imperial, 'lb')}</InfoRow>
          </InfoList>
        </Panel>
        <Panel title="Background" icon="globe">
          <InfoList>
            <InfoRow label="Breed group">{dog.breed_group}</InfoRow>
            <InfoRow label="Bred for">{dog.bred_for}</InfoRow>
            <InfoRow label="Origin">{dog.origin}</InfoRow>
            <InfoRow label="Life span">{dog.life_span}</InfoRow>
          </InfoList>
        </Panel>
      </div>
    </>
  );
}

export default function DogDetailPage() {
  const { id } = useParams();
  const resource = useResource(getDogById, id);

  return (
    <DetailLayout slug="dogs" label="All dogs">
      <DetailBody resource={resource} noun="breed" skeleton={<DogSkeleton />}>
        {(dog) => <DogDetail dog={dog} />}
      </DetailBody>
    </DetailLayout>
  );
}
