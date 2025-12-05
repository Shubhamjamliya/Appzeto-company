import React from 'react';
import electricianIcon from '../../../assets/images/icons/services/electrician.png';
import homeWiring from '../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/home-wiring.jpg';
import electricalPanel from '../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/electrical-panel-upgrade.jpg';
import smartHomeSetup from '../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/smart home setup.jpg';

const ServiceCategoriesGrid = ({ onCategoryClick }) => {
  const categories = [
    {
      id: 1,
      title: 'Electrical Repair',
      image: electricianIcon,
    },
    {
      id: 2,
      title: 'Installation',
      image: homeWiring,
    },
    {
      id: 3,
      title: 'Smart Home',
      image: smartHomeSetup,
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

