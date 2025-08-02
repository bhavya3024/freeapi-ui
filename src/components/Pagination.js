import React from 'react';

const Pagination = ({ page, nextPage, onPrevious, onNext }) => {
  return (
    <div className="px-4">
      <div className="flex flex-row justify-between items-center mt-4 mb-2">
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-200 disabled:opacity-50 cursor-pointer"
          disabled={page === 1}
          onClick={onPrevious}
        >
          &#8592; Previous
        </button>
        <button
          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded shadow transition duration-200 disabled:opacity-50 cursor-pointer"
          disabled={nextPage === false}
          onClick={onNext}
        >
          Next &#8594;
        </button>
      </div>
    </div>
  );
};

export default Pagination;
