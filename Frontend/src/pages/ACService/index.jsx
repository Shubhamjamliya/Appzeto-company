import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../../components/layout/BottomNav';
import ACServiceHeader from './components/ACServiceHeader';
import RatingSection from './components/RatingSection';
import PromoCards from './components/PromoCards';
import CategoryCards from './components/CategoryCards';
import SuperSaverPackages from './components/SuperSaverPackages';
import ServiceSection from './components/ServiceSection';
import RepairGasRefillSection from './components/RepairGasRefillSection';
import InstallationSection from './components/InstallationSection';

const ACService = () => {
  const navigate = useNavigate();
  const [isExiting, setIsExiting] = useState(false);

  const handleBack = () => {
    setIsExiting(true);
    // Reset scroll position first
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
  };

  const handleServiceClick = (service) => {
  };

  const handleAddClick = (service) => {
  };

  const handleViewDetails = (service) => {
  };

  return (
    <div 
      className={`min-h-screen bg-white pb-20 ${isExiting ? 'animate-page-exit' : 'animate-page-enter'}`}
      style={{ willChange: isExiting ? 'transform' : 'auto' }}
    >
      <ACServiceHeader
        onBack={handleBack}
        onSearch={handleSearch}
        onShare={handleShare}
      />
      
      <main className="pt-1">
        <RatingSection />
        <PromoCards />
        <CategoryCards onCategoryClick={handleCategoryClick} />
        <SuperSaverPackages
          onViewDetails={handleViewDetails}
          onAddClick={handleAddClick}
        />
        <ServiceSection
          onViewDetails={handleViewDetails}
          onAddClick={handleAddClick}
        />
        <RepairGasRefillSection
          onViewDetails={handleViewDetails}
          onAddClick={handleAddClick}
        />
        <InstallationSection
          onViewDetails={handleViewDetails}
          onAddClick={handleAddClick}
        />
      </main>

      <BottomNav />
    </div>
  );
};

export default ACService;

