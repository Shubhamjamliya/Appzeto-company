import React from 'react';
import { MdLocalOffer } from 'react-icons/md';

const PaymentOffers = () => {
  return (
    <div className="px-4 mb-6">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {/* Mobikwik Offer */}
        <div className="min-w-[200px] bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-2 shrink-0">
          <MdLocalOffer className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black mb-1">
              Mobikwik cashback up to ₹...
            </p>
            <p className="text-xs text-gray-600">Via Mobikwik UPI Payment</p>
          </div>
        </div>

        {/* Airtel Payment Offer */}
        <div className="min-w-[200px] bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-2 shrink-0">
          <MdLocalOffer className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-black mb-1">
              ₹100 back - order
            </p>
            <p className="text-xs text-gray-600">Via Airtel Payment</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentOffers;

