import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import stressReliefImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForMen/stress-relief.jpg';

const StressReliefSection = ({ onAddClick, onViewDetails }) => {
  const services = [
    {
      id: 1,
      title: 'Quick Comfort Therapy',
      rating: '4.83',
      reviews: '11K',
      price: '999',
      originalPrice: '1,199',
      duration: '45 mins',
      features: [
        'Revitalising back & body massage with natural oils',
        'Eases tension & restores energy for a relaxed, rejuvenated feel',
      ],
      image: stressReliefImage,
      imageText: {
        title: 'Walk into relaxing bliss',
        subtitle: 'Medium pressure',
        duration: '45 mins • Full body',
      },
    },
    {
      id: 2,
      title: 'Stress Relief Massage',
      rating: '4.81',
      reviews: '8K',
      price: '1,299',
      originalPrice: '1,499',
      duration: '60 mins',
      features: [
        'Knead away all your stress',
        'Medium pressure massage for complete relaxation',
      ],
      image: stressReliefImage,
      imageText: {
        title: 'Knead away all your stress',
        subtitle: 'Medium pressure',
        duration: '60 mins • Full body',
      },
    },
  ];

  return (
    <div className="mb-6 border-t-4 border-gray-300 pt-6" id="stress-relief">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold text-black">Stress relief</h2>
      </div>

      <div className="px-4 space-y-6">
        {services.map((service) => (
          <div key={service.id}>
            {/* Service Card with Image */}
            {service.image && (
              <div className="relative bg-white rounded-xl overflow-hidden shadow-sm mb-4">
                <div className="relative h-64 bg-gradient-to-br from-blue-100 to-purple-100">
                  <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent flex items-center">
                    <div className="p-6 text-white">
                      <p className="text-2xl font-bold mb-2">{service.imageText?.title}</p>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="bg-gray-800/80 px-3 py-1 rounded-full text-xs">{service.imageText?.subtitle}</div>
                      </div>
                      <p className="text-sm">{service.imageText?.duration}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Service Details */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
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
                    className="bg-[#00a6a6] text-white text-sm font-semibold px-6 py-2 rounded-lg hover:bg-[#008a8a] active:scale-95 transition-all whitespace-nowrap"
                    style={{ backgroundColor: '#00a6a6' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#008a8a'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#00a6a6'}
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
                style={{ color: '#00a6a6' }}
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

export default StressReliefSection;

