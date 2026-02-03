'use client';
import { getStockBySymbol } from "../../../src/apis/stocks";
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

export default function StockDetailPage() {
  const { symbol } = useParams();
  const [stock, setStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStock = async () => {
      try {
        setLoading(true);
        const { data } = await getStockBySymbol(symbol);
        setStock(data);
      } catch (err) {
        setError('Failed to load stock details');
      } finally {
        setLoading(false);
      }
    };
    if (symbol) fetchStock();
  }, [symbol]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (error || !stock) {
    return (
      <div className="p-6">
        <Link href="/stocks" className="text-blue-500 hover:underline mb-4 inline-block">← Back to Stocks</Link>
        <div className="text-red-500">{error || 'Stock not found'}</div>
      </div>
    );
  }

  const InfoCard = ({ label, value, colorClass = 'text-gray-800' }) => (
    <div className="bg-gray-50 rounded-lg p-3">
      <span className="text-xs text-gray-500 block">{label}</span>
      <span className={`font-semibold ${colorClass}`}>{value || 'N/A'}</span>
    </div>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Link href="/stocks" className="text-blue-500 hover:underline mb-6 inline-flex items-center gap-2">
        <span>←</span> Back to Stocks
      </Link>
      
      <div className="bg-white rounded-2xl shadow-xl p-8 mt-4">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl font-bold font-mono text-blue-600">{stock.Symbol}</span>
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">{stock.ISIN}</span>
            </div>
            <h1 className="text-xl font-bold text-gray-800">{stock.Name}</h1>
            <p className="text-gray-500 text-sm">Listed: {stock.ListingDate}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold text-green-600">{stock.CurrentPrice}</p>
            <p className="text-sm text-gray-500">Current Price</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <InfoCard label="Market Cap" value={stock.MarketCap} />
          <InfoCard label="High / Low" value={stock.HighLow} />
          <InfoCard label="Book Value" value={stock.BookValue} />
          <InfoCard label="Stock P/E" value={stock.StockPE} />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <InfoCard 
            label="ROCE" 
            value={stock.ROCE} 
            colorClass={stock.ROCE?.includes('-') ? 'text-red-600' : 'text-green-600'} 
          />
          <InfoCard 
            label="ROE" 
            value={stock.ROE} 
            colorClass={stock.ROE?.includes('-') ? 'text-red-600' : 'text-green-600'} 
          />
          <InfoCard label="Dividend Yield" value={stock.DividendYield} colorClass="text-blue-600" />
          <InfoCard label="Face Value" value={stock.FaceValue} />
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-xl p-6">
          <h3 className="font-semibold text-gray-700 mb-4">📊 Key Metrics</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="text-gray-500">EPS (TTM):</span>
              <p className="font-medium">{stock.EPS || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-500">Industry P/E:</span>
              <p className="font-medium">{stock.IndustryPE || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-500">PEG Ratio:</span>
              <p className="font-medium">{stock.PEGRatio || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-500">Price to Book:</span>
              <p className="font-medium">{stock.PriceToBook || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-500">Debt to Equity:</span>
              <p className="font-medium">{stock.DebtToEquity || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-500">Current Ratio:</span>
              <p className="font-medium">{stock.CurrentRatio || 'N/A'}</p>
            </div>
          </div>
        </div>

        {stock.Pros && stock.Pros.length > 0 && (
          <div className="mt-6 bg-green-50 rounded-xl p-4">
            <h3 className="font-semibold text-green-800 mb-3">✅ Pros</h3>
            <ul className="space-y-2">
              {stock.Pros.map((pro, i) => (
                <li key={i} className="text-sm text-green-700 flex items-start gap-2">
                  <span>•</span> {pro}
                </li>
              ))}
            </ul>
          </div>
        )}

        {stock.Cons && stock.Cons.length > 0 && (
          <div className="mt-4 bg-red-50 rounded-xl p-4">
            <h3 className="font-semibold text-red-800 mb-3">⚠️ Cons</h3>
            <ul className="space-y-2">
              {stock.Cons.map((con, i) => (
                <li key={i} className="text-sm text-red-700 flex items-start gap-2">
                  <span>•</span> {con}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
