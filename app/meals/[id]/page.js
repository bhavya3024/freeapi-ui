'use client';
import { getMealById } from "../../../src/apis/meals";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function MealDetailPage() {
  const { id } = useParams();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeal = async () => {
      try {
        setLoading(true);
        const { data } = await getMealById(id);
        setMeal(data);
      } catch (err) {
        setError('Failed to load meal details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchMeal();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !meal) {
    return (
      <div className="p-6">
        <Link href="/meals" className="text-blue-500 hover:underline mb-4 inline-block">← Back to Meals</Link>
        <div className="text-red-500">{error || 'Meal not found'}</div>
      </div>
    );
  }

  // Extract ingredients and measures
  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim()) {
      ingredients.push({ ingredient, measure: measure || '' });
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/meals" className="text-blue-500 hover:underline mb-6 inline-flex items-center gap-2">
        <span>←</span> Back to Meals
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-4">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {meal.strMealThumb && (
            <img 
              src={meal.strMealThumb} 
              alt={meal.strMeal}
              className="w-64 h-64 object-cover rounded-xl shadow-lg"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{meal.strMeal}</h1>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {meal.strCategory}
              </span>
              <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                🌍 {meal.strArea}
              </span>
            </div>
            
            {meal.strTags && (
              <div className="flex flex-wrap gap-2 mb-4">
                {meal.strTags.split(',').map((tag, i) => (
                  <span key={i} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                    #{tag.trim()}
                  </span>
                ))}
              </div>
            )}

            {meal.strYoutube && (
              <a 
                href={meal.strYoutube} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                ▶️ Watch on YouTube
              </a>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">🥗 Ingredients</h3>
            <ul className="space-y-2 text-sm max-h-64 overflow-y-auto">
              {ingredients.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                  <span className="font-medium">{item.measure}</span>
                  <span className="text-gray-600">{item.ingredient}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-2 bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">📝 Instructions</h3>
            <div className="text-sm text-gray-600 leading-relaxed max-h-64 overflow-y-auto whitespace-pre-line">
              {meal.strInstructions}
            </div>
          </div>
        </div>

        {meal.strSource && (
          <a 
            href={meal.strSource} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline text-sm"
          >
            View Original Recipe →
          </a>
        )}
      </div>
    </div>
  );
}
