'use client';
import { getVideos } from "../../src/apis/videos";
import Collection from "../../src/components/Collection";
import { MediaCard } from "../../src/components/Cards";
import ShimmerImage from "../../src/components/ShimmerImage";
import { formatCompact, formatDate, formatDuration } from "../../src/lib/format";

// Each list entry wraps the YouTube resource in `items`
const videoOf = (entry) => entry.items || entry;

const thumbnail = (snippet) =>
  snippet?.thumbnails?.high?.url || snippet?.thumbnails?.medium?.url || snippet?.thumbnails?.default?.url;

const columns = [
  {
    key: 'video',
    label: 'Video',
    skeleton: 'media',
    render: (entry) => {
      const { snippet } = videoOf(entry);
      return (
        <div className="flex items-center gap-3">
          <ShimmerImage src={snippet?.thumbnails?.default?.url} alt="" fallbackIcon="video" className="h-10 w-16 shrink-0 rounded-md" />
          <p className="line-clamp-2 max-w-md font-medium text-fg">{snippet?.title || 'Untitled video'}</p>
        </div>
      );
    },
  },
  {
    key: 'duration',
    label: 'Duration',
    align: 'right',
    render: (entry) => (
      <span className="font-mono text-[13px] tabular-nums text-muted">{formatDuration(videoOf(entry).contentDetails?.duration) || '—'}</span>
    ),
  },
  {
    key: 'views',
    label: 'Views',
    align: 'right',
    render: (entry) => <span className="tabular-nums text-muted">{formatCompact(videoOf(entry).statistics?.viewCount)}</span>,
  },
  {
    key: 'likes',
    label: 'Likes',
    align: 'right',
    render: (entry) => <span className="tabular-nums text-muted">{formatCompact(videoOf(entry).statistics?.likeCount)}</span>,
  },
  {
    key: 'published',
    label: 'Published',
    align: 'right',
    render: (entry) => (
      <span className="whitespace-nowrap tabular-nums text-muted">{formatDate(videoOf(entry).snippet?.publishedAt) || '—'}</span>
    ),
  },
];

const renderCard = (entry) => {
  const video = videoOf(entry);
  const duration = formatDuration(video.contentDetails?.duration);
  return (
    <MediaCard
      image={thumbnail(video.snippet)}
      alt={video.snippet?.title}
      aspect="aspect-video"
      fallbackIcon="video"
      overlay={
        duration && (
          <span className="absolute bottom-2 right-2 rounded bg-black/75 px-1.5 py-0.5 font-mono text-[11px] font-medium text-white">
            {duration}
          </span>
        )
      }
      title={video.snippet?.title || 'Untitled video'}
      titleLines={2}
      subtitle={video.snippet?.channelTitle || 'YouTube'}
      meta={
        <>
          <span className="text-xs tabular-nums text-subtle">{formatCompact(video.statistics?.viewCount)} views</span>
          <span className="text-xs tabular-nums text-subtle">{formatDate(video.snippet?.publishedAt)}</span>
        </>
      }
    />
  );
};

export default function VideosPage() {
  return (
    <Collection
      slug="videos"
      fetchPage={getVideos}
      getKey={(entry) => videoOf(entry).id}
      getHref={(entry) => `/videos/${videoOf(entry).id}`}
      renderCard={renderCard}
      columns={columns}
    />
  );
}
