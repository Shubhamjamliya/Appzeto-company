import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { themeColors } from '../../../../../theme';
import salon3Image from '../../../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-3.jpg';
import salon4Image from '../../../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-4.jpg';

const KoreanFacialSection = ({ onAddClick, onViewDetails }) => {
  const       services = [
    {
      id: 1,
      title: 'Korean Glass hydration facial',
      rating: '4.84',
      reviews: '32K',
      price: '1,699',
      duration: '1 hr 20 mins',
      badge: 'BESTSELLER',
      features: [
        'Papaya & red algae boost collagen & deeply hydrate the skin',
        '25 mins of shoulder, half leg & back massage included',
      ],
      options: '1 option',
      image: salon3Image,
      imageText: {
        title: ['Boost', "your skin's", 'moisture'],
        subtitle: 'Papaya Extracts exfoliate & renew skin surface',
      },
    },
    {
      id: 2,
      title: 'Korean Radiance facial',
      rating: '4.82',
      reviews: '28K',
      price: '1,499',
      duration: '1 hr 15 mins',
      features: [
        'Advanced Korean skincare technology',
        'Deep cleansing and hydration',
      ],
      options: '1 option',
      image: salon4Image,
      imageText: {
        title: ['Restore', "your skin's", 'luminosity'],
        subtitle: 'Advanced Korean techniques',
      },
    },
  ];

  return (
    <div className="mb-6 border-t-4 border-gray-300 pt-6" id="korean-facial">
      <div className="px-4 mb-4">
        <p className="text-sm text-gray-600 mb-1">Korean facial</p>
        <h2 className="text-xl font-bold text-black">Korean facial</h2>
      </div>

      <div className="px-4 space-y-6">
        {services.map((service) => (
          <div key={service.id}>
            {/* Service Card with Image */}
            <div className="relative bg-white rounded-xl overflow-hidden shadow-sm mb-4">
              <div className="relative h-64">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Service Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
                  <div className="p-6 text-white">
                    {service.imageText.title.map((line, index) => (
                      <p key={index} className="text-2xl font-bold mb-1">{line}</p>
                    ))}
                    <p className="text-sm mt-2 opacity-90">{service.imageText.subtitle}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
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
                    <span className="text-sm font-medium text-black">Starts at ₹{service.price}</span>
                    {service.duration && (
                      <>
                        <span className="text-sm text-gray-600">•</span>
                        <span className="text-sm font-medium text-black">{service.duration}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="ml-4 flex flex-col items-end flex-shrink-0">
                  <p className="text-xs text-gray-600 mb-2">{service.options}</p>
                  <button
                    onClick={() => onAddClick?.(service)}
                    className="bg-brand text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-brand-hover active:scale-95 transition-all whitespace-nowrap"
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
                style={{ color: 'var(--color-brand)' }}
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

export default KoreanFacialSection;

