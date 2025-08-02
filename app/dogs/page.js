'use client';
import { getDogs } from "../../src/apis/dogs";
import { useState, useEffect } from 'react';
import Table from "../../src/components/Table";
import Pagination from "../../src/components/Pagination";

export default function DogsPage() {
  const [page, setPage] = useState(1);
  const [dogs, setDogs] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  
  useEffect(() => {
    const fetchDogs = async () => {
      const { data: { data: dogs, nextPage } } = await getDogs({
        page,
        limit: 5,
      });
      console.log('DOGS --->>>', JSON.stringify(dogs));
      setDogs(() => [...dogs]);
      setNextPage(() => nextPage);
    }
    fetchDogs();
  }, [page]);

  const headers = [
    { label: 'Image', align: 'left' },
    { label: 'Name', align: 'left' },
    { label: 'Breed Group', align: 'left' },
    { label: 'Temperament', align: 'left' },
    { label: 'Life Span', align: 'left' },
    { label: 'Weight', align: 'left' },
    { label: 'Height', align: 'left' }
  ];

  const renderDogRow = (dog) => (
    <tr key={dog.id} className="border-b border-gray-200 hover:bg-gray-100" style={{ height: '45px' }}>
      <td className="py-2 px-4 text-left">
        <img 
          src={dog.image?.url || 'N/A'} 
          alt={dog.name || 'Dog'} 
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxNkM4IDcgOCAzMyAyMCAyNFMyMCA3IDIwIDE2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
          }}
        />
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm font-medium">{dog.name || 'N/A'}</span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm">{dog.breed_group || 'N/A'}</span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-xs text-gray-600">
          {dog.temperament && dog.temperament.length > 25 
            ? `${dog.temperament.substring(0, 25)}...` 
            : dog.temperament || 'N/A'
          }
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm">{dog.life_span || 'N/A'}</span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-xs text-gray-600">
          {dog.weight?.metric || 'N/A'} kg
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-xs text-gray-600">
          {dog.height?.metric || 'N/A'} cm
        </span>
      </td>
    </tr>
  );

  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <div>
      <Table
        title="Dogs"
        headers={headers}
        data={dogs}
        renderRow={renderDogRow}
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
