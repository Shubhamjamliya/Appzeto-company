import React from 'react';
import { FiArrowLeft, FiSearch, FiShare2 } from 'react-icons/fi';

const MassageHeader = ({ onBack, onSearch, onShare, isVisible }) => {
  return (
    <header 
      className={`fixed top-0 left-0 right-0 bg-white px-4 py-3 border-b border-gray-200 z-50 shadow-sm transition-all duration-300 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}
    >
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <FiArrowLeft className="w-6 h-6 text-gray-800" />
        </button>

        <h1 className="text-base font-semibold text-black">Massage for Men</h1>

        <div className="flex items-center gap-2">
          <button
            onClick={onSearch}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FiSearch className="w-6 h-6 text-gray-800" />
          </button>
          <button
            onClick={onShare}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <FiShare2 className="w-6 h-6 text-gray-800" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default MassageHeader;

