'use client';
import { getBookById } from "../../../src/apis/books";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        setLoading(true);
        const { data } = await getBookById(id);
        setBook(data);
      } catch (err) {
        setError('Failed to load book details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="p-6">
        <Link href="/books" className="text-blue-500 hover:underline mb-4 inline-block">← Back to Books</Link>
        <div className="text-red-500">{error || 'Book not found'}</div>
      </div>
    );
  }

  const info = book.volumeInfo || {};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/books" className="text-blue-500 hover:underline mb-6 inline-flex items-center gap-2">
        <span>←</span> Back to Books
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-4">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {info.imageLinks?.thumbnail && (
            <img 
              src={info.imageLinks.thumbnail.replace('http:', 'https:')} 
              alt={info.title}
              className="w-40 h-56 object-cover rounded-lg shadow-lg"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{info.title}</h1>
            {info.subtitle && <p className="text-lg text-gray-600 mb-2">{info.subtitle}</p>}
            <p className="text-gray-500 mb-4">by {info.authors?.join(', ') || 'Unknown Author'}</p>
            
            {info.categories && (
              <div className="flex flex-wrap gap-2 mb-4">
                {info.categories.map((cat, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    {cat}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">📚 Publication Details</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Publisher:</span> {info.publisher || 'N/A'}</p>
              <p><span className="text-gray-500">Published Date:</span> {info.publishedDate || 'N/A'}</p>
              <p><span className="text-gray-500">Page Count:</span> {info.pageCount || 'N/A'}</p>
              <p><span className="text-gray-500">Language:</span> {info.language?.toUpperCase() || 'N/A'}</p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">📖 Additional Info</h3>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-500">Print Type:</span> {info.printType || 'N/A'}</p>
              <p><span className="text-gray-500">Maturity Rating:</span> {info.maturityRating || 'N/A'}</p>
              {info.averageRating && (
                <p><span className="text-gray-500">Rating:</span> ⭐ {info.averageRating}/5</p>
              )}
            </div>
          </div>
        </div>

        {info.description && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">📝 Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed" dangerouslySetInnerHTML={{ __html: info.description }} />
          </div>
        )}

        {info.previewLink && (
          <a 
            href={info.previewLink} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Preview on Google Books
          </a>
        )}
      </div>
    </div>
  );
}
