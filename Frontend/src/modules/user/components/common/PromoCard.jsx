import React, { memo } from 'react';

const PromoCard = memo(({ title, subtitle, buttonText, image, onClick, className = '' }) => {
  return (
    <div 
      className="relative rounded-2xl overflow-hidden min-w-[280px] h-40 cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-[1.02] active:scale-95"
      style={{
        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.25), 0 4px 8px rgba(0, 0, 0, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)'
      }}
      onClick={onClick}
    >
      {/* Only Image */}
      {image ? (
        <img 
          src={image} 
          alt={title || 'Promo'} 
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          <span className="text-gray-400 text-sm">Image</span>
        </div>
      )}
    </div>
  );
});

PromoCard.displayName = 'PromoCard';

export default PromoCard;

