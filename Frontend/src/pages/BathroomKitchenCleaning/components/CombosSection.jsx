import React from 'react';
import { themeColors } from '../../../theme';
import { AiFillStar } from 'react-icons/ai';
import intenseCleaning from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/intense-cleaning.jpg';
import intenseBathroom2 from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/intense-bathroom-2.jpg';
import intenseBathroom3 from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/intense-bathroom-3.jpg';
import bathroomCleaning from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/bathroom-cleaning.png';

const CombosSection = ({ onAddClick, onViewDetails }) => {
  const services = [
    {
      id: 1,
      title: 'Classic cleaning (2 bathrooms)',
      rating: '4.82',
      reviews: '1.5M',
      price: '785',
      originalPrice: '858',
      duration: '1 hr 30 mins',
      perBathroom: '393',
      image: bathroomCleaning,
      label: '2 BATHROOMS',
    },
    {
      id: 2,
      title: 'Intense cleaning (2 bathrooms)',
      rating: '4.79',
      reviews: '3.7M',
      price: '950',
      originalPrice: '1,038',
      duration: '2 hrs',
      perBathroom: '475',
      image: intenseCleaning,
      label: '2 BATHROOMS',
    },
    {
      id: 3,
      title: 'Intense cleaning (3 bathrooms)',
      rating: '4.79',
      reviews: '3.7M',
      price: '1,381',
      originalPrice: '1,557',
      duration: '3 hrs',
      perBathroom: '460',
      image: intenseBathroom3,
      label: '3 BATHROOMS',
      features: ['Floor & tile cleaning with a scrub machine'],
    },
    {
      id: 4,
      title: 'Classic cleaning (3 bathrooms)',
      rating: '4.82',
      reviews: '1.5M',
      price: '1,141',
      originalPrice: '1,287',
      duration: '2 hrs 15 mins',
      perBathroom: '380',
      image: bathroomCleaning,
      label: '3 BATHROOMS',
    },
  ];

  return (
    <div className="mb-6 border-t-4 border-gray-300 pt-6" id="combos">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold text-black">Combos</h2>
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
              <div className="flex items-center gap-2 mb-2 flex-wrap">
                <span className="text-lg font-bold text-black">₹{service.price}</span>
                {service.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">₹{service.originalPrice}</span>
                )}
                {service.duration && (
                  <>
                    <span className="text-sm text-gray-600">•</span>
                    <span className="text-sm text-gray-600">{service.duration}</span>
                  </>
                )}
              </div>
              {service.perBathroom && (
                <div className="flex items-center gap-1 mb-2">
                  <span className="text-sm text-green-600 font-medium">₹{service.perBathroom} per bathroom</span>
                  <span className="text-green-600">🍃</span>
                </div>
              )}
              {service.features && (
                <ul className="space-y-1 mb-3">
                  {service.features.map((feature, index) => (
                    <li key={index} className="text-sm text-gray-700">
                      {feature}
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
                  {service.label && (
                    <div className="absolute top-2 left-2 bg-black text-white text-[8px] font-bold px-2 py-1 rounded">
                      {service.label}
                    </div>
                  )}
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

export default CombosSection;

