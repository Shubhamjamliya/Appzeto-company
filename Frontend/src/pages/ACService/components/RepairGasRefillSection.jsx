import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { MdOutlineAcUnit, MdFlashOn, MdWarning } from 'react-icons/md';

const RepairGasRefillSection = ({ onViewDetails, onAddClick }) => {
  const services = [
    {
      id: 1,
      title: 'AC less/no cooling repair',
      rating: '4.76',
      reviews: '473K reviews',
      price: '299',
      duration: '2 hrs 30 mins',
      label: 'NO COOLING',
      icon: MdOutlineAcUnit,
    },
    {
      id: 2,
      title: 'AC power issue repair',
      rating: '4.73',
      reviews: '124K reviews',
      price: '299',
      duration: '60 mins',
      label: 'NO POWER',
      icon: MdFlashOn,
    },
    {
      id: 3,
      title: 'AC noise/smell repair',
      rating: '4.77',
      reviews: '36K reviews',
      price: '499',
      duration: '60 mins',
      label: 'NOISE & ODOUR',
      icon: MdWarning,
    },
  ];

  return (
    <div className="mb-6 border-t border-gray-200">
      <div className="px-4 py-3">
        <h2 className="text-lg font-bold text-black">Repair & gas refill</h2>
      </div>

      <div className="px-4 py-4 space-y-4">
        {services.map((service) => {
          const IconComponent = service.icon;
          return (
            <div key={service.id} className="flex items-start gap-4">
              <div className="flex-1">
                <h3 className="text-base font-bold text-black mb-2">{service.title}</h3>
                
                <div className="flex items-center gap-2 mb-2">
                  <AiFillStar className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-black font-medium">{service.rating}</span>
                  <span className="text-sm text-gray-600">({service.reviews})</span>
                </div>

                <div className="flex items-center gap-2 mb-3">
                  <span className="text-base font-bold text-black">₹{service.price}</span>
                  <span className="text-sm text-gray-600">• {service.duration}</span>
                </div>

                <button
                  onClick={() => onViewDetails?.(service)}
                  className="text-blue-600 text-sm font-medium hover:underline"
                >
                  View details
                </button>
              </div>

              <div className="w-24 h-32 bg-gray-100 rounded-lg overflow-hidden relative">
                <div className="bg-black text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1">
                  <IconComponent className="w-3 h-3" />
                  {service.label}
                </div>
                <div className="h-full flex items-center justify-center">
                  <span className="text-xs text-gray-500">AC Image</span>
                </div>
                <button
                  onClick={() => onAddClick?.(service)}
                  className="absolute bottom-2 right-2 bg-white border border-blue-600 text-blue-600 text-xs font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RepairGasRefillSection;

