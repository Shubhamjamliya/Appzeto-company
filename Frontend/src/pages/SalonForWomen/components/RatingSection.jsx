import React from 'react';
import { AiFillStar } from 'react-icons/ai';

const RatingSection = () => {
  return (
    <div className="px-4 py-4">
      <h1 className="text-2xl font-bold text-black mb-2">Salon Prime</h1>
      <div className="flex items-center gap-1">
        <AiFillStar className="w-5 h-5 text-yellow-400" />
        <span className="text-base font-medium text-black">4.85</span>
        <span className="text-sm text-gray-600">(15.9 M bookings)</span>
      </div>
    </div>
  );
};

export default RatingSection;

