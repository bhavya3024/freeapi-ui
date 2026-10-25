'use client';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { getVideoById } from "../../../src/apis/videos";
import { DetailBody, DetailLayout, Panel, panelStyles } from "../../../src/components/Detail";
import Icon from "../../../src/components/Icon";
import ShimmerImage from "../../../src/components/ShimmerImage";
import { Chip, buttonStyles } from "../../../src/components/ui";
import { useResource } from "../../../src/hooks/useFetch";
import { formatCompact, formatDate, formatDuration } from "../../../src/lib/format";
import VideoSkeleton from "./skeleton";

// Shimmer until the YouTube iframe has loaded
function Player({ id, title }) {
  const [ready, setReady] = useState(false);
  return (
    <div className="relative aspect-video w-full overflow-hidden rounded-2xl border border-line bg-black">
      {!ready && <div className="shimmer absolute inset-0" />}
      <iframe
        src={`https://www.youtube.com/embed/${id}`}
        title={title || 'YouTube video player'}
        onLoad={() => setReady(true)}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
        className={`absolute inset-0 h-full w-full transition-opacity duration-300 ${ready ? 'opacity-100' : 'opacity-0'}`}
      />
    </div>
  );
}

function Stat({ icon, children }) {
  return (
    <span className="inline-flex h-5 items-center gap-1.5">
      <Icon name={icon} className="w-4 h-4 text-subtle" />
      {children}
    </span>
  );
}

function Description({ text }) {
  const [expanded, setExpanded] = useState(false);
  const isLong = text.length > 400 || text.split('\n').length > 6;
  return (
    <Panel
      title="Description"
      icon="comment"
      action={
        isLong && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="cursor-pointer text-xs font-medium text-accent-text hover:underline"
          >
            {expanded ? 'Show less' : 'Show more'}
          </button>
        )
      }
    >
      <p className={`whitespace-pre-line break-words text-sm leading-6 text-muted ${isLong && !expanded ? 'line-clamp-6' : ''}`}>
        {text}
      </p>
    </Panel>
  );
}

function VideoDetail({ id, data }) {
  // The video resource is nested under `items`, same as in the list response
  const video = data.video?.items || data.video || {};
  const { snippet = {}, statistics = {}, contentDetails = {} } = video;
  const channel = data.channel?.info || {};
  const subscribers = data.channel?.statistics?.subscriberCount;
  const duration = formatDuration(contentDetails.duration);

  return (
    <>
      <Player id={id} title={snippet.title} />

      <div className="animate-fade-in">
        <h1 className="text-xl font-semibold tracking-tight text-fg sm:text-2xl">{snippet.title || 'Untitled video'}</h1>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm tabular-nums text-muted">
          <Stat icon="eye">{formatCompact(statistics.viewCount)} views</Stat>
          <Stat icon="thumbsUp">{formatCompact(statistics.likeCount)} likes</Stat>
          <Stat icon="comment">{formatCompact(statistics.commentCount)} comments</Stat>
          {snippet.publishedAt && <Stat icon="calendar">{formatDate(snippet.publishedAt)}</Stat>}
          {duration && <Stat icon="clock">{duration}</Stat>}
        </div>
      </div>

      <div className={`${panelStyles} flex items-center gap-3 p-4 animate-fade-in`}>
        <ShimmerImage
          src={channel.thumbnails?.default?.url}
          alt=""
          fallbackIcon="video"
          className="h-11 w-11 shrink-0 rounded-full"
        />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-fg">{channel.title || snippet.channelTitle || 'YouTube channel'}</p>
          <p className="truncate text-xs text-subtle">
            {[channel.customUrl, subscribers && `${formatCompact(subscribers)} subscribers`].filter(Boolean).join(' · ')}
          </p>
        </div>
        <a
          href={`https://www.youtube.com/watch?v=${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonStyles({ variant: 'primary' })}
        >
          <span>
            <span className="hidden sm:inline">Watch on </span>YouTube
          </span>
          <Icon name="external" />
        </a>
      </div>

      {snippet.description && <Description text={snippet.description} />}

      {snippet.tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 animate-fade-in">
          {snippet.tags.slice(0, 20).map((tag, i) => (
            <Chip key={`${i}-${tag}`}>#{tag}</Chip>
          ))}
        </div>
      )}
    </>
  );
}

export default function VideoDetailPage() {
  const { id } = useParams();
  const resource = useResource(getVideoById, id);

  return (
    <DetailLayout slug="videos" label="All videos">
      <DetailBody resource={resource} noun="video" skeleton={<VideoSkeleton />}>
        {(data) => <VideoDetail id={id} data={data} />}
      </DetailBody>
    </DetailLayout>
  );
}
