import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import StickyHeader from '../../components/common/StickyHeader';
import StickySubHeading from '../../components/common/StickySubHeading';
import BannerSection from '../../components/common/BannerSection';
import RatingSection from '../../components/common/RatingSection';
import PaymentOffers from '../../components/common/PaymentOffers';
import ServiceCategoriesGrid from '../../components/common/ServiceCategoriesGrid';
import MenuModal from '../../components/common/MenuModal';
import ElectricalRepairSection from './components/ElectricalRepairSection';
import InstallationSection from './components/InstallationSection';
import SmartHomeSection from './components/SmartHomeSection';
import homeWiring from '../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/home-wiring.jpg';
import electricalPanel from '../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/electrical-panel-upgrade.jpg';
import smartHomeSetup from '../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/smart home setup.jpg';
import electricianIcon from '../../assets/images/icons/services/electrician.png';

const Electrician = () => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [showStickyHeader, setShowStickyHeader] = useState(false);
  const [currentSection, setCurrentSection] = useState('');
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  // Refs for sections
  const bannerRef = useRef(null);
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
          if (bannerRef.current) {
            const rect = bannerRef.current.getBoundingClientRect();
            const shouldShowHeader = rect.bottom <= 0;

            setShowStickyHeader(shouldShowHeader);

            if (shouldShowHeader) {
              const sections = [
                { ref: electricalRepairRef, title: 'Electrical Repair' },
                { ref: installationRef, title: 'Installation' },
                { ref: smartHomeRef, title: 'Smart Home' },
              ];

              const headerOffset = 57;
              let activeSection = '';

              for (let i = sections.length - 1; i >= 0; i--) {
                const section = sections[i];
                if (section.ref.current) {
                  const sectionRect = section.ref.current.getBoundingClientRect();
                  if (sectionRect.top <= headerOffset + 50) {
                    activeSection = section.title;
                    break;
                  }
                }
              }

              setCurrentSection(activeSection);
            } else {
              setCurrentSection('');
            }
          }
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
  };

  const handleShare = () => {
  };

  const handleCategoryClick = (category) => {
    // Scroll to the corresponding section on the same page
    if (category.title === 'Electrical Repair') {
      electricalRepairRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (category.title === 'Installation') {
      installationRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (category.title === 'Smart Home') {
      smartHomeRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
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
      className={`min-h-screen bg-white pb-20 ${isExiting ? 'animate-page-exit' : 'animate-page-enter'}`}
      style={{ willChange: isExiting ? 'transform' : 'auto' }}
    >
      {/* Sticky Header - appears on scroll */}
      <StickyHeader
        title="Electrician Services"
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
        className={`transition-all duration-300 ease-in-out ${showStickyHeader ? 'h-[57px]' : 'h-0'
          }`}
        aria-hidden="true"
      ></div>

      {/* Spacer for sticky sub-heading to prevent layout shift */}
      <div
        className={`transition-all duration-300 ease-in-out ${showStickyHeader && currentSection ? 'h-10' : 'h-0'
          }`}
        aria-hidden="true"
      ></div>

      <main>
        <BannerSection
          ref={bannerRef}
          banners={[
            { id: 1, image: homeWiring, text: 'Professional electrical services' },
            { id: 2, image: electricalPanel, text: 'Expert electricians at your service' },
            { id: 3, image: smartHomeSetup, text: 'Safe and reliable solutions' },
          ]}
          onBack={handleBack}
          onSearch={handleSearch}
          onShare={handleShare}
          showStickyNav={showStickyHeader}
        />

        <RatingSection
          rating="4.82"
          bookings="1.2 M bookings"
          showBorder={true}
        />

        <PaymentOffers />

        <ServiceCategoriesGrid
          categories={[
            { id: 1, title: 'Electrical Repair', image: electricianIcon },
            { id: 2, title: 'Installation', image: homeWiring },
            { id: 3, title: 'Smart Home', image: smartHomeSetup },
          ]}
          onCategoryClick={handleCategoryClick}
          layout="scroll"
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

      {/* Compact Cart Summary - Fixed at bottom when cart has items (via Portal) */}
      {cartCount > 0 && createPortal(
        (() => {
          const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
          const totalOriginalPrice = cartItems.reduce((sum, item) => sum + (item.originalPrice || item.price || 0), 0);

          return (
            <div
              style={{
                position: 'fixed',
                left: '0px',
                right: '0px',
                bottom: '70px',
                top: 'auto',
                backgroundColor: '#f8f8f8',
                boxShadow: '0 -2px 8px rgba(0, 0, 0, 0.1)',
                borderTop: '1px solid #e5e7eb',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                zIndex: 49,
                width: '100%',
                margin: 0,
                boxSizing: 'border-box',
                height: 'auto'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '18px', fontWeight: '500', color: '#000000' }}>₹{totalPrice.toLocaleString('en-IN')}</span>
                  {totalOriginalPrice > totalPrice && (
                    <span style={{ fontSize: '14px', color: '#9ca3af', textDecoration: 'line-through' }}>₹{totalOriginalPrice.toLocaleString('en-IN')}</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => navigate('/cart')}
                style={{
                  backgroundColor: '#00a6a6',
                  color: '#ffffff',
                  padding: '10px 24px',
                  borderRadius: '8px',
                  fontSize: '14px',
                  fontWeight: '500',
                  border: 'none',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#008a8a'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#00a6a6'}
              >
                View Cart
              </button>
            </div>
          );
        })(),
        document.body
      )}

      {/* Floating Menu Button - Fixed at bottomest (via Portal) */}
      {createPortal(
        <button
          onClick={handleMenuClick}
          style={{
            position: 'fixed',
            left: '50%',
            transform: 'translateX(-50%)',
            bottom: cartCount > 0 ? '130px' : '75px',
            top: 'auto',
            backgroundColor: '#000000',
            color: '#ffffff',
            padding: '8px 16px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            border: 'none',
            cursor: 'pointer',
            zIndex: 49,
            margin: 0,
            height: 'auto',
            width: 'auto'
          }}
          onMouseEnter={(e) => e.target.style.backgroundColor = '#1f2937'}
          onMouseLeave={(e) => e.target.style.backgroundColor = '#000000'}
        >
          <svg style={{ width: '16px', height: '16px' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span style={{ fontSize: '14px', fontWeight: '500' }}>Menu</span>
        </button>,
        document.body
      )}

      {/* Menu Modal */}
      <MenuModal
        isOpen={isMenuModalOpen}
        onClose={() => setIsMenuModalOpen(false)}
        onCategoryClick={handleMenuCategoryClick}
        categories={[
          { id: 1, title: 'Electrical Repair', image: electricianIcon },
          { id: 2, title: 'Installation', image: homeWiring },
          { id: 3, title: 'Smart Home', image: smartHomeSetup },
        ]}
      />
    </div>
  );
};

export default Electrician;

