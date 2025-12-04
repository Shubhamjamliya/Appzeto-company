import React from 'react';
import { AiFillStar } from 'react-icons/ai';

const ServiceSection = ({ onViewDetails, onAddClick }) => {
  const services = [
    {
      id: 1,
      title: 'Foam-jet AC service',
      description: 'Dust-free filters & better airflow',
      rating: '4.77',
      reviews: '1.8M reviews',
      price: '649',
      priceText: 'Starts at ₹649',
      offer: 'Add more & save up to 15%',
      options: '6 options',
      features: [
        'Applicable for both window & split ACs',
        'Indoor unit deep cleaning with foam & jet spray',
      ],
    },
  ];

  return (
    <div className="mb-6 border-t border-gray-200">
      <div className="px-4 py-3">
        <h2 className="text-xs text-gray-600 uppercase tracking-wide">Service</h2>
      </div>
      <div className="border-t border-gray-200"></div>

      <div className="px-4 py-4 space-y-4">
        {services.map((service) => (
          <div key={service.id} className="bg-white">
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-1">
                <h3 className="text-lg font-bold text-black mb-1">{service.title}</h3>
                <p className="text-sm text-gray-700 mb-3">{service.description}</p>
              </div>
              <div className="w-24 h-32 bg-gray-200 rounded-lg flex items-center justify-center relative">
                <span className="text-xs text-gray-500">Service Image</span>
                <button
                  onClick={() => onAddClick?.(service)}
                  className="absolute bottom-2 right-2 bg-white border border-blue-600 text-blue-600 text-xs font-semibold px-3 py-1 rounded-lg hover:bg-blue-50 active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <AiFillStar className="w-4 h-4 text-yellow-400" />
              <span className="text-sm text-black font-medium">{service.rating}</span>
              <span className="text-sm text-gray-600">({service.reviews})</span>
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-base font-bold text-black">{service.priceText}</span>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-green-600 font-medium">{service.offer}</span>
              <div className="text-right">
                <span className="text-xs text-gray-600">{service.options}</span>
              </div>
            </div>

            <ul className="space-y-1 mb-3">
              {service.features.map((feature, index) => (
                <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
                  <span className="text-gray-400">•</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <button
              onClick={() => onViewDetails?.(service)}
              className="text-blue-600 text-sm font-medium hover:underline"
            >
              View details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceSection;

