import React, { memo } from 'react';
import { MdLocalOffer } from 'react-icons/md';

const PaymentOffers = memo(({ offers = [] }) => {
  if (!offers || offers.length === 0) {
    // Default offers if none provided
    offers = [
      {
        id: 1,
        title: 'Mobikwik cashback up to ₹...',
        subtitle: 'Via Mobikwik UPI Payment',
      },
      {
        id: 2,
        title: '₹100 back - order',
        subtitle: 'Via Airtel Payment',
      },
    ];
  }

  return (
    <div className="px-4 mb-6">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="min-w-[200px] bg-white border border-gray-200 rounded-lg p-3 flex items-start gap-2 shrink-0"
          >
            <MdLocalOffer className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-black mb-1">
                {offer.title}
              </p>
              <p className="text-xs text-gray-600">{offer.subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

PaymentOffers.displayName = 'PaymentOffers';

export default PaymentOffers;

