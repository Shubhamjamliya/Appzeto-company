import React from 'react';
import { themeColors } from '../../../../../theme';
import { AiFillStar } from 'react-icons/ai';

const InstallationSection = ({ onViewDetails, onAddClick }) => {
  const services = [
    {
      id: 1,
      title: 'Split AC installation',
      rating: '4.70',
      reviews: '111K reviews',
      price: '1,699',
      duration: '2 hrs',
    },
    {
      id: 2,
      title: 'Window AC installation',
      rating: '4.79',
      reviews: '13K reviews',
      price: '799',
      duration: '2 hrs',
    },
    {
      id: 3,
      title: 'Split AC uninstallation',
      rating: '4.82',
      reviews: '113K reviews',
      price: '649',
      duration: '60 mins',
    },
    {
      id: 4,
      title: 'Window AC uninstallation',
      rating: '4.85',
      reviews: '10K reviews',
      price: '699',
      duration: '60 mins',
    },
  ];

  return (
    <div className="mb-6 border-t border-gray-200" id="installation-uninstallation">
      <div className="px-4 py-3">
        <h2 className="text-lg font-bold text-black">Installation/uninstallation</h2>
      </div>

      <div className="px-4 py-4 space-y-4">
        {services.map((service) => (
          <div key={service.id} className="flex items-start gap-4">
            <div className="flex-1">
              <h3 className="text-base font-bold text-black mb-2">{service.title}</h3>
              
              <div className="flex items-center gap-2 mb-2">
                <AiFillStar className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-black font-medium">{service.rating}</span>
                <span className="text-sm text-gray-600 underline">({service.reviews})</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-base font-bold text-black">₹{service.price}</span>
                <span className="text-sm text-gray-600">• {service.duration}</span>
              </div>

              <button
                onClick={() => onViewDetails?.(service)}
                className="text-sm font-medium hover:underline"
                      style={{ color: themeColors.button }}
              >
                View details
              </button>
            </div>

            <div className="w-24 h-32 bg-gray-200 rounded-lg overflow-hidden relative">
              <div className="h-full flex items-center justify-center">
                <span className="text-xs text-gray-500">AC Image</span>
              </div>
              <button
                onClick={() => onAddClick?.(service)}
                className="absolute bottom-2 right-2 bg-white text-xs font-semibold px-3 py-1 rounded-lg active:scale-95 transition-all"
                style={{ 
                  border: `1px solid ${themeColors.button}`,
                  color: themeColors.button
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 166, 166, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
              >
                Add
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InstallationSection;

