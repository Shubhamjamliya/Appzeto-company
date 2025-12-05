import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import waxingImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/waxing.jpg';
import koreanFacialImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/koreanfacial.jpg';
import signatureFacialImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/signature facial.jpg';
import cleanupImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/cleanup.jpg';
import salon1Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-1.jpg';
import salon3Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-3.jpg';
import salon5Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-5.jpg';
import salon6Image from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-6.jpg';

const MenuModal = ({ isOpen, onClose, onCategoryClick }) => {
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      onClose();
      setIsClosing(false);
    }, 200); // Match animation duration
  };

  if (!isOpen && !isClosing) return null;

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

  const handleCategoryClick = (category) => {
    onCategoryClick?.(category);
    handleClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/85 z-50 transition-opacity ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal Container - Centered Card */}
      <div className="fixed inset-0 z-50 flex items-end justify-center px-4 pb-20 pointer-events-none">
        <div className="flex flex-col items-center w-full max-w-sm">
          {/* Modal Card - Square */}
          <div
            className={`bg-white rounded-3xl overflow-y-auto w-full shadow-2xl pointer-events-auto ${
              isClosing ? 'animate-slide-down' : 'animate-slide-up'
            }`}
            style={{ maxHeight: 'calc(100vh - 180px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Content */}
            <div className="px-3 py-4">
              {/* Categories Grid - 3 columns */}
              <div className="grid grid-cols-3 gap-2">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="relative w-full aspect-square max-w-[80px] mx-auto rounded-lg overflow-hidden mb-1" style={{ backgroundColor: '#f5f5f5' }}>
                      {category.image ? (
                        <img
                          src={category.image}
                          alt={category.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-gray-400 text-[8px]">Image</span>
                        </div>
                      )}
                      {category.badge && (
                        <div className="absolute top-0.5 left-0.5 bg-green-500 text-white text-[8px] font-semibold px-1.5 py-0.5 rounded">
                          {category.badge}
                        </div>
                      )}
                    </div>
                    {/* Text stacked vertically */}
                    <div className="flex flex-col items-center">
                      {category.title.split(' ').map((word, index) => (
                        <span key={index} className="text-[10px] text-center text-gray-700 font-medium leading-tight">
                          {word}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Close Button - Below Modal */}
          <div className="mt-4 z-[60] pointer-events-auto">
            <button
              onClick={handleClose}
              className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors border border-gray-200"
            >
              <FiX className="w-5 h-5 text-gray-800" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuModal;

