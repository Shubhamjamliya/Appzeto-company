import React from 'react';
import sofaCleaning from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/sofa-cleaning.jpg';
import carpet from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/carpet.jpg';
import diningTable from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/dining-table.jpg';
import mattress from '../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/mattress.jpg';

const ServiceCategoriesGrid = ({ onCategoryClick }) => {
  const categories = [
    {
      id: 1,
      title: 'Sofa cleaning',
      image: sofaCleaning,
    },
    {
      id: 2,
      title: 'Carpet',
      image: carpet,
    },
    {
      id: 3,
      title: 'Dining table',
      image: diningTable,
    },
    {
      id: 4,
      title: 'Mattress',
      image: mattress,
    },
  ];

  return (
    <div className="px-4 mb-6">
      <div className="flex gap-3 overflow-x-auto scrollbar-hide pb-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform flex-shrink-0"
            onClick={() => onCategoryClick?.(category)}
          >
            <div className="relative w-20 h-20 rounded-lg overflow-hidden mb-2" style={{ backgroundColor: '#f5f5f5' }}>
              {category.image ? (
                <img
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-gray-400 text-xs">{category.title}</span>
                </div>
              )}
            </div>
            <span className="text-[10px] text-center text-gray-700 font-medium leading-tight px-1 max-w-[80px]">
              {category.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategoriesGrid;

