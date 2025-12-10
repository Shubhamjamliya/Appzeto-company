import React from 'react';
import { FiCheck, FiChevronRight } from 'react-icons/fi';
import { MdLocalOffer } from 'react-icons/md';

const PromoCards = () => {
  return (
    <div className="px-4 py-3 space-y-3">
      {/* UC Cover Card */}
      <div className="bg-gray-100 rounded-lg p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
            <FiCheck className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-black">UC COVER</span>
            </div>
            <p className="text-xs text-gray-700">Upto 30 days warranty on repairs</p>
          </div>
        </div>
        <FiChevronRight className="w-5 h-5 text-gray-600" />
      </div>

      {/* Cashback Cards */}
      <div className="flex gap-3">
        <div className="flex-1 bg-gray-50 rounded-lg p-3 flex items-center gap-2">
          <MdLocalOffer className="w-5 h-5 text-green-500" />
          <div className="flex-1">
            <p className="text-xs font-medium text-black">Amazon cashback upto ₹125</p>
            <p className="text-xs text-gray-600">Via Amazon Pay balance</p>
          </div>
        </div>
        <div className="flex-1 bg-gray-50 rounded-lg p-3 flex items-center gap-2">
          <MdLocalOffer className="w-5 h-5 text-green-500" />
          <div className="flex-1">
            <p className="text-xs font-medium text-black">Flat ₹100 Cashback</p>
            <p className="text-xs text-gray-600">Via Mobikwik UPI</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromoCards;

