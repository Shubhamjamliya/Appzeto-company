import React, { memo, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { AiFillStar } from 'react-icons/ai';
import { themeColors } from '../../../../theme';

const DetailedServiceCard = memo(({ image, title, rating, reviews, price, originalPrice, discount, onClick, onAddClick }) => {
  const cardRef = useRef(null);

  // Format price (remove non-digits, then format)
  const formatPrice = (p) => {
    if (!p) return null;
    const clean = p.toString().replace(/[^0-9]/g, '');
    return new Intl.NumberFormat('en-IN').format(clean);
  };

  const displayPrice = formatPrice(price);
  const displayOriginalPrice = formatPrice(originalPrice);

  useEffect(() => {
    if (cardRef.current) {
      const card = cardRef.current;

      const handleMouseEnter = () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          boxShadow: '0 12px 24px rgba(59, 130, 246, 0.15), 0 6px 12px rgba(59, 130, 246, 0.1)',
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleMouseLeave = () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          duration: 0.3,
          ease: 'power2.out',
        });
      };

      const handleClick = () => {
        gsap.to(card, {
          scale: 0.95,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: 'power2.out',
        });
      };

      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      card.addEventListener('click', handleClick);

      return () => {
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
        card.removeEventListener('click', handleClick);
      };
    }
  }, []);

  return (
    <div
      ref={cardRef}
      className="min-w-[200px] flex flex-col bg-white rounded-2xl overflow-hidden cursor-pointer group"
      style={{
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(229, 231, 235, 0.5)'
      }}
      onClick={onClick}
    >
      <div className="relative">
        {discount && (
          <div
            className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10"
            style={{ backgroundColor: '#00A6A6' }}
          >
            {discount.toString().toUpperCase().includes('OFF') ? discount : `${discount}% OFF`}
          </div>
        )}
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-36 bg-[#F0FDFA] flex items-center justify-center">
            <span className="text-[#00A6A6] font-medium">No Image</span>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <h3 className="text-[13px] font-semibold text-gray-900 leading-snug mb-1 line-clamp-2 min-h-[40px]">{title}</h3>

        <div className="flex items-center gap-1 mb-2">
          <AiFillStar className="w-3.5 h-3.5 text-yellow-400" />
          <span className="text-xs text-gray-900 font-bold">{rating}</span>
          {reviews && (
            <span className="text-[10px] text-gray-500">({reviews})</span>
          )}
        </div>

        <div className="flex items-center gap-2 mt-auto">
          {displayOriginalPrice && (
            <span className="text-[10px] text-gray-400 line-through">₹{displayOriginalPrice}</span>
          )}
          <span className="text-[14px] font-bold text-gray-900">₹{displayPrice}</span>

          <button className="ml-auto text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#F0FDFA] text-[#00A6A6] group-hover:bg-[#00A6A6] group-hover:text-white transition-colors">
            Book
          </button>
        </div>
      </div>
    </div>
  );
});

DetailedServiceCard.displayName = 'DetailedServiceCard';

export default DetailedServiceCard;

