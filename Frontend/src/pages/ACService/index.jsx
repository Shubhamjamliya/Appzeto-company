import React from 'react';
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

  const handleBack = () => {
    navigate(-1);
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

  const handleServiceClick = (service) => {
    console.log('Service clicked:', service);
  };

  const handleAddClick = (service) => {
    console.log('Add clicked:', service);
  };

  const handleViewDetails = (service) => {
    console.log('View details clicked:', service);
  };

  return (
    <div className="min-h-screen bg-white pb-20">
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

