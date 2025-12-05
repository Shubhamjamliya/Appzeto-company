import React, { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';
import bathroomCleanIcon from '../../../assets/images/icons/services/bathroom-clean.png';
import sofaIcon from '../../../assets/images/icons/services/sofa.png';

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
      title: 'Combos',
      icon: null,
      badge: 'COMBO DEALS',
    },
    {
      id: 2,
      title: 'Bathroom cleaning',
      icon: bathroomCleanIcon,
    },
    {
      id: 3,
      title: 'Mini services',
      icon: sofaIcon,
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
              {/* Categories Grid - 3 columns */}
              <div className="grid grid-cols-3 gap-3">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className={`relative w-full aspect-square max-w-[100px] mx-auto rounded-lg overflow-hidden mb-2 ${category.badge ? 'bg-green-500' : ''}`} style={{ backgroundColor: category.badge ? '#10b981' : '#f5f5f5' }}>
                      {category.icon ? (
                        <img
                          src={category.icon}
                          alt={category.title}
                          className="w-full h-full object-cover"
                        />
                      ) : category.badge ? (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-white text-[8px] font-bold">{category.badge}</span>
                        </div>
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

