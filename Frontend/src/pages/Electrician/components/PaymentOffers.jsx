import React from 'react';

const PaymentOffers = () => {
  const offers = [
    {
      id: 1,
      title: 'Mobikwik cashback up to ₹...',
      subtitle: 'Via Mobikwik UPI Payment',
      icon: '🍃',
    },
    {
      id: 2,
      title: '₹100 back - ord',
      subtitle: 'Via Airtel Payme',
      icon: '🍃',
    },
  ];

  return (
    <div className="px-4 py-4">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="flex-shrink-0 bg-white border border-gray-200 rounded-lg p-3 min-w-[200px]"
          >
            <div className="flex items-start gap-2">
              <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded flex items-center gap-1">
                <span>{offer.icon}</span>
                <span>OFFER</span>
              </div>
            </div>
            <p className="text-sm font-medium text-black mt-2">{offer.title}</p>
            <p className="text-xs text-gray-600 mt-1">{offer.subtitle}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PaymentOffers;

