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
        results: 10,
      });
      const { data: users, nextPage } = data;
      setUsers(() => [...users]);
      setNextPage(() =>  nextPage);
    }
    fetchUsers();
  }, [page]);

  const headers = [
    { label: 'ID', align: 'left' },
    { label: 'Name', align: 'left' },
    { label: 'Email', align: 'left' },
    { label: 'Phone', align: 'left' },
    { label: 'Country', align: 'left' },
    { label: 'Picture', align: 'center' }
  ];

  const renderUserRow = (user) => (
    <tr key={user.id} className="border-b border-gray-200 hover:bg-gray-100" style={{ height: '45px' }}>
      <td className="py-2 px-4 text-left whitespace-nowrap">{user.id}</td>
      <td className="py-2 px-4 text-left">
        {`${user.name.title} ${user.name.first} ${user.name.last}`}
      </td>
      <td className="py-2 px-4 text-left">{user.email}</td>
      <td className="py-2 px-4 text-left">{user.phone}</td>
      <td className="py-2 px-4 text-left">{user.location.country}</td>
      <td className="py-2 px-4 text-center">
        {user.picture && user.picture.thumbnail && (
          <img 
            src={user.picture.thumbnail} 
            alt={`${user.name.first} ${user.name.last}`} 
            className="w-8 h-8 rounded-full mx-auto border-2 border-blue-400 shadow"
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