import React, { useRef, useEffect } from 'react';
import { createOptimizedScrollAnimation, createOptimizedStaggerAnimation } from '../../../utils/optimizedScrollTrigger';
import ServiceWithRatingCard from '../../../components/common/ServiceWithRatingCard';

const ServiceSectionWithRating = ({ title, subtitle, services, onSeeAllClick, onServiceClick, showTopBorder = true }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  // Optimized GSAP scroll animations
  useEffect(() => {
    if (!sectionRef.current || !titleRef.current || !cardsRef.current) return;

    const cards = Array.from(cardsRef.current.children);
    if (cards.length === 0) return;

    const cleanupFunctions = [];

    // Animate title
    const titleCleanup = createOptimizedScrollAnimation(
      titleRef.current,
      {
        from: { y: 30, opacity: 0 },
        to: { y: 0, opacity: 1 },
        duration: 0.6,
        ease: 'power2.out',
      },
      { rootMargin: '100px' }
    );
    if (titleCleanup) cleanupFunctions.push(titleCleanup);

    // Stagger animate cards
    const cardsCleanup = createOptimizedStaggerAnimation(
      cards,
      {
        from: { x: 50, opacity: 0, scale: 0.9 },
        to: { x: 0, opacity: 1, scale: 1 },
        duration: 0.5,
        stagger: 0.08,
        ease: 'back.out(1.7)',
      },
      { rootMargin: '150px' }
    );
    if (cardsCleanup) cleanupFunctions.push(cardsCleanup);

    return () => {
      cleanupFunctions.forEach(cleanup => cleanup?.());
    };
  }, [services]);

  return (
    <div ref={sectionRef} className="mb-6">
      {/* Title and Subtitle Section */}
      <div ref={titleRef} className="px-4 mb-5 flex items-center justify-between" style={{ opacity: 0 }}>
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
      <div ref={cardsRef} className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-hide">
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

