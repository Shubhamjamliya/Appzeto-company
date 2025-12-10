import React from 'react';
import { AiFillStar } from 'react-icons/ai';

const SuperSaverPackages = ({ onViewDetails, onAddClick }) => {
  const packages = [
    {
      id: 1,
      title: 'Foam-jet service (2 ACs)',
      packLabel: '2 ACs PACK',
      rating: '4.77',
      reviews: '1.8M reviews',
      price: '1,098',
      originalPrice: '1,298',
      duration: '1 hr 30 mins',
      perAC: '₹549 per AC',
      description: 'Dust-free filters & better airflow',
      features: [
        'Applicable for both window or split ACs',
        'Indoor unit deep cleaning with foam & jet spray',
      ],
    },
    {
      id: 2,
      title: 'Foam-jet service (3 ACs)',
      packLabel: '3 ACs PACK',
      rating: '4.77',
      reviews: '1.8M reviews',
      price: '1,647',
      originalPrice: '1,947',
      duration: '2 hrs',
      perAC: '₹549 per AC',
      description: 'Dust-free filters & better airflow',
    },
    {
      id: 3,
      title: 'Foam-jet service (5 ACs)',
      packLabel: '5 ACs PACK',
      rating: '4.77',
      reviews: '1.8M reviews',
      price: '2,745',
      originalPrice: '3,245',
      duration: '3 hrs 45 mins',
      perAC: '₹549 per AC',
      description: 'Dust-free filters & better airflow',
    },
  ];

  return (
    <div className="mb-6" id="super-saver-packages">
      <div className="px-4 mb-4">
        <h2 className="text-lg font-bold text-black">Super saver packages</h2>
      </div>

      <div className="px-4 space-y-4">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            {/* Package Card with Image */}
            <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="bg-gray-800 text-white text-xs font-bold px-2 py-1 rounded mb-3 w-fit">
                    {pkg.packLabel}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-1">Foam-jet</h3>
                  <h3 className="text-xl font-bold text-black mb-2">AC service</h3>
                  <p className="text-sm text-gray-700">{pkg.description}</p>
                </div>
                <div className="w-24 h-32 bg-gray-200 rounded-lg flex items-center justify-center relative">
                  <span className="text-xs text-gray-500">AC Image</span>
                </div>
              </div>
            </div>

            {/* Package Details */}
            <div className="p-4">
              <h4 className="text-base font-bold text-black mb-2">{pkg.title}</h4>
              
              <div className="flex items-center gap-2 mb-2">
                <AiFillStar className="w-4 h-4 text-yellow-400" />
                <span className="text-sm text-black font-medium">{pkg.rating}</span>
                <span className="text-sm text-gray-600">({pkg.reviews})</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold text-black">₹{pkg.price}</span>
                <span className="text-sm text-gray-400 line-through">₹{pkg.originalPrice}</span>
                <span className="text-sm text-gray-600">• {pkg.duration}</span>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs text-green-600 font-medium">♦ {pkg.perAC}</span>
              </div>

              {pkg.features && (
                <ul className="space-y-1 mb-3">
                  {pkg.features.map((feature, index) => (
                    <li key={index} className="text-xs text-gray-700 flex items-start gap-2">
                      <span className="text-gray-400">•</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => onViewDetails?.(pkg)}
                  className="text-sm font-medium hover:underline"
                  style={{ color: '#00a6a6' }}
                >
                  View details
                </button>
                <button
                  onClick={() => onAddClick?.(pkg)}
                  className="bg-white border border-blue-600 text-blue-600 text-sm font-semibold px-6 py-2 rounded-lg hover:bg-blue-50 active:scale-95 transition-all"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SuperSaverPackages;

