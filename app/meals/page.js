'use client';
import { getMeals } from "../../src/apis/meals";
import { useState, useEffect } from 'react';
import Table from "../../src/components/Table";
import Pagination from "../../src/components/Pagination";

export default function MealsPage() {
  const [page, setPage] = useState(1);
  const [meals, setMeals] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  
  useEffect(() => {
    const fetchMeals = async () => {
      const { data: { meals } } = await getMeals({
        page,
        results: 5,
      });
      console.log('MEALS --->>>', JSON.stringify(meals));
      setMeals(() => [...meals]);
      setNextPage(() => nextPage);
    }
    fetchMeals();
  }, [page]);

  const headers = [
    { label: 'Image', align: 'left' },
    { label: 'Meal', align: 'left' },
    { label: 'Category', align: 'left' },
    { label: 'Area', align: 'left' },
    { label: 'Instructions', align: 'left' },
    { label: 'Tags', align: 'left' }
  ];

  const renderMealRow = (meal) => (
    <tr key={meal.id} className="border-b border-gray-200 hover:bg-gray-100" style={{ height: '45px' }}>
      <td className="py-2 px-4 text-left">
        <img 
          src={meal.strMealThumb || 'N/A'} 
          alt={meal.strMeal || 'Meal'} 
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxNkM4IDcgOCAzMyAyMCAyNFMyMCA3IDIwIDE2WiIgZmlsbD0iIzlDQTNBRiIvPgo8L3N2Zz4K';
          }}
        />
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm font-medium">
          {meal.strMeal && meal.strMeal.length > 25 
            ? `${meal.strMeal.substring(0, 25)}...` 
            : meal.strMeal || 'N/A'
          }
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
          {meal.strCategory || 'N/A'}
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm">{meal.strArea || 'N/A'}</span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-xs text-gray-600">
          {meal.strInstructions && meal.strInstructions.length > 50 
            ? `${meal.strInstructions.substring(0, 50)}...` 
            : meal.strInstructions || 'N/A'
          }
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-xs text-gray-500">
          {meal.strTags || 'N/A'}
        </span>
      </td>
    </tr>
  );

  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <div>
      <Table
        title="Meals"
        headers={headers}
        data={meals}
        renderRow={renderMealRow}
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
