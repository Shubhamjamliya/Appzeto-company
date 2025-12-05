import React from 'react';
import painReliefImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForMen/pain-relief.jpg';
import stressReliefImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForMen/stress-relief.jpg';
import postWorkoutImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForMen/post-workout.jpg';

const ServiceCategoriesGrid = ({ onCategoryClick }) => {
  const categories = [
    {
      id: 1,
      title: 'Pain relief',
      image: painReliefImage,
    },
    {
      id: 2,
      title: 'Stress relief',
      image: stressReliefImage,
    },
    {
      id: 3,
      title: 'Post workout',
      image: postWorkoutImage,
    },
    {
      id: 4,
      title: 'Add-ons',
      image: null,
    },
  ];

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
            onClick={() => onCategoryClick?.(category)}
          >
            <div className="relative w-full aspect-square max-w-[80px] mx-auto rounded-lg overflow-hidden mb-2" style={{ backgroundColor: '#f5f5f5' }}>
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

