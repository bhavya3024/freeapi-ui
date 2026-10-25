'use client';
import { useParams } from 'next/navigation';
import { getBookById } from "../../../src/apis/books";
import { DetailBody, DetailLayout, Hero, HeroTitle, InfoList, InfoRow, Panel } from "../../../src/components/Detail";
import Icon from "../../../src/components/Icon";
import ShimmerImage from "../../../src/components/ShimmerImage";
import { Badge, buttonStyles } from "../../../src/components/ui";
import { useResource } from "../../../src/hooks/useFetch";
import { formatDate, httpsUrl } from "../../../src/lib/format";
import BookSkeleton from "./skeleton";

function BookDetail({ book }) {
  const info = book.volumeInfo || {};
  const isbn = info.industryIdentifiers?.find((i) => i.type === 'ISBN_13') || info.industryIdentifiers?.[0];

  return (
    <>
      <Hero
        mediaClassName="w-36 md:w-44"
        media={
          <ShimmerImage
            src={httpsUrl(info.imageLinks?.thumbnail)}
            alt={info.title}
            fallbackIcon="book"
            className="aspect-[2/3] w-full rounded-xl border border-line shadow-sm"
          />
        }
      >
        <HeroTitle
          badges={info.categories?.map((c) => (
            <Badge key={c} tone="violet">
              {c}
            </Badge>
          ))}
          title={info.title}
          subtitle={info.subtitle}
        />
        <p className="mt-3 text-sm font-medium text-accent-text">by {info.authors?.join(', ') || 'Unknown author'}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {info.previewLink && (
            <a
              href={httpsUrl(info.previewLink)}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonStyles({ variant: 'primary' })}
            >
              <Icon name="book" />
              Preview
            </a>
          )}
          {info.infoLink && (
            <a href={httpsUrl(info.infoLink)} target="_blank" rel="noopener noreferrer" className={buttonStyles()}>
              Google Books
              <Icon name="external" />
            </a>
          )}
        </div>
      </Hero>

      <div className="grid items-start gap-6 md:grid-cols-5">
        <Panel title="Publication" icon="book" className="md:col-span-2">
          <InfoList>
            <InfoRow label="Publisher">{info.publisher}</InfoRow>
            <InfoRow label="Published">{formatDate(info.publishedDate) || info.publishedDate}</InfoRow>
            <InfoRow label="Pages">{info.pageCount}</InfoRow>
            <InfoRow label="Language">{info.language?.toUpperCase()}</InfoRow>
            <InfoRow label={isbn?.type?.replace('_', '-') || 'ISBN'} mono>
              {isbn?.identifier}
            </InfoRow>
            <InfoRow label="Rating">
              {info.averageRating && `${info.averageRating} / 5 (${info.ratingsCount ?? 0} ratings)`}
            </InfoRow>
          </InfoList>
        </Panel>
        <Panel title="Description" icon="quote" className="md:col-span-3">
          {info.description ? (
            // Google Books returns a small subset of HTML (<p>, <b>, <i>, <br>)
            <div
              className="space-y-3 text-sm leading-6 text-muted [&_b]:font-semibold [&_b]:text-fg"
              dangerouslySetInnerHTML={{ __html: info.description }}
            />
          ) : (
            <p className="text-sm text-subtle">No description available.</p>
          )}
        </Panel>
      </div>
    </>
  );
}

export default function BookDetailPage() {
  const { id } = useParams();
  const resource = useResource(getBookById, id);

  return (
    <DetailLayout slug="books" label="All books">
      <DetailBody resource={resource} noun="book" skeleton={<BookSkeleton />}>
        {(book) => <BookDetail book={book} />}
      </DetailBody>
    </DetailLayout>
  );
}
