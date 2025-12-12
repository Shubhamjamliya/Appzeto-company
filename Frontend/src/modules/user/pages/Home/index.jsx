import React, { useState, useLayoutEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { themeColors } from '../../../../theme';
import Header from '../../components/layout/Header';
import BottomNav from '../../components/layout/BottomNav';
import SearchBar from './components/SearchBar';
import ServiceCategories from './components/ServiceCategories';
import PromoCarousel from './components/PromoCarousel';
import NewAndNoteworthy from './components/NewAndNoteworthy';
import MostBookedServices from './components/MostBookedServices';
import CuratedServices from './components/CuratedServices';
import ServiceSectionWithRating from './components/ServiceSectionWithRating';
import Banner from './components/Banner';
// Salon for Women Images
import salon1Image from '../../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-1.jpg';
import salon2Image from '../../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-2.jpg';
import salon3Image from '../../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-3.jpg';
import salon4Image from '../../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-4.jpg';
import salon5Image from '../../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-5.jpg';
import salon6Image from '../../../../assets/images/pages/Home/ServiceCategorySection/SalonForWomen/salon-6.jpg';
import ServiceCategorySection from './components/ServiceCategorySection';
import HomeRepairSection from './components/HomeRepairSection';
import BannerWithRefer from './components/BannerWithRefer';
import ACApplianceModal from './components/ACApplianceModal';
import CategoryModal from './components/CategoryModal';
import acRepairImage from '../../../../assets/images/pages/Home/ServiceCategorySection/ApplianceServices/ac-repair.jpg';
import washingMachineRepairImage from '../../../../assets/images/pages/Home/ServiceCategorySection/ApplianceServices/washing-machine-repair].jpg';
import waterHeaterRepairImage from '../../../../assets/images/pages/Home/ServiceCategorySection/ApplianceServices/water heater repair.jpg';
import refrigeratorRepairImage from '../../../../assets/images/pages/Home/ServiceCategorySection/ApplianceServices/refigrator-repair.jpg';
import homeWiringInstallationImage from '../../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/home-wiring.jpg';
import panelUpgradeRepairImage from '../../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/electrical-panel-upgrade.jpg';
import smartHomeSetupImage from '../../../../assets/images/pages/Home/ServiceCategorySection/ElectricalServices/smart home setup.jpg';
// Cleaning Essentials Images
import intenseBathroom2Image from '../../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/intense-bathroom-2.jpg';
import intenseBathroom3Image from '../../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/intense-bathroom-3.jpg';
import bathroomCleaningImage from '../../../../assets/images/pages/Home/ServiceCategorySection/CleaningEssentials/bathroom-cleaning.png';

// Move service data outside component to prevent recreation on every render
const ELECTRICAL_SERVICES = [
  {
    id: 1,
    title: 'Home Wiring Installation',
    image: homeWiringInstallationImage,
  },
  {
    id: 2,
    title: 'Panel Upgrade & Repair',
    image: panelUpgradeRepairImage,
  },
  {
    id: 3,
    title: 'Smart Home Setup',
    image: smartHomeSetupImage,
  },
];

const APPLIANCE_SERVICES = [
  {
    id: 1,
    title: 'AC Service and Repair',
    image: acRepairImage,
  },
  {
    id: 2,
    title: 'Washing Machine Repair',
    image: washingMachineRepairImage,
  },
  {
    id: 3,
    title: 'Water Heater Repair',
    image: waterHeaterRepairImage,
  },
  {
    id: 4,
    title: 'Refrigerator Repair',
    image: refrigeratorRepairImage,
  },
];

const SALON_SERVICES = [
  {
    id: 1,
    title: 'Roll-on waxing (Full arms, legs & underarms)',
    rating: '4.87',
    reviews: '47K',
    price: '799',
    image: salon1Image,
  },
  {
    id: 2,
    title: 'Spatula waxing (Full arms, legs & underarms)',
    rating: '4.86',
    reviews: '31K',
    price: '599',
    image: salon2Image,
  },
  {
    id: 3,
    title: 'Sara Lightening glow facial',
    rating: '4.84',
    reviews: '140K',
    price: '949',
    image: salon3Image,
  },
  {
    id: 4,
    title: 'Sara fruit cleanup',
    rating: '4.86',
    reviews: '147K',
    price: '699',
    image: salon4Image,
  },
  {
    id: 5,
    title: 'Elysian Firming Wine glow',
    rating: '4.85',
    reviews: '111K',
    price: '1,049',
    image: salon5Image,
  },
  {
    id: 6,
    title: 'Elysian British rose pedicure',
    rating: '4.83',
    reviews: '225K',
    price: '759',
    image: salon6Image,
  },
  {
    id: 7,
    title: 'Mani pedi combo',
    rating: '4.83',
    reviews: '327K',
    price: '1,309',
    originalPrice: '1,408',
    discount: '7%',
    image: salon6Image,
  },
];

const CLEANING_SERVICES = [
  {
    id: 1,
    title: 'Intense cleaning (2 bathrooms)',
    rating: '4.79',
    reviews: '3.7M',
    price: '950',
    originalPrice: '1,038',
    discount: '8%',
    image: intenseBathroom2Image,
  },
  {
    id: 2,
    title: 'Intense cleaning (3 bathrooms)',
    rating: '4.79',
    reviews: '3.7M',
    price: '1,381',
    originalPrice: '1,557',
    discount: '11%',
    image: intenseBathroom3Image,
  },
  {
    id: 3,
    title: 'Classic cleaning (2 bathrooms)',
    rating: '4.82',
    reviews: '1.5M',
    price: '785',
    originalPrice: '858',
    discount: '9%',
    image: bathroomCleaningImage,
  },
  {
    id: 4,
    title: 'Classic cleaning (3 bathrooms)',
    rating: '4.82',
    reviews: '1.5M',
    price: '1,141',
    originalPrice: '1,287',
    discount: '11%',
    image: bathroomCleaningImage,
  },
  {
    id: 5,
    title: 'Dining table & chairs cleaning',
    rating: '4.82',
    reviews: '57K',
    price: '299',
    image: bathroomCleaningImage,
  },
  {
    id: 6,
    title: 'Chimney cleaning',
    rating: '4.83',
    reviews: '109K',
    price: '599',
    image: bathroomCleaningImage,
  },
];

const CATEGORY_ROUTES = {
  'salon-women': '/user/salon-for-women',
  'cleaning-essentials': '/user/bathroom-kitchen-cleaning',
  'electrical': '/user/electrician',
  'appliance': '/user/ac-service',
  'home-repair': '/user/electrician',
};

const Home = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [address] = useState('New Palasia- Indore- Madhya Pradesh...');
  // Removed cartCount state - BottomNav already handles it, no need for duplicate listeners
  const [isACModalOpen, setIsACModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);

  // Optimized useLayoutEffect - only run on mount, handle scroll separately
  useLayoutEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    const bgStyle = themeColors.backgroundGradient;

    // Set background on all elements (only if not already set)
    const elements = [html, body, root].filter(Boolean);
    elements.forEach(el => {
      if (el.style.background !== bgStyle) {
        el.style.backgroundColor = '#ffffff';
        el.style.background = bgStyle;
      }
    });

    // Force immediate visibility (only if needed)
    if (body.style.opacity !== '1') {
      body.style.opacity = '1';
      body.style.visibility = 'visible';
    }

    return () => {
      // Cleanup not needed - background should persist
    };
  }, []); // Only run on mount

  // Handle scroll to top separately - only when needed
  useLayoutEffect(() => {
    if (location.state?.scrollToTop) {
      window.scrollTo({ top: 0, behavior: 'instant' });
      window.history.replaceState({}, '', location.pathname);
    }
  }, [location.state?.scrollToTop, location.pathname]);

  // Memoized handlers to prevent unnecessary re-renders
  const handleSearch = useCallback((query) => {
    // Navigate to search results page
  }, []);

  const handleCategoryClick = useCallback((category) => {
    // Show immediate feedback
    if (category.title === 'Electricity') {
      navigate('/user/electrician');
      return;
    }

    if (category.title === 'Massage for Men') {
      navigate('/user/massage-for-men');
      return;
    }

    // Open modal for AC & Appliance Repair
    if (category.title === 'AC & Appliance Repair') {
      setIsACModalOpen(true);
    } else {
      // Open modal for other categories - immediate
      setSelectedCategory(category);
      setIsCategoryModalOpen(true);
    }
  }, [navigate]);

  const handlePromoClick = useCallback((promo) => {
    if (promo.route) {
      if (promo.scrollToSection) {
        // Navigate to page and scroll to specific section
        navigate(promo.route, { 
          state: { scrollToSection: promo.scrollToSection } 
        });
      } else {
        // Navigate to page
        navigate(promo.route);
      }
    }
  }, [navigate]);

  const handleServiceClick = useCallback((service) => {
    if (!service || !service.title) return;
    
    const title = service.title.toLowerCase();
    
    // Map services to their respective pages
    if (title.includes('bathroom') || title.includes('kitchen cleaning') || title.includes('intense cleaning')) {
      navigate('/user/bathroom-kitchen-cleaning');
    } else if (title.includes('salon') || title.includes('spa') || title.includes('waxing') || title.includes('facial') || title.includes('cleanup') || title.includes('pedicure') || title.includes('mani pedi') || title.includes('hair studio')) {
      navigate('/user/salon-for-women');
    } else if (title.includes('massage')) {
      navigate('/user/massage-for-men');
    } else if (title.includes('sofa') || title.includes('carpet') || title.includes('professional sofa')) {
      navigate('/user/sofa-carpet-cleaning');
    } else if (title.includes('ac') || title.includes('appliance') || title.includes('water purifier') || title.includes('native')) {
      navigate('/user/ac-service');
    } else if (title.includes('drill') || title.includes('hang') || title.includes('tap repair') || title.includes('fan repair') || title.includes('switch') || title.includes('socket') || title.includes('electrical') || title.includes('wiring') || title.includes('doorbell') || title.includes('mcb') || title.includes('inverter') || title.includes('appliance')) {
      navigate('/user/electrician');
    }
  }, [navigate]);

  const handleBuyClick = useCallback(() => {
    // Navigate to product page or checkout
  }, []);

  const handleSeeAllClick = useCallback((category) => {
    const route = CATEGORY_ROUTES[category];
    if (route) {
      navigate(route);
    }
  }, [navigate]);

  const handleAddClick = useCallback((service) => {
    // Add service to cart
  }, []);

  const handleReferClick = useCallback(() => {
    navigate('/user/rewards');
  }, [navigate]);

  const handleLocationClick = useCallback(() => {
    // Open location selector modal
  }, []);

  const handleCartClick = useCallback(() => {
    // Navigate to cart page
  }, []);

  // Memoize service data to prevent recreation
  const electricalServices = useMemo(() => ELECTRICAL_SERVICES, []);
  const applianceServices = useMemo(() => APPLIANCE_SERVICES, []);
  const salonServices = useMemo(() => SALON_SERVICES, []);
  const cleaningServices = useMemo(() => CLEANING_SERVICES, []);


  return (
    <div
      className="min-h-screen pb-20"
      style={{
        willChange: 'auto',
        opacity: 1,
        visibility: 'visible',
        background: 'linear-gradient(to bottom, rgba(0, 166, 166, 0.03) 0%, rgba(41, 173, 129, 0.02) 10%, #ffffff 20%)',
        backgroundColor: '#ffffff',
        minHeight: '100vh',
        position: 'relative',
        zIndex: 1
      }}
    >
      <Header
        location={address}
        onLocationClick={handleLocationClick}
      />

      <main className="pt-0">
        {/* Complete Gradient Section: Header continuation, Search, Categories, and Carousel */}
        <div
          className="relative overflow-hidden"
          style={{
            background: themeColors.gradient
          }}
        >
          {/* Gradient overlay for depth */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              background: 'radial-gradient(circle at top right, rgba(255, 255, 255, 0.3), transparent 70%)'
            }}
          />

          <div className="relative z-10">
            <SearchBar
              onSearch={handleSearch}
            />

            <ServiceCategories
              onCategoryClick={handleCategoryClick}
              onSeeAllClick={() => {}}
            />

            <PromoCarousel
              onPromoClick={handlePromoClick}
            />
          </div>
        </div>

        <CuratedServices
          onServiceClick={handleServiceClick}
        />

        <NewAndNoteworthy
          onServiceClick={handleServiceClick}
        />

        <MostBookedServices
          onServiceClick={handleServiceClick}
        />

        <ServiceSectionWithRating
          title="Salon for Women"
          subtitle="Pamper yourself at home"
          services={salonServices}
          onSeeAllClick={() => handleSeeAllClick('salon-women')}
          onServiceClick={handleServiceClick}
        />

        <Banner
          onBuyClick={handleBuyClick}
        />

        <ServiceSectionWithRating
          title="Cleaning Essentials"
          subtitle="Monthly cleaning essential services"
          showTopBorder={false}
          services={cleaningServices}
          onSeeAllClick={() => handleSeeAllClick('cleaning-essentials')}
          onServiceClick={handleServiceClick}
        />

        <ServiceCategorySection
          title="Electrical Installation & Repair"
          services={electricalServices}
          onSeeAllClick={() => handleSeeAllClick('electrical')}
          onServiceClick={handleServiceClick}
        />

        <ServiceCategorySection
          title="Appliance repair & service"
          services={applianceServices}
          onSeeAllClick={() => handleSeeAllClick('appliance')}
          onServiceClick={handleServiceClick}
        />

        <HomeRepairSection
          onSeeAllClick={() => handleSeeAllClick('home-repair')}
          onServiceClick={handleServiceClick}
          onAddClick={handleAddClick}
        />

        <BannerWithRefer
          onBuyClick={handleBuyClick}
          onReferClick={handleReferClick}
        />
      </main>

      <BottomNav />

      {/* AC & Appliance Repair Modal */}
      <ACApplianceModal
        isOpen={isACModalOpen}
        onClose={useCallback(() => setIsACModalOpen(false), [])}
        location={address}
      />

      {/* Category Modal */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={useCallback(() => {
          setIsCategoryModalOpen(false);
          setSelectedCategory(null);
        }, [])}
        category={selectedCategory}
        location={address}
      />
    </div>
  );
};

// Memoize Home component to prevent unnecessary re-renders
export default React.memo(Home);

