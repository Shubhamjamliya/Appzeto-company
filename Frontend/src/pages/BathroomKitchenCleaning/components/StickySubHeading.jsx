import React from 'react';

const StickySubHeading = ({ title, isVisible }) => {
  if (!isVisible || !title || title.trim() === '') {
    return null;
  }

  return (
    <div className="fixed top-[57px] left-0 right-0 bg-white border-b border-gray-200 z-40 px-4 py-2.5 shadow-sm transition-all duration-200 ease-in-out">
      <h2 className="text-base font-semibold text-black">{title}</h2>
    </div>
  );
};

export default StickySubHeading;

