'use client';
import { getStocks } from "../../src/apis/stocks";
import { useState, useEffect } from 'react';
import Table from "../../src/components/Table";
import Pagination from "../../src/components/Pagination";

export default function StocksPage() {
  const [page, setPage] = useState(1);
  const [stocks, setStocks] = useState([]);
  const [nextPage, setNextPage] = useState(true);
  
  useEffect(() => {
    const fetchStocks = async () => {
      const { data: stocks, nextPage } = await getStocks({
        page,
        results: 5,
      });
      setStocks(() => [...stocks]);
      setNextPage(() =>  nextPage);
    }
    fetchStocks();
  }, [page]);

  const headers = [
    { label: 'Symbol', align: 'left' },
    { label: 'Name', align: 'left' },
    { label: 'Price', align: 'left' },
    { label: 'Market Cap', align: 'left' },
    { label: 'High/Low', align: 'left' },
    { label: 'P/E', align: 'left' },
    { label: 'ROE', align: 'left' },
    { label: 'Dividend', align: 'left' }
  ];

  const renderStockRow = (stock) => (
    <tr key={stock.Symbol} className="border-b border-gray-200 hover:bg-gray-100" style={{ height: '45px' }}>
      <td className="py-2 px-4 text-left whitespace-nowrap">
        <span className="font-mono text-sm font-semibold text-blue-600">{stock.Symbol || 'N/A'}</span>
      </td>
      <td className="py-2 px-4 text-left">
        <div className="max-w-md overflow-hidden">
          <p className="text-sm font-medium">
            {stock.Name && stock.Name.length > 40 
              ? `${stock.Name.substring(0, 40)}...` 
              : stock.Name || 'N/A'
            }
          </p>
        </div>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm font-semibold text-green-600">
          {stock.CurrentPrice || 'N/A'}
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm">
          {stock.MarketCap || 'N/A'}
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-xs text-gray-600">
          {stock.HighLow || 'N/A'}
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm">
          {stock.StockPE || 'N/A'}
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className={`text-sm ${
          stock.ROE && stock.ROE.includes('-') 
            ? 'text-red-600' 
            : 'text-green-600'
        }`}>
          {stock.ROE || 'N/A'}
        </span>
      </td>
      <td className="py-2 px-4 text-left">
        <span className="text-sm">
          {stock.DividendYield || 'N/A'}
        </span>
      </td>
    </tr>
  );

  const handlePrevious = () => setPage((p) => Math.max(1, p - 1));
  const handleNext = () => setPage((p) => p + 1);

  return (
    <div>
      <Table
        title="Stocks"
        headers={headers}
        data={stocks}
        renderRow={renderStockRow}
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
