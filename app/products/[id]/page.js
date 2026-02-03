'use client';
import { getProductById } from "../../../src/apis/products";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6">
        <Link href="/products" className="text-blue-500 hover:underline mb-4 inline-block">← Back to Products</Link>
        <div className="text-red-500">{error || 'Product not found'}</div>
      </div>
    );
  }

  const discountedPrice = product.price * (1 - product.discountPercentage / 100);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/products" className="text-blue-500 hover:underline mb-6 inline-flex items-center gap-2">
        <span>←</span> Back to Products
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-4">
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex-1">
            {product.images && product.images.length > 0 && (
              <>
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.title}
                  className="w-full h-64 object-contain rounded-xl bg-gray-50 mb-4"
                />
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((img, i) => (
                    <img 
                      key={i}
                      src={img}
                      alt={`${product.title} ${i + 1}`}
                      className={`w-16 h-16 object-cover rounded-lg cursor-pointer transition-all ${selectedImage === i ? 'ring-2 ring-green-500' : 'opacity-60 hover:opacity-100'}`}
                      onClick={() => setSelectedImage(i)}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          
          <div className="flex-1">
            <span className="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full mb-2">
              {product.category}
            </span>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">{product.title}</h1>
            <p className="text-gray-500 mb-4">{product.brand}</p>
            
            <div className="flex items-center gap-3 mb-4">
              <span className="text-3xl font-bold text-green-600">${discountedPrice.toFixed(2)}</span>
              <span className="text-lg text-gray-400 line-through">${product.price}</span>
              <span className="bg-red-100 text-red-600 px-2 py-1 rounded text-sm">
                -{product.discountPercentage}%
              </span>
            </div>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-500">⭐</span>
              <span className="font-medium">{product.rating}</span>
              <span className="text-gray-500">/5</span>
            </div>

            <p className="text-gray-600 mb-6">{product.description}</p>

            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
              <span className={`font-medium ${product.stock > 10 ? 'text-green-700' : product.stock > 0 ? 'text-yellow-700' : 'text-red-700'}`}>
                {product.stock > 10 ? 'In Stock' : product.stock > 0 ? `Only ${product.stock} left` : 'Out of Stock'}
              </span>
              <span className="text-gray-500">({product.stock} units)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
