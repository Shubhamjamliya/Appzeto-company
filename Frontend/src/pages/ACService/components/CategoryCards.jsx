import React from 'react';
import { MdPercent, MdAcUnit, MdBuild, MdHome } from 'react-icons/md';

const CategoryCards = ({ onCategoryClick }) => {
  const categories = [
    {
      id: 1,
      title: 'Super saver packages',
      icon: <MdPercent className="w-8 h-8 text-green-500" />,
      bgColor: 'bg-green-50',
    },
    {
      id: 2,
      title: 'Service',
      icon: <MdAcUnit className="w-8 h-8 text-gray-700" />,
      bgColor: 'bg-gray-100',
    },
    {
      id: 3,
      title: 'Repair & gas refill',
      icon: <MdBuild className="w-8 h-8 text-gray-700" />,
      bgColor: 'bg-gray-100',
    },
    {
      id: 4,
      title: 'Installation/ uninstallation',
      icon: <MdHome className="w-8 h-8 text-gray-700" />,
      bgColor: 'bg-gray-100',
    },
  ];

  return (
    <div className="px-4 py-4">
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        {categories.map((category) => (
          <div
            key={category.id}
            onClick={() => onCategoryClick?.(category)}
            className="min-w-[100px] flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
          >
            <div className={`w-20 h-20 ${category.bgColor} rounded-xl flex items-center justify-center mb-2`}>
              {category.icon}
            </div>
            <p className="text-xs text-black text-center font-medium leading-tight">
              {category.title}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryCards;

