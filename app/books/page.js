'use client';
import { getBooks } from "../../src/apis/books";
import { useState, useEffect } from 'react';
import Table from "../../src/components/Table";
import Pagination from "../../src/components/Pagination";

export default function BooksPage() {
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  
  useEffect(() => {
    const fetchBooks = async () => {
      const { data: books, nextPage } = await getBooks({
        page,
        results: 5,
      });
      setBooks(() => [...books]);
      setNextPage(() =>  nextPage);
    }
    fetchBooks();
  }, [page]);

  const headers = [
    { label: 'ID', align: 'left' },
    { label: 'Title', align: 'left' },
    { label: 'Authors', align: 'left' },
    { label: 'Publisher', align: 'left' },
    { label: 'Published', align: 'left' },
    { label: 'Categories', align: 'left' },
    { label: 'Cover', align: 'center' }
  ];

  const renderBookRow = (book) => (
    <tr key={book.id} className="border-b border-gray-200 hover:bg-gray-100" style={{ height: '45px' }}>
      <td className="py-2 px-4 text-left whitespace-nowrap">{book.id}</td>
      <td className="py-2 px-4 text-left">
        <div className="max-w-md overflow-hidden">
          <p className="text-sm font-medium">
            {book.volumeInfo?.title && book.volumeInfo.title.length > 50 
              ? `${book.volumeInfo.title.substring(0, 50)}...` 
              : book.volumeInfo?.title || 'N/A'
            }
          </p>
          {book.volumeInfo?.subtitle && (
            <p className="text-xs text-gray-500">
              {book.volumeInfo.subtitle.length > 40 
                ? `${book.volumeInfo.subtitle.substring(0, 40)}...` 
                : book.volumeInfo.subtitle
              }
            </p>
          )}
        </div>
      </td>
      <td className="py-2 px-4 text-left">
        <p className="text-sm">
          {book.volumeInfo?.authors 
            ? book.volumeInfo.authors.slice(0, 2).join(', ') + (book.volumeInfo.authors.length > 2 ? '...' : '')
            : 'Unknown'
          }
        </p>
      </td>
      <td className="py-2 px-4 text-left">
        <p className="text-sm">
          {book.volumeInfo?.publisher && book.volumeInfo.publisher.length > 20 
            ? `${book.volumeInfo.publisher.substring(0, 20)}...` 
            : book.volumeInfo?.publisher || 'N/A'
          }
        </p>
      </td>
      <td className="py-2 px-4 text-left">
        <p className="text-sm">
          {book.volumeInfo?.publishedDate || 'N/A'}
        </p>
      </td>
      <td className="py-2 px-4 text-left">
        {book.volumeInfo?.categories && book.volumeInfo.categories.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {book.volumeInfo.categories.slice(0, 2).map((category, index) => (
              <span 
                key={index}
                className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
            {book.volumeInfo.categories.length > 2 && (
              <span className="text-gray-400 text-xs">+{book.volumeInfo.categories.length - 2}</span>
            )}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">No categories</span>
        )}
      </td>
      <td className="py-2 px-4 text-center">
        {book.volumeInfo?.imageLinks?.thumbnail && (
          <img 
            src={book.volumeInfo.imageLinks.thumbnail} 
            alt={book.volumeInfo?.title || 'Book cover'} 
            className="w-8 h-10 mx-auto border border-gray-300 shadow-sm object-cover"
          />
        )}
      </td>
    </tr>
  );

  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <div>
      <Table
        title="Books"
        headers={headers}
        data={books}
        renderRow={renderBookRow}
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