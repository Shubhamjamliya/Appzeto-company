import React, { useRef, memo } from 'react';
import { createRipple } from '../../../../utils/gsapAnimations';

const CategoryCard = memo(({ icon, title, onClick, hasSaleBadge = false, index = 0 }) => {
  const cardRef = useRef(null);
  const iconWrapperRef = useRef(null);

  // Removed entrance animation for better performance - cards appear instantly

  // CSS-based hover animation (better performance)

  const handleClick = (e) => {
    // Immediate click response
    if (onClick) {
      onClick();
    }
    
    // Lightweight ripple effect (async, non-blocking)
    if (cardRef.current) {
      requestAnimationFrame(() => {
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        createRipple(cardRef.current, x, y);
      });
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center p-1.5 cursor-pointer relative category-card-container"
      onClick={handleClick}
      style={{ 
        minWidth: 'fit-content', 
        width: '70px',
      }}
      ref={cardRef}
    >
      <div 
        ref={iconWrapperRef}
        className="w-14 h-14 rounded-full flex items-center justify-center mb-1.5 relative backdrop-blur-md border flex-shrink-0 transition-transform duration-300 ease-out hover:scale-110 hover:rotate-3 active:scale-95"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderColor: '#F59E0B',
          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15), 0 4px 8px rgba(0, 0, 0, 0.1)',
          willChange: 'transform',
          backfaceVisibility: 'hidden',
          WebkitBackfaceVisibility: 'hidden',
        }}
      >
        {icon || (
          <svg
            className="w-7 h-7 text-gray-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {hasSaleBadge && (
          <div 
            className="absolute -top-0.5 -right-0.5 text-black text-[8px] font-bold px-1 py-0.5 rounded-full shadow-sm"
            style={{ 
              backgroundColor: '#fbfb00',
              border: '1px solid rgba(251, 251, 0, 0.5)',
              boxShadow: '0 1px 3px rgba(251, 251, 0, 0.4)'
            }}
          >
            Sale
          </div>
        )}
      </div>
      <span className="text-[10px] text-center text-gray-800 font-medium leading-tight break-words" style={{ wordWrap: 'break-word', maxWidth: '70px' }}>
        {title}
      </span>
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;

