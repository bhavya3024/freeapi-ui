'use client';
import { useParams } from 'next/navigation';
import { getQuoteById } from "../../../src/apis/quotes";
import CopyButton from "../../../src/components/CopyButton";
import { DetailBody, DetailLayout, SiblingNav, TextFeature } from "../../../src/components/Detail";
import { TextFeatureSkeleton } from "../../../src/components/Shimmer";
import { Badge } from "../../../src/components/ui";
import { useResource } from "../../../src/hooks/useFetch";

function QuoteDetail({ quote }) {
  const author = quote.author || 'Anonymous';
  return (
    <TextFeature
      icon="quote"
      tone="indigo"
      footer={
        <>
          <div className="mt-6 flex h-5 flex-wrap items-center justify-center gap-2">
            <span className="text-sm font-medium text-muted">— {author}</span>
            {quote.tags?.map((t) => (
              <Badge key={t} tone="indigo">
                {t}
              </Badge>
            ))}
          </div>
          <div className="mt-8">
            <CopyButton text={`“${quote.content}” — ${author}`} label="Copy quote" />
          </div>
        </>
      }
    >
      <blockquote>“{quote.content}”</blockquote>
    </TextFeature>
  );
}

export default function QuoteDetailPage() {
  const { id } = useParams();
  const resource = useResource(getQuoteById, id);

  return (
    <DetailLayout slug="quotes" label="All quotes" width="max-w-3xl">
      <DetailBody resource={resource} noun="quote" skeleton={<TextFeatureSkeleton label="Loading quote" />}>
        {(quote) => <QuoteDetail quote={quote} />}
      </DetailBody>
      <SiblingNav slug="quotes" id={id} noun="quote" />
    </DetailLayout>
  );
}
