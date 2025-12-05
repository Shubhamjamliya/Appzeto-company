import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import sofaCleaning from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/sofa-cleaning.jpg';

const SofaCleaningSection = ({ onAddClick, onViewDetails }) => {
  const services = [
    {
      id: 1,
      title: 'Sofa cleaning',
      rating: '4.85',
      reviews: '400K',
      price: '499',
      duration: '40 mins',
      features: [
        'Dry vacuuming to remove crumbs & dirt particles',
        'Wet shampooing on fabric sofa to remove stains & spillages',
      ],
      image: sofaCleaning,
    },
  ];

  return (
    <div className="mb-6 border-t-4 border-gray-300 pt-6" id="sofa-cleaning">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold text-black">Sofa cleaning</h2>
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
                  <button
                    onClick={() => onAddClick?.(service)}
                    className="absolute bottom-2 right-2 bg-white text-brand px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-gray-50 active:scale-95 transition-all"
                    style={{ color: '#00a6a6' }}
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

export default SofaCleaningSection;

