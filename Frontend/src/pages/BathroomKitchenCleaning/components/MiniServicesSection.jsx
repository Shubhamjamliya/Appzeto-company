import React from 'react';
import { themeColors } from '../../../theme';
import { AiFillStar } from 'react-icons/ai';
import fanCleaning from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/fan-cleaning.jpg';
import balconyClean from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/balcony-clean.jpg';
import glassClean from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/glass-clean.jpg';
import miniServices from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/mini servies.jpg';
import carpet from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/carpet.jpg';
import diningTable from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/dining-table.jpg';

const MiniServicesSection = ({ onAddClick, onViewDetails }) => {
  const services = [
    {
      id: 1,
      title: 'Ceiling fan cleaning',
      rating: '4.82',
      reviews: '279K',
      price: '69',
      duration: '15 mins',
      image: fanCleaning,
    },
    {
      id: 2,
      title: 'Exhaust fan cleaning',
      rating: '4.79',
      reviews: '97K',
      price: '89',
      duration: '15 mins',
      image: fanCleaning,
    },
    {
      id: 3,
      title: 'Balcony cleaning',
      rating: '4.79',
      reviews: '30K',
      price: '489',
      options: '2 options',
      image: balconyClean,
    },
    {
      id: 4,
      title: 'Mirror cleaning (upto 1)',
      rating: '4.81',
      reviews: '21K',
      price: '59',
      duration: '10 mins',
      image: glassClean,
    },
    {
      id: 5,
      title: 'Glass partition cleaning',
      rating: '4.74',
      reviews: '16K',
      price: '69',
      duration: '10 mins',
      image: glassClean,
    },
    {
      id: 6,
      title: 'Door cleaning (upto 1)',
      rating: '4.78',
      reviews: '19K',
      price: '89',
      duration: '10 mins',
      image: miniServices,
    },
  ];

  return (
    <div className="mb-6 border-t-4 border-gray-300 pt-6" id="mini-services">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold text-black">Mini services</h2>
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
                {service.price && (
                  <>
                    <span className="text-sm text-gray-700">Starts at ₹{service.price}</span>
                    {service.duration && (
                      <>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm text-gray-600">{service.duration}</span>
                      </>
                    )}
                  </>
                )}
              </div>
              {service.options && (
                <p className="text-sm text-gray-600 mb-2">{service.options}</p>
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

export default MiniServicesSection;

