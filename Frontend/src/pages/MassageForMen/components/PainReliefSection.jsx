import React from 'react';
import { themeColors } from '../../../theme';
import { AiFillStar } from 'react-icons/ai';
import { FiAward } from 'react-icons/fi';
import painReliefBanner from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForMen/pain-relief.jpg';
import backPainImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForMen/back-pain.webp';
import legPainImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForMen/leg-pain.webp';

const PainReliefSection = ({ onAddClick, onViewDetails }) => {
  const services = [
    {
      id: 1,
      title: 'Deep tissue pain relief massage',
      rating: '4.85',
      reviews: '118K',
      price: '1,399',
      duration: '60 mins',
      badge: 'BESTSELLER',
      features: [
        'High-pressure palm movements to relieve muscle tension & soreness',
        'Save more: Add pack of 4 to unlock ₹1099/ massage',
      ],
      image: painReliefBanner,
    },
    {
      id: 2,
      title: 'Deep tissue with head/ neck/shoulder',
      rating: '4.83',
      reviews: '2K',
      price: '1,948',
      originalPrice: '2,048',
      duration: '1 hr 40 mins',
      badge: 'VALUE-SAVER',
      features: [
        '60 mins deep tissue massage & 40 mins head/neck/shoulder massage',
        'Save more: Add pack of 4 to unlock ₹1698/ massage',
      ],
      image: backPainImage,
    },
    {
      id: 3,
      title: 'Deep tissue with massage',
      rating: '4.82',
      reviews: '5K',
      price: '1,699',
      originalPrice: '1,899',
      duration: '1 hr 30 mins',
      badge: 'VALUE-SAVER',
      features: [
        'Comprehensive deep tissue massage for full body relief',
        'Save more: Add pack of 4 to unlock ₹1499/ massage',
      ],
      image: legPainImage,
    },
  ];

  return (
    <div className="mb-6 border-t-4 border-gray-300 pt-6" id="pain-relief">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold text-black">Pain relief</h2>
      </div>

      <div className="px-4 space-y-6">
        {services.map((service) => (
          <div key={service.id}>
            {/* Service Card with Image (if available) */}
            {service.image && (
              <div className="relative bg-white rounded-xl overflow-hidden shadow-sm mb-4">
                <div className="relative h-48">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
                    <div className="p-6 text-white">
                      <p className="text-2xl font-bold mb-2">Muscle pain? Knot anymore.</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-gray-800/80 px-3 py-1 rounded-full text-xs">High pressure</div>
                      </div>
                      <p className="text-sm">60 / 90 mins • Full body</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Service Details */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  {service.badge && (
                    <div className="flex items-center gap-1 mb-2">
                      <FiAward className="w-3 h-3 text-green-600" />
                      <span className="text-xs font-medium text-green-600">
                        {service.badge}
                      </span>
                    </div>
                  )}
                  <h3 className="text-lg font-bold text-black mb-2">{service.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <AiFillStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-700">{service.rating} ({service.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-medium text-black">Starts at ₹{service.price}</span>
                    {service.duration && (
                      <>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm font-medium text-black">{service.duration}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end shrink-0">
                  <button
                    onClick={() => onAddClick?.(service)}
                    className="text-white text-sm font-semibold px-6 py-2 rounded-lg active:scale-95 transition-all whitespace-nowrap"
                    style={{ backgroundColor: themeColors.button }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = themeColors.button}
                    onMouseLeave={(e) => e.target.style.backgroundColor = themeColors.button}
                  >
                    Add
                  </button>
                </div>
              </div>
              
              <div className="h-px bg-gray-400 mb-2 mt-2"></div>
              <ul className="space-y-1 mb-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="text-sm text-gray-700 flex items-start">
                    <span className="mr-2">•</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => onViewDetails?.(service)}
                className="text-brand text-sm font-medium hover:underline"
                style={{ color: themeColors.button }}
              >
                View details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PainReliefSection;

