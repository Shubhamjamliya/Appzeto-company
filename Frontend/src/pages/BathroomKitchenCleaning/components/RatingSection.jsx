import React from 'react';
import { AiFillStar } from 'react-icons/ai';

const RatingSection = () => {
  return (
    <div className="px-4 py-4 border-b border-gray-200">
      <div className="flex items-center gap-2">
        <AiFillStar className="w-5 h-5 text-yellow-400" />
        <span className="text-base font-semibold text-black">4.79</span>
        <span className="text-sm text-gray-600">(8.7 M bookings)</span>
      </div>
    </div>
  );
};

export default RatingSection;

