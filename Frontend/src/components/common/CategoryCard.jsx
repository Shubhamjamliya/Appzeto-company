import React, { useState, useRef } from 'react';

const CategoryCard = ({ icon, title, onClick, hasSaleBadge = false, index = 0 }) => {
  const [ripples, setRipples] = useState([]);
  const cardRef = useRef(null);

  const handleClick = (e) => {
    if (onClick) {
      onClick();
    }
    
    // Create ripple effect
    const rect = cardRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      const newRipple = {
        id: Date.now(),
        x,
        y,
      };
      
      setRipples([...ripples, newRipple]);
      
      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
      }, 600);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center p-1.5 cursor-pointer relative category-card-container category-card-entrance"
      onClick={handleClick}
      style={{ 
        minWidth: 'fit-content', 
        width: '70px',
        animationDelay: `${index * 0.1}s`
      }}
      ref={cardRef}
    >
      <div 
        className="w-14 h-14 rounded-full flex items-center justify-center mb-1.5 relative backdrop-blur-md border flex-shrink-0 category-card-icon-wrapper"
        style={{ 
          backgroundColor: 'rgba(255, 255, 255, 0.7)',
          borderColor: '#F59E0B',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.05)'
        }}
      >
        {/* Ripple effects */}
        {ripples.map((ripple) => (
          <span
            key={ripple.id}
            className="category-card-ripple"
            style={{
              left: '50%',
              top: '50%',
              width: '56px',
              height: '56px',
              marginLeft: '-28px',
              marginTop: '-28px',
            }}
          />
        ))}
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
};

export default CategoryCard;

