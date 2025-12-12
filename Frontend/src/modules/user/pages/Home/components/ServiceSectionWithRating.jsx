import React, { useRef, useEffect, memo, useCallback } from 'react';
import { createOptimizedScrollAnimation, createOptimizedStaggerAnimation } from '../../../../../utils/optimizedScrollTrigger';
import ServiceWithRatingCard from '../../../components/common/ServiceWithRatingCard';
import SectionHeader from '../../../components/common/SectionHeader';

const ServiceSectionWithRating = memo(({ title, subtitle, services, onSeeAllClick, onServiceClick, showTopBorder = true }) => {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const cardsRef = useRef(null);

  const handleServiceClick = useCallback((service) => {
    onServiceClick?.(service);
  }, [onServiceClick]);

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
      <div ref={titleRef} style={{ opacity: 0 }}>
        <SectionHeader
          title={title}
          subtitle={subtitle}
          onSeeAllClick={onSeeAllClick}
          showSeeAll={!!onSeeAllClick}
        />
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
            onClick={() => handleServiceClick(service)}
          />
        ))}
      </div>
    </div>
  );
});

ServiceSectionWithRating.displayName = 'ServiceSectionWithRating';

export default ServiceSectionWithRating;

