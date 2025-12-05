import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import painReliefImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForMen/pain-relief.jpg';
import stressReliefImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForMen/stress-relief.jpg';
import postWorkoutImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForMen/post-workout.jpg';
import backPainImage from '../../../assets/images/pages/Home/ServiceCategorySection/SalonForMen/back-pain.webp';

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
    }, 200);
  };

  if (!isOpen && !isClosing) return null;

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
      image: backPainImage, // Using back-pain as placeholder for Add-ons
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
          {/* Modal Card */}
          <div
            className={`bg-white rounded-3xl overflow-y-auto w-full shadow-2xl pointer-events-auto ${
              isClosing ? 'animate-slide-down' : 'animate-slide-up'
            }`}
            style={{ maxHeight: 'calc(100vh - 180px)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Content */}
            <div className="px-4 py-6">
              {/* Categories Grid - 2 rows, 3 columns (top row), 1 column (bottom row) */}
              <div className="space-y-4">
                {/* Top row - 3 items */}
                <div className="grid grid-cols-3 gap-3">
                  {categories.slice(0, 3).map((category) => (
                    <div
                      key={category.id}
                      className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <div className="relative w-full aspect-square max-w-[100px] mx-auto rounded-lg overflow-hidden mb-2" style={{ backgroundColor: '#f5f5f5' }}>
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
                      <span className="text-xs text-center text-gray-700 font-medium leading-tight">
                        {category.title}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Bottom row - 1 item (Add-ons) */}
                <div className="flex justify-center">
                  {categories.slice(3, 4).map((category) => (
                    <div
                      key={category.id}
                      className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                      onClick={() => handleCategoryClick(category)}
                    >
                      <div className="relative w-full aspect-square max-w-[100px] mx-auto rounded-lg overflow-hidden mb-2" style={{ backgroundColor: '#f5f5f5' }}>
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
                      <span className="text-xs text-center text-gray-700 font-medium leading-tight">
                        {category.title}
                      </span>
                    </div>
                  ))}
                </div>
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

