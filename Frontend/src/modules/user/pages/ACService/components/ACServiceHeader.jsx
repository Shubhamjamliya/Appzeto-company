import React from 'react';
import { FiArrowLeft, FiSearch, FiShare2 } from 'react-icons/fi';

const ACServiceHeader = ({ onBack, onSearch, onShare }) => {
  return (
    <header className="bg-white px-4 py-3 border-b border-gray-200">
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
        >
          <FiArrowLeft className="w-6 h-6 text-gray-800" />
        </button>

        <h1 className="text-lg font-bold text-black">AC Service and Repair</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearch}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiSearch className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={onShare}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <FiShare2 className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ACServiceHeader;

