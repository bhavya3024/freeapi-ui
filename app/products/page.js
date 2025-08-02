'use client';
import { getProducts } from "../../src/apis/products";
import { useState, useEffect } from 'react';
import Table from "../../src/components/Table";
import Pagination from "../../src/components/Pagination";

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  
  useEffect(() => {
    const fetchProducts = async () => {
      const { data: products, nextPage } = await getProducts({
        page,
        results: 5,
      });
      setProducts(() => [...products]);
      setNextPage(() =>  nextPage);
    }
    fetchProducts();
  }, [page]);

  const headers = [
    { label: 'Product', align: 'left' },
    { label: 'Details', align: 'left' },
    { label: 'Price & Rating', align: 'left' },
    { label: 'Availability', align: 'left' }
  ];

  const renderProductRow = (product) => (
    <tr key={product.id} className="group hover:bg-gradient-to-r hover:from-green-50 hover:to-blue-50 transition-all duration-200" style={{ height: '60px' }}>
      <td className="py-3 px-3 text-left">
        <div className="flex items-center space-x-2">
          {product.thumbnail && (
            <img 
              src={product.thumbnail} 
              alt={product.title} 
              className="w-10 h-10 rounded-lg object-cover border border-white shadow-sm ring-1 ring-green-100 group-hover:ring-green-200 transition-all flex-shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <div className="font-medium text-gray-800 group-hover:text-gray-900 text-sm truncate">
              {product.title}
            </div>
            <div className="text-xs text-gray-500">ID: {product.id}</div>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-left">
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <span className="text-blue-600 text-sm">🏷️</span>
            <span className="text-xs font-medium text-gray-700 truncate">{product.brand}</span>
          </div>
          <div className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 border border-purple-200">
            {product.category}
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-left">
        <div className="space-y-1">
          <div className="flex items-center space-x-1">
            <span className="text-lg font-bold text-green-600">${product.price}</span>
            {product.discountPercentage && (
              <span className="text-xs bg-red-100 text-red-600 px-1 py-0.5 rounded-full">
                -{product.discountPercentage}%
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <span className="text-yellow-500 text-sm">⭐</span>
            <span className="text-xs font-medium text-gray-700">{product.rating}</span>
            <span className="text-xs text-gray-500">/5</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-left">
        <div className="flex items-center space-x-1">
          <div className={`w-2 h-2 rounded-full ${product.stock > 10 ? 'bg-green-500' : product.stock > 0 ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
          <span className={`text-xs font-medium ${product.stock > 10 ? 'text-green-700' : product.stock > 0 ? 'text-yellow-700' : 'text-red-700'}`}>
            {product.stock}
          </span>
        </div>
      </td>
    </tr>
  );

  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <div>
      <Table
        title="Products"
        headers={headers}
        data={products}
        renderRow={renderProductRow}
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