import React, { memo } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { themeColors } from '../../../../theme';

const ServiceWithRatingCard = memo(({ image, title, rating, reviews, price, originalPrice, discount, onClick, onAddClick }) => {
  return (
    <div
      className="min-w-[180px] w-[180px] bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 group"
      style={{
        boxShadow: '0 8px 25px -5px rgba(0, 0, 0, 0.05), 0 2px 10px -3px rgba(0, 0, 0, 0.01)',
        border: '1px solid rgba(229, 231, 235, 0.4)'
      }}
      onClick={onClick}
    >
      <div className="relative">
        {discount && (
          <div
            className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10"
            style={{ backgroundColor: '#00A6A6' }}
          >
            {discount} OFF
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
            <svg
              className="w-12 h-12 text-[#00A6A6]/30"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="text-[13px] font-semibold text-gray-900 leading-snug mb-1 line-clamp-2 min-h-[40px]">{title}</h3>
        {rating && (
          <div className="flex items-center gap-1 mb-2">
            <AiFillStar className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-gray-900 font-bold">{rating}</span>
            {reviews && (
              <span className="text-[10px] text-gray-500">({reviews})</span>
            )}
          </div>
        )}
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold text-gray-900">
                {price && !isNaN(price.toString().replace(/[,]/g, '')) ? `₹${price}` : (price || 'Contact for price')}
              </span>
              {originalPrice && (
                <span className="text-[11px] text-gray-400 line-through decoration-gray-400/60">₹{originalPrice}</span>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.();
            }}
            className="px-5 py-1.5 h-8 rounded-lg text-xs font-bold bg-[#F0FDFA] text-[#00A6A6] hover:bg-[#00A6A6] hover:text-white active:scale-95 transition-all"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
});

ServiceWithRatingCard.displayName = 'ServiceWithRatingCard';

export default ServiceWithRatingCard;

