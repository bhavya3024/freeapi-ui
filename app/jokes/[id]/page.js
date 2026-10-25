'use client';
import { useParams } from 'next/navigation';
import { getJokeById } from "../../../src/apis/jokes";
import CopyButton from "../../../src/components/CopyButton";
import { DetailBody, DetailLayout, SiblingNav, TextFeature } from "../../../src/components/Detail";
import { TextFeatureSkeleton } from "../../../src/components/Shimmer";
import { Badge } from "../../../src/components/ui";
import { useResource } from "../../../src/hooks/useFetch";

function JokeDetail({ joke }) {
  return (
    <TextFeature
      icon="smile"
      tone="amber"
      footer={
        <>
          <div className="mt-6 flex h-5 flex-wrap justify-center gap-1.5">
            {joke.categories?.length ? (
              joke.categories.map((c) => (
                <Badge key={c} tone="amber" className="capitalize">
                  {c}
                </Badge>
              ))
            ) : (
              <Badge>general</Badge>
            )}
          </div>
          <div className="mt-8">
            <CopyButton text={joke.content} label="Copy joke" />
          </div>
        </>
      }
    >
      <p>{joke.content}</p>
    </TextFeature>
  );
}

export default function JokeDetailPage() {
  const { id } = useParams();
  const resource = useResource(getJokeById, id);

  return (
    <DetailLayout slug="jokes" label="All jokes" width="max-w-3xl">
      <DetailBody resource={resource} noun="joke" skeleton={<TextFeatureSkeleton label="Loading joke" />}>
        {(joke) => <JokeDetail joke={joke} />}
      </DetailBody>
      <SiblingNav slug="jokes" id={id} noun="joke" />
    </DetailLayout>
  );
}
