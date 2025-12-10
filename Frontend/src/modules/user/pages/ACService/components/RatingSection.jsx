import React from 'react';
import { AiFillStar } from 'react-icons/ai';

const RatingSection = () => {
  return (
    <div className="px-4 py-2">
      <div className="flex items-center gap-2">
        <AiFillStar className="w-5 h-5 text-black" />
        <span className="text-sm text-black font-medium">4.74</span>
        <span className="text-sm text-gray-600">(11.4 M bookings)</span>
      </div>
    </div>
  );
};

export default RatingSection;

