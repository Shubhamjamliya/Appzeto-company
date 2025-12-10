import React, { memo, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

const StickySubHeading = memo(({ title, isVisible }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isVisible || !title || title.trim() === '') {
    return null;
  }

  const subHeadingContent = (
    <div 
      style={{
        position: 'fixed',
        top: '57px',
        left: 0,
        right: 0,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '10px 16px',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        zIndex: 9998,
        opacity: 1,
        transform: 'translateY(0)',
        display: 'block',
        visibility: 'visible'
      }}
    >
      <h2 style={{ fontSize: '16px', fontWeight: 600, color: '#000000', margin: 0 }}>{title}</h2>
    </div>
  );

  return createPortal(subHeadingContent, document.body);
});

StickySubHeading.displayName = 'StickySubHeading';

export default StickySubHeading;

