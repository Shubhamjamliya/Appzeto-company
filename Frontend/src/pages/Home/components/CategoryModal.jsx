import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiX } from 'react-icons/fi';

const CategoryModal = ({ isOpen, onClose, category, location, cartCount }) => {
  const navigate = useNavigate();
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
    }, 300); // Match animation duration
  };

  if (!isOpen && !isClosing) return null;

  // Default sub-services for each category
  const getSubServices = () => {
    switch (category?.title) {
      case "Women's Salon & Spa":
        return [
          { id: 1, title: 'Haircut & Styling' },
          { id: 2, title: 'Hair Color' },
          { id: 3, title: 'Facial & Cleanup' },
          { id: 4, title: 'Threading' },
          { id: 5, title: 'Waxing' },
          { id: 6, title: 'Manicure & Pedicure' },
        ];
      case 'Massage for Men':
        return [
          { id: 1, title: 'Swedish Massage' },
          { id: 2, title: 'Deep Tissue Massage' },
          { id: 3, title: 'Sports Massage' },
          { id: 4, title: 'Head & Shoulder Massage' },
        ];
      case 'Cleaning':
        return [
          { id: 1, title: 'Home Deep Cleaning' },
          { id: 2, title: 'Bathroom Cleaning' },
          { id: 3, title: 'Kitchen Cleaning' },
          { id: 4, title: 'Sofa & Carpet Cleaning' },
          { id: 5, title: 'Window Cleaning' },
        ];
      case 'Electrician, Plumber & Carpenter':
        return [
          { id: 1, title: 'Electrical Repair' },
          { id: 2, title: 'Plumbing Services' },
          { id: 3, title: 'Carpentry Work' },
          { id: 4, title: 'Installation Services' },
        ];
      case 'Native Water Purifier':
        return [
          { id: 1, title: 'Water Purifier Installation' },
          { id: 2, title: 'Water Purifier Service' },
          { id: 3, title: 'Filter Replacement' },
        ];
      default:
        return [];
    }
  };

  const subServices = getSubServices();

  const handleServiceClick = (service) => {
    console.log('Sub-service clicked:', service);
    handleClose();
    // Navigate to service page or open booking
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      {/* Modal Container with Close Button */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Close Button - Above Modal */}
        <div className="absolute -top-12 right-4 z-[60]">
          <button
            onClick={handleClose}
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-50 transition-colors"
          >
            <FiX className="w-6 h-6 text-gray-800" />
          </button>
        </div>

        {/* Modal */}
        <div
          className={`bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto ${
            isClosing ? 'animate-slide-down' : 'animate-slide-up'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Content */}
          <div className="px-4 py-6">
            {/* Title */}
            <h1 className="text-xl font-semibold text-black mb-6">{category?.title || 'Service Category'}</h1>

            {/* Sub-services Grid */}
            <div className="grid grid-cols-3 gap-4">
              {subServices.map((service) => (
                <div
                  key={service.id}
                  onClick={() => handleServiceClick(service)}
                  className="flex flex-col items-center cursor-pointer active:scale-95 transition-transform p-4 bg-gray-50 rounded-xl"
                >
                  <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mb-2">
                    <svg
                      className="w-8 h-8 text-gray-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="text-xs text-black text-center font-normal">{service.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryModal;

