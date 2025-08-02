'use client';
import { getCats } from "../../src/apis/cats";
import { useState, useEffect } from 'react';
import Table from "../../src/components/Table";
import Pagination from "../../src/components/Pagination";

export default function CatsPage() {
  const [page, setPage] = useState(1);
  const [cats, setCats] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  
  useEffect(() => {
    const fetchCats = async () => {
      const { data: { data: cats, nextPage } } = await getCats({
        page,
        limit: 5,
      });
      console.log('CATS --->>>', JSON.stringify(cats));
      setCats(() => [...cats]);
      setNextPage(() => nextPage);
    }
    fetchCats();
  }, [page]);

  const headers = [
    { label: 'Image', align: 'left' },
    { label: 'Name', align: 'left' },
    { label: 'Temperament', align: 'left' },
    { label: 'Origin', align: 'left' },
    { label: 'Life Span', align: 'left' },
    { label: 'Weight', align: 'left' },
    { label: 'Description', align: 'left' }
  ];

  const renderCatRow = (cat) => (
    <tr key={cat.id} className="border-b border-gray-200 hover:bg-gray-100" style={{ height: '45px' }}>
      <td className="py-2 px-4 text-left">
        <img 
          src={cat.image || 'N/A'} 
          alt={cat.name || 'Cat'} 
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxNkM4IDcgOCAzMyAyMCAyNFMyMCA3IDIwIDE2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
          }}
        />
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm font-medium">{cat.name || 'N/A'}</span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-xs text-gray-600">
          {cat.temperament && cat.temperament.length > 30 
            ? `${cat.temperament.substring(0, 30)}...` 
            : cat.temperament || 'N/A'
          }
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm">{cat.origin || 'N/A'}</span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm">{cat.life_span || 'N/A'}</span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-xs text-gray-600">
          {cat.weight?.metric || 'N/A'} kg
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-xs text-gray-500">
          {cat.description && cat.description.length > 40 
            ? `${cat.description.substring(0, 40)}...` 
            : cat.description || 'N/A'
          }
        </span>
      </td>
    </tr>
  );

  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <div>
      <Table
        title="Cats"
        headers={headers}
        data={cats}
        renderRow={renderCatRow}
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
