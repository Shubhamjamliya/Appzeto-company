import React from 'react';
import { AiFillStar } from 'react-icons/ai';
import { MdLocalOffer } from 'react-icons/md';

const SuperSaverPackages = ({ onAddClick, onEditPackage }) => {
  const packages = [
    {
      id: 1,
      title: 'Make your own package',
      rating: '4.85',
      reviews: '7.3M',
      price: '2,920',
      originalPrice: '3,894',
      discount: '25%',
      duration: '3 hrs 50 mins',
      services: [
        'Waxing: Full arms (including underarms) - Chocolate Roll on, Fu...',
        'Facial & cleanup: Glass skin hydration facial',
        'Pedicure: Elysian Candle Spa pedicure',
        'Facial hair removal: Eyebrow, Upper lip - Threading',
      ],
    },
    {
      id: 2,
      title: 'Wax & glow',
      rating: '4.85',
      reviews: '6.1M',
      price: '2,316',
      originalPrice: '2,895',
      discount: '20%',
      duration: '2 hrs 30 mins',
      services: [
        'Waxing: Full arms (including underarms) - Chocolate Roll on, Fu...',
        'Facial & cleanup: Glass skin hydration facial',
        'Facial hair removal: Eyebrow, Upper lip - Threading',
      ],
    },
  ];

  return (
    <div className="mb-6 border-t-4 border-gray-300 pt-6" id="super-saver-packages">
      <div className="px-4 mb-4">
        <h2 className="text-xl font-bold text-black">Super saver packages</h2>
      </div>

      <div className="px-4 space-y-4">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
            <div className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <MdLocalOffer className="w-4 h-4 text-green-600" />
                    <span className="text-xs font-semibold text-green-600">PACKAGE</span>
                  </div>
                  <h3 className="text-lg font-bold text-black mb-1">{pkg.title}</h3>
                  <div className="flex items-center gap-1 mb-2">
                    <AiFillStar className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-700">{pkg.rating} ({pkg.reviews} reviews)</span>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-gray-400 line-through">₹{pkg.originalPrice}</span>
                    <span className="text-xl font-bold text-black">₹{pkg.price}</span>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{pkg.duration}</p>
                </div>
                <div className="ml-4 flex flex-col items-end shrink-0">
                  {/* Square with discount */}
                  <div className="w-20 h-20 rounded-lg flex flex-col items-center justify-center mb-2" style={{ backgroundColor: '#f5f5f5' }}>
                    <span className="text-lg font-bold" style={{ color: '#00a6a6' }}>{pkg.discount}</span>
                    <span className="text-xs font-medium" style={{ color: '#00a6a6' }}>OFF</span>
                  </div>
                  {/* Line between square and button */}
                  <div className="w-20 h-0.5 bg-gray-300 mb-2"></div>
                  {/* Add button */}
                  <button
                    onClick={() => onAddClick?.(pkg)}
                    className="w-20 bg-brand text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-brand-hover active:scale-95 transition-all"
                    style={{ backgroundColor: '#00a6a6' }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#008a8a'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#00a6a6'}
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <ul className="space-y-1 mb-3">
                  {pkg.services.map((service, index) => (
                    <li key={index} className="text-sm text-gray-700 flex items-start">
                      <span className="mr-2">•</span>
                      <span>{service}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => onEditPackage?.(pkg.id)}
                  className="w-full border border-gray-300 text-black text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Edit your package
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

