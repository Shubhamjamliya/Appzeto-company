import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { MdLocalOffer } from 'react-icons/md';
import salon1Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-1.jpg';
import salon2Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-2.jpg';

const WaxingThreadingSection = ({ onAddClick, onViewDetails }) => {
  const       services = [
    {
      id: 1,
      title: 'Roll-on waxing',
      subtitle: 'Roll-on waxing starting at',
      price: '799',
      originalPrice: '1,098',
      rating: '4.87',
      reviews: '47K',
      description: 'Full arms, legs & underarms',
      features: [
        'Hygienic & single-use with no risk of burns',
        'Two wax types for you to pick from: RICA or white chocolate',
      ],
      options: '2 options',
      badge: 'Price Drop',
      image: salon1Image,
    },
    {
      id: 2,
      title: 'Spatula waxing',
      subtitle: 'Spatula waxing starting at',
      price: '599',
      originalPrice: '638',
      rating: '4.86',
      reviews: '31K',
      description: 'Full arms, legs & underarms',
      features: [
        'Traditional method with expert care',
        'Suitable for all skin types',
      ],
      options: '2 options',
      badge: 'Price Drop',
      image: salon2Image,
    },
  ];

  return (
    <div className="mb-6 border-t-4 border-gray-300 pt-6">
      <div className="px-4 mb-4">
        <p className="text-sm text-gray-600 mb-1">Waxing & threading</p>
        <h2 className="text-xl font-bold text-black">Waxing & threading</h2>
      </div>

      <div className="px-4 space-y-6">
        {services.map((service) => (
          <div key={service.id}>
            {/* Service Card with Image */}
            <div className="relative bg-white rounded-xl overflow-hidden shadow-sm mb-4">
              <div className="relative h-48">
                {service.image ? (
                  <img
                    src={service.image}
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Service Image</span>
                  </div>
                )}
                {service.badge && (
                  <div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                    {service.badge}
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <p className="text-white text-sm mb-1">{service.subtitle}</p>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl font-bold text-green-400">₹{service.price}</span>
                    <span className="text-sm text-gray-300 line-through">₹{service.originalPrice}</span>
                  </div>
                  <p className="text-white text-sm">{service.description}</p>
                </div>
              </div>
            </div>

            {/* Service Details */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-black mb-2">{service.title} ({service.description})</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <AiFillStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-700">{service.rating} ({service.reviews} reviews)</span>
                  </div>
                  <p className="text-base font-semibold text-black mb-3">Starts at ₹{service.price}</p>
                  <ul className="space-y-1 mb-3">
                    {service.features.map((feature, index) => (
                      <li key={index} className="text-sm text-gray-700 flex items-start">
                        <span className="mr-2">•</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="ml-4 flex flex-col items-end flex-shrink-0">
                  <p className="text-xs text-gray-600 mb-2">{service.options}</p>
                  <button
                    onClick={() => onAddClick?.(service)}
                    className="bg-brand text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-brand-hover active:scale-95 transition-all whitespace-nowrap"
                    style={{ backgroundColor: '#00a6a6' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#008a8a'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#00a6a6'}
                  >
                    Add
                  </button>
                </div>
              </div>
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

export default WaxingThreadingSection;

