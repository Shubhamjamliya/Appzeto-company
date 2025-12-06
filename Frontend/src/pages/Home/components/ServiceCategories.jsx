import React from 'react';
import CategoryCard from '../../../components/common/CategoryCard';
import womensSalonIcon from '../../../assets/images/icons/services/womens-salon-spa-icon.png';
import massageMenIcon from '../../../assets/images/icons/services/massage-men-icon.png';
import cleaningIcon from '../../../assets/images/icons/services/cleaning-icon.png';
import electricianPlumberIcon from '../../../assets/images/icons/services/electrician-plumber-carpenter-icon.png';
import acApplianceRepairIcon from '../../../assets/images/icons/services/ac-appliance-repair-icon.png';
import nativeWaterPurifierIcon from '../../../assets/images/icons/services/water-purifier-icon.png';

const ServiceCategories = ({ categories, onCategoryClick, onSeeAllClick }) => {
  // Urban Company service categories
  const defaultCategories = [
    { id: 1, title: "Women's Salon & Spa", icon: womensSalonIcon },
    { id: 2, title: 'Massage for Men', icon: massageMenIcon },
    { id: 3, title: 'Cleaning', icon: cleaningIcon },
    { id: 4, title: 'Electrician, Plumber & Carpenter', icon: electricianPlumberIcon },
    { id: 5, title: 'AC & Appliance Repair', icon: acApplianceRepairIcon },
    { id: 6, title: 'Native Water Purifier', icon: nativeWaterPurifierIcon, hasSaleBadge: true },
  ];

  const serviceCategories = categories || defaultCategories;

  return (
    <div className="px-4 pt-4 pb-2">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800 drop-shadow-sm">Categories</h2>
          <button
            onClick={onSeeAllClick}
            className="font-semibold text-sm transition-all hover:scale-105 active:scale-95 text-gray-800 drop-shadow-sm"
            style={{ color: '#F59E0B' }}
          >
            See All
          </button>
        </div>
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2">
          {serviceCategories.map((category, index) => {
            return (
              <div key={category.id} className="flex-shrink-0">
                <CategoryCard
                  title={category.title}
                  icon={<img src={category.icon} alt={category.title} className="w-8 h-8 object-contain" />}
                  onClick={() => onCategoryClick?.(category)}
                  hasSaleBadge={category.hasSaleBadge}
                  index={index}
                />
              </div>
            );
          })}
        </div>
    </div>
  );
};

export default ServiceCategories;

