import React, { memo, useCallback } from 'react';
import SimpleServiceCard from '../../../components/common/SimpleServiceCard';
import SectionHeader from '../../../components/common/SectionHeader';

const ServiceCategorySection = memo(({ title, services, onSeeAllClick, onServiceClick }) => {
  const handleServiceClick = useCallback((service) => {
    onServiceClick?.(service);
  }, [onServiceClick]);

  return (
    <div className="mb-6">
      <SectionHeader
        title={title}
        onSeeAllClick={onSeeAllClick}
      />

      {/* Horizontal Scrollable Service Cards */}
      <div className="flex gap-4 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {services.map((service) => (
          <SimpleServiceCard
            key={service.id}
            title={service.title}
            image={service.image}
            onClick={() => handleServiceClick(service)}
          />
        ))}
      </div>
    </div>
  );
});

ServiceCategorySection.displayName = 'ServiceCategorySection';

export default ServiceCategorySection;

