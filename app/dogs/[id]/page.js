'use client';
import { getDogById } from "../../../src/apis/dogs";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function DogDetailPage() {
  const { id } = useParams();
  const [dog, setDog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDog = async () => {
      try {
        setLoading(true);
        const { data } = await getDogById(id);
        setDog(data);
      } catch (err) {
        setError('Failed to load dog details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchDog();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (error || !dog) {
    return (
      <div className="p-6">
        <Link href="/dogs" className="text-blue-500 hover:underline mb-4 inline-block">← Back to Dogs</Link>
        <div className="text-red-500">{error || 'Dog not found'}</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/dogs" className="text-blue-500 hover:underline mb-6 inline-flex items-center gap-2">
        <span>←</span> Back to Dogs
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-4">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {dog.image?.url && (
            <img 
              src={dog.image.url} 
              alt={dog.name}
              className="w-64 h-48 object-cover rounded-xl shadow-lg"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{dog.name}</h1>
            {dog.breed_group && (
              <span className="inline-block bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full mb-3">
                {dog.breed_group}
              </span>
            )}
            <p className="text-gray-500 mb-2">🌍 Origin: {dog.origin || 'Unknown'}</p>
            <p className="text-gray-500 mb-4">❤️ Life Span: {dog.life_span}</p>
            
            {dog.temperament && (
              <div className="flex flex-wrap gap-2">
                {dog.temperament.split(', ').map((trait, i) => (
                  <span key={i} className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full">
                    {trait}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">📏 Physical Attributes</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Height:</span>
                <p className="font-medium">{dog.height?.metric} cm ({dog.height?.imperial} inches)</p>
              </div>
              <div>
                <span className="text-gray-500">Weight:</span>
                <p className="font-medium">{dog.weight?.metric} kg ({dog.weight?.imperial} lbs)</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">🎯 Purpose</h3>
            <div className="space-y-3 text-sm">
              {dog.bred_for && (
                <div>
                  <span className="text-gray-500">Bred For:</span>
                  <p className="font-medium">{dog.bred_for}</p>
                </div>
              )}
              {dog.breed_group && (
                <div>
                  <span className="text-gray-500">Breed Group:</span>
                  <p className="font-medium">{dog.breed_group}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {dog.history && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">📜 History</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{dog.history}</p>
          </div>
        )}
      </div>
    </div>
  );
}
