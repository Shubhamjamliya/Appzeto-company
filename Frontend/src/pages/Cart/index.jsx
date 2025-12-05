import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiTrash2 } from 'react-icons/fi';
import BottomNav from '../../components/layout/BottomNav';
import washingMachineIcon from '../../assets/images/icons/services/washing-machine-icon.png';
import cleaningIcon from '../../assets/images/icons/services/cleaning-icon.png';
import spaIcon from '../../assets/images/icons/services/womens-salon-spa-icon.png';

const Cart = () => {
  const navigate = useNavigate();
  
  // Load cart items from localStorage
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('cartItems');
    if (saved) {
      return JSON.parse(saved);
    }
    // Default sample items if localStorage is empty
    return [
      {
        id: 1,
        title: 'Washing Machine Repair',
        icon: washingMachineIcon,
        price: 160,
        serviceCount: 1,
        description: 'Semi-automatic machine check-up X 1',
      },
      {
        id: 2,
        title: 'Bathroom & Kitchen Cleaning',
        icon: cleaningIcon,
        price: 785,
        serviceCount: 1,
        description: 'Classic cleaning (2 bathrooms) X 1',
      },
      {
        id: 3,
        title: 'Spa for Women',
        icon: spaIcon,
        price: 999,
        serviceCount: 1,
        description: 'Quick Comfort Therapy X 1',
      },
    ];
  });

  const cartCount = cartItems.length;

  const handleBack = () => {
    navigate(-1);
  };

  const handleDelete = (itemId) => {
    const updatedItems = cartItems.filter(item => item.id !== itemId);
    setCartItems(updatedItems);
    // Update localStorage
    localStorage.setItem('cartItems', JSON.stringify(updatedItems));
  };

  const handleAddServices = (item) => {
    console.log('Add services clicked for:', item);
    // Navigate to service detail page or open modal
  };

  const handleCheckout = (item) => {
    console.log('Checkout clicked for:', item);
    navigate('/checkout');
  };

  const handleCartClick = () => {
    // Already on cart page
  };

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Header */}
      <header className="bg-white">
        <div className="px-4 pt-4 pb-3">
          <div className="flex items-center gap-3">
            <button
              onClick={handleBack}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FiArrowLeft className="w-6 h-6 text-black" />
            </button>
            <div className="flex items-center gap-2">
              <FiShoppingCart className="w-6 h-6 text-brand" style={{ color: '#00a6a6' }} />
              <h1 className="text-xl font-bold text-black">Your cart</h1>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-200"></div>
      </header>

      {/* Cart Items */}
      <main className="px-4 py-4">
        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <FiShoppingCart className="w-16 h-16 text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">Your cart is empty</p>
          </div>
        ) : (
          <div className="space-y-0">
            {cartItems.map((item, index) => (
              <div key={item.id}>
                <div className="py-4">
                  <div className="flex items-start gap-4">
                    {/* Service Icon */}
                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#f5f5f5' }}>
                      <img 
                        src={item.icon} 
                        alt={item.title} 
                        className="w-12 h-12 object-contain"
                      />
                    </div>

                    {/* Service Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-base font-bold text-black flex-1">{item.title}</h3>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0"
                        >
                          <FiTrash2 className="w-5 h-5 text-gray-600" />
                        </button>
                      </div>
                      <p className="text-sm text-black mb-2">
                        {item.serviceCount} service • ₹{item.price}
                      </p>
                      <p className="text-sm text-gray-600 mb-3">
                        • {item.description}
                      </p>

                      {/* Action Buttons */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleAddServices(item)}
                          className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-black hover:bg-gray-50 transition-colors"
                        >
                          Add Services
                        </button>
                        <button
                          onClick={() => handleCheckout(item)}
                          className="flex-1 px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
                          style={{ backgroundColor: '#00a6a6' }}
                          onMouseEnter={(e) => e.target.style.backgroundColor = '#008a8a'}
                          onMouseLeave={(e) => e.target.style.backgroundColor = '#00a6a6'}
                        >
                          Checkout
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {index < cartItems.length - 1 && (
                  <div className="border-t border-gray-200"></div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav
        cartCount={cartCount}
        onCartClick={handleCartClick}
      />
    </div>
  );
};

export default Cart;

