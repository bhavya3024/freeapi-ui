'use client';
import { getQuoteById } from "../../../src/apis/quotes";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function QuoteDetailPage() {
  const { id } = useParams();
  const [quote, setQuote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        setLoading(true);
        const { data } = await getQuoteById(id);
        setQuote(data);
      } catch (err) {
        setError('Failed to load quote details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchQuote();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error || !quote) {
    return (
      <div className="p-6">
        <Link href="/quotes" className="text-blue-500 hover:underline mb-4 inline-block">← Back to Quotes</Link>
        <div className="text-red-500">{error || 'Quote not found'}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <Link href="/quotes" className="text-blue-500 hover:underline mb-6 inline-flex items-center gap-2">
        <span>←</span> Back to Quotes
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-4">
        <div className="text-center mb-8">
          <span className="text-6xl mb-4 block">💬</span>
        </div>

        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-8 mb-6 relative">
          <span className="absolute top-4 left-4 text-6xl text-indigo-200 font-serif">"</span>
          <p className="text-xl text-gray-800 leading-relaxed text-center px-8 py-4">
            {quote.content}
          </p>
          <span className="absolute bottom-4 right-4 text-6xl text-indigo-200 font-serif">"</span>
        </div>

        <div className="text-center mb-6">
          <p className="text-lg font-semibold text-indigo-600">— {quote.author}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm text-center">
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-gray-500">Length</span>
            <p className="font-medium">{quote.length} characters</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-3">
            <span className="text-gray-500">Added</span>
            <p className="font-medium">{new Date(quote.dateAdded).toLocaleDateString()}</p>
          </div>
        </div>

        {quote.tags && quote.tags.length > 0 && (
          <div className="flex justify-center flex-wrap gap-2 mt-6">
            {quote.tags.map((tag, i) => (
              <span key={i} className="bg-indigo-100 text-indigo-800 text-sm px-4 py-2 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
