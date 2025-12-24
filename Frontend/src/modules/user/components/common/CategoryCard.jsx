import React, { useState, useRef, memo, useEffect } from 'react';
import { gsap } from 'gsap';
import { createRipple } from '../../../../utils/gsapAnimations';

const CategoryCard = memo(({ icon, title, onClick, hasSaleBadge = false, index = 0 }) => {
  const cardRef = useRef(null);

  // Simple entrance animation
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          delay: index * 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center justify-center p-1 cursor-pointer relative category-card-container group transition-transform duration-300 ease-out active:scale-95"
      onClick={onClick}
      style={{
        minWidth: 'fit-content',
        width: '76px',
        opacity: 0, // Start hidden for GSAP
      }}
    >
      <div
        className="w-[64px] h-[64px] rounded-[20px] flex items-center justify-center mb-2 relative bg-gradient-to-br from-white to-[#F0FDFA]/30 border border-white flex-shrink-0 transition-all duration-300 group-hover:border-[#CCFBF1] group-hover:shadow-md group-hover:scale-105"
        style={{
          boxShadow: '0 10px 30px -4px rgba(0, 166, 166, 0.08), 0 4px 12px -2px rgba(0, 0, 0, 0.02)',
        }}
      >
        {icon || (
          <svg
            className="w-7 h-7 text-gray-400 group-hover:text-[#00A6A6] transition-colors duration-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        )}
        {hasSaleBadge && (
          <div
            className="absolute -top-1.5 -right-1.5 bg-gradient-to-r from-[#00A6A6] to-[#008a8a] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-lg shadow-[#00A6A6]/30 z-10 border border-white"
          >
            SALE
          </div>
        )}
      </div>
      <span
        className="text-[11px] text-center text-gray-700 font-medium leading-snug tracking-tight group-hover:text-[#00A6A6] transition-colors duration-300"
        style={{
          wordWrap: 'break-word',
          maxWidth: '76px'
        }}
      >
        {title}
      </span>
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;

