import React from 'react';
import intenseCleaning from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/intense-cleaning.jpg';
import bathroomCleaning from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/bathroom-cleaning.png';
import miniServices from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/mini servies.jpg';

const ServiceCategoriesGrid = ({ onCategoryClick }) => {
  const categories = [
    {
      id: 1,
      title: 'Combos',
      image: intenseCleaning,
      badge: 'COMBO DEALS',
    },
    {
      id: 2,
      title: 'Bathroom cleaning',
      image: bathroomCleaning,
    },
    {
      id: 3,
      title: 'Mini services',
      image: miniServices,
    },
  ];

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-3 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            onClick={() => onCategoryClick?.(category)}
          >
            <div className="relative w-full aspect-square max-w-[80px] mx-auto rounded-lg overflow-hidden mb-2" style={{ backgroundColor: '#f5f5f5' }}>
              {category.image ? (
                <>
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                  {category.badge && (
                    <div className="absolute top-0 left-0 right-0 bg-green-500 text-white text-[8px] font-bold px-1 py-0.5 text-center">
                      {category.badge}
                    </div>
                  )}
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-xs">{category.title}</span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-center text-gray-700 font-medium leading-tight px-1">
              {category.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategoriesGrid;

