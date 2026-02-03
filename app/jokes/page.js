'use client';
import { getJokes } from "../../src/apis/jokes";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Table from "../../src/components/Table";
import Pagination from "../../src/components/Pagination";

export default function JokesPage() {
  const [page, setPage] = useState(1);
  const [jokes, setJokes] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const router = useRouter();
  
  useEffect(() => {
    const fetchJokes = async () => {
      const { data: jokes, nextPage, totalItems, totalPages } = await getJokes({
        page,
        results: 5,
      });
      setJokes(jokes || []);
      setNextPage(nextPage);
      setTotalItems(totalItems);
      setTotalPages(totalPages);
    }
    fetchJokes();
  }, [page]);

  const headers = [
    { label: 'ID', align: 'left' },
    { label: 'Content', align: 'left' },
    { label: 'Categories', align: 'left' }
  ];

  const renderJokeRow = (joke) => (
    <tr key={joke.id} onClick={() => router.push(`/jokes/${joke.id}`)} className="border-b border-gray-200 hover:bg-gray-100 cursor-pointer" style={{ height: '45px' }}>
      <td className="py-2 px-4 text-left whitespace-nowrap">{joke.id}</td>
      <td className="py-2 px-4 text-left">
        <div className="max-w-md overflow-hidden">
          <p className="text-sm">
            {joke.content.length > 100 
              ? `${joke.content.substring(0, 100)}...` 
              : joke.content
            }
          </p>
        </div>
      </td>
      <td className="py-2 px-4 text-left">
        {joke.categories && joke.categories.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {joke.categories.map((category, index) => (
              <span 
                key={index}
                className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded"
              >
                {category}
              </span>
            ))}
          </div>
        ) : (
          <span className="text-gray-400 text-xs">No categories</span>
        )}
      </td>
    </tr>
  );

  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);
  const handlePageChange = (newPage) => setPage(newPage);

  return (
    <div>
      <Table
        title="Jokes"
        headers={headers}
        data={jokes}
        renderRow={renderJokeRow}
        totalItems={totalItems}
      />
      <Pagination
        page={page}
        nextPage={nextPage}
        totalPages={totalPages}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onPageChange={handlePageChange}
      />
    </div>
  );
}