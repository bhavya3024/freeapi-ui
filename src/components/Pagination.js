import React from 'react';

const Pagination = ({ page, nextPage, onPrevious, onNext }) => {
  return (
    <div className="px-2 mt-4 mb-4">
      <div className="flex flex-row justify-between items-center bg-white rounded-2xl shadow-lg p-4 border border-gray-100">
        <button
          className="group flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          disabled={page === 1}
          onClick={onPrevious}
        >
          <span className="transition-transform group-hover:-translate-x-1">←</span>
          <span>Previous</span>
        </button>
        
        <div className="flex items-center space-x-3">
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-2 rounded-lg border">
            <span className="text-sm text-gray-600">Page</span>
            <span className="ml-2 font-bold text-gray-800">{page}</span>
          </div>
          {nextPage && (
            <div className="flex items-center space-x-1 text-gray-400">
              <div className="w-2 h-2 bg-blue-300 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
            </div>
          )}
        </div>
        
        <button
          className="group flex items-center space-x-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          disabled={nextPage === false}
          onClick={onNext}
        >
          <span>Next</span>
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
