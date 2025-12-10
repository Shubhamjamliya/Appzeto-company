import React from 'react';
import { themeColors } from '../../../theme';
import { AiFillStar } from 'react-icons/ai';
import intenseBathroom2 from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/intense-bathroom-2.jpg';
import intenseBathroom3 from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/intense-bathroom-3.jpg';
import bathroomCleaning from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/bathroom-cleaning.png';

const BathroomCleaningSection = ({ onAddClick, onViewDetails }) => {
  const services = [
    {
      id: 1,
      title: 'Intense bathroom cleaning',
      rating: '4.80',
      reviews: '4.5M',
      price: '519',
      duration: '60 mins',
      badge: 'BESTSELLER',
      features: [
        'Floor & tile cleaning with scrubbing machine',
        'Recommended for deep-cleaning and tough stains',
      ],
      image: intenseBathroom2,
    },
    {
      id: 2,
      title: 'Move-in bathroom cleaning',
      rating: '4.81',
      reviews: '1.1M',
      price: '579',
      duration: '1 hr 30 mins',
      features: [
        'Extra 10 mins of machine scrubbing of floor and tiles',
        'Recommended before moving into a new or unused bathroom',
      ],
      image: intenseBathroom3,
    },
    {
      id: 3,
      title: 'Classic bathroom cleaning',
      rating: '4.82',
      reviews: '1.5M',
      price: '499',
      duration: '1 hr',
      features: [
        'Standard bathroom cleaning service',
        'Includes all essential cleaning tasks',
      ],
      image: bathroomCleaning,
    },
  ];

  return (
    <div className="mb-6 border-t-4 border-gray-300 pt-6" id="bathroom-cleaning">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold text-black">Bathroom cleaning</h2>
      </div>

      <div className="px-4 space-y-6">
        {services.map((service) => (
          <div key={service.id} className="flex gap-4">
            {/* Service Details */}
            <div className="flex-1">
              {service.badge && (
                <span className="inline-block bg-green-500 text-white text-xs font-bold px-2 py-1 rounded mb-2">
                  {service.badge}
                </span>
              )}
              <h3 className="text-lg font-bold text-black mb-2">{service.title}</h3>
              <div className="flex items-center gap-1 mb-2">
                <AiFillStar className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-gray-700">{service.rating} ({service.reviews} reviews)</span>
              </div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-gray-700">Starts at ₹{service.price}</span>
                {service.duration && (
                  <>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm text-gray-600">{service.duration}</span>
                  </>
                )}
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
                      style={{ color: themeColors.button }}
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
                  <button
                    onClick={() => onAddClick?.(service)}
                    className="absolute bottom-2 right-2 bg-white text-brand px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                      style={{ color: themeColors.button }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#f0f0f0'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#ffffff'}
                  >
                    Add
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BathroomCleaningSection;

