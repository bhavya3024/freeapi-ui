'use client';
import { getJokeById } from "../../../src/apis/jokes";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function JokeDetailPage() {
  const { id } = useParams();
  const [joke, setJoke] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchJoke = async () => {
      try {
        setLoading(true);
        const { data } = await getJokeById(id);
        setJoke(data);
      } catch (err) {
        setError('Failed to load joke details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchJoke();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error || !joke) {
    return (
      <div className="p-6">
        <Link href="/jokes" className="text-blue-500 hover:underline mb-4 inline-block">← Back to Jokes</Link>
        <div className="text-red-500">{error || 'Joke not found'}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/jokes" className="text-blue-500 hover:underline mb-6 inline-flex items-center gap-2">
        <span>←</span> Back to Jokes
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-4">
        <div className="text-center mb-6">
          <span className="text-6xl mb-4 block">😂</span>
          <h1 className="text-xl font-bold text-gray-800">Joke #{joke.id}</h1>
        </div>

        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-6 mb-6">
          <p className="text-lg text-gray-800 leading-relaxed text-center italic">
            "{joke.content}"
          </p>
        </div>

        {joke.categories && joke.categories.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2">
            {joke.categories.map((category, i) => (
              <span key={i} className="bg-red-100 text-red-800 text-sm px-4 py-2 rounded-full">
                {category}
              </span>
            ))}
          </div>
        )}

        {(!joke.categories || joke.categories.length === 0) && (
          <p className="text-center text-gray-400 text-sm">No categories</p>
        )}
      </div>
    </div>
  );
}
