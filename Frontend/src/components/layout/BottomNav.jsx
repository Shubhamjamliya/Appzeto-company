import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiHome, FiGift, FiShoppingCart, FiUser } from 'react-icons/fi';

const BottomNav = ({ cartCount, onCartClick }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { id: 'home', label: 'Appzeto', icon: FiHome, path: '/' },
    { id: 'rewards', label: 'Rewards', icon: FiGift, path: '/rewards' },
    { id: 'cart', label: 'Cart', icon: FiShoppingCart, path: '/cart', isCart: true },
    { id: 'account', label: 'Account', icon: FiUser, path: '/account' },
  ];

  const getActiveTab = () => {
    if (location.pathname === '/') return 'home';
    if (location.pathname === '/rewards') return 'rewards';
    if (location.pathname === '/cart') return 'cart';
    if (location.pathname === '/account') return 'account';
    return 'home';
  };

  const activeTab = getActiveTab();

  const handleTabClick = (path) => {
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => {
                handleTabClick(item.path);
              }}
              className={`flex flex-col items-center justify-center gap-1 py-2 px-4 transition-colors relative ${
                activeTab === item.id
                  ? ''
                  : 'text-gray-500'
              }`}
              style={activeTab === item.id ? { color: '#00a6a6' } : {}}
            >
              {item.isCart ? (
                <div className="relative">
                  <IconComponent 
                    className="w-6 h-6"
                    style={activeTab === item.id ? { color: '#00a6a6' } : { color: '#6b7280' }}
                  />
                  {cartCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1 z-10">
                      {cartCount > 9 ? '9+' : cartCount}
                    </span>
                  )}
                </div>
              ) : (
                <IconComponent 
                  className="w-6 h-6"
                  style={activeTab === item.id ? { color: '#00a6a6' } : { color: '#6b7280' }}
                />
              )}
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;

