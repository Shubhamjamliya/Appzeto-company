import React from 'react';
import { themeColors } from '../../../../../theme';
import { AiFillStar } from 'react-icons/ai';
import carpet from '../../../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/carpet.jpg';

const CarpetCleaningSection = ({ onAddClick, onViewDetails }) => {
  const services = [
    {
      id: 1,
      title: 'Carpet cleaning',
      rating: '4.80',
      reviews: '109K',
      price: '399',
      options: '5 options',
      features: [
        'Dry vacuuming to remove crumbs & dirt particles',
        'Wet shampooing & vacuuming to remove tough stains and spillages',
      ],
      image: carpet,
    },
  ];

  return (
    <div className="mb-6 border-t-4 border-gray-300 pt-6" id="carpet">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold text-black">Carpet</h2>
      </div>

      <div className="px-4 space-y-6">
        {services.map((service) => (
          <div key={service.id} className="flex gap-4">
            {/* Service Details */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-black mb-2">{service.title}</h3>
              <div className="flex items-center gap-1 mb-2">
                <AiFillStar className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-700">{service.rating} ({service.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-700">Starts at ₹{service.price}</span>
              </div>
              {service.features && (
                <ul className="space-y-1 mb-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => onViewDetails?.(service)}
                className="text-brand text-sm font-medium hover:underline"
                style={{ color: '#00a6a6' }}
              >
                View details
              </button>
            </div>

            {/* Service Image */}
            <div className="relative w-32 h-32 rounded-lg overflow-hidden flex-shrink-0">
              {service.image && (
                <>
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-2 right-2 flex flex-col items-end gap-2">
                    <button
                      onClick={() => onAddClick?.(service)}
                      className="bg-white text-brand px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                      style={{ color: themeColors.button }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                    >
                      Add
                    </button>
                    {service.options && (
                      <span className="text-[10px] text-gray-600 bg-white/90 px-2 py-0.5 rounded">
                        {service.options}
                      </span>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CarpetCleaningSection;

