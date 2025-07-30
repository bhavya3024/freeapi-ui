'use client';
import { getProducts } from "../../src/apis/products";
import { useState, useEffect } from 'react';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [products, setProducts] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      const { data: products, nextPage } = await getProducts({
        page,
        results: 10,
      });
      setProducts(() => [...products]);
      setNextPage(() =>  nextPage);
    }
    fetchProducts();
  }, [page]);

  return (
    <div className="container mx-auto px-4 flex flex-col h-full">
      <h1 className="text-2xl font-bold my-4">Products</h1>
      <div className="overflow-x-auto flex-grow overflow-y-auto shadow-md rounded-lg">
        <table className="min-w-full bg-white rounded-lg">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal sticky top-0 z-10">
            <tr>
              <th className="py-3 px-6 text-left">ID</th>
              <th className="py-3 px-6 text-left">Title</th>
              <th className="py-3 px-6 text-left">Brand</th>
              <th className="py-3 px-6 text-left">Category</th>
              <th className="py-3 px-6 text-left">Price</th>
              <th className="py-3 px-6 text-left">Rating</th>
              <th className="py-3 px-6 text-left">Stock</th>
              <th className="py-3 px-6 text-center">Image</th>
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {products.map((product) => (
              <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100">
                <td className="py-3 px-6 text-left whitespace-nowrap">{product.id}</td>
                <td className="py-3 px-6 text-left">{product.title}</td>
                <td className="py-3 px-6 text-left">{product.brand}</td>
                <td className="py-3 px-6 text-left">{product.category}</td>
                <td className="py-3 px-6 text-left">${product.price}</td>
                <td className="py-3 px-6 text-left">{product.rating}</td>
                <td className="py-3 px-6 text-left">{product.stock}</td>
                <td className="py-3 px-6 text-center">
                  {product.thumbnail && (
                    <img 
                      src={product.thumbnail} 
                      alt={product.title} 
                      className="w-8 h-8 rounded mx-auto border-2 border-blue-400 shadow object-cover"
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination controls */}
      <div className="flex flex-row justify-between items-center mt-6">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-200 disabled:opacity-50 cursor-pointer"
          disabled={page === 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          &#8592; Previous
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-200 disabled:opacity-50 cursor-pointer"
          disabled={nextPage === false}
          onClick={() => setPage((p) => p + 1)}
        >
          Next &#8594;
        </button>
      </div>
    </div>
  );
}