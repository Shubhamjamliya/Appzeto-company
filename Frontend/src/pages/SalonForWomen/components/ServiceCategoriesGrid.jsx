import React from 'react';
import waxingImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/waxing.jpg';
import koreanFacialImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/koreanfacial.jpg';
import signatureFacialImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/signature facial.jpg';
import cleanupImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/cleanup.jpg';
import salon1Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-1.jpg';
import salon2Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-2.jpg';
import salon3Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-3.jpg';
import salon4Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-4.jpg';
import salon5Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-5.jpg';
import salon6Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-6.jpg';

const ServiceCategoriesGrid = ({ onCategoryClick }) => {
  const categories = [
    {
      id: 1,
      title: 'Super saver packages',
      image: salon1Image,
      badge: 'Upto 25% OFF',
    },
    {
      id: 2,
      title: 'Waxing & threading',
      image: waxingImage,
      badge: 'Offer',
    },
    {
      id: 3,
      title: 'Korean facial',
      image: koreanFacialImage,
    },
    {
      id: 4,
      title: 'Signature facials',
      image: signatureFacialImage,
    },
    {
      id: 5,
      title: 'Ayurvedic facial',
      image: salon3Image,
    },
    {
      id: 6,
      title: 'Cleanup',
      image: cleanupImage,
    },
    {
      id: 7,
      title: 'Pedicure & manicure',
      image: salon5Image,
    },
    {
      id: 8,
      title: 'Hair, bleach & detan',
      image: salon6Image,
    },
  ];

  return (
    <div className="px-4 mb-6">
      <div className="grid grid-cols-4 gap-3">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex flex-col items-center w-full"
          >
            <div
              onClick={() => onCategoryClick?.(category)}
              className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform w-full"
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
                    <span className="text-gray-400 text-xs">Image</span>
                  </div>
                )}
                {category.badge && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[8px] font-semibold px-1.5 py-0.5 rounded">
                    {category.badge}
                  </div>
                )}
              </div>
              <span className="text-[10px] text-center text-gray-700 font-medium leading-tight px-1">
                {category.title}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServiceCategoriesGrid;

