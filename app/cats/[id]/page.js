'use client';
import { useParams } from 'next/navigation';
import { getCatById } from "../../../src/apis/cats";
import { DetailBody, DetailLayout, Hero, HeroTitle, InfoList, InfoRow, Panel } from "../../../src/components/Detail";
import Icon from "../../../src/components/Icon";
import ShimmerImage from "../../../src/components/ShimmerImage";
import { Badge, Chip, buttonStyles } from "../../../src/components/ui";
import { useResource } from "../../../src/hooks/useFetch";
import CatSkeleton from "./skeleton";

function ScoreBar({ label, value }) {
  const score = Number(value) || 0;
  return (
    <div className="flex h-5 items-center gap-3">
      <span className="w-28 shrink-0 text-sm text-muted">{label}</span>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={5}
        aria-valuenow={score}
        className="h-2 flex-1 overflow-hidden rounded-full bg-surface-3"
      >
        <div className="h-full rounded-full bg-pink-500" style={{ width: `${(score / 5) * 100}%` }} />
      </div>
      <span className="w-7 shrink-0 text-right text-sm tabular-nums text-fg">{score}/5</span>
    </div>
  );
}

const yesNo = (flag) => (flag === undefined || flag === null ? null : flag ? 'Yes' : 'No');

const LINKS = [
  ['wikipedia_url', 'Wikipedia'],
  ['cfa_url', 'CFA'],
  ['vetstreet_url', 'Vetstreet'],
  ['vcahospitals_url', 'VCA Hospitals'],
];

function CatDetail({ cat }) {
  return (
    <>
      <Hero
        mediaClassName="w-full md:w-80"
        media={<ShimmerImage src={cat.image} alt={cat.name} fallbackIcon="cat" className="aspect-[4/3] w-full rounded-xl" />}
      >
        <HeroTitle
          badges={
            <>
              <Badge tone="pink" icon="pin">
                {cat.origin || 'Unknown origin'}
              </Badge>
              {cat.hypoallergenic ? <Badge tone="emerald">Hypoallergenic</Badge> : null}
              {cat.rare ? <Badge tone="amber">Rare</Badge> : null}
            </>
          }
          title={cat.name}
          subtitle={cat.alt_names ? `Also known as ${cat.alt_names}` : `${cat.life_span} year life span`}
        />
        {cat.description && <p className="mt-4 text-sm leading-6 text-muted">{cat.description}</p>}
        {cat.temperament && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {cat.temperament.split(',').map((t) => (
              <Chip key={t}>{t.trim()}</Chip>
            ))}
          </div>
        )}
        <div className="mt-5 flex flex-wrap gap-2">
          {LINKS.filter(([key]) => cat[key]).map(([key, label]) => (
            <a key={key} href={cat[key]} target="_blank" rel="noopener noreferrer" className={buttonStyles()}>
              {label}
              <Icon name="external" />
            </a>
          ))}
        </div>
      </Hero>

      <div className="grid items-start gap-6 lg:grid-cols-3">
        <Panel title="Personality" icon="heart">
          <div className="space-y-3">
            <ScoreBar label="Affection" value={cat.affection_level} />
            <ScoreBar label="Adaptability" value={cat.adaptability} />
            <ScoreBar label="Child friendly" value={cat.child_friendly} />
            <ScoreBar label="Dog friendly" value={cat.dog_friendly} />
            <ScoreBar label="Stranger friendly" value={cat.stranger_friendly} />
            <ScoreBar label="Energy" value={cat.energy_level} />
            <ScoreBar label="Intelligence" value={cat.intelligence} />
          </div>
        </Panel>
        <Panel title="Care" icon="cat">
          <div className="space-y-3">
            <ScoreBar label="Grooming" value={cat.grooming} />
            <ScoreBar label="Shedding" value={cat.shedding_level} />
            <ScoreBar label="Health issues" value={cat.health_issues} />
            <ScoreBar label="Social needs" value={cat.social_needs} />
            <ScoreBar label="Vocal" value={cat.vocalisation} />
          </div>
        </Panel>
        <Panel title="Facts" icon="tag">
          <InfoList>
            <InfoRow label="Life span">{cat.life_span && `${cat.life_span} years`}</InfoRow>
            <InfoRow label="Weight">{cat.weight?.metric && `${cat.weight.metric} kg`}</InfoRow>
            <InfoRow label="Country code" mono>{cat.country_code}</InfoRow>
            <InfoRow label="Indoor">{yesNo(cat.indoor)}</InfoRow>
            <InfoRow label="Lap cat">{yesNo(cat.lap)}</InfoRow>
            <InfoRow label="Natural breed">{yesNo(cat.natural)}</InfoRow>
            <InfoRow label="Hairless">{yesNo(cat.hairless)}</InfoRow>
          </InfoList>
        </Panel>
      </div>
    </>
  );
}

export default function CatDetailPage() {
  const { id } = useParams();
  const resource = useResource(getCatById, id);

  return (
    <DetailLayout slug="cats" label="All cats">
      <DetailBody resource={resource} noun="breed" skeleton={<CatSkeleton />}>
        {(cat) => <CatDetail cat={cat} />}
      </DetailBody>
    </DetailLayout>
  );
}
