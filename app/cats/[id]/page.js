'use client';
import { getCatById } from "../../../src/apis/cats";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function CatDetailPage() {
  const { id } = useParams();
  const [cat, setCat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCat = async () => {
      try {
        setLoading(true);
        const { data } = await getCatById(id);
        setCat(data);
      } catch (err) {
        setError('Failed to load cat details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchCat();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !cat) {
    return (
      <div className="p-6">
        <Link href="/cats" className="text-blue-500 hover:underline mb-4 inline-block">← Back to Cats</Link>
        <div className="text-red-500">{error || 'Cat not found'}</div>
      </div>
    );
  }

  const StatBar = ({ label, value }) => (
    <div className="flex items-center gap-2">
      <span className="text-gray-500 w-32 text-sm">{label}</span>
      <div className="flex-1 bg-gray-200 rounded-full h-2">
        <div 
          className="bg-orange-500 rounded-full h-2 transition-all duration-500" 
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-sm font-medium w-4">{value}</span>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/cats" className="text-blue-500 hover:underline mb-6 inline-flex items-center gap-2">
        <span>←</span> Back to Cats
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-4">
        <div className="flex flex-col md:flex-row gap-6 mb-8">
          {cat.image && (
            <img 
              src={cat.image} 
              alt={cat.name}
              className="w-48 h-48 object-cover rounded-xl shadow-lg"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{cat.name}</h1>
            <p className="text-gray-500 mb-2">🌍 Origin: {cat.origin}</p>
            <p className="text-gray-500 mb-4">❤️ Life Span: {cat.life_span} years</p>
            
            {cat.temperament && (
              <div className="flex flex-wrap gap-2">
                {cat.temperament.split(', ').map((trait, i) => (
                  <span key={i} className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full">
                    {trait}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-4">📊 Characteristics</h3>
            <div className="space-y-3">
              <StatBar label="Adaptability" value={cat.adaptability} />
              <StatBar label="Affection Level" value={cat.affection_level} />
              <StatBar label="Child Friendly" value={cat.child_friendly} />
              <StatBar label="Dog Friendly" value={cat.dog_friendly} />
              <StatBar label="Energy Level" value={cat.energy_level} />
              <StatBar label="Intelligence" value={cat.intelligence} />
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-4">🏥 Health & Care</h3>
            <div className="space-y-3">
              <StatBar label="Grooming" value={cat.grooming} />
              <StatBar label="Health Issues" value={cat.health_issues} />
              <StatBar label="Shedding Level" value={cat.shedding_level} />
              <StatBar label="Social Needs" value={cat.social_needs} />
              <StatBar label="Stranger Friendly" value={cat.stranger_friendly} />
              <StatBar label="Vocalisation" value={cat.vocalisation} />
            </div>
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h3 className="font-semibold text-gray-700 mb-3">📏 Physical Attributes</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Weight (Metric):</span>
              <p className="font-medium">{cat.weight?.metric} kg</p>
            </div>
            <div>
              <span className="text-gray-500">Weight (Imperial):</span>
              <p className="font-medium">{cat.weight?.imperial} lbs</p>
            </div>
            <div>
              <span className="text-gray-500">Indoor:</span>
              <p className="font-medium">{cat.indoor ? 'Yes' : 'No'}</p>
            </div>
            <div>
              <span className="text-gray-500">Lap Cat:</span>
              <p className="font-medium">{cat.lap ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </div>

        {cat.description && (
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="font-semibold text-gray-700 mb-3">📝 Description</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{cat.description}</p>
          </div>
        )}

        <div className="flex gap-4 mt-6">
          {cat.wikipedia_url && (
            <a href={cat.wikipedia_url} target="_blank" rel="noopener noreferrer" 
               className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              Wikipedia
            </a>
          )}
          {cat.cfa_url && (
            <a href={cat.cfa_url} target="_blank" rel="noopener noreferrer"
               className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm transition-colors">
              CFA Profile
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
