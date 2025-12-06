import React from 'react';
import ServiceWithRatingCard from '../../../components/common/ServiceWithRatingCard';

const ServiceSectionWithRating = ({ title, subtitle, services, onSeeAllClick, onServiceClick, showTopBorder = true }) => {
  return (
    <div className="mb-6">
      {/* Title and Subtitle Section */}
      <div className="px-4 mb-5 flex items-center justify-between">
        <div>
          <h2 
            className="text-xl font-bold mb-1 text-black"
          >
            {title}
          </h2>
          {subtitle && (
            <p className="text-sm font-medium text-black">
              {subtitle}
            </p>
          )}
        </div>
        {onSeeAllClick && (
          <button
            onClick={onSeeAllClick}
            className="font-semibold text-sm px-4 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95"
            style={{ 
              color: '#00a6a6',
              backgroundColor: 'rgba(0, 166, 166, 0.08)',
              border: '1.5px solid rgba(0, 166, 166, 0.25)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 166, 166, 0.12)';
              e.target.style.borderColor = '#00a6a6';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = 'rgba(0, 166, 166, 0.08)';
              e.target.style.borderColor = 'rgba(0, 166, 166, 0.25)';
            }}
          >
            See all →
          </button>
        )}
      </div>

      {/* Horizontal Scrollable Service Cards */}
      <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
        {services.map((service) => (
          <ServiceWithRatingCard
            key={service.id}
            title={service.title}
            rating={service.rating}
            reviews={service.reviews}
            price={service.price}
            originalPrice={service.originalPrice}
            discount={service.discount}
            image={service.image}
            onClick={() => onServiceClick?.(service)}
          />
        ))}
      </div>
    </div>
  );
};

export default ServiceSectionWithRating;

