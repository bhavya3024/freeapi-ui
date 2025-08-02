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
        results: 10,
      });
      setProducts(() => [...products]);
      setNextPage(() =>  nextPage);
    }
    fetchProducts();
  }, [page]);

  const headers = [
    { label: 'ID', align: 'left' },
    { label: 'Title', align: 'left' },
    { label: 'Brand', align: 'left' },
    { label: 'Category', align: 'left' },
    { label: 'Price', align: 'left' },
    { label: 'Rating', align: 'left' },
    { label: 'Stock', align: 'left' },
    { label: 'Image', align: 'center' }
  ];

  const renderProductRow = (product) => (
    <tr key={product.id} className="border-b border-gray-200 hover:bg-gray-100" style={{ height: '45px' }}>
      <td className="py-2 px-4 text-left whitespace-nowrap">{product.id}</td>
      <td className="py-2 px-4 text-left">{product.title}</td>
      <td className="py-2 px-4 text-left">{product.brand}</td>
      <td className="py-2 px-4 text-left">{product.category}</td>
      <td className="py-2 px-4 text-left">${product.price}</td>
      <td className="py-2 px-4 text-left">{product.rating}</td>
      <td className="py-2 px-4 text-left">{product.stock}</td>
      <td className="py-2 px-4 text-center">
        {product.thumbnail && (
          <img 
            src={product.thumbnail} 
            alt={product.title} 
            className="w-8 h-8 rounded mx-auto border-2 border-blue-400 shadow object-cover"
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