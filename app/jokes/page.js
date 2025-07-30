'use client';
import { getJokes } from "../../src/apis/jokes";
import { useState, useEffect } from 'react';

export default function JokesPage() {
  const [page, setPage] = useState(1);
  const [jokes, setJokes] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  useEffect(() => {
    const fetchJokes = async () => {
      const { data: jokes, nextPage } = await getJokes({
        page,
        results: 10,
      });
      setJokes(() => [...jokes]);
      setNextPage(() =>  nextPage);
    }
    fetchJokes();
  }, [page]);

  return (
    <div className="container mx-auto px-4 flex flex-col h-full">
      <h1 className="text-2xl font-bold my-4">Jokes</h1>
      <div className="overflow-x-auto flex-grow overflow-y-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal sticky top-0 z-10">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Content</th>
              <th className="py-3 px-6 text-left">Categories</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {jokes.map((joke) => (
              <tr key={joke.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{joke.id}</td>
                <td className="py-3 px-6 text-left max-w-md">
                  <p className="text-wrap break-words">{joke.content}</p>
                </td>
                <td className="py-3 px-6 text-left">
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
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="flex flex-row justify-between items-center mt-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-200 disabled:opacity-50 cursor-pointer"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          &#8592; Previous
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-200 disabled:opacity-50 cursor-pointer"
          disabled={nextPage === false}
          onClick={() => setPage((p) => p + 1)}
        >
          Next &#8594;
        </button>
      </div>
    </div>
  );
}