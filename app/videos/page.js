'use client';
import { getVideos } from "../../src/apis/videos";
import { useState, useEffect } from 'react';
import Table from "../../src/components/Table";
import Pagination from "../../src/components/Pagination";

export default function VideosPage() {
  const [page, setPage] = useState(1);
  const [videos, setVideos] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  
  useEffect(() => {
    const fetchVideos = async () => {
      const { data: { data: videos, nextPage } } = await getVideos({
        page,
        limit: 5,
      });
      setVideos(() => [...videos]);
      setNextPage(() => nextPage);
    }
    fetchVideos();
  }, [page]);

  const headers = [
    { label: 'Thumbnail', align: 'left' },
    { label: 'Title', align: 'left' },
    { label: 'Channel', align: 'left' },
    { label: 'Duration', align: 'left' },
    { label: 'Views', align: 'left' },
    { label: 'Published', align: 'left' }
  ];

  const renderVideoRow = (video) => {
    const videoData = video.items;
    return (
      <tr key={videoData.id} className="border-b border-gray-200 hover:bg-gray-100" style={{ height: '45px' }}>
        <td className="py-2 px-4 text-left">
          <img 
            src={videoData.snippet?.thumbnails?.default?.url || 'N/A'} 
            alt={videoData.snippet?.title || 'Video'} 
            className="w-16 h-10 rounded object-cover"
            onError={(e) => {
              e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxNkM4IDcgOCAzMyAyMCAyNFMyMCA3IDIwIDE2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
            }}
          />
        </td>
        <td className="py-2 px-4 text-left">
          <span className="text-sm font-medium">
            {videoData.snippet?.title && videoData.snippet.title.length > 40 
              ? `${videoData.snippet.title.substring(0, 40)}...` 
              : videoData.snippet?.title || 'N/A'
            }
          </span>
        </td>
        <td className="py-2 px-4 text-left">
          <span className="text-xs text-gray-600">
            {videoData.snippet?.channelTitle || 'N/A'}
          </span>
        </td>
        <td className="py-2 px-4 text-left">
          <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
            {videoData.contentDetails?.duration?.replace('PT', '').replace('M', ':').replace('S', '') || 'N/A'}
          </span>
        </td>
        <td className="py-2 px-4 text-left">
          <span className="text-xs text-green-600">
            {videoData.statistics?.viewCount ? `${(videoData.statistics.viewCount / 1000).toFixed(1)}K` : 'N/A'}
          </span>
        </td>
        <td className="py-2 px-4 text-left">
          <span className="text-xs text-gray-500">
            {videoData.snippet?.publishedAt ? new Date(videoData.snippet.publishedAt).toLocaleDateString() : 'N/A'}
          </span>
        </td>
      </tr>
    );
  };

  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <div>
      <Table
        title="YouTube Videos"
        headers={headers}
        data={videos}
        renderRow={renderVideoRow}
      />
      <Pagination
        page={page}
        nextPage={nextPage}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  );
}
