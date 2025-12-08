import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiMinus, FiPlus, FiPhone } from 'react-icons/fi';
import { MdStar } from 'react-icons/md';
import BottomNav from '../../components/layout/BottomNav';
import spaIcon from '../../assets/images/icons/services/womens-salon-spa-icon.png';

const Checkout = () => {
  const navigate = useNavigate();
  const [cartCount] = useState(3);
  const [quantity, setQuantity] = useState(1);
  const [selectedTip, setSelectedTip] = useState(75);
  const [customTip, setCustomTip] = useState('');
  const [isPlusAdded, setIsPlusAdded] = useState(false);

  // Sample cart item
  const cartItem = {
    id: 1,
    title: 'Quick Comfort Therapy',
    icon: spaIcon,
    originalPrice: 1199,
    currentPrice: 999,
    description: 'Spa for Women',
  };

  // Calculate prices
  const itemTotal = cartItem.currentPrice * quantity;
  const savings = (cartItem.originalPrice - cartItem.currentPrice) * quantity;
  const taxesAndFee = 59;
  const tipAmount = selectedTip === 'custom' ? parseFloat(customTip) || 0 : selectedTip;
  const plusPrice = isPlusAdded ? 249 : 0;
  const totalAmount = itemTotal + taxesAndFee + tipAmount + plusPrice;
  const amountToPay = totalAmount;

  const handleBack = () => {
    navigate(-1);
  };

  const handleQuantityChange = (change) => {
    setQuantity(Math.max(1, quantity + change));
  };

  const handleTipSelect = (amount) => {
    setSelectedTip(amount);
    setCustomTip('');
  };

  const handleCustomTip = (value) => {
    setCustomTip(value);
    setSelectedTip('custom');
  };

  const handleAddPlus = () => {
    setIsPlusAdded(!isPlusAdded);
  };

  const handleProceed = () => {
    // Navigate to address selection page
  };

  const handleCartClick = () => {
    navigate('/cart');
  };

  return (
    <div className="min-h-screen bg-white pb-32">
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
            <h1 className="text-xl font-bold text-black">Your cart</h1>
          </div>
        </div>
        <div className="border-b border-gray-200"></div>
      </header>

      <main className="px-4 py-4">
        {/* Savings Banner */}
        <div className="bg-gray-100 rounded-lg p-3 mb-4 flex items-center gap-2">
          <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xs font-bold">✓</span>
          </div>
          <p className="text-sm font-medium text-black">
            Saving ₹{savings} on this order
          </p>
        </div>

        {/* Cart Item */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-base font-bold text-black">{cartItem.title}</h3>
            <div className="flex items-center gap-2 border rounded-lg" style={{ borderColor: '#00a6a6' }}>
              <button
                onClick={() => handleQuantityChange(-1)}
                className="p-2 transition-colors"
                style={{ '--hover-bg': 'rgba(0, 166, 166, 0.1)' }}
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 166, 166, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <FiMinus className="w-4 h-4" style={{ color: '#00a6a6' }} />
              </button>
              <span className="px-3 py-1 text-sm font-medium text-black">{quantity}</span>
              <button
                onClick={() => handleQuantityChange(1)}
                className="p-2 transition-colors"
                onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(0, 166, 166, 0.1)'}
                onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
              >
                <FiPlus className="w-4 h-4" style={{ color: '#00a6a6' }} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-base font-bold text-black">₹{itemTotal}</span>
            <span className="text-sm text-gray-400 line-through">₹{cartItem.originalPrice * quantity}</span>
          </div>
        </div>

        {/* Plus Membership Plan */}
        <div className="rounded-lg p-4 mb-4" style={{ backgroundColor: 'rgba(0, 166, 166, 0.1)' }}>
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-start gap-3 flex-1">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: '#00a6a6' }}>
                <MdStar className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-black mb-1">plus</h3>
                <p className="text-sm text-gray-700 mb-1">6 months plan</p>
                <p className="text-xs text-gray-600 mb-2">
                  Get 10% off on all bookings, upto ₹100.
                </p>
                <button className="text-xs font-medium hover:underline" style={{ color: '#00a6a6' }}>
                  View all benefits
                </button>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <button
                onClick={handleAddPlus}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                style={isPlusAdded ? {
                  backgroundColor: '#00a6a6',
                  color: 'white'
                } : {
                  backgroundColor: 'white',
                  border: '1px solid #00a6a6',
                  color: '#00a6a6'
                }}
                onMouseEnter={(e) => {
                  if (!isPlusAdded) {
                    e.target.style.backgroundColor = 'rgba(0, 166, 166, 0.1)';
                  } else {
                    e.target.style.backgroundColor = '#008a8a';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isPlusAdded) {
                    e.target.style.backgroundColor = 'white';
                  } else {
                    e.target.style.backgroundColor = '#00a6a6';
                  }
                }}
              >
                {isPlusAdded ? 'Added' : 'Add'}
              </button>
              <div className="mt-1 flex flex-col items-end">
                <span className="text-sm font-bold text-black">₹249</span>
                <span className="text-xs text-gray-400 line-through">₹699</span>
              </div>
            </div>
          </div>
        </div>

        {/* Verified Customer */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FiPhone className="w-5 h-5 text-gray-600" />
              <div>
                <p className="text-sm font-medium text-black">Verified Customer</p>
                <p className="text-xs text-gray-600">+91-6261387233</p>
              </div>
            </div>
            <button className="text-sm font-medium hover:underline" style={{ color: '#00a6a6' }}>
              Change
            </button>
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h3 className="text-base font-bold text-black mb-4">Payment summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Item total</span>
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400 line-through">₹{cartItem.originalPrice * quantity}</span>
                <span className="text-sm font-medium text-black">₹{itemTotal}</span>
              </div>
            </div>
            {isPlusAdded && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Plus membership</span>
                <span className="text-sm font-medium text-black">₹249</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-700">Taxes and Fee</span>
              <span className="text-sm font-medium text-black">₹{taxesAndFee}</span>
            </div>
            {tipAmount > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-700">Tip</span>
                <span className="text-sm font-medium text-black">₹{tipAmount}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 mt-2">
              <div className="flex justify-between items-center mb-2">
                <span className="text-base font-bold text-black">Total amount</span>
                <span className="text-base font-bold text-black">₹{totalAmount}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-black">Amount to pay</span>
                <span className="text-base font-bold text-black">₹{amountToPay}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h3 className="text-base font-bold text-black mb-2">Cancellation policy</h3>
          <p className="text-sm text-gray-700 mb-2">
            Free cancellations if done more than 12 hrs before the service or if a professional isn't assigned. A fee will be charged otherwise.
          </p>
          <button className="text-sm font-medium hover:underline" style={{ color: '#00a6a6' }}>
            Read full policy
          </button>
        </div>

        {/* Add a Tip */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-4">
          <h3 className="text-base font-bold text-black mb-3">Add a tip to thank the Professional</h3>
          <div className="grid grid-cols-4 gap-2 mb-3">
            {[50, 75, 100, 'custom'].map((amount) => (
              <div key={amount} className="relative">
                {amount === 'custom' ? (
                  <input
                    type="number"
                    placeholder="Custom"
                    value={customTip}
                    onChange={(e) => handleCustomTip(e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg text-sm text-center"
                    style={selectedTip === 'custom' ? {
                      borderColor: '#00a6a6',
                      backgroundColor: 'rgba(0, 166, 166, 0.1)'
                    } : {
                      borderColor: '#d1d5db',
                      backgroundColor: 'white'
                    }}
                  />
                ) : (
                  <button
                    onClick={() => handleTipSelect(amount)}
                    className="w-full px-3 py-2 border rounded-lg text-sm font-medium transition-colors"
                    style={selectedTip === amount ? {
                      borderColor: '#00a6a6',
                      backgroundColor: 'rgba(0, 166, 166, 0.1)',
                      color: '#00a6a6'
                    } : {
                      borderColor: '#d1d5db',
                      backgroundColor: 'white',
                      color: 'black'
                    }}
                    onMouseEnter={(e) => {
                      if (selectedTip !== amount) {
                        e.target.style.backgroundColor = '#f9fafb';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedTip !== amount) {
                        e.target.style.backgroundColor = 'white';
                      }
                    }}
                  >
                    ₹{amount}
                    {amount === 75 && (
                      <span className="block text-[10px] text-green-600 font-semibold mt-1">POPULAR</span>
                    )}
                  </button>
                )}
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-600 text-center">
            100% of the tip goes to the professional.
          </p>
        </div>

        {/* Frequently Added Together */}
        <div className="mb-4">
          <h3 className="text-base font-bold text-black mb-3">Frequently added together</h3>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="min-w-[140px] h-32 bg-gray-200 rounded-lg flex-shrink-0"
              >
                {/* Placeholder for service images */}
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 text-xs">Service {item}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom Action Button */}
      <div className="fixed bottom-16 left-0 right-0 bg-white border-t border-gray-200 p-4 z-40">
        <button
          onClick={handleProceed}
          className="w-full text-white py-3 rounded-lg text-base font-semibold transition-colors"
          style={{ backgroundColor: '#00a6a6' }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#008a8a'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#00a6a6'}
        >
          Add address and slot
        </button>
      </div>

      <BottomNav
        cartCount={cartCount}
        onCartClick={handleCartClick}
      />
    </div>
  );
};

export default Checkout;

