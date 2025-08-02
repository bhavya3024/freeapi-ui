'use client';
import { getUsers } from "../../src/apis/users";
import { useState, useEffect } from 'react';
import Table from "../../src/components/Table";
import Pagination from "../../src/components/Pagination";

export default function UsersPage() {
  // Fetch data from the API

  const [page, setPage] = useState(1);
  const [users, setUsers] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  
  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await getUsers({
        page,
        results: 5,
      });
      const { data: users, nextPage } = data;
      setUsers(() => [...users]);
      setNextPage(() =>  nextPage);
    }
    fetchUsers();
  }, [page]);

  const headers = [
    { label: 'ID', align: 'left' },
    { label: 'User Details', align: 'left' },
    { label: 'Email', align: 'left' },
    { label: 'Phone', align: 'left' },
    { label: 'Location', align: 'left' }
  ];

  const renderUserRow = (user) => (
    <tr key={user.id} className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200" style={{ height: '55px' }}>
      <td className="py-3 px-3 text-left">
        <span className="inline-flex items-center justify-center w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold rounded-lg">
          {user.id}
        </span>
      </td>
      <td className="py-3 px-3 text-left">
        <div className="flex items-center space-x-2">
          {user.picture && user.picture.thumbnail && (
            <img 
              src={user.picture.thumbnail} 
              alt={`${user.name.first} ${user.name.last}`} 
              className="w-8 h-8 rounded-full border border-white shadow-sm ring-1 ring-blue-100 group-hover:ring-blue-200 transition-all flex-shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-800 group-hover:text-gray-900 text-sm truncate">
              {`${user.name.first} ${user.name.last}`}
            </div>
            <div className="text-xs text-gray-500 capitalize">{user.gender}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-left">
        <div className="flex items-center space-x-1">
          <span className="text-blue-600 text-sm">📧</span>
          <span className="text-xs text-gray-700 truncate">{user.email}</span>
        </div>
      </td>
      <td className="py-3 px-3 text-left">
        <div className="flex items-center space-x-1">
          <span className="text-green-600 text-sm">📞</span>
          <span className="text-xs text-gray-700 font-mono">{user.phone}</span>
        </div>
      </td>
      <td className="py-3 px-3 text-left">
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
          🌍 {user.location.country}
        </span>
      </td>
    </tr>
  );

  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <div>
      <Table
        title="Users"
        headers={headers}
        data={users}
        renderRow={renderUserRow}
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