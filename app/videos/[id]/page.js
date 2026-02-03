'use client';
import { getVideoById } from "../../../src/apis/videos";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function VideoDetailPage() {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        setLoading(true);
        const { data } = await getVideoById(id);
        setVideo(data);
      } catch (err) {
        setError('Failed to load video details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchVideo();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !video) {
    return (
      <div className="p-6">
        <Link href="/videos" className="text-blue-500 hover:underline mb-4 inline-block">← Back to Videos</Link>
        <div className="text-red-500">{error || 'Video not found'}</div>
      </div>
    );
  }

  const videoInfo = video.video || {};
  const channelInfo = video.channel?.info || {};
  const stats = videoInfo.statistics || {};
  const snippet = videoInfo.snippet || {};

  const formatNumber = (num) => {
    if (!num) return '0';
    const n = parseInt(num);
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M';
    if (n >= 1000) return (n / 1000).toFixed(1) + 'K';
    return n.toString();
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/videos" className="text-blue-500 hover:underline mb-6 inline-flex items-center gap-2">
        <span>←</span> Back to Videos
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden mt-4">
        {/* Video Embed */}
        <div className="aspect-video bg-black">
          <iframe
            src={`https://www.youtube.com/embed/${id}`}
            title={snippet.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-3">{snippet.title}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              👁️ {formatNumber(stats.viewCount)} views
            </span>
            <span className="flex items-center gap-1">
              👍 {formatNumber(stats.likeCount)} likes
            </span>
            <span className="flex items-center gap-1">
              💬 {formatNumber(stats.commentCount)} comments
            </span>
            <span className="flex items-center gap-1">
              📅 {snippet.publishedAt ? new Date(snippet.publishedAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>

          {/* Channel Info */}
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6">
            {channelInfo.thumbnails?.default?.url && (
              <img 
                src={channelInfo.thumbnails.default.url}
                alt={channelInfo.title}
                className="w-12 h-12 rounded-full"
              />
            )}
            <div className="flex-1">
              <h3 className="font-semibold text-gray-800">{channelInfo.title}</h3>
              {channelInfo.customUrl && (
                <p className="text-sm text-gray-500">{channelInfo.customUrl}</p>
              )}
            </div>
            <a 
              href={`https://www.youtube.com/watch?v=${id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Watch on YouTube
            </a>
          </div>

          {/* Description */}
          {snippet.description && (
            <div className="bg-gray-50 rounded-xl p-4">
              <h3 className="font-semibold text-gray-700 mb-3">Description</h3>
              <p className="text-sm text-gray-600 whitespace-pre-line max-h-48 overflow-y-auto">
                {snippet.description}
              </p>
            </div>
          )}

          {/* Tags */}
          {snippet.tags && snippet.tags.length > 0 && (
            <div className="mt-4">
              <h3 className="font-semibold text-gray-700 mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {snippet.tags.slice(0, 15).map((tag, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                    #{tag}
                  </span>
                ))}
                {snippet.tags.length > 15 && (
                  <span className="text-gray-500 text-xs">+{snippet.tags.length - 15} more</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
