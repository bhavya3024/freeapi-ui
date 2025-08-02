import React from 'react';

const Table = ({ title, headers, data, renderRow }) => {
  return (
    <div className="px-2">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
        <div className="flex items-center space-x-4">
          <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded w-20"></div>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {data.length} items
          </span>
        </div>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100" style={{ height: '380px' }}>
        <div className="h-full flex flex-col">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200 sticky top-0 z-10">
            <table className="w-full table-auto">
              <thead>
                <tr>
                  {headers.map((header, index) => (
                    <th 
                      key={index} 
                      className={`py-3 px-3 font-semibold text-gray-700 uppercase text-xs tracking-wider ${header.align === 'center' ? 'text-center' : 'text-left'}`}
                    >
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
            </table>
          </div>
          <div className="flex-1 overflow-y-auto">
            <table className="w-full table-auto">
              <tbody className="divide-y divide-gray-100">
                {data.map((item, index) => renderRow(item, index))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Table;
