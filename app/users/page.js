'use client';
import { getUsers } from "../../src/apis/users";
import { useState, useEffect } from 'react';

export default function UsersPage() {
  // Fetch data from the API

  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await getUsers({
        page,
        results: 10,
      });
      const { data: users, nextPage } = data;
      setUsers(() => [...users]);
      setNextPage(() =>  nextPage);
    }
    fetchUsers();
  }, [page]);

  if (!users || users.length === 0) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold my-4">Users</h1>
        <p>No users found or failed to load data.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 flex flex-col h-full">
      <h1 className="text-2xl font-bold my-4">Users</h1>
      <div className="overflow-x-auto flex-grow overflow-y-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal sticky top-0 z-10">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Name</th>
              <th className="py-3 px-6 text-left">Email</th>
              <th className="py-3 px-6 text-left">Phone</th>
              <th className="py-3 px-6 text-left">Country</th>
              <th className="py-3 px-6 text-center">Picture</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {users.map((user) => (
              <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{user.id}</td>
                <td className="py-3 px-6 text-left">
                  {`${user.name.title} ${user.name.first} ${user.name.last}`}
                </td>
                <td className="py-3 px-6 text-left">{user.email}</td>
                <td className="py-3 px-6 text-left">{user.phone}</td>
                <td className="py-3 px-6 text-left">{user.location.country}</td>
                <td className="py-3 px-6 text-center">
                  {user.picture && user.picture.thumbnail && (
                    <img 
                      src={user.picture.thumbnail} 
                      alt={`${user.name.first} ${user.name.last}`} 
                      className="w-8 h-8 rounded-full mx-auto border-2 border-blue-400 shadow"
                    />
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
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-200 disabled:opacity-50"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          &#8592; Previous
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-200 disabled:opacity-50"
          disabled={nextPage === false}
          onClick={() => setPage((p) => p + 1)}
        >
          Next &#8594;
        </button>
      </div>
    </div>
  );
}