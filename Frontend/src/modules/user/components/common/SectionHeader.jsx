import React, { memo } from 'react';
import { themeColors } from '../../../../theme';

const SectionHeader = memo(({ title, subtitle, onSeeAllClick, showSeeAll = true }) => {
  return (
    <div className="px-4 mb-5 flex items-center justify-between">
      <div>
        <h2 className="text-xl font-bold mb-1 text-black">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm font-medium text-black">
            {subtitle}
          </p>
        )}
      </div>
      {showSeeAll && onSeeAllClick && (
        <button
          onClick={onSeeAllClick}
          className="font-semibold text-sm px-4 py-1.5 rounded-full transition-all hover:scale-105 active:scale-95"
          style={{ 
            color: themeColors.button,
            backgroundColor: 'rgba(0, 166, 166, 0.08)',
            border: '1.5px solid rgba(0, 166, 166, 0.25)'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = 'rgba(0, 166, 166, 0.12)';
            e.target.style.borderColor = themeColors.button;
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
  );
});

SectionHeader.displayName = 'SectionHeader';

export default SectionHeader;

