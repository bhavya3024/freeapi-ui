'use client';
import { getQuotes } from "../../src/apis/quotes";
import { useState, useEffect } from 'react';
import Table from "../../src/components/Table";
import Pagination from "../../src/components/Pagination";

export default function QuotesPage() {
  const [page, setPage] = useState(1);
  const [quotes, setQuotes] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  
  useEffect(() => {
    const fetchQuotes = async () => {
      const { data: { data: quotes, nextPage } } = await getQuotes({
        page,
        limit: 5,
      });
      setQuotes(() => [...quotes]);
      setNextPage(() => nextPage);
    }
    fetchQuotes();
  }, [page]);

  const headers = [
    { label: 'Author', align: 'left' },
    { label: 'Content', align: 'left' },
    { label: 'Length', align: 'left' },
    { label: 'Date Added', align: 'left' }
  ];

  const renderQuoteRow = (quote) => (
    <tr key={quote.id} className="border-b border-gray-200 hover:bg-gray-100" style={{ height: '45px' }}>
      <td className="py-2 px-4 text-left">
        <span className="text-sm font-medium text-blue-600">{quote.author || 'N/A'}</span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm text-gray-700">
          {quote.content && quote.content.length > 100 
            ? `${quote.content.substring(0, 100)}...` 
            : quote.content || 'N/A'
          }
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded">
          {quote.length || 'N/A'}
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-xs text-gray-500">
          {quote.dateAdded ? new Date(quote.dateAdded).toLocaleDateString() : 'N/A'}
        </span>
      </td>
    </tr>
  );

  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <div>
      <Table
        title="Quotes"
        headers={headers}
        data={quotes}
        renderRow={renderQuoteRow}
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
