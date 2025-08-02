import React from 'react';

const Table = ({ title, headers, data, renderRow }) => {
  return (
    <div className="px-4">
      <h1 className="text-2xl font-bold my-3">{title}</h1>
      <div className="overflow-x-auto shadow-md rounded-lg" style={{ height: '450px' }}>
        <table className="min-w-full bg-white rounded-lg table-fixed">
          <thead className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal sticky top-0">
            <tr>
              {headers.map((header, index) => (
                <th 
                  key={index} 
                  className={`py-2 px-4 ${header.align === 'center' ? 'text-center' : 'text-left'}`}
                >
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-gray-600 text-sm font-light">
            {data.map((item, index) => renderRow(item, index))}
            {/* Add empty rows to maintain consistent height */}
            {Array.from({ length: Math.max(0, 10 - data.length) }).map((_, index) => (
              <tr key={`empty-${index}`} className="border-b border-gray-200" style={{ height: '45px' }}>
                {headers.map((_, headerIndex) => (
                  <td key={headerIndex} className="py-2 px-4"></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
