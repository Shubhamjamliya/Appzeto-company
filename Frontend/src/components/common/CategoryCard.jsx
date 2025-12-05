import React from 'react';

const CategoryCard = ({ icon, title, onClick, hasSaleBadge = false }) => {
  return (
    <div
      className="flex flex-col items-center justify-center p-2 cursor-pointer active:scale-95 transition-transform relative"
      onClick={onClick}
    >
      <div 
        className="w-14 h-14 rounded-full flex items-center justify-center mb-1.5 relative backdrop-blur-md border"
        style={{ 
          backgroundColor: 'rgba(0, 166, 166, 0.15)',
          borderColor: '#29ad81',
          boxShadow: '0 4px 6px -1px rgba(0, 166, 166, 0.2), 0 2px 4px -1px rgba(0, 166, 166, 0.1)'
        }}
      >
        {icon || (
          <svg
            className="w-7 h-7 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {hasSaleBadge && (
          <div className="absolute -top-0.5 -right-0.5 bg-green-500 text-white text-[8px] font-semibold px-1 py-0.5 rounded-full">
            Sale
          </div>
        )}
      </div>
      <span className="text-[10px] text-center text-gray-700 font-medium leading-tight px-0.5">
        {title}
      </span>
    </div>
  );
};

export default CategoryCard;

