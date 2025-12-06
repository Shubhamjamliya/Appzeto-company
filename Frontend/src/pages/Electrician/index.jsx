import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ElectricianHeader from './components/ElectricianHeader';
import StickySubHeading from './components/StickySubHeading';
import BannerSection from './components/BannerSection';
import RatingSection from './components/RatingSection';
import PaymentOffers from './components/PaymentOffers';
import ServiceCategoriesGrid from './components/ServiceCategoriesGrid';
import ElectricalRepairSection from './components/ElectricalRepairSection';
import InstallationSection from './components/InstallationSection';
import SmartHomeSection from './components/SmartHomeSection';
import MenuModal from './components/MenuModal';

const Electrician = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Refs for sections
  const electricalRepairRef = useRef(null);
  const installationRef = useRef(null);
  const smartHomeRef = useRef(null);

  // Load cart count and items from localStorage on mount
  useEffect(() => {
    const updateCart = () => {
      const items = JSON.parse(localStorage.getItem('cartItems') || '[]');
      setCartItems(items);
      setCartCount(items.length);
    };
    
    updateCart();
    
    // Listen for cart updates
    window.addEventListener('cartUpdated', updateCart);
    
    return () => {
      window.removeEventListener('cartUpdated', updateCart);
    };
  }, []);

  // Handle scroll to show/hide sticky header and detect current section
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPosition = window.scrollY;
          const shouldShowHeader = scrollPosition > 200;
          setShowStickyHeader(shouldShowHeader);

          if (!shouldShowHeader) {
            setCurrentSection('');
            ticking = false;
            return;
          }

          const sections = [
            { ref: electricalRepairRef, title: 'Electrical Repair' },
            { ref: installationRef, title: 'Installation' },
            { ref: smartHomeRef, title: 'Smart Home' },
          ];

          let activeSection = '';
          const headerOffset = 120;

          for (let i = sections.length - 1; i >= 0; i--) {
            const section = sections[i];
            if (section.ref.current) {
              const rect = section.ref.current.getBoundingClientRect();
              if (rect.top <= headerOffset + 50) {
                activeSection = section.title;
                break;
              }
            }
          }

          setCurrentSection(activeSection);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    const timeoutId = setTimeout(handleScroll, 300);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  const handleBack = () => {
    setIsExiting(true);
    window.scrollTo({ top: 0, behavior: 'instant' });
    // Delay navigation to let home page preload and render, then show it
    setTimeout(() => {
      navigate('/', { replace: true, state: { scrollToTop: true } });
    }, 300);
  };

  const handleSearch = () => {
    console.log('Search clicked');
  };

  const handleShare = () => {
    console.log('Share clicked');
  };

  const handleCategoryClick = (category) => {
    console.log('Category clicked:', category);
  };

  const handleAddClick = (service) => {
    const cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    
    const cartItem = {
      id: Date.now(),
      title: service.title || service.name || 'Service',
      price: parseInt(service.price?.replace(/,/g, '') || service.price || 0),
      serviceCount: 1,
      description: service.description || service.subtitle || service.title || 'Service',
      icon: service.icon || service.image || null,
      category: 'Electrician',
      originalPrice: service.originalPrice ? parseInt(service.originalPrice.replace(/,/g, '')) : null,
      rating: service.rating || null,
      reviews: service.reviews || null,
    };
    
    cartItems.push(cartItem);
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    setCartCount(cartItems.length);
    window.dispatchEvent(new Event('cartUpdated'));
    alert(`${service.title || 'Item'} added to cart!`);
  };

  const handleViewDetails = (service) => {
    console.log('View details clicked:', service);
  };

  const handleMenuClick = () => {
    setIsMenuModalOpen(true);
  };

  const handleMenuCategoryClick = (category) => {
    if (category.title === 'Electrical Repair') {
      electricalRepairRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (category.title === 'Installation') {
      installationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (category.title === 'Smart Home') {
      smartHomeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div 
      className={`min-h-screen bg-white pb-20 ${isExiting ? 'animate-slide-left' : 'animate-slide-right'}`}
      style={{ willChange: isExiting ? 'transform' : 'auto' }}
    >
      {/* Sticky Header - appears on scroll */}
      <ElectricianHeader
        onBack={handleBack}
        onSearch={handleSearch}
        onShare={handleShare}
        isVisible={showStickyHeader}
      />

      {/* Sticky Sub-heading - shows current section */}
      <StickySubHeading
        title={currentSection}
        isVisible={showStickyHeader && !!currentSection}
      />

      {/* Spacer to prevent layout shift when sticky header appears */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          showStickyHeader ? 'h-[57px]' : 'h-0'
        }`}
        aria-hidden="true"
      ></div>

      {/* Spacer for sticky sub-heading to prevent layout shift */}
      <div 
        className={`transition-all duration-300 ease-in-out ${
          showStickyHeader && currentSection ? 'h-10' : 'h-0'
        }`}
        aria-hidden="true"
      ></div>

      <main>
        <BannerSection
          onBack={handleBack}
          onSearch={handleSearch}
          onShare={handleShare}
          showStickyNav={showStickyHeader}
        />

        <RatingSection />

        <PaymentOffers />

        <ServiceCategoriesGrid
          onCategoryClick={handleCategoryClick}
        />

        <div ref={electricalRepairRef}>
          <ElectricalRepairSection
            onAddClick={handleAddClick}
            onViewDetails={handleViewDetails}
          />
        </div>

        <div ref={installationRef}>
          <InstallationSection
            onAddClick={handleAddClick}
            onViewDetails={handleViewDetails}
          />
        </div>

        <div ref={smartHomeRef}>
          <SmartHomeSection
            onAddClick={handleAddClick}
            onViewDetails={handleViewDetails}
          />
        </div>
      </main>

      {/* Compact Cart Summary - Fixed at bottom when cart has items */}
      {cartCount > 0 && (() => {
        const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
        const totalOriginalPrice = cartItems.reduce((sum, item) => sum + (item.originalPrice || item.price || 0), 0);
        
        return (
          <div className="fixed bottom-0 left-0 right-0 z-40 shadow-lg border-t border-gray-200 px-4 py-3 flex items-center justify-between" style={{ backgroundColor: '#f8f8f8' }}>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-lg font-medium text-black">₹{totalPrice.toLocaleString('en-IN')}</span>
                {totalOriginalPrice > totalPrice && (
                  <span className="text-sm text-gray-400 line-through">₹{totalOriginalPrice.toLocaleString('en-IN')}</span>
                )}
              </div>
            </div>
            <button
              onClick={() => navigate('/cart')}
              className="bg-brand text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-brand-hover transition-colors whitespace-nowrap"
              style={{ backgroundColor: '#00a6a6' }}
              onMouseEnter={(e) => e.target.style.backgroundColor = '#008a8a'}
              onMouseLeave={(e) => e.target.style.backgroundColor = '#00a6a6'}
            >
              View Cart
            </button>
          </div>
        );
      })()}

      {/* Floating Menu Button - Small at bottom */}
      <button
        onClick={handleMenuClick}
        className={`fixed ${cartCount > 0 ? 'bottom-20' : 'bottom-4'} left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full flex items-center gap-1.5 z-40 shadow-lg hover:bg-gray-800 transition-colors`}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
        <span className="text-sm font-medium">Menu</span>
      </button>

      {/* Menu Modal */}
      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        onCategoryClick={handleMenuCategoryClick}
      />
    </div>
  );
};

export default Electrician;

